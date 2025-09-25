import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, GenerationResponse, PresentationData } from '@/lib/types'
import { RefinementEngine } from '@/lib/validation/refinementEngine'
import { FrameworkAnalyzer, getQuickFrameworkRecommendation } from '@/lib/validation/frameworkAnalysis'
import { getDefaultAnthropicClient, createAnthropicClient } from '@/lib/anthropic-client'
import { WorkflowLogger } from '@/lib/workflow-logger'
import { RefinementOrchestrator, createRefinementOrchestrator } from '@/lib/validation/refinementOrchestrator'
import { ModelConfigs } from '@/lib/model-config'

const anthropic = getDefaultAnthropicClient()

// Enhanced request interface with validation configuration
interface EnhancedGenerationRequest extends GenerationRequest {
  apiKey?: string
  validationConfig?: {
    targetQualityScore?: number
    maxRefinementRounds?: number
    minimumImprovement?: number
    useOrchestrator?: boolean // Use the new orchestrator for refinement
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
    logFilePath?: string
  }
  workflowLogs?: string
}

/**
 * Performs the complete validation and refinement pipeline
 */
async function performValidationPipeline(
  presentation: PresentationData,
  request: EnhancedGenerationRequest,
  apiKey: string,
  logger: WorkflowLogger
) {
  // Create refinement engine with user configuration
  const refinementConfig = {
    targetQualityScore: request.validationConfig?.targetQualityScore || 90, // Raised to 90 to trigger refinement
    maxRefinementRounds: request.validationConfig?.maxRefinementRounds || 3,
    minimumImprovement: request.validationConfig?.minimumImprovement || 2
  }

  const refinementEngine = new RefinementEngine(apiKey, refinementConfig)

  // Inject logger into all agents
  refinementEngine.setLogger(logger)

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
  const generationId = generateId()
  const logger = new WorkflowLogger(generationId)
  const fallbacksUsed: string[] = []

  try {
    logger.info('INITIALIZATION', 'Starting presentation generation workflow')

    // Parse the request body with enhanced validation options
    const body: EnhancedGenerationRequest = await request.json()

    logger.info('REQUEST_PARSING', 'Parsed incoming request', {
      hasPrompt: !!body.prompt,
      hasApiKey: !!body.apiKey,
      workflow: 'multi_agent_validation'
    })

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      logger.error('VALIDATION', 'Missing required fields', {
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
      } as GenerationResponse, { status: 400 })
    }

    logger.success('VALIDATION', 'Request validation passed', {
      prompt_length: body.prompt.length,
      presentation_type: body.presentation_type,
      slide_count: body.slide_count,
      audience: body.audience || 'not specified',
      tone: body.tone
    })

    // Get API key from request body (client-side) or fallback to environment
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    // Log API key source for transparency
    if (body.apiKey) {
      logger.info('API_KEY', 'Using client-provided API key')
    } else if (process.env.ANTHROPIC_API_KEY) {
      logger.warning('API_KEY', 'Using server environment API key as fallback')
      fallbacksUsed.push('API Key: Client key not provided, using server environment')
    } else {
      logger.error('API_KEY', 'No API key available')
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generationId
      } as GenerationResponse, { status: 500 })
    }

    // STEP 1: AI-driven framework analysis (Multi-Agent)
    logger.info('FRAMEWORK_ANALYSIS', 'Starting AI-powered framework analysis')

    // Create framework analyzer agent
    const frameworkAnalyzer = new FrameworkAnalyzer(apiKey)

    // Create initial presentation context for analysis
    const analysisContext = {
      prompt: body.prompt,
      presentation_type: body.presentation_type,
      slide_count: body.slide_count,
      audience: body.audience,
      tone: body.tone
    }

    // Perform AI framework analysis
    const frameworkAnalysisStart = Date.now()
    const analysisConfig = ModelConfigs.analysis()
    logger.llmRequest('FRAMEWORK_AGENT',
      `Analyzing prompt for optimal framework recommendation: ${body.prompt}`,
      analysisConfig.model,
      { task: 'framework_analysis', context: analysisContext }
    )

    const frameworkAnalysisResult = await frameworkAnalyzer.quickFrameworkCheck(
      body.prompt,
      body.audience || 'General business audience',
      body.presentation_type
    )

    const frameworkAnalysisDuration = Date.now() - frameworkAnalysisStart
    logger.llmResponse('FRAMEWORK_AGENT',
      { analysis: frameworkAnalysisResult },
      frameworkAnalysisDuration
    )

    // Parse framework recommendation from AI analysis
    const frameworkRecommendation = parseFrameworkFromAIAnalysis(frameworkAnalysisResult, body)

    logger.decision('FRAMEWORK_SELECTION', frameworkRecommendation.framework.name,
      `AI-driven analysis recommended framework based on content analysis`, {
      framework: frameworkRecommendation.framework.name,
      confidence: frameworkRecommendation.confidence,
      ai_analysis: frameworkAnalysisResult.substring(0, 200) + '...',
      presentation_type: body.presentation_type,
      audience: body.audience || 'General business audience'
    })

    // STEP 2: Generate framework-specific prompt
    logger.info('PROMPT_GENERATION', 'Generating framework-specific prompt')
    const prompt = generatePrompt(body, frameworkRecommendation.framework)

    // Create Anthropic client with the correct API key
    logger.info('LLM_SETUP', 'Creating Anthropic client and preparing LLM request')
    const anthropicClient = createAnthropicClient(apiKey)

    // Call Claude API with detailed logging
    const llmStartTime = Date.now()
    let response: any

    const generationConfig = ModelConfigs.generation()
    const llmConfig = {
      model: generationConfig.model,
      max_tokens: generationConfig.maxTokens,
      temperature: generationConfig.temperature
    }

    logger.llmRequest('LLM_REQUEST', prompt, llmConfig.model, llmConfig)

    try {
      response = await anthropicClient.messages.create({
        ...llmConfig,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const llmDuration = Date.now() - llmStartTime
      logger.llmResponse('LLM_RESPONSE', response, llmDuration)

    } catch (error) {
      const llmDuration = Date.now() - llmStartTime
      logger.error('LLM_REQUEST', 'LLM call failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration_ms: llmDuration
      })
      throw error
    }

    // Extract the response content
    const content = response.content[0]
    if (content.type !== 'text') {
      logger.error('RESPONSE_VALIDATION', 'Unexpected response type from LLM', { type: content.type })
      throw new Error('Unexpected response type from Claude API')
    }

    // Parse the JSON response with fallback handling
    logger.info('JSON_PARSING', 'Starting JSON parsing of LLM response')
    let presentationData: PresentationData
    let jsonParsingFallbackUsed = false

    try {
      // Simple JSON cleanup
      let jsonStr = content.text.trim()

      // Remove markdown if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      presentationData = JSON.parse(jsonStr)
      logger.success('JSON_PARSING', 'JSON parsed successfully', {
        cleaned_json_length: jsonStr.length,
        markdown_cleanup_used: jsonParsingFallbackUsed,
        slides_generated: Array.isArray(presentationData.slides) ? presentationData.slides.length : 0
      })

    } catch (parseError) {
      logger.error('JSON_PARSING', 'JSON parsing failed', {
        error: parseError instanceof Error ? parseError.message : 'Unknown parse error',
        raw_response_sample: content.text.substring(0, 500)
      })

      return NextResponse.json({
        success: false,
        error: 'Failed to parse generated content. Please try again.',
        generation_id: generationId,
        workflowLogs: logger.exportLogs()
      } as EnhancedGenerationResponse, { status: 500 })
    }

    // Validate the structure
    if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
      logger.error('STRUCTURE_VALIDATION', 'Invalid presentation structure generated', {
        has_slides: !!presentationData.slides,
        is_array: Array.isArray(presentationData.slides)
      })

      return NextResponse.json({
        success: false,
        error: 'Invalid presentation structure generated',
        generation_id: generationId,
        workflowLogs: logger.exportLogs()
      } as EnhancedGenerationResponse, { status: 500 })
    }

    logger.success('STRUCTURE_VALIDATION', 'Presentation structure validated successfully', {
      slides_count: presentationData.slides.length,
      has_title: !!presentationData.title,
      has_description: !!presentationData.description
    })

    // Enhanced response with potential validation
    let enhancedResponse: EnhancedGenerationResponse = {
      success: true,
      presentation: presentationData,
      generation_id: generationId,
      processingTime: logger.getElapsedTime(),
      debugInfo: {
        frameworkSelected: frameworkRecommendation.framework.name,
        frameworkConfidence: frameworkRecommendation.confidence,
        frameworkRationale: frameworkRecommendation.rationale,
        llmModel: generationConfig.model,
        responseLength: content.text.length,
        fallbacksUsed: fallbacksUsed
      },
      workflowLogs: logger.exportLogs()
    }

    // Multi-Agent validation and refinement pipeline
    logger.info('VALIDATION_PIPELINE', 'Starting multi-agent validation and refinement pipeline')

    try {
      // Check if we should use the new orchestrator (default to true for testing)
      const useOrchestrator = body.validationConfig?.useOrchestrator ?? true // Default to true
      if (useOrchestrator) {
        logger.info('ORCHESTRATOR', 'Using new RefinementOrchestrator for content regeneration')

        // Create and use the orchestrator
        const orchestrator = createRefinementOrchestrator(apiKey, {
          maxRounds: body.validationConfig?.maxRefinementRounds || 3,
          targetScore: body.validationConfig?.targetQualityScore || 90, // Match the pipeline target
          minimumImprovement: body.validationConfig?.minimumImprovement || 2,
          enableDetailedLogging: true
        })

        const orchestratorResult = await orchestrator.orchestrateRefinement(
          presentationData,
          body,
          frameworkRecommendation.framework
        )

        logger.success('ORCHESTRATOR', 'Orchestrated refinement completed', {
          initial_score: orchestratorResult.initialScore,
          final_score: orchestratorResult.finalScore,
          improvement: orchestratorResult.totalImprovement,
          rounds: orchestratorResult.history.length,
          target_achieved: orchestratorResult.targetAchieved,
          llm_calls: orchestratorResult.llmCalls
        })

        // Update response with orchestrator results
        enhancedResponse.validationResults = {
          initialScore: orchestratorResult.initialScore,
          finalScore: orchestratorResult.finalScore,
          improvement: orchestratorResult.totalImprovement,
          roundsCompleted: orchestratorResult.history.length,
          targetAchieved: orchestratorResult.targetAchieved,
          frameworkUsed: orchestratorResult.frameworkAnalysis.recommendation.primary_framework
        }

        enhancedResponse.presentation = orchestratorResult.finalPresentation
        logger.info('ORCHESTRATOR_SUCCESS', 'Using refined presentation from orchestrator')

      } else {
        // Use existing validation pipeline
        const validationResult = await performValidationPipeline(
          presentationData,
          body,
          apiKey,
          logger
        )

        logger.success('VALIDATION_PIPELINE', 'Multi-agent validation completed successfully', {
          initial_score: validationResult.initialScore,
          final_score: validationResult.finalScore,
          improvement: validationResult.totalImprovement,
          rounds: validationResult.totalRounds,
          target_achieved: validationResult.targetAchieved,
          agents_used: ['FrameworkAnalyzer', 'ValidationAgent', 'RefinementEngine']
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
          logger.info('REFINEMENT_SUCCESS', 'Using refined presentation from multi-agent pipeline')
        } else {
          logger.warning('REFINEMENT_FALLBACK', 'Using original presentation (refinement did not improve quality)')
        }
      }

    } catch (validationError) {
      logger.warning('VALIDATION_PIPELINE', 'Multi-agent validation failed, using original presentation', {
        error: validationError instanceof Error ? validationError.message : 'Unknown validation error'
      })

      fallbacksUsed.push('Multi-Agent Validation: Pipeline failed, using original presentation')
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

    logger.success('COMPLETION', 'Multi-agent generation workflow completed successfully', {
      total_duration_ms: logger.getElapsedTime(),
      final_slide_count: enhancedResponse.presentation.slides.length,
      ai_framework_analysis: true,
      multi_agent_validation: true,
      fallbacks_used: fallbacksUsed.length
    })

    // Finalize log file with summary
    logger.finalizeLogFile()

    // Update logs in response before returning
    enhancedResponse.workflowLogs = logger.exportLogs()
    enhancedResponse.debugInfo!.logFilePath = logger.getLogFilePath()

    // Return the enhanced response
    return NextResponse.json(enhancedResponse)

  } catch (error) {
    logger.error('WORKFLOW_ERROR', 'Generation workflow failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    // Finalize log file even on error
    logger.finalizeLogFile()

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      fallbacksUsed.push(`API Error: ${error.message}`)

      return NextResponse.json({
        success: false,
        error: `API Error: ${error.message}`,
        generation_id: generationId,
        workflowLogs: logger.exportLogs(),
        debugInfo: {
          logFilePath: logger.getLogFilePath(),
          frameworkSelected: 'unknown',
          frameworkConfidence: 0,
          frameworkRationale: 'Error occurred before framework analysis',
          llmModel: 'unknown',
          responseLength: 0,
          fallbacksUsed: fallbacksUsed
        }
      } as EnhancedGenerationResponse, { status: error.status || 500 })
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred while generating the presentation',
      generation_id: generationId,
      workflowLogs: logger.exportLogs(),
      debugInfo: {
        logFilePath: logger.getLogFilePath(),
        frameworkSelected: 'unknown',
        frameworkConfidence: 0,
        frameworkRationale: 'Error occurred during generation',
        llmModel: 'unknown',
        responseLength: 0,
        fallbacksUsed: fallbacksUsed
      }
    } as EnhancedGenerationResponse, { status: 500 })
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Parse framework recommendation from AI analysis JSON response
 */
function parseFrameworkFromAIAnalysis(aiResponse: string, context: any) {
  const { getFramework } = require('@/lib/validation/supportedFrameworks')

  try {
    // Parse the JSON response from the LLM
    const analysisResult = JSON.parse(aiResponse.trim())

    // Extract the recommendation
    const recommendedFramework = analysisResult.recommendation || 'scqa'
    const confidence = analysisResult.confidence || 75
    const rationale = analysisResult.rationale || 'AI analysis completed'

    const framework = getFramework(recommendedFramework)

    return {
      framework,
      confidence,
      rationale,
      aiAnalysis: aiResponse
    }
  } catch (error) {
    // If JSON parsing fails, log and use default
    console.error('Failed to parse framework analysis JSON:', error)

    const framework = getFramework('scqa')
    return {
      framework,
      confidence: 70,
      rationale: 'Default framework due to analysis parsing error',
      aiAnalysis: aiResponse
    }
  }
}