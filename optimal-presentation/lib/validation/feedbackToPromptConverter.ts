/**
 * Feedback to Prompt Converter
 * Transforms validation feedback into actionable LLM prompts for content regeneration
 */

import { ValidationIssue, IssueSeverity, ValidationDimensions, ContentAnalysisResult } from './contentAnalysis'
import { Framework } from './supportedFrameworks'
import { PresentationData, SlideData } from '@/lib/types'

/**
 * Refinement prompt structure
 */
export interface RefinementPrompt {
  systemContext: string
  criticalFixes: CriticalFix[]
  targetedImprovements: TargetedImprovement[]
  preservationInstructions: PreservationInstruction[]
  roundSpecificFocus: RoundFocus
  frameworkCompliance: FrameworkCompliance
  outputRequirements: string[]
}

export interface CriticalFix {
  slideId: string
  issueType: string
  description: string
  suggestedAction: string
  priority: number
}

export interface TargetedImprovement {
  dimension: keyof ValidationDimensions
  currentScore: number
  targetScore: number
  actionItems: string[]
  focusAreas: string[]
}

export interface PreservationInstruction {
  slideId: string
  reason: string
  elementsToKeep: string[]
}

export interface RoundFocus {
  round: number
  primaryObjective: string
  secondaryObjectives: string[]
  acceptanceCriteria: string[]
}

export interface FrameworkCompliance {
  framework: Framework
  currentAlignment: number
  requiredElements: string[]
  missingElements: string[]
}

/**
 * Refinement history entry for context continuity
 */
export interface RefinementHistoryContext {
  round: number
  previousScore: number
  currentScore: number
  improvementMade: number
  issuesFixed: string[]
  changesAttempted: string[]
  lessonsLearned: string[]
  whatWorked: string[]
  whatDidntWork: string[]
}

/**
 * Validation feedback structure
 */
export interface ValidationFeedback {
  issues: ValidationIssue[]
  dimensionScores: ValidationDimensions
  overallScore: number
  targetScore: number
  currentPresentation: PresentationData
  framework: Framework
  preserveSlides: string[]
  round: number
  refinementHistory: RefinementHistoryContext[]
}

/**
 * Main converter class
 */
export class FeedbackToPromptConverter {
  private readonly severityWeights = {
    [IssueSeverity.CRITICAL]: 10,
    [IssueSeverity.IMPORTANT]: 5,
    [IssueSeverity.MINOR]: 2,
    [IssueSeverity.SUGGESTION]: 1
  }

  /**
   * Convert validation feedback to refinement prompt
   */
  convertToPrompt(feedback: ValidationFeedback): RefinementPrompt {
    const criticalFixes = this.extractCriticalFixes(feedback.issues)
    const targetedImprovements = this.mapDimensionImprovements(
      feedback.dimensionScores,
      feedback.targetScore
    )
    const preservationInstructions = this.identifyPreservationAreas(
      feedback.currentPresentation,
      feedback.preserveSlides,
      feedback.dimensionScores
    )
    const roundSpecificFocus = this.determineRoundFocus(
      feedback.round,
      feedback.overallScore,
      feedback.targetScore,
      feedback.issues
    )
    const frameworkCompliance = this.assessFrameworkCompliance(
      feedback.currentPresentation,
      feedback.framework,
      feedback.issues
    )

    return {
      systemContext: this.buildSystemContext(feedback),
      criticalFixes,
      targetedImprovements,
      preservationInstructions,
      roundSpecificFocus,
      frameworkCompliance,
      outputRequirements: this.getOutputRequirements()
    }
  }

  /**
   * Extract critical fixes from issues
   */
  private extractCriticalFixes(issues: ValidationIssue[]): CriticalFix[] {
    return issues
      .filter(issue =>
        issue.severity === IssueSeverity.CRITICAL ||
        issue.severity === IssueSeverity.IMPORTANT
      )
      .sort((a, b) => this.severityWeights[b.severity] - this.severityWeights[a.severity])
      .slice(0, 10) // Focus on top 10 issues per round
      .map((issue, index) => ({
        slideId: issue.slideId || 'general',
        issueType: issue.type,
        description: issue.description,
        suggestedAction: this.generateActionFromIssue(issue),
        priority: index + 1
      }))
  }

  /**
   * Generate specific action from issue
   */
  private generateActionFromIssue(issue: ValidationIssue): string {
    const actionMap: Record<string, (issue: ValidationIssue) => string> = {
      'missing_executive_summary': () =>
        'Add a clear executive summary slide with key takeaways and recommendations',
      'weak_business_case': () =>
        'Strengthen business justification with ROI metrics, cost-benefit analysis, and strategic alignment',
      'unclear_recommendations': () =>
        'Clarify recommendations with specific, actionable next steps and ownership',
      'missing_data_support': () =>
        'Add supporting data, metrics, or evidence to validate key claims',
      'poor_flow': () =>
        'Reorganize content to follow a logical progression with clear transitions',
      'framework_mismatch': () =>
        'Restructure content to align with the selected framework structure',
      'audience_misalignment': () =>
        'Adjust language, detail level, and focus to match target audience needs',
      'missing_context': () =>
        'Provide necessary background information and situational context',
      'weak_conclusion': () =>
        'Strengthen conclusion with clear takeaways, next steps, and call to action',
      'inconsistent_messaging': () =>
        'Ensure consistent messaging and terminology throughout the presentation'
    }

    const actionGenerator = actionMap[issue.type]
    if (actionGenerator) {
      return actionGenerator(issue)
    }

    // Fallback to suggested fix or generic action
    return issue.suggestedFix || `Address ${issue.type}: ${issue.description}`
  }

  /**
   * Map dimension scores to targeted improvements
   */
  private mapDimensionImprovements(
    scores: ValidationDimensions,
    targetScore: number
  ): TargetedImprovement[] {
    const improvements: TargetedImprovement[] = []

    Object.entries(scores).forEach(([dimension, score]) => {
      if (score < targetScore) {
        improvements.push({
          dimension: dimension as keyof ValidationDimensions,
          currentScore: score,
          targetScore,
          actionItems: this.getDimensionActions(dimension as keyof ValidationDimensions, score),
          focusAreas: this.getDimensionFocusAreas(dimension as keyof ValidationDimensions)
        })
      }
    })

    // Sort by improvement needed (largest gap first)
    return improvements.sort((a, b) =>
      (b.targetScore - b.currentScore) - (a.targetScore - a.currentScore)
    )
  }

  /**
   * Get specific actions for dimension improvement
   */
  private getDimensionActions(dimension: keyof ValidationDimensions, currentScore: number): string[] {
    const actionMap: Record<keyof ValidationDimensions, string[]> = {
      contentQuality: [
        'Enhance clarity and specificity of key messages',
        'Add concrete examples and case studies',
        'Ensure all claims are supported with evidence',
        'Remove jargon and simplify complex concepts'
      ],
      structureFlow: [
        'Improve logical flow between slides',
        'Add clear transitions and connectors',
        'Ensure each slide builds on previous content',
        'Create a compelling narrative arc'
      ],
      audienceAlignment: [
        'Adjust technical depth to match audience expertise',
        'Focus on audience-specific benefits and concerns',
        'Use appropriate terminology and examples',
        'Address likely questions and objections'
      ],
      visualAppeal: [
        'Simplify dense text into visual elements',
        'Add relevant charts, diagrams, or infographics',
        'Ensure consistent formatting and styling',
        'Balance text and visual elements'
      ],
      actionability: [
        'Add specific, measurable next steps',
        'Include clear ownership and timelines',
        'Provide implementation roadmap',
        'Define success metrics and KPIs'
      ],
      persuasiveness: [
        'Strengthen value proposition',
        'Add compelling evidence and social proof',
        'Address counterarguments proactively',
        'Create urgency for action'
      ],
      dataSupport: [
        'Add quantitative metrics and benchmarks',
        'Include relevant industry data',
        'Provide source citations for credibility',
        'Use data visualization for complex metrics'
      ],
      executiveReadiness: [
        'Add executive summary with key decisions needed',
        'Focus on strategic impact and ROI',
        'Simplify technical details to essential points',
        'Include risk assessment and mitigation'
      ]
    }

    const actions = actionMap[dimension] || []
    // Return actions based on how much improvement is needed
    const actionsNeeded = currentScore < 50 ? 4 : currentScore < 70 ? 3 : 2
    return actions.slice(0, actionsNeeded)
  }

  /**
   * Get dimension focus areas
   */
  private getDimensionFocusAreas(dimension: keyof ValidationDimensions): string[] {
    const focusMap: Record<keyof ValidationDimensions, string[]> = {
      contentQuality: ['clarity', 'depth', 'accuracy', 'relevance'],
      structureFlow: ['logical_progression', 'transitions', 'narrative_coherence'],
      audienceAlignment: ['expertise_level', 'interests', 'pain_points', 'language'],
      visualAppeal: ['layout', 'graphics', 'consistency', 'readability'],
      actionability: ['next_steps', 'ownership', 'timelines', 'success_metrics'],
      persuasiveness: ['value_proposition', 'evidence', 'emotional_appeal', 'urgency'],
      dataSupport: ['metrics', 'benchmarks', 'sources', 'visualization'],
      executiveReadiness: ['strategic_focus', 'decision_support', 'risk_assessment', 'ROI']
    }

    return focusMap[dimension] || []
  }

  /**
   * Identify areas to preserve
   */
  private identifyPreservationAreas(
    presentation: PresentationData,
    preserveSlideIds: string[],
    dimensionScores: ValidationDimensions
  ): PreservationInstruction[] {
    const instructions: PreservationInstruction[] = []

    // Preserve explicitly marked slides
    preserveSlideIds.forEach(slideId => {
      const slide = presentation.slides.find(s => s.id === slideId)
      if (slide) {
        instructions.push({
          slideId,
          reason: 'High-quality content identified by validation',
          elementsToKeep: this.identifySlideStrengths(slide)
        })
      }
    })

    // Preserve high-scoring dimensions
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      if (score >= 85) {
        instructions.push({
          slideId: 'general',
          reason: `Excellent ${dimension} (${score}/100)`,
          elementsToKeep: [`Current ${dimension} approach and style`]
        })
      }
    })

    return instructions
  }

  /**
   * Identify slide strengths to preserve
   */
  private identifySlideStrengths(slide: SlideData): string[] {
    const strengths: string[] = []

    // Check for strong content elements
    if (slide.content?.keyMetrics && slide.content.keyMetrics.length > 0) {
      strengths.push('Data-driven metrics and KPIs')
    }
    if (slide.content?.sections && slide.content.sections.length > 0) {
      strengths.push('Well-structured sections and organization')
    }
    if (slide.metadata?.speaker_notes) {
      strengths.push('Comprehensive speaker notes')
    }
    if (slide.content?.callout) {
      strengths.push('Clear callout or key message')
    }

    return strengths.length > 0 ? strengths : ['Core content and messaging']
  }

  /**
   * Determine round-specific focus
   */
  private determineRoundFocus(
    round: number,
    currentScore: number,
    targetScore: number,
    issues: ValidationIssue[]
  ): RoundFocus {
    const gap = targetScore - currentScore
    const criticalCount = issues.filter(i => i.severity === IssueSeverity.CRITICAL).length
    const importantCount = issues.filter(i => i.severity === IssueSeverity.IMPORTANT).length

    switch (round) {
      case 1:
        return {
          round: 1,
          primaryObjective: 'Fix critical structural and content issues',
          secondaryObjectives: [
            'Establish framework compliance',
            'Ensure content completeness',
            'Fix major logical flow problems'
          ],
          acceptanceCriteria: [
            'All critical issues resolved',
            'Framework structure properly implemented',
            'Score improvement of at least 10-15 points'
          ]
        }

      case 2:
        return {
          round: 2,
          primaryObjective: 'Enhance business impact and audience alignment',
          secondaryObjectives: [
            'Strengthen value proposition',
            'Improve data support and evidence',
            'Enhance executive readiness'
          ],
          acceptanceCriteria: [
            'Important issues addressed',
            'Business case clearly articulated',
            'Score improvement of at least 5-10 points'
          ]
        }

      case 3:
      default:
        return {
          round: round,
          primaryObjective: 'Polish and optimize for maximum effectiveness',
          secondaryObjectives: [
            'Refine language and clarity',
            'Optimize visual appeal',
            'Ensure complete actionability'
          ],
          acceptanceCriteria: [
            `Achieve target score of ${targetScore}`,
            'All dimensions above 70%',
            'Presentation is executive-ready'
          ]
        }
    }
  }

  /**
   * Assess framework compliance
   */
  private assessFrameworkCompliance(
    presentation: PresentationData,
    framework: Framework,
    issues: ValidationIssue[]
  ): FrameworkCompliance {
    const frameworkIssues = issues.filter(i =>
      i.type.includes('framework') || i.category === 'structure'
    )

    const missingElements = this.identifyMissingFrameworkElements(
      presentation,
      framework
    )

    const alignment = frameworkIssues.length === 0 && missingElements.length === 0
      ? 100
      : Math.max(0, 100 - (frameworkIssues.length * 10) - (missingElements.length * 15))

    return {
      framework,
      currentAlignment: alignment,
      requiredElements: framework.structure.map(s => `${s.step}: ${s.description}`),
      missingElements
    }
  }

  /**
   * Identify missing framework elements
   */
  private identifyMissingFrameworkElements(
    presentation: PresentationData,
    framework: Framework
  ): string[] {
    const missing: string[] = []
    const slideTypes = presentation.slides.map(s => s.type)

    // Check for framework-specific required elements
    framework.structure.forEach(step => {
      const expectedType = this.mapFrameworkStepToSlideType(step.step, framework.id)
      if (expectedType && !slideTypes.includes(expectedType)) {
        missing.push(`${step.step} (${expectedType} slide)`)
      }
    })

    return missing
  }

  /**
   * Map framework steps to expected slide types
   */
  private mapFrameworkStepToSlideType(step: string, frameworkId: string): string | null {
    const mappings: Record<string, Record<string, string>> = {
      scqa: {
        'Situation': 'problem',
        'Complication': 'problem',
        'Question': 'problem',
        'Answer': 'solution'
      },
      prep: {
        'Point': 'conclusion',
        'Reason': 'framework',
        'Example': 'benefits',
        'Point (Reiterate)': 'conclusion'
      },
      star: {
        'Situation': 'problem',
        'Task': 'framework',
        'Action': 'solution',
        'Result': 'benefits'
      },
      pyramid: {
        'Conclusion': 'conclusion',
        'Key Arguments': 'framework',
        'Supporting Evidence': 'benefits',
        'Data & Examples': 'chart'
      },
      comparison: {
        'Criteria Definition': 'framework',
        'Option Presentation': 'table',
        'Comparative Analysis': 'chart',
        'Recommendation': 'conclusion'
      }
    }

    return mappings[frameworkId]?.[step] || null
  }

  /**
   * Build system context for LLM
   */
  private buildSystemContext(feedback: ValidationFeedback): string {
    return `You are refining a ${feedback.framework.name} framework presentation.
Current Quality Score: ${feedback.overallScore}/100
Target Score: ${feedback.targetScore}/100
Refinement Round: ${feedback.round}
Gap to Close: ${feedback.targetScore - feedback.overallScore} points

Your task is to improve the presentation while preserving its strengths.`
  }

  /**
   * Get output requirements
   */
  private getOutputRequirements(): string[] {
    return [
      'Maintain exact JSON structure of the original presentation',
      'Preserve all high-quality content identified',
      'Fix all critical and important issues',
      'Ensure framework compliance throughout',
      'Keep slide count consistent',
      'Improve low-scoring dimensions',
      'Maintain professional tone and style',
      'Ensure all content is factual and supported',
      'Return ONLY valid JSON, no additional text'
    ]
  }

  /**
   * Generate complete refinement prompt string
   */
  generatePromptString(refinementPrompt: RefinementPrompt, refinementHistory?: RefinementHistoryContext[]): string {
    const historySection = refinementHistory && refinementHistory.length > 0
      ? `\nREFINEMENT HISTORY (Learning Context):
${refinementHistory.map(entry =>
  `Round ${entry.round}: Score ${entry.previousScore}→${entry.currentScore} (+${entry.improvementMade})
   Fixed: ${entry.issuesFixed.join('; ')}
   Attempted: ${entry.changesAttempted.join('; ')}
   What Worked: ${entry.whatWorked.join('; ')}
   What Didn't Work: ${entry.whatDidntWork.join('; ')}
   Lessons: ${entry.lessonsLearned.join('; ')}`
).join('\n')}\n`
      : '';

    return `${refinementPrompt.systemContext}${historySection}

CRITICAL FIXES REQUIRED (Priority Order):
${refinementPrompt.criticalFixes.map(fix =>
  `${fix.priority}. [${fix.slideId}] ${fix.issueType}
   Issue: ${fix.description}
   Action: ${fix.suggestedAction}`
).join('\n')}

DIMENSION IMPROVEMENTS NEEDED:
${refinementPrompt.targetedImprovements.map(imp =>
  `- ${imp.dimension}: ${imp.currentScore}→${imp.targetScore}
   Actions: ${imp.actionItems.join('; ')}
   Focus: ${imp.focusAreas.join(', ')}`
).join('\n')}

PRESERVE THESE STRONG ELEMENTS:
${refinementPrompt.preservationInstructions.map(inst =>
  `- ${inst.slideId}: ${inst.reason}
   Keep: ${inst.elementsToKeep.join(', ')}`
).join('\n')}

ROUND ${refinementPrompt.roundSpecificFocus.round} FOCUS:
Primary: ${refinementPrompt.roundSpecificFocus.primaryObjective}
Secondary: ${refinementPrompt.roundSpecificFocus.secondaryObjectives.join('; ')}
Success Criteria: ${refinementPrompt.roundSpecificFocus.acceptanceCriteria.join('; ')}

FRAMEWORK COMPLIANCE (${refinementPrompt.frameworkCompliance.framework.name}):
Current Alignment: ${refinementPrompt.frameworkCompliance.currentAlignment}%
Required Elements: ${refinementPrompt.frameworkCompliance.requiredElements.join('; ')}
${refinementPrompt.frameworkCompliance.missingElements.length > 0
  ? `Missing: ${refinementPrompt.frameworkCompliance.missingElements.join(', ')}`
  : 'All elements present'}

OUTPUT REQUIREMENTS:
${refinementPrompt.outputRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}

INSTRUCTIONS: Generate the improved presentation JSON that addresses all current issues while learning from refinement history. Focus on sequential improvement building on previous rounds.`
  }
}

/**
 * Create feedback converter instance
 */
export function createFeedbackConverter(): FeedbackToPromptConverter {
  return new FeedbackToPromptConverter()
}