/**
 * Centralized logging system for presentation generation
 * Provides multi-level transparency: technical, user-facing, and analytics
 */

export interface LogContext {
  generationId: string
  sessionId?: string
  userId?: string
  timestamp: number
}

export interface GenerationStep {
  step: string
  status: 'started' | 'completed' | 'failed' | 'skipped'
  startTime: number
  endTime?: number
  duration?: number
  details?: Record<string, any>
  error?: string
}

export interface FrameworkAnalysis {
  selectedFramework: string
  confidence: number
  rationale: string
  alternatives: Array<{
    framework: string
    score: number
    reason: string
  }>
}

export interface LLMInteraction {
  model: string
  promptType: string
  promptLength: number
  responseLength: number
  tokensUsed?: number
  temperature: number
  duration: number
  success: boolean
  error?: string
  // Sanitized versions for user transparency
  promptSummary: string
  responsePreview: string
}

export interface FallbackEvent {
  component: string
  reason: string
  fallbackMethod: string
  impact: 'none' | 'minor' | 'moderate' | 'significant'
  userMessage: string
}

export interface ValidationResults {
  pipelineUsed: 'llm' | 'rule-based' | 'hybrid'
  initialScore: number
  finalScore: number
  improvement: number
  roundsCompleted: number
  issues: Array<{
    severity: string
    category: string
    description: string
  }>
}

export interface GenerationLog {
  context: LogContext
  steps: GenerationStep[]
  frameworkAnalysis?: FrameworkAnalysis
  llmInteractions: LLMInteraction[]
  fallbackEvents: FallbackEvent[]
  validationResults?: ValidationResults
  userFacingInsights: {
    processingSummary: string
    qualityIndicators: Record<string, number>
    recommendations: string[]
    transparencyNotes: string[]
  }
  technicalMetrics: {
    totalDuration: number
    apiCalls: number
    errorCount: number
    performanceFlags: string[]
  }
}

export class PresentationLogger {
  private logs: Map<string, GenerationLog> = new Map()
  private currentContext: LogContext | null = null

  /**
   * Initialize a new generation session
   */
  startGeneration(generationId: string, userId?: string): LogContext {
    const context: LogContext = {
      generationId,
      userId,
      timestamp: Date.now(),
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    const log: GenerationLog = {
      context,
      steps: [],
      llmInteractions: [],
      fallbackEvents: [],
      userFacingInsights: {
        processingSummary: 'Generation started',
        qualityIndicators: {},
        recommendations: [],
        transparencyNotes: []
      },
      technicalMetrics: {
        totalDuration: 0,
        apiCalls: 0,
        errorCount: 0,
        performanceFlags: []
      }
    }

    this.logs.set(generationId, log)
    this.currentContext = context

    this.logStep('initialization', 'started', {
      requestReceived: new Date().toISOString()
    })

    console.log(`🚀 Generation started: ${generationId}`)
    return context
  }

  /**
   * Log a processing step
   */
  logStep(step: string, status: GenerationStep['status'], details?: Record<string, any>, error?: string): void {
    if (!this.currentContext) return

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return

    const existingStep = log.steps.find(s => s.step === step && s.status === 'started')

    if (existingStep && status === 'completed') {
      // Complete existing step
      existingStep.status = status
      existingStep.endTime = Date.now()
      existingStep.duration = existingStep.endTime - existingStep.startTime
      existingStep.details = { ...existingStep.details, ...details }

      console.log(`✅ Step completed: ${step} (${existingStep.duration}ms)`)
    } else if (existingStep && status === 'failed') {
      // Fail existing step
      existingStep.status = status
      existingStep.endTime = Date.now()
      existingStep.duration = existingStep.endTime - existingStep.startTime
      existingStep.error = error
      log.technicalMetrics.errorCount++

      console.log(`❌ Step failed: ${step} - ${error}`)
    } else {
      // Start new step
      const newStep: GenerationStep = {
        step,
        status,
        startTime: Date.now(),
        details: details || {},
        error
      }

      if (status !== 'started') {
        newStep.endTime = newStep.startTime
        newStep.duration = 0
      }

      log.steps.push(newStep)

      const statusEmoji = status === 'started' ? '🔄' : status === 'failed' ? '❌' : status === 'skipped' ? '⏭️' : '✅'
      console.log(`${statusEmoji} Step ${status}: ${step}`, details ? `- ${JSON.stringify(details)}` : '')
    }
  }

  /**
   * Log framework analysis results
   */
  logFrameworkAnalysis(analysis: FrameworkAnalysis): void {
    if (!this.currentContext) return

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return

    log.frameworkAnalysis = analysis
    log.userFacingInsights.transparencyNotes.push(
      `Selected ${analysis.selectedFramework} framework (${analysis.confidence}% confidence): ${analysis.rationale}`
    )

    console.log(`🧭 Framework selected: ${analysis.selectedFramework} (${analysis.confidence}% confidence)`)
    console.log(`📋 Rationale: ${analysis.rationale}`)

    if (analysis.alternatives.length > 0) {
      console.log('🔄 Alternatives considered:', analysis.alternatives)
    }
  }

  /**
   * Log LLM interaction details
   */
  logLLMInteraction(interaction: Omit<LLMInteraction, 'promptSummary' | 'responsePreview'>,
                   fullPrompt: string, fullResponse: string): void {
    if (!this.currentContext) return

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return

    // Create sanitized versions for user transparency
    const promptSummary = this.sanitizePrompt(fullPrompt)
    const responsePreview = this.sanitizeResponse(fullResponse)

    const fullInteraction: LLMInteraction = {
      ...interaction,
      promptSummary,
      responsePreview
    }

    log.llmInteractions.push(fullInteraction)
    log.technicalMetrics.apiCalls++

    if (!interaction.success) {
      log.technicalMetrics.errorCount++
    }

    console.log(`🤖 LLM ${interaction.promptType}: ${interaction.model}`)
    console.log(`📊 Request: ${interaction.promptLength} chars → Response: ${interaction.responseLength} chars (${interaction.duration}ms)`)

    if (interaction.tokensUsed) {
      console.log(`🎯 Tokens used: ${interaction.tokensUsed}`)
    }

    // Log full prompt and response for debugging (with potential sanitization)
    console.log('📝 Full Prompt:', fullPrompt.substring(0, 500) + (fullPrompt.length > 500 ? '...' : ''))
    console.log('💬 Full Response:', fullResponse.substring(0, 500) + (fullResponse.length > 500 ? '...' : ''))

    log.userFacingInsights.transparencyNotes.push(
      `Generated content using ${interaction.model} (${interaction.duration}ms, ${interaction.responseLength} chars)`
    )
  }

  /**
   * Log fallback events
   */
  logFallback(event: FallbackEvent): void {
    if (!this.currentContext) return

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return

    log.fallbackEvents.push(event)

    const impactEmoji = {
      'none': '💚',
      'minor': '💛',
      'moderate': '🧡',
      'significant': '🔴'
    }[event.impact]

    console.log(`${impactEmoji} FALLBACK: ${event.component} - ${event.reason}`)
    console.log(`🔄 Using: ${event.fallbackMethod}`)
    console.log(`📢 User message: ${event.userMessage}`)

    // Add to user-facing insights based on impact
    if (event.impact !== 'none') {
      log.userFacingInsights.transparencyNotes.push(event.userMessage)
    }

    // Flag performance issues
    if (event.impact === 'moderate' || event.impact === 'significant') {
      log.technicalMetrics.performanceFlags.push(`${event.component}_fallback`)
    }
  }

  /**
   * Log validation results
   */
  logValidation(results: ValidationResults): void {
    if (!this.currentContext) return

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return

    log.validationResults = results
    log.userFacingInsights.qualityIndicators = {
      'Content Quality': results.finalScore,
      'Improvement': results.improvement,
      'Validation Rounds': results.roundsCompleted
    }

    console.log(`🔍 Validation completed using ${results.pipelineUsed} pipeline`)
    console.log(`📈 Quality: ${results.initialScore} → ${results.finalScore} (+${results.improvement})`)
    console.log(`🔄 Rounds: ${results.roundsCompleted}`)

    if (results.issues.length > 0) {
      console.log('⚠️ Issues identified:', results.issues)
    }

    const pipelineDisplay = {
      'llm': 'AI-powered analysis',
      'rule-based': 'Backup analysis method',
      'hybrid': 'Combined analysis'
    }[results.pipelineUsed]

    log.userFacingInsights.transparencyNotes.push(
      `Content validated using ${pipelineDisplay} (${results.roundsCompleted} rounds, ${results.improvement} point improvement)`
    )
  }

  /**
   * Complete the generation and calculate final metrics
   */
  completeGeneration(success: boolean, finalMessage?: string): GenerationLog | null {
    if (!this.currentContext) return null

    const log = this.logs.get(this.currentContext.generationId)
    if (!log) return null

    // Calculate total duration
    log.technicalMetrics.totalDuration = Date.now() - log.context.timestamp

    // Generate final summary
    if (success) {
      log.userFacingInsights.processingSummary = finalMessage || 'Generation completed successfully'
      console.log(`🎉 Generation completed: ${this.currentContext.generationId} (${log.technicalMetrics.totalDuration}ms)`)
    } else {
      log.userFacingInsights.processingSummary = finalMessage || 'Generation failed'
      console.log(`💥 Generation failed: ${this.currentContext.generationId}`)
    }

    // Generate recommendations based on the process
    this.generateRecommendations(log)

    // Log final summary
    this.logFinalSummary(log)

    this.currentContext = null
    return log
  }

  /**
   * Get transparency data for user
   */
  getTransparencyData(generationId: string): GenerationLog | null {
    return this.logs.get(generationId) || null
  }

  /**
   * Get all logs (for analytics)
   */
  getAllLogs(): GenerationLog[] {
    return Array.from(this.logs.values())
  }

  /**
   * Clear old logs to prevent memory leaks
   */
  clearOldLogs(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge
    for (const [id, log] of this.logs.entries()) {
      if (log.context.timestamp < cutoff) {
        this.logs.delete(id)
      }
    }
  }

  private sanitizePrompt(prompt: string): string {
    // Extract key information while removing sensitive data
    const lines = prompt.split('\n').slice(0, 5) // First 5 lines
    return lines.join('\n').substring(0, 200) + (prompt.length > 200 ? '...' : '')
  }

  private sanitizeResponse(response: string): string {
    // Show beginning of response for transparency
    return response.substring(0, 300) + (response.length > 300 ? '...' : '')
  }

  private generateRecommendations(log: GenerationLog): void {
    const recommendations: string[] = []

    // Analyze performance
    if (log.technicalMetrics.totalDuration > 30000) {
      recommendations.push('Consider breaking down complex requests for faster processing')
    }

    // Analyze fallbacks
    const significantFallbacks = log.fallbackEvents.filter(f => f.impact === 'significant' || f.impact === 'moderate')
    if (significantFallbacks.length > 0) {
      recommendations.push('Some advanced features used backup methods - consider simplifying your request')
    }

    // Analyze validation
    if (log.validationResults && log.validationResults.finalScore < 70) {
      recommendations.push('Try providing more specific requirements to improve content quality')
    }

    // Analyze framework
    if (log.frameworkAnalysis && log.frameworkAnalysis.confidence < 80) {
      recommendations.push('Consider specifying your presentation type more clearly for better framework selection')
    }

    log.userFacingInsights.recommendations = recommendations
  }

  private logFinalSummary(log: GenerationLog): void {
    console.log('\n📊 GENERATION SUMMARY')
    console.log('=====================')
    console.log(`🎯 Generation ID: ${log.context.generationId}`)
    console.log(`⏱️ Total Duration: ${log.technicalMetrics.totalDuration}ms`)
    console.log(`🔧 API Calls: ${log.technicalMetrics.apiCalls}`)
    console.log(`❌ Errors: ${log.technicalMetrics.errorCount}`)
    console.log(`📋 Steps Completed: ${log.steps.filter(s => s.status === 'completed').length}`)

    if (log.fallbackEvents.length > 0) {
      console.log(`🔄 Fallbacks Used: ${log.fallbackEvents.length}`)
    }

    if (log.validationResults) {
      console.log(`📈 Quality Score: ${log.validationResults.finalScore}/100`)
    }

    if (log.technicalMetrics.performanceFlags.length > 0) {
      console.log(`⚠️ Performance Flags: ${log.technicalMetrics.performanceFlags.join(', ')}`)
    }

    console.log('=====================\n')
  }
}

// Global logger instance
export const presentationLogger = new PresentationLogger()

// Utility functions for common logging patterns
export const logGenerationStart = (generationId: string, userId?: string) =>
  presentationLogger.startGeneration(generationId, userId)

export const logFrameworkSelection = (framework: string, confidence: number, rationale: string, alternatives: any[] = []) =>
  presentationLogger.logFrameworkAnalysis({ selectedFramework: framework, confidence, rationale, alternatives })

export const logLLMCall = (
  model: string,
  promptType: string,
  prompt: string,
  response: string,
  duration: number,
  success: boolean = true,
  error?: string,
  tokensUsed?: number,
  temperature: number = 0.7
) => presentationLogger.logLLMInteraction({
  model,
  promptType,
  promptLength: prompt.length,
  responseLength: response.length,
  tokensUsed,
  temperature,
  duration,
  success,
  error
}, prompt, response)

export const logFallbackUsed = (
  component: string,
  reason: string,
  fallbackMethod: string,
  impact: FallbackEvent['impact'] = 'minor',
  userMessage?: string
) => presentationLogger.logFallback({
  component,
  reason,
  fallbackMethod,
  impact,
  userMessage: userMessage || `Using ${fallbackMethod} due to ${reason}`
})

export const logValidationComplete = (
  pipelineUsed: ValidationResults['pipelineUsed'],
  initialScore: number,
  finalScore: number,
  roundsCompleted: number,
  issues: ValidationResults['issues'] = []
) => presentationLogger.logValidation({
  pipelineUsed,
  initialScore,
  finalScore,
  improvement: finalScore - initialScore,
  roundsCompleted,
  issues
})