/**
 * CrewAI-inspired Agent implementation using existing Anthropic client
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { AgentConfig, TaskResult } from './types'

export class Agent {
  private client: Anthropic

  constructor(
    public config: AgentConfig,
    apiKey: string
  ) {
    this.client = createAnthropicClient(apiKey)
  }

  async execute(taskDescription: string, context?: any): Promise<TaskResult> {
    const startTime = Date.now()

    try {
      const prompt = this.buildPrompt(taskDescription, context)

      console.log(`🤖 [${this.config.name}] Executing task: ${taskDescription}`)

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.1,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const output = response.content[0]?.type === 'text' ? response.content[0].text : ''
      const executionTime = Date.now() - startTime

      console.log(`✅ [${this.config.name}] Task completed in ${executionTime}ms`)

      return {
        output,
        agent: this.config.name,
        task: taskDescription,
        success: true,
        executionTime
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      console.error(`❌ [${this.config.name}] Task failed: ${errorMessage}`)

      return {
        output: '',
        agent: this.config.name,
        task: taskDescription,
        success: false,
        error: errorMessage,
        executionTime
      }
    }
  }

  private buildPrompt(taskDescription: string, context?: any): string {
    return `You are ${this.config.name}, a ${this.config.role}.

ROLE: ${this.config.role}
GOAL: ${this.config.goal}
BACKSTORY: ${this.config.backstory}

TASK: ${taskDescription}

${context ? `CONTEXT: ${JSON.stringify(context, null, 2)}` : ''}

Please complete this task according to your role and goal. Provide a clear, actionable response.`
  }
}