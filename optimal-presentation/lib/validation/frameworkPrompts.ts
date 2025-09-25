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
  const frameworkDescriptions = Object.values(SUPPORTED_FRAMEWORKS)
    .map(framework => formatFrameworkForPrompt(framework))
    .join('\n\n')

  return `You are an expert presentation strategist and framework analyst. Your task is to analyze a presentation and recommend the optimal structural framework.

AVAILABLE FRAMEWORKS:
${frameworkDescriptions}

PRESENTATION ANALYSIS TASK:
Analyze the provided presentation content and determine:
1. What is the primary purpose and goal of this presentation?
2. Who is the target audience and what are their needs?
3. What type of content and messaging is being presented?
4. Which framework would be most effective for this specific content and context?

ANALYSIS CRITERIA:
- Content Purpose: Is this solving a problem, showcasing results, making an argument, or comparing options?
- Audience Needs: What does the audience need to understand, decide, or do?
- Information Flow: How should information be structured for maximum impact?
- Decision Context: What decisions or actions should result from this presentation?

CURRENT PRESENTATION DATA:
Title: ${presentation.title}
Subtitle: ${presentation.subtitle}
Description: ${presentation.description}
Target Audience: ${presentation.metadata.target_audience}
Presentation Type: ${presentation.metadata.presentation_type}
Slide Count: ${presentation.metadata.slide_count}

SLIDE CONTENT SUMMARY:
${generateSlideContentSummary(presentation)}

GENERATION CONTEXT:
Original Prompt: "${context.prompt}"
Intended Tone: ${context.tone}
Expected Audience: ${context.audience || 'Not specified'}

CRITICAL INSTRUCTIONS FOR RESPONSE FORMAT:
- You MUST respond with ONLY valid JSON
- NO markdown, NO explanations, NO text before or after the JSON
- Start your response with { and end with }
- Use simple strings only, avoid complex nested structures

Your response MUST be valid JSON in this simplified format:
{
  "analysis": {
    "content_purpose": "Business transformation proposal",
    "audience_needs": "Executive decision support",
    "content_type": "transformation",
    "decision_context": "Strategic business decision"
  },
  "framework_evaluation": [
    {"framework_id": "scqa", "suitability_score": 85, "rationale": "Good for problem-solving presentations"},
    {"framework_id": "prep", "suitability_score": 70, "rationale": "Suitable for arguments"},
    {"framework_id": "star", "suitability_score": 90, "rationale": "Excellent for case studies"},
    {"framework_id": "pyramid", "suitability_score": 80, "rationale": "Good for executives"},
    {"framework_id": "comparison", "suitability_score": 75, "rationale": "Good for options analysis"}
  ],
  "recommendation": {
    "primary_framework": "star",
    "confidence_score": 90,
    "rationale": "Best fit for this transformation content",
    "implementation_notes": "Follow STAR structure throughout"
  },
  "current_framework_assessment": {
    "detected_framework": "scqa",
    "alignment_score": 65,
    "issues": ["Framework mismatch with content", "Missing key elements"],
    "framework_mismatch": true
  }
}

EVALUATION GUIDELINES:
- Score frameworks 0-100 based on suitability for this specific content
- Consider audience preferences (executives prefer Pyramid, technical teams may prefer SCQA)
- Factor in content complexity and decision urgency
- Evaluate current structure alignment with detected patterns
- Provide actionable implementation guidance

Be thorough but concise. Focus on practical framework selection that will maximize presentation effectiveness.`
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
  return `You are a presentation framework expert. Compare the effectiveness of different frameworks for this specific scenario:

SCENARIO:
Purpose: ${presentationPurpose}
Audience: ${audienceType}
Content Type: ${contentType}

FRAMEWORKS TO COMPARE:
1. SCQA (Situation-Complication-Question-Answer)
2. PREP (Point-Reason-Example-Point)
3. STAR (Situation-Task-Action-Result)
4. Pyramid (Main Message-Supporting Arguments-Evidence)
5. Comparison (Options-Criteria-Analysis-Recommendation)

COMPARISON CRITERIA:
- Audience Alignment: How well does each framework match the audience's needs and preferences?
- Content Fit: How naturally does the content type align with each framework's structure?
- Persuasive Power: Which framework would be most persuasive for this specific scenario?
- Clarity & Flow: Which provides the clearest and most logical flow for this content?
- Decision Support: Which best supports the intended decision-making process?

Provide a ranked comparison with scores (0-100) and detailed rationale for each framework.`
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