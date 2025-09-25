/**
 * CrewAI-inspired Agent implementation using existing Anthropic client
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { WorkflowLogger } from '@/lib/workflow-logger'
import { AgentConfig, TaskResult } from './types'

export class Agent {
  private client: Anthropic
  private logger?: WorkflowLogger

  constructor(
    public config: AgentConfig,
    apiKey: string,
    logger?: WorkflowLogger
  ) {
    this.client = createAnthropicClient(apiKey)
    this.logger = logger
  }

  async execute(taskDescription: string, context?: any): Promise<TaskResult> {
    const startTime = Date.now()

    try {
      const prompt = this.buildPrompt(taskDescription, context)
      const model = 'claude-3-5-sonnet-20241022'

      // Log agent action start
      if (this.logger) {
        this.logger.agentAction('AGENT_EXECUTE', this.config.name, 'crew', 'started task execution', {
          task: taskDescription,
          context: context ? Object.keys(context) : undefined
        })

        // Log LLM request with agent context
        this.logger.agentLlmRequest('AGENT_LLM_REQUEST', this.config.name, 'crew', this.config.role, prompt, model, {
          max_tokens: 8192,
          temperature: 0.1
        })
      } else {
        console.log(`🤖 [${this.config.name}] Executing task: ${taskDescription}`)
      }

      const response = await this.client.messages.create({
        model,
        max_tokens: 8192,
        temperature: 0.1,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const output = response.content[0]?.type === 'text' ? response.content[0].text : ''
      const executionTime = Date.now() - startTime

      // Log LLM response with agent context
      if (this.logger) {
        this.logger.agentLlmResponse('AGENT_LLM_RESPONSE', this.config.name, 'crew', this.config.role, response, executionTime)

        this.logger.agentAction('AGENT_EXECUTE', this.config.name, 'crew', 'completed task successfully', {
          task: taskDescription,
          output_length: output.length,
          execution_time: executionTime
        }, executionTime)
      } else {
        console.log(`✅ [${this.config.name}] Task completed in ${executionTime}ms`)
      }

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

      // Log agent error
      if (this.logger) {
        this.logger.agentAction('AGENT_EXECUTE', this.config.name, 'crew', 'failed task execution', {
          task: taskDescription,
          error: errorMessage,
          execution_time: executionTime
        }, executionTime)
      } else {
        console.error(`❌ [${this.config.name}] Task failed: ${errorMessage}`)
      }

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