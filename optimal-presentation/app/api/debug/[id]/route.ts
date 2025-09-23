/**
 * Debug endpoint for viewing raw LLM conversations and technical details
 * WARNING: Contains full prompts and responses - use with caution
 */

import { NextRequest, NextResponse } from 'next/server'
import { presentationLogger } from '@/lib/logging/presentationLogger'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const generationId = params.id
    const { searchParams } = new URL(request.url)
    const includeFullConversation = searchParams.get('full') === 'true'

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

    // Create debug report
    const debugReport = {
      // Basic Information
      sessionInfo: {
        generationId: generationLog.context.generationId,
        sessionId: generationLog.context.sessionId,
        timestamp: new Date(generationLog.context.timestamp).toISOString(),
        totalDuration: generationLog.technicalMetrics.totalDuration
      },

      // Detailed Step Timeline
      stepTimeline: generationLog.steps.map(step => ({
        order: generationLog.steps.indexOf(step) + 1,
        step: step.step,
        status: step.status,
        startTime: new Date(step.startTime).toISOString(),
        endTime: step.endTime ? new Date(step.endTime).toISOString() : null,
        duration: step.duration || 0,
        details: step.details,
        error: step.error
      })),

      // Framework Selection Analysis
      frameworkDecision: generationLog.frameworkAnalysis ? {
        selected: generationLog.frameworkAnalysis.selectedFramework,
        confidence: generationLog.frameworkAnalysis.confidence,
        rationale: generationLog.frameworkAnalysis.rationale,
        alternatives: generationLog.frameworkAnalysis.alternatives || [],
        selectionCriteria: 'Based on presentation type, audience, and content analysis'
      } : null,

      // LLM Interactions with Performance Metrics
      llmInteractions: generationLog.llmInteractions.map((interaction, index) => ({
        interactionNumber: index + 1,
        model: interaction.model,
        promptType: interaction.promptType,
        promptLength: interaction.promptLength,
        responseLength: interaction.responseLength,
        tokensUsed: interaction.tokensUsed || 'unknown',
        temperature: interaction.temperature,
        duration: interaction.duration,
        success: interaction.success,
        error: interaction.error,
        promptSummary: interaction.promptSummary,
        responsePreview: interaction.responsePreview,
        // Performance analysis
        performanceMetrics: {
          tokensPerSecond: interaction.tokensUsed && interaction.duration ?
            Math.round((interaction.tokensUsed / interaction.duration) * 1000) : null,
          charactersPerSecond: Math.round((interaction.responseLength / interaction.duration) * 1000),
          efficiency: interaction.duration < 5000 ? 'fast' :
                     interaction.duration < 15000 ? 'normal' : 'slow'
        }
      })),

      // Fallback Analysis
      fallbackAnalysis: {
        totalFallbacks: generationLog.fallbackEvents.length,
        impactBreakdown: {
          none: generationLog.fallbackEvents.filter(f => f.impact === 'none').length,
          minor: generationLog.fallbackEvents.filter(f => f.impact === 'minor').length,
          moderate: generationLog.fallbackEvents.filter(f => f.impact === 'moderate').length,
          significant: generationLog.fallbackEvents.filter(f => f.impact === 'significant').length
        },
        events: generationLog.fallbackEvents.map((event, index) => ({
          eventNumber: index + 1,
          component: event.component,
          reason: event.reason,
          fallbackMethod: event.fallbackMethod,
          impact: event.impact,
          userMessage: event.userMessage,
          recommendation: event.impact === 'significant' ?
            'Consider adjusting request parameters to avoid this fallback' :
            'This fallback is normal and doesn\'t affect quality'
        }))
      },

      // Quality and Validation Analysis
      qualityAnalysis: generationLog.validationResults ? {
        validationPipeline: generationLog.validationResults.pipelineUsed,
        scoreProgression: {
          initial: generationLog.validationResults.initialScore,
          final: generationLog.validationResults.finalScore,
          improvement: generationLog.validationResults.improvement,
          improvementPercentage: Math.round(
            (generationLog.validationResults.improvement / generationLog.validationResults.initialScore) * 100
          )
        },
        validationRounds: generationLog.validationResults.roundsCompleted,
        issuesIdentified: generationLog.validationResults.issues.length,
        issueBreakdown: {
          critical: generationLog.validationResults.issues.filter(i => i.severity === 'critical').length,
          important: generationLog.validationResults.issues.filter(i => i.severity === 'important').length,
          minor: generationLog.validationResults.issues.filter(i => i.severity === 'minor').length
        },
        issues: generationLog.validationResults.issues
      } : null,

      // Performance Analysis
      performanceAnalysis: {
        totalDuration: generationLog.technicalMetrics.totalDuration,
        apiCalls: generationLog.technicalMetrics.apiCalls,
        errorCount: generationLog.technicalMetrics.errorCount,
        performanceFlags: generationLog.technicalMetrics.performanceFlags,
        averageApiCallTime: generationLog.llmInteractions.length > 0 ?
          Math.round(generationLog.llmInteractions.reduce((sum, i) => sum + i.duration, 0) / generationLog.llmInteractions.length) :
          0,
        bottlenecks: [
          ...(generationLog.technicalMetrics.totalDuration > 30000 ? ['Total duration exceeds 30 seconds'] : []),
          ...(generationLog.technicalMetrics.errorCount > 0 ? [`${generationLog.technicalMetrics.errorCount} errors occurred`] : []),
          ...(generationLog.fallbackEvents.filter(f => f.impact === 'significant').length > 0 ? ['Significant fallbacks used'] : [])
        ]
      },

      // User Experience Summary
      userExperienceAnalysis: {
        overallSuccess: generationLog.technicalMetrics.errorCount === 0,
        transparencyProvided: generationLog.userFacingInsights.transparencyNotes.length,
        recommendationsGiven: generationLog.userFacingInsights.recommendations.length,
        userVisibleIssues: generationLog.fallbackEvents.filter(f => f.impact !== 'none').length,
        qualityImprovementVisible: generationLog.validationResults ?
          generationLog.validationResults.improvement > 0 : false,
        summary: generationLog.userFacingInsights.processingSummary
      }
    }

    // Add full conversation logs if requested (be careful with sensitive data)
    const finalReport = {
      ...debugReport,
      ...(includeFullConversation && {
        fullConversations: generationLog.llmInteractions.map((interaction, index) => ({
          interactionNumber: index + 1,
          promptType: interaction.promptType,
          fullPromptSummary: interaction.promptSummary, // Already sanitized
          fullResponsePreview: interaction.responsePreview, // Already sanitized
          warning: 'This is a sanitized preview. Full prompts contain detailed instructions and may include user data.'
        }))
      })
    }

    return NextResponse.json({
      success: true,
      generationId,
      debugReport: finalReport,
      metadata: {
        reportGenerated: new Date().toISOString(),
        includesFullConversation: includeFullConversation,
        dataRetentionNote: 'Debug logs are automatically cleaned up after 24 hours'
      }
    })

  } catch (error) {
    console.error('Error generating debug report:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to generate debug report'
    }, { status: 500 })
  }
}

/**
 * Performance analytics endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { timeRange = '24h', includeFailures = true } = body

    // Get all logs for analysis
    const allLogs = presentationLogger.getAllLogs()

    // Calculate time cutoff
    const cutoffTime = Date.now() - (timeRange === '1h' ? 3600000 : 24 * 3600000)
    const recentLogs = allLogs.filter(log => log.context.timestamp > cutoffTime)

    if (recentLogs.length === 0) {
      return NextResponse.json({
        success: true,
        analytics: {
          message: 'No recent generations found',
          timeRange,
          totalGenerations: 0
        }
      })
    }

    // Calculate analytics
    const successfulLogs = recentLogs.filter(log => log.technicalMetrics.errorCount === 0)
    const analytics = {
      summary: {
        totalGenerations: recentLogs.length,
        successfulGenerations: successfulLogs.length,
        successRate: Math.round((successfulLogs.length / recentLogs.length) * 100),
        timeRange
      },
      performance: {
        averageDuration: Math.round(
          recentLogs.reduce((sum, log) => sum + log.technicalMetrics.totalDuration, 0) / recentLogs.length
        ),
        fastestGeneration: Math.min(...recentLogs.map(log => log.technicalMetrics.totalDuration)),
        slowestGeneration: Math.max(...recentLogs.map(log => log.technicalMetrics.totalDuration)),
        averageApiCalls: Math.round(
          recentLogs.reduce((sum, log) => sum + log.technicalMetrics.apiCalls, 0) / recentLogs.length
        )
      },
      frameworks: {
        usage: recentLogs.reduce((acc: Record<string, number>, log) => {
          const framework = log.frameworkAnalysis?.selectedFramework || 'unknown'
          acc[framework] = (acc[framework] || 0) + 1
          return acc
        }, {}),
        averageConfidence: Math.round(
          recentLogs
            .filter(log => log.frameworkAnalysis?.confidence)
            .reduce((sum, log) => sum + (log.frameworkAnalysis?.confidence || 0), 0) /
          recentLogs.filter(log => log.frameworkAnalysis?.confidence).length
        )
      },
      fallbacks: {
        totalFallbacks: recentLogs.reduce((sum, log) => sum + log.fallbackEvents.length, 0),
        averageFallbacksPerGeneration: Math.round(
          recentLogs.reduce((sum, log) => sum + log.fallbackEvents.length, 0) / recentLogs.length * 100
        ) / 100,
        impactDistribution: {
          none: recentLogs.reduce((sum, log) => sum + log.fallbackEvents.filter(f => f.impact === 'none').length, 0),
          minor: recentLogs.reduce((sum, log) => sum + log.fallbackEvents.filter(f => f.impact === 'minor').length, 0),
          moderate: recentLogs.reduce((sum, log) => sum + log.fallbackEvents.filter(f => f.impact === 'moderate').length, 0),
          significant: recentLogs.reduce((sum, log) => sum + log.fallbackEvents.filter(f => f.impact === 'significant').length, 0)
        }
      },
      validation: {
        validationUsage: recentLogs.filter(log => log.validationResults).length,
        averageImprovement: Math.round(
          recentLogs
            .filter(log => log.validationResults)
            .reduce((sum, log) => sum + (log.validationResults?.improvement || 0), 0) /
          Math.max(1, recentLogs.filter(log => log.validationResults).length)
        ),
        averageFinalScore: Math.round(
          recentLogs
            .filter(log => log.validationResults)
            .reduce((sum, log) => sum + (log.validationResults?.finalScore || 0), 0) /
          Math.max(1, recentLogs.filter(log => log.validationResults).length)
        )
      }
    }

    return NextResponse.json({
      success: true,
      analytics,
      metadata: {
        generatedAt: new Date().toISOString(),
        logsAnalyzed: recentLogs.length,
        timeRange
      }
    })

  } catch (error) {
    console.error('Error generating analytics:', error)

    return NextResponse.json({
      success: false,
      error: 'Failed to generate performance analytics'
    }, { status: 500 })
  }
}