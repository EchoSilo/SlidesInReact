/**
 * Content analysis and scoring system for presentation validation
 */

import { PresentationData, SlideData } from '@/lib/types'
import { Framework, FrameworkAnalysisResult } from './frameworkAnalysis'

/**
 * Core validation interfaces
 */
export interface ValidationDimensions {
  frameworkAdherence: number     // 0-100: How well content follows framework
  executiveReadiness: number     // 0-100: Appropriateness for target audience
  contentClarity: number         // 0-100: Clarity and coherence of messaging
  businessImpact: number         // 0-100: Value demonstration and quantification
}

export interface ValidationIssue {
  id: string
  type: IssueType
  severity: IssueSeverity
  title: string
  description: string
  affectedSlides: string[]
  suggestedFix: string
  confidence: number             // 0-100: Confidence in issue identification
  framework_related: boolean     // True if issue relates to framework adherence
}

export interface AnalysisRecommendation {
  id: string
  priority: 'high' | 'medium' | 'low'
  category: string
  title: string
  description: string
  implementation: string
  expectedImpact: string
  relatedIssues: string[]
}

export interface ContentAnalysisResult {
  overallScore: number           // 0-100: Weighted average of all dimensions
  dimensionScores: ValidationDimensions
  issues: ValidationIssue[]
  recommendations: AnalysisRecommendation[]
  analysisMetadata: {
    analysisDate: string
    contentLength: number
    slideCount: number
    frameworkUsed: string
    analysisConfidence: number
  }
}

export interface ContentMetrics {
  wordCount: number
  slideCount: number
  bulletPointCount: number
  sectionCount: number
  metricCount: number
  hasCallouts: boolean
  hasDiagrams: boolean
  avgWordsPerSlide: number
  contentDensity: 'low' | 'medium' | 'high'
}

export interface FrameworkCompliance {
  expectedSteps: string[]
  presentSteps: string[]
  missingSteps: string[]
  stepCompleteness: Record<string, number> // 0-100 for each step
  structureScore: number                   // 0-100 overall structure adherence
}

/**
 * Enums for categorization
 */
export enum IssueType {
  FRAMEWORK_STRUCTURE = 'framework_structure',
  EXECUTIVE_FORMAT = 'executive_format',
  CLARITY_LANGUAGE = 'clarity_language',
  BUSINESS_VALUE = 'business_value',
  CONSISTENCY = 'consistency',
  FLOW_NARRATIVE = 'flow_narrative',
  CONTENT_DENSITY = 'content_density',
  AUDIENCE_LEVEL = 'audience_level',
  EVIDENCE_SUPPORT = 'evidence_support',
  ACTION_ITEMS = 'action_items'
}

export enum IssueSeverity {
  CRITICAL = 'critical',     // Blocks presentation effectiveness
  IMPORTANT = 'important',   // Significantly reduces impact
  MINOR = 'minor'           // Polish and optimization
}

export interface ScoringWeights {
  frameworkAdherence: number   // Default: 0.25
  executiveReadiness: number   // Default: 0.30
  contentClarity: number       // Default: 0.25
  businessImpact: number       // Default: 0.20
}

export interface AnalysisOptions {
  weights?: ScoringWeights
  focusAreas?: IssueType[]
  minimumConfidence?: number   // Only include issues above this confidence
  includeMinorIssues?: boolean
  audienceLevel?: 'executive' | 'technical' | 'general'
}

/**
 * Content extraction and parsing interfaces
 */
export interface ExtractedContent {
  textContent: string[]         // All text content across slides
  structuralElements: {
    titles: string[]
    subtitles: string[]
    bulletPoints: string[]
    callouts: string[]
    metrics: Array<{ label: string; value: string; description?: string }>
  }
  contentFlow: {
    slideProgression: string[]  // Main message of each slide
    narrativeArc: string       // Overall story being told
    logicalGaps: string[]      // Potential flow issues
  }
  businessElements: {
    valuePropositions: string[]
    quantifiedBenefits: string[]
    actionItems: string[]
    strategicAlignments: string[]
  }
}

/**
 * Default scoring weights (sum = 1.0)
 */
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  frameworkAdherence: 0.25,
  executiveReadiness: 0.30,
  contentClarity: 0.25,
  businessImpact: 0.20
}

/**
 * Issue severity priority mapping (higher number = higher priority)
 */
export const SEVERITY_PRIORITY: Record<IssueSeverity, number> = {
  [IssueSeverity.CRITICAL]: 100,
  [IssueSeverity.IMPORTANT]: 50,
  [IssueSeverity.MINOR]: 10
}

/**
 * Issue type categories for grouping and analysis
 */
export const ISSUE_TYPE_CATEGORIES = {
  framework: [IssueType.FRAMEWORK_STRUCTURE, IssueType.FRAMEWORK_CONTENT],
  audience: [IssueType.AUDIENCE_MISMATCH, IssueType.TECHNICAL_DETAIL],
  clarity: [IssueType.CLARITY_LANGUAGE, IssueType.CLARITY_FLOW, IssueType.CONSISTENCY],
  business: [IssueType.BUSINESS_VALUE, IssueType.BUSINESS_METRICS, IssueType.ACTIONABILITY]
}

/**
 * Scoring thresholds for quality assessment
 */
export const QUALITY_THRESHOLDS = {
  excellent: 90,
  good: 75,
  acceptable: 60,
  needsImprovement: 40,
  poor: 0
} as const

export type QualityLevel = keyof typeof QUALITY_THRESHOLDS

/**
 * Framework step mapping for compliance checking
 */
export const FRAMEWORK_STEP_INDICATORS = {
  scqa: {
    situation: ['current', 'context', 'background', 'status quo', 'environment'],
    complication: ['problem', 'challenge', 'issue', 'difficulty', 'obstacle'],
    question: ['how', 'what', 'should we', 'decision', 'approach'],
    answer: ['solution', 'recommendation', 'strategy', 'proposal', 'approach']
  },
  prep: {
    point: ['main point', 'recommendation', 'position', 'conclusion'],
    reason: ['because', 'rationale', 'reasoning', 'logic', 'justification'],
    example: ['example', 'data', 'evidence', 'proof', 'case study'],
    point_reinforced: ['therefore', 'conclusion', 'key takeaway', 'summary']
  },
  star: {
    situation: ['context', 'background', 'scenario', 'setting'],
    task: ['objective', 'goal', 'challenge', 'mission', 'target'],
    action: ['approach', 'method', 'implementation', 'execution'],
    result: ['outcome', 'result', 'achievement', 'impact', 'success']
  },
  pyramid: {
    main_message: ['recommendation', 'conclusion', 'bottom line', 'key message'],
    supporting_arguments: ['argument', 'reason', 'pillar', 'support'],
    evidence: ['data', 'proof', 'evidence', 'analysis', 'research']
  },
  comparison: {
    options: ['option', 'alternative', 'choice', 'approach', 'solution'],
    criteria: ['criteria', 'requirement', 'factor', 'evaluation'],
    analysis: ['comparison', 'evaluation', 'assessment', 'analysis'],
    recommendation: ['recommendation', 'preferred', 'best choice', 'selection']
  }
} as const

/**
 * Content density calculation thresholds
 */
export const CONTENT_DENSITY_THRESHOLDS = {
  wordsPerSlide: {
    low: 50,
    medium: 150,
    high: 300
  },
  bulletsPerSlide: {
    low: 3,
    medium: 6,
    high: 10
  }
} as const

/**
 * Core content analysis class
 */
export class ContentAnalyzer {
  private weights: ScoringWeights
  private options: AnalysisOptions

  constructor(options: AnalysisOptions = {}) {
    this.weights = { ...DEFAULT_SCORING_WEIGHTS, ...options.weights }
    this.options = {
      minimumConfidence: 70,
      includeMinorIssues: true,
      audienceLevel: 'executive',
      ...options
    }
  }

  /**
   * Analyze presentation content and return comprehensive scoring
   */
  async analyzeContent(
    presentation: PresentationData,
    frameworkAnalysis: FrameworkAnalysisResult
  ): Promise<ContentAnalysisResult> {
    // Extract content for analysis
    const extractedContent = this.extractContent(presentation)
    const contentMetrics = this.calculateContentMetrics(presentation)

    // Calculate dimension scores
    const frameworkScore = this.scoreFrameworkAdherence(
      presentation,
      frameworkAnalysis,
      extractedContent
    )
    const executiveScore = this.scoreExecutiveReadiness(
      presentation,
      extractedContent,
      this.options.audienceLevel || 'executive'
    )
    const clarityScore = this.scoreContentClarity(presentation, extractedContent)
    const impactScore = this.scoreBusinessImpact(presentation, extractedContent)

    const dimensionScores: ValidationDimensions = {
      frameworkAdherence: frameworkScore,
      executiveReadiness: executiveScore,
      contentClarity: clarityScore,
      businessImpact: impactScore
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(dimensionScores)

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      dimensionScores,
      frameworkAnalysis
    )

    return {
      overallScore,
      dimensionScores,
      issues: [], // Will be populated in afternoon implementation
      recommendations,
      analysisMetadata: {
        analysisDate: new Date().toISOString(),
        contentLength: extractedContent.textContent.join(' ').length,
        slideCount: presentation.slides.length,
        frameworkUsed: frameworkAnalysis.recommendation.primary_framework,
        analysisConfidence: Math.min(...Object.values(dimensionScores))
      }
    }
  }

  /**
   * Score framework adherence (0-100)
   */
  private scoreFrameworkAdherence(
    presentation: PresentationData,
    frameworkAnalysis: FrameworkAnalysisResult,
    content: ExtractedContent
  ): number {
    const framework = frameworkAnalysis.recommendation.primary_framework
    const compliance = this.assessFrameworkCompliance(presentation, framework, content)

    // Base score from structure adherence
    let score = compliance.structureScore

    // Adjust for missing critical components
    const missingStepsRatio = compliance.missingSteps.length / compliance.expectedSteps.length
    score = score * (1 - missingStepsRatio * 0.5) // Penalize up to 50% for missing steps

    // Bonus for complete implementation
    const completenessAvg = Object.values(compliance.stepCompleteness)
      .reduce((sum, val) => sum + val, 0) / Object.values(compliance.stepCompleteness).length
    score = score * (0.7 + 0.3 * (completenessAvg / 100)) // Weight completeness 30%

    // Check for logical flow consistency
    const flowScore = this.assessLogicalFlow(content, framework)
    score = (score * 0.8) + (flowScore * 0.2) // 80% structure, 20% flow

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Score executive readiness (0-100)
   */
  private scoreExecutiveReadiness(
    presentation: PresentationData,
    content: ExtractedContent,
    audienceLevel: string
  ): number {
    let score = 100

    // Language appropriateness (40% of score)
    const languageScore = this.assessLanguageAppropriateess(content, audienceLevel)
    score = score * 0.6 + languageScore * 0.4

    // Value proposition clarity (30% of score)
    const valueScore = this.assessValueProposition(content)
    score = score * 0.7 + valueScore * 0.3

    // Actionability (30% of score)
    const actionScore = this.assessActionability(content)
    score = score * 0.7 + actionScore * 0.3

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Score content clarity (0-100)
   */
  private scoreContentClarity(
    presentation: PresentationData,
    content: ExtractedContent
  ): number {
    let score = 100

    // Message consistency (40% of score)
    const consistencyScore = this.assessMessageConsistency(content)
    score = score * 0.6 + consistencyScore * 0.4

    // Narrative flow (35% of score)
    const flowScore = this.assessNarrativeFlow(content)
    score = score * 0.65 + flowScore * 0.35

    // Terminology clarity (25% of score)
    const terminologyScore = this.assessTerminologyClarity(content)
    score = score * 0.75 + terminologyScore * 0.25

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Score business impact (0-100)
   */
  private scoreBusinessImpact(
    presentation: PresentationData,
    content: ExtractedContent
  ): number {
    let score = 0

    // Quantified benefits (50% of score)
    const quantificationScore = this.assessValueQuantification(content)
    score += quantificationScore * 0.5

    // Strategic alignment (30% of score)
    const alignmentScore = this.assessStrategicAlignment(content)
    score += alignmentScore * 0.3

    // Implementation feasibility (20% of score)
    const feasibilityScore = this.assessImplementationFeasibility(content)
    score += feasibilityScore * 0.2

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Calculate overall weighted score
   */
  private calculateOverallScore(dimensions: ValidationDimensions): number {
    const score =
      dimensions.frameworkAdherence * this.weights.frameworkAdherence +
      dimensions.executiveReadiness * this.weights.executiveReadiness +
      dimensions.contentClarity * this.weights.contentClarity +
      dimensions.businessImpact * this.weights.businessImpact

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Generate recommendations based on scores
   */
  private generateRecommendations(
    scores: ValidationDimensions,
    frameworkAnalysis: FrameworkAnalysisResult
  ): string[] {
    const recommendations: string[] = []
    const threshold = 75 // Recommend improvements below this score

    if (scores.frameworkAdherence < threshold) {
      recommendations.push(
        `Strengthen ${frameworkAnalysis.recommendation.primary_framework.toUpperCase()} framework adherence by ensuring all required components are fully developed`
      )
    }

    if (scores.executiveReadiness < threshold) {
      recommendations.push(
        `Enhance executive appeal by focusing on strategic value, clear ROI, and actionable next steps`
      )
    }

    if (scores.contentClarity < threshold) {
      recommendations.push(
        `Improve content clarity through consistent messaging, smoother transitions, and clearer terminology`
      )
    }

    if (scores.businessImpact < threshold) {
      recommendations.push(
        `Strengthen business impact by adding quantified benefits, strategic alignment, and implementation details`
      )
    }

    return recommendations
  }

  /**
   * Extract structured content from presentation for analysis
   */
  extractContent(presentation: PresentationData): ExtractedContent {
    const textContent: string[] = []
    const titles: string[] = []
    const subtitles: string[] = []
    const bulletPoints: string[] = []
    const callouts: string[] = []
    const metrics: Array<{ label: string; value: string; description?: string }> = []
    const slideProgression: string[] = []
    const valuePropositions: string[] = []
    const quantifiedBenefits: string[] = []
    const actionItems: string[] = []
    const strategicAlignments: string[] = []

    // Process each slide
    presentation.slides.forEach((slide, index) => {
      // Extract titles and main content
      if (slide.title) {
        titles.push(slide.title)
        textContent.push(slide.title)
        slideProgression.push(slide.title)
      }

      if (slide.subtitle) {
        subtitles.push(slide.subtitle)
        textContent.push(slide.subtitle)
      }

      // Extract slide content
      if (slide.content) {
        // Main text
        if (slide.content.mainText) {
          textContent.push(slide.content.mainText)
        }

        // Bullet points
        if (slide.content.bulletPoints) {
          bulletPoints.push(...slide.content.bulletPoints)
          textContent.push(...slide.content.bulletPoints)
        }

        // Sections
        if (slide.content.sections) {
          slide.content.sections.forEach(section => {
            textContent.push(section.title, section.description)
            if (section.items) {
              bulletPoints.push(...section.items)
              textContent.push(...section.items)
            }
          })
        }

        // Key metrics
        if (slide.content.keyMetrics) {
          slide.content.keyMetrics.forEach(metric => {
            metrics.push({
              label: metric.label,
              value: metric.value,
              description: metric.description
            })
            textContent.push(`${metric.label}: ${metric.value}`)

            // Identify quantified benefits
            if (this.isQuantifiedBenefit(metric)) {
              quantifiedBenefits.push(`${metric.label}: ${metric.value}`)
            }
          })
        }

        // Callouts
        if (slide.content.callout) {
          callouts.push(slide.content.callout)
          textContent.push(slide.content.callout)
        }

        // Quotes (often value propositions)
        if (slide.content.quote) {
          valuePropositions.push(slide.content.quote)
          textContent.push(slide.content.quote)
        }
      }

      // Extract business elements
      this.extractBusinessElements(slide, {
        valuePropositions,
        actionItems,
        strategicAlignments
      })
    })

    // Analyze narrative flow
    const narrativeArc = this.analyzeNarrativeArc(slideProgression)
    const logicalGaps = this.identifyLogicalGaps(slideProgression, textContent)

    return {
      textContent,
      structuralElements: {
        titles,
        subtitles,
        bulletPoints,
        callouts,
        metrics
      },
      contentFlow: {
        slideProgression,
        narrativeArc,
        logicalGaps
      },
      businessElements: {
        valuePropositions,
        quantifiedBenefits,
        actionItems,
        strategicAlignments
      }
    }
  }

  /**
   * Calculate content metrics for analysis
   */
  calculateContentMetrics(presentation: PresentationData): ContentMetrics {
    const extractedContent = this.extractContent(presentation)
    const wordCount = extractedContent.textContent.join(' ').split(/\s+/).length
    const slideCount = presentation.slides.length
    const bulletPointCount = extractedContent.structuralElements.bulletPoints.length
    const sectionCount = presentation.slides.reduce((count, slide) => {
      return count + (slide.content?.sections?.length || 0)
    }, 0)
    const metricCount = extractedContent.structuralElements.metrics.length
    const hasCallouts = extractedContent.structuralElements.callouts.length > 0
    const hasDiagrams = presentation.slides.some(slide => slide.content?.diagram)
    const avgWordsPerSlide = Math.round(wordCount / slideCount)

    // Determine content density
    let contentDensity: 'low' | 'medium' | 'high' = 'medium'
    if (avgWordsPerSlide < CONTENT_DENSITY_THRESHOLDS.wordsPerSlide.low) {
      contentDensity = 'low'
    } else if (avgWordsPerSlide > CONTENT_DENSITY_THRESHOLDS.wordsPerSlide.high) {
      contentDensity = 'high'
    }

    return {
      wordCount,
      slideCount,
      bulletPointCount,
      sectionCount,
      metricCount,
      hasCallouts,
      hasDiagrams,
      avgWordsPerSlide,
      contentDensity
    }
  }

  /**
   * Assess framework compliance
   */
  private assessFrameworkCompliance(
    presentation: PresentationData,
    framework: string,
    content: ExtractedContent
  ): FrameworkCompliance {
    const frameworkKey = framework as keyof typeof FRAMEWORK_STEP_INDICATORS
    const indicators = FRAMEWORK_STEP_INDICATORS[frameworkKey]

    if (!indicators) {
      // Fallback for unknown frameworks
      return {
        expectedSteps: [],
        presentSteps: [],
        missingSteps: [],
        stepCompleteness: {},
        structureScore: 70 // Neutral score
      }
    }

    const expectedSteps = Object.keys(indicators)
    const presentSteps: string[] = []
    const stepCompleteness: Record<string, number> = {}
    const allText = content.textContent.join(' ').toLowerCase()

    // Check for each framework step
    expectedSteps.forEach(step => {
      const stepIndicators = indicators[step as keyof typeof indicators] as string[]
      const matches = stepIndicators.filter(indicator =>
        allText.includes(indicator.toLowerCase())
      )

      const completeness = Math.min(100, (matches.length / stepIndicators.length) * 100)
      stepCompleteness[step] = completeness

      if (completeness > 30) { // Threshold for considering step "present"
        presentSteps.push(step)
      }
    })

    const missingSteps = expectedSteps.filter(step => !presentSteps.includes(step))

    // Calculate structure score
    const presentRatio = presentSteps.length / expectedSteps.length
    const completenessAvg = Object.values(stepCompleteness)
      .reduce((sum, val) => sum + val, 0) / expectedSteps.length

    const structureScore = Math.round((presentRatio * 60) + (completenessAvg * 0.4))

    return {
      expectedSteps,
      presentSteps,
      missingSteps,
      stepCompleteness,
      structureScore
    }
  }

  /**
   * Helper methods for detailed scoring
   */
  private assessLogicalFlow(content: ExtractedContent, framework: string): number {
    // Check if slide progression follows logical framework sequence
    const progression = content.contentFlow.slideProgression
    if (progression.length < 2) return 80 // Not enough slides to assess

    // Look for transition words and logical connectors
    const transitionWords = ['therefore', 'because', 'however', 'consequently', 'thus', 'as a result']
    const allText = content.textContent.join(' ').toLowerCase()
    const transitionCount = transitionWords.filter(word => allText.includes(word)).length

    return Math.min(100, 60 + (transitionCount * 10)) // Base 60 + bonus for transitions
  }

  private assessLanguageAppropriateess(content: ExtractedContent, audienceLevel: string): number {
    const allText = content.textContent.join(' ')

    // Executive language indicators
    const executiveTerms = ['strategic', 'roi', 'value', 'impact', 'growth', 'competitive', 'revenue']
    const technicalTerms = ['implementation', 'architecture', 'configuration', 'optimization']
    const jargonTerms = ['synergy', 'leverage', 'paradigm', 'utilize']

    const executiveCount = this.countTermOccurrences(allText, executiveTerms)
    const technicalCount = this.countTermOccurrences(allText, technicalTerms)
    const jargonCount = this.countTermOccurrences(allText, jargonTerms)

    let score = 70 // Base score

    if (audienceLevel === 'executive') {
      score += Math.min(20, executiveCount * 3) // Bonus for executive terms
      score -= Math.min(15, technicalCount * 2) // Penalty for too technical
      score -= Math.min(10, jargonCount * 4) // Penalty for jargon
    }

    return Math.max(0, Math.min(100, score))
  }

  private assessValueProposition(content: ExtractedContent): number {
    const valueIndicators = ['benefit', 'advantage', 'improvement', 'save', 'increase', 'reduce']
    const allText = content.textContent.join(' ').toLowerCase()

    const valueCount = valueIndicators.filter(indicator => allText.includes(indicator)).length
    return Math.min(100, 40 + (valueCount * 15)) // Base 40 + bonus for value terms
  }

  private assessActionability(content: ExtractedContent): number {
    const actionVerbs = ['implement', 'execute', 'deploy', 'launch', 'initiate', 'establish']
    const timeFrames = ['immediately', 'next quarter', 'by end of year', 'within 30 days']

    const allText = content.textContent.join(' ').toLowerCase()
    const actionCount = actionVerbs.filter(verb => allText.includes(verb)).length
    const timeFrameCount = timeFrames.filter(frame => allText.includes(frame)).length

    return Math.min(100, 50 + (actionCount * 12) + (timeFrameCount * 8))
  }

  private assessMessageConsistency(content: ExtractedContent): number {
    // Simple consistency check based on repeated key terms
    const keyTerms = this.extractKeyTerms(content.textContent)
    const consistencyScore = keyTerms.length > 0 ?
      Math.min(100, 60 + (keyTerms.length * 5)) : 50

    return consistencyScore
  }

  private assessNarrativeFlow(content: ExtractedContent): number {
    // Check for logical gaps identified in content flow
    const gapPenalty = content.contentFlow.logicalGaps.length * 15
    return Math.max(30, 90 - gapPenalty)
  }

  private assessTerminologyClarity(content: ExtractedContent): number {
    // Check for consistent terminology usage
    const allText = content.textContent.join(' ')
    const wordCount = allText.split(/\s+/).length
    const uniqueWords = new Set(allText.toLowerCase().split(/\s+/)).size

    // Higher ratio of unique words might indicate inconsistent terminology
    const uniqueRatio = uniqueWords / wordCount
    return Math.max(40, 100 - (uniqueRatio * 100))
  }

  private assessValueQuantification(content: ExtractedContent): number {
    const metrics = content.structuralElements.metrics
    const quantifiedBenefits = content.businessElements.quantifiedBenefits

    const quantificationScore = Math.min(100, (metrics.length * 20) + (quantifiedBenefits.length * 15))
    return quantificationScore
  }

  private assessStrategicAlignment(content: ExtractedContent): number {
    const strategicTerms = ['strategic', 'priority', 'objective', 'goal', 'mission', 'vision']
    const allText = content.textContent.join(' ').toLowerCase()

    const alignmentCount = strategicTerms.filter(term => allText.includes(term)).length
    return Math.min(100, 40 + (alignmentCount * 15))
  }

  private assessImplementationFeasibility(content: ExtractedContent): number {
    const feasibilityIndicators = ['timeline', 'resource', 'budget', 'phase', 'milestone']
    const allText = content.textContent.join(' ').toLowerCase()

    const feasibilityCount = feasibilityIndicators.filter(indicator => allText.includes(indicator)).length
    return Math.min(100, 50 + (feasibilityCount * 12))
  }

  /**
   * Utility methods
   */
  private isQuantifiedBenefit(metric: any): boolean {
    const value = metric.value.toLowerCase()
    return value.includes('%') || value.includes('$') || value.includes('million') ||
           value.includes('billion') || /\d+/.test(value)
  }

  private extractBusinessElements(slide: SlideData, businessElements: any): void {
    const slideText = [slide.title, slide.subtitle, slide.content?.mainText].filter(Boolean).join(' ')

    // Look for value propositions in titles and main text
    if (slideText.toLowerCase().includes('value') || slideText.toLowerCase().includes('benefit')) {
      businessElements.valuePropositions.push(slideText)
    }

    // Look for action items
    if (slide.content?.bulletPoints) {
      slide.content.bulletPoints.forEach(bullet => {
        if (bullet.toLowerCase().match(/^(implement|execute|deploy|establish|create)/)) {
          businessElements.actionItems.push(bullet)
        }
      })
    }
  }

  private analyzeNarrativeArc(slideProgression: string[]): string {
    if (slideProgression.length === 0) return 'No clear narrative structure'

    const firstSlide = slideProgression[0].toLowerCase()
    const lastSlide = slideProgression[slideProgression.length - 1].toLowerCase()

    if (firstSlide.includes('problem') || firstSlide.includes('challenge')) {
      if (lastSlide.includes('solution') || lastSlide.includes('recommendation')) {
        return 'Problem-to-solution narrative'
      }
    }

    if (firstSlide.includes('current') || firstSlide.includes('situation')) {
      if (lastSlide.includes('future') || lastSlide.includes('next')) {
        return 'Current-to-future narrative'
      }
    }

    return 'General business narrative'
  }

  private identifyLogicalGaps(slideProgression: string[], textContent: string[]): string[] {
    const gaps: string[] = []

    // Simple gap detection - look for missing transitions between major themes
    if (slideProgression.length > 2) {
      for (let i = 1; i < slideProgression.length; i++) {
        const current = slideProgression[i].toLowerCase()
        const previous = slideProgression[i - 1].toLowerCase()

        // Check for abrupt topic changes without transition
        if (!this.hasLogicalTransition(previous, current, textContent)) {
          gaps.push(`Potential gap between "${slideProgression[i - 1]}" and "${slideProgression[i]}"`)
        }
      }
    }

    return gaps
  }

  private hasLogicalTransition(previous: string, current: string, textContent: string[]): boolean {
    // Simple heuristic for logical transitions
    const transitionWords = ['therefore', 'as a result', 'consequently', 'building on', 'next', 'moving to']
    const surroundingText = textContent.join(' ').toLowerCase()

    return transitionWords.some(word => surroundingText.includes(word))
  }

  private countTermOccurrences(text: string, terms: string[]): number {
    const lowerText = text.toLowerCase()
    return terms.filter(term => lowerText.includes(term.toLowerCase())).length
  }

  private extractKeyTerms(textContent: string[]): string[] {
    const allText = textContent.join(' ').toLowerCase()
    const words = allText.split(/\s+/)
    const wordCounts: Record<string, number> = {}

    // Count word frequencies (excluding common words)
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'])

    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (cleanWord.length > 3 && !commonWords.has(cleanWord)) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1
      }
    })

    // Return words that appear multiple times
    return Object.entries(wordCounts)
      .filter(([word, count]) => count > 1)
      .map(([word]) => word)
  }

  /**
   * Identify and categorize issues in presentation content
   */
  identifyIssues(
    presentation: PresentationData,
    frameworkAnalysis: FrameworkAnalysisResult,
    content: ExtractedContent,
    dimensionScores: ValidationDimensions
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Framework adherence issues
    issues.push(...this.identifyFrameworkIssues(presentation, frameworkAnalysis, content))

    // Executive readiness issues
    issues.push(...this.identifyExecutiveReadinessIssues(content, dimensionScores.executiveReadiness))

    // Content clarity issues
    issues.push(...this.identifyClarityIssues(content, dimensionScores.contentClarity))

    // Business impact issues
    issues.push(...this.identifyBusinessImpactIssues(content, dimensionScores.businessImpact))

    // Filter by confidence and options
    const filteredIssues = issues.filter(issue => {
      if (issue.confidence < (this.options.minimumConfidence || 70)) return false
      if (!this.options.includeMinorIssues && issue.severity === IssueSeverity.MINOR) return false
      if (this.options.focusAreas && !this.options.focusAreas.includes(issue.type)) return false
      return true
    })

    return this.prioritizeIssues(filteredIssues)
  }

  /**
   * Identify framework-specific issues
   */
  private identifyFrameworkIssues(
    presentation: PresentationData,
    frameworkAnalysis: FrameworkAnalysisResult,
    content: ExtractedContent
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const framework = frameworkAnalysis.recommendation.primary_framework
    const compliance = this.assessFrameworkCompliance(presentation, framework, content)

    // Missing framework steps
    compliance.missingSteps.forEach((step, index) => {
      issues.push({
        id: `framework-missing-${step}`,
        type: IssueType.FRAMEWORK_STRUCTURE,
        severity: IssueSeverity.CRITICAL,
        title: `Missing ${framework.toUpperCase()} Component: ${step}`,
        description: `The presentation is missing the "${step}" component required by the ${framework.toUpperCase()} framework`,
        affectedSlides: [], // All slides affected
        suggestedFix: `Add a dedicated slide or section addressing the "${step}" component with relevant content`,
        confidence: 90,
        framework_related: true
      })
    })

    // Incomplete framework steps
    Object.entries(compliance.stepCompleteness).forEach(([step, completeness]) => {
      if (completeness > 0 && completeness < 60) { // Present but incomplete
        issues.push({
          id: `framework-incomplete-${step}`,
          type: IssueType.FRAMEWORK_CONTENT,
          severity: IssueSeverity.IMPORTANT,
          title: `Incomplete ${framework.toUpperCase()} Component: ${step}`,
          description: `The "${step}" component is present but underdeveloped (${Math.round(completeness)}% complete)`,
          affectedSlides: this.findSlidesWithStep(presentation, step, framework),
          suggestedFix: `Strengthen the "${step}" section with more detailed content, examples, or supporting information`,
          confidence: 80,
          framework_related: true
        })
      }
    })

    // Poor logical flow
    const flowScore = this.assessLogicalFlow(content, framework)
    if (flowScore < 60) {
      issues.push({
        id: 'framework-flow',
        type: IssueType.FRAMEWORK_STRUCTURE,
        severity: IssueSeverity.IMPORTANT,
        title: 'Poor Logical Flow',
        description: 'Content does not follow a clear logical progression according to the framework',
        affectedSlides: [],
        suggestedFix: 'Reorganize content to follow the framework sequence and add transition statements between sections',
        confidence: 75,
        framework_related: true
      })
    }

    return issues
  }

  /**
   * Identify executive readiness issues
   */
  private identifyExecutiveReadinessIssues(
    content: ExtractedContent,
    executiveScore: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = []
    const allText = content.textContent.join(' ')

    // Language appropriateness
    const technicalTerms = ['implementation', 'architecture', 'configuration', 'optimization', 'debugging']
    const technicalCount = this.countTermOccurrences(allText, technicalTerms)

    if (technicalCount > 3 && this.options.audienceLevel === 'executive') {
      issues.push({
        id: 'executive-technical-language',
        type: IssueType.AUDIENCE_MISMATCH,
        severity: IssueSeverity.IMPORTANT,
        title: 'Too Technical for Executive Audience',
        description: `Content contains ${technicalCount} technical terms that may not resonate with executives`,
        affectedSlides: this.findSlidesWithTerms(content, technicalTerms),
        suggestedFix: 'Replace technical jargon with business-focused language emphasizing value and outcomes',
        confidence: 85,
        framework_related: false
      })
    }

    // Missing value proposition
    if (content.businessElements.valuePropositions.length === 0) {
      issues.push({
        id: 'executive-no-value-prop',
        type: IssueType.BUSINESS_VALUE,
        severity: IssueSeverity.CRITICAL,
        title: 'Missing Clear Value Proposition',
        description: 'Presentation lacks a clear, compelling value proposition for executives',
        affectedSlides: [0], // Title slide typically
        suggestedFix: 'Add a clear value proposition statement highlighting strategic benefits and business impact',
        confidence: 90,
        framework_related: false
      })
    }

    // Lack of actionability
    if (content.businessElements.actionItems.length === 0) {
      issues.push({
        id: 'executive-no-actions',
        type: IssueType.ACTIONABILITY,
        severity: IssueSeverity.IMPORTANT,
        title: 'No Clear Action Items',
        description: 'Presentation lacks specific, actionable next steps for executives',
        affectedSlides: [], // Usually final slides
        suggestedFix: 'Add specific action items with timelines, responsibilities, and decision points',
        confidence: 80,
        framework_related: false
      })
    }

    return issues
  }

  /**
   * Identify content clarity issues
   */
  private identifyClarityIssues(
    content: ExtractedContent,
    clarityScore: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Logical gaps in flow
    if (content.contentFlow.logicalGaps.length > 0) {
      content.contentFlow.logicalGaps.forEach((gap, index) => {
        issues.push({
          id: `clarity-gap-${index}`,
          type: IssueType.CLARITY_FLOW,
          severity: IssueSeverity.IMPORTANT,
          title: 'Logical Flow Gap',
          description: gap,
          affectedSlides: [],
          suggestedFix: 'Add transition slides or statements to bridge the logical gap between topics',
          confidence: 70,
          framework_related: false
        })
      })
    }

    // Inconsistent messaging
    const keyTerms = this.extractKeyTerms(content.textContent)
    if (keyTerms.length < 3) {
      issues.push({
        id: 'clarity-inconsistent-messaging',
        type: IssueType.CONSISTENCY,
        severity: IssueSeverity.MINOR,
        title: 'Inconsistent Key Messaging',
        description: 'Presentation lacks consistent key terms and messaging throughout',
        affectedSlides: [],
        suggestedFix: 'Establish and consistently use 3-5 key terms throughout the presentation',
        confidence: 65,
        framework_related: false
      })
    }

    // Dense content
    const avgWordsPerSlide = content.textContent.join(' ').split(/\s+/).length / Math.max(1, content.structuralElements.titles.length)
    if (avgWordsPerSlide > 200) {
      issues.push({
        id: 'clarity-content-density',
        type: IssueType.CLARITY_LANGUAGE,
        severity: IssueSeverity.MINOR,
        title: 'High Content Density',
        description: 'Slides contain too much text, making them difficult to follow',
        affectedSlides: [],
        suggestedFix: 'Break down dense slides into multiple slides or use more visual elements',
        confidence: 75,
        framework_related: false
      })
    }

    return issues
  }

  /**
   * Identify business impact issues
   */
  private identifyBusinessImpactIssues(
    content: ExtractedContent,
    businessImpactScore: number
  ): ValidationIssue[] {
    const issues: ValidationIssue[] = []

    // Missing quantified benefits
    if (content.businessElements.quantifiedBenefits.length === 0) {
      issues.push({
        id: 'business-no-quantified-benefits',
        type: IssueType.BUSINESS_METRICS,
        severity: IssueSeverity.CRITICAL,
        title: 'No Quantified Benefits',
        description: 'Presentation lacks specific, measurable business benefits or ROI',
        affectedSlides: [],
        suggestedFix: 'Add specific metrics, percentages, or dollar amounts to quantify business value',
        confidence: 90,
        framework_related: false
      })
    }

    // Weak strategic alignment
    const strategicTerms = ['strategic', 'priority', 'objective', 'goal']
    const strategicCount = this.countTermOccurrences(content.textContent.join(' '), strategicTerms)

    if (strategicCount < 2) {
      issues.push({
        id: 'business-weak-strategic-alignment',
        type: IssueType.BUSINESS_VALUE,
        severity: IssueSeverity.IMPORTANT,
        title: 'Weak Strategic Alignment',
        description: 'Content does not clearly connect to organizational strategy or priorities',
        affectedSlides: [],
        suggestedFix: 'Explicitly connect recommendations to company strategy, goals, or key priorities',
        confidence: 75,
        framework_related: false
      })
    }

    // Missing implementation details
    const implementationTerms = ['timeline', 'resource', 'budget', 'phase']
    const implementationCount = this.countTermOccurrences(content.textContent.join(' '), implementationTerms)

    if (implementationCount === 0) {
      issues.push({
        id: 'business-no-implementation',
        type: IssueType.ACTIONABILITY,
        severity: IssueSeverity.IMPORTANT,
        title: 'Missing Implementation Details',
        description: 'Presentation lacks practical implementation guidance (timeline, resources, budget)',
        affectedSlides: [],
        suggestedFix: 'Add implementation timeline, resource requirements, and budget considerations',
        confidence: 80,
        framework_related: false
      })
    }

    return issues
  }

  /**
   * Find slides containing specific framework step indicators
   */
  private findSlidesWithStep(
    presentation: PresentationData,
    step: string,
    framework: string
  ): number[] {
    const frameworkKey = framework as keyof typeof FRAMEWORK_STEP_INDICATORS
    const indicators = FRAMEWORK_STEP_INDICATORS[frameworkKey]

    if (!indicators) return []

    const stepIndicators = indicators[step as keyof typeof indicators] as string[]
    const slideIndexes: number[] = []

    presentation.slides.forEach((slide, index) => {
      const slideText = [slide.title, slide.subtitle, slide.content?.mainText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (stepIndicators.some(indicator => slideText.includes(indicator.toLowerCase()))) {
        slideIndexes.push(index)
      }
    })

    return slideIndexes
  }

  /**
   * Find slides containing specific terms
   */
  private findSlidesWithTerms(content: ExtractedContent, terms: string[]): number[] {
    // This would require tracking which slide each text element came from
    // For now, return empty array - could be enhanced with slide mapping
    return []
  }

  /**
   * Prioritize issues using multi-criteria algorithm
   */
  prioritizeIssues(issues: ValidationIssue[]): ValidationIssue[] {
    return issues.sort((a, b) => {
      // Primary sort: Severity (Critical > Important > Minor)
      const severityDiff = SEVERITY_PRIORITY[b.severity] - SEVERITY_PRIORITY[a.severity]
      if (severityDiff !== 0) return severityDiff

      // Secondary sort: Framework-related issues first
      if (a.framework_related !== b.framework_related) {
        return b.framework_related ? 1 : -1
      }

      // Tertiary sort: Confidence (higher confidence first)
      const confidenceDiff = b.confidence - a.confidence
      if (Math.abs(confidenceDiff) > 5) return confidenceDiff

      // Quaternary sort: Issue scope (more affected slides = higher priority)
      const scopeDiff = b.affectedSlides.length - a.affectedSlides.length
      if (scopeDiff !== 0) return scopeDiff

      // Final sort: Issue type priority
      const typePriority = this.getIssueTypePriority(a.type) - this.getIssueTypePriority(b.type)
      return typePriority
    })
  }

  /**
   * Get priority ranking for issue types
   */
  private getIssueTypePriority(type: IssueType): number {
    const priorityMap: Record<IssueType, number> = {
      [IssueType.FRAMEWORK_STRUCTURE]: 1,     // Highest priority
      [IssueType.BUSINESS_VALUE]: 2,
      [IssueType.AUDIENCE_MISMATCH]: 3,
      [IssueType.FRAMEWORK_CONTENT]: 4,
      [IssueType.BUSINESS_METRICS]: 5,
      [IssueType.ACTIONABILITY]: 6,
      [IssueType.CLARITY_FLOW]: 7,
      [IssueType.CLARITY_LANGUAGE]: 8,
      [IssueType.TECHNICAL_DETAIL]: 9,
      [IssueType.CONSISTENCY]: 10            // Lowest priority
    }

    return priorityMap[type] || 99
  }

  /**
   * Update analysis result with identified issues
   */
  async analyzeContentWithIssues(
    presentation: PresentationData,
    frameworkAnalysis: FrameworkAnalysisResult
  ): Promise<ContentAnalysisResult> {
    // Get base analysis
    const baseResult = await this.analyzeContent(presentation, frameworkAnalysis)

    // Extract content for issue identification
    const extractedContent = this.extractContent(presentation)

    // Identify issues
    const issues = this.identifyIssues(
      presentation,
      frameworkAnalysis,
      extractedContent,
      baseResult.dimensionScores
    )

    // Return updated result with issues
    return {
      ...baseResult,
      issues
    }
  }

  /**
   * Get quality level from score
   */
  getQualityLevel(score: number): QualityLevel {
    if (score >= QUALITY_THRESHOLDS.excellent) return 'excellent'
    if (score >= QUALITY_THRESHOLDS.good) return 'good'
    if (score >= QUALITY_THRESHOLDS.acceptable) return 'acceptable'
    if (score >= QUALITY_THRESHOLDS.needsImprovement) return 'needsImprovement'
    return 'poor'
  }

  /**
   * Generate summary statistics for validation result
   */
  generateSummaryStats(result: ContentAnalysisResult): {
    qualityLevel: QualityLevel
    criticalIssues: number
    importantIssues: number
    minorIssues: number
    frameworkRelatedIssues: number
    improvementPotential: number
  } {
    const criticalIssues = result.issues.filter(i => i.severity === IssueSeverity.CRITICAL).length
    const importantIssues = result.issues.filter(i => i.severity === IssueSeverity.IMPORTANT).length
    const minorIssues = result.issues.filter(i => i.severity === IssueSeverity.MINOR).length
    const frameworkRelatedIssues = result.issues.filter(i => i.framework_related).length

    // Calculate improvement potential (100 - current score)
    const improvementPotential = Math.max(0, 100 - result.overallScore)

    return {
      qualityLevel: this.getQualityLevel(result.overallScore),
      criticalIssues,
      importantIssues,
      minorIssues,
      frameworkRelatedIssues,
      improvementPotential
    }
  }
}

/**
 * Standalone content analysis function
 */
export async function analyzePresentation(
  presentation: PresentationData,
  frameworkAnalysis: FrameworkAnalysisResult,
  options: AnalysisOptions = {}
): Promise<ContentAnalysisResult> {
  const analyzer = new ContentAnalyzer(options)
  return analyzer.analyzeContentWithIssues(presentation, frameworkAnalysis)
}

/**
 * Quick content scoring function
 */
export function quickContentScore(
  presentation: PresentationData,
  framework: string
): ValidationDimensions {
  const analyzer = new ContentAnalyzer()
  const content = analyzer.extractContent(presentation)

  // Simplified scoring without full framework analysis
  const mockFrameworkAnalysis = {
    recommendation: { primary_framework: framework }
  } as FrameworkAnalysisResult

  return {
    frameworkAdherence: analyzer['scoreFrameworkAdherence'](presentation, mockFrameworkAnalysis, content),
    executiveReadiness: analyzer['scoreExecutiveReadiness'](presentation, content, 'executive'),
    contentClarity: analyzer['scoreContentClarity'](presentation, content),
    businessImpact: analyzer['scoreBusinessImpact'](presentation, content)
  }
}