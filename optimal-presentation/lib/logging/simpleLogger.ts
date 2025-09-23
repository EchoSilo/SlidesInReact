/**
 * Simplified logging system for immediate use
 * Avoids compilation issues while providing transparency
 */

interface SimpleLogEntry {
  generationId: string
  timestamp: number
  step: string
  status: 'started' | 'completed' | 'failed'
  details?: any
  error?: string
}

interface FrameworkSelection {
  framework: string
  confidence: number
  rationale: string
}

interface LLMCall {
  model: string
  promptLength: number
  responseLength: number
  duration: number
  success: boolean
  tokensUsed?: number
}

interface FallbackUsage {
  component: string
  reason: string
  method: string
  impact: 'none' | 'minor' | 'moderate' | 'significant'
}

class SimpleLogger {
  private logs: Map<string, {
    entries: SimpleLogEntry[]
    framework?: FrameworkSelection
    llmCalls: LLMCall[]
    fallbacks: FallbackUsage[]
    startTime: number
  }> = new Map()

  startGeneration(generationId: string): void {
    this.logs.set(generationId, {
      entries: [],
      llmCalls: [],
      fallbacks: [],
      startTime: Date.now()
    })

    console.log(`🚀 Generation started: ${generationId}`)
    this.logStep(generationId, 'initialization', 'started')
  }

  logStep(generationId: string, step: string, status: 'started' | 'completed' | 'failed', details?: any, error?: string): void {
    const log = this.logs.get(generationId)
    if (!log) return

    const entry: SimpleLogEntry = {
      generationId,
      timestamp: Date.now(),
      step,
      status,
      details,
      error
    }

    log.entries.push(entry)

    const emoji = status === 'started' ? '🔄' : status === 'completed' ? '✅' : '❌'
    console.log(`${emoji} ${step}: ${status}`, details ? JSON.stringify(details, null, 2) : '')

    if (error) {
      console.error(`Error in ${step}:`, error)
    }
  }

  logFramework(generationId: string, framework: string, confidence: number, rationale: string): void {
    const log = this.logs.get(generationId)
    if (!log) return

    log.framework = { framework, confidence, rationale }
    console.log(`🧭 Framework selected: ${framework} (${confidence}% confidence)`)
    console.log(`📋 Rationale: ${rationale}`)
  }

  logLLMCall(generationId: string, model: string, promptLength: number, responseLength: number,
             duration: number, success: boolean, tokensUsed?: number): void {
    const log = this.logs.get(generationId)
    if (!log) return

    const llmCall: LLMCall = {
      model,
      promptLength,
      responseLength,
      duration,
      success,
      tokensUsed
    }

    log.llmCalls.push(llmCall)
    console.log(`🤖 LLM Call: ${model}`)
    console.log(`📊 ${promptLength} chars → ${responseLength} chars (${duration}ms)`)
    if (tokensUsed) {
      console.log(`🎯 Tokens: ${tokensUsed}`)
    }
  }

  logFallback(generationId: string, component: string, reason: string, method: string,
              impact: 'none' | 'minor' | 'moderate' | 'significant'): void {
    const log = this.logs.get(generationId)
    if (!log) return

    const fallback: FallbackUsage = { component, reason, method, impact }
    log.fallbacks.push(fallback)

    const emoji = impact === 'none' ? '💚' : impact === 'minor' ? '💛' : impact === 'moderate' ? '🧡' : '🔴'
    console.log(`${emoji} FALLBACK: ${component} - ${reason}`)
    console.log(`🔄 Using: ${method}`)
  }

  completeGeneration(generationId: string, success: boolean, message?: string): any {
    const log = this.logs.get(generationId)
    if (!log) return null

    const totalDuration = Date.now() - log.startTime
    const status = success ? '🎉' : '💥'

    console.log(`${status} Generation ${success ? 'completed' : 'failed'}: ${generationId} (${totalDuration}ms)`)

    if (message) {
      console.log(`📝 ${message}`)
    }

    // Summary
    console.log('\n📊 GENERATION SUMMARY')
    console.log('=====================')
    console.log(`🎯 Generation ID: ${generationId}`)
    console.log(`⏱️ Duration: ${totalDuration}ms`)
    console.log(`🤖 LLM Calls: ${log.llmCalls.length}`)
    console.log(`🔄 Fallbacks: ${log.fallbacks.length}`)

    if (log.framework) {
      console.log(`🧭 Framework: ${log.framework.framework} (${log.framework.confidence}%)`)
    }

    if (log.fallbacks.length > 0) {
      console.log('⚠️ Fallbacks used:')
      log.fallbacks.forEach(f => {
        console.log(`  - ${f.component}: ${f.reason} (${f.impact} impact)`)
      })
    }

    console.log('=====================\n')

    return {
      generationId,
      totalDuration,
      framework: log.framework,
      llmCalls: log.llmCalls,
      fallbacks: log.fallbacks,
      success
    }
  }

  getTransparencyData(generationId: string): any {
    const log = this.logs.get(generationId)
    if (!log) return null

    return {
      generationId,
      framework: log.framework,
      llmCalls: log.llmCalls,
      fallbacks: log.fallbacks,
      entries: log.entries
    }
  }
}

// Global instance
export const simpleLogger = new SimpleLogger()

// Convenience functions
export const logGenerationStart = (id: string) => simpleLogger.startGeneration(id)
export const logStep = (id: string, step: string, status: 'started' | 'completed' | 'failed', details?: any, error?: string) =>
  simpleLogger.logStep(id, step, status, details, error)
export const logFrameworkSelection = (id: string, framework: string, confidence: number, rationale: string) =>
  simpleLogger.logFramework(id, framework, confidence, rationale)
export const logLLMCall = (id: string, model: string, promptLength: number, responseLength: number, duration: number, success: boolean, tokensUsed?: number) =>
  simpleLogger.logLLMCall(id, model, promptLength, responseLength, duration, success, tokensUsed)
export const logFallback = (id: string, component: string, reason: string, method: string, impact: 'none' | 'minor' | 'moderate' | 'significant') =>
  simpleLogger.logFallback(id, component, reason, method, impact)
export const completeGeneration = (id: string, success: boolean, message?: string) =>
  simpleLogger.completeGeneration(id, success, message)