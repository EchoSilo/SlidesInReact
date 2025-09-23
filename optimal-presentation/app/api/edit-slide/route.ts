import { NextRequest, NextResponse } from 'next/server'
import { SlideData } from '@/lib/types'
import { detectAdvancedCommand, createSlideTemplate, AdvancedCommand } from '@/lib/slideParser'

interface EditSlideRequest {
  message: string
  slide: SlideData
  slideIndex: number
  slides?: SlideData[]
  apiKey?: string
}

interface EditSlideResponse {
  success: boolean
  updates?: Partial<SlideData>
  newSlide?: SlideData
  command?: AdvancedCommand
  explanation?: string
  error?: string
}

const SLIDE_EDIT_PROMPT = `You are an expert presentation editor. Your job is to understand user requests and generate precise slide updates.

IMPORTANT: Respond ONLY with valid JSON matching this exact format:
{
  "updates": {
    // Only include fields that should be changed
    "title": "new title if title should change",
    "subtitle": "new subtitle if subtitle should change",
    "content": {
      "mainText": "new main text if it should change",
      "bulletPoints": ["new", "bullet", "points"] // if bullets should change,
      "sections": [
        {
          "title": "section title",
          "description": "section description",
          "items": ["item1", "item2"]
        }
      ], // if sections should change
      "keyMetrics": [
        {
          "label": "metric name",
          "value": "metric value",
          "description": "metric description"
        }
      ], // if metrics should change
      "callout": "callout text if callout should change"
    }
  },
  "explanation": "Brief explanation of what you changed and why"
}

EDITING RULES:
1. ONLY modify what the user specifically requests
2. Keep the same tone and style as existing content
3. Preserve the slide's layout type and structure
4. If shortening text, maintain key information
5. If adding content, ensure it fits the slide type
6. For bullet points, maintain logical flow and relevance
7. Never change the slide ID, type, or layout unless explicitly requested

SLIDE TYPE CONTEXTS:
- title-only: Focus on title, subtitle, mainText, callout
- title-content: Focus on title, sections, keyMetrics, callout
- two-column: Balance content across sections
- bullet-list: Focus on bulletPoints array
- metrics: Focus on keyMetrics array
- diagram: Focus on diagram elements and descriptions

Current slide layout: {layout}
Current slide type: {type}`

const SLIDE_CREATION_PROMPT = `You are an expert presentation designer. Your job is to create new slide content based on user requests.

IMPORTANT: Respond ONLY with valid JSON matching this exact format:
{
  "content": {
    // Content structure based on slide type and layout
    "mainText": "main content text",
    "bulletPoints": ["bullet 1", "bullet 2"], // for bullet-list layouts
    "sections": [
      {
        "title": "section title",
        "description": "section description",
        "items": ["item1", "item2"]
      }
    ], // for multi-section layouts
    "keyMetrics": [
      {
        "label": "metric name",
        "value": "metric value",
        "description": "metric description"
      }
    ], // for metrics layouts
    "callout": "important callout text",
    "diagram": {
      "type": "process",
      "elements": [
        {
          "id": "step1",
          "label": "Step 1",
          "description": "First step description"
        }
      ]
    } // for diagram layouts
  },
  "title": "Generated slide title",
  "subtitle": "Generated subtitle if needed",
  "explanation": "Brief explanation of the slide content created"
}

CREATION RULES:
1. Generate relevant, professional content that fits the slide type
2. Ensure content is appropriate for the layout type
3. Use clear, concise language suitable for presentations
4. Include specific, actionable items where appropriate
5. Make content relevant to capacity management and business frameworks

Slide type to create: {slideType}
Layout type: {layout}
User request context: {context}`

async function callClaudeAPI(prompt: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

export async function POST(request: NextRequest) {
  try {
    const body: EditSlideRequest = await request.json()
    const { message, slide, slideIndex, slides, apiKey } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'Slide data is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      )
    }

    // Check for advanced commands first
    const advancedCommand = detectAdvancedCommand(message, slideIndex)

    if (advancedCommand) {
      console.log('Processing advanced command:', advancedCommand)

      // Handle slide creation commands
      if (advancedCommand.type === 'slide_creation') {
        const { slideType = 'custom', position = 'after' } = advancedCommand.parameters

        // Create new slide with template
        let newSlide = createSlideTemplate(slideType, slideIndex)

        // If we have specific content to generate, use Claude API
        if (slideType !== 'custom') {
          try {
            const creationPrompt = SLIDE_CREATION_PROMPT
              .replace('{slideType}', slideType)
              .replace('{layout}', newSlide.layout)
              .replace('{context}', message)

            const claudeResponse = await callClaudeAPI(creationPrompt, apiKey)
            const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/)

            if (jsonMatch) {
              const parsedContent = JSON.parse(jsonMatch[0])
              if (parsedContent.content) {
                newSlide.content = parsedContent.content
              }
              if (parsedContent.title) {
                newSlide.title = parsedContent.title
              }
              if (parsedContent.subtitle) {
                newSlide.subtitle = parsedContent.subtitle
              }
            }
          } catch (aiError) {
            console.warn('AI content generation failed, using template:', aiError)
          }
        }

        return NextResponse.json({
          success: true,
          newSlide,
          command: advancedCommand,
          explanation: `Created new ${slideType} slide. ${advancedCommand.parameters.position === 'before' ? 'Insert before' : advancedCommand.parameters.position === 'end' ? 'Add to end' : 'Insert after'} current slide.`
        })
      }

      // Handle layout change commands
      if (advancedCommand.type === 'layout_change') {
        const { layout } = advancedCommand.parameters

        return NextResponse.json({
          success: true,
          updates: { layout },
          command: advancedCommand,
          explanation: `Changed slide layout to ${layout}. Content has been preserved where possible.`
        })
      }

      // Handle visualization commands
      if (advancedCommand.type === 'visualization') {
        const { visualType } = advancedCommand.parameters

        let updates: Partial<SlideData> = {}
        let explanation = ''

        if (visualType === 'metrics') {
          updates.layout = 'metrics'
          updates.content = {
            ...slide.content,
            keyMetrics: slide.content?.keyMetrics || [
              { label: 'Sample Metric', value: '0%', description: 'Add your metrics here' }
            ]
          }
          explanation = 'Added metrics visualization to slide'
        } else if (visualType === 'diagram') {
          updates.layout = 'diagram'
          updates.content = {
            ...slide.content,
            diagram: {
              type: 'process',
              elements: [
                { id: 'step1', label: 'Step 1', description: 'First step in the process' }
              ]
            }
          }
          explanation = 'Added diagram visualization to slide'
        } else {
          updates.layout = 'two-column'
          explanation = 'Added chart-ready layout to slide'
        }

        return NextResponse.json({
          success: true,
          updates,
          command: advancedCommand,
          explanation
        })
      }
    }

    // Standard slide editing (non-advanced commands)
    const fullPrompt = `${SLIDE_EDIT_PROMPT.replace('{layout}', slide.layout).replace('{type}', slide.type)}

CURRENT SLIDE DATA:
${JSON.stringify(slide, null, 2)}

USER REQUEST: "${message}"

Generate the slide updates:`

    console.log('Processing standard slide edit:', {
      message,
      slideIndex,
      layout: slide.layout,
      type: slide.type
    })

    // Call Claude API
    const claudeResponse = await callClaudeAPI(fullPrompt, apiKey)

    // Parse Claude's response
    let parsedResponse
    try {
      // Extract JSON from Claude's response (it might include extra text)
      const jsonMatch = claudeResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in Claude response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('Failed to parse Claude response:', claudeResponse)
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response. Please try rephrasing your request.'
      })
    }

    // Validate the response structure
    if (!parsedResponse.updates || !parsedResponse.explanation) {
      return NextResponse.json({
        success: false,
        error: 'Invalid response format from AI. Please try again.'
      })
    }

    // Return the structured response
    const response: EditSlideResponse = {
      success: true,
      updates: parsedResponse.updates,
      explanation: parsedResponse.explanation
    }

    console.log('Standard slide edit successful:', {
      slideIndex,
      updatedFields: Object.keys(parsedResponse.updates),
      explanation: parsedResponse.explanation
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('Slide edit error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}