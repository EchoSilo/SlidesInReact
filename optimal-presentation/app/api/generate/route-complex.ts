import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, GenerationResponse, PresentationData } from '@/lib/types'
import { RefinementEngine } from '@/lib/validation/refinementEngine'
import { FrameworkAnalyzer, getQuickFrameworkRecommendation } from '@/lib/validation/frameworkAnalysis'
import { getDefaultAnthropicClient, createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
// import {
//   simpleLogger,
//   logGenerationStart,
//   logStep,
//   logFrameworkSelection,
//   logLLMCall,
//   logFallback,
//   completeGeneration
// } from '@/lib/logging/simpleLogger'

// Temporary simple logging functions to avoid compilation issues
const logGenerationStart = (id: string) => console.log(`🚀 Generation started: ${id}`)
const logStep = (id: string, step: string, status: string, details?: any, error?: string) => {
  const emoji = status === 'started' ? '🔄' : status === 'completed' ? '✅' : '❌'
  console.log(`${emoji} ${step}: ${status}`, details ? JSON.stringify(details) : '')
  if (error) console.error(`Error in ${step}:`, error)
}
const logFrameworkSelection = (id: string, framework: string, confidence: number, rationale: string) => {
  console.log(`🧭 Framework selected: ${framework} (${confidence}% confidence)`)
  console.log(`📋 Rationale: ${rationale}`)
}
const logLLMCall = (id: string, model: string, promptLength: number, responseLength: number, duration: number, success: boolean, tokensUsed?: number) => {
  console.log(`🤖 LLM Call: ${model} - ${promptLength} chars → ${responseLength} chars (${duration}ms)`)
  if (tokensUsed) console.log(`🎯 Tokens: ${tokensUsed}`)
}
const logFallback = (id: string, component: string, reason: string, method: string, impact: string) => {
  const emoji = impact === 'none' ? '💚' : impact === 'minor' ? '💛' : impact === 'moderate' ? '🧡' : '🔴'
  console.log(`${emoji} FALLBACK: ${component} - ${reason} → ${method}`)
}
const completeGeneration = (id: string, success: boolean, message?: string) => {
  const status = success ? '🎉' : '💥'
  console.log(`${status} Generation ${success ? 'completed' : 'failed'}: ${id}`)
  if (message) console.log(`📝 ${message}`)
}

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

// Enhanced response interface with validation results and transparency data
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
  transparencyData?: {
    frameworkAnalysis?: {
      selectedFramework: string
      confidence: number
      rationale: string
    }
    generationInsights?: {
      modelUsed: string
      promptType: string
      responseLength: number
      processingTime: number
    }
    fallbacksUsed?: Array<{
      component: string
      reason: string
      impact: string
    }>
    qualityMetrics?: {
      contentQuality: number
      validationMethod: string
      improvementAchieved: number
    }
    recommendations?: string[]
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

  try {
    // Initialize logging for this generation
    logGenerationStart(generationId)
    logStep(generationId, 'request-parsing', 'started')

    // Parse the request body with enhanced validation options
    const body: EnhancedGenerationRequest = await request.json()

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      logStep(generationId, 'request-validation', 'failed', {
        missing_fields: ['prompt', 'presentation_type', 'slide_count'].filter(field => !body[field as keyof typeof body])
      }, 'Missing required fields')

      completeGeneration(generationId, false, 'Request validation failed')

      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt, presentation_type, slide_count',
        generation_id: generationId
      } as GenerationResponse, { status: 400 })
    }

    logStep(generationId, 'request-parsing', 'completed', {
      prompt_length: body.prompt.length,
      presentation_type: body.presentation_type,
      slide_count: body.slide_count,
      audience: body.audience,
      tone: body.tone,
      use_validation: body.useValidation
    })

    // Get API key from request body (client-side) or fallback to environment
    logStep(generationId, 'api-key-resolution', 'started')
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    // Log API key source for transparency
    if (body.apiKey) {
      logStep(generationId, 'api-key-resolution', 'completed', { source: 'client-provided' })
    } else if (process.env.ANTHROPIC_API_KEY) {
      logStep(generationId, 'api-key-resolution', 'completed', { source: 'environment' })
      logFallback(generationId, 'api-key', 'client key not provided', 'environment variable', 'none')
    } else {
      logStep(generationId, 'api-key-resolution', 'failed', { source: 'none' }, 'No API key available')
      completeGeneration(generationId, false, 'API key not configured')

      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    // STEP 1: Analyze and select optimal framework FIRST
    logStep(generationId, 'framework-analysis', 'started')
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

    // Log framework selection with full transparency
    logFrameworkSelection(
      generationId,
      frameworkRecommendation.framework.name,
      frameworkRecommendation.confidence,
      frameworkRecommendation.rationale
    )

    logStep(generationId, 'framework-analysis', 'completed', {
      selected_framework: frameworkRecommendation.framework.name,
      confidence: frameworkRecommendation.confidence,
      rationale: frameworkRecommendation.rationale
    })

    console.log('Selected framework:', {
      framework: frameworkRecommendation.framework.name,
      confidence: frameworkRecommendation.confidence,
      rationale: frameworkRecommendation.rationale
    })

    // STEP 2: Generate framework-specific prompt
    presentationLogger.logStep('prompt-generation', 'started')
    const prompt = generatePrompt(body, frameworkRecommendation.framework)

    presentationLogger.logStep('prompt-generation', 'completed', {
      prompt_length: prompt.length,
      framework_used: frameworkRecommendation.framework.name
    })

    console.log('Generating presentation with framework-specific prompt')

    // Create Anthropic client with the correct API key
    presentationLogger.logStep('llm-generation', 'started')
    const anthropicClient = createAnthropicClient(apiKey)

    // Call Claude API with detailed logging
    const llmStartTime = Date.now()
    let response: any
    let llmError: string | undefined

    try {
      const generationConfig = ModelConfigs.generation()
      response = await anthropicClient.messages.create({
        model: generationConfig.model,
        max_tokens: generationConfig.maxTokens,
        temperature: generationConfig.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const llmDuration = Date.now() - llmStartTime

      // Log successful LLM interaction with full details
      logLLMCall(
        generationConfig.model,
        'presentation-generation',
        prompt,
        response.content[0]?.type === 'text' ? response.content[0].text : 'non-text response',
        llmDuration,
        true,
        undefined,
        response.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : undefined,
        generationConfig.temperature
      )

      presentationLogger.logStep('llm-generation', 'completed', {
        model: generationConfig.model,
        duration_ms: llmDuration,
        tokens_used: response.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : undefined,
        response_length: response.content[0]?.type === 'text' ? response.content[0].text.length : 0
      })

    } catch (error) {
      const llmDuration = Date.now() - llmStartTime
      llmError = error instanceof Error ? error.message : 'Unknown LLM error'

      logLLMCall(
        generationConfig.model,
        'presentation-generation',
        prompt,
        '',
        llmDuration,
        false,
        llmError,
        undefined,
        generationConfig.temperature
      )

      presentationLogger.logStep('llm-generation', 'failed', {
        model: generationConfig.model,
        duration_ms: llmDuration
      }, llmError)

      throw error // Re-throw to be handled by outer try-catch
    }

    // Extract the response content
    const content = response.content[0]
    if (content.type !== 'text') {
      presentationLogger.logStep('response-extraction', 'failed', {
        content_type: content.type
      }, 'Unexpected response type from Claude API')
      throw new Error('Unexpected response type from Claude API')
    }

    // Parse the JSON response with fallback handling
    presentationLogger.logStep('json-parsing', 'started', {
      raw_response_length: content.text.length,
      response_preview: content.text.substring(0, 200)
    })

    let presentationData: PresentationData
    let jsonParsingFallbackUsed = false

    try {
      // Clean the response to ensure it's valid JSON
      let jsonStr = content.text.trim()

      // Check if we need to use markdown cleanup fallback
      if (jsonStr.startsWith('```json') || jsonStr.startsWith('```')) {
        jsonParsingFallbackUsed = true
        logFallbackUsed(
          'json-parser',
          'LLM returned markdown-wrapped JSON',
          'markdown cleanup',
          'minor',
          'Cleaned markdown formatting from LLM response'
        )

        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }
      }

      presentationData = JSON.parse(jsonStr)

      presentationLogger.logStep('json-parsing', 'completed', {
        cleaned_json_length: jsonStr.length,
        markdown_cleanup_used: jsonParsingFallbackUsed,
        slides_generated: Array.isArray(presentationData.slides) ? presentationData.slides.length : 0
      })

    } catch (parseError) {
      presentationLogger.logStep('json-parsing', 'failed', {
        error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        raw_response_sample: content.text.substring(0, 500)
      }, 'Failed to parse Claude response as JSON')

      console.error('Failed to parse Claude response as JSON:', parseError)
      console.error('Raw response:', content.text)

      presentationLogger.completeGeneration(false, 'JSON parsing failed')

      return NextResponse.json({
        success: false,
        error: 'Failed to parse generated content. Please try again.',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    // Validate the structure
    presentationLogger.logStep('structure-validation', 'started')
    if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
      presentationLogger.logStep('structure-validation', 'failed', {
        has_slides: !!presentationData.slides,
        is_array: Array.isArray(presentationData.slides)
      }, 'Invalid presentation structure generated')

      presentationLogger.completeGeneration(false, 'Structure validation failed')

      return NextResponse.json({
        success: false,
        error: 'Invalid presentation structure generated',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    presentationLogger.logStep('structure-validation', 'completed', {
      slides_count: presentationData.slides.length,
      has_title: !!presentationData.title,
      has_description: !!presentationData.description
    })

    console.log(`Successfully generated presentation with ${presentationData.slides.length} slides`)

    // Enhanced response with potential validation
    let enhancedResponse: EnhancedGenerationResponse = {
      success: true,
      presentation: presentationData,
      generation_id: generationId,
      processingTime: Date.now() - startTime
    }

    // Optional validation and refinement pipeline
    if (body.useValidation === true) {
      presentationLogger.logStep('validation-pipeline', 'started')
      console.log('🔄 Starting validation and refinement pipeline...')

      try {
        const validationResult = await performValidationPipeline(
          presentationData,
          body,
          apiKey
        )

        // Log validation success
        logValidationComplete(
          'llm', // Assuming LLM-based validation succeeded
          validationResult.initialScore,
          validationResult.finalScore,
          validationResult.totalRounds
        )

        presentationLogger.logStep('validation-pipeline', 'completed', {
          initial_score: validationResult.initialScore,
          final_score: validationResult.finalScore,
          improvement: validationResult.totalImprovement,
          rounds: validationResult.totalRounds,
          target_achieved: validationResult.targetAchieved
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

        console.log(`✅ Validation completed: ${validationResult.initialScore} → ${validationResult.finalScore} (+${validationResult.totalImprovement} points)`)

      } catch (validationError) {
        // Log validation fallback
        logFallbackUsed(
          'validation-pipeline',
          validationError instanceof Error ? validationError.message : 'Unknown validation error',
          'original presentation without validation',
          'moderate',
          'Validation failed, using original presentation'
        )

        presentationLogger.logStep('validation-pipeline', 'failed', {
          error: validationError instanceof Error ? validationError.message : 'Unknown validation error'
        }, 'Validation pipeline failed')

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
    } else {
      presentationLogger.logStep('validation-pipeline', 'skipped', {
        reason: 'validation not requested'
      })
    }

    // Update final processing time
    enhancedResponse.processingTime = Date.now() - startTime

    // Complete logging and get transparency data
    const generationLog = presentationLogger.completeGeneration(true, 'Presentation generated successfully')

    // Add transparency data to response
    if (generationLog) {
      enhancedResponse.transparencyData = {
        frameworkAnalysis: generationLog.frameworkAnalysis ? {
          selectedFramework: generationLog.frameworkAnalysis.selectedFramework,
          confidence: generationLog.frameworkAnalysis.confidence,
          rationale: generationLog.frameworkAnalysis.rationale
        } : undefined,
        generationInsights: generationLog.llmInteractions.length > 0 ? {
          modelUsed: generationLog.llmInteractions[0].model,
          promptType: generationLog.llmInteractions[0].promptType,
          responseLength: generationLog.llmInteractions[0].responseLength,
          processingTime: generationLog.llmInteractions[0].duration
        } : undefined,
        fallbacksUsed: generationLog.fallbackEvents.map(f => ({
          component: f.component,
          reason: f.reason,
          impact: f.impact
        })),
        qualityMetrics: generationLog.validationResults ? {
          contentQuality: generationLog.validationResults.finalScore,
          validationMethod: generationLog.validationResults.pipelineUsed,
          improvementAchieved: generationLog.validationResults.improvement
        } : undefined,
        recommendations: generationLog.userFacingInsights.recommendations
      }
    }

    // Return the enhanced response with full transparency
    return NextResponse.json(enhancedResponse)

  } catch (error) {
    console.error('Error generating presentation:', error)

    // Log the error
    presentationLogger.logStep('error-handling', 'started', {
      error_type: error instanceof Anthropic.APIError ? 'anthropic-api-error' : 'unknown-error',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    })

    // Complete generation with failure
    presentationLogger.completeGeneration(false, `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      logFallbackUsed(
        'anthropic-api',
        error.message,
        'error response',
        'significant',
        `API Error: ${error.message}`
      )

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