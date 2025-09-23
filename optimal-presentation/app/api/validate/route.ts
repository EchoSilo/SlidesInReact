/**
 * API endpoint for content validation
 * Day 4 of Phase 2: Content Validation Core
 */

import { NextRequest, NextResponse } from 'next/server'
import { PresentationData, GenerationRequest } from '@/lib/types'
import { ValidationAgent, DEFAULT_VALIDATION_CONFIG, ValidationConfig } from '@/lib/validation/ValidationAgent'
import { z } from 'zod'

// Request validation schema
const ValidationRequestSchema = z.object({
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
    slide_count: z.number().optional()
  }),
  config: z.object({
    maxRefinementRounds: z.number().min(1).max(3).optional(),
    targetQualityScore: z.number().min(50).max(100).optional(),
    minConfidenceThreshold: z.number().min(0).max(100).optional(),
    includeMinorIssues: z.boolean().optional()
  }).optional()
})

type ValidationRequest = z.infer<typeof ValidationRequestSchema>

/**
 * POST /api/validate
 *
 * Validates presentation content against quality standards and framework compliance
 */
export async function POST(request: NextRequest) {
  console.log('🔍 Content validation request received')

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedRequest = ValidationRequestSchema.parse(body)

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY not configured')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    // Create validation agent with configuration
    const config: Partial<ValidationConfig> = {
      ...DEFAULT_VALIDATION_CONFIG,
      ...validatedRequest.config
    }

    const validationAgent = new ValidationAgent(apiKey, config)

    console.log('⚙️ Starting validation session with config:', {
      maxRounds: config.maxRefinementRounds,
      targetScore: config.targetQualityScore,
      slideCount: validatedRequest.presentation.slides.length
    })

    // Track progress for potential streaming response
    const progressUpdates: Array<{ round: number; status: string; timestamp: string }> = []

    const onProgress = (round: number, status: string) => {
      const update = {
        round,
        status,
        timestamp: new Date().toISOString()
      }
      progressUpdates.push(update)
      console.log(`📊 Round ${round}: ${status}`)
    }

    // Run validation session
    const startTime = Date.now()
    const validationResult = await validationAgent.validatePresentation(
      validatedRequest.presentation,
      validatedRequest.originalRequest,
      onProgress
    )
    const processingTime = Date.now() - startTime

    console.log('✅ Validation completed:', {
      sessionId: validationResult.sessionId,
      finalScore: validationResult.finalScore,
      rounds: validationResult.totalRounds,
      targetAchieved: validationResult.targetAchieved,
      processingTime: `${processingTime}ms`
    })

    // Return comprehensive validation result
    return NextResponse.json({
      success: true,
      data: {
        ...validationResult,
        processing: {
          duration: processingTime,
          progressUpdates,
          config: config
        }
      }
    })

  } catch (error) {
    console.error('❌ Validation failed:', error)

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
        { error: 'Validation failed', message: error.message },
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
 * GET /api/validate?type=quick&dimension=...
 *
 * Quick validation check for specific dimension
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')

  if (type !== 'quick') {
    return NextResponse.json(
      { error: 'Invalid validation type' },
      { status: 400 }
    )
  }

  try {
    const dimension = searchParams.get('dimension')
    const targetScore = parseInt(searchParams.get('targetScore') || '80')
    const presentationId = searchParams.get('presentationId')

    if (!dimension || !presentationId) {
      return NextResponse.json(
        { error: 'Missing required parameters: dimension, presentationId' },
        { status: 400 }
      )
    }

    // For demo purposes, return mock quick validation
    // In real implementation, this would load the presentation and validate
    const mockResult = {
      dimension,
      currentScore: Math.floor(Math.random() * 40) + 50, // 50-90
      targetScore,
      improvementSuggestions: [
        `Improve ${dimension} by focusing on clarity and structure`,
        `Add more quantified metrics and evidence`,
        `Enhance executive-level language and tone`
      ],
      canReachTarget: true,
      estimatedEffort: 'medium'
    }

    return NextResponse.json({
      success: true,
      data: mockResult
    })

  } catch (error) {
    console.error('Quick validation failed:', error)
    return NextResponse.json(
      { error: 'Quick validation failed' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/validate/config
 *
 * Update validation configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const ConfigUpdateSchema = z.object({
      maxRefinementRounds: z.number().min(1).max(3).optional(),
      targetQualityScore: z.number().min(50).max(100).optional(),
      minConfidenceThreshold: z.number().min(0).max(100).optional(),
      includeMinorIssues: z.boolean().optional()
    })

    const validatedConfig = ConfigUpdateSchema.parse(body)

    // Store configuration (in real implementation, this might be saved to database)
    console.log('⚙️ Validation configuration updated:', validatedConfig)

    return NextResponse.json({
      success: true,
      data: {
        message: 'Configuration updated successfully',
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