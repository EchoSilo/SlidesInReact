/**
 * Supported presentation frameworks with their definitions, characteristics, and use cases
 */

export interface Framework {
  id: string
  name: string
  description: string
  structure: FrameworkStep[]
  bestFor: string[]
  characteristics: string[]
  audience: string[]
  examples: string[]
  slideMappings: SlideMappingGuide
}

export interface FrameworkStep {
  step: string
  description: string
  purpose: string
  indicators: string[]
}

export interface SlideMappingGuide {
  typical_slide_count: number
  slide_sequence: string[]
  content_focus: Record<string, string>
}

export interface FrameworkRecommendation {
  framework: Framework
  confidence: number
  rationale: string
  alternative?: Framework
}

/**
 * SCQA Framework - Problem-solving and strategic presentations
 */
const SCQA_FRAMEWORK: Framework = {
  id: 'scqa',
  name: 'SCQA',
  description: 'Situation-Complication-Question-Answer framework for problem-solving presentations',
  structure: [
    {
      step: 'Situation',
      description: 'Establish the current context and environment',
      purpose: 'Set the stage and provide background understanding',
      indicators: ['current state', 'context', 'background', 'environment', 'status quo']
    },
    {
      step: 'Complication',
      description: 'Identify the core problem or challenge',
      purpose: 'Create urgency and highlight what needs to be addressed',
      indicators: ['problem', 'challenge', 'issue', 'pain point', 'difficulty', 'obstacle']
    },
    {
      step: 'Question',
      description: 'Frame the critical question that needs answering',
      purpose: 'Focus the audience on the key decision or solution needed',
      indicators: ['how do we', 'what should we', 'key question', 'decision point']
    },
    {
      step: 'Answer',
      description: 'Provide the solution or recommendation',
      purpose: 'Present the proposed solution with implementation details',
      indicators: ['solution', 'recommendation', 'approach', 'strategy', 'proposal']
    }
  ],
  bestFor: [
    'Problem-solving presentations',
    'Strategic initiative proposals',
    'Change management presentations',
    'Consulting recommendations',
    'Business case development'
  ],
  characteristics: [
    'Logical problem-to-solution flow',
    'Creates urgency and need',
    'Executive decision-making focus',
    'Evidence-based recommendations'
  ],
  audience: ['executives', 'decision-makers', 'stakeholders', 'board members'],
  examples: [
    'Implementing new technology to solve operational inefficiencies',
    'Proposing organizational restructuring',
    'Addressing market challenges with new strategy'
  ],
  slideMappings: {
    typical_slide_count: 5,
    slide_sequence: ['title', 'situation', 'complication', 'question/solution', 'implementation'],
    content_focus: {
      'title': 'Value proposition and key message',
      'situation': 'Current state analysis and context',
      'complication': 'Problem definition with business impact',
      'question/solution': 'Proposed solution and benefits',
      'implementation': 'Action plan and next steps'
    }
  }
}

/**
 * PREP Framework - Clear argumentation and persuasive content
 */
const PREP_FRAMEWORK: Framework = {
  id: 'prep',
  name: 'PREP',
  description: 'Point-Reason-Example-Point framework for clear argumentation',
  structure: [
    {
      step: 'Point',
      description: 'State the main message or position clearly',
      purpose: 'Lead with the key message upfront',
      indicators: ['main point', 'key message', 'position', 'thesis', 'recommendation']
    },
    {
      step: 'Reason',
      description: 'Provide logical rationale and supporting arguments',
      purpose: 'Build credibility through reasoning',
      indicators: ['because', 'rationale', 'reasoning', 'justification', 'logic']
    },
    {
      step: 'Example',
      description: 'Illustrate with concrete examples, data, or evidence',
      purpose: 'Make the argument tangible and believable',
      indicators: ['for example', 'data shows', 'evidence', 'case study', 'proof']
    },
    {
      step: 'Point',
      description: 'Reinforce the main message',
      purpose: 'Ensure the key message is remembered',
      indicators: ['therefore', 'in conclusion', 'this means', 'key takeaway']
    }
  ],
  bestFor: [
    'Persuasive presentations',
    'Recommendation presentations',
    'Sales pitches',
    'Policy proposals',
    'Argument-based content'
  ],
  characteristics: [
    'Direct and clear messaging',
    'Strong logical flow',
    'Evidence-based arguments',
    'Memorable structure'
  ],
  audience: ['decision-makers', 'stakeholders', 'clients', 'team members'],
  examples: [
    'Recommending a specific vendor selection',
    'Proposing budget allocation',
    'Arguing for process changes'
  ],
  slideMappings: {
    typical_slide_count: 4,
    slide_sequence: ['title/point', 'reasoning', 'evidence/examples', 'conclusion/point'],
    content_focus: {
      'title/point': 'Clear value proposition and main argument',
      'reasoning': 'Logical rationale and supporting arguments',
      'evidence/examples': 'Data, case studies, and proof points',
      'conclusion/point': 'Reinforced message and call to action'
    }
  }
}

/**
 * STAR Framework - Case studies and project results
 */
const STAR_FRAMEWORK: Framework = {
  id: 'star',
  name: 'STAR',
  description: 'Situation-Task-Action-Result framework for showcasing achievements',
  structure: [
    {
      step: 'Situation',
      description: 'Describe the context and background',
      purpose: 'Set the scene for the achievement story',
      indicators: ['context', 'background', 'scenario', 'setting', 'initial state']
    },
    {
      step: 'Task',
      description: 'Define the specific objective or challenge',
      purpose: 'Clarify what needed to be accomplished',
      indicators: ['objective', 'goal', 'challenge', 'mission', 'target', 'assignment']
    },
    {
      step: 'Action',
      description: 'Explain the specific actions taken',
      purpose: 'Detail the methodology and approach used',
      indicators: ['approach', 'method', 'steps taken', 'implementation', 'execution']
    },
    {
      step: 'Result',
      description: 'Present the outcomes and impact achieved',
      purpose: 'Demonstrate success and value delivered',
      indicators: ['outcome', 'result', 'impact', 'achievement', 'success', 'metrics']
    }
  ],
  bestFor: [
    'Case study presentations',
    'Project success stories',
    'Achievement showcases',
    'Lessons learned sessions',
    'Capability demonstrations'
  ],
  characteristics: [
    'Narrative structure',
    'Results-focused',
    'Concrete achievements',
    'Measurable outcomes'
  ],
  audience: ['clients', 'team members', 'management', 'stakeholders'],
  examples: [
    'Presenting a successful digital transformation project',
    'Showcasing cost reduction achievements',
    'Demonstrating process improvement results'
  ],
  slideMappings: {
    typical_slide_count: 5,
    slide_sequence: ['title', 'situation/context', 'task/challenge', 'action/approach', 'results/impact'],
    content_focus: {
      'title': 'Achievement summary and value',
      'situation/context': 'Background and starting point',
      'task/challenge': 'Specific objectives and challenges',
      'action/approach': 'Methodology and implementation details',
      'results/impact': 'Quantified outcomes and business value'
    }
  }
}

/**
 * Pyramid Framework - Executive summaries and recommendations
 */
const PYRAMID_FRAMEWORK: Framework = {
  id: 'pyramid',
  name: 'Pyramid',
  description: 'Main Message-Supporting Arguments-Evidence framework for executive communication',
  structure: [
    {
      step: 'Main Message',
      description: 'Lead with the key conclusion or recommendation',
      purpose: 'Provide the bottom line upfront for executives',
      indicators: ['recommendation', 'conclusion', 'key message', 'bottom line', 'main point']
    },
    {
      step: 'Supporting Arguments',
      description: 'Present 2-3 key arguments that support the main message',
      purpose: 'Provide logical pillars for the recommendation',
      indicators: ['key reasons', 'main arguments', 'supporting points', 'pillars']
    },
    {
      step: 'Evidence',
      description: 'Back each argument with specific data and examples',
      purpose: 'Provide credible proof for each supporting argument',
      indicators: ['data', 'evidence', 'proof', 'examples', 'analysis', 'facts']
    }
  ],
  bestFor: [
    'Executive summaries',
    'Board presentations',
    'Strategic recommendations',
    'High-level briefings',
    'Decision support documents'
  ],
  characteristics: [
    'Top-down communication',
    'Executive-friendly structure',
    'Conclusion-first approach',
    'Hierarchical logic'
  ],
  audience: ['C-suite executives', 'board members', 'senior leadership'],
  examples: [
    'Board-level strategy recommendations',
    'Executive briefings on market analysis',
    'High-level investment proposals'
  ],
  slideMappings: {
    typical_slide_count: 4,
    slide_sequence: ['title/main message', 'key arguments', 'supporting evidence', 'next steps'],
    content_focus: {
      'title/main message': 'Clear recommendation and value proposition',
      'key arguments': '2-3 main supporting pillars',
      'supporting evidence': 'Data and proof points for each argument',
      'next steps': 'Implementation roadmap and decisions needed'
    }
  }
}

/**
 * Comparison Framework - Decision-making and vendor selection
 */
const COMPARISON_FRAMEWORK: Framework = {
  id: 'comparison',
  name: 'Comparison',
  description: 'Options-Criteria-Analysis-Recommendation framework for decision support',
  structure: [
    {
      step: 'Options',
      description: 'Present the available alternatives or choices',
      purpose: 'Establish the decision space and alternatives',
      indicators: ['options', 'alternatives', 'choices', 'approaches', 'solutions']
    },
    {
      step: 'Criteria',
      description: 'Define the evaluation criteria and weighting',
      purpose: 'Establish objective basis for comparison',
      indicators: ['criteria', 'evaluation factors', 'requirements', 'priorities', 'weights']
    },
    {
      step: 'Analysis',
      description: 'Systematically evaluate options against criteria',
      purpose: 'Provide objective comparison and scoring',
      indicators: ['analysis', 'evaluation', 'comparison', 'scoring', 'assessment']
    },
    {
      step: 'Recommendation',
      description: 'Present the recommended choice with rationale',
      purpose: 'Guide decision-making with clear recommendation',
      indicators: ['recommendation', 'preferred option', 'best choice', 'selection']
    }
  ],
  bestFor: [
    'Vendor selection presentations',
    'Technology choice decisions',
    'Strategic option evaluation',
    'Investment alternatives',
    'Process selection decisions'
  ],
  characteristics: [
    'Systematic evaluation',
    'Objective comparison',
    'Decision-focused',
    'Criteria-based analysis'
  ],
  audience: ['decision-makers', 'procurement teams', 'selection committees'],
  examples: [
    'ERP system vendor selection',
    'Strategic initiative prioritization',
    'Investment option analysis'
  ],
  slideMappings: {
    typical_slide_count: 5,
    slide_sequence: ['title', 'options overview', 'evaluation criteria', 'comparative analysis', 'recommendation'],
    content_focus: {
      'title': 'Decision context and objective',
      'options overview': 'Available alternatives and key characteristics',
      'evaluation criteria': 'Assessment factors and relative importance',
      'comparative analysis': 'Side-by-side evaluation and scoring',
      'recommendation': 'Preferred choice with supporting rationale'
    }
  }
}

/**
 * All supported frameworks registry
 */
export const SUPPORTED_FRAMEWORKS: Record<string, Framework> = {
  scqa: SCQA_FRAMEWORK,
  prep: PREP_FRAMEWORK,
  star: STAR_FRAMEWORK,
  pyramid: PYRAMID_FRAMEWORK,
  comparison: COMPARISON_FRAMEWORK
}

/**
 * Get framework by ID
 */
export function getFramework(id: string): Framework | null {
  return SUPPORTED_FRAMEWORKS[id] || null
}

/**
 * Get all available frameworks
 */
export function getAllFrameworks(): Framework[] {
  return Object.values(SUPPORTED_FRAMEWORKS)
}

/**
 * Get frameworks suitable for specific content types
 */
export function getFrameworksByType(contentType: string): Framework[] {
  return getAllFrameworks().filter(framework =>
    framework.bestFor.some(use =>
      use.toLowerCase().includes(contentType.toLowerCase())
    )
  )
}

/**
 * Get frameworks suitable for specific audience
 */
export function getFrameworksByAudience(audience: string): Framework[] {
  return getAllFrameworks().filter(framework =>
    framework.audience.some(aud =>
      aud.toLowerCase().includes(audience.toLowerCase())
    )
  )
}