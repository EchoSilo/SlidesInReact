/**
 * Progress tracking system for refinement sessions
 * Phase 3: Iterative Refinement Engine - Day 3
 */

/**
 * Refinement stage enumeration
 */
export enum RefinementStage {
  INITIALIZING = 'initializing',
  ANALYZING = 'analyzing',
  GENERATING = 'generating',
  VALIDATING = 'validating',
  APPLYING = 'applying',
  COMPLETING = 'completing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Round progress information
 */
export interface RoundProgress {
  round: number
  stage: RefinementStage
  status: string
  startTime: number
  endTime?: number
  startingScore?: number
  endingScore?: number
  improvement?: number
  estimatedTimeRemaining?: number
  completionPercentage: number
}

/**
 * Overall session progress
 */
export interface RefinementProgress {
  sessionId: string
  totalRounds: number
  currentRound: number
  overallStage: RefinementStage
  overallStatus: string
  overallPercentage: number
  timeElapsed: number
  estimatedTimeRemaining: number
  roundProgresses: RoundProgress[]
  qualityProgression: QualityProgression
  issueResolution: IssueResolutionProgress
  targetAchieved: boolean
  error?: string
}

/**
 * Quality score progression tracking
 */
export interface QualityProgression {
  initialScore?: number
  currentScore?: number
  targetScore: number
  scoreHistory: Array<{
    round: number
    score: number
    improvement: number
    timestamp: number
  }>
  projectedFinalScore?: number
  onTrackToTarget: boolean
}

/**
 * Issue resolution progress tracking
 */
export interface IssueResolutionProgress {
  totalIssuesIdentified: number
  criticalIssuesResolved: number
  importantIssuesResolved: number
  minorIssuesResolved: number
  issuesRemaining: number
  resolutionRate: number
  focusAreas: string[]
}

/**
 * Progress tracking implementation
 */
export class ProgressTracker {
  private sessionId: string = ''
  private totalRounds: number = 3
  private currentRound: number = 0
  private sessionStartTime: number = 0
  private roundProgresses: RoundProgress[] = []
  private qualityProgression: QualityProgression
  private issueResolution: IssueResolutionProgress
  private overallStage: RefinementStage = RefinementStage.INITIALIZING
  private overallStatus: string = ''
  private targetAchieved: boolean = false
  private error?: string

  constructor() {
    this.qualityProgression = {
      targetScore: 80,
      scoreHistory: [],
      onTrackToTarget: true
    }

    this.issueResolution = {
      totalIssuesIdentified: 0,
      criticalIssuesResolved: 0,
      importantIssuesResolved: 0,
      minorIssuesResolved: 0,
      issuesRemaining: 0,
      resolutionRate: 0,
      focusAreas: []
    }
  }

  /**
   * Initialize a new refinement session
   */
  initializeSession(sessionId: string, totalRounds: number, targetScore: number = 80): void {
    this.sessionId = sessionId
    this.totalRounds = totalRounds
    this.currentRound = 0
    this.sessionStartTime = Date.now()
    this.roundProgresses = []
    this.overallStage = RefinementStage.INITIALIZING
    this.overallStatus = 'Initializing refinement session...'
    this.targetAchieved = false
    this.error = undefined

    this.qualityProgression = {
      targetScore,
      scoreHistory: [],
      onTrackToTarget: true
    }

    this.issueResolution = {
      totalIssuesIdentified: 0,
      criticalIssuesResolved: 0,
      importantIssuesResolved: 0,
      minorIssuesResolved: 0,
      issuesRemaining: 0,
      resolutionRate: 0,
      focusAreas: []
    }

    console.log(`📊 Progress tracker initialized for session ${sessionId}`)
  }

  /**
   * Start a new refinement round
   */
  startRound(round: number, focusAreas: string[] = []): void {
    this.currentRound = round
    this.issueResolution.focusAreas = focusAreas

    const roundProgress: RoundProgress = {
      round,
      stage: RefinementStage.ANALYZING,
      status: `Starting round ${round}/${this.totalRounds}`,
      startTime: Date.now(),
      completionPercentage: 0
    }

    // Update or add round progress
    const existingIndex = this.roundProgresses.findIndex(rp => rp.round === round)
    if (existingIndex >= 0) {
      this.roundProgresses[existingIndex] = roundProgress
    } else {
      this.roundProgresses.push(roundProgress)
    }

    this.updateOverallProgress()

    console.log(`🔄 Started round ${round}/${this.totalRounds}`)
  }

  /**
   * Update the current stage and status
   */
  updateStage(stage: RefinementStage, status?: string): void {
    this.overallStage = stage

    if (status) {
      this.overallStatus = status
    } else {
      // Generate default status based on stage
      this.overallStatus = this.generateDefaultStatus(stage)
    }

    // Update current round progress if we're in a round
    if (this.currentRound > 0) {
      const currentRoundProgress = this.roundProgresses.find(rp => rp.round === this.currentRound)
      if (currentRoundProgress) {
        currentRoundProgress.stage = stage
        currentRoundProgress.status = this.overallStatus
        currentRoundProgress.completionPercentage = this.calculateRoundCompletionPercentage(stage)
        currentRoundProgress.estimatedTimeRemaining = this.estimateRoundTimeRemaining(currentRoundProgress)
      }
    }

    this.updateOverallProgress()
  }

  /**
   * Complete a refinement round
   */
  completeRound(
    round: number,
    endingScore: number,
    improvement: number,
    startingScore?: number
  ): void {
    const roundProgress = this.roundProgresses.find(rp => rp.round === round)
    if (!roundProgress) {
      console.warn(`Cannot complete round ${round}: round progress not found`)
      return
    }

    // Update round progress
    roundProgress.stage = RefinementStage.COMPLETED
    roundProgress.status = `Round ${round} completed: +${improvement} points`
    roundProgress.endTime = Date.now()
    roundProgress.endingScore = endingScore
    roundProgress.improvement = improvement
    roundProgress.completionPercentage = 100

    if (startingScore !== undefined) {
      roundProgress.startingScore = startingScore
    }

    // Update quality progression
    this.qualityProgression.currentScore = endingScore
    this.qualityProgression.scoreHistory.push({
      round,
      score: endingScore,
      improvement,
      timestamp: Date.now()
    })

    // Update projections
    this.updateQualityProjections()
    this.updateOverallProgress()

    console.log(`✅ Round ${round} completed: ${endingScore}/100 (+${improvement} points)`)
  }

  /**
   * Update issue resolution progress
   */
  updateIssueResolution(
    totalIssues: number,
    criticalResolved: number,
    importantResolved: number,
    minorResolved: number,
    remaining: number
  ): void {
    this.issueResolution.totalIssuesIdentified = totalIssues
    this.issueResolution.criticalIssuesResolved = criticalResolved
    this.issueResolution.importantIssuesResolved = importantResolved
    this.issueResolution.minorIssuesResolved = minorResolved
    this.issueResolution.issuesRemaining = remaining

    const totalResolved = criticalResolved + importantResolved + minorResolved
    this.issueResolution.resolutionRate = totalIssues > 0 ? (totalResolved / totalIssues) * 100 : 0

    this.updateOverallProgress()
  }

  /**
   * Mark session as completed
   */
  completeSession(targetAchieved: boolean, finalScore: number): void {
    this.targetAchieved = targetAchieved
    this.overallStage = RefinementStage.COMPLETED
    this.qualityProgression.currentScore = finalScore

    if (targetAchieved) {
      this.overallStatus = `Refinement completed successfully! Final score: ${finalScore}/100`
    } else {
      this.overallStatus = `Refinement completed. Final score: ${finalScore}/100 (Target: ${this.qualityProgression.targetScore}/100)`
    }

    this.updateOverallProgress()

    console.log(`🏁 Session completed: Target achieved: ${targetAchieved}, Final score: ${finalScore}`)
  }

  /**
   * Mark session as failed
   */
  failSession(error: string): void {
    this.error = error
    this.overallStage = RefinementStage.FAILED
    this.overallStatus = `Refinement failed: ${error}`
    this.updateOverallProgress()

    console.error(`❌ Session failed: ${error}`)
  }

  /**
   * Get current progress state
   */
  getProgress(): RefinementProgress {
    return {
      sessionId: this.sessionId,
      totalRounds: this.totalRounds,
      currentRound: this.currentRound,
      overallStage: this.overallStage,
      overallStatus: this.overallStatus,
      overallPercentage: this.calculateOverallPercentage(),
      timeElapsed: this.sessionStartTime > 0 ? Date.now() - this.sessionStartTime : 0,
      estimatedTimeRemaining: this.estimateTimeRemaining(),
      roundProgresses: [...this.roundProgresses],
      qualityProgression: { ...this.qualityProgression },
      issueResolution: { ...this.issueResolution },
      targetAchieved: this.targetAchieved,
      error: this.error
    }
  }

  /**
   * Get progress summary for UI display
   */
  getProgressSummary(): {
    stage: string
    status: string
    percentage: number
    timeElapsed: string
    currentScore?: number
    targetScore: number
    roundInfo: string
  } {
    const progress = this.getProgress()

    return {
      stage: this.formatStageForUI(progress.overallStage),
      status: progress.overallStatus,
      percentage: Math.round(progress.overallPercentage),
      timeElapsed: this.formatTime(progress.timeElapsed),
      currentScore: progress.qualityProgression.currentScore,
      targetScore: progress.qualityProgression.targetScore,
      roundInfo: `Round ${progress.currentRound}/${progress.totalRounds}`
    }
  }

  /**
   * Calculate overall completion percentage
   */
  private calculateOverallPercentage(): number {
    if (this.overallStage === RefinementStage.COMPLETED) {
      return 100
    }

    if (this.overallStage === RefinementStage.FAILED) {
      return 0
    }

    // Base progress on completed rounds + current round progress
    const completedRounds = this.roundProgresses.filter(rp => rp.stage === RefinementStage.COMPLETED).length
    const currentRoundProgress = this.currentRound > 0
      ? (this.roundProgresses.find(rp => rp.round === this.currentRound)?.completionPercentage || 0) / 100
      : 0

    const totalProgress = (completedRounds + currentRoundProgress) / this.totalRounds
    return Math.min(100, Math.max(0, totalProgress * 100))
  }

  /**
   * Calculate round completion percentage based on stage
   */
  private calculateRoundCompletionPercentage(stage: RefinementStage): number {
    const stagePercentages = {
      [RefinementStage.ANALYZING]: 20,
      [RefinementStage.GENERATING]: 50,
      [RefinementStage.VALIDATING]: 80,
      [RefinementStage.APPLYING]: 90,
      [RefinementStage.COMPLETED]: 100
    }

    return stagePercentages[stage] || 0
  }

  /**
   * Estimate time remaining for current round
   */
  private estimateRoundTimeRemaining(roundProgress: RoundProgress): number {
    if (roundProgress.completionPercentage >= 100) {
      return 0
    }

    const timeElapsed = Date.now() - roundProgress.startTime
    const progressRate = roundProgress.completionPercentage / 100

    if (progressRate <= 0) {
      return 120000 // Default 2 minutes if no progress yet
    }

    const estimatedTotalTime = timeElapsed / progressRate
    return Math.max(0, estimatedTotalTime - timeElapsed)
  }

  /**
   * Estimate total time remaining for session
   */
  private estimateTimeRemaining(): number {
    if (this.overallStage === RefinementStage.COMPLETED || this.overallStage === RefinementStage.FAILED) {
      return 0
    }

    // Calculate average time per completed round
    const completedRounds = this.roundProgresses.filter(rp => rp.endTime)
    if (completedRounds.length === 0) {
      // No completed rounds yet, estimate based on default
      const roundsRemaining = this.totalRounds - this.currentRound + 1
      return roundsRemaining * 90000 // 1.5 minutes per round default
    }

    const avgTimePerRound = completedRounds.reduce((sum, rp) => {
      return sum + (rp.endTime! - rp.startTime)
    }, 0) / completedRounds.length

    const roundsRemaining = this.totalRounds - completedRounds.length
    const currentRoundTimeRemaining = this.currentRound > 0
      ? (this.roundProgresses.find(rp => rp.round === this.currentRound)?.estimatedTimeRemaining || 0)
      : 0

    return (roundsRemaining - 1) * avgTimePerRound + currentRoundTimeRemaining
  }

  /**
   * Update quality projections
   */
  private updateQualityProjections(): void {
    if (this.qualityProgression.scoreHistory.length === 0) {
      return
    }

    // Calculate average improvement per round
    const improvements = this.qualityProgression.scoreHistory.map(h => h.improvement)
    const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length

    // Project final score based on remaining rounds
    const remainingRounds = this.totalRounds - this.qualityProgression.scoreHistory.length
    const currentScore = this.qualityProgression.currentScore || 0
    this.qualityProgression.projectedFinalScore = currentScore + (avgImprovement * remainingRounds)

    // Check if on track to target
    this.qualityProgression.onTrackToTarget =
      (this.qualityProgression.projectedFinalScore || 0) >= this.qualityProgression.targetScore
  }

  /**
   * Update overall progress calculations
   */
  private updateOverallProgress(): void {
    // This method is called after any progress update to recalculate derived values
    // Currently handled by other methods, but kept for future extensions
  }

  /**
   * Generate default status message for stage
   */
  private generateDefaultStatus(stage: RefinementStage): string {
    const stageMessages = {
      [RefinementStage.INITIALIZING]: 'Initializing refinement session...',
      [RefinementStage.ANALYZING]: 'Analyzing content and identifying issues...',
      [RefinementStage.GENERATING]: 'Generating improved content...',
      [RefinementStage.VALIDATING]: 'Validating improvements...',
      [RefinementStage.APPLYING]: 'Applying content changes...',
      [RefinementStage.COMPLETING]: 'Finalizing refinement...',
      [RefinementStage.COMPLETED]: 'Refinement completed successfully',
      [RefinementStage.FAILED]: 'Refinement failed'
    }

    return stageMessages[stage] || 'Processing...'
  }

  /**
   * Format stage for UI display
   */
  private formatStageForUI(stage: RefinementStage): string {
    const stageNames = {
      [RefinementStage.INITIALIZING]: 'Initializing',
      [RefinementStage.ANALYZING]: 'Analyzing',
      [RefinementStage.GENERATING]: 'Generating',
      [RefinementStage.VALIDATING]: 'Validating',
      [RefinementStage.APPLYING]: 'Applying',
      [RefinementStage.COMPLETING]: 'Completing',
      [RefinementStage.COMPLETED]: 'Completed',
      [RefinementStage.FAILED]: 'Failed'
    }

    return stageNames[stage] || 'Processing'
  }

  /**
   * Format time duration for display
   */
  private formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${remainingSeconds}s`
    }
  }

  /**
   * Reset tracker for new session
   */
  reset(): void {
    this.sessionId = ''
    this.totalRounds = 3
    this.currentRound = 0
    this.sessionStartTime = 0
    this.roundProgresses = []
    this.overallStage = RefinementStage.INITIALIZING
    this.overallStatus = ''
    this.targetAchieved = false
    this.error = undefined

    this.qualityProgression = {
      targetScore: 80,
      scoreHistory: [],
      onTrackToTarget: true
    }

    this.issueResolution = {
      totalIssuesIdentified: 0,
      criticalIssuesResolved: 0,
      importantIssuesResolved: 0,
      minorIssuesResolved: 0,
      issuesRemaining: 0,
      resolutionRate: 0,
      focusAreas: []
    }
  }
}

/**
 * Create a new progress tracker instance
 */
export function createProgressTracker(): ProgressTracker {
  return new ProgressTracker()
}

/**
 * Progress event emitter for real-time updates
 */
export class ProgressEventEmitter {
  private listeners: Array<(progress: RefinementProgress) => void> = []

  /**
   * Subscribe to progress updates
   */
  subscribe(callback: (progress: RefinementProgress) => void): () => void {
    this.listeners.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  /**
   * Emit progress update to all subscribers
   */
  emit(progress: RefinementProgress): void {
    this.listeners.forEach(callback => {
      try {
        callback(progress)
      } catch (error) {
        console.error('Progress callback error:', error)
      }
    })
  }

  /**
   * Clear all subscribers
   */
  clear(): void {
    this.listeners = []
  }
}