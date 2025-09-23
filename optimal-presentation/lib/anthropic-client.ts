/**
 * Utility for creating Anthropic client with corporate network support
 */
import Anthropic from '@anthropic-ai/sdk'
import https from 'https'

/**
 * Create Anthropic client with proper configuration for corporate networks
 */
export function createAnthropicClient(apiKey: string): Anthropic {
  // Create HTTPS agent with disabled certificate verification for corporate networks
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    timeout: 30000,
  })

  return new Anthropic({
    apiKey: apiKey,
    httpAgent: httpsAgent,
    timeout: 30000,
  })
}

/**
 * Get Anthropic client using environment API key
 */
export function getDefaultAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required')
  }
  return createAnthropicClient(process.env.ANTHROPIC_API_KEY)
}