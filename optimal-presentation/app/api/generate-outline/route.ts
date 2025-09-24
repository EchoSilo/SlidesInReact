/**
 * API Endpoint for Outline Generation
 * Phase 1 of the iterative presentation generation approach
 */

import { NextRequest, NextResponse } from 'next/server'
import { OutlineGenerator } from '@/lib/generation/OutlineGenerator'
import { OutlineValidator } from '@/lib/validation/OutlineValidator'
import { FrameworkAnalyzer } from '@/lib/validation/frameworkAnalysis'
import { getFramework } from '@/lib/validation/supportedFrameworks'
import { WorkflowLogger } from '@/lib/workflow-logger'
import {
  OutlineGenerationRequest,
  OutlineGenerationResponse,
  PresentationOutline,
  OutlineValidationFeedback
} from '@/lib/types/outline'

/**
 * POST /api/generate-outline
 * Generates a presentation outline without full slide content
 */
export async function POST(request: NextRequest) {
  const generationId = generateId()
  const logger = new WorkflowLogger(generationId)

  try {
    logger.info('OUTLINE_INITIALIZATION', 'Starting outline generation workflow')

    // Parse request body
    const body: OutlineGenerationRequest = await request.json()

    logger.info('OUTLINE_REQUEST', 'Parsed outline generation request', {
      hasPrompt: !!body.prompt,
      hasApiKey: !!body.apiKey,
      slide_count: body.slide_count,
      presentation_type: body.presentation_type
    })

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      logger.error('OUTLINE_VALIDATION', 'Missing required fields', {
        missing_fields: {
          prompt: !body.prompt,
          presentation_type: !body.presentation_type,
          slide_count: !body.slide_count
        }
      })

      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt, presentation_type, slide_count',
        generation_id: generationId
      } as OutlineGenerationResponse, { status: 400 })
    }

    // Get API key
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      logger.error('OUTLINE_API_KEY', 'No API key available')
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generationId
      } as OutlineGenerationResponse, { status: 500 })
    }

    logger.info('OUTLINE_API_KEY', body.apiKey ? 'Using client API key' : 'Using server API key')

    // Step 1: Framework Analysis
    logger.info('OUTLINE_FRAMEWORK', 'Analyzing prompt for framework selection')

    let framework
    if (body.framework) {
      // Use specified framework
      framework = getFramework(body.framework)
      logger.info('OUTLINE_FRAMEWORK', `Using specified framework: ${body.framework}`)
    } else {
      // Analyze for best framework
      const frameworkAnalyzer = new FrameworkAnalyzer(apiKey)
      const analysisResult = await frameworkAnalyzer.quickFrameworkCheck(
        body.prompt,
        body.audience || 'General business audience',
        body.presentation_type
      )

      // Parse framework from analysis (simplified for now)
      const frameworkName = parseFrameworkFromAnalysis(analysisResult)
      framework = getFramework(frameworkName)

      logger.decision('OUTLINE_FRAMEWORK', framework.name,
        'AI-driven framework selection', {
        framework: framework.name,
        analysis: analysisResult.substring(0, 200) + '...'
      })
    }

    // Step 2: Generate Outline
    logger.info('OUTLINE_GENERATION', 'Generating presentation outline')

    const outlineGenerator = new OutlineGenerator(apiKey, logger)
    const outline = await outlineGenerator.generateOutline(body, framework)

    logger.success('OUTLINE_GENERATION', 'Outline generated successfully', {
      title: outline.title,
      slide_count: outline.slides.length,
      framework: framework.name,
      estimated_tokens: outline.estimatedTotalTokens
    })

    // Step 3: Validate Outline
    logger.info('OUTLINE_VALIDATION', 'Validating generated outline')

    const outlineValidator = new OutlineValidator(apiKey, undefined, logger)
    const validationFeedback = await outlineValidator.validateOutline(
      outline,
      body,
      framework
    )

    logger.success('OUTLINE_VALIDATION', 'Outline validation completed', {
      overall_score: validationFeedback.overallScore,
      framework_alignment: validationFeedback.frameworkAlignment.score,
      logical_flow: validationFeedback.logicalFlow.score
    })

    // Step 4: Refine if needed (if score is too low)
    let finalOutline = outline
    let finalValidation = validationFeedback

    if (validationFeedback.overallScore < 70) {
      logger.warning('OUTLINE_REFINEMENT', 'Outline score below threshold, attempting refinement', {
        score: validationFeedback.overallScore,
        threshold: 70
      })

      // Attempt to regenerate with feedback
      try {
        const refinedOutline = await outlineGenerator.generateOutline(body, framework)
        const refinedValidation = await outlineValidator.quickValidate(refinedOutline, body)

        if (refinedValidation.overallScore > validationFeedback.overallScore) {
          finalOutline = refinedOutline
          finalValidation = refinedValidation
          logger.success('OUTLINE_REFINEMENT', 'Outline improved after refinement', {
            old_score: validationFeedback.overallScore,
            new_score: refinedValidation.overallScore
          })
        }
      } catch (error) {
        logger.warning('OUTLINE_REFINEMENT', 'Refinement failed, using original outline', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Step 5: Prepare response
    const response: OutlineGenerationResponse = {
      success: true,
      outline: finalOutline,
      validationScore: finalValidation.overallScore,
      validationFeedback: finalValidation,
      generation_id: generationId,
      processingTime: logger.getElapsedTime()
    }

    logger.success('OUTLINE_COMPLETION', 'Outline generation workflow completed', {
      total_duration_ms: logger.getElapsedTime(),
      slide_count: finalOutline.slides.length,
      validation_score: finalValidation.overallScore,
      estimated_tokens: finalOutline.estimatedTotalTokens
    })

    logger.finalizeLogFile()

    return NextResponse.json(response)

  } catch (error) {
    logger.error('OUTLINE_ERROR', 'Outline generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    logger.finalizeLogFile()

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      generation_id: generationId
    } as OutlineGenerationResponse, { status: 500 })
  }
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Parse framework name from analysis (simplified)
 */
function parseFrameworkFromAnalysis(analysis: string): string {
  const lowercaseAnalysis = analysis.toLowerCase()

  if (lowercaseAnalysis.includes('scqa')) return 'scqa'
  if (lowercaseAnalysis.includes('prep')) return 'prep'
  if (lowercaseAnalysis.includes('star')) return 'star'
  if (lowercaseAnalysis.includes('pyramid')) return 'pyramid'
  if (lowercaseAnalysis.includes('comparison')) return 'comparison'

  // Default to SCQA
  return 'scqa'
}