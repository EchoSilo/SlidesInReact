#!/usr/bin/env ts-node

/**
 * CLI script to test framework analysis functionality
 * Usage: npx ts-node scripts/test-frameworks.ts [--api-key=YOUR_KEY]
 */

import * as dotenv from 'dotenv'
import { runFrameworkTests } from '../lib/validation/frameworkTester'

// Load environment variables
dotenv.config()

async function main() {
  console.log('🔍 Framework Analysis Testing Tool')
  console.log('==================================\n')

  // Get API key from command line or environment
  const args = process.argv.slice(2)
  const apiKeyArg = args.find(arg => arg.startsWith('--api-key='))
  const apiKey = apiKeyArg
    ? apiKeyArg.split('=')[1]
    : process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('❌ Error: Anthropic API key is required')
    console.error('')
    console.error('Usage:')
    console.error('  npx ts-node scripts/test-frameworks.ts --api-key=YOUR_KEY')
    console.error('  OR set ANTHROPIC_API_KEY environment variable')
    process.exit(1)
  }

  try {
    console.log('Starting framework analysis tests...\n')
    await runFrameworkTests(apiKey)
    console.log('✅ Framework testing completed successfully!')

  } catch (error) {
    console.error('❌ Framework testing failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}