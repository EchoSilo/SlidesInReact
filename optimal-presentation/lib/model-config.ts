/**
 * Centralized Model Configuration
 * Single source of truth for all AI model settings
 */

export const MODEL_NAME = 'claude-3-haiku-20240307' as const
export const SONNET_4_MODEL = 'claude-sonnet-4-20250514' as const

export const MODEL_MAX_TOKENS = 4096 as const
export const SONNET_4_MAX_TOKENS = 64000 as const

/**
 * Token allocation based on use case
 */
export enum TokenUsage {
  VALIDATION = 8192,          // Content validation with Sonnet 4
  ANALYSIS = 8192,           // Framework analysis with Sonnet 4
  GENERATION = 4096,         // Full content generation with Haiku
  REFINEMENT = 4096,         // Content improvement and refinement with Haiku
  QUICK_FIX = 1024,          // Single slide fixes with Haiku
}

/**
 * Model configuration for different use cases
 */
export interface ModelConfig {
  model: string
  maxTokens: number
  temperature: number
}

/**
 * Get model configuration for specific use case
 */
export function getModelConfig(usage: TokenUsage, temperature: number = 0.3, useSonnet4: boolean = false): ModelConfig {
  const model = useSonnet4 ? SONNET_4_MODEL : MODEL_NAME
  const maxTokens = useSonnet4 ? Math.min(usage, SONNET_4_MAX_TOKENS) : Math.min(usage, MODEL_MAX_TOKENS)

  return {
    model,
    maxTokens,
    temperature
  }
}

/**
 * Common model configurations
 */
export const ModelConfigs = {
  validation: (): ModelConfig => getModelConfig(TokenUsage.VALIDATION, 0.1, true), // Use Sonnet 4 for validation
  analysis: (): ModelConfig => getModelConfig(TokenUsage.ANALYSIS, 0.2, true),     // Use Sonnet 4 for analysis
  generation: (): ModelConfig => getModelConfig(TokenUsage.GENERATION, 0.4),      // Use Haiku for generation
  refinement: (): ModelConfig => getModelConfig(TokenUsage.REFINEMENT, 0.4),      // Use Haiku for refinement
  quickFix: (): ModelConfig => getModelConfig(TokenUsage.QUICK_FIX, 0.3),         // Use Haiku for quick fixes
} as const

/**
 * Validate that token usage doesn't exceed model limits
 */
export function validateTokenUsage(requestedTokens: number): number {
  if (requestedTokens > MODEL_MAX_TOKENS) {
    console.warn(`Requested tokens (${requestedTokens}) exceed model limit (${MODEL_MAX_TOKENS}). Using max limit.`)
    return MODEL_MAX_TOKENS
  }
  return requestedTokens
}