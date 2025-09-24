/**
 * API endpoint to test CrewAI hello world implementation
 */

import { NextRequest, NextResponse } from 'next/server'
import { runHelloWorldTest } from '@/lib/crew/hello-world-test'

export async function GET() {
  try {
    console.log('🧪 Starting CrewAI Hello World API Test...')

    const result = await runHelloWorldTest()

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'CrewAI Hello World test passed' : 'CrewAI Hello World test failed',
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('💥 CrewAI test API error:', errorMessage)

    return NextResponse.json({
      success: false,
      message: 'CrewAI test failed',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'API key required',
        error: 'No API key provided'
      }, { status: 400 })
    }

    console.log('🧪 Starting CrewAI Hello World API Test with custom API key...')

    const { testCrewAIHelloWorld } = await import('@/lib/crew/hello-world-test')
    const result = await testCrewAIHelloWorld(apiKey)

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'CrewAI Hello World test passed' : 'CrewAI Hello World test failed',
      data: result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    console.error('💥 CrewAI test API error:', errorMessage)

    return NextResponse.json({
      success: false,
      message: 'CrewAI test failed',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}