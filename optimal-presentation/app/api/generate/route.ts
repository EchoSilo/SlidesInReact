import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, GenerationResponse, PresentationData } from '@/lib/types'
import { RefinementEngine } from '@/lib/validation/refinementEngine'
import { FrameworkAnalyzer, getQuickFrameworkRecommendation } from '@/lib/validation/frameworkAnalysis'
import { getDefaultAnthropicClient, createAnthropicClient } from '@/lib/anthropic-client'

const anthropic = getDefaultAnthropicClient()

// Enhanced request interface with validation options
interface EnhancedGenerationRequest extends GenerationRequest {
  apiKey?: string
  useValidation?: boolean
  validationConfig?: {
    targetQualityScore?: number
    maxRefinementRounds?: number
    minimumImprovement?: number
  }
  streamProgress?: boolean
}

// Enhanced response interface with validation results
interface EnhancedGenerationResponse extends GenerationResponse {
  validationResults?: {
    initialScore?: number
    finalScore?: number
    improvement?: number
    roundsCompleted?: number
    targetAchieved?: boolean
    frameworkUsed?: string
  }
  processingTime?: number
  debugInfo?: {
    frameworkSelected: string
    frameworkConfidence: number
    frameworkRationale: string
    llmModel: string
    responseLength: number
    fallbacksUsed: string[]
  }
}

/**
 * Performs the complete validation and refinement pipeline
 */
async function performValidationPipeline(
  presentation: PresentationData,
  request: EnhancedGenerationRequest,
  apiKey: string
) {
  // Create refinement engine with user configuration
  const refinementConfig = {
    targetQualityScore: request.validationConfig?.targetQualityScore || 80,
    maxRefinementRounds: request.validationConfig?.maxRefinementRounds || 3,
    minimumImprovement: request.validationConfig?.minimumImprovement || 2
  }

  const refinementEngine = new RefinementEngine(apiKey, refinementConfig)

  // Convert request to GenerationRequest format for validation
  const originalRequest: GenerationRequest = {
    prompt: request.prompt,
    presentation_type: request.presentation_type,
    slide_count: request.slide_count,
    audience: request.audience,
    tone: request.tone
  }

  // Execute the complete refinement pipeline
  const result = await refinementEngine.refinePresentation(
    presentation,
    originalRequest
  )

  return result
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const generationId = generateId()
  const fallbacksUsed: string[] = []

  try {
    console.log(`🚀 Generation started: ${generationId}`)

    // Parse the request body with enhanced validation options
    const body: EnhancedGenerationRequest = await request.json()

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      console.log(`❌ Missing required fields for generation ${generationId}`)
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt, presentation_type, slide_count',
        generation_id: generationId
      } as GenerationResponse, { status: 400 })
    }

    console.log(`✅ Request validated for generation ${generationId}:`, {
      prompt_length: body.prompt.length,
      presentation_type: body.presentation_type,
      slide_count: body.slide_count
    })

    // Get API key from request body (client-side) or fallback to environment
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    // Log API key source for transparency
    if (body.apiKey) {
      console.log(`🔑 Using client-provided API key for generation ${generationId}`)
    } else if (process.env.ANTHROPIC_API_KEY) {
      console.log(`🔄 FALLBACK: Using server environment API key for generation ${generationId}`)
      fallbacksUsed.push('API Key: Client key not provided, using server environment')
    } else {
      console.log(`❌ No API key available for generation ${generationId}`)
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    // STEP 1: Analyze and select optimal framework FIRST
    console.log(`🧭 Analyzing framework for generation ${generationId}...`)
    const frameworkRecommendation = getQuickFrameworkRecommendation(
      body.presentation_type,
      body.audience || 'General business audience',
      body.prompt
    )

    console.log(`🎯 Framework selected for generation ${generationId}:`, {
      framework: frameworkRecommendation.framework.name,
      confidence: frameworkRecommendation.confidence,
      rationale: frameworkRecommendation.rationale
    })

    // STEP 2: Generate framework-specific prompt
    console.log(`📝 Generating prompt for generation ${generationId}...`)
    const prompt = generatePrompt(body, frameworkRecommendation.framework)

    // Create Anthropic client with the correct API key
    console.log(`🤖 Calling LLM for generation ${generationId}...`)
    const anthropicClient = createAnthropicClient(apiKey)

    // Call Claude API with detailed logging
    const llmStartTime = Date.now()
    let response: any

    try {
      response = await anthropicClient.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const llmDuration = Date.now() - llmStartTime
      console.log(`✅ LLM response received for generation ${generationId}:`, {
        model: 'claude-3-haiku-20240307',
        duration_ms: llmDuration,
        response_length: response.content[0]?.type === 'text' ? response.content[0].text.length : 0,
        tokens_used: response.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : 'unknown'
      })

      // Log first 200 characters of response for transparency
      if (response.content[0]?.type === 'text') {
        console.log(`📄 LLM Response Preview for ${generationId}:`, response.content[0].text.substring(0, 200) + '...')
      }

    } catch (error) {
      const llmDuration = Date.now() - llmStartTime
      console.log(`❌ LLM call failed for generation ${generationId}:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: llmDuration
      })
      throw error
    }

    // Extract the response content
    const content = response.content[0]
    if (content.type !== 'text') {
      console.log(`❌ Unexpected response type for generation ${generationId}:`, content.type)
      throw new Error('Unexpected response type from Claude API')
    }

    // Parse the JSON response with fallback handling
    console.log(`🔧 Parsing JSON response for generation ${generationId}...`)
    let presentationData: PresentationData
    let jsonParsingFallbackUsed = false

    try {
      // Clean the response to ensure it's valid JSON
      let jsonStr = content.text.trim()

      // Check if we need to use markdown cleanup fallback
      if (jsonStr.startsWith('```json') || jsonStr.startsWith('```')) {
        jsonParsingFallbackUsed = true
        console.log(`🔄 FALLBACK: Cleaning markdown formatting from LLM response for generation ${generationId}`)
        fallbacksUsed.push('JSON Parsing: LLM returned markdown-wrapped JSON, cleaned automatically')

        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
      }

      presentationData = JSON.parse(jsonStr)
      console.log(`✅ JSON parsed successfully for generation ${generationId}:`, {
        cleaned_json_length: jsonStr.length,
        markdown_cleanup_used: jsonParsingFallbackUsed,
        slides_generated: Array.isArray(presentationData.slides) ? presentationData.slides.length : 0
      })

    } catch (parseError) {
      console.log(`❌ JSON parsing failed for generation ${generationId}:`, {
        error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        raw_response_sample: content.text.substring(0, 500)
      })

      return NextResponse.json({
        success: false,
        error: 'Failed to parse generated content. Please try again.',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    // Validate the structure
    if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
      console.log(`❌ Invalid presentation structure for generation ${generationId}:`, {
        has_slides: !!presentationData.slides,
        is_array: Array.isArray(presentationData.slides)
      })

      return NextResponse.json({
        success: false,
        error: 'Invalid presentation structure generated',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    console.log(`✅ Presentation structure validated for generation ${generationId}`)

    // Enhanced response with potential validation
    let enhancedResponse: EnhancedGenerationResponse = {
      success: true,
      presentation: presentationData,
      generation_id: generationId,
      processingTime: Date.now() - startTime,
      debugInfo: {
        frameworkSelected: frameworkRecommendation.framework.name,
        frameworkConfidence: frameworkRecommendation.confidence,
        frameworkRationale: frameworkRecommendation.rationale,
        llmModel: 'claude-3-haiku-20240307',
        responseLength: content.text.length,
        fallbacksUsed: fallbacksUsed
      }
    }

    // Optional validation and refinement pipeline
    if (body.useValidation === true) {
      console.log(`🔍 Starting validation pipeline for generation ${generationId}...`)

      try {
        const validationResult = await performValidationPipeline(
          presentationData,
          body,
          apiKey
        )

        console.log(`✅ Validation completed for generation ${generationId}:`, {
          initial_score: validationResult.initialScore,
          final_score: validationResult.finalScore,
          improvement: validationResult.totalImprovement,
          rounds: validationResult.totalRounds
        })

        // Add validation results to response
        enhancedResponse.validationResults = {
          initialScore: validationResult.initialScore,
          finalScore: validationResult.finalScore,
          improvement: validationResult.totalImprovement,
          roundsCompleted: validationResult.totalRounds,
          targetAchieved: validationResult.targetAchieved,
          frameworkUsed: validationResult.frameworkAnalysis.recommendation.primary_framework
        }

        // Use refined presentation if validation succeeded
        if (validationResult.finalPresentation) {
          enhancedResponse.presentation = validationResult.finalPresentation
        }

      } catch (validationError) {
        console.log(`🔄 FALLBACK: Validation failed for generation ${generationId}, using original presentation:`,
          validationError instanceof Error ? validationError.message : 'Unknown validation error')

        fallbacksUsed.push('Validation: Validation pipeline failed, using original presentation')
        enhancedResponse.debugInfo!.fallbacksUsed = fallbacksUsed

        // Graceful fallback: return original presentation with error info
        enhancedResponse.validationResults = {
          initialScore: 0,
          finalScore: 0,
          improvement: 0,
          roundsCompleted: 0,
          targetAchieved: false,
          frameworkUsed: 'unknown'
        }
      }
    }

    console.log(`🎉 Generation completed successfully: ${generationId} (${Date.now() - startTime}ms)`)

    // Return the enhanced response
    return NextResponse.json(enhancedResponse)

  } catch (error) {
    console.log(`💥 Generation failed: ${generationId}`, error)

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      fallbacksUsed.push(`API Error: ${error.message}`)

      return NextResponse.json({
        success: false,
        error: `API Error: ${error.message}`,
        generation_id: generationId
      } as GenerationResponse, { status: error.status || 500 })
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred while generating the presentation',
      generation_id: generationId
    } as GenerationResponse, { status: 500 })
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}