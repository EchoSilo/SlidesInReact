/**
 * Minimal CrewAI hello world test to validate LLM communication
 * This tests the basic agent -> task -> crew pipeline
 */

import { Agent, Task, Crew } from './core'
import { WorkflowLogger } from '@/lib/workflow-logger'

export async function testCrewAIHelloWorld(apiKey: string) {
  console.log('🧪 Starting CrewAI Hello World Test...')

  try {
    // Create a logger for the test
    const testLogger = new WorkflowLogger('crew-hello-world-test-' + Date.now())

    // Create a simple hello world agent with logger
    const helloAgent = new Agent({
      name: 'HelloAgent',
      role: 'Friendly Greeter',
      goal: 'Say hello in a cheerful and welcoming way',
      backstory: 'You are a friendly AI assistant who loves to greet people and make them feel welcome.'
    }, apiKey, testLogger)

    // Create a simple task
    const helloTask = new Task({
      description: 'Say hello to the user and introduce yourself',
      expectedOutput: 'A friendly greeting message'
    })

    // Create a crew with the agent and task
    const helloCrew = new Crew({
      agents: [helloAgent],
      tasks: [helloTask],
      verbose: true
    })

    console.log('🔧 Test setup complete, executing crew...')

    // Execute the crew
    const result = await helloCrew.kickoff({
      message: 'Testing CrewAI implementation'
    })

    if (result.success) {
      console.log('✅ CrewAI Hello World Test PASSED')
      console.log('📄 Agent Response:', result.results[0]?.output)
      console.log('⏱️ Total Execution Time:', result.totalTime + 'ms')
      return {
        success: true,
        response: result.results[0]?.output,
        executionTime: result.totalTime
      }
    } else {
      console.error('❌ CrewAI Hello World Test FAILED')
      console.error('💥 Error:', result.error)
      return {
        success: false,
        error: result.error,
        executionTime: result.totalTime
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('💥 CrewAI Test crashed:', errorMessage)
    return {
      success: false,
      error: errorMessage,
      executionTime: 0
    }
  }
}

// Test runner function for API routes
export async function runHelloWorldTest(): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return {
      success: false,
      error: 'ANTHROPIC_API_KEY environment variable not set'
    }
  }

  return await testCrewAIHelloWorld(apiKey)
}