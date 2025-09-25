/**
 * Validation prompts for content analysis and framework assessment
 * Day 2 of Phase 2: Content Validation Core
 */

import { PresentationData, GenerationRequest } from '@/lib/types'
import { FrameworkAnalysisResult } from './frameworkAnalysis'
import { ValidationDimensions, ContentAnalysisResult, ValidationIssue } from './contentAnalysis'
import { Framework } from './supportedFrameworks'

/**
 * Generate comprehensive validation prompt for content analysis
 */
export function generateContentValidationPrompt(
  presentation: PresentationData,
  originalRequest: GenerationRequest,
  frameworkAnalysis: FrameworkAnalysisResult
): string {
  const framework = frameworkAnalysis.recommendation.primary_framework
  const frameworkName = framework.toUpperCase()

  return `# Content Validation Analysis for ${presentation.title}

## Your Role
You are an expert executive presentation advisor analyzing content for quality, framework adherence, and business impact. Evaluate this presentation comprehensively across four key dimensions.

## Presentation Context
**Title:** ${presentation.title}
**Type:** ${presentation.metadata.presentation_type}
**Audience:** ${presentation.metadata.target_audience}
**Duration:** ${presentation.metadata.estimated_duration} minutes
**Slides:** ${presentation.slides.length}

## Original Request
"${originalRequest.prompt}"

## Recommended Framework: ${frameworkName}
**Rationale:** ${frameworkAnalysis.recommendation.rationale}
**Confidence:** ${frameworkAnalysis.recommendation.confidence_score}%

## Content to Analyze
${generateContentSummary(presentation)}

## Evaluation Dimensions

### 1. Framework Adherence (Weight: 25%)
Evaluate how well the content follows the ${frameworkName} framework structure:
${generateFrameworkCriteria(frameworkAnalysis)}

### 2. Executive Readiness (Weight: 30%)
Assess suitability for executive audience:
- **Clarity & Conciseness**: Clear main message, concise points, minimal jargon
- **Strategic Focus**: Business impact, strategic implications, decision-oriented
- **Quantified Value**: Specific metrics, ROI, measurable outcomes
- **Action Orientation**: Clear next steps, timeline, resource requirements

### 3. Content Clarity (Weight: 25%)
Evaluate presentation clarity and comprehension:
- **Narrative Flow**: Logical progression, smooth transitions, coherent story
- **Visual Hierarchy**: Clear titles, organized sections, appropriate detail levels
- **Audience Appropriateness**: Language level, complexity, background assumptions
- **Comprehension**: Easy to follow, well-structured, avoids confusion

### 4. Business Impact (Weight: 20%)
Assess business value and persuasiveness:
- **Value Proposition**: Clear benefits, compelling case, differentiated positioning
- **Evidence & Support**: Data backing, credible sources, risk mitigation
- **Implementation Feasibility**: Realistic approach, resource consideration, timeline
- **Decision Support**: Enables informed decisions, addresses concerns, provides options

## Analysis Requirements

1. **Score each dimension 0-100** with specific rationale
2. **Calculate weighted overall score**: (Framework×0.25 + Executive×0.30 + Clarity×0.25 + Impact×0.20)
3. **Identify specific issues** with severity levels (Critical/Important/Minor)
4. **Provide improvement recommendations** prioritized by impact

ABSOLUTE CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY pure JSON
2. NO markdown, NO code blocks, NO explanations
3. Your response MUST start with { and end with }
4. Keep all text short and simple

REQUIRED JSON FORMAT (simple structure, NO nested objects in arrays):
{
  "framework_adherence_score": 85,
  "executive_readiness_score": 78,
  "content_clarity_score": 82,
  "business_impact_score": 75,
  "overall_score": 80,
  "quality_level": "good",
  "primary_issue": "framework structure needs improvement",
  "issue_severity": "minor",
  "primary_recommendation": "improve executive summary clarity",
  "framework_fit_score": 75,
  "alternative_framework": "pyramid"
}

Be thorough, specific, and actionable in your analysis. Focus on practical improvements that will enhance the presentation's effectiveness for the target audience.`
}

/**
 * Generate framework-specific validation criteria
 */
function generateFrameworkCriteria(frameworkAnalysis: FrameworkAnalysisResult): string {
  const framework = frameworkAnalysis.recommendation.primary_framework.toLowerCase()

  switch (framework) {
    case 'scqa':
      return `
- **Situation**: Clear context setting and current state description
- **Complication**: Well-defined problem or challenge identification
- **Question**: Explicit or implicit key question to be answered
- **Answer**: Comprehensive solution with supporting evidence`

    case 'prep':
      return `
- **Point**: Clear main argument or recommendation upfront
- **Reason**: Supporting rationale and logical backing
- **Example**: Concrete evidence, data, or case studies
- **Point**: Reinforced conclusion that ties back to opening`

    case 'star':
      return `
- **Situation**: Clear context and background setting
- **Task**: Specific objective or challenge to address
- **Action**: Detailed approach and execution steps
- **Result**: Measurable outcomes and achievements`

    case 'pyramid':
      return `
- **Main Message**: Clear executive summary and key takeaway
- **Supporting Arguments**: 3-5 key supporting points
- **Evidence**: Data, analysis, and proof points backing each argument`

    case 'comparison':
      return `
- **Options**: Clear presentation of available alternatives
- **Criteria**: Evaluation framework and decision factors
- **Analysis**: Systematic comparison across criteria
- **Recommendation**: Clear preference with supporting rationale`

    default:
      return `
- **Structure**: Logical flow and organization
- **Content**: Comprehensive coverage of key points
- **Evidence**: Supporting data and examples
- **Conclusion**: Clear takeaways and next steps`
  }
}

/**
 * Generate executive-focused critique prompt
 */
export function generateExecutiveCritiquePrompt(
  presentation: PresentationData,
  currentScore: number,
  issues: ValidationIssue[]
): string {
  const criticalIssues = issues.filter(i => i.severity === 'critical')
  const importantIssues = issues.filter(i => i.severity === 'important')

  return `# Executive Presentation Critique

## Presentation Overview
**Title:** ${presentation.title}
**Current Quality Score:** ${currentScore}/100
**Target Audience:** ${presentation.metadata.target_audience}

## Critical Issues Identified (${criticalIssues.length})
${criticalIssues.map(issue => `
### ${issue.title}
**Problem:** ${issue.description}
**Impact:** ${issue.severity.toUpperCase()} - affects executive decision-making
**Fix:** ${issue.suggestedFix}
`).join('')}

## Important Issues Identified (${importantIssues.length})
${importantIssues.map(issue => `
### ${issue.title}
**Problem:** ${issue.description}
**Fix:** ${issue.suggestedFix}
`).join('')}

## Executive Review Questions

As a senior executive reviewing this presentation, evaluate:

1. **Strategic Clarity**: Can I quickly understand the business case and implications?
2. **Decision Readiness**: Do I have enough information to make informed decisions?
3. **Value Proposition**: Is the business value clearly articulated and compelling?
4. **Implementation Confidence**: Is the approach realistic and well-planned?
5. **Risk Assessment**: Are potential risks and mitigation strategies addressed?

## Response Requirements

Provide specific, actionable feedback focusing on:
- Content that would confuse or frustrate executives
- Missing information critical for decision-making
- Opportunities to strengthen business impact
- Presentation flow improvements
- Language and tone adjustments for executive audience

Format your response as clear, prioritized recommendations with specific examples from the content.`
}

/**
 * Generate framework comparison prompt for alternative framework assessment
 */
export function generateFrameworkComparisonPrompt(
  presentation: PresentationData,
  currentFramework: string,
  contentSummary: string
): string {
  return `# Framework Suitability Analysis

## Current Situation
**Presentation:** ${presentation.title}
**Current Framework:** ${currentFramework.toUpperCase()}
**Content Type:** ${presentation.metadata.presentation_type}
**Audience:** ${presentation.metadata.target_audience}

## Content Summary
${contentSummary}

## Framework Evaluation Task

Evaluate whether the current ${currentFramework.toUpperCase()} framework is optimal, or if one of these alternatives would be better:

### Available Frameworks
1. **SCQA** - Situation-Complication-Question-Answer (problem-solving)
2. **PREP** - Point-Reason-Example-Point (persuasive arguments)
3. **STAR** - Situation-Task-Action-Result (case studies/results)
4. **Pyramid** - Main Message-Supporting Arguments-Evidence (executive summaries)
5. **Comparison** - Options-Criteria-Analysis-Recommendation (decision-making)

## Analysis Criteria
- **Content Purpose**: What is the primary goal of this presentation?
- **Audience Needs**: What does the target audience need to know/decide?
- **Content Type**: What type of information is being presented?
- **Decision Context**: What decisions will be made based on this presentation?

## Response Format
Respond with JSON:

\`\`\`json
{
  "current_framework_assessment": {
    "framework": "${currentFramework}",
    "suitability_score": 0-100,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "alternative_recommendation": {
    "recommended_framework": "scqa|prep|star|pyramid|comparison|null",
    "confidence": 0-100,
    "rationale": "Why this framework would be better",
    "expected_improvement": "How switching would improve the presentation",
    "implementation_effort": "low|medium|high"
  },
  "framework_rankings": [
    {
      "framework": "framework_name",
      "score": 0-100,
      "rationale": "Brief explanation"
    }
  ]
}
\`\`\`

Be specific about why each framework would or wouldn't work for this particular content and audience.`
}

/**
 * Generate dimension-specific improvement prompt
 */
export function generateDimensionImprovementPrompt(
  dimension: keyof ValidationDimensions,
  currentScore: number,
  targetScore: number,
  content: string,
  issues: ValidationIssue[]
): string {
  const dimensionFocus = getDimensionFocus(dimension)
  const relevantIssues = issues.filter(issue =>
    issue.type.toLowerCase().includes(dimension.toLowerCase()) ||
    isDimensionRelatedIssue(dimension, issue.type)
  )

  return `# ${dimension.toUpperCase()} Improvement Analysis

## Current Situation
**Dimension:** ${dimension}
**Current Score:** ${currentScore}/100
**Target Score:** ${targetScore}/100
**Improvement Needed:** ${targetScore - currentScore} points

## Focus Areas
${dimensionFocus}

## Identified Issues (${relevantIssues.length})
${relevantIssues.map(issue => `
### ${issue.title} (${issue.severity})
**Problem:** ${issue.description}
**Suggested Fix:** ${issue.suggestedFix}
**Confidence:** ${issue.confidence}%
`).join('')}

## Content Analysis
${content}

## Improvement Task

Provide specific, actionable recommendations to improve the ${dimension} score from ${currentScore} to ${targetScore}:

1. **Priority Fixes**: Most impactful changes (aim for 60% of improvement)
2. **Secondary Improvements**: Additional enhancements (30% of improvement)
3. **Polish Items**: Final refinements (10% of improvement)

## Response Format

\`\`\`json
{
  "improvements": [
    {
      "priority": "high|medium|low",
      "category": "content|structure|language|evidence|flow",
      "description": "Specific improvement to make",
      "implementation": "How to implement this change",
      "expected_impact": "Points improvement (1-20)",
      "effort": "low|medium|high",
      "examples": ["specific example 1", "specific example 2"]
    }
  ],
  "quick_wins": [
    "Easy changes that provide immediate improvement"
  ],
  "comprehensive_changes": [
    "Larger changes that require significant revision"
  ]
}
\`\`\`

Focus on practical, implementable changes that will move the needle on this specific dimension.`
}

/**
 * Get dimension-specific focus areas
 */
function getDimensionFocus(dimension: keyof ValidationDimensions): string {
  switch (dimension) {
    case 'frameworkAdherence':
      return `
- **Structure Alignment**: Does content follow framework steps in order?
- **Framework Completeness**: Are all framework elements present?
- **Logical Flow**: Does the framework create a coherent narrative?
- **Framework Optimization**: Is this the best framework for this content?`

    case 'executiveReadiness':
      return `
- **Strategic Level**: Focus on business impact and strategic implications
- **Conciseness**: Executive-appropriate length and detail level
- **Decision Support**: Information needed for executive decisions
- **Quantified Value**: Specific metrics, ROI, and measurable outcomes`

    case 'contentClarity':
      return `
- **Language Clarity**: Clear, jargon-free communication
- **Logical Organization**: Well-structured, easy to follow
- **Visual Hierarchy**: Clear headings, sections, and flow
- **Audience Appropriateness**: Right level of detail and complexity`

    case 'businessImpact':
      return `
- **Value Proposition**: Clear business benefits and ROI
- **Evidence Quality**: Strong data and supporting proof
- **Implementation Feasibility**: Realistic and well-planned approach
- **Risk Mitigation**: Addresses potential challenges and solutions`

    default:
      return '- General content quality and effectiveness'
  }
}

/**
 * Check if an issue type is related to a specific dimension
 */
function isDimensionRelatedIssue(dimension: keyof ValidationDimensions, issueType: string): boolean {
  const mappings = {
    frameworkAdherence: ['framework_structure', 'flow_narrative', 'consistency'],
    executiveReadiness: ['executive_format', 'business_value', 'action_items', 'content_density'],
    contentClarity: ['clarity_language', 'audience_level', 'flow_narrative'],
    businessImpact: ['business_value', 'evidence_support', 'action_items']
  }

  return mappings[dimension]?.includes(issueType) || false
}

/**
 * Generate content summary for prompts
 */
function generateContentSummary(presentation: PresentationData): string {
  return presentation.slides.map((slide, index) => {
    let content = `## Slide ${index + 1}: ${slide.title || 'Untitled'} (${slide.type})`

    if (slide.subtitle) {
      content += `\n**Subtitle:** ${slide.subtitle}`
    }

    if (slide.content) {
      // Extract main text content
      if (slide.content.mainText) {
        content += `\n**Main Content:** ${slide.content.mainText}`
      }

      // Extract bullet points
      if (slide.content.bulletPoints) {
        content += `\n**Points:**\n${slide.content.bulletPoints.map(point => `- ${point}`).join('\n')}`
      }

      // Extract sections
      if (slide.content.sections) {
        content += `\n**Sections:**`
        slide.content.sections.forEach(section => {
          content += `\n### ${section.title}`
          if (section.description) content += `\n${section.description}`
          if (section.items) {
            content += `\n${section.items.map(item => `- ${item}`).join('\n')}`
          }
        })
      }

      // Extract metrics
      if (slide.content.keyMetrics) {
        content += `\n**Metrics:**`
        slide.content.keyMetrics.forEach(metric => {
          content += `\n- ${metric.label}: ${metric.value} (${metric.description || 'No description'})`
        })
      }

      // Extract callouts
      if (slide.content.callout) {
        content += `\n**Callout:** ${slide.content.callout}`
      }
    }

    return content
  }).join('\n\n')
}

/**
 * Generate iterative refinement prompt for subsequent validation rounds
 */
export function generateRefinementPrompt(
  presentation: PresentationData,
  previousAnalysis: ContentAnalysisResult,
  refinementRound: number,
  targetScore: number
): string {
  const currentScore = previousAnalysis.overallScore
  const criticalIssues = previousAnalysis.issues.filter(i => i.severity === 'critical')
  const importantIssues = previousAnalysis.issues.filter(i => i.severity === 'important')

  return `# Refinement Round ${refinementRound} - Content Analysis

## Progress Tracking
**Current Score:** ${currentScore}/100
**Target Score:** ${targetScore}/100
**Gap to Close:** ${targetScore - currentScore} points
**Refinement Round:** ${refinementRound}/3

## Previous Analysis Summary
**Strengths Identified:**
${Object.entries(previousAnalysis.dimensionScores).map(([dim, scores]) =>
  `- **${dim}**: ${scores.score}/100 - ${scores.strengths?.join(', ') || 'No strengths listed'}`
).join('\n')}

## Critical Issues to Address (${criticalIssues.length})
${criticalIssues.map((issue, index) => `
${index + 1}. **${issue.title}** (${issue.confidence}% confidence)
   - Problem: ${issue.description}
   - Affects: ${issue.affectedSlides.join(', ')}
   - Fix: ${issue.suggestedFix}
`).join('')}

## Important Issues to Consider (${importantIssues.length})
${importantIssues.slice(0, 3).map((issue, index) => `
${index + 1}. **${issue.title}** (${issue.confidence}% confidence)
   - Fix: ${issue.suggestedFix}
`).join('')}

## Updated Content to Analyze
${generateContentSummary(presentation)}

## Refinement Focus

Given this is refinement round ${refinementRound}, focus on:

${refinementRound === 1 ? `
**Round 1 Priorities:**
- Address all critical issues first
- Focus on framework adherence and executive readiness
- Make high-impact structural improvements
- Target 10-15 point score improvement
` : refinementRound === 2 ? `
**Round 2 Priorities:**
- Address remaining important issues
- Polish content clarity and business impact
- Refine language and presentation flow
- Target 5-10 point score improvement
` : `
**Round 3 Priorities (Final Polish):**
- Address any remaining minor issues
- Optimize for maximum executive impact
- Final language and flow refinements
- Target 3-7 point score improvement
`}

## Analysis Requirements

1. **Compare to previous analysis** - note improvements made
2. **Reassess all dimensions** with updated scores
3. **Identify remaining issues** that still need attention
4. **Prioritize next improvements** based on remaining gap
5. **Provide specific feedback** on changes made

Use the same JSON response format as the initial validation, but include a "progress_assessment" section:

\`\`\`json
{
  // ... standard validation response format ...
  "progress_assessment": {
    "score_improvement": ${currentScore} - previous_score,
    "issues_resolved": ["issue type 1", "issue type 2"],
    "remaining_priorities": ["priority 1", "priority 2"],
    "refinement_effectiveness": "high|medium|low",
    "next_round_focus": "Specific guidance for next refinement round"
  }
}
\`\`\`

Be constructive and focus on the most impactful remaining improvements to reach the target score.`
}