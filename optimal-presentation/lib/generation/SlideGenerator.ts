/**
 * SlideGenerator Class
 * Generates individual slides based on outline
 * Part of the iterative generation approach to handle token limits
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import { SlideOutline, PresentationOutline } from '@/lib/types/outline'
import { Slide } from '@/lib/types'
import { generateSlidePrompt } from '@/lib/prompts'
import { WorkflowLogger } from '@/lib/workflow-logger'

export interface SlideGenerationResult {
  slide: Slide
  tokensUsed?: number
  generationTime: number
  retryCount: number
}

export interface SlideGenerationOptions {
  maxRetries?: number
  includeContext?: boolean
  contextWindowSize?: number
}

export class SlideGenerator {
  private anthropicClient: Anthropic
  private logger?: WorkflowLogger
  private generatedSlides: Slide[] = []

  constructor(apiKey: string, logger?: WorkflowLogger) {
    this.anthropicClient = createAnthropicClient(apiKey)
    this.logger = logger
  }

  /**
   * Generate a single slide based on outline
   */
  async generateSlide(
    slideInfo: SlideOutline,
    presentationContext: PresentationOutline,
    options: SlideGenerationOptions = {}
  ): Promise<SlideGenerationResult> {
    const { maxRetries = 2, includeContext = true, contextWindowSize = 2 } = options

    let retryCount = 0
    let lastError: Error | null = null

    while (retryCount <= maxRetries) {
      try {
        const startTime = Date.now()

        // Get previous slides for context (if enabled)
        const previousSlides = includeContext
          ? this.generatedSlides.slice(-contextWindowSize)
          : undefined

        // Generate the slide prompt
        const prompt = generateSlidePrompt(slideInfo, presentationContext, previousSlides)

        // Get model configuration for slide generation
        const modelConfig = ModelConfigs.quickFix() // Using quickFix tokens (1024) for individual slides

        // Log the actual request being sent to the LLM
        if (this.logger) {
          this.logger.llmRequest(
            'SLIDE_GENERATION',
            prompt, // Pass the full prompt, not a description
            modelConfig.model,
            {
              slide_number: slideInfo.slideNumber,
              slide_type: slideInfo.type,
              slide_title: slideInfo.title,
              retry_count: retryCount,
              request_config: {
                model: modelConfig.model,
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature
              }
            }
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
          this.logger.llmResponse('SLIDE_GENERATION', response, duration)
        }

        // Extract and parse the response
        const content = response.content[0]
        if (content.type !== 'text') {
          throw new Error('Unexpected response type from Claude API')
        }

        // Parse slide JSON
        const slide = this.parseSlideResponse(content.text, slideInfo)

        // Store the generated slide for context
        this.generatedSlides.push(slide)

        if (this.logger) {
          this.logger.success('SLIDE_GENERATION', `Slide ${slideInfo.slideNumber} generated successfully`, {
            slide_id: slide.id,
            slide_type: slide.type,
            generation_time_ms: duration,
            retry_count: retryCount
          })
        }

        return {
          slide,
          tokensUsed: modelConfig.maxTokens,
          generationTime: duration,
          retryCount
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        retryCount++

        if (this.logger) {
          this.logger.warning('SLIDE_GENERATION', `Slide generation failed, retry ${retryCount}/${maxRetries}`, {
            slide_number: slideInfo.slideNumber,
            error: lastError.message
          })
        }

        if (retryCount > maxRetries) {
          throw lastError
        }

        // Wait before retry
        await this.delay(1000 * retryCount)
      }
    }

    throw lastError || new Error('Failed to generate slide after retries')
  }

  /**
   * Generate multiple slides in sequence
   */
  async generateSlides(
    slideOutlines: SlideOutline[],
    presentationContext: PresentationOutline,
    onProgress?: (slideNumber: number, total: number) => void
  ): Promise<SlideGenerationResult[]> {
    const results: SlideGenerationResult[] = []

    for (const slideInfo of slideOutlines) {
      try {
        // Notify progress
        if (onProgress) {
          onProgress(slideInfo.slideNumber, slideOutlines.length)
        }

        // Generate the slide
        const result = await this.generateSlide(slideInfo, presentationContext)
        results.push(result)

      } catch (error) {
        if (this.logger) {
          this.logger.error('SLIDE_GENERATION', `Failed to generate slide ${slideInfo.slideNumber}`, {
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }

        // Create a fallback slide on error
        const fallbackSlide = this.createFallbackSlide(slideInfo)
        results.push({
          slide: fallbackSlide,
          generationTime: 0,
          retryCount: 0
        })
      }
    }

    return results
  }

  /**
   * Parse the slide response from Claude
   */
  private parseSlideResponse(responseText: string, slideInfo: SlideOutline): Slide {
    try {
      // Clean the response
      let jsonStr = responseText.trim()

      // Remove markdown if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      // Handle case where LLM returns full presentation instead of just slide
      const parsed = JSON.parse(jsonStr)

      // If it's an array or has a slides property, extract the relevant slide
      let slideData = parsed
      if (Array.isArray(parsed)) {
        slideData = parsed[0]
      } else if (parsed.slides && Array.isArray(parsed.slides)) {
        slideData = parsed.slides[0]
      }

      // Ensure required fields
      if (!slideData.id) {
        slideData.id = `slide-${slideInfo.slideNumber}`
      }
      if (!slideData.type) {
        slideData.type = slideInfo.type
      }
      if (!slideData.title) {
        slideData.title = slideInfo.title
      }

      // Ensure content object exists
      if (!slideData.content) {
        slideData.content = {}
      }

      // Ensure metadata exists
      if (!slideData.metadata) {
        slideData.metadata = {
          speaker_notes: slideInfo.purpose || '',
          duration_minutes: 2,
          audience_level: 'general'
        }
      }

      return slideData as Slide

    } catch (error) {
      throw new Error(`Failed to parse slide response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create a fallback slide when generation fails
   */
  private createFallbackSlide(slideInfo: SlideOutline): Slide {
    return {
      id: `slide-${slideInfo.slideNumber}`,
      type: slideInfo.type as any,
      title: slideInfo.title,
      layout: this.getDefaultLayout(slideInfo.type),
      content: {
        mainText: slideInfo.purpose || 'Content generation failed',
        bulletPoints: slideInfo.keyPoints || [],
        callout: 'This slide requires manual content creation'
      },
      metadata: {
        speaker_notes: 'This slide was created as a fallback due to generation failure',
        duration_minutes: 2,
        audience_level: 'general'
      }
    }
  }

  /**
   * Get default layout for a slide type
   */
  private getDefaultLayout(slideType: string): string {
    const layoutMap: Record<string, string> = {
      'title': 'title-only',
      'problem': 'title-content',
      'solution': 'two-column',
      'benefits': 'metrics',
      'implementation': 'timeline',
      'framework': 'diagram',
      'timeline': 'timeline',
      'conclusion': 'centered',
      'chart': 'chart',
      'table': 'table'
    }
    return layoutMap[slideType] || 'title-content'
  }

  /**
   * Clear generated slides cache
   */
  clearCache(): void {
    this.generatedSlides = []
  }

  /**
   * Get generated slides
   */
  getGeneratedSlides(): Slide[] {
    return [...this.generatedSlides]
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Try multiple JSON parsing strategies for malformed JSON
   */
  private tryMultipleParsingStrategies(jsonStr: string): any {
    const strategies = [
      // Strategy 1: Direct parsing
      () => JSON.parse(jsonStr),

      // Strategy 2: Fix common JSON issues
      () => {
        let fixed = jsonStr
          // Fix unquoted property names (common LLM issue)
          .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
          // Fix single quotes to double quotes
          .replace(/'/g, '"')
          // Fix trailing commas
          .replace(/,\s*([}\]])/g, '$1')
          // Fix missing commas between array elements
          .replace(/"\s+"/g, '", "')
          // Fix missing commas between objects
          .replace(/}\s+{/g, '}, {')
          // Fix common object issues
          .replace(/([^}\],])\s*$/, '$1}')

        return JSON.parse(fixed)
      },

      // Strategy 3: Find and fix unclosed braces/brackets
      () => {
        // Count open/close braces and brackets
        const openBraces = (jsonStr.match(/\{/g) || []).length
        const closeBraces = (jsonStr.match(/\}/g) || []).length
        const openBrackets = (jsonStr.match(/\[/g) || []).length
        const closeBrackets = (jsonStr.match(/\]/g) || []).length

        let fixed = jsonStr
        // Add missing closing brackets/braces
        for (let i = 0; i < openBrackets - closeBrackets; i++) fixed += ']'
        for (let i = 0; i < openBraces - closeBraces; i++) fixed += '}'

        return JSON.parse(fixed)
      },

      // Strategy 4: Extract valid JSON fragment
      () => {
        // Try to find the largest valid JSON fragment
        for (let i = jsonStr.length - 1; i >= jsonStr.length / 2; i--) {
          try {
            const partial = jsonStr.substring(0, i)
            const openBraces = (partial.match(/\{/g) || []).length - (partial.match(/\}/g) || []).length
            const openBrackets = (partial.match(/\[/g) || []).length - (partial.match(/\]/g) || []).length

            let closed = partial
            for (let j = 0; j < openBrackets; j++) closed += ']'
            for (let j = 0; j < openBraces; j++) closed += '}'

            const parsed = JSON.parse(closed)
            // Ensure it has some content
            if (parsed.title || parsed.content || parsed.type) {
              return parsed
            }
          } catch (e) {
            continue
          }
        }
        throw new Error('No valid JSON fragment found')
      }
    ]

    let lastError: Error | null = null
    for (let i = 0; i < strategies.length; i++) {
      try {
        const result = strategies[i]()
        console.log(`Slide parsing strategy ${i + 1} succeeded`)
        return result
      } catch (error) {
        lastError = error as Error
        console.log(`Slide parsing strategy ${i + 1} failed:`, (error as Error).message)
      }
    }

    throw lastError || new Error('All parsing strategies failed')
  }
}