/**
 * CrewAI-inspired Task implementation
 */

import { Agent } from './Agent'
import { TaskConfig, TaskResult } from './types'

export class Task {
  public agent?: Agent

  constructor(public config: TaskConfig) {
    this.agent = config.agent
  }

  async execute(agent: Agent, context?: any): Promise<TaskResult> {
    if (!agent) {
      throw new Error('No agent assigned to execute this task')
    }

    console.log(`📋 Starting task: ${this.config.description}`)

    const result = await agent.execute(this.config.description, context)

    // Validate expected output if specified
    if (this.config.expectedOutput && result.success) {
      const meetsExpectations = this.validateOutput(result.output)
      if (!meetsExpectations) {
        console.warn(`⚠️ Task output may not meet expectations: ${this.config.expectedOutput}`)
      }
    }

    return result
  }

  private validateOutput(output: string): boolean {
    // Simple validation - check if output is not empty and has reasonable length
    return output.trim().length > 10
  }

  assignAgent(agent: Agent): void {
    this.agent = agent
    this.config.agent = agent
  }
}