import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, GenerationResponse, PresentationData } from '@/lib/types'
import { RefinementEngine } from '@/lib/validation/refinementEngine'
import { FrameworkAnalyzer, getQuickFrameworkRecommendation } from '@/lib/validation/frameworkAnalysis'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

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

  try {
    // Parse the request body with enhanced validation options
    const body: EnhancedGenerationRequest = await request.json()

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt, presentation_type, slide_count',
        generation_id: generateId()
      } as GenerationResponse, { status: 400 })
    }

    // Get API key from request body (client-side) or fallback to environment
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    // Validate API key
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    // STEP 1: Analyze and select optimal framework FIRST
    console.log('Analyzing optimal framework for presentation:', {
      type: body.presentation_type,
      slideCount: body.slide_count,
      audience: body.audience,
      tone: body.tone
    })

    // Get framework recommendation using quick heuristic method
    // This analyzes the user request and selects the optimal framework
    const frameworkRecommendation = getQuickFrameworkRecommendation(
      body.presentation_type,
      body.audience || 'General business audience',
      body.prompt
    )

    console.log('Selected framework:', {
      framework: frameworkRecommendation.framework.name,
      confidence: frameworkRecommendation.confidence,
      rationale: frameworkRecommendation.rationale
    })

    // STEP 2: Generate framework-specific prompt
    const prompt = generatePrompt(body, frameworkRecommendation.framework)

    console.log('Generating presentation with framework-specific prompt')

    // Create Anthropic client with the correct API key
    const anthropicClient = new Anthropic({
      apiKey: apiKey,
    })

    // Call Claude API
    const response = await anthropicClient.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    // Extract the response content
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API')
    }

    // Parse the JSON response
    let presentationData: PresentationData
    try {
      // Clean the response to ensure it's valid JSON
      let jsonStr = content.text.trim()

      // Remove any markdown code block markers
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      presentationData = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError)
      console.error('Raw response:', content.text)

      return NextResponse.json({
        success: false,
        error: 'Failed to parse generated content. Please try again.',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    // Validate the structure
    if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid presentation structure generated',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    console.log(`Successfully generated presentation with ${presentationData.slides.length} slides`)

    // Enhanced response with potential validation
    let enhancedResponse: EnhancedGenerationResponse = {
      success: true,
      presentation: presentationData,
      generation_id: generateId(),
      processingTime: Date.now() - startTime
    }

    // Optional validation and refinement pipeline
    if (body.useValidation === true) {
      console.log('🔄 Starting validation and refinement pipeline...')

      try {
        const validationResult = await performValidationPipeline(
          presentationData,
          body,
          apiKey
        )

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

        console.log(`✅ Validation completed: ${validationResult.initialScore} → ${validationResult.finalScore} (+${validationResult.totalImprovement} points)`)

      } catch (validationError) {
        console.error('⚠️ Validation failed, using original presentation:', validationError)

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

    // Update final processing time
    enhancedResponse.processingTime = Date.now() - startTime

    // Return the enhanced response
    return NextResponse.json(enhancedResponse)

  } catch (error) {
    console.error('Error generating presentation:', error)

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({
        success: false,
        error: `API Error: ${error.message}`,
        generation_id: generateId()
      } as GenerationResponse, { status: error.status || 500 })
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred while generating the presentation',
      generation_id: generateId()
    } as GenerationResponse, { status: 500 })
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}