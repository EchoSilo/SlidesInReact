/**
 * Round-specific improvement prompts for iterative refinement
 * Phase 3: Iterative Refinement Engine - Day 4
 */

import { PresentationData, GenerationRequest } from '@/lib/types'
import { FrameworkAnalysisResult } from './frameworkAnalysis'
import { ValidationIssue, IssueSeverity } from './contentAnalysis'

/**
 * Refinement focus area definitions
 */
export interface RefinementFocus {
  area: string
  description: string
  priority: number
  targetImprovement: number
  specificIssues: ValidationIssue[]
}

/**
 * Round-specific prompt configuration
 */
export interface RoundPromptConfig {
  round: number
  focusAreas: string[]
  targetImprovement: number
  preserveAreas: string[]
  improvementInstructions: string[]
}

/**
 * Generate round-specific refinement prompt
 */
export async function generateRoundSpecificPrompt(
  presentation: PresentationData,
  originalRequest: GenerationRequest,
  frameworkAnalysis: FrameworkAnalysisResult,
  round: number,
  criticalIssues: ValidationIssue[],
  targetImprovement: number
): Promise<string> {
  const roundConfig = getRoundConfiguration(round, criticalIssues, targetImprovement)

  switch (round) {
    case 1:
      return generateFoundationRefinementPrompt(
        presentation,
        originalRequest,
        frameworkAnalysis,
        roundConfig
      )

    case 2:
      return generateExecutiveRefinementPrompt(
        presentation,
        originalRequest,
        frameworkAnalysis,
        roundConfig
      )

    case 3:
    default:
      return generatePolishRefinementPrompt(
        presentation,
        originalRequest,
        frameworkAnalysis,
        roundConfig
      )
  }
}

/**
 * Generate foundation refinement prompt (Round 1)
 */
function generateFoundationRefinementPrompt(
  presentation: PresentationData,
  originalRequest: GenerationRequest,
  frameworkAnalysis: FrameworkAnalysisResult,
  config: RoundPromptConfig
): string {
  const framework = frameworkAnalysis.recommendation.primary_framework.toUpperCase()
  const criticalIssueDescriptions = config.improvementInstructions.slice(0, 3)

  return `# Round 1: Foundation Refinement - Structure & Framework Alignment

## Your Mission
You are refining a presentation to fix critical structural issues and ensure proper framework adherence. This is Round 1 of a 3-round refinement process focusing on FOUNDATION FIXES.

## Target Improvement: +${config.targetImprovement} points (aim for significant structural improvements)

## Current Presentation Context
**Title:** ${presentation.title}
**Framework:** ${framework}
**Type:** ${presentation.metadata.presentation_type}
**Audience:** ${presentation.metadata.target_audience}
**Current Issues:** Critical structural and framework problems

## Original Request Context
"${originalRequest.prompt}"

## Critical Issues to Address in This Round
${criticalIssueDescriptions.map((issue, index) => `
### Priority ${index + 1}: ${issue}
Focus on resolving this structural issue while maintaining existing strong content.
`).join('')}

## Framework Adherence Requirements
${generateFrameworkGuidance(frameworkAnalysis.recommendation.primary_framework)}

## Round 1 Refinement Instructions

### PRIMARY FOCUS: Structure & Framework
1. **Framework Alignment**: Ensure content follows ${framework} structure exactly
   - Check each slide serves the correct framework function
   - Verify logical flow matches framework requirements
   - Fix any structural gaps or misalignments

2. **Content Foundation**: Strengthen core messaging
   - Clarify main message and value proposition
   - Ensure consistent narrative thread throughout
   - Fix any major content gaps or confusing sections

3. **Slide Organization**: Optimize presentation structure
   - Verify slide order supports framework logic
   - Ensure each slide has clear purpose and positioning
   - Fix any redundancy or missing critical elements

### PRESERVATION REQUIREMENTS
${generatePreservationInstructions(presentation)}

### SUCCESS CRITERIA FOR ROUND 1
- Framework structure is clearly identifiable and properly implemented
- Main message is clear and consistent throughout
- Critical content gaps are filled
- Narrative flow is logical and compelling
- No major structural issues remain

## Refinement Process
1. **Analyze Current Structure**: Review against ${framework} requirements
2. **Identify Structural Issues**: Focus on framework and content gaps
3. **Plan Improvements**: Prioritize highest-impact structural changes
4. **Implement Changes**: Make targeted improvements to structure and content
5. **Verify Framework Adherence**: Ensure ${framework} structure is clear

## Output Requirements
Provide the refined presentation that:
- Fixes all critical structural issues identified
- Properly implements ${framework} framework
- Maintains existing strong content while improving weak areas
- Shows clear improvement in structure and framework adherence
- Sets foundation for subsequent executive and polish refinements

Focus on making significant structural improvements rather than minor polish. This round is about fixing the foundation - subsequent rounds will refine and polish.`
}

/**
 * Generate executive refinement prompt (Round 2)
 */
function generateExecutiveRefinementPrompt(
  presentation: PresentationData,
  originalRequest: GenerationRequest,
  frameworkAnalysis: FrameworkAnalysisResult,
  config: RoundPromptConfig
): string {
  const executiveIssues = config.improvementInstructions.filter(instruction =>
    instruction.toLowerCase().includes('executive') ||
    instruction.toLowerCase().includes('business') ||
    instruction.toLowerCase().includes('impact')
  )

  return `# Round 2: Executive Polish - Business Impact & Audience Readiness

## Your Mission
You are refining a presentation to optimize it for executive decision-making. This is Round 2 of refinement, building on the structural foundation established in Round 1.

## Target Improvement: +${config.targetImprovement} points (focus on executive readiness and business impact)

## Round 2 Focus Areas
**Primary:** Executive Readiness (30% weight)
**Secondary:** Business Impact (20% weight)
**Maintain:** Framework structure from Round 1

## Executive Audience Requirements
**Target Audience:** ${presentation.metadata.target_audience}
**Decision Context:** ${originalRequest.prompt}

## Critical Executive Issues to Address
${executiveIssues.map((issue, index) => `
### Executive Priority ${index + 1}: ${issue}
Focus on making this executive-ready while maintaining structural integrity.
`).join('')}

## Round 2 Refinement Instructions

### PRIMARY FOCUS: Executive Readiness
1. **Strategic Language**: Elevate language to executive level
   - Use strategic terminology and business language
   - Remove unnecessary technical jargon
   - Focus on business outcomes and strategic implications
   - Ensure concise, high-impact messaging

2. **Decision Support**: Optimize for decision-making
   - Provide clear recommendations with supporting rationale
   - Include quantified benefits and ROI where possible
   - Address potential objections and risk mitigation
   - Ensure action items are specific and achievable

3. **Business Value**: Strengthen value proposition
   - Quantify benefits with specific metrics
   - Connect to business goals and strategic objectives
   - Highlight competitive advantages and market impact
   - Include financial implications and resource requirements

4. **Executive Flow**: Optimize for executive attention
   - Lead with conclusions and recommendations
   - Use executive summary approach within framework
   - Ensure key points are immediately clear
   - Minimize cognitive load with clear structure

### SECONDARY FOCUS: Business Impact Enhancement
1. **Quantified Metrics**: Add/improve business metrics
   - Include specific ROI calculations
   - Add market size and opportunity data
   - Provide implementation cost estimates
   - Show before/after comparisons

2. **Strategic Context**: Connect to broader strategy
   - Link to company strategic objectives
   - Show market positioning implications
   - Demonstrate competitive advantage
   - Address stakeholder concerns

### PRESERVATION REQUIREMENTS
- Maintain framework structure established in Round 1
- Preserve core narrative and key messages
- Keep existing quantified benefits that are working
- Maintain slide organization and flow

### SUCCESS CRITERIA FOR ROUND 2
- Language is appropriate for executive audience
- Business value is clearly quantified and compelling
- Decision-making information is readily available
- Strategic implications are well-articulated
- Content enables confident executive decisions

## Executive Checklist
□ Every slide has clear business relevance
□ Key metrics are quantified and compelling
□ Recommendations are specific and actionable
□ Risk considerations are addressed
□ Strategic fit is demonstrated
□ Decision criteria are clear
□ Implementation approach is realistic

## Output Requirements
Provide the refined presentation that:
- Elevates language and tone for executive audience
- Strengthens business case with quantified value
- Enhances decision-making support
- Maintains structural foundation from Round 1
- Shows measurable improvement in executive readiness

Focus on making the presentation compelling and actionable for executive decision-makers while preserving the structural improvements from Round 1.`
}

/**
 * Generate polish refinement prompt (Round 3)
 */
function generatePolishRefinementPrompt(
  presentation: PresentationData,
  originalRequest: GenerationRequest,
  frameworkAnalysis: FrameworkAnalysisResult,
  config: RoundPromptConfig
): string {
  return `# Round 3: Final Optimization - Clarity & Polish

## Your Mission
You are applying final polish to achieve presentation excellence. This is the final round focusing on content clarity, flow optimization, and final refinements.

## Target Improvement: +${config.targetImprovement} points (achieve 80%+ quality threshold)

## Round 3 Focus Areas
**Primary:** Content Clarity (25% weight)
**Enhancement:** Flow and language polish
**Maintain:** Structure and executive readiness from previous rounds

## Final Polish Objectives
- Achieve target quality score of 80%+
- Optimize language for maximum clarity
- Perfect presentation flow and transitions
- Ensure consistent tone and style
- Eliminate any remaining minor issues

## Round 3 Refinement Instructions

### PRIMARY FOCUS: Content Clarity
1. **Language Optimization**: Polish for maximum clarity
   - Simplify complex sentences without losing meaning
   - Ensure consistent terminology throughout
   - Optimize word choice for target audience
   - Remove any remaining jargon or unclear phrases

2. **Flow Enhancement**: Perfect presentation narrative
   - Smooth transitions between slides and sections
   - Ensure logical progression of ideas
   - Optimize section breaks and topic transitions
   - Create compelling narrative arc

3. **Consistency Polish**: Ensure presentation consistency
   - Consistent formatting and style
   - Uniform tone throughout presentation
   - Coherent voice and messaging
   - Aligned visual and textual elements

4. **Precision Tuning**: Fine-tune content precision
   - Ensure all claims are well-supported
   - Verify accuracy of all data and metrics
   - Optimize length and detail for audience
   - Balance comprehensiveness with conciseness

### SECONDARY FOCUS: Final Optimizations
1. **Audience Alignment**: Perfect audience fit
   - Ensure every element serves audience needs
   - Optimize complexity level for target audience
   - Verify assumptions align with audience knowledge
   - Ensure cultural and contextual appropriateness

2. **Impact Maximization**: Optimize for maximum impact
   - Strengthen key messages and takeaways
   - Enhance memorable elements and insights
   - Optimize call-to-action clarity and urgency
   - Ensure lasting impression and recall

### PRESERVATION REQUIREMENTS
- Maintain framework structure from Round 1
- Preserve executive readiness improvements from Round 2
- Keep all quantified benefits and business value
- Maintain strategic language and decision support

### SUCCESS CRITERIA FOR ROUND 3
- Content is crystal clear and easy to follow
- Presentation flows smoothly with natural transitions
- Language is consistent and appropriate throughout
- All minor issues and inconsistencies are resolved
- Overall quality reaches or exceeds 80% target

## Final Quality Checklist
□ Every sentence is clear and purposeful
□ Transitions between ideas are smooth
□ Terminology is consistent throughout
□ Tone and style are uniform
□ All data and claims are accurate
□ Audience needs are perfectly addressed
□ Key messages are memorable and impactful
□ Presentation achieves stated objectives

## Output Requirements
Provide the final refined presentation that:
- Achieves maximum clarity without sacrificing depth
- Flows seamlessly from start to finish
- Maintains all structural and executive improvements
- Demonstrates consistent quality throughout
- Meets or exceeds 80% quality threshold

This is the final refinement opportunity. Focus on polish, clarity, and optimization while preserving all previous improvements. The goal is presentation excellence.`
}

/**
 * Generate focused improvement prompt for specific issues
 */
export function generateFocusedImprovementPrompt(
  issues: ValidationIssue[],
  preserveContent: string[]
): string {
  const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL)
  const importantIssues = issues.filter(i => i.severity === IssueSeverity.IMPORTANT)

  return `# Focused Improvement Instructions

## Critical Issues (Must Fix)
${criticalIssues.map((issue, index) => `
### ${index + 1}. ${issue.title}
**Problem:** ${issue.description}
**Solution:** ${issue.suggestedFix}
**Confidence:** ${issue.confidence}%
**Affected Areas:** ${issue.affectedSlides.join(', ')}
`).join('')}

## Important Issues (High Priority)
${importantIssues.slice(0, 3).map((issue, index) => `
### ${index + 1}. ${issue.title}
**Problem:** ${issue.description}
**Solution:** ${issue.suggestedFix}
`).join('')}

## Content Preservation
Maintain and build upon these strong elements:
${preserveContent.map(content => `- ${content}`).join('\n')}

## Improvement Approach
1. Address critical issues first
2. Focus on highest-impact improvements
3. Maintain existing strong content
4. Ensure changes align with overall framework
5. Verify improvements don't introduce new issues`
}

/**
 * Generate general refinement prompt
 */
export function generateRefinementPrompt(
  currentScore: number,
  targetScore: number,
  focusAreas: string[]
): string {
  const improvementNeeded = targetScore - currentScore

  return `# Content Refinement Instructions

## Current Situation
**Current Quality Score:** ${currentScore}/100
**Target Score:** ${targetScore}/100
**Improvement Needed:** +${improvementNeeded} points

## Focus Areas for This Round
${focusAreas.map(area => `- ${area}`).join('\n')}

## Refinement Strategy
Based on the current score and target, focus on:

${generateRefinementStrategy(currentScore, improvementNeeded, focusAreas)}

## Success Criteria
- Achieve measurable improvement in focus areas
- Maintain quality in areas that are working well
- Move closer to target score of ${targetScore}/100
- Preserve framework structure and core messaging

Apply targeted improvements that will have the greatest impact on overall presentation quality.`
}

/**
 * Get round configuration based on round number and issues
 */
function getRoundConfiguration(
  round: number,
  issues: ValidationIssue[],
  targetImprovement: number
): RoundPromptConfig {
  const criticalIssues = issues.filter(i => i.severity === IssueSeverity.CRITICAL)
  const importantIssues = issues.filter(i => i.severity === IssueSeverity.IMPORTANT)

  switch (round) {
    case 1:
      return {
        round: 1,
        focusAreas: ['framework_adherence', 'content_structure', 'critical_gaps'],
        targetImprovement,
        preserveAreas: ['existing_metrics', 'core_messaging'],
        improvementInstructions: criticalIssues.slice(0, 3).map(issue =>
          `${issue.title}: ${issue.suggestedFix}`
        )
      }

    case 2:
      return {
        round: 2,
        focusAreas: ['executive_readiness', 'business_impact', 'audience_alignment'],
        targetImprovement,
        preserveAreas: ['framework_structure', 'core_content'],
        improvementInstructions: [
          ...criticalIssues.map(issue => `${issue.title}: ${issue.suggestedFix}`),
          ...importantIssues.slice(0, 2).map(issue => `${issue.title}: ${issue.suggestedFix}`)
        ]
      }

    case 3:
    default:
      return {
        round: 3,
        focusAreas: ['content_clarity', 'language_polish', 'flow_optimization'],
        targetImprovement,
        preserveAreas: ['framework_structure', 'executive_readiness', 'business_value'],
        improvementInstructions: importantIssues.map(issue =>
          `${issue.title}: ${issue.suggestedFix}`
        )
      }
  }
}

/**
 * Generate framework-specific guidance
 */
function generateFrameworkGuidance(framework: string): string {
  switch (framework.toLowerCase()) {
    case 'scqa':
      return `
**SCQA Framework Requirements:**
- **Situation**: Clear context and current state
- **Complication**: Well-defined problem or challenge
- **Question**: Explicit or implicit key question
- **Answer**: Comprehensive solution with evidence`

    case 'prep':
      return `
**PREP Framework Requirements:**
- **Point**: Clear main argument upfront
- **Reason**: Supporting rationale and logic
- **Example**: Concrete evidence and examples
- **Point**: Reinforced conclusion`

    case 'star':
      return `
**STAR Framework Requirements:**
- **Situation**: Context and background
- **Task**: Specific objective or challenge
- **Action**: Detailed approach and execution
- **Result**: Measurable outcomes and achievements`

    case 'pyramid':
      return `
**Pyramid Framework Requirements:**
- **Main Message**: Executive summary and key takeaway
- **Supporting Arguments**: 3-5 key supporting points
- **Evidence**: Data and proof points for each argument`

    case 'comparison':
      return `
**Comparison Framework Requirements:**
- **Options**: Clear presentation of alternatives
- **Criteria**: Evaluation framework
- **Analysis**: Systematic comparison
- **Recommendation**: Clear preference with rationale`

    default:
      return `
**Framework Structure Requirements:**
- Clear logical progression
- Consistent narrative flow
- Supporting evidence throughout
- Compelling conclusion`
  }
}

/**
 * Generate preservation instructions
 */
function generatePreservationInstructions(presentation: PresentationData): string {
  const preserveElements = []

  // Identify existing strong elements to preserve
  if (presentation.slides.some(slide => slide.content?.keyMetrics?.length)) {
    preserveElements.push('Existing quantified metrics and KPIs')
  }

  if (presentation.subtitle) {
    preserveElements.push('Core value proposition in subtitle')
  }

  preserveElements.push(
    'Strong content that already works well',
    'Existing data and evidence that supports the case',
    'Clear action items and next steps'
  )

  return preserveElements.map(element => `- ${element}`).join('\n')
}

/**
 * Generate refinement strategy based on current score
 */
function generateRefinementStrategy(
  currentScore: number,
  improvementNeeded: number,
  focusAreas: string[]
): string {
  if (currentScore < 50) {
    return `
**Major Refinement Needed (Score < 50)**
- Focus on fundamental structural issues
- Address framework adherence problems
- Fix critical content gaps
- Establish clear narrative flow`
  }

  if (currentScore < 70) {
    return `
**Significant Improvement Needed (Score 50-70)**
- Enhance business value proposition
- Improve audience alignment
- Strengthen supporting evidence
- Polish language and clarity`
  }

  return `
**Fine-tuning Needed (Score 70+)**
- Optimize for target audience
- Polish language and flow
- Enhance impact and memorability
- Address minor consistency issues`
}

/**
 * Generate issue-specific improvement instructions
 */
export function generateIssueSpecificInstructions(issues: ValidationIssue[]): string {
  const groupedIssues = issues.reduce((groups, issue) => {
    const category = issue.type
    if (!groups[category]) groups[category] = []
    groups[category].push(issue)
    return groups
  }, {} as Record<string, ValidationIssue[]>)

  return Object.entries(groupedIssues).map(([category, categoryIssues]) => `
## ${category.replace(/_/g, ' ').toUpperCase()} Issues
${categoryIssues.map(issue => `
### ${issue.title}
**Problem:** ${issue.description}
**Solution:** ${issue.suggestedFix}
**Priority:** ${issue.severity.toUpperCase()}
`).join('')}
`).join('')
}