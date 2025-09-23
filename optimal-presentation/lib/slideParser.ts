import { SlideData } from './types'

export interface EditRequest {
  message: string
  slide: SlideData
  slideIndex: number
}

export interface EditResponse {
  success: boolean
  updates?: Partial<SlideData>
  newSlide?: SlideData
  command?: AdvancedCommand
  explanation?: string
  error?: string
}

export interface EditResult {
  success: boolean
  updatedSlide?: SlideData
  explanation?: string
  error?: string
}

export interface AdvancedCommand {
  type: 'slide_creation' | 'layout_change' | 'visualization' | 'content_edit'
  action: string
  parameters: {
    slideType?: string
    position?: 'before' | 'after' | 'end'
    layout?: string
    visualType?: 'chart' | 'diagram' | 'metrics'
    targetSlideIndex?: number
  }
}

export interface AdvancedEditResult {
  success: boolean
  command?: AdvancedCommand
  updatedSlide?: SlideData
  newSlide?: SlideData
  explanation?: string
  error?: string
}

/**
 * Applies partial updates to a slide while preserving data integrity
 */
export function applySlideUpdates(
  originalSlide: SlideData,
  updates: Partial<SlideData>
): SlideData {
  const updatedSlide: SlideData = {
    ...originalSlide,
    ...updates
  }

  // Handle content updates safely
  if (updates.content) {
    updatedSlide.content = {
      ...originalSlide.content,
      ...updates.content
    }

    // Validate content structure based on layout
    updatedSlide.content = validateContentForLayout(updatedSlide.content, updatedSlide.layout)
  }

  // Ensure required fields are never removed
  if (!updatedSlide.id) updatedSlide.id = originalSlide.id
  if (!updatedSlide.type) updatedSlide.type = originalSlide.type
  if (!updatedSlide.title) updatedSlide.title = originalSlide.title
  if (!updatedSlide.layout) updatedSlide.layout = originalSlide.layout

  return updatedSlide
}

/**
 * Validates content structure matches layout requirements
 */
function validateContentForLayout(content: any, layout: string): any {
  const validatedContent = { ...content }

  switch (layout) {
    case 'title-only':
      // Title slides can have mainText and callout
      break

    case 'bullet-list':
      // Ensure bulletPoints is an array
      if (validatedContent.bulletPoints && !Array.isArray(validatedContent.bulletPoints)) {
        validatedContent.bulletPoints = [validatedContent.bulletPoints]
      }
      break

    case 'title-content':
    case 'two-column':
    case 'three-column':
      // Ensure sections is an array
      if (validatedContent.sections && !Array.isArray(validatedContent.sections)) {
        validatedContent.sections = [validatedContent.sections]
      }
      break

    case 'metrics':
      // Ensure keyMetrics is an array
      if (validatedContent.keyMetrics && !Array.isArray(validatedContent.keyMetrics)) {
        validatedContent.keyMetrics = [validatedContent.keyMetrics]
      }
      break

    case 'diagram':
      // Validate diagram structure
      if (validatedContent.diagram && !validatedContent.diagram.elements) {
        validatedContent.diagram = {
          type: validatedContent.diagram.type || 'process',
          elements: Array.isArray(validatedContent.diagram) ? validatedContent.diagram : []
        }
      }
      break
  }

  return validatedContent
}

/**
 * Calls the edit-slide API to process natural language requests
 */
export async function processSlideEdit(
  request: EditRequest & { slides?: SlideData[] },
  apiKey: string
): Promise<EditResult & { newSlide?: SlideData, command?: AdvancedCommand }> {
  try {
    const response = await fetch('/api/edit-slide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: request.message,
        slide: request.slide,
        slideIndex: request.slideIndex,
        slides: request.slides,
        apiKey
      }),
    })

    const result: EditResponse = await response.json()

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Unknown error occurred'
      }
    }

    // Handle slide creation (advanced command)
    if (result.newSlide && result.command) {
      return {
        success: true,
        newSlide: result.newSlide,
        command: result.command,
        explanation: result.explanation
      }
    }

    // Handle slide updates
    if (result.updates) {
      // Apply the updates to create the final slide
      const updatedSlide = applySlideUpdates(request.slide, result.updates)

      return {
        success: true,
        updatedSlide,
        command: result.command,
        explanation: result.explanation
      }
    }

    // Handle commands without updates (like simple explanations)
    return {
      success: true,
      command: result.command,
      explanation: result.explanation || 'Command processed successfully'
    }

  } catch (error) {
    console.error('Slide edit processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    }
  }
}

/**
 * Detects if user message contains advanced commands for structural changes
 */
export function detectAdvancedCommand(message: string, currentSlideIndex: number): AdvancedCommand | null {
  const lowerMessage = message.toLowerCase()

  // Slide Creation Commands
  if (lowerMessage.includes('add') || lowerMessage.includes('create') || lowerMessage.includes('insert')) {
    if (lowerMessage.includes('slide')) {
      const slideTypes = ['problem', 'solution', 'benefits', 'implementation', 'framework', 'title', 'conclusion']
      const foundType = slideTypes.find(type => lowerMessage.includes(type))

      let position: 'before' | 'after' | 'end' = 'after'
      if (lowerMessage.includes('before')) position = 'before'
      else if (lowerMessage.includes('end') || lowerMessage.includes('last')) position = 'end'

      return {
        type: 'slide_creation',
        action: message,
        parameters: {
          slideType: foundType || 'custom',
          position,
          targetSlideIndex: currentSlideIndex
        }
      }
    }
  }

  // Layout Change Commands
  if (lowerMessage.includes('change') || lowerMessage.includes('convert') || lowerMessage.includes('make')) {
    if (lowerMessage.includes('layout') || lowerMessage.includes('format')) {
      const layouts = ['title-only', 'title-content', 'two-column', 'three-column', 'bullet-list', 'metrics', 'diagram', 'centered']
      const foundLayout = layouts.find(layout =>
        lowerMessage.includes(layout) ||
        lowerMessage.includes(layout.replace('-', ' ')) ||
        lowerMessage.includes(layout.replace('-', ''))
      )

      if (foundLayout) {
        return {
          type: 'layout_change',
          action: message,
          parameters: {
            layout: foundLayout,
            targetSlideIndex: currentSlideIndex
          }
        }
      }
    }
  }

  // Data Visualization Commands
  if (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('diagram') || lowerMessage.includes('visual')) {
    let visualType: 'chart' | 'diagram' | 'metrics' = 'chart'
    if (lowerMessage.includes('diagram')) visualType = 'diagram'
    else if (lowerMessage.includes('metric')) visualType = 'metrics'

    return {
      type: 'visualization',
      action: message,
      parameters: {
        visualType,
        targetSlideIndex: currentSlideIndex
      }
    }
  }

  // No advanced command detected
  return null
}

/**
 * Analyzes user message to provide quick suggestions
 */
export function analyzeEditIntent(message: string, slideLayout: string): string[] {
  const lowerMessage = message.toLowerCase()
  const suggestions: string[] = []

  // Common patterns
  if (lowerMessage.includes('title') || lowerMessage.includes('heading')) {
    suggestions.push('Update the title', 'Make title more concise')
  }

  if (lowerMessage.includes('bullet') || lowerMessage.includes('point')) {
    suggestions.push('Add bullet points', 'Modify existing bullets')
  }

  if (lowerMessage.includes('metric') || lowerMessage.includes('number')) {
    suggestions.push('Add key metrics', 'Update statistics')
  }

  if (lowerMessage.includes('short') || lowerMessage.includes('brief')) {
    suggestions.push('Shorten content', 'Make more concise')
  }

  if (lowerMessage.includes('add') || lowerMessage.includes('include')) {
    suggestions.push('Add new content', 'Include additional details')
  }

  // Layout-specific suggestions
  switch (slideLayout) {
    case 'title-only':
      suggestions.push('Add subtitle', 'Include key message')
      break
    case 'bullet-list':
      suggestions.push('Add bullet point', 'Reorder bullets')
      break
    case 'metrics':
      suggestions.push('Add performance metric', 'Update percentages')
      break
    case 'two-column':
      suggestions.push('Balance content', 'Add second column')
      break
  }

  return suggestions.slice(0, 4) // Return max 4 suggestions
}

/**
 * Generates a human-readable summary of slide changes
 */
export function generateChangeSummary(
  originalSlide: SlideData,
  updatedSlide: SlideData
): string {
  const changes: string[] = []

  if (originalSlide.title !== updatedSlide.title) {
    changes.push('updated title')
  }

  if (originalSlide.subtitle !== updatedSlide.subtitle) {
    changes.push('modified subtitle')
  }

  if (originalSlide.content?.mainText !== updatedSlide.content?.mainText) {
    changes.push('changed main content')
  }

  if (JSON.stringify(originalSlide.content?.bulletPoints) !== JSON.stringify(updatedSlide.content?.bulletPoints)) {
    changes.push('updated bullet points')
  }

  if (JSON.stringify(originalSlide.content?.sections) !== JSON.stringify(updatedSlide.content?.sections)) {
    changes.push('modified sections')
  }

  if (JSON.stringify(originalSlide.content?.keyMetrics) !== JSON.stringify(updatedSlide.content?.keyMetrics)) {
    changes.push('updated metrics')
  }

  if (originalSlide.content?.callout !== updatedSlide.content?.callout) {
    changes.push('changed callout')
  }

  if (changes.length === 0) {
    return 'No changes detected'
  }

  if (changes.length === 1) {
    return `Successfully ${changes[0]}`
  }

  if (changes.length === 2) {
    return `Successfully ${changes[0]} and ${changes[1]}`
  }

  return `Successfully ${changes.slice(0, -1).join(', ')} and ${changes[changes.length - 1]}`
}

/**
 * Creates a new slide with appropriate template based on type
 */
export function createSlideTemplate(type: string, slideIndex: number): SlideData {
  const slideId = `slide-${Date.now()}`

  const templates: Record<string, Partial<SlideData>> = {
    problem: {
      type: 'problem',
      title: 'Current Challenges',
      layout: 'title-content',
      content: {
        sections: [
          {
            title: 'Challenge Area',
            description: 'Describe the key challenge or pain point',
            items: ['Add specific challenge points here']
          }
        ],
        callout: 'Key insight about this challenge'
      }
    },
    solution: {
      type: 'solution',
      title: 'Proposed Solution',
      layout: 'two-column',
      content: {
        sections: [
          {
            title: 'Solution Approach',
            description: 'How we address the challenge',
            items: ['Solution component 1', 'Solution component 2']
          }
        ]
      }
    },
    benefits: {
      type: 'benefits',
      title: 'Expected Benefits',
      layout: 'metrics',
      content: {
        keyMetrics: [
          { label: 'Benefit metric', value: 'XX%', description: 'improvement expected' }
        ],
        sections: [
          {
            title: 'Key Benefits',
            description: 'Primary advantages of this solution',
            items: ['Benefit 1', 'Benefit 2']
          }
        ]
      }
    },
    implementation: {
      type: 'implementation',
      title: 'Implementation Plan',
      layout: 'three-column',
      content: {
        sections: [
          {
            title: 'Phase 1',
            description: 'Initial implementation phase',
            items: ['Step 1', 'Step 2']
          }
        ]
      }
    },
    framework: {
      type: 'framework',
      title: 'Framework Overview',
      layout: 'diagram',
      content: {
        diagram: {
          type: 'process',
          elements: [
            {
              id: 'step1',
              label: 'Step 1',
              description: 'First step in the process'
            }
          ]
        }
      }
    },
    conclusion: {
      type: 'conclusion',
      title: 'Next Steps',
      layout: 'centered',
      content: {
        bulletPoints: [
          'Action item 1',
          'Action item 2',
          'Action item 3'
        ],
        callout: 'Key takeaway message'
      }
    }
  }

  const template = templates[type] || {
    type: 'custom',
    title: 'New Slide',
    layout: 'title-content',
    content: {
      mainText: 'Add your content here...'
    }
  }

  return {
    id: slideId,
    ...template,
    metadata: {
      speaker_notes: `Speaker notes for ${template.title}`,
      duration_minutes: 2
    }
  } as SlideData
}