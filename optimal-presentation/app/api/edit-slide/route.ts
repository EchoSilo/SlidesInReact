import { NextRequest, NextResponse } from 'next/server'
import { SlideData } from '@/lib/types'

interface EditSlideRequest {
  message: string
  slide: SlideData
  slideIndex: number
  apiKey?: string
}

interface EditSlideResponse {
  success: boolean
  updates?: Partial<SlideData>
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
      max_tokens: 1000,
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
    const { message, slide, slideIndex, apiKey } = body

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

    // Build the full prompt
    const fullPrompt = `${SLIDE_EDIT_PROMPT.replace('{layout}', slide.layout).replace('{type}', slide.type)}

CURRENT SLIDE DATA:
${JSON.stringify(slide, null, 2)}

USER REQUEST: "${message}"

Generate the slide updates:`

    console.log('Processing slide edit request:', {
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

    console.log('Slide edit successful:', {
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