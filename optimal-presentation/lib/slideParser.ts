import { SlideData } from './types'

export interface EditRequest {
  message: string
  slide: SlideData
  slideIndex: number
}

export interface EditResponse {
  success: boolean
  updates?: Partial<SlideData>
  explanation?: string
  error?: string
}

export interface EditResult {
  success: boolean
  updatedSlide?: SlideData
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
  request: EditRequest,
  apiKey: string
): Promise<EditResult> {
  try {
    const response = await fetch('/api/edit-slide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
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

    if (!result.updates) {
      return {
        success: false,
        error: 'No updates received from server'
      }
    }

    // Apply the updates to create the final slide
    const updatedSlide = applySlideUpdates(request.slide, result.updates)

    return {
      success: true,
      updatedSlide,
      explanation: result.explanation
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