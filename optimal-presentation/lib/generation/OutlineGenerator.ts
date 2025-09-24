/**
 * OutlineGenerator Class
 * Generates presentation outlines without full content
 * Part of the iterative generation approach to handle token limits
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import {
  OutlineGenerationRequest,
  PresentationOutline,
  SlideOutline
} from '@/lib/types/outline'
import { Framework } from '@/lib/validation/supportedFrameworks'
import { WorkflowLogger } from '@/lib/workflow-logger'

export class OutlineGenerator {
  private anthropicClient: Anthropic
  private logger?: WorkflowLogger

  constructor(apiKey: string, logger?: WorkflowLogger) {
    this.anthropicClient = createAnthropicClient(apiKey)
    this.logger = logger
  }

  /**
   * Generate a presentation outline
   */
  async generateOutline(
    request: OutlineGenerationRequest,
    framework: Framework
  ): Promise<PresentationOutline> {
    const startTime = Date.now()

    try {
      // Generate the outline prompt
      const prompt = this.createOutlinePrompt(request, framework)

      // Get model configuration for outline generation
      // Need more tokens for complete outline generation
      const modelConfig = {
        model: 'claude-3-haiku-20240307',
        maxTokens: 2500, // Increased from 1024 to handle full outline
        temperature: 0.3
      }

      if (this.logger) {
        this.logger.llmRequest(
          'OUTLINE_GENERATION',
          `Generating presentation outline for: ${request.prompt.substring(0, 100)}...`,
          modelConfig.model,
          { task: 'outline_generation', framework: framework.name }
        )
      }

      // Call Claude API
      const response = await this.anthropicClient.messages.create({
        model: modelConfig.model,
        max_tokens: modelConfig.maxTokens,
        temperature: modelConfig.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const duration = Date.now() - startTime

      if (this.logger) {
        this.logger.llmResponse('OUTLINE_GENERATION', response, duration)
      }

      // Extract and parse the response
      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parse JSON response
      const outline = this.parseOutlineResponse(content.text)

      // Enhance with token estimates
      this.addTokenEstimates(outline)

      return outline

    } catch (error) {
      if (this.logger) {
        this.logger.error('OUTLINE_GENERATION', 'Failed to generate outline', {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
      throw error
    }
  }

  /**
   * Create the outline generation prompt
   */
  private createOutlinePrompt(
    request: OutlineGenerationRequest,
    framework: Framework
  ): string {
    const frameworkStructure = framework.structure
      .map(step => `- ${step.step}: ${step.description}`)
      .join('\n')

    return `You are a presentation planning expert. Create a detailed outline for a presentation.

REQUIREMENTS:
- Topic: ${request.prompt}
- Type: ${request.presentation_type}
- Slide Count: ${request.slide_count}
- Audience: ${request.audience || 'General business audience'}
- Tone: ${request.tone || 'professional'}

FRAMEWORK: ${framework.name.toUpperCase()}
${framework.description}

Framework Structure:
${frameworkStructure}

TASK: Generate a presentation outline that follows the ${framework.name} framework.
Each slide should have a clear purpose and contribute to the overall narrative.

CRITICAL: Respond with ONLY valid JSON. No markdown, no extra text.

Required JSON structure:
{
  "id": "outline-[timestamp]",
  "title": "Presentation Title",
  "subtitle": "Compelling Subtitle",
  "description": "Brief description of the presentation",
  "metadata": {
    "author": "AI Generated",
    "created_at": "[ISO timestamp]",
    "presentation_type": "${request.presentation_type}",
    "target_audience": "${request.audience || 'General business audience'}",
    "estimated_duration": [number],
    "slide_count": ${request.slide_count},
    "tone": "${request.tone || 'professional'}",
    "framework": "${framework.name}",
    "version": "1.0"
  },
  "slides": [
    {
      "slideNumber": 1,
      "type": "title|problem|solution|benefits|implementation|framework|timeline|conclusion",
      "title": "Slide Title",
      "purpose": "What this slide accomplishes in the presentation",
      "keyPoints": ["Key point 1", "Key point 2"],
      "frameworkAlignment": "How this slide fits the ${framework.name} framework"
    }
  ],
  "frameworkStructure": {
    "framework": "${framework.name}",
    "flowDescription": "How the presentation follows the framework",
    "narrativeArc": "The overall story being told"
  }
}

Generate ${request.slide_count} slides that tell a coherent story following the ${framework.name} framework.
Focus on structure and flow, not detailed content.`
  }

  /**
   * Parse the outline response from Claude
   */
  private parseOutlineResponse(responseText: string): PresentationOutline {
    try {
      // Clean the response
      let jsonStr = responseText.trim()

      // Remove markdown if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      const outline = JSON.parse(jsonStr)

      // Validate basic structure
      if (!outline.slides || !Array.isArray(outline.slides)) {
        throw new Error('Invalid outline structure: missing slides array')
      }

      // Ensure all required fields are present
      if (!outline.title || !outline.metadata) {
        throw new Error('Invalid outline structure: missing required fields')
      }

      return outline as PresentationOutline

    } catch (error) {
      throw new Error(`Failed to parse outline response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Add token estimates to each slide in the outline
   */
  private addTokenEstimates(outline: PresentationOutline): void {
    // Estimate tokens based on slide type
    const tokenEstimates: Record<string, number> = {
      'title': 300,
      'problem': 600,
      'solution': 700,
      'benefits': 500,
      'implementation': 600,
      'framework': 800,
      'timeline': 500,
      'conclusion': 400,
      'chart': 600,
      'table': 700,
      'custom': 500
    }

    let totalTokens = 0

    for (const slide of outline.slides) {
      const estimate = tokenEstimates[slide.type] || 500
      slide.estimatedTokens = estimate
      totalTokens += estimate
    }

    outline.estimatedTotalTokens = totalTokens
  }

  /**
   * Validate that the outline meets requirements
   */
  validateOutlineStructure(
    outline: PresentationOutline,
    request: OutlineGenerationRequest
  ): boolean {
    // Check slide count matches
    if (outline.slides.length !== parseInt(request.slide_count)) {
      return false
    }

    // Check all slides have required fields
    for (const slide of outline.slides) {
      if (!slide.title || !slide.type || !slide.purpose) {
        return false
      }
    }

    // Check metadata is complete
    if (!outline.metadata || !outline.title) {
      return false
    }

    return true
  }
}