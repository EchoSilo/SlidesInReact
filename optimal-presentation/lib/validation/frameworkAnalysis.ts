/**
 * Framework analysis and recommendation logic
 */

import Anthropic from '@anthropic-ai/sdk'
import { PresentationData, GenerationRequest } from '@/lib/types'
import { Framework, FrameworkRecommendation, SUPPORTED_FRAMEWORKS, getFramework } from './supportedFrameworks'
import { generateFrameworkAnalysisPrompt, generateFrameworkComparisonPrompt } from './frameworkPrompts'

/**
 * Framework analysis result interface
 */
export interface FrameworkAnalysisResult {
  analysis: {
    content_purpose: string
    audience_needs: string
    content_type: string
    decision_context: string
  }
  framework_evaluation: FrameworkEvaluation[]
  recommendation: {
    primary_framework: string
    confidence_score: number
    rationale: string
    alternative_framework?: string
    implementation_notes: string
  }
  current_framework_assessment: {
    detected_framework: string
    alignment_score: number
    issues: string[]
    framework_mismatch: boolean
  }
}

export interface FrameworkEvaluation {
  framework_id: string
  suitability_score: number
  rationale: string
  strengths: string[]
  weaknesses: string[]
}

/**
 * Framework analyzer class
 */
export class FrameworkAnalyzer {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = require('@/lib/anthropic-client').createAnthropicClient(apiKey)
  }

  /**
   * Analyze presentation and recommend optimal framework
   */
  async analyzeFramework(
    presentation: PresentationData,
    context: GenerationRequest
  ): Promise<FrameworkAnalysisResult> {
    try {
      const prompt = generateFrameworkAnalysisPrompt(presentation, context)

      console.log('Analyzing framework for presentation:', {
        title: presentation.title,
        type: presentation.metadata.presentation_type,
        slideCount: presentation.slides.length
      })

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        temperature: 0.3, // Lower temperature for more consistent analysis
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parse the JSON response
      const analysisResult = this.parseAnalysisResponse(content.text)

      // Validate and enrich the result
      const validatedResult = this.validateAndEnrichResult(analysisResult)

      console.log('Framework analysis completed:', {
        recommendedFramework: validatedResult.recommendation.primary_framework,
        confidence: validatedResult.recommendation.confidence_score,
        frameworkMismatch: validatedResult.current_framework_assessment.framework_mismatch
      })

      return validatedResult

    } catch (error) {
      console.error('Framework analysis failed:', error)

      // Fallback to rule-based analysis
      console.log('Falling back to rule-based framework analysis')
      return this.fallbackAnalysis(presentation, context)
    }
  }

  /**
   * Parse LLM response into structured result
   */
  private parseAnalysisResponse(responseText: string): FrameworkAnalysisResult {
    try {
      // Clean the response to ensure it's valid JSON
      let jsonStr = responseText.trim()

      // Remove any markdown code block markers
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      const result = JSON.parse(jsonStr)

      // Validate required fields
      if (!result.analysis || !result.framework_evaluation || !result.recommendation) {
        throw new Error('Missing required fields in analysis result')
      }

      return result as FrameworkAnalysisResult

    } catch (parseError) {
      console.error('Failed to parse framework analysis response:', parseError)
      console.error('Raw response:', responseText)
      throw new Error('Failed to parse framework analysis response')
    }
  }

  /**
   * Validate and enrich analysis result
   */
  private validateAndEnrichResult(result: FrameworkAnalysisResult): FrameworkAnalysisResult {
    // Ensure all frameworks are evaluated
    const evaluatedFrameworkIds = new Set(result.framework_evaluation.map(e => e.framework_id))
    const allFrameworkIds = Object.keys(SUPPORTED_FRAMEWORKS)

    for (const frameworkId of allFrameworkIds) {
      if (!evaluatedFrameworkIds.has(frameworkId)) {
        // Add missing framework evaluation with default values
        result.framework_evaluation.push({
          framework_id: frameworkId,
          suitability_score: 50,
          rationale: 'Not evaluated in initial analysis',
          strengths: [],
          weaknesses: ['Not fully analyzed']
        })
      }
    }

    // Validate recommendation framework exists
    if (!SUPPORTED_FRAMEWORKS[result.recommendation.primary_framework]) {
      console.warn(`Invalid recommended framework: ${result.recommendation.primary_framework}`)
      // Default to SCQA if invalid
      result.recommendation.primary_framework = 'scqa'
      result.recommendation.confidence_score = Math.min(result.recommendation.confidence_score, 60)
    }

    // Ensure confidence score is within valid range
    result.recommendation.confidence_score = Math.max(0, Math.min(100, result.recommendation.confidence_score))

    // Validate alignment score
    result.current_framework_assessment.alignment_score = Math.max(0, Math.min(100, result.current_framework_assessment.alignment_score))

    return result
  }

  /**
   * Fallback rule-based analysis when LLM fails
   */
  private fallbackAnalysis(
    presentation: PresentationData,
    context: GenerationRequest
  ): FrameworkAnalysisResult {
    console.log('Performing rule-based framework analysis fallback')

    const presentationType = presentation.metadata.presentation_type.toLowerCase()
    const audience = (context.audience || presentation.metadata.target_audience).toLowerCase()
    const prompt = context.prompt.toLowerCase()

    // Rule-based framework selection
    let recommendedFramework = 'scqa' // default
    let confidence = 70
    let rationale = 'Default framework selection based on general business presentation needs'

    if (prompt.includes('case study') || prompt.includes('project result') || prompt.includes('success story')) {
      recommendedFramework = 'star'
      confidence = 85
      rationale = 'Content indicates case study or project results, best suited for STAR framework'
    } else if (prompt.includes('compare') || prompt.includes('vendor') || prompt.includes('option') || prompt.includes('selection')) {
      recommendedFramework = 'comparison'
      confidence = 90
      rationale = 'Content involves comparison or selection, optimal for Comparison framework'
    } else if (audience.includes('executive') || audience.includes('c-level') || audience.includes('board')) {
      recommendedFramework = 'pyramid'
      confidence = 80
      rationale = 'Executive audience benefits from Pyramid framework with conclusion-first approach'
    } else if (prompt.includes('recommend') || prompt.includes('propose') || prompt.includes('argument')) {
      recommendedFramework = 'prep'
      confidence = 75
      rationale = 'Content focuses on recommendations or arguments, well-suited for PREP framework'
    }

    // Generate basic framework evaluations
    const framework_evaluation: FrameworkEvaluation[] = Object.keys(SUPPORTED_FRAMEWORKS).map(id => ({
      framework_id: id,
      suitability_score: id === recommendedFramework ? confidence : Math.max(30, confidence - 20),
      rationale: id === recommendedFramework ? rationale : `Less suitable than ${recommendedFramework} for this content`,
      strengths: id === recommendedFramework ? ['Selected as optimal framework'] : [],
      weaknesses: id === recommendedFramework ? [] : ['Not optimal for this specific content type']
    }))

    return {
      analysis: {
        content_purpose: `${presentationType} presentation for ${audience}`,
        audience_needs: `${audience} audience requires clear, actionable insights`,
        content_type: presentationType,
        decision_context: 'Business decision support and strategic guidance'
      },
      framework_evaluation,
      recommendation: {
        primary_framework: recommendedFramework,
        confidence_score: confidence,
        rationale,
        alternative_framework: 'scqa',
        implementation_notes: `Structure content to follow ${SUPPORTED_FRAMEWORKS[recommendedFramework].name} framework principles`
      },
      current_framework_assessment: {
        detected_framework: 'scqa', // assume current is SCQA
        alignment_score: recommendedFramework === 'scqa' ? 85 : 45,
        issues: recommendedFramework === 'scqa' ? [] : ['Framework mismatch detected in rule-based analysis'],
        framework_mismatch: recommendedFramework !== 'scqa'
      }
    }
  }

  /**
   * Get framework recommendation with confidence scoring
   */
  getFrameworkRecommendation(analysisResult: FrameworkAnalysisResult): FrameworkRecommendation {
    const framework = getFramework(analysisResult.recommendation.primary_framework)
    if (!framework) {
      throw new Error(`Framework not found: ${analysisResult.recommendation.primary_framework}`)
    }

    return {
      framework,
      confidence: analysisResult.recommendation.confidence_score,
      rationale: analysisResult.recommendation.rationale,
      alternative: analysisResult.recommendation.alternative_framework
        ? getFramework(analysisResult.recommendation.alternative_framework) || undefined
        : undefined
    }
  }

  /**
   * Quick framework suitability check for specific scenario
   */
  async quickFrameworkCheck(
    presentationPurpose: string,
    audienceType: string,
    contentType: string
  ): Promise<string> {
    try {
      const prompt = generateFrameworkComparisonPrompt(presentationPurpose, audienceType, contentType)

      const response = await this.anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 4096,
        temperature: 0.2,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      return content.text

    } catch (error) {
      console.error('Quick framework check failed:', error)
      return 'Framework analysis unavailable - using default SCQA framework'
    }
  }
}

/**
 * Standalone framework analysis function
 */
export async function analyzeFrameworkForPresentation(
  presentation: PresentationData,
  context: GenerationRequest,
  apiKey: string
): Promise<FrameworkAnalysisResult> {
  const analyzer = new FrameworkAnalyzer(apiKey)
  return analyzer.analyzeFramework(presentation, context)
}

/**
 * Get optimal framework recommendation without full analysis
 */
export function getQuickFrameworkRecommendation(
  presentationType: string,
  audience: string,
  prompt: string
): FrameworkRecommendation {
  const type = presentationType.toLowerCase()
  const aud = audience.toLowerCase()
  const promptLower = prompt.toLowerCase()

  // Quick heuristic-based recommendation
  let frameworkId = 'scqa'
  let confidence = 70

  if (promptLower.includes('case study') || promptLower.includes('results') || promptLower.includes('achievement')) {
    frameworkId = 'star'
    confidence = 85
  } else if (promptLower.includes('compare') || promptLower.includes('vendor') || promptLower.includes('options')) {
    frameworkId = 'comparison'
    confidence = 90
  } else if (aud.includes('executive') || aud.includes('c-level')) {
    frameworkId = 'pyramid'
    confidence = 80
  } else if (promptLower.includes('recommend') || promptLower.includes('convince')) {
    frameworkId = 'prep'
    confidence = 75
  }

  const framework = getFramework(frameworkId)!

  return {
    framework,
    confidence,
    rationale: `Quick recommendation based on content type (${type}) and audience (${aud})`,
    alternative: getFramework('scqa') || undefined
  }
}