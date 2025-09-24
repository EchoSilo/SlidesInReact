/**
 * Content Regenerator Service
 * Handles LLM-based content regeneration with targeted improvements
 */

import Anthropic from '@anthropic-ai/sdk'
import { PresentationData, SlideData, GenerationRequest } from '@/lib/types'
import { Framework } from './supportedFrameworks'
import {
  FeedbackToPromptConverter,
  ValidationFeedback,
  RefinementPrompt
} from './feedbackToPromptConverter'
import { ValidationIssue, IssueSeverity } from './contentAnalysis'
import { createAnthropicClient } from '@/lib/anthropic-client'

/**
 * Content regeneration configuration
 */
export interface RegenerationConfig {
  model: string
  temperature: number
  maxTokens: number
  preservationThreshold: number // Score above which content is preserved
  maxRetries: number
  mergeStrategy: 'selective' | 'full' | 'incremental'
}

/**
 * Regeneration result
 */
export interface RegenerationResult {
  success: boolean
  presentation?: PresentationData
  changes: ContentChange[]
  preservedSlides: string[]
  modifiedSlides: string[]
  error?: string
  llmCallDuration?: number
}

/**
 * Content change tracking
 */
export interface ContentChange {
  slideId: string
  changeType: 'content' | 'structure' | 'style' | 'framework' | 'data'
  description: string
  beforeSnapshot?: string
  afterSnapshot?: string
  confidence: number
  issuesAddressed: string[]
}

/**
 * Slide preservation info
 */
interface SlidePreservation {
  slideId: string
  preserveCompletely: boolean
  preserveElements: string[]
  modifyElements: string[]
}

/**
 * Main Content Regenerator class
 */
export class ContentRegenerator {
  private anthropic: Anthropic
  private converter: FeedbackToPromptConverter
  private config: RegenerationConfig

  constructor(apiKey: string, config?: Partial<RegenerationConfig>) {
    this.anthropic = createAnthropicClient(apiKey)
    this.converter = new FeedbackToPromptConverter()
    this.config = {
      model: 'claude-3-haiku-20240307',
      temperature: 0.4, // Slightly higher than validation for creativity
      maxTokens: 8192, // More tokens for complete presentation
      preservationThreshold: 85,
      maxRetries: 2,
      mergeStrategy: 'selective',
      ...config
    }
  }

  /**
   * Main regeneration method
   */
  async regenerateContent(
    currentPresentation: PresentationData,
    validationFeedback: ValidationFeedback,
    originalRequest: GenerationRequest,
    framework: Framework,
    round: number
  ): Promise<RegenerationResult> {
    console.log(`🔄 Starting content regeneration - Round ${round}`)
    console.log(`📊 Current score: ${validationFeedback.overallScore}/100`)
    console.log(`🎯 Target score: ${validationFeedback.targetScore}/100`)

    try {
      // Step 1: Determine preservation strategy
      const preservationStrategy = this.determinePreservationStrategy(
        currentPresentation,
        validationFeedback
      )

      // Step 2: Build refinement prompt
      const refinementPrompt = this.converter.convertToPrompt({
        ...validationFeedback,
        framework,
        round,
        currentPresentation,
        preserveSlides: preservationStrategy.map(p => p.slideId)
      })

      // Step 3: Generate targeted improvement prompt
      const llmPrompt = this.buildCompleteLLMPrompt(
        currentPresentation,
        refinementPrompt,
        originalRequest,
        preservationStrategy
      )

      // Step 4: Call LLM for regeneration
      const startTime = Date.now()
      const improvedPresentation = await this.callLLMForRegeneration(llmPrompt)
      const llmCallDuration = Date.now() - startTime

      if (!improvedPresentation) {
        throw new Error('Failed to generate improved presentation')
      }

      // Step 5: Merge improvements with preserved content
      const mergedPresentation = await this.mergeImprovements(
        currentPresentation,
        improvedPresentation,
        preservationStrategy,
        validationFeedback.issues
      )

      // Step 6: Track changes
      const changes = this.detectAndDocumentChanges(
        currentPresentation,
        mergedPresentation,
        validationFeedback.issues
      )

      // Step 7: Validate regenerated content structure
      this.validateRegeneratedContent(mergedPresentation)

      return {
        success: true,
        presentation: mergedPresentation,
        changes,
        preservedSlides: preservationStrategy
          .filter(p => p.preserveCompletely)
          .map(p => p.slideId),
        modifiedSlides: preservationStrategy
          .filter(p => !p.preserveCompletely)
          .map(p => p.slideId),
        llmCallDuration
      }

    } catch (error) {
      console.error('❌ Content regeneration failed:', error)

      return {
        success: false,
        changes: [],
        preservedSlides: [],
        modifiedSlides: [],
        error: error instanceof Error ? error.message : 'Unknown regeneration error'
      }
    }
  }

  /**
   * Determine what content to preserve vs regenerate
   */
  private determinePreservationStrategy(
    presentation: PresentationData,
    feedback: ValidationFeedback
  ): SlidePreservation[] {
    const strategy: SlidePreservation[] = []

    // Map issues to slides
    const issuesBySlide = new Map<string, ValidationIssue[]>()
    feedback.issues.forEach(issue => {
      const slideId = issue.slideId || 'general'
      if (!issuesBySlide.has(slideId)) {
        issuesBySlide.set(slideId, [])
      }
      issuesBySlide.get(slideId)!.push(issue)
    })

    // Analyze each slide
    presentation.slides.forEach(slide => {
      const slideIssues = issuesBySlide.get(slide.id) || []
      const criticalIssues = slideIssues.filter(i => i.severity === IssueSeverity.CRITICAL)
      const importantIssues = slideIssues.filter(i => i.severity === IssueSeverity.IMPORTANT)

      // Determine preservation level
      let preserveCompletely = false
      let preserveElements: string[] = []
      let modifyElements: string[] = []

      if (criticalIssues.length === 0 && importantIssues.length === 0) {
        // No major issues - preserve completely
        preserveCompletely = true
        preserveElements = ['all']
      } else if (criticalIssues.length === 0 && importantIssues.length <= 2) {
        // Minor issues - selective preservation
        preserveElements = this.identifyStrongElements(slide)
        modifyElements = this.identifyWeakElements(slide, slideIssues)
      } else {
        // Major issues - regenerate most content
        preserveElements = ['structure', 'key_metrics'] // Preserve only structure
        modifyElements = ['content', 'messaging', 'data']
      }

      strategy.push({
        slideId: slide.id,
        preserveCompletely,
        preserveElements,
        modifyElements
      })
    })

    return strategy
  }

  /**
   * Identify strong elements in a slide
   */
  private identifyStrongElements(slide: SlideData): string[] {
    const strong: string[] = []

    if (slide.content?.keyMetrics && slide.content.keyMetrics.length > 0) {
      strong.push('metrics')
    }
    if (slide.content?.chart) {
      strong.push('visualization')
    }
    if (slide.content?.sections && slide.content.sections.some(s => s.items && s.items.length > 0)) {
      strong.push('structured_content')
    }
    if (slide.metadata?.speaker_notes) {
      strong.push('speaker_notes')
    }

    return strong.length > 0 ? strong : ['basic_structure']
  }

  /**
   * Identify weak elements that need modification
   */
  private identifyWeakElements(slide: SlideData, issues: ValidationIssue[]): string[] {
    const weak: string[] = []

    issues.forEach(issue => {
      if (issue.type.includes('content')) weak.push('content')
      if (issue.type.includes('data')) weak.push('data_support')
      if (issue.type.includes('clarity')) weak.push('messaging')
      if (issue.type.includes('flow')) weak.push('transitions')
    })

    return [...new Set(weak)] // Remove duplicates
  }

  /**
   * Build complete LLM prompt for regeneration
   */
  private buildCompleteLLMPrompt(
    currentPresentation: PresentationData,
    refinementPrompt: RefinementPrompt,
    originalRequest: GenerationRequest,
    preservationStrategy: SlidePreservation[]
  ): string {
    const promptString = this.converter.generatePromptString(refinementPrompt)

    return `You are improving an existing presentation based on validation feedback.

ORIGINAL REQUEST:
- Topic: ${originalRequest.prompt}
- Type: ${originalRequest.presentation_type}
- Audience: ${originalRequest.audience}
- Tone: ${originalRequest.tone}
- Slide Count: ${originalRequest.slide_count}

CURRENT PRESENTATION TO IMPROVE:
${JSON.stringify(currentPresentation, null, 2)}

PRESERVATION REQUIREMENTS:
${preservationStrategy.map(p =>
  p.preserveCompletely
    ? `- Slide ${p.slideId}: PRESERVE COMPLETELY (high quality)`
    : `- Slide ${p.slideId}: Preserve [${p.preserveElements.join(', ')}], Improve [${p.modifyElements.join(', ')}]`
).join('\n')}

${promptString}

CRITICAL INSTRUCTIONS:
1. Return ONLY the complete improved presentation JSON
2. Maintain the exact same structure and slide count
3. Preserve all specified high-quality content exactly
4. Address ALL critical and important issues identified
5. Ensure ${refinementPrompt.frameworkCompliance.framework.name} framework compliance
6. No markdown, no explanations, just valid JSON

Generate the improved presentation now:`
  }

  /**
   * Call LLM for content regeneration
   */
  private async callLLMForRegeneration(prompt: string): Promise<PresentationData | null> {
    try {
      console.log('🤖 Calling LLM for content regeneration...')
      console.log('📝 Regeneration prompt preview (first 500 chars):', prompt.substring(0, 500) + '...')

      const response = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API')
      }

      // Parse JSON response
      let jsonStr = content.text.trim()

      // Clean up markdown if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
      }

      const presentation = JSON.parse(jsonStr) as PresentationData

      // Validate structure
      if (!presentation.slides || !Array.isArray(presentation.slides)) {
        throw new Error('Invalid presentation structure in LLM response')
      }

      console.log('✅ LLM regeneration successful')
      return presentation

    } catch (error) {
      console.error('LLM regeneration call failed:', error)

      // Retry logic
      if (this.config.maxRetries > 0) {
        console.log('🔄 Retrying LLM call...')
        this.config.maxRetries--
        return this.callLLMForRegeneration(prompt)
      }

      return null
    }
  }

  /**
   * Merge improvements with preserved content
   */
  private async mergeImprovements(
    original: PresentationData,
    improved: PresentationData,
    preservationStrategy: SlidePreservation[],
    issues: ValidationIssue[]
  ): Promise<PresentationData> {
    const merged: PresentationData = {
      ...improved,
      slides: []
    }

    // Merge each slide based on preservation strategy
    for (let i = 0; i < original.slides.length; i++) {
      const originalSlide = original.slides[i]
      const improvedSlide = improved.slides[i]
      const strategy = preservationStrategy.find(p => p.slideId === originalSlide.id)

      if (!improvedSlide) {
        // If improved version missing this slide, keep original
        merged.slides.push(originalSlide)
        continue
      }

      if (strategy?.preserveCompletely) {
        // Keep original slide completely
        merged.slides.push(originalSlide)
      } else if (strategy && this.config.mergeStrategy === 'selective') {
        // Selective merge based on preservation strategy
        merged.slides.push(this.selectiveMergeSlide(
          originalSlide,
          improvedSlide,
          strategy,
          issues.filter(i => i.slideId === originalSlide.id)
        ))
      } else {
        // Use improved slide
        merged.slides.push(improvedSlide)
      }
    }

    // Ensure metadata is updated
    merged.metadata = {
      ...improved.metadata,
      version: this.incrementVersion(original.metadata.version || '1.0'),
      last_refined: new Date().toISOString()
    }

    return merged
  }

  /**
   * Selective merge of slide content
   */
  private selectiveMergeSlide(
    original: SlideData,
    improved: SlideData,
    strategy: SlidePreservation,
    slideIssues: ValidationIssue[]
  ): SlideData {
    const merged: SlideData = {
      ...improved,
      id: original.id, // Always preserve ID
      content: {}
    }

    // Merge content based on preservation strategy
    if (strategy.preserveElements.includes('metrics') && original.content?.keyMetrics) {
      merged.content!.keyMetrics = original.content.keyMetrics
    } else if (improved.content?.keyMetrics) {
      merged.content!.keyMetrics = improved.content.keyMetrics
    }

    if (strategy.preserveElements.includes('visualization') && original.content?.chart) {
      merged.content!.chart = original.content.chart
    } else if (improved.content?.chart) {
      merged.content!.chart = improved.content.chart
    }

    if (strategy.preserveElements.includes('structured_content') && original.content?.sections) {
      merged.content!.sections = original.content.sections
    } else if (improved.content?.sections) {
      merged.content!.sections = improved.content.sections
    }

    // Always take improved content for problem areas
    if (slideIssues.some(i => i.type.includes('content'))) {
      merged.content = {
        ...merged.content,
        ...improved.content,
        // But preserve explicitly marked elements
        ...(strategy.preserveElements.includes('metrics') && original.content?.keyMetrics
          ? { keyMetrics: original.content.keyMetrics }
          : {})
      }
    }

    // Merge other content fields
    merged.content = {
      ...original.content,
      ...improved.content,
      ...merged.content
    }

    // Update metadata
    merged.metadata = {
      ...improved.metadata,
      refined: true,
      refinement_round: strategy.preserveCompletely ? 0 : 1
    }

    return merged
  }

  /**
   * Detect and document changes
   */
  private detectAndDocumentChanges(
    original: PresentationData,
    improved: PresentationData,
    issues: ValidationIssue[]
  ): ContentChange[] {
    const changes: ContentChange[] = []

    for (let i = 0; i < original.slides.length; i++) {
      const originalSlide = original.slides[i]
      const improvedSlide = improved.slides[i]

      if (!improvedSlide) continue

      const slideChanges = this.detectSlideChanges(
        originalSlide,
        improvedSlide,
        issues.filter(i => i.slideId === originalSlide.id)
      )

      changes.push(...slideChanges)
    }

    return changes
  }

  /**
   * Detect changes in a single slide
   */
  private detectSlideChanges(
    original: SlideData,
    improved: SlideData,
    slideIssues: ValidationIssue[]
  ): ContentChange[] {
    const changes: ContentChange[] = []

    // Check title changes
    if (original.title !== improved.title) {
      changes.push({
        slideId: original.id,
        changeType: 'content',
        description: 'Updated slide title for clarity',
        beforeSnapshot: original.title,
        afterSnapshot: improved.title,
        confidence: 100,
        issuesAddressed: slideIssues
          .filter(i => i.type.includes('clarity'))
          .map(i => i.type)
      })
    }

    // Check content changes
    const originalContent = JSON.stringify(original.content || {})
    const improvedContent = JSON.stringify(improved.content || {})

    if (originalContent !== improvedContent) {
      const changeType = this.categorizeContentChange(original.content, improved.content)
      changes.push({
        slideId: original.id,
        changeType,
        description: this.describeContentChange(changeType, slideIssues),
        confidence: 85,
        issuesAddressed: slideIssues.map(i => i.type)
      })
    }

    return changes
  }

  /**
   * Categorize type of content change
   */
  private categorizeContentChange(
    original: any,
    improved: any
  ): 'content' | 'structure' | 'data' | 'framework' {
    if (improved?.keyMetrics && (!original?.keyMetrics ||
        JSON.stringify(original.keyMetrics) !== JSON.stringify(improved.keyMetrics))) {
      return 'data'
    }
    if (improved?.sections && (!original?.sections ||
        original.sections.length !== improved.sections.length)) {
      return 'structure'
    }
    if (improved?.framework || improved?.methodology) {
      return 'framework'
    }
    return 'content'
  }

  /**
   * Describe content change based on type and issues
   */
  private describeContentChange(
    changeType: string,
    issues: ValidationIssue[]
  ): string {
    const descriptions: Record<string, string> = {
      'data': 'Enhanced data support and metrics',
      'structure': 'Restructured content for better flow',
      'framework': 'Aligned content with framework requirements',
      'content': 'Improved content clarity and messaging'
    }

    let description = descriptions[changeType] || 'Updated content'

    // Add issue-specific context
    if (issues.some(i => i.severity === IssueSeverity.CRITICAL)) {
      description += ' (addressed critical issues)'
    } else if (issues.length > 0) {
      description += ` (resolved ${issues.length} issues)`
    }

    return description
  }

  /**
   * Validate regenerated content structure
   */
  private validateRegeneratedContent(presentation: PresentationData): void {
    if (!presentation.slides || presentation.slides.length === 0) {
      throw new Error('Regenerated presentation has no slides')
    }

    presentation.slides.forEach((slide, index) => {
      if (!slide.id) {
        throw new Error(`Slide ${index} missing ID`)
      }
      if (!slide.type) {
        throw new Error(`Slide ${slide.id} missing type`)
      }
      if (!slide.title) {
        throw new Error(`Slide ${slide.id} missing title`)
      }
    })
  }

  /**
   * Increment version number
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.')
    const minor = parseInt(parts[1] || '0', 10)
    return `${parts[0]}.${minor + 1}`
  }

  /**
   * Quick content fix for specific issue
   */
  async quickFix(
    slide: SlideData,
    issue: ValidationIssue,
    framework: Framework
  ): Promise<SlideData> {
    const prompt = `Fix this specific issue in the slide:

Slide: ${JSON.stringify(slide, null, 2)}
Issue: ${issue.description}
Suggested Fix: ${issue.suggestedFix}
Framework: ${framework.name}

Return ONLY the corrected slide JSON.`

    try {
      const response = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: 2048,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        const fixed = JSON.parse(content.text)
        return fixed as SlideData
      }
    } catch (error) {
      console.error('Quick fix failed:', error)
    }

    return slide // Return original if fix fails
  }
}

/**
 * Create content regenerator instance
 */
export function createContentRegenerator(
  apiKey: string,
  config?: Partial<RegenerationConfig>
): ContentRegenerator {
  return new ContentRegenerator(apiKey, config)
}