import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apiKey } = body

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({
        valid: false,
        error: 'API key is required'
      }, { status: 400 })
    }

    // Validate the API key format
    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid API key format. Anthropic API keys start with "sk-ant-"'
      }, { status: 400 })
    }

    // Test the API key with a simple request
    const anthropic = new Anthropic({
      apiKey: apiKey.trim(),
    })

    try {
      // Make a minimal request to validate the key
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{
          role: 'user',
          content: 'Test'
        }]
      })

      // If we get here, the key is valid
      return NextResponse.json({
        valid: true,
        message: 'API key is valid and connected successfully'
      })

    } catch (apiError: any) {
      console.error('API key validation error:', apiError)

      // Parse specific Anthropic errors
      if (apiError?.status === 401) {
        return NextResponse.json({
          valid: false,
          error: 'Invalid API key. Please check your Anthropic API key.'
        }, { status: 401 })
      } else if (apiError?.status === 429) {
        return NextResponse.json({
          valid: false,
          error: 'Rate limit exceeded. Your API key is valid but you\'ve hit usage limits.'
        }, { status: 429 })
      } else if (apiError?.status === 403) {
        return NextResponse.json({
          valid: false,
          error: 'Access forbidden. Your API key may not have the required permissions.'
        }, { status: 403 })
      } else {
        return NextResponse.json({
          valid: false,
          error: `API error: ${apiError?.message || 'Unknown error occurred'}`
        }, { status: 500 })
      }
    }

  } catch (error) {
    console.error('Validation endpoint error:', error)
    return NextResponse.json({
      valid: false,
      error: 'Server error occurred while validating API key'
    }, { status: 500 })
  }
}