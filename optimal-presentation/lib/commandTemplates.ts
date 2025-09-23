import { SlideData } from './types'

export interface CommandTemplate {
  id: string
  category: 'content' | 'layout' | 'structure' | 'visualization'
  pattern: string
  description: string
  example: string
  contextTypes?: string[] // slide layouts where this is most relevant
  keywords: string[]
}

export const COMMAND_TEMPLATES: CommandTemplate[] = [
  // Content Commands
  {
    id: 'edit-title',
    category: 'content',
    pattern: 'Make the title [more concise|shorter|more impactful]',
    description: 'Modify the slide title',
    example: 'Make the title shorter and more impactful',
    keywords: ['title', 'heading', 'make', 'change', 'update', 'shorter', 'concise', 'impactful']
  },
  {
    id: 'add-content',
    category: 'content',
    pattern: 'Add [bullets|content|text] about [topic]',
    description: 'Add new content to the slide',
    example: 'Add bullets about ROI and cost savings',
    keywords: ['add', 'include', 'content', 'bullet', 'text', 'about']
  },
  {
    id: 'improve-copy',
    category: 'content',
    pattern: 'Make this slide more [engaging|professional|compelling]',
    description: 'Enhance the overall content quality',
    example: 'Make this slide more engaging with better copy',
    keywords: ['make', 'improve', 'better', 'engaging', 'professional', 'compelling', 'copy']
  },

  // Layout Commands
  {
    id: 'change-layout-two-column',
    category: 'layout',
    pattern: 'Change to two-column layout',
    description: 'Convert slide to two-column format',
    example: 'Change this slide layout to two-column format',
    keywords: ['change', 'convert', 'layout', 'two-column', 'two', 'column']
  },
  {
    id: 'change-layout-bullet',
    category: 'layout',
    pattern: 'Convert to bullet list format',
    description: 'Change slide to bullet list layout',
    example: 'Convert this to a bullet list format',
    contextTypes: ['title-content', 'two-column'],
    keywords: ['convert', 'change', 'bullet', 'list', 'format']
  },
  {
    id: 'change-layout-metrics',
    category: 'layout',
    pattern: 'Change to metrics layout',
    description: 'Convert slide to show key metrics',
    example: 'Change this slide to metrics layout',
    keywords: ['change', 'convert', 'metrics', 'layout', 'kpi', 'numbers']
  },

  // Structure Commands (Slide Creation)
  {
    id: 'create-problem-slide',
    category: 'structure',
    pattern: 'Create a problem slide [before|after] this one',
    description: 'Add a new problem slide',
    example: 'Create a problem slide after this one about resource allocation',
    keywords: ['create', 'add', 'new', 'problem', 'slide', 'before', 'after']
  },
  {
    id: 'create-solution-slide',
    category: 'structure',
    pattern: 'Create a solution slide [before|after] this one',
    description: 'Add a new solution slide',
    example: 'Create a solution slide after this one',
    keywords: ['create', 'add', 'new', 'solution', 'slide', 'before', 'after']
  },
  {
    id: 'create-benefits-slide',
    category: 'structure',
    pattern: 'Create a benefits slide [before|after] this one',
    description: 'Add a new benefits slide',
    example: 'Create a benefits slide after this one',
    keywords: ['create', 'add', 'new', 'benefits', 'slide', 'before', 'after']
  },
  {
    id: 'create-implementation-slide',
    category: 'structure',
    pattern: 'Create an implementation slide [before|after] this one',
    description: 'Add a new implementation slide',
    example: 'Create an implementation slide after this one',
    keywords: ['create', 'add', 'new', 'implementation', 'slide', 'before', 'after']
  },

  // Visualization Commands
  {
    id: 'add-chart',
    category: 'visualization',
    pattern: 'Add a chart to visualize [data|metrics|results]',
    description: 'Add data visualization to the slide',
    example: 'Add a chart to visualize the key metrics',
    keywords: ['add', 'chart', 'graph', 'visualize', 'metrics', 'data', 'results']
  },
  {
    id: 'add-diagram',
    category: 'visualization',
    pattern: 'Add a diagram to show [process|workflow|framework]',
    description: 'Add a process diagram to the slide',
    example: 'Add a diagram to show the implementation process',
    keywords: ['add', 'diagram', 'process', 'workflow', 'framework', 'show']
  },
  {
    id: 'add-metrics',
    category: 'visualization',
    pattern: 'Add metrics for [performance|roi|efficiency]',
    description: 'Add key performance indicators',
    example: 'Add metrics for performance improvement',
    keywords: ['add', 'metrics', 'kpi', 'performance', 'roi', 'efficiency', 'numbers']
  }
]

export interface CommandSuggestion {
  template: CommandTemplate
  relevanceScore: number
  matchedKeywords: string[]
}

export function getCommandSuggestions(
  input: string,
  currentSlide?: SlideData,
  maxSuggestions: number = 5
): CommandSuggestion[] {
  const inputLower = input.toLowerCase().trim()

  if (inputLower.length < 2) {
    return []
  }

  const suggestions: CommandSuggestion[] = []

  for (const template of COMMAND_TEMPLATES) {
    let relevanceScore = 0
    const matchedKeywords: string[] = []

    // Check keyword matches
    for (const keyword of template.keywords) {
      if (inputLower.includes(keyword)) {
        relevanceScore += keyword.length * 2 // Longer keywords score higher
        matchedKeywords.push(keyword)
      }
    }

    // Boost score for context relevance
    if (currentSlide && template.contextTypes?.includes(currentSlide.layout)) {
      relevanceScore += 10
    }

    // Boost score for exact pattern matches
    const patternWords = template.pattern.toLowerCase().split(/[\s\[\]|]+/).filter(w => w.length > 2)
    for (const word of patternWords) {
      if (inputLower.includes(word)) {
        relevanceScore += 5
      }
    }

    // Only include suggestions with some relevance
    if (relevanceScore > 0) {
      suggestions.push({
        template,
        relevanceScore,
        matchedKeywords
      })
    }
  }

  // Sort by relevance score and return top suggestions
  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxSuggestions)
}

export function getCategoryIcon(category: CommandTemplate['category']): string {
  switch (category) {
    case 'content':
      return '✏️'
    case 'layout':
      return '🔀'
    case 'structure':
      return '📋'
    case 'visualization':
      return '📊'
    default:
      return '💡'
  }
}

export function getContextualSuggestions(currentSlide?: SlideData): CommandTemplate[] {
  if (!currentSlide) {
    return COMMAND_TEMPLATES.slice(0, 3)
  }

  const contextual: CommandTemplate[] = []

  // Add layout-specific suggestions
  const relevantTemplates = COMMAND_TEMPLATES.filter(t =>
    !t.contextTypes || t.contextTypes.includes(currentSlide.layout)
  )

  // Prioritize based on current slide layout
  switch (currentSlide.layout) {
    case 'title-only':
      contextual.push(
        ...relevantTemplates.filter(t =>
          t.keywords.includes('content') || t.keywords.includes('layout')
        )
      )
      break
    case 'bullet-list':
      contextual.push(
        ...relevantTemplates.filter(t =>
          t.keywords.includes('bullet') || t.keywords.includes('metrics')
        )
      )
      break
    case 'metrics':
      contextual.push(
        ...relevantTemplates.filter(t =>
          t.keywords.includes('chart') || t.keywords.includes('visualize')
        )
      )
      break
    default:
      contextual.push(...relevantTemplates.slice(0, 3))
  }

  return contextual.slice(0, 3)
}