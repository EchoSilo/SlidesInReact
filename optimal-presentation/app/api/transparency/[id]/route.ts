/**
 * API endpoint for retrieving detailed transparency logs
 * Provides full technical details and conversation logs for debugging
 */

import { NextRequest, NextResponse } from 'next/server'
import { presentationLogger } from '@/lib/logging/presentationLogger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const generationId = params.id

    if (!generationId) {
      return NextResponse.json({
        success: false,
        error: 'Generation ID is required'
      }, { status: 400 })
    }

    // Get the complete log for this generation
    const generationLog = presentationLogger.getTransparencyData(generationId)

    if (!generationLog) {
      return NextResponse.json({
        success: false,
        error: 'Generation log not found. Logs may have expired.'
      }, { status: 404 })
    }

    // Return the complete transparency data
    return NextResponse.json({
      success: true,
      generationId,
      transparencyLog: {
        // Session Information
        sessionInfo: {
          generationId: generationLog.context.generationId,
          sessionId: generationLog.context.sessionId,
          userId: generationLog.context.userId,
          timestamp: new Date(generationLog.context.timestamp).toISOString(),
          totalDuration: generationLog.technicalMetrics.totalDuration
        },

        // Processing Steps with Timeline
        processSteps: generationLog.steps.map(step => ({
          step: step.step,
          status: step.status,
          startTime: new Date(step.startTime).toISOString(),
          endTime: step.endTime ? new Date(step.endTime).toISOString() : null,
          duration: step.duration,
          details: step.details,
          error: step.error
        })),

        // Framework Analysis Details
        frameworkAnalysis: generationLog.frameworkAnalysis ? {
          selectedFramework: generationLog.frameworkAnalysis.selectedFramework,
          confidence: generationLog.frameworkAnalysis.confidence,
          rationale: generationLog.frameworkAnalysis.rationale,
          alternatives: generationLog.frameworkAnalysis.alternatives || []
        } : null,

        // LLM Interaction Details (including full conversations)
        llmInteractions: generationLog.llmInteractions.map(interaction => ({
          model: interaction.model,
          promptType: interaction.promptType,
          promptLength: interaction.promptLength,
          responseLength: interaction.responseLength,
          tokensUsed: interaction.tokensUsed,
          temperature: interaction.temperature,
          duration: interaction.duration,
          success: interaction.success,
          error: interaction.error,
          // Full conversation for debugging (sanitized)
          promptSummary: interaction.promptSummary,
          responsePreview: interaction.responsePreview
        })),

        // Fallback Events with Impact Analysis
        fallbackEvents: generationLog.fallbackEvents.map(event => ({
          component: event.component,
          reason: event.reason,
          fallbackMethod: event.fallbackMethod,
          impact: event.impact,
          userMessage: event.userMessage
        })),

        // Validation Results
        validationResults: generationLog.validationResults ? {
          pipelineUsed: generationLog.validationResults.pipelineUsed,
          initialScore: generationLog.validationResults.initialScore,
          finalScore: generationLog.validationResults.finalScore,
          improvement: generationLog.validationResults.improvement,
          roundsCompleted: generationLog.validationResults.roundsCompleted,
          issues: generationLog.validationResults.issues
        } : null,

        // User-Facing Insights
        insights: {
          processingSummary: generationLog.userFacingInsights.processingSummary,
          qualityIndicators: generationLog.userFacingInsights.qualityIndicators,
          recommendations: generationLog.userFacingInsights.recommendations,
          transparencyNotes: generationLog.userFacingInsights.transparencyNotes
        },

        // Technical Metrics for Performance Analysis
        technicalMetrics: {
          totalDuration: generationLog.technicalMetrics.totalDuration,
          apiCalls: generationLog.technicalMetrics.apiCalls,
          errorCount: generationLog.technicalMetrics.errorCount,
          performanceFlags: generationLog.technicalMetrics.performanceFlags
        }
      }
    })

  } catch (error) {
    console.error('Error retrieving transparency data:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve transparency data'
    }, { status: 500 })
  }
}

/**
 * Get summary of all recent generations (for analytics)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { limit = 10, includeErrors = false } = body

    // Get all logs
    const allLogs = presentationLogger.getAllLogs()

    // Filter and transform for summary
    const summary = allLogs
      .filter(log => includeErrors || log.technicalMetrics.errorCount === 0)
      .slice(-limit)
      .map(log => ({
        generationId: log.context.generationId,
        timestamp: new Date(log.context.timestamp).toISOString(),
        duration: log.technicalMetrics.totalDuration,
        success: log.technicalMetrics.errorCount === 0,
        frameworkUsed: log.frameworkAnalysis?.selectedFramework || 'unknown',
        fallbacksCount: log.fallbackEvents.length,
        qualityScore: log.validationResults?.finalScore || null,
        processingSteps: log.steps.length
      }))

    return NextResponse.json({
      success: true,
      summary,
      totalLogs: allLogs.length
    })

  } catch (error) {
    console.error('Error retrieving generation summary:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve generation summary'
    }, { status: 500 })
  }
}