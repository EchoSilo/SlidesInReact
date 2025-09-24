/**
 * CrewAI-inspired types for multi-agent presentation system
 * Uses existing Anthropic client to avoid dependency conflicts
 */

export interface AgentConfig {
  name: string
  role: string
  goal: string
  backstory: string
  verbose?: boolean
  allowDelegation?: boolean
}

export interface TaskConfig {
  description: string
  expectedOutput: string
  agent?: Agent
}

export interface CrewConfig {
  agents: Agent[]
  tasks: Task[]
  verbose?: boolean
}

export interface TaskResult {
  output: string
  agent: string
  task: string
  success: boolean
  error?: string
  executionTime: number
}

export interface CrewResult {
  results: TaskResult[]
  success: boolean
  totalTime: number
  error?: string
}

// Forward declarations
export class Agent {
  constructor(public config: AgentConfig) {}
}

export class Task {
  constructor(public config: TaskConfig) {}
}

export class Crew {
  constructor(public config: CrewConfig) {}
}