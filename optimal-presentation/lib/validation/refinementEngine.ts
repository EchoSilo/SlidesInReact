/**
 * Multi-round iterative refinement engine
 * Phase 3: Iterative Refinement Engine - Day 1-2
 */

import { PresentationData, GenerationRequest } from '@/lib/types'
import { ValidationAgent, ValidationSessionResult, ValidationConfig } from './ValidationAgent'
import { FrameworkAnalyzer, FrameworkAnalysisResult } from './frameworkAnalysis'
import { ContentAnalysisResult, ValidationIssue, IssueSeverity } from './contentAnalysis'
import { ProgressTracker, RefinementProgress, RefinementStage } from './progressTracker'
import {
  generateRefinementPrompt,
  generateFocusedImprovementPrompt,
  generateRoundSpecificPrompt
} from './refinementPrompts'
import { ContentRegenerator, RegenerationResult } from './contentRegenerator'
import { ValidationFeedback } from './feedbackToPromptConverter'

/**
 * Refinement round result interface
 */
export interface RefinementRoundResult {
  round: number
  startingScore: number
  endingScore: number
  improvement: number
  timeElapsed: number
  issuesAddressed: ValidationIssue[]
  issuesRemaining: ValidationIssue[]
  refinementPrompt: string
  contentChanges: ContentChange[]
  success: boolean
  stoppedEarly: boolean
  reasonForStopping?: string
}

/**
 * Content change tracking
 */
export interface ContentChange {
  slideId: string
  changeType: 'content' | 'structure' | 'style' | 'addition' | 'removal'
  description: string
  beforeValue?: string
  afterValue?: string
  confidence: number
}

/**
 * Complete refinement session result
 */
export interface RefinementSessionResult {
  sessionId: string
  initialPresentation: PresentationData
  finalPresentation: PresentationData
  initialScore: number
  finalScore: number
  totalImprovement: number
  roundResults: RefinementRoundResult[]
  targetAchieved: boolean
  targetScore: number
  totalRounds: number
  totalTimeElapsed: number
  frameworkAnalysis: FrameworkAnalysisResult
  sessionSummary: {
    criticalIssuesResolved: number
    importantIssuesResolved: number
    minorIssuesResolved: number
    averageImprovementPerRound: number
    mostEffectiveRound: number
    keyImprovements: string[]
    finalRecommendations: string[]
  }
}

/**
 * Refinement configuration
 */
export interface RefinementConfig extends ValidationConfig {
  /** Minimum improvement required per round to continue (default: 2) */
  minimumImprovement: number
  /** Maximum quality regression allowed (default: 5) */
  maxQualityRegression: number
  /** Whether to rollback if quality decreases (default: true) */
  enableRollback: boolean
  /** Timeout per round in milliseconds (default: 120000) */
  roundTimeout: number
  /** Content regeneration service URL */
  generationServiceUrl?: string
}

/**
 * Progress callback interface
 */
export interface RefinementProgressCallback {
  (progress: RefinementProgress): void
}

/**
 * Main iterative refinement engine
 */
export class RefinementEngine {
  private validationAgent: ValidationAgent
  private frameworkAnalyzer: FrameworkAnalyzer
  private contentRegenerator: ContentRegenerator
  private progressTracker: ProgressTracker
  private config: RefinementConfig
  private apiKey: string

  constructor(apiKey: string, config: Partial<RefinementConfig> = {}) {
    this.apiKey = apiKey
    // Set default configuration
    this.config = {
      maxRefinementRounds: 3,
      targetQualityScore: 80,
      minConfidenceThreshold: 70,
      includeMinorIssues: true,
      model: 'claude-3-haiku-20240307',
      temperature: 0.3,
      maxTokens: 4000,
      minimumImprovement: 2,
      maxQualityRegression: 5,
      enableRollback: true,
      roundTimeout: 120000,
      generationServiceUrl: '/api/generate',
      ...config
    }

    this.validationAgent = new ValidationAgent(apiKey, this.config)
    this.frameworkAnalyzer = new FrameworkAnalyzer(apiKey)
    this.contentRegenerator = new ContentRegenerator(apiKey, {
      model: this.config.model,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens
    })
    this.progressTracker = new ProgressTracker()
  }

  /**
   * Execute complete iterative refinement session
   */
  async refinePresentation(
    initialPresentation: PresentationData,
    originalRequest: GenerationRequest,
    progressCallback?: RefinementProgressCallback
  ): Promise<RefinementSessionResult> {
    const sessionId = this.generateSessionId()
    const startTime = Date.now()

    console.log(`🔄 Starting refinement session ${sessionId}`)
    console.log(`📊 Target quality score: ${this.config.targetQualityScore}%`)
    console.log(`🔁 Maximum rounds: ${this.config.maxRefinementRounds}`)

    try {
      // Initialize progress tracking
      this.progressTracker.initializeSession(sessionId, this.config.maxRefinementRounds)

      // Update progress: Starting analysis
      this.progressTracker.updateStage(RefinementStage.ANALYZING)
      progressCallback?.(this.progressTracker.getProgress())

      // Get framework analysis
      const frameworkAnalysis = await this.frameworkAnalyzer.analyzeFramework(
        initialPresentation,
        originalRequest
      )

      // Perform initial validation
      const initialValidation = await this.validationAgent.validatePresentation(
        initialPresentation,
        originalRequest,
        (round, status) => {
          this.progressTracker.updateStage(RefinementStage.ANALYZING, status)
          progressCallback?.(this.progressTracker.getProgress())
        }
      )

      const initialScore = initialValidation.finalScore
      console.log(`📊 Initial quality score: ${initialScore}/100`)

      // Check if already meets target
      if (initialScore >= this.config.targetQualityScore) {
        console.log(`✅ Initial presentation already meets target quality (${initialScore}% >= ${this.config.targetQualityScore}%)`)

        return this.createSessionResult({
          sessionId,
          initialPresentation,
          finalPresentation: initialPresentation,
          initialScore,
          finalScore: initialScore,
          roundResults: [],
          frameworkAnalysis,
          targetAchieved: true,
          totalTimeElapsed: Date.now() - startTime
        })
      }

      // Execute refinement rounds
      let currentPresentation = initialPresentation
      let currentScore = initialScore
      const roundResults: RefinementRoundResult[] = []

      for (let round = 1; round <= this.config.maxRefinementRounds; round++) {
        console.log(`\n🔄 Starting refinement round ${round}/${this.config.maxRefinementRounds}`)

        // Update progress: Starting round
        this.progressTracker.startRound(round)
        progressCallback?.(this.progressTracker.getProgress())

        const roundStartTime = Date.now()

        try {
          // Execute refinement round
          const roundResult = await this.executeRefinementRound(
            currentPresentation,
            originalRequest,
            frameworkAnalysis,
            round,
            currentScore,
            initialValidation.roundResults[0].analysis.issues,
            progressCallback
          )

          roundResults.push(roundResult)

          // Check if improvement was successful
          if (!roundResult.success) {
            console.log(`❌ Round ${round} failed: ${roundResult.reasonForStopping}`)
            break
          }

          // Update current state
          if (roundResult.endingScore > currentScore) {
            currentScore = roundResult.endingScore
            // In a real implementation, we would update currentPresentation with the improved version
            console.log(`📈 Quality improved from ${roundResult.startingScore}% to ${roundResult.endingScore}% (+${roundResult.improvement} points)`)
          } else if (this.config.enableRollback) {
            console.log(`📉 Quality regression detected, rolling back to previous version`)
            roundResult.reasonForStopping = 'Quality regression - rolled back'
            break
          }

          // Check if target achieved
          if (currentScore >= this.config.targetQualityScore) {
            console.log(`🎯 Target quality achieved: ${currentScore}% >= ${this.config.targetQualityScore}%`)
            roundResult.stoppedEarly = true
            roundResult.reasonForStopping = 'Target quality achieved'
            break
          }

          // Check if minimum improvement achieved
          if (roundResult.improvement < this.config.minimumImprovement) {
            console.log(`⚠️  Minimal improvement achieved (+${roundResult.improvement} points), stopping refinement`)
            roundResult.stoppedEarly = true
            roundResult.reasonForStopping = 'Minimal improvement - convergence reached'
            break
          }

        } catch (error) {
          console.error(`❌ Round ${round} encountered error:`, error)

          const failedRound: RefinementRoundResult = {
            round,
            startingScore: currentScore,
            endingScore: currentScore,
            improvement: 0,
            timeElapsed: Date.now() - roundStartTime,
            issuesAddressed: [],
            issuesRemaining: [],
            refinementPrompt: '',
            contentChanges: [],
            success: false,
            stoppedEarly: true,
            reasonForStopping: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          }

          roundResults.push(failedRound)
          break
        }
      }

      // Create final session result
      const sessionResult = this.createSessionResult({
        sessionId,
        initialPresentation,
        finalPresentation: currentPresentation,
        initialScore,
        finalScore: currentScore,
        roundResults,
        frameworkAnalysis,
        targetAchieved: currentScore >= this.config.targetQualityScore,
        totalTimeElapsed: Date.now() - startTime
      })

      // Update final progress
      this.progressTracker.completeSession(sessionResult.targetAchieved, sessionResult.finalScore)
      progressCallback?.(this.progressTracker.getProgress())

      console.log(`\n✅ Refinement session completed`)
      console.log(`📊 Final score: ${sessionResult.finalScore}/100 (+${sessionResult.totalImprovement} points)`)
      console.log(`🎯 Target achieved: ${sessionResult.targetAchieved}`)
      console.log(`⏱️  Total time: ${Math.round(sessionResult.totalTimeElapsed / 1000)}s`)

      return sessionResult

    } catch (error) {
      console.error('❌ Refinement session failed:', error)
      this.progressTracker.failSession(error instanceof Error ? error.message : 'Unknown error')
      progressCallback?.(this.progressTracker.getProgress())
      throw error
    }
  }

  /**
   * Execute a single refinement round
   */
  private async executeRefinementRound(
    presentation: PresentationData,
    originalRequest: GenerationRequest,
    frameworkAnalysis: FrameworkAnalysisResult,
    round: number,
    currentScore: number,
    identifiedIssues: ValidationIssue[],
    progressCallback?: RefinementProgressCallback
  ): Promise<RefinementRoundResult> {
    const roundStartTime = Date.now()
    const startingScore = currentScore

    try {
      // Update progress: Analyzing issues
      this.progressTracker.updateStage(RefinementStage.ANALYZING, `Round ${round}: Analyzing critical issues`)
      progressCallback?.(this.progressTracker.getProgress())

      // Prioritize issues for this round
      const roundFocus = this.determineRoundFocus(round, identifiedIssues, currentScore)
      console.log(`🎯 Round ${round} focus: ${roundFocus.description}`)

      // Generate refinement prompt
      this.progressTracker.updateStage(RefinementStage.GENERATING, `Round ${round}: Generating improvement strategy`)
      progressCallback?.(this.progressTracker.getProgress())

      const refinementPrompt = await generateRoundSpecificPrompt(
        presentation,
        originalRequest,
        frameworkAnalysis,
        round,
        roundFocus.criticalIssues,
        roundFocus.targetImprovement
      )

      // Generate improved content
      this.progressTracker.updateStage(RefinementStage.GENERATING, `Round ${round}: Generating improved content`)
      progressCallback?.(this.progressTracker.getProgress())

      // Build validation feedback for content regeneration
      const validationFeedback: ValidationFeedback = {
        issues: roundFocus.criticalIssues,
        dimensionScores: {} as any, // Will be populated from current validation
        overallScore: currentScore,
        targetScore: this.config.targetQualityScore,
        currentPresentation: presentation,
        framework: frameworkAnalysis.recommendation.framework,
        preserveSlides: this.identifyGoodSlides(presentation, identifiedIssues),
        round
      }

      // Use real content regeneration
      const regenerationResult = await this.contentRegenerator.regenerateContent(
        presentation,
        validationFeedback,
        originalRequest,
        frameworkAnalysis.recommendation.framework,
        round
      )

      if (!regenerationResult.success || !regenerationResult.presentation) {
        throw new Error(`Content regeneration failed: ${regenerationResult.error || 'Unknown error'}`)
      }

      const improvedPresentation = regenerationResult.presentation

      // Validate improvements
      this.progressTracker.updateStage(RefinementStage.VALIDATING, `Round ${round}: Validating improvements`)
      progressCallback?.(this.progressTracker.getProgress())

      const validationResult = await this.validationAgent.validatePresentation(
        improvedPresentation,
        originalRequest
      )

      const endingScore = validationResult.finalScore
      const improvement = endingScore - startingScore

      // Track content changes (simulated)
      const contentChanges = this.detectContentChanges(presentation, improvedPresentation)

      // Determine which issues were addressed
      const issuesAddressed = this.determineIssuesAddressed(
        identifiedIssues,
        validationResult.roundResults[0].analysis.issues
      )

      const roundResult: RefinementRoundResult = {
        round,
        startingScore,
        endingScore,
        improvement,
        timeElapsed: Date.now() - roundStartTime,
        issuesAddressed,
        issuesRemaining: validationResult.roundResults[0].analysis.issues,
        refinementPrompt,
        contentChanges,
        success: improvement > 0,
        stoppedEarly: false
      }

      // Update progress: Round complete
      this.progressTracker.completeRound(round, endingScore, improvement)
      progressCallback?.(this.progressTracker.getProgress())

      return roundResult

    } catch (error) {
      console.error(`Round ${round} execution failed:`, error)

      return {
        round,
        startingScore,
        endingScore: startingScore,
        improvement: 0,
        timeElapsed: Date.now() - roundStartTime,
        issuesAddressed: [],
        issuesRemaining: identifiedIssues,
        refinementPrompt: '',
        contentChanges: [],
        success: false,
        stoppedEarly: true,
        reasonForStopping: `Round execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Determine focus area for each round
   */
  private determineRoundFocus(
    round: number,
    issues: ValidationIssue[],
    currentScore: number
  ): {
    description: string
    criticalIssues: ValidationIssue[]
    targetImprovement: number
    focusAreas: string[]
  } {
    const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL)
    const importantIssues = issues.filter(i => i.severity === IssueSeverity.IMPORTANT)

    switch (round) {
      case 1:
        return {
          description: 'Foundation Fix - Structure and Framework',
          criticalIssues: criticalIssues.slice(0, 3),
          targetImprovement: 15,
          focusAreas: ['framework_adherence', 'content_structure', 'critical_gaps']
        }

      case 2:
        return {
          description: 'Executive Polish - Business Impact and Readiness',
          criticalIssues: [...criticalIssues, ...importantIssues.slice(0, 2)],
          targetImprovement: 10,
          focusAreas: ['executive_readiness', 'business_impact', 'audience_alignment']
        }

      case 3:
      default:
        return {
          description: 'Final Optimization - Clarity and Polish',
          criticalIssues: importantIssues,
          targetImprovement: 7,
          focusAreas: ['content_clarity', 'language_polish', 'flow_optimization']
        }
    }
  }

  /**
   * Identify good slides to preserve during regeneration
   */
  private identifyGoodSlides(
    presentation: PresentationData,
    issues: ValidationIssue[]
  ): string[] {
    const issuesBySlide = new Map<string, number>()

    // Count severity-weighted issues per slide
    issues.forEach(issue => {
      const slideId = issue.slideId || 'general'
      const weight = issue.severity === IssueSeverity.CRITICAL ? 10
        : issue.severity === IssueSeverity.IMPORTANT ? 5
        : issue.severity === IssueSeverity.MINOR ? 2 : 1
      issuesBySlide.set(slideId, (issuesBySlide.get(slideId) || 0) + weight)
    })

    // Return slides with low issue scores (high quality)
    return presentation.slides
      .filter(slide => {
        const issueScore = issuesBySlide.get(slide.id) || 0
        return issueScore < 5 // Threshold for "good" slides
      })
      .map(slide => slide.id)
  }

  /**
   * Detect content changes between presentations
   */
  private detectContentChanges(
    before: PresentationData,
    after: PresentationData
  ): ContentChange[] {
    const changes: ContentChange[] = []

    // In a real implementation, this would:
    // 1. Compare slide content line by line
    // 2. Detect structural changes
    // 3. Track additions and removals
    // 4. Calculate confidence scores for changes

    // For now, return simulated changes
    changes.push({
      slideId: 'slide-1',
      changeType: 'content',
      description: 'Enhanced executive summary with quantified benefits',
      confidence: 85
    })

    return changes
  }

  /**
   * Determine which issues were addressed in this round
   */
  private determineIssuesAddressed(
    beforeIssues: ValidationIssue[],
    afterIssues: ValidationIssue[]
  ): ValidationIssue[] {
    // Find issues that existed before but not after
    const afterIssueTypes = new Set(afterIssues.map(i => i.type))
    return beforeIssues.filter(issue => !afterIssueTypes.has(issue.type))
  }

  /**
   * Create final session result
   */
  private createSessionResult(params: {
    sessionId: string
    initialPresentation: PresentationData
    finalPresentation: PresentationData
    initialScore: number
    finalScore: number
    roundResults: RefinementRoundResult[]
    frameworkAnalysis: FrameworkAnalysisResult
    targetAchieved: boolean
    totalTimeElapsed: number
  }): RefinementSessionResult {
    const totalImprovement = params.finalScore - params.initialScore
    const roundCount = params.roundResults.length

    // Calculate session summary
    const criticalIssuesResolved = params.roundResults.reduce(
      (sum, round) => sum + round.issuesAddressed.filter(i => i.severity === IssueSeverity.CRITICAL).length,
      0
    )

    const importantIssuesResolved = params.roundResults.reduce(
      (sum, round) => sum + round.issuesAddressed.filter(i => i.severity === IssueSeverity.IMPORTANT).length,
      0
    )

    const minorIssuesResolved = params.roundResults.reduce(
      (sum, round) => sum + round.issuesAddressed.filter(i => i.severity === IssueSeverity.MINOR).length,
      0
    )

    const averageImprovementPerRound = roundCount > 0 ? totalImprovement / roundCount : 0

    const mostEffectiveRound = params.roundResults.reduce(
      (best, round, index) => round.improvement > params.roundResults[best].improvement ? index : best,
      0
    ) + 1

    const keyImprovements = params.roundResults
      .filter(round => round.improvement > 5)
      .map(round => `Round ${round.round}: +${round.improvement} points`)

    return {
      sessionId: params.sessionId,
      initialPresentation: params.initialPresentation,
      finalPresentation: params.finalPresentation,
      initialScore: params.initialScore,
      finalScore: params.finalScore,
      totalImprovement,
      roundResults: params.roundResults,
      targetAchieved: params.targetAchieved,
      targetScore: this.config.targetQualityScore,
      totalRounds: roundCount,
      totalTimeElapsed: params.totalTimeElapsed,
      frameworkAnalysis: params.frameworkAnalysis,
      sessionSummary: {
        criticalIssuesResolved,
        importantIssuesResolved,
        minorIssuesResolved,
        averageImprovementPerRound,
        mostEffectiveRound,
        keyImprovements,
        finalRecommendations: []
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get current configuration
   */
  getConfig(): RefinementConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RefinementConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.validationAgent.updateConfig(newConfig)
  }
}

/**
 * Default refinement configuration
 */
export const DEFAULT_REFINEMENT_CONFIG: RefinementConfig = {
  maxRefinementRounds: 3,
  targetQualityScore: 80,
  minConfidenceThreshold: 70,
  includeMinorIssues: true,
  model: 'claude-3-haiku-20240307',
  temperature: 0.3,
  maxTokens: 4000,
  minimumImprovement: 2,
  maxQualityRegression: 5,
  enableRollback: true,
  roundTimeout: 120000
}

/**
 * Create refinement engine with default configuration
 */
export function createRefinementEngine(
  apiKey: string,
  config?: Partial<RefinementConfig>
): RefinementEngine {
  return new RefinementEngine(apiKey, config)
}