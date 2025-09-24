/**
 * Centralized Model Configuration
 * Single source of truth for all AI model settings
 */

export const MODEL_NAME = 'claude-3-haiku-20240307' as const

export const MODEL_MAX_TOKENS = 4096 as const

/**
 * Token allocation based on use case
 */
export enum TokenUsage {
  VALIDATION = 512,           // Connection validation, simple checks
  ANALYSIS = 1024,           // Framework analysis, content analysis
  GENERATION = 4096,         // Full content generation
  REFINEMENT = 4096,         // Content improvement and refinement
  QUICK_FIX = 1024,          // Single slide fixes
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
    model: MODEL_NAME,
    maxTokens: usage,
    temperature
  }
}

/**
 * Common model configurations
 */
export const ModelConfigs = {
  validation: (): ModelConfig => getModelConfig(TokenUsage.VALIDATION, 0.1),
  analysis: (): ModelConfig => getModelConfig(TokenUsage.ANALYSIS, 0.3),
  generation: (): ModelConfig => getModelConfig(TokenUsage.GENERATION, 0.4),
  refinement: (): ModelConfig => getModelConfig(TokenUsage.REFINEMENT, 0.4),
  quickFix: (): ModelConfig => getModelConfig(TokenUsage.QUICK_FIX, 0.3),
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