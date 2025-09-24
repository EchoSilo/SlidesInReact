import { writeFileSync, appendFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

export interface WorkflowLogEntry {
  timestamp: string
  generationId: string
  step: string
  type: 'info' | 'success' | 'warning' | 'error' | 'llm_request' | 'llm_response' | 'decision' | 'agent_action'
  message: string
  data?: any
  duration?: number
  agent?: {
    name: string
    role?: string
    type: 'validation' | 'framework' | 'content' | 'crew' | 'refinement' | 'analysis'
  }
}

export class WorkflowLogger {
  private logs: WorkflowLogEntry[] = []
  private generationId: string
  private startTime: number
  private logDir: string
  private logFile: string

  constructor(generationId: string) {
    this.generationId = generationId
    this.startTime = Date.now()

    // Create log directory structure
    this.logDir = join(process.cwd(), 'logs', 'workflow')
    this.logFile = join(this.logDir, `${generationId}.json`)

    this.ensureLogDirectory()
    this.initializeLogFile()
  }

  private ensureLogDirectory() {
    if (!existsSync(this.logDir)) {
      mkdirSync(this.logDir, { recursive: true })
    }
  }

  private initializeLogFile() {
    const initialLog = {
      generationId: this.generationId,
      startTime: new Date().toISOString(),
      logs: []
    }
    writeFileSync(this.logFile, JSON.stringify(initialLog, null, 2))
  }

  private writeToFile(entry: WorkflowLogEntry) {
    try {
      // Read current file content using readFileSync instead of require
      const fileContent = readFileSync(this.logFile, 'utf-8')
      const currentContent = JSON.parse(fileContent)
      currentContent.logs.push(entry)

      // Write back to file with complete, untruncated data
      writeFileSync(this.logFile, JSON.stringify(currentContent, null, 2))
    } catch (error) {
      // Fallback: append to a simple log file if JSON parsing fails
      const logLine = `${new Date().toISOString()} [${entry.type.toUpperCase()}] ${entry.step}: ${entry.message}\n${entry.data ? JSON.stringify(entry.data, null, 2) : ''}\n---\n`
      appendFileSync(this.logFile.replace('.json', '.log'), logLine)
    }
  }

  private log(step: string, type: WorkflowLogEntry['type'], message: string, data?: any, duration?: number, agent?: WorkflowLogEntry['agent']) {
    const entry: WorkflowLogEntry = {
      timestamp: new Date().toISOString(),
      generationId: this.generationId,
      step,
      type,
      message,
      data,
      duration,
      agent
    }

    this.logs.push(entry)

    // Write complete, untruncated log to file
    this.writeToFile(entry)

    // Also log to console for immediate visibility (but keep it brief)
    const emoji = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      llm_request: '🤖➡️',
      llm_response: '🤖⬅️',
      decision: '🧭',
      agent_action: '🎭'
    }[type]

    const agentPrefix = agent ? `[${agent.name}]` : ''
    console.log(`${emoji} ${agentPrefix} [${step}] ${message} (Full details in: ${this.logFile})`)
  }

  info(step: string, message: string, data?: any) {
    this.log(step, 'info', message, data)
  }

  success(step: string, message: string, data?: any, duration?: number) {
    this.log(step, 'success', message, data, duration)
  }

  warning(step: string, message: string, data?: any) {
    this.log(step, 'warning', message, data)
  }

  error(step: string, message: string, data?: any) {
    this.log(step, 'error', message, data)
  }

  llmRequest(step: string, prompt: string, model: string, config?: any, agent?: WorkflowLogEntry['agent']) {
    this.log(step, 'llm_request', `Sending request to ${model}`, {
      prompt_length: prompt.length,
      prompt_preview: prompt.substring(0, 200) + '...',
      prompt_full: prompt, // Store complete prompt without truncation
      model,
      config
    }, undefined, agent)
  }

  llmResponse(step: string, response: any, duration: number, agent?: WorkflowLogEntry['agent']) {
    const responseText = response?.content?.[0]?.text || response?.text || ''
    this.log(step, 'llm_response', `Received response from LLM`, {
      response_length: responseText.length,
      response_preview: responseText.substring(0, 200) + '...',
      response_full: responseText, // Store complete response without truncation
      tokens_used: response?.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : 'unknown',
      full_response_object: response // Store complete response object for debugging
    }, duration, agent)
  }

  // Agent-specific logging methods
  agentAction(step: string, agentName: string, agentType: WorkflowLogEntry['agent']['type'], action: string, data?: any, duration?: number) {
    const agent = { name: agentName, type: agentType }
    this.log(step, 'agent_action', `Agent ${agentName} ${action}`, data, duration, agent)
  }

  agentLlmRequest(step: string, agentName: string, agentType: WorkflowLogEntry['agent']['type'], agentRole: string, prompt: string, model: string, config?: any) {
    const agent = { name: agentName, type: agentType, role: agentRole }
    this.log(step, 'llm_request', `Agent ${agentName} sending request to ${model}`, {
      prompt_length: prompt.length,
      prompt_preview: prompt.substring(0, 200) + '...',
      prompt_full: prompt,
      model,
      config,
      agent_role: agentRole
    }, undefined, agent)
  }

  agentLlmResponse(step: string, agentName: string, agentType: WorkflowLogEntry['agent']['type'], agentRole: string, response: any, duration: number) {
    const agent = { name: agentName, type: agentType, role: agentRole }
    const responseText = response?.content?.[0]?.text || response?.text || ''
    this.log(step, 'llm_response', `Agent ${agentName} received response from LLM`, {
      response_length: responseText.length,
      response_preview: responseText.substring(0, 200) + '...',
      response_full: responseText,
      tokens_used: response?.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : 'unknown',
      full_response_object: response,
      agent_role: agentRole
    }, duration, agent)
  }

  decision(step: string, decision: string, rationale: string, data?: any) {
    this.log(step, 'decision', `Decision made: ${decision}`, {
      rationale,
      ...data
    })
  }

  getElapsedTime(): number {
    return Date.now() - this.startTime
  }

  getAllLogs(): WorkflowLogEntry[] {
    return [...this.logs]
  }

  getLogsByType(type: WorkflowLogEntry['type']): WorkflowLogEntry[] {
    return this.logs.filter(log => log.type === type)
  }

  getSummary() {
    const totalDuration = this.getElapsedTime()
    const errorCount = this.logs.filter(l => l.type === 'error').length
    const warningCount = this.logs.filter(l => l.type === 'warning').length
    const llmRequestCount = this.logs.filter(l => l.type === 'llm_request').length
    const decisionCount = this.logs.filter(l => l.type === 'decision').length

    return {
      generationId: this.generationId,
      totalDuration,
      totalLogs: this.logs.length,
      errorCount,
      warningCount,
      llmRequestCount,
      decisionCount,
      steps: [...new Set(this.logs.map(l => l.step))]
    }
  }

  exportLogs(): string {
    return JSON.stringify({
      summary: this.getSummary(),
      logs: this.logs
    }, null, 2)
  }

  getLogFilePath(): string {
    return this.logFile
  }

  finalizeLogFile() {
    try {
      // Read current file and add final summary using readFileSync
      const fileContent = readFileSync(this.logFile, 'utf-8')
      const currentContent = JSON.parse(fileContent)
      currentContent.summary = this.getSummary()
      currentContent.endTime = new Date().toISOString()

      // Write final version
      writeFileSync(this.logFile, JSON.stringify(currentContent, null, 2))

      console.log(`📁 Complete workflow log saved to: ${this.logFile}`)
    } catch (error) {
      console.error('Failed to finalize log file:', error)
    }
  }
}