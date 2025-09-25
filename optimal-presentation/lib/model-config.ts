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
  VALIDATION = 16384,         // Content validation with Sonnet 4
  ANALYSIS = 12288,          // Framework analysis with Sonnet 4
  GENERATION = 32768,        // Full content generation with Sonnet 4
  REFINEMENT = 24576,        // Content improvement and refinement with Sonnet 4
  QUICK_FIX = 8192,          // Single slide fixes with Sonnet 4
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
export function getModelConfig(usage: TokenUsage, temperature: number = 0.3): ModelConfig {
  return {
    model: SONNET_4_MODEL,
    maxTokens: Math.min(usage, SONNET_4_MAX_TOKENS),
    temperature
  }
}

/**
 * Common model configurations - All using Sonnet 4
 */
export const ModelConfigs = {
  validation: (): ModelConfig => getModelConfig(TokenUsage.VALIDATION, 0.1),
  analysis: (): ModelConfig => getModelConfig(TokenUsage.ANALYSIS, 0.2),
  generation: (): ModelConfig => getModelConfig(TokenUsage.GENERATION, 0.4),
  refinement: (): ModelConfig => getModelConfig(TokenUsage.REFINEMENT, 0.4),
  quickFix: (): ModelConfig => getModelConfig(TokenUsage.QUICK_FIX, 0.3),
} as const

/**
 * Validate that token usage doesn't exceed model limits
 */
export function validateTokenUsage(requestedTokens: number): number {
  if (requestedTokens > SONNET_4_MAX_TOKENS) {
    console.warn(`Requested tokens (${requestedTokens}) exceed model limit (${SONNET_4_MAX_TOKENS}). Using max limit.`)
    return SONNET_4_MAX_TOKENS
  }
  return requestedTokens
}