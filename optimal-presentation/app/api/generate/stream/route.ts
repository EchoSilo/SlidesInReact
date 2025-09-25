/**
 * Streaming endpoint for real-time generation progress
 * Phase 4: System Integration - Progress Streaming
 */

import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, PresentationData } from '@/lib/types'
import { RefinementEngine } from '@/lib/validation/refinementEngine'
import { getQuickFrameworkRecommendation } from '@/lib/validation/frameworkAnalysis'
import { createAnthropicClient } from '@/lib/anthropic-client'
import {
  presentationLogger,
  logGenerationStart,
  logFrameworkSelection,
  logLLMCall,
  logFallbackUsed,
  logValidationComplete
} from '@/lib/logging/presentationLogger'
import { ModelConfigs } from '@/lib/model-config'

// Enhanced request interface for streaming
interface StreamingGenerationRequest extends GenerationRequest {
  apiKey?: string
  useValidation?: boolean
  validationConfig?: {
    targetQualityScore?: number
    maxRefinementRounds?: number
    minimumImprovement?: number
  }
}

/**
 * POST /api/generate/stream
 *
 * Streaming generation with real-time progress updates
 */
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  try {
    const body: StreamingGenerationRequest = await request.json()

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      return new Response(
        encoder.encode('data: {"error": "Missing required fields"}\n\n'),
        {
          status: 400,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      )
    }

    // Get API key
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(
        encoder.encode('data: {"error": "API key not configured"}\n\n'),
        {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      )
    }

    // Create readable stream for Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        performStreamingGeneration(controller, body, apiKey, encoder)
          .catch(error => {
            console.error('Streaming generation failed:', error)
            controller.enqueue(
              encoder.encode(`data: {"error": "Generation failed: ${error.message}"}\n\n`)
            )
            controller.close()
          })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Streaming setup failed:', error)
    return new Response(
      encoder.encode(`data: {"error": "Setup failed: ${error instanceof Error ? error.message : 'Unknown error'}"}\n\n`),
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    )
  }
}

/**
 * Perform streaming generation with progress updates
 */
async function performStreamingGeneration(
  controller: ReadableStreamDefaultController,
  request: StreamingGenerationRequest,
  apiKey: string,
  encoder: TextEncoder
) {
  const generationId = generateId()

  // Initialize logging for streaming generation
  const logContext = logGenerationStart(generationId, undefined)

  try {
    // Send initial progress
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        stage: 'initializing',
        progress: 0,
        message: 'Starting presentation generation...',
        generationId
      })}\n\n`)
    )

    // Step 1: Generate initial presentation
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        stage: 'generating',
        progress: 20,
        message: 'Generating presentation content...',
        generationId
      })}\n\n`)
    )

    const presentation = await generatePresentation(request, apiKey)

    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        stage: 'generated',
        progress: 40,
        message: `Generated presentation with ${presentation.slides.length} slides`,
        generationId
      })}\n\n`)
    )

    // If validation not requested, return immediately
    if (!request.useValidation) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({
          type: 'complete',
          stage: 'completed',
          progress: 100,
          message: 'Generation completed successfully',
          generationId,
          presentation,
          validationResults: null
        })}\n\n`)
      )
      controller.close()
      return
    }

    // Step 2: Validation and refinement pipeline
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'progress',
        stage: 'validating',
        progress: 50,
        message: 'Starting content validation and refinement...',
        generationId
      })}\n\n`)
    )

    const refinementConfig = {
      targetQualityScore: request.validationConfig?.targetQualityScore || 80,
      maxRefinementRounds: request.validationConfig?.maxRefinementRounds || 3,
      minimumImprovement: request.validationConfig?.minimumImprovement || 2
    }

    const refinementEngine = new RefinementEngine(apiKey, refinementConfig)

    // Convert request format
    const originalRequest: GenerationRequest = {
      prompt: request.prompt,
      presentation_type: request.presentation_type,
      slide_count: request.slide_count,
      audience: request.audience,
      tone: request.tone
    }

    // Execute refinement with progress streaming
    const refinementResult = await refinementEngine.refinePresentation(
      presentation,
      originalRequest,
      (progress) => {
        // Stream refinement progress
        const overallProgress = 50 + (progress.overallPercentage * 0.4) // 50-90% range

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({
            type: 'progress',
            stage: 'refining',
            progress: Math.round(overallProgress),
            message: `${progress.overallStatus} (Round ${progress.currentRound}/${progress.totalRounds})`,
            generationId,
            refinementProgress: {
              currentRound: progress.currentRound,
              totalRounds: progress.totalRounds,
              currentScore: progress.qualityProgression.currentScore,
              targetScore: progress.qualityProgression.targetScore
            }
          })}\n\n`)
        )
      }
    )

    // Final completion
    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'complete',
        stage: 'completed',
        progress: 100,
        message: `Generation and refinement completed successfully! Quality improved from ${refinementResult.initialScore} to ${refinementResult.finalScore}`,
        generationId,
        presentation: refinementResult.finalPresentation,
        validationResults: {
          initialScore: refinementResult.initialScore,
          finalScore: refinementResult.finalScore,
          improvement: refinementResult.totalImprovement,
          roundsCompleted: refinementResult.totalRounds,
          targetAchieved: refinementResult.targetAchieved,
          frameworkUsed: refinementResult.frameworkAnalysis.recommendation.primary_framework
        }
      })}\n\n`)
    )

  } catch (error) {
    console.error('Streaming generation error:', error)

    controller.enqueue(
      encoder.encode(`data: ${JSON.stringify({
        type: 'error',
        stage: 'failed',
        progress: 0,
        message: `Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        generationId,
        error: error instanceof Error ? error.message : 'Unknown error'
      })}\n\n`)
    )
  } finally {
    controller.close()
  }
}

/**
 * Generate the initial presentation
 */
async function generatePresentation(
  request: StreamingGenerationRequest,
  apiKey: string
): Promise<PresentationData> {
  // Log framework analysis step
  presentationLogger.logStep('framework-analysis', 'started')

  // Get framework recommendation first
  const frameworkRecommendation = getQuickFrameworkRecommendation(
    request.presentation_type,
    request.audience || 'General business audience',
    request.prompt
  )

  // Log framework selection
  logFrameworkSelection(
    frameworkRecommendation.framework.name,
    frameworkRecommendation.confidence,
    frameworkRecommendation.rationale
  )

  presentationLogger.logStep('framework-analysis', 'completed', {
    selected_framework: frameworkRecommendation.framework.name,
    confidence: frameworkRecommendation.confidence
  })

  console.log('Stream generation using framework:', frameworkRecommendation.framework.name)

  // Generate prompt
  presentationLogger.logStep('prompt-generation', 'started')
  const prompt = generatePrompt(request, frameworkRecommendation.framework)
  presentationLogger.logStep('prompt-generation', 'completed', {
    prompt_length: prompt.length
  })

  // LLM call with logging
  presentationLogger.logStep('llm-generation', 'started')
  const anthropic = createAnthropicClient(apiKey)

  const llmStartTime = Date.now()
  const generationConfig = ModelConfigs.generation()
  const response = await anthropic.messages.create({
    model: generationConfig.model,
    max_tokens: generationConfig.maxTokens,
    temperature: generationConfig.temperature,
    messages: [{
      role: 'user',
      content: prompt
    }]
  })

  const llmDuration = Date.now() - llmStartTime
  const content = response.content[0]

  if (content.type !== 'text') {
    presentationLogger.logStep('llm-generation', 'failed', {
      content_type: content.type
    }, 'Unexpected response type from Claude API')
    throw new Error('Unexpected response type from Claude API')
  }

  // Log successful LLM interaction
  logLLMCall(
    generationConfig.model,
    'presentation-generation',
    prompt,
    content.text,
    llmDuration,
    true,
    undefined,
    response.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : undefined,
    generationConfig.temperature
  )

  presentationLogger.logStep('llm-generation', 'completed', {
    duration_ms: llmDuration,
    response_length: content.text.length,
    tokens_used: response.usage?.input_tokens ? response.usage.input_tokens + (response.usage.output_tokens || 0) : undefined
  })

  // Parse JSON response with logging
  presentationLogger.logStep('json-parsing', 'started', {
    raw_response_length: content.text.length
  })

  let jsonStr = content.text.trim()
  let jsonParsingFallbackUsed = false

  // Remove markdown code block markers if needed
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

  const presentationData = JSON.parse(jsonStr)

  // Validate structure
  if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
    presentationLogger.logStep('json-parsing', 'failed', {
      has_slides: !!presentationData.slides,
      is_array: Array.isArray(presentationData.slides)
    }, 'Invalid presentation structure generated')
    throw new Error('Invalid presentation structure generated')
  }

  presentationLogger.logStep('json-parsing', 'completed', {
    cleaned_json_length: jsonStr.length,
    markdown_cleanup_used: jsonParsingFallbackUsed,
    slides_generated: presentationData.slides.length
  })

  return presentationData
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}