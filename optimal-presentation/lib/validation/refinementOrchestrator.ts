/**
 * Refinement Orchestrator
 * Coordinates the complete validation and regeneration loop
 */

import { PresentationData, GenerationRequest } from '@/lib/types'
import { ValidationAgent, ValidationSessionResult } from './ValidationAgent'
import { ContentRegenerator, RegenerationResult } from './contentRegenerator'
import { FeedbackToPromptConverter, ValidationFeedback } from './feedbackToPromptConverter'
import { FrameworkAnalyzer, FrameworkAnalysisResult } from './frameworkAnalysis'
import { Framework } from './supportedFrameworks'
import { ContentAnalysisResult, ValidationIssue, IssueSeverity } from './contentAnalysis'
import { ProgressTracker, RefinementProgress, RefinementStage } from './progressTracker'

/**
 * Orchestrator configuration
 */
export interface OrchestratorConfig {
  maxRounds: number
  targetScore: number
  minimumImprovement: number
  enableDetailedLogging: boolean
  progressCallback?: (progress: RefinementProgress) => void
  streamProgress?: boolean
}

/**
 * Refinement history entry
 */
export interface RefinementHistoryEntry {
  round: number
  beforeScore: number
  afterScore: number
  improvement: number
  issuesAddressed: string[]
  changesMade: string[]
  duration: number
  success: boolean
}

/**
 * Complete refinement result
 */
export interface RefinedPresentationResult {
  finalPresentation: PresentationData
  initialScore: number
  finalScore: number
  totalImprovement: number
  targetAchieved: boolean
  history: RefinementHistoryEntry[]
  frameworkAnalysis: FrameworkAnalysisResult
  totalDuration: number
  llmCalls: number
  debugInfo?: {
    validationDetails: ValidationSessionResult[]
    regenerationDetails: RegenerationResult[]
  }
}

/**
 * Main Refinement Orchestrator class
 */
export class RefinementOrchestrator {
  private validationAgent: ValidationAgent
  private contentRegenerator: ContentRegenerator
  private converter: FeedbackToPromptConverter
  private frameworkAnalyzer: FrameworkAnalyzer
  private progressTracker: ProgressTracker
  private config: OrchestratorConfig
  private llmCallCount: number = 0

  constructor(
    validationAgent: ValidationAgent,
    contentRegenerator: ContentRegenerator,
    converter: FeedbackToPromptConverter,
    frameworkAnalyzer: FrameworkAnalyzer,
    config?: Partial<OrchestratorConfig>
  ) {
    this.validationAgent = validationAgent
    this.contentRegenerator = contentRegenerator
    this.converter = converter
    this.frameworkAnalyzer = frameworkAnalyzer
    this.progressTracker = new ProgressTracker()
    this.config = {
      maxRounds: 3,
      targetScore: 80,
      minimumImprovement: 2,
      enableDetailedLogging: true,
      ...config
    }
  }

  /**
   * Main orchestration method
   */
  async orchestrateRefinement(
    presentation: PresentationData,
    request: GenerationRequest,
    framework: Framework
  ): Promise<RefinedPresentationResult> {
    const startTime = Date.now()
    const sessionId = this.generateSessionId()
    const history: RefinementHistoryEntry[] = []
    const validationDetails: ValidationSessionResult[] = []
    const regenerationDetails: RegenerationResult[] = []

    this.log('🚀 Starting refinement orchestration', {
      sessionId,
      targetScore: this.config.targetScore,
      maxRounds: this.config.maxRounds,
      framework: framework.name
    })

    // Initialize progress tracking
    this.progressTracker.initializeSession(sessionId, this.config.maxRounds)
    this.updateProgress(RefinementStage.ANALYZING, 'Performing initial analysis')

    try {
      // Step 1: Framework Analysis
      const frameworkAnalysis = await this.frameworkAnalyzer.analyzeFramework(
        presentation,
        request
      )
      this.llmCallCount++

      // Step 2: Initial validation
      const initialValidation = await this.validatePresentation(
        presentation,
        request,
        'Initial validation'
      )
      validationDetails.push(initialValidation)

      const initialScore = initialValidation.finalScore
      this.log(`📊 Initial quality score: ${initialScore}/100`)

      // Check if already meets target
      if (initialScore >= this.config.targetScore) {
        this.log(`✅ Presentation already meets target quality`)
        return this.createFinalResult(
          presentation,
          presentation,
          initialScore,
          initialScore,
          history,
          frameworkAnalysis,
          startTime,
          validationDetails,
          regenerationDetails
        )
      }

      // Step 3: Iterative refinement loop
      let currentPresentation = presentation
      let currentScore = initialScore
      let previousScore = initialScore

      for (let round = 1; round <= this.config.maxRounds; round++) {
        this.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        this.log(`🔄 REFINEMENT ROUND ${round}/${this.config.maxRounds}`)
        this.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

        const roundStartTime = Date.now()
        this.progressTracker.startRound(round)
        this.updateProgress(
          RefinementStage.ANALYZING,
          `Round ${round}: Analyzing content issues`
        )

        // Get latest validation result
        const latestValidation = validationDetails[validationDetails.length - 1]
        const currentIssues = this.extractIssuesFromValidation(latestValidation)

        // Check for convergence
        if (this.hasConverged(currentScore, previousScore, round)) {
          this.log(`⚠️  Convergence detected - minimal improvement possible`)
          break
        }

        // Build validation feedback
        const feedback: ValidationFeedback = {
          issues: currentIssues,
          dimensionScores: latestValidation.initialAnalysis.dimensionScores,
          overallScore: currentScore,
          targetScore: this.config.targetScore,
          currentPresentation,
          framework,
          preserveSlides: this.identifyHighQualitySlides(
            currentPresentation,
            currentIssues
          ),
          round
        }

        // Regenerate content with feedback
        this.updateProgress(
          RefinementStage.GENERATING,
          `Round ${round}: Regenerating content with improvements`
        )

        const regenerationResult = await this.contentRegenerator.regenerateContent(
          currentPresentation,
          feedback,
          request,
          framework,
          round
        )
        this.llmCallCount++
        regenerationDetails.push(regenerationResult)

        if (!regenerationResult.success || !regenerationResult.presentation) {
          this.log(`❌ Round ${round} regeneration failed: ${regenerationResult.error}`)
          history.push({
            round,
            beforeScore: currentScore,
            afterScore: currentScore,
            improvement: 0,
            issuesAddressed: [],
            changesMade: [],
            duration: Date.now() - roundStartTime,
            success: false
          })
          break
        }

        // Validate improved presentation
        this.updateProgress(
          RefinementStage.VALIDATING,
          `Round ${round}: Validating improvements`
        )

        const improvedValidation = await this.validatePresentation(
          regenerationResult.presentation,
          request,
          `Round ${round} validation`
        )
        validationDetails.push(improvedValidation)

        const improvedScore = improvedValidation.finalScore
        const improvement = improvedScore - currentScore

        // Log round results
        this.log(`📈 Round ${round} Results:`)
        this.log(`   Before: ${currentScore}/100`)
        this.log(`   After: ${improvedScore}/100`)
        this.log(`   Improvement: ${improvement > 0 ? '+' : ''}${improvement} points`)
        this.log(`   Issues addressed: ${regenerationResult.changes.length}`)

        // Record history
        history.push({
          round,
          beforeScore: currentScore,
          afterScore: improvedScore,
          improvement,
          issuesAddressed: regenerationResult.changes
            .flatMap(c => c.issuesAddressed),
          changesMade: regenerationResult.changes
            .map(c => c.description),
          duration: Date.now() - roundStartTime,
          success: improvement > 0
        })

        // Update state if improved
        if (improvement > 0) {
          previousScore = currentScore
          currentScore = improvedScore
          currentPresentation = regenerationResult.presentation
          this.progressTracker.completeRound(round, currentScore, improvement)

          // Check if target achieved
          if (currentScore >= this.config.targetScore) {
            this.log(`🎯 Target quality achieved: ${currentScore}/${this.config.targetScore}`)
            break
          }
        } else {
          this.log(`⚠️  No improvement in round ${round} - stopping refinement`)
          break
        }

        // Check minimum improvement threshold
        if (improvement < this.config.minimumImprovement && round > 1) {
          this.log(`⚠️  Below minimum improvement threshold - stopping`)
          break
        }
      }

      // Create final result
      const finalResult = this.createFinalResult(
        presentation,
        currentPresentation,
        initialScore,
        currentScore,
        history,
        frameworkAnalysis,
        startTime,
        validationDetails,
        regenerationDetails
      )

      // Log final summary
      this.logFinalSummary(finalResult)

      return finalResult

    } catch (error) {
      this.log(`❌ Orchestration failed: ${error}`)
      this.progressTracker.failSession(
        error instanceof Error ? error.message : 'Unknown error'
      )
      throw error
    }
  }

  /**
   * Validate presentation with progress tracking
   */
  private async validatePresentation(
    presentation: PresentationData,
    request: GenerationRequest,
    description: string
  ): Promise<ValidationSessionResult> {
    this.log(`🔍 ${description}`)

    const validation = await this.validationAgent.validatePresentation(
      presentation,
      request,
      (round, status) => {
        this.updateProgress(RefinementStage.VALIDATING, status)
      }
    )

    this.llmCallCount++
    return validation
  }

  /**
   * Extract issues from validation result
   */
  private extractIssuesFromValidation(
    validation: ValidationSessionResult
  ): ValidationIssue[] {
    // Get issues from the latest round
    const latestRound = validation.roundResults[validation.roundResults.length - 1]
    return latestRound ? latestRound.analysis.issues : []
  }

  /**
   * Identify high-quality slides to preserve
   */
  private identifyHighQualitySlides(
    presentation: PresentationData,
    issues: ValidationIssue[]
  ): string[] {
    const issuesBySlide = new Map<string, number>()

    // Count issues per slide
    issues.forEach(issue => {
      const slideId = issue.slideId || 'general'
      const weight = issue.severity === IssueSeverity.CRITICAL ? 10
        : issue.severity === IssueSeverity.IMPORTANT ? 5
        : issue.severity === IssueSeverity.MINOR ? 2 : 1
      issuesBySlide.set(slideId, (issuesBySlide.get(slideId) || 0) + weight)
    })

    // Identify slides with minimal issues
    return presentation.slides
      .filter(slide => {
        const issueWeight = issuesBySlide.get(slide.id) || 0
        return issueWeight < 5 // Threshold for "high quality"
      })
      .map(slide => slide.id)
  }

  /**
   * Check if refinement has converged
   */
  private hasConverged(
    currentScore: number,
    previousScore: number,
    round: number
  ): boolean {
    // No improvement in last round
    if (round > 1 && currentScore === previousScore) {
      return true
    }

    // Very close to target (within 2 points)
    if (Math.abs(this.config.targetScore - currentScore) < 2) {
      return true
    }

    // Diminishing returns over multiple rounds
    if (round > 2 && (currentScore - previousScore) < 1) {
      return true
    }

    return false
  }

  /**
   * Create final result
   */
  private createFinalResult(
    initialPresentation: PresentationData,
    finalPresentation: PresentationData,
    initialScore: number,
    finalScore: number,
    history: RefinementHistoryEntry[],
    frameworkAnalysis: FrameworkAnalysisResult,
    startTime: number,
    validationDetails: ValidationSessionResult[],
    regenerationDetails: RegenerationResult[]
  ): RefinedPresentationResult {
    const totalImprovement = finalScore - initialScore
    const targetAchieved = finalScore >= this.config.targetScore
    const totalDuration = Date.now() - startTime

    this.progressTracker.completeSession(targetAchieved, finalScore)
    this.updateProgress(RefinementStage.COMPLETED, 'Refinement complete')

    return {
      finalPresentation,
      initialScore,
      finalScore,
      totalImprovement,
      targetAchieved,
      history,
      frameworkAnalysis,
      totalDuration,
      llmCalls: this.llmCallCount,
      ...(this.config.enableDetailedLogging && {
        debugInfo: {
          validationDetails,
          regenerationDetails
        }
      })
    }
  }

  /**
   * Log final summary
   */
  private logFinalSummary(result: RefinedPresentationResult): void {
    this.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    this.log('📋 REFINEMENT SUMMARY')
    this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    this.log(`Initial Score: ${result.initialScore}/100`)
    this.log(`Final Score: ${result.finalScore}/100`)
    this.log(`Total Improvement: ${result.totalImprovement > 0 ? '+' : ''}${result.totalImprovement} points`)
    this.log(`Target Achieved: ${result.targetAchieved ? '✅ Yes' : '❌ No'}`)
    this.log(`Rounds Completed: ${result.history.length}`)
    this.log(`Total Duration: ${Math.round(result.totalDuration / 1000)}s`)
    this.log(`LLM Calls: ${result.llmCalls}`)

    if (result.history.length > 0) {
      this.log('\n📊 Round-by-Round Progress:')
      result.history.forEach(entry => {
        const status = entry.success ? '✅' : '❌'
        this.log(`   Round ${entry.round}: ${status} ${entry.beforeScore} → ${entry.afterScore} (${entry.improvement > 0 ? '+' : ''}${entry.improvement})`)
      })
    }

    const totalIssuesFixed = result.history
      .flatMap(h => h.issuesAddressed)
      .length
    if (totalIssuesFixed > 0) {
      this.log(`\n🔧 Total Issues Addressed: ${totalIssuesFixed}`)
    }
  }

  /**
   * Update progress
   */
  private updateProgress(stage: RefinementStage, message: string): void {
    this.progressTracker.updateStage(stage, message)
    if (this.config.progressCallback) {
      this.config.progressCallback(this.progressTracker.getProgress())
    }
  }

  /**
   * Logging utility
   */
  private log(message: string, data?: any): void {
    if (this.config.enableDetailedLogging) {
      console.log(message)
      if (data) {
        console.log(data)
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `orch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Create orchestrator with dependencies
 */
export function createRefinementOrchestrator(
  apiKey: string,
  config?: Partial<OrchestratorConfig>
): RefinementOrchestrator {
  const validationAgent = new ValidationAgent(apiKey)
  const contentRegenerator = new ContentRegenerator(apiKey)
  const converter = new FeedbackToPromptConverter()
  const frameworkAnalyzer = new FrameworkAnalyzer(apiKey)

  return new RefinementOrchestrator(
    validationAgent,
    contentRegenerator,
    converter,
    frameworkAnalyzer,
    config
  )
}