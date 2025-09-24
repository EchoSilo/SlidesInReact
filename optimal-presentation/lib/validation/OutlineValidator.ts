/**
 * OutlineValidator Class
 * Validates presentation outlines for structure, flow, and framework alignment
 * Part of the multi-level validation approach
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import {
  PresentationOutline,
  OutlineValidationFeedback,
  OutlineValidationConfig,
  OutlineGenerationRequest
} from '@/lib/types/outline'
import { Framework } from './supportedFrameworks'
import { WorkflowLogger } from '@/lib/workflow-logger'

export class OutlineValidator {
  private anthropicClient: Anthropic
  private logger?: WorkflowLogger
  private config: OutlineValidationConfig

  constructor(
    apiKey: string,
    config?: OutlineValidationConfig,
    logger?: WorkflowLogger
  ) {
    this.anthropicClient = createAnthropicClient(apiKey)
    this.config = {
      minScore: 70,
      requireFrameworkAlignment: true,
      checkLogicalFlow: true,
      checkAudienceSuitability: true,
      checkCompleteness: true,
      ...config
    }
    this.logger = logger
  }

  /**
   * Main validation method
   */
  async validateOutline(
    outline: PresentationOutline,
    request: OutlineGenerationRequest,
    framework: Framework
  ): Promise<OutlineValidationFeedback> {
    const startTime = Date.now()

    try {
      // Create validation prompt
      const prompt = this.createValidationPrompt(outline, request, framework)

      // Get model configuration for validation
      const modelConfig = ModelConfigs.validation() // Using validation tokens (512)

      if (this.logger) {
        this.logger.llmRequest(
          'OUTLINE_VALIDATION',
          `Validating presentation outline: ${outline.title}`,
          modelConfig.model,
          { task: 'outline_validation', framework: framework.name }
        )
      }

      // Call Claude API for validation
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
        this.logger.llmResponse('OUTLINE_VALIDATION', response, duration)
      }

      // Extract and parse the response
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parse validation feedback
      const feedback = this.parseValidationResponse(content.text)

      if (this.logger) {
        this.logger.success('OUTLINE_VALIDATION', 'Outline validation completed', {
          overall_score: feedback.overallScore,
          framework_alignment: feedback.frameworkAlignment.score,
          logical_flow: feedback.logicalFlow.score,
          audience_suitability: feedback.audienceSuitability.score
        })
      }

      return feedback

    } catch (error) {
      if (this.logger) {
        this.logger.error('OUTLINE_VALIDATION', 'Failed to validate outline', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }

      // Return default low scores on error
      return this.getDefaultFeedback()
    }
  }

  /**
   * Create validation prompt
   */
  private createValidationPrompt(
    outline: PresentationOutline,
    request: OutlineGenerationRequest,
    framework: Framework
  ): string {
    return `You are a presentation structure expert. Evaluate this presentation outline.

ORIGINAL REQUEST:
- Topic: ${request.prompt}
- Type: ${request.presentation_type}
- Audience: ${request.audience || 'General business audience'}
- Slides: ${request.slide_count}

FRAMEWORK REQUIREMENT: ${framework.name}
${framework.description}

OUTLINE TO VALIDATE:
${JSON.stringify(outline, null, 2)}

EVALUATION CRITERIA:
1. Framework Alignment: Does the outline follow the ${framework.name} structure?
2. Logical Flow: Is the progression of slides logical and coherent?
3. Audience Suitability: Is the structure appropriate for the target audience?
4. Completeness: Are all necessary elements present?

Provide a detailed evaluation with scores (0-100) for each criterion.

CRITICAL: Respond with ONLY valid JSON.

{
  "overallScore": [0-100],
  "frameworkAlignment": {
    "score": [0-100],
    "feedback": "How well it follows ${framework.name}"
  },
  "logicalFlow": {
    "score": [0-100],
    "feedback": "Assessment of slide progression",
    "suggestions": ["Improvement 1", "Improvement 2"]
  },
  "audienceSuitability": {
    "score": [0-100],
    "feedback": "How appropriate for target audience"
  },
  "completeness": {
    "score": [0-100],
    "missingElements": ["Missing element 1"]
  },
  "recommendations": ["Overall recommendation 1", "Overall recommendation 2"]
}`
  }

  /**
   * Parse validation response
   */
  private parseValidationResponse(responseText: string): OutlineValidationFeedback {
    try {
      // Clean the response
      let jsonStr = responseText.trim()

      // Remove markdown if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      const feedback = JSON.parse(jsonStr)

      // Validate the structure
      if (!feedback.overallScore || !feedback.frameworkAlignment) {
        throw new Error('Invalid validation response structure')
      }

      return feedback as OutlineValidationFeedback

    } catch (error) {
      if (this.logger) {
        this.logger.warning('OUTLINE_VALIDATION', 'Failed to parse validation response, using defaults', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      return this.getDefaultFeedback()
    }
  }

  /**
   * Get default feedback when validation fails
   */
  private getDefaultFeedback(): OutlineValidationFeedback {
    return {
      overallScore: 50,
      frameworkAlignment: {
        score: 50,
        feedback: 'Unable to validate framework alignment'
      },
      logicalFlow: {
        score: 50,
        feedback: 'Unable to validate logical flow'
      },
      audienceSuitability: {
        score: 50,
        feedback: 'Unable to validate audience suitability'
      },
      completeness: {
        score: 50
      }
    }
  }

  /**
   * Quick validation without LLM call
   */
  quickValidate(
    outline: PresentationOutline,
    request: OutlineGenerationRequest
  ): OutlineValidationFeedback {
    const feedback: OutlineValidationFeedback = {
      overallScore: 100,
      frameworkAlignment: { score: 100, feedback: 'Structure appears valid' },
      logicalFlow: { score: 100, feedback: 'Flow appears logical' },
      audienceSuitability: { score: 100, feedback: 'Suitable for audience' },
      completeness: { score: 100 }
    }

    // Check slide count
    if (outline.slides.length !== parseInt(request.slide_count)) {
      feedback.completeness.score -= 20
      feedback.completeness.missingElements = ['Incorrect slide count']
    }

    // Check for required slide types
    const hasTitle = outline.slides.some(s => s.type === 'title')
    const hasConclusion = outline.slides.some(s => s.type === 'conclusion')

    if (!hasTitle) {
      feedback.completeness.score -= 10
      feedback.completeness.missingElements = feedback.completeness.missingElements || []
      feedback.completeness.missingElements.push('Missing title slide')
    }

    if (!hasConclusion) {
      feedback.completeness.score -= 10
      feedback.completeness.missingElements = feedback.completeness.missingElements || []
      feedback.completeness.missingElements.push('Missing conclusion slide')
    }

    // Check slide structure
    for (const slide of outline.slides) {
      if (!slide.title || !slide.purpose) {
        feedback.logicalFlow.score -= 5
      }
    }

    // Calculate overall score
    feedback.overallScore = Math.round(
      (feedback.frameworkAlignment.score +
       feedback.logicalFlow.score +
       feedback.audienceSuitability.score +
       feedback.completeness.score) / 4
    )

    return feedback
  }

  /**
   * Check if outline meets minimum quality threshold
   */
  meetsQualityThreshold(feedback: OutlineValidationFeedback): boolean {
    return feedback.overallScore >= (this.config.minScore || 70)
  }
}