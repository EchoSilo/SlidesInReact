/**
 * API Endpoint for Iterative Presentation Generation with Streaming
 * Generates presentations slide-by-slide with real-time progress updates
 */

import { NextRequest } from 'next/server'
import { IterativeOrchestrator, IterativeGenerationProgress } from '@/lib/generation/IterativeOrchestrator'
import { WorkflowLogger } from '@/lib/workflow-logger'
import { GenerationRequest } from '@/lib/types'

/**
 * POST /api/generate-iterative
 * Generates a presentation using iterative approach with SSE streaming
 */
export async function POST(request: NextRequest) {
  const generationId = generateId()
  const logger = new WorkflowLogger(generationId)

  try {
    logger.info('ITERATIVE_INITIALIZATION', 'Starting iterative generation workflow')

    // Parse request body
    const body: GenerationRequest & { apiKey?: string; streamProgress?: boolean } = await request.json()

    logger.info('ITERATIVE_REQUEST', 'Parsed iterative generation request', {
      hasPrompt: !!body.prompt,
      hasApiKey: !!body.apiKey,
      slide_count: body.slide_count,
      presentation_type: body.presentation_type,
      stream_progress: body.streamProgress || false
    })

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      logger.error('ITERATIVE_VALIDATION', 'Missing required fields')

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: prompt, presentation_type, slide_count',
          generation_id: generationId
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get API key
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      logger.error('ITERATIVE_API_KEY', 'No API key available')
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Anthropic API key not configured',
          generation_id: generationId
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check if streaming is requested
    if (body.streamProgress) {
      // Return Server-Sent Events stream
      return streamGeneration(body, apiKey, generationId, logger)
    } else {
      // Return regular JSON response
      return regularGeneration(body, apiKey, generationId, logger)
    }

  } catch (error) {
    logger.error('ITERATIVE_ERROR', 'Generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        generation_id: generationId
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Stream generation with Server-Sent Events
 */
function streamGeneration(
  request: GenerationRequest,
  apiKey: string,
  generationId: string,
  logger: WorkflowLogger
): Response {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial connection event
        controller.enqueue(
          encoder.encode(`event: connected\ndata: ${JSON.stringify({ generation_id: generationId })}\n\n`)
        )

        // Create orchestrator with progress callback
        const progressCallback = (progress: IterativeGenerationProgress) => {
          // Send progress event
          const event = `event: progress\ndata: ${JSON.stringify(progress)}\n\n`
          controller.enqueue(encoder.encode(event))
        }

        const orchestrator = new IterativeOrchestrator(apiKey, logger, progressCallback)

        // Generate presentation with full validation pipeline
        const result = await orchestrator.generatePresentation(request, {
          validateOutline: true,
          validateSlides: true,
          validateDeck: true,
          enableRefinement: true,
          maxSlideRetries: 2,
          minSlideScore: 60,
          minDeckScore: 70,
          maxRefinementTargets: 3,
          progressCallback
        })

        // Send complete event with final result
        const completeEvent = `event: complete\ndata: ${JSON.stringify({
          success: result.success,
          presentation: result.presentation,
          validationScores: result.validationScores,
          tokensUsed: result.tokensUsed,
          generationTime: result.generationTime,
          errors: result.errors,
          generation_id: generationId
        })}\n\n`
        controller.enqueue(encoder.encode(completeEvent))

        // Close the stream
        controller.close()

      } catch (error) {
        // Send error event
        const errorEvent = `event: error\ndata: ${JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          generation_id: generationId
        })}\n\n`
        controller.enqueue(encoder.encode(errorEvent))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Generation-ID': generationId
    }
  })
}

/**
 * Regular non-streaming generation
 */
async function regularGeneration(
  request: GenerationRequest,
  apiKey: string,
  generationId: string,
  logger: WorkflowLogger
): Promise<Response> {
  try {
    // Create orchestrator
    const orchestrator = new IterativeOrchestrator(apiKey, logger)

    // Generate presentation with full validation pipeline
    const result = await orchestrator.generatePresentation(request, {
      validateOutline: true,
      validateSlides: true,
      validateDeck: true,
      enableRefinement: true,
      maxSlideRetries: 2,
      minSlideScore: 60,
      minDeckScore: 70,
      maxRefinementTargets: 3
    })

    logger.finalizeLogFile()

    return new Response(
      JSON.stringify({
        ...result,
        generation_id: generationId
      }),
      {
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    logger.error('ITERATIVE_ERROR', 'Regular generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    logger.finalizeLogFile()

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        generation_id: generationId
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}