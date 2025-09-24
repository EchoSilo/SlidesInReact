/**
 * TargetedRefinement Class
 * Performs targeted improvements on specific slides based on validation feedback
 * Part of Phase 3: Deck cohesiveness validation
 */

import Anthropic from '@anthropic-ai/sdk'
import { createAnthropicClient } from '@/lib/anthropic-client'
import { ModelConfigs } from '@/lib/model-config'
import { Slide } from '@/lib/types'
import { TargetedRefinement as RefinementTarget } from './DeckValidator'
import { WorkflowLogger } from '@/lib/workflow-logger'

export interface RefinementResult {
  success: boolean
  originalSlide: Slide
  refinedSlide?: Slide
  refinementApplied: string
  improvementScore?: number
  error?: string
}

export interface RefinementOptions {
  maxAttempts?: number
  minImprovement?: number
  preserveStructure?: boolean
}

export class TargetedRefinementEngine {
  private anthropicClient: Anthropic
  private logger?: WorkflowLogger

  constructor(apiKey: string, logger?: WorkflowLogger) {
    this.anthropicClient = createAnthropicClient(apiKey)
    this.logger = logger
  }

  /**
   * Refine a specific slide based on feedback
   */
  async refineSlide(
    slide: Slide,
    target: RefinementTarget,
    context: {
      presentationTitle: string
      previousSlide?: Slide
      nextSlide?: Slide
      audience?: string
      tone?: string
    },
    options: RefinementOptions = {}
  ): Promise<RefinementResult> {
    const { maxAttempts = 2, minImprovement = 10, preserveStructure = true } = options

    let attempts = 0
    let bestResult: RefinementResult = {
      success: false,
      originalSlide: slide,
      refinementApplied: target.suggestedChanges
    }

    while (attempts < maxAttempts) {
      try {
        attempts++

        if (this.logger) {
          this.logger.info('TARGETED_REFINEMENT', `Refining slide ${target.slideNumber}`, {
            slide_id: slide.id,
            issue: target.issue,
            refinement_type: target.refinementType,
            priority: target.priority,
            attempt: attempts
          })
        }

        const refinedSlide = await this.performRefinement(
          slide,
          target,
          context,
          preserveStructure
        )

        // Quick validation of improvement
        const improvementScore = this.assessImprovement(slide, refinedSlide, target)

        if (this.logger) {
          this.logger.info('REFINEMENT_ASSESSMENT', `Improvement score: ${improvementScore}`, {
            slide_id: slide.id,
            original_length: JSON.stringify(slide).length,
            refined_length: JSON.stringify(refinedSlide).length
          })
        }

        if (improvementScore >= minImprovement) {
          bestResult = {
            success: true,
            originalSlide: slide,
            refinedSlide,
            refinementApplied: target.suggestedChanges,
            improvementScore
          }

          if (this.logger) {
            this.logger.success('TARGETED_REFINEMENT', 'Slide successfully refined', {
              slide_id: slide.id,
              improvement_score: improvementScore
            })
          }

          break
        }

      } catch (error) {
        if (this.logger) {
          this.logger.warning('TARGETED_REFINEMENT', `Refinement attempt ${attempts} failed`, {
            slide_id: slide.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }

        bestResult.error = error instanceof Error ? error.message : 'Refinement failed'
      }
    }

    return bestResult
  }

  /**
   * Perform the actual refinement using LLM
   */
  private async performRefinement(
    slide: Slide,
    target: RefinementTarget,
    context: any,
    preserveStructure: boolean
  ): Promise<Slide> {
    const prompt = this.createRefinementPrompt(slide, target, context, preserveStructure)
    const modelConfig = ModelConfigs.quickFix() // Using quickFix for targeted changes

    const response = await this.anthropicClient.messages.create({
      model: modelConfig.model,
      max_tokens: modelConfig.maxTokens,
      temperature: 0.3, // Lower temperature for controlled refinement
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API')
    }

    return this.parseRefinedSlide(content.text, slide)
  }

  /**
   * Create refinement prompt
   */
  private createRefinementPrompt(
    slide: Slide,
    target: RefinementTarget,
    context: any,
    preserveStructure: boolean
  ): string {
    let refinementFocus = ''

    switch (target.refinementType) {
      case 'transition':
        refinementFocus = `
FOCUS: Improve transition and flow
- Add connecting language to previous slide: "${context.previousSlide?.title || 'N/A'}"
- Create smooth lead-in to next slide: "${context.nextSlide?.title || 'N/A'}"
- Use transition phrases and connecting concepts`
        break

      case 'clarity':
        refinementFocus = `
FOCUS: Improve clarity and understanding
- Simplify complex concepts
- Use clearer language
- Add concrete examples
- Ensure main point is obvious`
        break

      case 'alignment':
        refinementFocus = `
FOCUS: Better align with presentation goals
- Ensure content supports: "${context.presentationTitle}"
- Match tone: ${context.tone || 'professional'}
- Suit audience: ${context.audience || 'business executives'}`
        break

      case 'content':
      default:
        refinementFocus = `
FOCUS: Improve content quality
- Address: ${target.issue}
- Apply: ${target.suggestedChanges}
- Enhance value and impact`
    }

    return `You are refining a single slide in a presentation. Make targeted improvements while preserving the slide's core purpose.

PRESENTATION CONTEXT:
Title: ${context.presentationTitle}
Audience: ${context.audience || 'General business audience'}
Tone: ${context.tone || 'professional'}

CURRENT SLIDE (${slide.type}):
${JSON.stringify(slide, null, 2)}

REFINEMENT REQUIRED:
Issue: ${target.issue}
Priority: ${target.priority}
Suggested Changes: ${target.suggestedChanges}

${refinementFocus}

${preserveStructure ? 'IMPORTANT: Preserve the slide structure, type, and layout. Only improve content.' : ''}

Return ONLY the refined slide JSON with the same structure but improved content.
The slide should maintain its id, type, and layout while addressing the identified issues.

CRITICAL: Return ONLY valid JSON for the single slide, not the entire presentation.`
  }

  /**
   * Parse the refined slide response
   */
  private parseRefinedSlide(responseText: string, originalSlide: Slide): Slide {
    try {
      let jsonStr = responseText.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      const refinedSlide = JSON.parse(jsonStr)

      // Ensure essential fields are preserved
      if (!refinedSlide.id) {
        refinedSlide.id = originalSlide.id
      }
      if (!refinedSlide.type) {
        refinedSlide.type = originalSlide.type
      }
      if (!refinedSlide.layout) {
        refinedSlide.layout = originalSlide.layout
      }

      return refinedSlide as Slide

    } catch (error) {
      throw new Error(`Failed to parse refined slide: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Assess the improvement made by refinement
   */
  private assessImprovement(
    original: Slide,
    refined: Slide,
    target: RefinementTarget
  ): number {
    let score = 0

    // Check if content changed
    const originalContent = JSON.stringify(original.content)
    const refinedContent = JSON.stringify(refined.content)

    if (originalContent !== refinedContent) {
      score += 30 // Content was modified
    }

    // Check for specific improvements based on type
    switch (target.refinementType) {
      case 'transition':
        // Check for transition phrases
        const transitionPhrases = ['furthermore', 'moreover', 'building on', 'as we', 'this leads']
        const hasTransitions = transitionPhrases.some(phrase =>
          refinedContent.toLowerCase().includes(phrase)
        )
        if (hasTransitions) score += 30
        break

      case 'clarity':
        // Check if content is more concise
        if (refinedContent.length < originalContent.length * 0.9) {
          score += 20 // Content was simplified
        }
        // Check for examples
        if (refinedContent.includes('example') || refinedContent.includes('for instance')) {
          score += 20
        }
        break

      case 'alignment':
        // Check if title changed to better align
        if (refined.title !== original.title) {
          score += 25
        }
        break

      case 'content':
        // Check for substantial content changes
        const contentDiff = Math.abs(refinedContent.length - originalContent.length)
        if (contentDiff > 50) {
          score += 35
        }
        break
    }

    // Check if speaker notes were improved
    if (refined.metadata?.speaker_notes &&
        refined.metadata.speaker_notes !== original.metadata?.speaker_notes) {
      score += 15
    }

    return Math.min(100, score)
  }

  /**
   * Batch refine multiple slides
   */
  async refineMultipleSlides(
    slides: Slide[],
    targets: RefinementTarget[],
    presentationContext: {
      title: string
      audience?: string
      tone?: string
    }
  ): Promise<RefinementResult[]> {
    const results: RefinementResult[] = []

    for (const target of targets) {
      const slideIndex = slides.findIndex(s => s.id === target.slideId)
      if (slideIndex < 0) continue

      const slide = slides[slideIndex]
      const context = {
        presentationTitle: presentationContext.title,
        previousSlide: slideIndex > 0 ? slides[slideIndex - 1] : undefined,
        nextSlide: slideIndex < slides.length - 1 ? slides[slideIndex + 1] : undefined,
        audience: presentationContext.audience,
        tone: presentationContext.tone
      }

      const result = await this.refineSlide(slide, target, context)
      results.push(result)

      // Update the slide array if refinement was successful
      if (result.success && result.refinedSlide) {
        slides[slideIndex] = result.refinedSlide
      }
    }

    return results
  }
}