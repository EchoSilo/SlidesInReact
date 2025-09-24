/**
 * API endpoint for iterative refinement
 * Phase 3: Iterative Refinement Engine - Integration
 */

import { NextRequest, NextResponse } from 'next/server'
import { PresentationData, GenerationRequest } from '@/lib/types'
import { RefinementEngine, RefinementConfig, DEFAULT_REFINEMENT_CONFIG } from '@/lib/validation/refinementEngine'
import { RefinementProgress } from '@/lib/validation/progressTracker'
import { RefinementOrchestrator, createRefinementOrchestrator } from '@/lib/validation/refinementOrchestrator'
import { getFramework } from '@/lib/validation/supportedFrameworks'
import { z } from 'zod'

// Request validation schema
const RefinementRequestSchema = z.object({
  presentation: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    metadata: z.object({
      author: z.string().optional(),
      created_at: z.string().optional(),
      presentation_type: z.string(),
      target_audience: z.string(),
      estimated_duration: z.number(),
      slide_count: z.number(),
      tone: z.string().optional(),
      version: z.string().optional()
    }),
    slides: z.array(z.object({
      id: z.string(),
      type: z.string(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      layout: z.string(),
      content: z.record(z.any()).optional()
    }))
  }),
  originalRequest: z.object({
    prompt: z.string(),
    audience: z.string().optional(),
    presentation_type: z.string().optional(),
    tone: z.string().optional(),
    slide_count: z.string().optional()
  }),
  frameworkId: z.string().optional(),
  useOrchestrator: z.boolean().optional(), // Option to use the new orchestrator
  config: z.object({
    maxRefinementRounds: z.number().min(1).max(3).optional(),
    targetQualityScore: z.number().min(50).max(100).optional(),
    minConfidenceThreshold: z.number().min(0).max(100).optional(),
    minimumImprovement: z.number().min(1).max(20).optional(),
    enableRollback: z.boolean().optional()
  }).optional()
})

type RefinementRequest = z.infer<typeof RefinementRequestSchema>

/**
 * POST /api/refine
 *
 * Performs iterative refinement on presentation content
 */
export async function POST(request: NextRequest) {
  console.log('🔄 Refinement request received')

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedRequest = RefinementRequestSchema.parse(body)

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Create refinement engine with configuration
    const config: Partial<RefinementConfig> = {
      ...DEFAULT_REFINEMENT_CONFIG,
      ...validatedRequest.config
    }

    const refinementEngine = new RefinementEngine(apiKey, config)

    console.log('⚙️ Starting refinement session with config:', {
      maxRounds: config.maxRefinementRounds,
      targetScore: config.targetQualityScore,
      slideCount: validatedRequest.presentation.slides.length
    })

    // Track progress for real-time updates
    const progressUpdates: RefinementProgress[] = []
    const startTime = Date.now()

    const onProgress = (progress: RefinementProgress) => {
      progressUpdates.push(progress)
      console.log(`🔄 ${progress.overallStage}: ${progress.overallStatus} (${progress.overallPercentage}%)`)
    }

    // Execute refinement session
    const refinementResult = await refinementEngine.refinePresentation(
      validatedRequest.presentation,
      validatedRequest.originalRequest,
      onProgress
    )

    const processingTime = Date.now() - startTime

    console.log('✅ Refinement completed:', {
      sessionId: refinementResult.sessionId,
      initialScore: refinementResult.initialScore,
      finalScore: refinementResult.finalScore,
      improvement: refinementResult.totalImprovement,
      rounds: refinementResult.totalRounds,
      targetAchieved: refinementResult.targetAchieved,
      processingTime: `${Math.round(processingTime / 1000)}s`
    })

    // Return comprehensive refinement result
    return NextResponse.json({
      success: true,
      data: {
        ...refinementResult,
        processing: {
          duration: processingTime,
          progressUpdates,
          config: config
        }
      }
    })

  } catch (error) {
    console.error('❌ Refinement failed:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: error.errors
        },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Authentication error', message: error.message },
          { status: 401 }
        )
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', message: error.message },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { error: 'Refinement failed', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/refine/status?sessionId=...
 *
 * Get status of refinement session (for streaming/polling)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    )
  }

  try {
    // In a real implementation, this would check session status
    // For demo purposes, return mock status
    const mockStatus = {
      sessionId,
      status: 'in_progress',
      currentRound: 2,
      totalRounds: 3,
      overallPercentage: 67,
      currentScore: 75,
      targetScore: 80,
      estimatedTimeRemaining: 45000, // 45 seconds
      lastUpdate: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockStatus
    })

  } catch (error) {
    console.error('Status check failed:', error)
    return NextResponse.json(
      { error: 'Status check failed' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/refine?sessionId=...
 *
 * Cancel refinement session
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    )
  }

  try {
    // In a real implementation, this would cancel the running session
    console.log(`🛑 Cancelling refinement session ${sessionId}`)

    return NextResponse.json({
      success: true,
      data: {
        sessionId,
        status: 'cancelled',
        message: 'Refinement session cancelled successfully'
      }
    })

  } catch (error) {
    console.error('Session cancellation failed:', error)
    return NextResponse.json(
      { error: 'Session cancellation failed' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/refine/config
 *
 * Update refinement configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const ConfigUpdateSchema = z.object({
      maxRefinementRounds: z.number().min(1).max(3).optional(),
      targetQualityScore: z.number().min(50).max(100).optional(),
      minConfidenceThreshold: z.number().min(0).max(100).optional(),
      minimumImprovement: z.number().min(1).max(20).optional(),
      enableRollback: z.boolean().optional(),
      roundTimeout: z.number().min(30000).max(300000).optional() // 30s to 5min
    })

    const validatedConfig = ConfigUpdateSchema.parse(body)

    // Store configuration (in real implementation, might save to database)
    console.log('⚙️ Refinement configuration updated:', validatedConfig)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Refinement configuration updated successfully',
        config: validatedConfig
      }
    })

  } catch (error) {
    console.error('Config update failed:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid configuration format',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Configuration update failed' },
      { status: 500 }
    )
  }
}