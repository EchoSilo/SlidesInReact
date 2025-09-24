/**
 * SlideValidator Class
 * Validates individual slides for quality, readability, and cognitive load
 * Part of the multi-level validation approach
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import { Slide } from '@/lib/types'
import { SlideOutline } from '@/lib/types/outline'
import { WorkflowLogger } from '@/lib/workflow-logger'

export interface SlideValidationFeedback {
  overallScore: number
  contentQuality: {
    score: number
    feedback: string
    issues?: string[]
  }
  readability: {
    score: number
    feedback: string
    cognitiveLoad: 'low' | 'medium' | 'high'
    wordCount?: number
  }
  visualHierarchy: {
    score: number
    feedback: string
    suggestions?: string[]
  }
  alignmentWithPurpose: {
    score: number
    feedback: string
    meetsObjective: boolean
  }
  improvements?: string[]
  mustFix?: string[]
}

export interface SlideValidationConfig {
  minScore?: number
  checkReadability?: boolean
  checkCognitiveLoad?: boolean
  checkVisualHierarchy?: boolean
  checkAlignment?: boolean
  strictMode?: boolean
}

export class SlideValidator {
  private anthropicClient: Anthropic | null = null
  private logger?: WorkflowLogger
  private config: SlideValidationConfig

  constructor(
    apiKey?: string,
    config?: SlideValidationConfig,
    logger?: WorkflowLogger
  ) {
    if (apiKey) {
      this.anthropicClient = createAnthropicClient(apiKey)
    }
    this.config = {
      minScore: 70,
      checkReadability: true,
      checkCognitiveLoad: true,
      checkVisualHierarchy: true,
      checkAlignment: true,
      strictMode: false,
      ...config
    }
    this.logger = logger
  }

  /**
   * Validate a single slide with LLM
   */
  async validateSlide(
    slide: Slide,
    slideOutline: SlideOutline,
    presentationTitle: string
  ): Promise<SlideValidationFeedback> {
    if (!this.anthropicClient) {
      // Fallback to quick validation if no API key
      return this.quickValidate(slide, slideOutline)
    }

    const startTime = Date.now()

    try {
      const prompt = this.createValidationPrompt(slide, slideOutline, presentationTitle)
      const modelConfig = ModelConfigs.validation()

      if (this.logger) {
        this.logger.llmRequest(
          'SLIDE_VALIDATION',
          `Validating slide ${slide.id}: ${slide.title}`,
          modelConfig.model,
          { slide_type: slide.type, slide_number: slideOutline.slideNumber }
        )
      }

      const response = await this.anthropicClient.messages.create({
        model: modelConfig.model,
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const duration = Date.now() - startTime

      if (this.logger) {
        this.logger.llmResponse('SLIDE_VALIDATION', response, duration)
      }

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      const feedback = this.parseValidationResponse(content.text)

      if (this.logger) {
        this.logger.info('SLIDE_VALIDATION', 'Slide validation completed', {
          slide_id: slide.id,
          overall_score: feedback.overallScore,
          content_quality: feedback.contentQuality.score,
          readability: feedback.readability.score
        })
      }

      return feedback

    } catch (error) {
      if (this.logger) {
        this.logger.warning('SLIDE_VALIDATION', 'LLM validation failed, using quick validation', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      return this.quickValidate(slide, slideOutline)
    }
  }

  /**
   * Quick validation without LLM
   */
  quickValidate(slide: Slide, slideOutline: SlideOutline): SlideValidationFeedback {
    const feedback: SlideValidationFeedback = {
      overallScore: 100,
      contentQuality: {
        score: 100,
        feedback: 'Content appears complete'
      },
      readability: {
        score: 100,
        feedback: 'Readable structure',
        cognitiveLoad: 'medium'
      },
      visualHierarchy: {
        score: 100,
        feedback: 'Standard layout'
      },
      alignmentWithPurpose: {
        score: 100,
        feedback: 'Matches slide type',
        meetsObjective: true
      }
    }

    const issues: string[] = []
    const improvements: string[] = []

    // Check content completeness
    if (!slide.content || Object.keys(slide.content).length === 0) {
      feedback.contentQuality.score -= 30
      issues.push('Slide content is empty')
    }

    // Check title
    if (!slide.title || slide.title.length < 3) {
      feedback.contentQuality.score -= 20
      issues.push('Missing or inadequate title')
    }

    // Check cognitive load based on content
    const cognitiveLoad = this.assessCognitiveLoad(slide)
    feedback.readability.cognitiveLoad = cognitiveLoad
    if (cognitiveLoad === 'high') {
      feedback.readability.score -= 20
      improvements.push('Consider breaking down complex content')
    }

    // Check slide type alignment
    if (slide.type !== slideOutline.type) {
      feedback.alignmentWithPurpose.score -= 30
      feedback.alignmentWithPurpose.meetsObjective = false
      issues.push(`Slide type mismatch: expected ${slideOutline.type}, got ${slide.type}`)
    }

    // Check for required fields based on slide type
    const missingFields = this.checkRequiredFields(slide)
    if (missingFields.length > 0) {
      feedback.contentQuality.score -= 10 * missingFields.length
      feedback.contentQuality.issues = missingFields
    }

    // Calculate overall score
    feedback.overallScore = Math.round(
      (feedback.contentQuality.score +
       feedback.readability.score +
       feedback.visualHierarchy.score +
       feedback.alignmentWithPurpose.score) / 4
    )

    if (issues.length > 0) {
      feedback.mustFix = issues
    }
    if (improvements.length > 0) {
      feedback.improvements = improvements
    }

    return feedback
  }

  /**
   * Create validation prompt
   */
  private createValidationPrompt(
    slide: Slide,
    slideOutline: SlideOutline,
    presentationTitle: string
  ): string {
    return `You are a presentation quality expert. Evaluate this individual slide.

PRESENTATION CONTEXT:
Title: ${presentationTitle}
Slide ${slideOutline.slideNumber}: ${slideOutline.title}
Purpose: ${slideOutline.purpose}
Type: ${slideOutline.type}

SLIDE CONTENT TO VALIDATE:
${JSON.stringify(slide, null, 2)}

EVALUATION CRITERIA:
1. Content Quality: Is the content complete, accurate, and valuable?
2. Readability: Is the slide easy to read and understand?
3. Cognitive Load: Can the audience process this information easily?
4. Visual Hierarchy: Is the information well-organized?
5. Purpose Alignment: Does it fulfill its intended purpose?

Assess cognitive load using the 7±2 rule (5-9 items max).

CRITICAL: Respond with ONLY valid JSON.

{
  "overallScore": [0-100],
  "contentQuality": {
    "score": [0-100],
    "feedback": "Assessment of content",
    "issues": ["Issue 1", "Issue 2"]
  },
  "readability": {
    "score": [0-100],
    "feedback": "Readability assessment",
    "cognitiveLoad": "low|medium|high",
    "wordCount": [number]
  },
  "visualHierarchy": {
    "score": [0-100],
    "feedback": "Visual organization assessment",
    "suggestions": ["Suggestion 1"]
  },
  "alignmentWithPurpose": {
    "score": [0-100],
    "feedback": "How well it meets its purpose",
    "meetsObjective": true|false
  },
  "improvements": ["Improvement 1", "Improvement 2"],
  "mustFix": ["Critical issue 1"]
}`
  }

  /**
   * Parse validation response
   */
  private parseValidationResponse(responseText: string): SlideValidationFeedback {
    try {
      let jsonStr = responseText.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      const feedback = JSON.parse(jsonStr)

      // Ensure all required fields
      if (!feedback.overallScore) {
        throw new Error('Invalid validation response structure')
      }

      return feedback as SlideValidationFeedback

    } catch (error) {
      if (this.logger) {
        this.logger.warning('SLIDE_VALIDATION', 'Failed to parse validation response', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      return this.getDefaultFeedback()
    }
  }

  /**
   * Assess cognitive load of a slide
   */
  private assessCognitiveLoad(slide: Slide): 'low' | 'medium' | 'high' {
    let itemCount = 0

    // Count different content elements
    if (slide.content) {
      if (slide.content.bulletPoints) {
        itemCount += slide.content.bulletPoints.length
      }
      if (slide.content.sections) {
        itemCount += slide.content.sections.length * 2 // sections are more complex
      }
      if (slide.content.keyMetrics) {
        itemCount += slide.content.keyMetrics.length
      }
      if (slide.content.chart) {
        itemCount += 3 // charts add complexity
      }
      if (slide.content.table) {
        itemCount += 4 // tables are complex
      }
    }

    if (itemCount <= 5) return 'low'
    if (itemCount <= 9) return 'medium'
    return 'high'
  }

  /**
   * Check for required fields based on slide type
   */
  private checkRequiredFields(slide: Slide): string[] {
    const missing: string[] = []

    // Basic checks for all slides
    if (!slide.title) missing.push('Missing slide title')
    if (!slide.content) missing.push('Missing slide content')

    // Type-specific checks
    switch (slide.type) {
      case 'problem':
        if (!slide.content?.sections && !slide.content?.bulletPoints) {
          missing.push('Problem slide needs sections or bullet points')
        }
        break

      case 'solution':
        if (!slide.content?.sections) {
          missing.push('Solution slide needs sections')
        }
        break

      case 'benefits':
        if (!slide.content?.keyMetrics && !slide.content?.bulletPoints) {
          missing.push('Benefits slide needs metrics or bullet points')
        }
        break

      case 'implementation':
        if (!slide.content?.timeline && !slide.content?.sections) {
          missing.push('Implementation slide needs timeline or sections')
        }
        break

      case 'conclusion':
        if (!slide.content?.bulletPoints) {
          missing.push('Conclusion slide needs bullet points')
        }
        break
    }

    return missing
  }

  /**
   * Get default feedback when validation fails
   */
  private getDefaultFeedback(): SlideValidationFeedback {
    return {
      overallScore: 50,
      contentQuality: {
        score: 50,
        feedback: 'Unable to validate content quality'
      },
      readability: {
        score: 50,
        feedback: 'Unable to validate readability',
        cognitiveLoad: 'medium'
      },
      visualHierarchy: {
        score: 50,
        feedback: 'Unable to validate visual hierarchy'
      },
      alignmentWithPurpose: {
        score: 50,
        feedback: 'Unable to validate alignment',
        meetsObjective: false
      }
    }
  }

  /**
   * Check if slide meets quality threshold
   */
  meetsQualityThreshold(feedback: SlideValidationFeedback): boolean {
    return feedback.overallScore >= (this.config.minScore || 70) &&
           !feedback.mustFix?.length
  }
}