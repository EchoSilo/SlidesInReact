/**
 * Response parsing and validation for LLM-generated content analysis
 * Day 2 of Phase 2: Content Validation Core
 */

import {
  ContentAnalysisResult,
  ValidationDimensions,
  ValidationIssue,
  IssueType,
  IssueSeverity,
  QualityLevel,
  AnalysisRecommendation
} from './contentAnalysis'

/**
 * Raw LLM response interface for validation analysis
 */
export interface RawValidationResponse {
  dimension_scores: {
    framework_adherence: DimensionScore
    executive_readiness: DimensionScore
    content_clarity: DimensionScore
    business_impact: DimensionScore
  }
  overall_score: number
  quality_level: string
  primary_issue: string
  issue_severity: string
  issue_fix: string
  primary_recommendation: string
  recommendation_rationale: string
  recommendation_impact: string
  framework_assessment: {
    current_framework_fit: number
    alternative_framework: string | null
    switch_rationale: string
    framework_confidence: number
  }
  progress_assessment?: {
    score_improvement: number
    issues_resolved: string[]
    remaining_priorities: string[]
    refinement_effectiveness: string
    next_round_focus: string
  }
}

interface DimensionScore {
  score: number
  rationale: string
  strengths: string[]
  weaknesses: string[]
}

interface RawValidationIssue {
  type: string
  severity: string
  title: string
  description: string
  affected_slides: string[]
  suggested_fix: string
  confidence: number
}

interface RawRecommendation {
  priority: string
  category: string
  recommendation: string
  rationale: string
  implementation: string
  impact: string
}

/**
 * Parse and validate LLM response for content analysis
 */
export class ValidationResponseParser {
  /**
   * Parse raw JSON response from LLM into structured ContentAnalysisResult
   */
  parseValidationResponse(responseText: string): ContentAnalysisResult {
    try {
      // Clean the response text
      const cleanedText = this.cleanResponseText(responseText)

      // Try robust parsing with multiple strategies
      const rawResponse: RawValidationResponse = this.tryMultipleParsingStrategies(cleanedText)

      // Validate the response structure
      this.validateResponseStructure(rawResponse)

      // Convert to structured format
      return this.convertToContentAnalysisResult(rawResponse)

    } catch (error) {
      console.error('Failed to parse validation response:', error)
      console.error('Raw response:', responseText.substring(0, 500))

      // Return fallback result
      return this.createFallbackResult(responseText)
    }
  }

  /**
   * Try multiple JSON parsing strategies for malformed JSON
   */
  private tryMultipleParsingStrategies(jsonStr: string): any {
    const strategies = [
      // Strategy 1: Direct parsing
      () => JSON.parse(jsonStr),

      // Strategy 2: Fix common array and object issues
      () => {
        let fixed = jsonStr
          // Fix missing commas in arrays - look for ] followed by space and "
          .replace(/]\s+"/g, '], "')
          // Fix missing commas between array elements
          .replace(/"\s+"/g, '", "')
          // Fix missing commas between objects in arrays
          .replace(/}\s+{/g, '}, {')
          // Fix trailing commas before closing brackets/braces
          .replace(/,\s*([}\]])/g, '$1')
          // Fix missing closing brackets/braces at common positions
          .replace(/([^}\],])\s*$/, '$1}')
          // Fix common object key-value separator issues
          .replace(/"\s*:\s*([^",}\]]+)(?=[,}\]])/g, '": "$1"')

        return JSON.parse(fixed)
      },

      // Strategy 3: Find the largest valid JSON fragment
      () => {
        // Try to find a valid JSON by removing characters from the end
        for (let i = jsonStr.length - 1; i >= jsonStr.length / 2; i--) {
          try {
            const partial = jsonStr.substring(0, i)
            // Try to close any open braces/brackets
            const openBraces = (partial.match(/\{/g) || []).length - (partial.match(/\}/g) || []).length
            const openBrackets = (partial.match(/\[/g) || []).length - (partial.match(/\]/g) || []).length

            let closed = partial
            for (let j = 0; j < openBrackets; j++) closed += ']'
            for (let j = 0; j < openBraces; j++) closed += '}'

            return JSON.parse(closed)
          } catch (e) {
            continue
          }
        }
        throw new Error('No valid JSON fragment found')
      },

      // Strategy 4: Extract key sections and rebuild for validation response
      () => {
        const extractedScores = this.extractScoresSafely(jsonStr)

        return {
          dimension_scores: {
            framework_adherence: {
              score: extractedScores.framework_adherence || 70,
              rationale: "Extracted from partial response",
              strengths: [],
              weaknesses: []
            },
            executive_readiness: {
              score: extractedScores.executive_readiness || 70,
              rationale: "Extracted from partial response",
              strengths: [],
              weaknesses: []
            },
            content_clarity: {
              score: extractedScores.content_clarity || 70,
              rationale: "Extracted from partial response",
              strengths: [],
              weaknesses: []
            },
            business_impact: {
              score: extractedScores.business_impact || 70,
              rationale: "Extracted from partial response",
              strengths: [],
              weaknesses: []
            }
          },
          overall_score: extractedScores.overall || 70,
          quality_level: "acceptable",
          issues: [],
          recommendations: [],
          framework_assessment: {
            current_framework_fit: 70,
            alternative_framework: null,
            switch_rationale: "Standard assessment",
            framework_confidence: 70
          }
        }
      }
    ]

    for (let i = 0; i < strategies.length; i++) {
      try {
        const result = strategies[i]()
        console.log(`Validation parsing strategy ${i + 1} succeeded`)
        return result
      } catch (error) {
        console.log(`Validation parsing strategy ${i + 1} failed:`, error.message)
        if (i === strategies.length - 1) {
          throw error
        }
      }
    }
  }

  /**
   * Extract scores from malformed JSON safely
   */
  private extractScoresSafely(jsonStr: string): Record<string, number> {
    const scores: Record<string, number> = {}

    // Look for score patterns
    const scorePatterns = [
      /framework_adherence[^}]*score[^0-9]*(\d+)/i,
      /executive_readiness[^}]*score[^0-9]*(\d+)/i,
      /content_clarity[^}]*score[^0-9]*(\d+)/i,
      /business_impact[^}]*score[^0-9]*(\d+)/i,
      /overall_score[^0-9]*(\d+)/i
    ]

    const keys = ['framework_adherence', 'executive_readiness', 'content_clarity', 'business_impact', 'overall']

    scorePatterns.forEach((pattern, index) => {
      const match = jsonStr.match(pattern)
      if (match && match[1]) {
        const score = parseInt(match[1])
        if (score >= 0 && score <= 100) {
          scores[keys[index]] = score
        }
      }
    })

    return scores
  }

  /**
   * Clean response text to ensure valid JSON
   */
  private cleanResponseText(responseText: string): string {
    let cleaned = responseText.trim()

    // Remove markdown code block markers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    // Remove any leading/trailing whitespace
    cleaned = cleaned.trim()

    // Basic JSON validation - ensure it starts with { and ends with }
    if (!cleaned.startsWith('{')) {
      // Try to find JSON block in the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleaned = jsonMatch[0]
      } else {
        throw new Error('No valid JSON found in response')
      }
    }

    return cleaned
  }

  /**
   * Validate response structure has required fields
   */
  private validateResponseStructure(response: RawValidationResponse): void {
    const requiredFields = [
      'dimension_scores',
      'overall_score',
      'quality_level',
      'primary_issue',
      'primary_recommendation',
      'framework_assessment'
    ]

    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Validate dimension scores structure
    const requiredDimensions = [
      'framework_adherence',
      'executive_readiness',
      'content_clarity',
      'business_impact'
    ]

    for (const dimension of requiredDimensions) {
      if (!(dimension in response.dimension_scores)) {
        throw new Error(`Missing dimension score: ${dimension}`)
      }

      const dimScore = response.dimension_scores[dimension as keyof typeof response.dimension_scores]
      if (typeof dimScore.score !== 'number' || dimScore.score < 0 || dimScore.score > 100) {
        throw new Error(`Invalid score for ${dimension}: ${dimScore.score}`)
      }
    }

    // Validate overall score
    if (typeof response.overall_score !== 'number' || response.overall_score < 0 || response.overall_score > 100) {
      throw new Error(`Invalid overall score: ${response.overall_score}`)
    }

    // Validate simplified fields (no more arrays)
    if (typeof response.primary_issue !== 'string') {
      console.warn('Missing primary_issue, using default')
    }

    if (typeof response.primary_recommendation !== 'string') {
      console.warn('Missing primary_recommendation, using default')
    }
  }

  /**
   * Convert raw response to ContentAnalysisResult
   */
  private convertToContentAnalysisResult(response: RawValidationResponse): ContentAnalysisResult {
    // Convert dimension scores
    const dimensionScores: ValidationDimensions = {
      frameworkAdherence: response.dimension_scores.framework_adherence.score,
      executiveReadiness: response.dimension_scores.executive_readiness.score,
      contentClarity: response.dimension_scores.content_clarity.score,
      businessImpact: response.dimension_scores.business_impact.score
    }

    // Convert simplified issue structure
    const issues: ValidationIssue[] = [{
      id: this.generateIssueId(),
      type: this.parseIssueType('framework_structure'),
      severity: this.parseIssueSeverity(response.issue_severity || 'minor'),
      title: response.primary_issue || 'Content improvement needed',
      description: response.primary_issue || 'Content improvement needed',
      affectedSlides: [],
      suggestedFix: response.issue_fix || 'Review and improve content',
      confidence: 75,
      framework_related: true
    }]

    // Convert simplified recommendation structure
    const recommendations: AnalysisRecommendation[] = [{
      id: this.generateRecommendationId(),
      priority: this.parsePriority('medium'),
      category: 'content',
      title: response.primary_recommendation || 'Improve content quality',
      description: response.recommendation_rationale || 'Enhance presentation effectiveness',
      implementation: response.issue_fix || 'Review and revise content',
      expectedImpact: response.recommendation_impact || 'Better audience engagement',
      relatedIssues: []
    }]

    // Parse quality level
    const qualityLevel = this.parseQualityLevel(response.quality_level)

    return {
      overallScore: Math.round(response.overall_score),
      dimensionScores,
      qualityLevel,
      issues,
      recommendations,
      analysisMetadata: {
        timestamp: new Date().toISOString(),
        analyzerVersion: '2.0.0',
        confidence: this.calculateOverallConfidence(issues),
        processingTime: 0,
        frameworkUsed: 'llm-enhanced'
      },
      dimensionDetails: {
        frameworkAdherence: {
          score: response.dimension_scores.framework_adherence.score,
          rationale: response.dimension_scores.framework_adherence.rationale,
          strengths: response.dimension_scores.framework_adherence.strengths,
          weaknesses: response.dimension_scores.framework_adherence.weaknesses
        },
        executiveReadiness: {
          score: response.dimension_scores.executive_readiness.score,
          rationale: response.dimension_scores.executive_readiness.rationale,
          strengths: response.dimension_scores.executive_readiness.strengths,
          weaknesses: response.dimension_scores.executive_readiness.weaknesses
        },
        contentClarity: {
          score: response.dimension_scores.content_clarity.score,
          rationale: response.dimension_scores.content_clarity.rationale,
          strengths: response.dimension_scores.content_clarity.strengths,
          weaknesses: response.dimension_scores.content_clarity.weaknesses
        },
        businessImpact: {
          score: response.dimension_scores.business_impact.score,
          rationale: response.dimension_scores.business_impact.rationale,
          strengths: response.dimension_scores.business_impact.strengths,
          weaknesses: response.dimension_scores.business_impact.weaknesses
        }
      },
      frameworkAssessment: {
        currentFrameworkFit: response.framework_assessment.current_framework_fit,
        alternativeFramework: response.framework_assessment.alternative_framework,
        switchRationale: response.framework_assessment.switch_rationale,
        frameworkConfidence: response.framework_assessment.framework_confidence
      },
      progressAssessment: response.progress_assessment ? {
        scoreImprovement: response.progress_assessment.score_improvement,
        issuesResolved: response.progress_assessment.issues_resolved,
        remainingPriorities: response.progress_assessment.remaining_priorities,
        refinementEffectiveness: response.progress_assessment.refinement_effectiveness,
        nextRoundFocus: response.progress_assessment.next_round_focus
      } : undefined
    }
  }

  /**
   * Parse issue type from string
   */
  private parseIssueType(typeString: string): IssueType {
    const typeMap: Record<string, IssueType> = {
      'framework_structure': IssueType.FRAMEWORK_STRUCTURE,
      'executive_format': IssueType.EXECUTIVE_FORMAT,
      'clarity_language': IssueType.CLARITY_LANGUAGE,
      'business_value': IssueType.BUSINESS_VALUE,
      'consistency': IssueType.CONSISTENCY,
      'flow_narrative': IssueType.FLOW_NARRATIVE,
      'content_density': IssueType.CONTENT_DENSITY,
      'audience_level': IssueType.AUDIENCE_LEVEL,
      'evidence_support': IssueType.EVIDENCE_SUPPORT,
      'action_items': IssueType.ACTION_ITEMS
    }

    return typeMap[typeString.toLowerCase()] || IssueType.CONSISTENCY
  }

  /**
   * Parse issue severity from string
   */
  private parseIssueSeverity(severityString: string): IssueSeverity {
    const severityMap: Record<string, IssueSeverity> = {
      'critical': IssueSeverity.CRITICAL,
      'important': IssueSeverity.IMPORTANT,
      'minor': IssueSeverity.MINOR
    }

    return severityMap[severityString.toLowerCase()] || IssueSeverity.MINOR
  }

  /**
   * Parse quality level from string
   */
  private parseQualityLevel(qualityString: string): QualityLevel {
    const qualityMap: Record<string, QualityLevel> = {
      'excellent': 'excellent',
      'good': 'good',
      'acceptable': 'acceptable',
      'needsimprovement': 'needsImprovement',
      'poor': 'poor'
    }

    return qualityMap[qualityString.toLowerCase().replace(/[^a-z]/g, '')] || 'acceptable'
  }

  /**
   * Parse priority from string
   */
  private parsePriority(priorityString: string): 'high' | 'medium' | 'low' {
    const priority = priorityString.toLowerCase()
    if (priority.includes('high')) return 'high'
    if (priority.includes('low')) return 'low'
    return 'medium'
  }

  /**
   * Check if issue type is framework-related
   */
  private isFrameworkRelated(issueType: string): boolean {
    const frameworkTypes = ['framework_structure', 'flow_narrative', 'consistency']
    return frameworkTypes.includes(issueType.toLowerCase())
  }

  /**
   * Generate unique issue ID
   */
  private generateIssueId(): string {
    return `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Generate unique recommendation ID
   */
  private generateRecommendationId(): string {
    return `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Calculate overall confidence from issues
   */
  private calculateOverallConfidence(issues: ValidationIssue[]): number {
    if (issues.length === 0) return 85

    const avgConfidence = issues.reduce((sum, issue) => sum + issue.confidence, 0) / issues.length
    return Math.round(avgConfidence)
  }

  /**
   * Create fallback result when parsing fails
   */
  private createFallbackResult(responseText: string): ContentAnalysisResult {
    console.warn('Creating fallback validation result due to parsing failure')

    // Try to extract any numerical scores from the text
    const scoreMatches = responseText.match(/\d+/g)
    const fallbackScore = scoreMatches ? Math.min(100, parseInt(scoreMatches[0]) || 50) : 50

    return {
      overallScore: fallbackScore,
      dimensionScores: {
        frameworkAdherence: fallbackScore,
        executiveReadiness: fallbackScore,
        contentClarity: fallbackScore,
        businessImpact: fallbackScore
      },
      qualityLevel: fallbackScore >= 70 ? 'acceptable' : 'needsImprovement',
      issues: [{
        id: 'fallback_issue',
        type: IssueType.CONSISTENCY,
        severity: IssueSeverity.IMPORTANT,
        title: 'Validation Analysis Incomplete',
        description: 'The AI validation analysis could not be fully processed. Manual review recommended.',
        affectedSlides: [],
        suggestedFix: 'Review the content manually or retry the validation analysis.',
        confidence: 60,
        framework_related: false
      }],
      recommendations: [{
        id: 'fallback_rec',
        priority: 'medium',
        category: 'system',
        title: 'Retry Content Validation',
        description: 'The validation analysis encountered issues and should be retried.',
        implementation: 'Run the validation analysis again or perform manual content review.',
        expectedImpact: 'Improved analysis accuracy and more specific recommendations.',
        relatedIssues: ['fallback_issue']
      }],
      analysisMetadata: {
        timestamp: new Date().toISOString(),
        analyzerVersion: '2.0.0-fallback',
        confidence: 60,
        processingTime: 0,
        frameworkUsed: 'fallback'
      }
    }
  }
}

/**
 * Validation response type guards
 */
export function isValidValidationResponse(obj: any): obj is RawValidationResponse {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.dimension_scores &&
    typeof obj.overall_score === 'number' &&
    Array.isArray(obj.issues) &&
    Array.isArray(obj.recommendations)
  )
}

/**
 * Extract improvement suggestions from response text
 */
export function extractImprovementSuggestions(responseText: string): string[] {
  const suggestions: string[] = []

  // Look for numbered lists
  const numberedMatches = responseText.match(/^\d+\.\s+(.+)$/gm)
  if (numberedMatches) {
    suggestions.push(...numberedMatches.map(match => match.replace(/^\d+\.\s+/, '')))
  }

  // Look for bullet points
  const bulletMatches = responseText.match(/^[-*]\s+(.+)$/gm)
  if (bulletMatches) {
    suggestions.push(...bulletMatches.map(match => match.replace(/^[-*]\s+/, '')))
  }

  // Look for "Recommendation:" or "Suggest:" patterns
  const recMatches = responseText.match(/(?:Recommendation|Suggest|Improve|Fix):\s*(.+?)(?:\n|$)/gi)
  if (recMatches) {
    suggestions.push(...recMatches.map(match =>
      match.replace(/^(?:Recommendation|Suggest|Improve|Fix):\s*/i, '')
    ))
  }

  return suggestions.filter(s => s.trim().length > 10) // Filter out very short suggestions
}

/**
 * Standardize common LLM response variations
 */
export function normalizeResponseText(responseText: string): string {
  return responseText
    .replace(/\bneeds improvement\b/gi, 'needsImprovement')
    .replace(/\bneeds_improvement\b/gi, 'needsImprovement')
    .replace(/\bframework-adherence\b/gi, 'framework_adherence')
    .replace(/\bexecutive-readiness\b/gi, 'executive_readiness')
    .replace(/\bcontent-clarity\b/gi, 'content_clarity')
    .replace(/\bbusiness-impact\b/gi, 'business_impact')
}

// Create singleton instance for easy import
export const responseParser = new ValidationResponseParser()