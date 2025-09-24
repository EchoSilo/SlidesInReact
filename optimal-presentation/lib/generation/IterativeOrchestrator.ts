/**
 * IterativeOrchestrator Class
 * Coordinates the complete iterative presentation generation pipeline
 * Includes outline generation, slide-by-slide generation, and multi-level validation
 */

import { OutlineGenerator } from './OutlineGenerator'
import { SlideGenerator, SlideGenerationResult } from './SlideGenerator'
import { OutlineValidator } from '@/lib/validation/OutlineValidator'
import { SlideValidator, SlideValidationFeedback } from '@/lib/validation/SlideValidator'
import { DeckValidator, DeckValidationFeedback } from '@/lib/validation/DeckValidator'
import { TargetedRefinementEngine } from '@/lib/validation/TargetedRefinement'
import { FrameworkAnalyzer } from '@/lib/validation/frameworkAnalysis'
import { getFramework, Framework } from '@/lib/validation/supportedFrameworks'
import { WorkflowLogger } from '@/lib/workflow-logger'
import { GenerationRequest, PresentationData, Slide } from '@/lib/types'
import {
  OutlineGenerationRequest,
  PresentationOutline,
  SlideOutline,
  OutlineValidationFeedback
} from '@/lib/types/outline'

export interface IterativeGenerationProgress {
  phase: 'outline' | 'slides' | 'validation' | 'complete'
  currentStep: string
  slideNumber?: number
  totalSlides?: number
  percentComplete: number
  message: string
  validationScore?: number
  estimatedTimeRemaining?: number
}

export interface IterativeGenerationResult {
  success: boolean
  presentation?: PresentationData
  outline?: PresentationOutline
  validationScores?: {
    outline: number
    slides: number[]
    deck?: DeckValidationFeedback
    overall: number
  }
  tokensUsed?: {
    outline: number
    slides: number
    validation: number
    deckValidation?: number
    refinement?: number
    total: number
  }
  generationTime?: {
    outline: number
    slides: number
    validation: number
    deckValidation?: number
    refinement?: number
    total: number
  }
  refinements?: {
    count: number
    improved: number
    details?: any[]
  }
  errors?: string[]
}

export interface IterativeGenerationOptions {
  validateOutline?: boolean
  validateSlides?: boolean
  validateDeck?: boolean
  enableRefinement?: boolean
  maxSlideRetries?: number
  minSlideScore?: number
  minDeckScore?: number
  maxRefinementTargets?: number
  progressCallback?: (progress: IterativeGenerationProgress) => void
  streamProgress?: boolean
}

export class IterativeOrchestrator {
  private outlineGenerator: OutlineGenerator
  private slideGenerator: SlideGenerator
  private outlineValidator: OutlineValidator
  private slideValidator: SlideValidator
  private deckValidator: DeckValidator
  private refinementEngine: TargetedRefinementEngine
  private frameworkAnalyzer: FrameworkAnalyzer
  private logger: WorkflowLogger
  private progressCallback?: (progress: IterativeGenerationProgress) => void

  constructor(
    apiKey: string,
    logger: WorkflowLogger,
    progressCallback?: (progress: IterativeGenerationProgress) => void
  ) {
    this.outlineGenerator = new OutlineGenerator(apiKey, logger)
    this.slideGenerator = new SlideGenerator(apiKey, logger)
    this.outlineValidator = new OutlineValidator(apiKey, undefined, logger)
    this.slideValidator = new SlideValidator(apiKey, undefined, logger)
    this.deckValidator = new DeckValidator(apiKey, undefined, logger)
    this.refinementEngine = new TargetedRefinementEngine(apiKey, logger)
    this.frameworkAnalyzer = new FrameworkAnalyzer(apiKey)
    this.logger = logger
    this.progressCallback = progressCallback
  }

  /**
   * Main orchestration method for iterative generation
   */
  async generatePresentation(
    request: GenerationRequest,
    options: IterativeGenerationOptions = {}
  ): Promise<IterativeGenerationResult> {
    const startTime = Date.now()
    const errors: string[] = []

    const {
      validateOutline = true,
      validateSlides = true,
      maxSlideRetries = 2,
      minSlideScore = 60
    } = options

    // Override progress callback if provided
    if (options.progressCallback) {
      this.progressCallback = options.progressCallback
    }

    try {
      // Track tokens and time
      const tokensUsed = { outline: 0, slides: 0, validation: 0, total: 0 }
      const generationTime = { outline: 0, slides: 0, validation: 0, total: 0 }

      // Phase 1: Outline Generation
      this.updateProgress({
        phase: 'outline',
        currentStep: 'Analyzing requirements and selecting framework',
        percentComplete: 5,
        message: 'Starting presentation generation...'
      })

      const outlineStartTime = Date.now()

      // Get framework
      const framework = await this.selectFramework(request)

      this.updateProgress({
        phase: 'outline',
        currentStep: 'Generating presentation outline',
        percentComplete: 15,
        message: `Using ${framework.name} framework`
      })

      // Generate outline
      const outlineRequest: OutlineGenerationRequest = {
        prompt: request.prompt,
        presentation_type: request.presentation_type,
        slide_count: request.slide_count,
        audience: request.audience,
        tone: request.tone
      }

      const outline = await this.outlineGenerator.generateOutline(outlineRequest, framework)
      generationTime.outline = Date.now() - outlineStartTime
      tokensUsed.outline = 1000 // Estimate

      // Validate outline if enabled
      let outlineScore = 100
      if (validateOutline) {
        this.updateProgress({
          phase: 'outline',
          currentStep: 'Validating outline structure',
          percentComplete: 25,
          message: 'Checking outline quality...'
        })

        const outlineValidation = await this.outlineValidator.validateOutline(
          outline,
          outlineRequest,
          framework
        )
        outlineScore = outlineValidation.overallScore

        if (outlineScore < 70) {
          this.logger.warning('ITERATIVE_ORCHESTRATOR', 'Outline validation score below threshold', {
            score: outlineScore,
            threshold: 70
          })
          errors.push(`Outline quality score (${outlineScore}) below recommended threshold`)
        }
      }

      this.updateProgress({
        phase: 'outline',
        currentStep: 'Outline complete',
        percentComplete: 30,
        message: `Outline generated with ${outline.slides.length} slides`,
        validationScore: outlineScore
      })

      // Phase 2: Slide Generation
      const slidesStartTime = Date.now()
      const generatedSlides: Slide[] = []
      const slideScores: number[] = []

      for (let i = 0; i < outline.slides.length; i++) {
        const slideOutline = outline.slides[i]
        const slideProgress = 30 + (i / outline.slides.length) * 50 // 30-80% range

        this.updateProgress({
          phase: 'slides',
          currentStep: `Generating slide ${i + 1}: ${slideOutline.title}`,
          slideNumber: i + 1,
          totalSlides: outline.slides.length,
          percentComplete: Math.round(slideProgress),
          message: `Creating ${slideOutline.type} slide...`
        })

        // Generate slide with retries
        let slideResult: SlideGenerationResult | null = null
        let slideScore = 0
        let retryCount = 0

        while (retryCount <= maxSlideRetries) {
          try {
            // Generate the slide
            slideResult = await this.slideGenerator.generateSlide(
              slideOutline,
              outline,
              { maxRetries: 1 }
            )

            tokensUsed.slides += slideResult.tokensUsed || 1000

            // Validate slide if enabled
            if (validateSlides) {
              const validation = await this.slideValidator.validateSlide(
                slideResult.slide,
                slideOutline,
                outline.title
              )
              slideScore = validation.overallScore
              tokensUsed.validation += 500 // Estimate

              // Check if slide meets quality threshold
              if (slideScore >= minSlideScore || retryCount >= maxSlideRetries) {
                break
              }

              this.logger.warning('ITERATIVE_ORCHESTRATOR', `Slide ${i + 1} below quality threshold, retrying`, {
                score: slideScore,
                threshold: minSlideScore,
                retry: retryCount + 1
              })
              retryCount++

            } else {
              slideScore = 100 // Default if not validating
              break
            }

          } catch (error) {
            this.logger.error('ITERATIVE_ORCHESTRATOR', `Failed to generate slide ${i + 1}`, {
              error: error instanceof Error ? error.message : 'Unknown error',
              retry: retryCount
            })

            if (retryCount >= maxSlideRetries) {
              // Create fallback slide
              const fallbackSlide = this.createFallbackSlide(slideOutline)
              generatedSlides.push(fallbackSlide)
              slideScores.push(0)
              errors.push(`Slide ${i + 1} generation failed after retries`)
              break
            }
            retryCount++
          }
        }

        if (slideResult) {
          generatedSlides.push(slideResult.slide)
          slideScores.push(slideScore)
        }
      }

      generationTime.slides = Date.now() - slidesStartTime

      // Phase 3: Deck Validation & Refinement
      this.updateProgress({
        phase: 'validation',
        currentStep: 'Validating presentation cohesiveness',
        percentComplete: 85,
        message: 'Checking narrative flow and coherence...'
      })

      // Create presentation for validation
      let presentation: PresentationData = {
        id: outline.id,
        title: outline.title,
        subtitle: outline.subtitle,
        description: outline.description,
        metadata: outline.metadata,
        slides: generatedSlides
      }

      // Deck validation (if enabled)
      let deckValidation: DeckValidationFeedback | undefined
      let refinementResults: any[] = []
      const deckValidationStartTime = Date.now()

      const {
        validateDeck = true,
        enableRefinement = true,
        minDeckScore = 70,
        maxRefinementTargets = 3
      } = options

      if (validateDeck) {
        try {
          deckValidation = await this.deckValidator.validateDeck(
            presentation,
            request,
            framework
          )

          tokensUsed.deckValidation = 1000 // Estimate

          this.logger.info('DECK_VALIDATION', 'Deck validation complete', {
            overall_score: deckValidation.overallScore,
            narrative_flow: deckValidation.narrativeFlow.score,
            user_intent: deckValidation.userIntentFulfillment.score
          })

          // Check if refinement is needed
          if (enableRefinement && deckValidation.overallScore < minDeckScore) {
            this.updateProgress({
              phase: 'validation',
              currentStep: 'Applying targeted refinements',
              percentComplete: 90,
              message: 'Improving specific slides based on feedback...'
            })

            // Identify refinement targets
            const refinementTargets = this.deckValidator.identifyRefinementTargets(
              deckValidation,
              presentation
            ).slice(0, maxRefinementTargets) // Limit refinements

            if (refinementTargets.length > 0) {
              this.logger.info('TARGETED_REFINEMENT', 'Starting targeted refinements', {
                targets: refinementTargets.length,
                priorities: refinementTargets.map(t => t.priority)
              })

              // Apply refinements
              const refinementStart = Date.now()
              const results = await this.refinementEngine.refineMultipleSlides(
                presentation.slides,
                refinementTargets,
                {
                  title: presentation.title,
                  audience: request.audience,
                  tone: request.tone
                }
              )

              refinementResults = results
              generationTime.refinement = Date.now() - refinementStart
              tokensUsed.refinement = results.length * 500 // Estimate

              // Count successful refinements
              const successfulRefinements = results.filter(r => r.success).length

              this.logger.success('TARGETED_REFINEMENT', 'Refinements complete', {
                attempted: results.length,
                successful: successfulRefinements
              })

              // Re-validate if refinements were made
              if (successfulRefinements > 0) {
                deckValidation = await this.deckValidator.validateDeck(
                  presentation,
                  request,
                  framework
                )
              }
            }
          }

        } catch (error) {
          this.logger.warning('DECK_VALIDATION', 'Deck validation failed', {
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      generationTime.deckValidation = Date.now() - deckValidationStartTime

      // Calculate overall validation score
      const slideAverage = slideScores.length > 0
        ? slideScores.reduce((a, b) => a + b, 0) / slideScores.length
        : 0

      const overallScore = deckValidation
        ? Math.round((outlineScore + slideAverage + deckValidation.overallScore) / 3)
        : Math.round((outlineScore + slideAverage) / 2)

      this.updateProgress({
        phase: 'complete',
        currentStep: 'Generation complete',
        percentComplete: 100,
        message: `Successfully generated ${generatedSlides.length} slides`,
        validationScore: overallScore
      })

      // Calculate totals
      generationTime.total = Date.now() - startTime
      tokensUsed.total = tokensUsed.outline + tokensUsed.slides + tokensUsed.validation +
        (tokensUsed.deckValidation || 0) + (tokensUsed.refinement || 0)

      this.logger.success('ITERATIVE_ORCHESTRATOR', 'Presentation generation complete', {
        slides_generated: generatedSlides.length,
        overall_score: overallScore,
        deck_validation: deckValidation?.overallScore,
        refinements_applied: refinementResults.filter(r => r.success).length,
        total_tokens: tokensUsed.total,
        total_time_ms: generationTime.total,
        errors: errors.length
      })

      return {
        success: true,
        presentation,
        outline,
        validationScores: {
          outline: outlineScore,
          slides: slideScores,
          deck: deckValidation,
          overall: overallScore
        },
        tokensUsed,
        generationTime,
        refinements: refinementResults.length > 0 ? {
          count: refinementResults.length,
          improved: refinementResults.filter(r => r.success).length,
          details: refinementResults
        } : undefined,
        errors: errors.length > 0 ? errors : undefined
      }

    } catch (error) {
      this.logger.error('ITERATIVE_ORCHESTRATOR', 'Generation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      }
    }
  }

  /**
   * Select framework for presentation
   */
  private async selectFramework(request: GenerationRequest): Promise<Framework> {
    try {
      const analysis = await this.frameworkAnalyzer.quickFrameworkCheck(
        request.prompt,
        request.audience || 'General business audience',
        request.presentation_type
      )

      // Parse framework name from analysis
      const frameworkName = this.parseFrameworkFromAnalysis(analysis)
      return getFramework(frameworkName)

    } catch (error) {
      this.logger.warning('ITERATIVE_ORCHESTRATOR', 'Framework analysis failed, using default', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      return getFramework('scqa')
    }
  }

  /**
   * Parse framework from analysis text
   */
  private parseFrameworkFromAnalysis(analysis: string): string {
    const lowercaseAnalysis = analysis.toLowerCase()

    if (lowercaseAnalysis.includes('scqa')) return 'scqa'
    if (lowercaseAnalysis.includes('prep')) return 'prep'
    if (lowercaseAnalysis.includes('star')) return 'star'
    if (lowercaseAnalysis.includes('pyramid')) return 'pyramid'
    if (lowercaseAnalysis.includes('comparison')) return 'comparison'

    return 'scqa'
  }

  /**
   * Create fallback slide when generation fails
   */
  private createFallbackSlide(slideOutline: SlideOutline): Slide {
    return {
      id: `slide-${slideOutline.slideNumber}`,
      type: slideOutline.type as any,
      title: slideOutline.title,
      layout: 'title-content',
      content: {
        mainText: 'This slide requires manual content creation',
        bulletPoints: slideOutline.keyPoints || [],
        callout: 'Generation failed - please add content manually'
      },
      metadata: {
        speaker_notes: slideOutline.purpose || '',
        duration_minutes: 2,
        audience_level: 'general'
      }
    }
  }

  /**
   * Update progress callback
   */
  private updateProgress(progress: IterativeGenerationProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress)
    }

    this.logger.info('PROGRESS', progress.message, {
      phase: progress.phase,
      percent: progress.percentComplete,
      slide: progress.slideNumber
    })
  }
}