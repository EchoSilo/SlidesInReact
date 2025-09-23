import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { generatePrompt } from '@/lib/prompts'
import { GenerationRequest, GenerationResponse, PresentationData } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: GenerationRequest & { apiKey?: string } = await request.json()

    // Validate required fields
    if (!body.prompt || !body.presentation_type || !body.slide_count) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: prompt, presentation_type, slide_count',
        generation_id: generateId()
      } as GenerationResponse, { status: 400 })
    }

    // Get API key from request body (client-side) or fallback to environment
    const apiKey = body.apiKey || process.env.ANTHROPIC_API_KEY

    // Validate API key
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    // Generate the prompt
    const prompt = generatePrompt(body)

    console.log('Generating presentation with prompt:', {
      type: body.presentation_type,
      slideCount: body.slide_count,
      audience: body.audience,
      tone: body.tone
    })

    // Create Anthropic client with the correct API key
    const anthropicClient = new Anthropic({
      apiKey: apiKey,
    })

    // Call Claude API
    const response = await anthropicClient.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    // Extract the response content
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API')
    }

    // Parse the JSON response
    let presentationData: PresentationData
    try {
      // Clean the response to ensure it's valid JSON
      let jsonStr = content.text.trim()

      // Remove any markdown code block markers
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }

      presentationData = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', parseError)
      console.error('Raw response:', content.text)

      return NextResponse.json({
        success: false,
        error: 'Failed to parse generated content. Please try again.',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    // Validate the structure
    if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid presentation structure generated',
        generation_id: generateId()
      } as GenerationResponse, { status: 500 })
    }

    console.log(`Successfully generated presentation with ${presentationData.slides.length} slides`)

    // Return the successful response
    return NextResponse.json({
      success: true,
      presentation: presentationData,
      generation_id: generateId()
    } as GenerationResponse)

  } catch (error) {
    console.error('Error generating presentation:', error)

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({
        success: false,
        error: `API Error: ${error.message}`,
        generation_id: generateId()
      } as GenerationResponse, { status: error.status || 500 })
    }

    // Generic error response
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred while generating the presentation',
      generation_id: generateId()
    } as GenerationResponse, { status: 500 })
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}