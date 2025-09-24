import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'

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
    const anthropic = createAnthropicClient(apiKey.trim())

    try {
      // Make a minimal request to validate the key
      const validationConfig = ModelConfigs.validation()
      const response = await anthropic.messages.create({
        model: validationConfig.model,
        max_tokens: validationConfig.maxTokens,
        temperature: validationConfig.temperature,
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

      // Handle connection errors (TLS, network issues)
      if (apiError.constructor.name === 'APIConnectionError' ||
          apiError.cause?.code === 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY' ||
          apiError.message?.includes('Connection error')) {
        return NextResponse.json({
          valid: false,
          error: 'Network connection error. This may be due to corporate firewall or TLS certificate issues. Please check your network settings or contact your IT administrator.'
        }, { status: 503 })
      }

      // Parse specific Anthropic errors - handle both direct status and nested error structure
      const status = apiError?.status || apiError?.error?.status
      const errorType = apiError?.error?.error?.type || apiError?.type

      if (status === 401 || errorType === 'authentication_error') {
        return NextResponse.json({
          valid: false,
          error: 'Invalid API key. Please check your Anthropic API key.'
        }, { status: 401 })
      } else if (status === 429) {
        return NextResponse.json({
          valid: false,
          error: 'Rate limit exceeded. Your API key is valid but you\'ve hit usage limits.'
        }, { status: 429 })
      } else if (status === 403) {
        return NextResponse.json({
          valid: false,
          error: 'Access forbidden. Your API key may not have the required permissions.'
        }, { status: 403 })
      } else {
        return NextResponse.json({
          valid: false,
          error: `API error: ${apiError?.message || apiError?.error?.error?.message || 'Unknown error occurred'}`
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