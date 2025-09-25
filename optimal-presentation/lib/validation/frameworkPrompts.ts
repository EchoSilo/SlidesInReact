/**
 * LLM prompts for framework analysis and recommendation
 */

import { Framework, SUPPORTED_FRAMEWORKS } from './supportedFrameworks'
import { PresentationData, GenerationRequest } from '@/lib/types'

/**
 * Generate framework analysis prompt for LLM
 */
export function generateFrameworkAnalysisPrompt(
  presentation: PresentationData,
  context: GenerationRequest
): string {
  return `Analyze this presentation and return ONLY this JSON format:

{
  "framework_scores": {
    "scqa": 75,
    "prep": 80,
    "star": 90,
    "pyramid": 85,
    "comparison": 70
  },
  "recommendation": {
    "primary_framework": "star",
    "confidence_score": 90,
    "rationale": "Best framework for this content"
  }
}

Presentation: ${presentation.title}
Type: ${presentation.metadata.presentation_type}
Audience: ${context.audience || 'Business audience'}

Score each framework (0-100) based on fit.

CRITICAL: Return ONLY the JSON above, NO markdown, NO code blocks, NO arrays, NO explanations.
DO NOT return "analysis", "framework_evaluation", "current_framework_assessment" or any complex structures.
Your response MUST start with { and end with }.`
}

/**
 * Format framework information for LLM prompt
 */
function formatFrameworkForPrompt(framework: Framework): string {
  const steps = framework.structure
    .map(step => `   ${step.step}: ${step.description}`)
    .join('\n')

  return `${framework.name.toUpperCase()} FRAMEWORK:
Description: ${framework.description}
Structure:
${steps}

Best For: ${framework.bestFor.join(', ')}
Ideal Audience: ${framework.audience.join(', ')}
Key Characteristics: ${framework.characteristics.join(', ')}

Example Use Cases: ${framework.examples.join('; ')}`
}

/**
 * Generate slide content summary for analysis
 */
function generateSlideContentSummary(presentation: PresentationData): string {
  return presentation.slides
    .map((slide, index) => {
      const contentSummary = summarizeSlideContent(slide)
      return `Slide ${index + 1} (${slide.type}): ${slide.title}
   ${contentSummary}`
    })
    .join('\n\n')
}

/**
 * Summarize individual slide content
 */
function summarizeSlideContent(slide: any): string {
  const summaryParts: string[] = []

  if (slide.subtitle) {
    summaryParts.push(`Subtitle: ${slide.subtitle}`)
  }

  if (slide.content?.mainText) {
    summaryParts.push(`Main Text: ${slide.content.mainText.substring(0, 100)}${slide.content.mainText.length > 100 ? '...' : ''}`)
  }

  if (slide.content?.bulletPoints?.length > 0) {
    summaryParts.push(`Bullet Points: ${slide.content.bulletPoints.slice(0, 3).join(', ')}${slide.content.bulletPoints.length > 3 ? '...' : ''}`)
  }

  if (slide.content?.sections?.length > 0) {
    const sectionTitles = slide.content.sections.map((s: any) => s.title).slice(0, 2)
    summaryParts.push(`Sections: ${sectionTitles.join(', ')}${slide.content.sections.length > 2 ? '...' : ''}`)
  }

  if (slide.content?.keyMetrics?.length > 0) {
    const metrics = slide.content.keyMetrics.map((m: any) => `${m.label}: ${m.value}`).slice(0, 2)
    summaryParts.push(`Key Metrics: ${metrics.join(', ')}${slide.content.keyMetrics.length > 2 ? '...' : ''}`)
  }

  if (slide.content?.callout) {
    summaryParts.push(`Callout: ${slide.content.callout.substring(0, 80)}${slide.content.callout.length > 80 ? '...' : ''}`)
  }

  if (slide.content?.diagram) {
    summaryParts.push(`Diagram: ${slide.content.diagram.type} with ${slide.content.diagram.elements?.length || 0} elements`)
  }

  return summaryParts.length > 0 ? summaryParts.join('\n   ') : 'No detailed content'
}

/**
 * Generate framework comparison prompt for specific scenarios
 */
export function generateFrameworkComparisonPrompt(
  presentationPurpose: string,
  audienceType: string,
  contentType: string
): string {
  return `You are a presentation framework expert. Analyze this scenario and recommend the optimal framework.

SCENARIO:
Purpose: ${presentationPurpose}
Audience: ${audienceType}
Content Type: ${contentType}

AVAILABLE FRAMEWORKS:
- scqa: Situation-Complication-Question-Answer (problem-solving structure)
- prep: Point-Reason-Example-Point (persuasive argument structure)
- star: Situation-Task-Action-Result (achievement/case study structure)
- pyramid: Main Message-Supporting Arguments-Evidence (executive summary structure)
- comparison: Options-Criteria-Analysis-Recommendation (decision-making structure)

EVALUATION CRITERIA:
- Audience fit (executive vs technical vs general)
- Content alignment (transformation, proposal, case study, etc.)
- Persuasive effectiveness for the intended outcome
- Clarity and logical flow for the content type

Return your recommendation as JSON only:
{
  "recommendation": "framework_name",
  "confidence": 85,
  "rationale": "Brief explanation of why this framework is optimal for this scenario"
}`
}

/**
 * Generate framework implementation guidance prompt
 */
export function generateImplementationGuidancePrompt(
  recommendedFramework: Framework,
  currentPresentation: PresentationData
): string {
  return `You are a presentation structure expert. Provide specific implementation guidance for restructuring this presentation using the ${recommendedFramework.name} framework.

RECOMMENDED FRAMEWORK: ${recommendedFramework.name}
${formatFrameworkForPrompt(recommendedFramework)}

CURRENT PRESENTATION:
${generateSlideContentSummary(currentPresentation)}

IMPLEMENTATION GUIDANCE NEEDED:
1. Slide Restructuring: How should the current slides be reorganized to follow the ${recommendedFramework.name} structure?
2. Content Mapping: Which existing content elements map to which framework components?
3. Content Gaps: What additional content is needed to fully implement this framework?
4. Flow Optimization: How should the logical flow be adjusted for maximum impact?

Provide specific, actionable guidance for transforming this presentation to effectively use the ${recommendedFramework.name} framework.`
}

/**
 * Generate framework validation prompt
 */
export function generateFrameworkValidationPrompt(
  presentation: PresentationData,
  targetFramework: Framework
): string {
  return `You are a presentation quality analyst. Evaluate how well this presentation follows the ${targetFramework.name} framework.

TARGET FRAMEWORK: ${targetFramework.name}
${formatFrameworkForPrompt(targetFramework)}

PRESENTATION TO EVALUATE:
${generateSlideContentSummary(presentation)}

VALIDATION CRITERIA:
1. Framework Adherence: How closely does the presentation follow the ${targetFramework.name} structure?
2. Component Completeness: Are all required framework components present and well-developed?
3. Logical Flow: Does the content flow logically according to the framework's sequence?
4. Content Quality: Is each framework component effectively executed?

Provide a detailed assessment with scores (0-100) for each criterion and specific improvement recommendations.`
}