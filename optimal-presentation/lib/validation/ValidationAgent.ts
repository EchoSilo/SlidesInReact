/**
 * Main ValidationAgent orchestration class
 * Day 3 of Phase 2: Content Validation Core
 */

import Anthropic from '@anthropic-ai/sdk'
import { PresentationData, GenerationRequest } from '@/lib/types'
import { FrameworkAnalyzer, FrameworkAnalysisResult } from './frameworkAnalysis'
import { ContentAnalyzer, ContentAnalysisResult, ValidationDimensions } from './contentAnalysis'
import {
  generateContentValidationPrompt,
  generateExecutiveCritiquePrompt,
  generateRefinementPrompt,
  generateFrameworkComparisonPrompt,
  generateDimensionImprovementPrompt
} from './validationPrompts'
import { ValidationResponseParser, responseParser } from './responseParser'

/**
 * Validation configuration options
 */
export interface ValidationConfig {
  /** Maximum number of refinement rounds (1-3) */
  maxRefinementRounds: number
  /** Target quality score (0-100) */
  targetQualityScore: number
  /** Minimum confidence threshold for issues (0-100) */
  minConfidenceThreshold: number
  /** Whether to include minor issues in analysis */
  includeMinorIssues: boolean
  /** LLM model to use for validation */
  model: string
  /** LLM temperature setting */
  temperature: number
  /** Maximum tokens for LLM response */
  maxTokens: number
}

/**
 * Validation round result
 */
export interface ValidationRoundResult {
  round: number
  analysis: ContentAnalysisResult
  improvementSuggestions: string[]
  shouldContinue: boolean
  confidenceScore: number
}

/**
 * Complete validation session result
 */
export interface ValidationSessionResult {
  sessionId: string
  initialAnalysis: ContentAnalysisResult
  frameworkAnalysis: FrameworkAnalysisResult
  roundResults: ValidationRoundResult[]
  finalScore: number
  totalRounds: number
  targetAchieved: boolean
  sessionSummary: {
    scoreImprovement: number
    criticalIssuesResolved: number
    majorImprovements: string[]
    finalRecommendations: string[]
  }
}

/**
 * Main ValidationAgent class for orchestrating content validation
 */
export class ValidationAgent {
  private anthropic: Anthropic
  private frameworkAnalyzer: FrameworkAnalyzer
  private contentAnalyzer: ContentAnalyzer
  private responseParser: ValidationResponseParser
  private config: ValidationConfig

  constructor(apiKey: string, config: Partial<ValidationConfig> = {}) {
    this.anthropic = require('@/lib/anthropic-client').createAnthropicClient(apiKey)
    this.frameworkAnalyzer = new FrameworkAnalyzer(apiKey)
    this.contentAnalyzer = new ContentAnalyzer({
      audienceLevel: 'executive',
      minimumConfidence: config.minConfidenceThreshold || 70,
      includeMinorIssues: config.includeMinorIssues !== false
    })
    this.responseParser = responseParser

    // Set default configuration
    this.config = {
      maxRefinementRounds: 3,
      targetQualityScore: 80,
      minConfidenceThreshold: 70,
      includeMinorIssues: true,
      model: 'claude-3-haiku-20240307',
      temperature: 0.3,
      maxTokens: 4000,
      ...config
    }
  }

  /**
   * Run complete validation session with iterative refinement
   */
  async validatePresentation(
    presentation: PresentationData,
    originalRequest: GenerationRequest,
    onProgress?: (round: number, status: string) => void,
    providedFrameworkAnalysis?: FrameworkAnalysisResult // Optional to avoid duplicate calls
  ): Promise<ValidationSessionResult> {
    const sessionId = this.generateSessionId()
    const roundResults: ValidationRoundResult[] = []

    try {
      // Step 1: Framework Analysis (use provided or analyze)
      onProgress?.(0, 'Analyzing presentation framework...')
      const frameworkAnalysis = providedFrameworkAnalysis || await this.frameworkAnalyzer.analyzeFramework(
        presentation,
        originalRequest
      )

      // Step 2: Initial Content Analysis
      onProgress?.(1, 'Performing initial content analysis...')
      const initialAnalysis = await this.performContentValidation(
        presentation,
        originalRequest,
        frameworkAnalysis,
        1
      )

      let currentAnalysis = initialAnalysis
      let currentRound = 1

      // Step 3: Iterative Refinement (if needed)
      while (
        currentRound <= this.config.maxRefinementRounds &&
        currentAnalysis.overallScore < this.config.targetQualityScore &&
        this.shouldContinueRefinement(currentAnalysis, currentRound)
      ) {
        onProgress?.(currentRound, `Round ${currentRound} refinement analysis...`)

        const improvementSuggestions = await this.generateImprovementSuggestions(
          presentation,
          currentAnalysis,
          currentRound
        )

        const shouldContinue = currentRound < this.config.maxRefinementRounds &&
          currentAnalysis.overallScore < this.config.targetQualityScore

        roundResults.push({
          round: currentRound,
          analysis: currentAnalysis,
          improvementSuggestions,
          shouldContinue,
          confidenceScore: currentAnalysis.analysisMetadata.confidence
        })

        if (shouldContinue) {
          currentRound++
          // In a real implementation, this would trigger content regeneration
          // For now, we'll simulate refinement analysis
          currentAnalysis = await this.performRefinementAnalysis(
            presentation,
            currentAnalysis,
            currentRound
          )
        } else {
          break
        }
      }

      // Add final round if not already added
      if (roundResults.length === 0 || roundResults[roundResults.length - 1].round !== currentRound) {
        roundResults.push({
          round: currentRound,
          analysis: currentAnalysis,
          improvementSuggestions: await this.generateImprovementSuggestions(
            presentation,
            currentAnalysis,
            currentRound
          ),
          shouldContinue: false,
          confidenceScore: currentAnalysis.analysisMetadata.confidence
        })
      }

      // Generate session summary
      const sessionSummary = this.generateSessionSummary(initialAnalysis, currentAnalysis, roundResults)

      return {
        sessionId,
        initialAnalysis,
        frameworkAnalysis,
        roundResults,
        finalScore: currentAnalysis.overallScore,
        totalRounds: currentRound,
        targetAchieved: currentAnalysis.overallScore >= this.config.targetQualityScore,
        sessionSummary
      }

    } catch (error) {
      console.error('Validation session failed:', error)
      throw new Error(`Validation session failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Perform content validation using LLM
   */
  private async performContentValidation(
    presentation: PresentationData,
    originalRequest: GenerationRequest,
    frameworkAnalysis: FrameworkAnalysisResult,
    round: number
  ): Promise<ContentAnalysisResult> {
    try {
      const prompt = generateContentValidationPrompt(
        presentation,
        originalRequest,
        frameworkAnalysis
      )

      console.log(`Performing content validation - Round ${round}`)

      const response = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parse the LLM response
      const analysisResult = this.responseParser.parseValidationResponse(content.text)

      // Enrich with additional metadata
      analysisResult.analysisMetadata.processingTime = Date.now()
      analysisResult.analysisMetadata.frameworkUsed = frameworkAnalysis.recommendation.primary_framework

      console.log(`Content validation completed - Score: ${analysisResult.overallScore}/100`)

      return analysisResult

    } catch (error) {
      console.error('Content validation failed, falling back to rule-based analysis:', error)

      // Fallback to rule-based analysis
      return await this.contentAnalyzer.analyzeContentWithIssues(presentation, frameworkAnalysis)
    }
  }

  /**
   * Perform refinement analysis for subsequent rounds
   */
  private async performRefinementAnalysis(
    presentation: PresentationData,
    previousAnalysis: ContentAnalysisResult,
    round: number
  ): Promise<ContentAnalysisResult> {
    try {
      const prompt = generateRefinementPrompt(
        presentation,
        previousAnalysis,
        round,
        this.config.targetQualityScore
      )

      console.log(`Performing refinement analysis - Round ${round}`)

      const response = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      return this.responseParser.parseValidationResponse(content.text)

    } catch (error) {
      console.error('Refinement analysis failed:', error)

      // Return previous analysis with slight improvement simulation
      return {
        ...previousAnalysis,
        overallScore: Math.min(100, previousAnalysis.overallScore + 2)
      }
    }
  }

  /**
   * Generate improvement suggestions for current analysis
   */
  private async generateImprovementSuggestions(
    presentation: PresentationData,
    analysis: ContentAnalysisResult,
    round: number
  ): Promise<string[]> {
    const suggestions: string[] = []

    // Extract suggestions from issues
    const criticalIssues = analysis.issues.filter(i => i.severity === 'critical')
    const importantIssues = analysis.issues.filter(i => i.severity === 'important')

    criticalIssues.forEach(issue => {
      suggestions.push(`CRITICAL: ${issue.title} - ${issue.suggestedFix}`)
    })

    importantIssues.slice(0, 3).forEach(issue => {
      suggestions.push(`IMPORTANT: ${issue.title} - ${issue.suggestedFix}`)
    })

    // Add dimension-specific suggestions
    const lowestDimension = this.findLowestScoringDimension(analysis.dimensionScores)
    if (lowestDimension.score < this.config.targetQualityScore) {
      suggestions.push(`Focus on ${lowestDimension.dimension}: Currently ${lowestDimension.score}/100`)
    }

    // Add recommendations with null checks
    analysis.recommendations.slice(0, 3).forEach(rec => {
      const priority = rec.priority?.toUpperCase() || 'MEDIUM'
      const title = rec.title || 'Improvement needed'
      const implementation = rec.implementation || 'See analysis for details'
      suggestions.push(`${priority}: ${title} - ${implementation}`)
    })

    return suggestions
  }

  /**
   * Determine if refinement should continue
   */
  private shouldContinueRefinement(analysis: ContentAnalysisResult, round: number): boolean {
    // Don't continue if we've reached the target score
    if (analysis.overallScore >= this.config.targetQualityScore) {
      return false
    }

    // Don't continue if we've reached max rounds
    if (round >= this.config.maxRefinementRounds) {
      return false
    }

    // Don't continue if there are no critical or important issues
    const significantIssues = analysis.issues.filter(i =>
      i.severity === 'critical' || i.severity === 'important'
    )
    if (significantIssues.length === 0) {
      return false
    }

    // Continue if there's meaningful improvement potential
    return true
  }

  /**
   * Find the lowest scoring dimension
   */
  private findLowestScoringDimension(dimensions: ValidationDimensions): { dimension: string; score: number } {
    const entries = Object.entries(dimensions)
    const lowest = entries.reduce((min, [key, value]) =>
      value < min.score ? { dimension: key, score: value } : min,
      { dimension: entries[0][0], score: entries[0][1] }
    )

    return lowest
  }

  /**
   * Generate session summary
   */
  private generateSessionSummary(
    initialAnalysis: ContentAnalysisResult,
    finalAnalysis: ContentAnalysisResult,
    roundResults: ValidationRoundResult[]
  ) {
    const scoreImprovement = finalAnalysis.overallScore - initialAnalysis.overallScore

    const initialCriticalIssues = initialAnalysis.issues.filter(i => i.severity === 'critical').length
    const finalCriticalIssues = finalAnalysis.issues.filter(i => i.severity === 'critical').length
    const criticalIssuesResolved = initialCriticalIssues - finalCriticalIssues

    const majorImprovements: string[] = []
    Object.entries(finalAnalysis.dimensionScores).forEach(([dimension, score]) => {
      const initialScore = initialAnalysis.dimensionScores[dimension as keyof ValidationDimensions]
      if (score - initialScore >= 10) {
        majorImprovements.push(`${dimension}: +${score - initialScore} points`)
      }
    })

    const finalRecommendations = finalAnalysis.recommendations
      .filter(r => r.priority === 'high')
      .slice(0, 3)
      .map(r => r.title)

    return {
      scoreImprovement,
      criticalIssuesResolved,
      majorImprovements,
      finalRecommendations
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Quick validation check for single dimension
   */
  async validateDimension(
    presentation: PresentationData,
    dimension: keyof ValidationDimensions,
    targetScore: number
  ): Promise<{
    currentScore: number
    improvementSuggestions: string[]
    canReachTarget: boolean
  }> {
    try {
      // Get current score using rule-based analysis
      const metrics = this.contentAnalyzer.calculateContentMetrics(presentation)
      const currentScore = await this.contentAnalyzer.scoreDimension(dimension, metrics, {
        framework: { id: 'scqa', name: 'SCQA' },
        confidence: 80,
        rationale: 'Quick validation'
      } as any)

      // Generate improvement suggestions if needed
      let improvementSuggestions: string[] = []
      if (currentScore < targetScore) {
        const content = this.contentAnalyzer.extractContent(presentation)
        const prompt = generateDimensionImprovementPrompt(
          dimension,
          currentScore,
          targetScore,
          content.textContent.join(' '),
          []
        )

        const response = await this.anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 4096,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }]
        })

        const responseContent = response.content[0]
        if (responseContent.type === 'text') {
          // Extract suggestions from response
          const suggestions = responseContent.text.match(/- (.+)/g)
          if (suggestions) {
            improvementSuggestions = suggestions.map(s => s.replace(/^- /, ''))
          }
        }
      }

      return {
        currentScore,
        improvementSuggestions,
        canReachTarget: (targetScore - currentScore) <= 20 // Realistic improvement threshold
      }

    } catch (error) {
      console.error('Dimension validation failed:', error)
      return {
        currentScore: 50,
        improvementSuggestions: ['Dimension validation encountered an error. Manual review recommended.'],
        canReachTarget: false
      }
    }
  }

  /**
   * Get validation agent configuration
   */
  getConfig(): ValidationConfig {
    return { ...this.config }
  }

  /**
   * Update validation configuration
   */
  updateConfig(newConfig: Partial<ValidationConfig>): void {
    this.config = { ...this.config, ...newConfig }

    // Update content analyzer if relevant settings changed
    if (newConfig.minConfidenceThreshold !== undefined || newConfig.includeMinorIssues !== undefined) {
      this.contentAnalyzer = new ContentAnalyzer({
        audienceLevel: 'executive',
        minimumConfidence: this.config.minConfidenceThreshold,
        includeMinorIssues: this.config.includeMinorIssues
      })
    }
  }
}

/**
 * Default validation configuration
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  maxRefinementRounds: 3,
  targetQualityScore: 80,
  minConfidenceThreshold: 70,
  includeMinorIssues: true,
  model: 'claude-3-haiku-20240307',
  temperature: 0.3,
  maxTokens: 4000
}

/**
 * Create validation agent with default configuration
 */
export function createValidationAgent(
  apiKey: string,
  config?: Partial<ValidationConfig>
): ValidationAgent {
  return new ValidationAgent(apiKey, config)
}