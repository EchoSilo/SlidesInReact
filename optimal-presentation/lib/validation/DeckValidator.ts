/**
 * DeckValidator Class
 * Validates complete presentation for cohesiveness, narrative flow, and user intent fulfillment
 * Part of Phase 3: Final validation approach
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import { PresentationData, Slide } from '@/lib/types'
import { GenerationRequest } from '@/lib/types'
import { WorkflowLogger } from '@/lib/workflow-logger'
import { Framework } from './supportedFrameworks'

export interface DeckValidationFeedback {
  overallScore: number
  narrativeFlow: {
    score: number
    feedback: string
    flowIssues?: string[]
    transitionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  }
  cohesiveness: {
    score: number
    feedback: string
    themeConsistency: boolean
    messageClarity: boolean
    redundancies?: string[]
    gaps?: string[]
  }
  userIntentFulfillment: {
    score: number
    feedback: string
    meetsRequirements: boolean
    addressesPrompt: boolean
    missingElements?: string[]
  }
  audienceAlignment: {
    score: number
    feedback: string
    toneAppropriate: boolean
    complexityLevel: 'too-simple' | 'appropriate' | 'too-complex'
  }
  frameworkAdherence: {
    score: number
    feedback: string
    followsStructure: boolean
    deviations?: string[]
  }
  improvements: {
    critical?: string[]
    recommended?: string[]
    optional?: string[]
  }
  slideSpecificFeedback?: {
    slideId: string
    issue: string
    suggestion: string
  }[]
}

export interface DeckValidationConfig {
  minScore?: number
  checkNarrativeFlow?: boolean
  checkCohesiveness?: boolean
  checkUserIntent?: boolean
  checkAudience?: boolean
  checkFramework?: boolean
  enableTargetedRefinement?: boolean
}

export interface TargetedRefinement {
  slideId: string
  slideNumber: number
  issue: string
  refinementType: 'content' | 'transition' | 'clarity' | 'alignment'
  priority: 'critical' | 'high' | 'medium' | 'low'
  suggestedChanges: string
}

export class DeckValidator {
  private anthropicClient: Anthropic | null = null
  private logger?: WorkflowLogger
  private config: DeckValidationConfig

  constructor(
    apiKey?: string,
    config?: DeckValidationConfig,
    logger?: WorkflowLogger
  ) {
    if (apiKey) {
      this.anthropicClient = createAnthropicClient(apiKey)
    }
    this.config = {
      minScore: 75,
      checkNarrativeFlow: true,
      checkCohesiveness: true,
      checkUserIntent: true,
      checkAudience: true,
      checkFramework: true,
      enableTargetedRefinement: true,
      ...config
    }
    this.logger = logger
  }

  /**
   * Main validation method for complete deck
   */
  async validateDeck(
    presentation: PresentationData,
    request: GenerationRequest,
    framework?: Framework
  ): Promise<DeckValidationFeedback> {
    if (!this.anthropicClient) {
      // Fallback to quick validation if no API key
      return this.quickValidate(presentation, request)
    }

    const startTime = Date.now()

    try {
      const prompt = this.createValidationPrompt(presentation, request, framework)
      const modelConfig = ModelConfigs.analysis() // Using analysis tokens for comprehensive validation

      if (this.logger) {
        this.logger.llmRequest(
          'DECK_VALIDATION',
          `Validating complete presentation: ${presentation.title}`,
          modelConfig.model,
          {
            slide_count: presentation.slides.length,
            framework: framework?.name || 'unknown'
          }
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
        this.logger.llmResponse('DECK_VALIDATION', response, duration)
      }

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      const feedback = this.parseValidationResponse(content.text)

      if (this.logger) {
        this.logger.success('DECK_VALIDATION', 'Deck validation completed', {
          overall_score: feedback.overallScore,
          narrative_flow: feedback.narrativeFlow.score,
          cohesiveness: feedback.cohesiveness.score,
          user_intent: feedback.userIntentFulfillment.score,
          duration_ms: duration
        })
      }

      return feedback

    } catch (error) {
      if (this.logger) {
        this.logger.warning('DECK_VALIDATION', 'LLM validation failed, using quick validation', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      return this.quickValidate(presentation, request)
    }
  }

  /**
   * Create comprehensive validation prompt
   */
  private createValidationPrompt(
    presentation: PresentationData,
    request: GenerationRequest,
    framework?: Framework
  ): string {
    const slideSummary = presentation.slides.map((slide, idx) =>
      `Slide ${idx + 1} (${slide.type}): ${slide.title}`
    ).join('\n')

    return `You are a presentation quality expert. Perform a comprehensive validation of this complete presentation.

ORIGINAL REQUEST:
- Prompt: ${request.prompt}
- Type: ${request.presentation_type}
- Audience: ${request.audience || 'General business audience'}
- Tone: ${request.tone || 'professional'}
- Framework: ${framework?.name || 'Not specified'}

PRESENTATION OVERVIEW:
Title: ${presentation.title}
Subtitle: ${presentation.subtitle || 'N/A'}
Total Slides: ${presentation.slides.length}

SLIDE STRUCTURE:
${slideSummary}

FULL PRESENTATION CONTENT:
${JSON.stringify(presentation.slides, null, 2)}

EVALUATION CRITERIA:

1. NARRATIVE FLOW (0-100)
   - Does the presentation tell a coherent story?
   - Are transitions between slides smooth and logical?
   - Is there a clear beginning, middle, and end?
   - Rate transition quality: excellent/good/fair/poor

2. COHESIVENESS (0-100)
   - Is the theme consistent throughout?
   - Is the main message clear?
   - Are there redundancies that should be removed?
   - Are there gaps in the narrative?

3. USER INTENT FULFILLMENT (0-100)
   - Does it fully address the original prompt?
   - Are all requirements met?
   - What elements might be missing?

4. AUDIENCE ALIGNMENT (0-100)
   - Is the tone appropriate for the audience?
   - Is the complexity level right (too-simple/appropriate/too-complex)?

5. FRAMEWORK ADHERENCE (0-100)
   - Does it follow the ${framework?.name || 'specified'} framework?
   - What deviations exist?

CRITICAL: Respond with ONLY valid JSON.

{
  "overallScore": [0-100],
  "narrativeFlow": {
    "score": [0-100],
    "feedback": "Assessment of story flow",
    "flowIssues": ["Issue 1", "Issue 2"],
    "transitionQuality": "excellent|good|fair|poor"
  },
  "cohesiveness": {
    "score": [0-100],
    "feedback": "Assessment of unity",
    "themeConsistency": true|false,
    "messageClarity": true|false,
    "redundancies": ["Redundant element 1"],
    "gaps": ["Missing element 1"]
  },
  "userIntentFulfillment": {
    "score": [0-100],
    "feedback": "How well it meets requirements",
    "meetsRequirements": true|false,
    "addressesPrompt": true|false,
    "missingElements": ["Missing 1"]
  },
  "audienceAlignment": {
    "score": [0-100],
    "feedback": "Audience appropriateness",
    "toneAppropriate": true|false,
    "complexityLevel": "too-simple|appropriate|too-complex"
  },
  "frameworkAdherence": {
    "score": [0-100],
    "feedback": "Framework compliance",
    "followsStructure": true|false,
    "deviations": ["Deviation 1"]
  },
  "improvements": {
    "critical": ["Must fix 1"],
    "recommended": ["Should fix 1"],
    "optional": ["Nice to have 1"]
  },
  "slideSpecificFeedback": [
    {
      "slideId": "slide-1",
      "issue": "Specific issue",
      "suggestion": "How to fix"
    }
  ]
}`
  }

  /**
   * Parse validation response
   */
  private parseValidationResponse(responseText: string): DeckValidationFeedback {
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

      return feedback as DeckValidationFeedback

    } catch (error) {
      if (this.logger) {
        this.logger.warning('DECK_VALIDATION', 'Failed to parse validation response', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      return this.getDefaultFeedback()
    }
  }

  /**
   * Quick validation without LLM
   */
  quickValidate(
    presentation: PresentationData,
    request: GenerationRequest
  ): DeckValidationFeedback {
    const feedback: DeckValidationFeedback = {
      overallScore: 100,
      narrativeFlow: {
        score: 100,
        feedback: 'Flow appears logical',
        transitionQuality: 'good'
      },
      cohesiveness: {
        score: 100,
        feedback: 'Presentation appears cohesive',
        themeConsistency: true,
        messageClarity: true
      },
      userIntentFulfillment: {
        score: 100,
        feedback: 'Addresses the prompt',
        meetsRequirements: true,
        addressesPrompt: true
      },
      audienceAlignment: {
        score: 100,
        feedback: 'Appropriate for audience',
        toneAppropriate: true,
        complexityLevel: 'appropriate'
      },
      frameworkAdherence: {
        score: 100,
        feedback: 'Follows structure',
        followsStructure: true
      },
      improvements: {}
    }

    const issues: string[] = []
    const gaps: string[] = []

    // Check slide count
    const expectedCount = parseInt(request.slide_count)
    if (presentation.slides.length !== expectedCount) {
      feedback.cohesiveness.score -= 10
      gaps.push(`Expected ${expectedCount} slides, got ${presentation.slides.length}`)
    }

    // Check for title and conclusion
    const hasTitle = presentation.slides.some(s => s.type === 'title')
    const hasConclusion = presentation.slides.some(s => s.type === 'conclusion')

    if (!hasTitle) {
      feedback.narrativeFlow.score -= 15
      gaps.push('Missing title slide')
    }

    if (!hasConclusion) {
      feedback.narrativeFlow.score -= 15
      gaps.push('Missing conclusion slide')
    }

    // Check for logical slide type progression
    const slideTypes = presentation.slides.map(s => s.type)
    const expectedProgression = ['title', 'problem', 'solution', 'benefits', 'conclusion']

    let progressionScore = 0
    for (const expected of expectedProgression) {
      if (slideTypes.includes(expected as any)) {
        progressionScore += 20
      }
    }
    feedback.narrativeFlow.score = Math.min(100, progressionScore)

    // Check theme consistency (simplified)
    const titles = presentation.slides.map(s => s.title?.toLowerCase() || '')
    const commonWords = this.findCommonThemes(titles)

    if (commonWords.length < 2) {
      feedback.cohesiveness.score -= 20
      feedback.cohesiveness.themeConsistency = false
      issues.push('Limited thematic consistency across slides')
    }

    // Check user intent (basic keyword matching)
    const promptWords = request.prompt.toLowerCase().split(' ')
    const presentationText = JSON.stringify(presentation).toLowerCase()

    let intentScore = 0
    for (const word of promptWords) {
      if (word.length > 4 && presentationText.includes(word)) {
        intentScore += 10
      }
    }
    feedback.userIntentFulfillment.score = Math.min(100, intentScore)

    // Calculate overall score
    feedback.overallScore = Math.round(
      (feedback.narrativeFlow.score +
       feedback.cohesiveness.score +
       feedback.userIntentFulfillment.score +
       feedback.audienceAlignment.score +
       feedback.frameworkAdherence.score) / 5
    )

    // Add improvements if needed
    if (gaps.length > 0) {
      feedback.cohesiveness.gaps = gaps
      feedback.improvements.recommended = gaps.map(g => `Add ${g}`)
    }

    if (issues.length > 0) {
      feedback.narrativeFlow.flowIssues = issues
    }

    return feedback
  }

  /**
   * Find common themes across slide titles
   */
  private findCommonThemes(titles: string[]): string[] {
    const wordFreq: Record<string, number> = {}
    const stopWords = ['the', 'and', 'for', 'with', 'our', 'your', 'this', 'that', 'from', 'into']

    for (const title of titles) {
      const words = title.split(/\s+/)
      for (const word of words) {
        if (word.length > 3 && !stopWords.includes(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1
        }
      }
    }

    return Object.entries(wordFreq)
      .filter(([_, count]) => count > 1)
      .map(([word]) => word)
  }

  /**
   * Get default feedback when validation fails
   */
  private getDefaultFeedback(): DeckValidationFeedback {
    return {
      overallScore: 70,
      narrativeFlow: {
        score: 70,
        feedback: 'Unable to fully validate narrative flow',
        transitionQuality: 'fair'
      },
      cohesiveness: {
        score: 70,
        feedback: 'Unable to fully validate cohesiveness',
        themeConsistency: true,
        messageClarity: true
      },
      userIntentFulfillment: {
        score: 70,
        feedback: 'Unable to fully validate intent fulfillment',
        meetsRequirements: true,
        addressesPrompt: true
      },
      audienceAlignment: {
        score: 70,
        feedback: 'Unable to fully validate audience alignment',
        toneAppropriate: true,
        complexityLevel: 'appropriate'
      },
      frameworkAdherence: {
        score: 70,
        feedback: 'Unable to fully validate framework adherence',
        followsStructure: true
      },
      improvements: {}
    }
  }

  /**
   * Identify slides that need targeted refinement
   */
  identifyRefinementTargets(
    feedback: DeckValidationFeedback,
    presentation: PresentationData
  ): TargetedRefinement[] {
    const targets: TargetedRefinement[] = []

    // Check for critical improvements
    if (feedback.improvements.critical) {
      for (const issue of feedback.improvements.critical) {
        // Try to identify which slide needs work
        const slideIndex = this.identifySlideFromIssue(issue, presentation)
        if (slideIndex >= 0) {
          targets.push({
            slideId: presentation.slides[slideIndex].id,
            slideNumber: slideIndex + 1,
            issue,
            refinementType: 'content',
            priority: 'critical',
            suggestedChanges: issue
          })
        }
      }
    }

    // Check slide-specific feedback
    if (feedback.slideSpecificFeedback) {
      for (const slideFeedback of feedback.slideSpecificFeedback) {
        const slideIndex = presentation.slides.findIndex(s => s.id === slideFeedback.slideId)
        if (slideIndex >= 0) {
          targets.push({
            slideId: slideFeedback.slideId,
            slideNumber: slideIndex + 1,
            issue: slideFeedback.issue,
            refinementType: this.determineRefinementType(slideFeedback.issue),
            priority: 'high',
            suggestedChanges: slideFeedback.suggestion
          })
        }
      }
    }

    // Check for flow issues
    if (feedback.narrativeFlow.flowIssues && feedback.narrativeFlow.score < 70) {
      for (let i = 0; i < presentation.slides.length - 1; i++) {
        targets.push({
          slideId: presentation.slides[i].id,
          slideNumber: i + 1,
          issue: 'Poor transition to next slide',
          refinementType: 'transition',
          priority: 'medium',
          suggestedChanges: 'Improve transition and connection to next slide'
        })
      }
    }

    return targets
  }

  /**
   * Identify which slide an issue refers to
   */
  private identifySlideFromIssue(issue: string, presentation: PresentationData): number {
    const issueLower = issue.toLowerCase()

    // Check for slide number references
    const slideMatch = issueLower.match(/slide\s+(\d+)/)
    if (slideMatch) {
      return parseInt(slideMatch[1]) - 1
    }

    // Check for slide type references
    for (let i = 0; i < presentation.slides.length; i++) {
      if (issueLower.includes(presentation.slides[i].type)) {
        return i
      }
    }

    return -1
  }

  /**
   * Determine refinement type from issue description
   */
  private determineRefinementType(issue: string): 'content' | 'transition' | 'clarity' | 'alignment' {
    const issueLower = issue.toLowerCase()

    if (issueLower.includes('transition') || issueLower.includes('flow')) {
      return 'transition'
    }
    if (issueLower.includes('unclear') || issueLower.includes('confus')) {
      return 'clarity'
    }
    if (issueLower.includes('align') || issueLower.includes('match')) {
      return 'alignment'
    }

    return 'content'
  }

  /**
   * Check if deck meets quality threshold
   */
  meetsQualityThreshold(feedback: DeckValidationFeedback): boolean {
    return feedback.overallScore >= (this.config.minScore || 75) &&
           feedback.narrativeFlow.score >= 70 &&
           feedback.userIntentFulfillment.meetsRequirements
  }
}