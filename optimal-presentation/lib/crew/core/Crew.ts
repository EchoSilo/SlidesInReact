/**
 * CrewAI-inspired Crew implementation for orchestrating agents and tasks
 */

import { Agent } from './Agent'
import { Task } from './Task'
import { CrewConfig, CrewResult, TaskResult } from './types'

export class Crew {
  constructor(public config: CrewConfig) {}

  async kickoff(context?: any): Promise<CrewResult> {
    const startTime = Date.now()
    const results: TaskResult[] = []

    console.log(`🚀 Starting crew execution with ${this.config.tasks.length} tasks`)

    try {
      for (let i = 0; i < this.config.tasks.length; i++) {
        const task = this.config.tasks[i]
        const agent = task.agent || this.config.agents[i % this.config.agents.length]

        if (!agent) {
          throw new Error(`No agent available for task ${i}`)
        }

        console.log(`🔄 Executing task ${i + 1}/${this.config.tasks.length}`)

        // Execute task with accumulated context from previous tasks
        const taskContext = {
          ...context,
          previousResults: results,
          taskIndex: i,
          totalTasks: this.config.tasks.length
        }

        const result = await task.execute(agent, taskContext)
        results.push(result)

        if (!result.success) {
          console.error(`❌ Task ${i + 1} failed, stopping crew execution`)
          break
        }

        if (this.config.verbose) {
          console.log(`📄 Task ${i + 1} result:`, result.output.substring(0, 200) + '...')
        }
      }

      const totalTime = Date.now() - startTime
      const success = results.every(r => r.success)

      console.log(`${success ? '✅' : '❌'} Crew execution completed in ${totalTime}ms`)

      return {
        results,
        success,
        totalTime
      }
    } catch (error) {
      const totalTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      console.error(`💥 Crew execution failed: ${errorMessage}`)

      return {
        results,
        success: false,
        totalTime,
        error: errorMessage
      }
    }
  }

  addAgent(agent: Agent): void {
    this.config.agents.push(agent)
  }

  addTask(task: Task): void {
    this.config.tasks.push(task)
  }

  getAgentByName(name: string): Agent | undefined {
    return this.config.agents.find(agent => agent.config.name === name)
  }
}