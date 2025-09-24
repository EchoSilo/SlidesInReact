/**
 * Types for Outline Generation
 * Used for the iterative presentation generation approach
 */

/**
 * Individual slide outline entry
 */
export interface SlideOutline {
  slideNumber: number
  type: 'title' | 'problem' | 'solution' | 'benefits' | 'implementation' |
        'framework' | 'timeline' | 'conclusion' | 'chart' | 'table' |
        'circle' | 'diamond' | 'agenda' | 'custom'
  title: string
  purpose: string
  keyPoints?: string[]
  estimatedTokens?: number
  frameworkAlignment?: string // How this slide fits the chosen framework
}

/**
 * Complete presentation outline
 */
export interface PresentationOutline {
  id: string
  title: string
  subtitle: string
  description: string
  metadata: {
    author: string
    created_at: string
    presentation_type: string
    target_audience: string
    estimated_duration: number
    slide_count: number
    tone: string
    framework: string
    version: string
  }
  slides: SlideOutline[]
  frameworkStructure?: {
    framework: string
    flowDescription: string
    narrativeArc: string
  }
  estimatedTotalTokens?: number
}

/**
 * Request for outline generation
 */
export interface OutlineGenerationRequest {
  prompt: string
  presentation_type: string
  slide_count: string
  audience?: string
  tone?: string
  framework?: string
  apiKey?: string
}

/**
 * Response from outline generation
 */
export interface OutlineGenerationResponse {
  success: boolean
  outline?: PresentationOutline
  validationScore?: number
  validationFeedback?: OutlineValidationFeedback
  error?: string
  generation_id: string
  processingTime?: number
}

/**
 * Validation feedback for outline
 */
export interface OutlineValidationFeedback {
  overallScore: number
  frameworkAlignment: {
    score: number
    feedback: string
  }
  logicalFlow: {
    score: number
    feedback: string
    suggestions?: string[]
  }
  audienceSuitability: {
    score: number
    feedback: string
  }
  completeness: {
    score: number
    missingElements?: string[]
  }
  recommendations?: string[]
}

/**
 * Outline validation configuration
 */
export interface OutlineValidationConfig {
  minScore?: number
  requireFrameworkAlignment?: boolean
  checkLogicalFlow?: boolean
  checkAudienceSuitability?: boolean
  checkCompleteness?: boolean
}