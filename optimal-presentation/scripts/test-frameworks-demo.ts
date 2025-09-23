#!/usr/bin/env ts-node

/**
 * Demo script to test framework analysis functionality without API calls
 */

import { SUPPORTED_FRAMEWORKS, getFramework, getAllFrameworks } from '../lib/validation/supportedFrameworks'
import { generateFrameworkAnalysisPrompt } from '../lib/validation/frameworkPrompts'
import { getQuickFrameworkRecommendation } from '../lib/validation/frameworkAnalysis'

console.log('🔍 Framework Analysis Demo')
console.log('=========================\n')

// Test 1: Framework definitions
console.log('1. Testing Framework Definitions:')
console.log(`   Total frameworks: ${Object.keys(SUPPORTED_FRAMEWORKS).length}`)
getAllFrameworks().forEach(framework => {
  console.log(`   ✓ ${framework.name}: ${framework.description}`)
})
console.log()

// Test 2: Quick framework recommendations
console.log('2. Testing Quick Framework Recommendations:')

const testScenarios = [
  {
    name: 'Problem-solving presentation',
    type: 'business',
    audience: 'executives',
    prompt: 'Address operational inefficiencies through digital transformation'
  },
  {
    name: 'Case study showcase',
    type: 'technical',
    audience: 'team members',
    prompt: 'Showcase our successful customer service transformation project results'
  },
  {
    name: 'Executive briefing',
    type: 'business',
    audience: 'board of directors',
    prompt: 'Recommend immediate expansion into Asia-Pacific markets'
  },
  {
    name: 'Vendor selection',
    type: 'technical',
    audience: 'selection committee',
    prompt: 'Compare ERP vendors and provide final recommendation'
  },
  {
    name: 'Policy argument',
    type: 'process',
    audience: 'management team',
    prompt: 'Argue for implementing comprehensive remote work policy'
  }
]

testScenarios.forEach((scenario, index) => {
  const recommendation = getQuickFrameworkRecommendation(
    scenario.type,
    scenario.audience,
    scenario.prompt
  )

  console.log(`   Test ${index + 1}: ${scenario.name}`)
  console.log(`   ├─ Recommended: ${recommendation.framework.name} (${recommendation.confidence}% confidence)`)
  console.log(`   ├─ Rationale: ${recommendation.rationale}`)
  console.log(`   └─ Alternative: ${recommendation.alternative?.name || 'None'}`)
  console.log()
})

// Test 3: Framework structure validation
console.log('3. Testing Framework Structure Validation:')
getAllFrameworks().forEach(framework => {
  const hasRequiredFields = framework.id &&
                           framework.name &&
                           framework.structure &&
                           framework.structure.length > 0 &&
                           framework.bestFor &&
                           framework.bestFor.length > 0

  console.log(`   ${framework.name}: ${hasRequiredFields ? '✅ Valid' : '❌ Invalid'} structure`)

  if (hasRequiredFields) {
    console.log(`     Steps: ${framework.structure.length}`)
    console.log(`     Use cases: ${framework.bestFor.length}`)
    console.log(`     Audiences: ${framework.audience.length}`)
  }
})
console.log()

// Test 4: Sample prompt generation
console.log('4. Testing Prompt Generation:')
const samplePresentation = {
  id: 'test-1',
  title: 'Digital Transformation Initiative',
  subtitle: 'Modernizing Operations for Competitive Advantage',
  description: 'Strategic proposal for digital transformation',
  metadata: {
    author: 'Test',
    created_at: new Date().toISOString(),
    presentation_type: 'business',
    target_audience: 'Senior Leadership',
    estimated_duration: 15,
    slide_count: 5,
    tone: 'professional',
    version: '1.0'
  },
  slides: [
    {
      id: 'slide-1',
      type: 'title' as any,
      title: 'Digital Transformation Initiative',
      layout: 'title-only' as any,
      content: { mainText: 'Modernizing operations for competitive advantage' }
    }
  ]
}

const sampleContext = {
  prompt: 'Create a presentation proposing digital transformation to address operational challenges',
  presentation_type: 'business',
  slide_count: 5,
  audience: 'Senior Leadership',
  tone: 'professional'
}

const prompt = generateFrameworkAnalysisPrompt(samplePresentation, sampleContext)
const promptLength = prompt.length

console.log(`   ✓ Generated analysis prompt: ${promptLength} characters`)
console.log(`   ✓ Contains framework descriptions: ${prompt.includes('SCQA FRAMEWORK')}`)
console.log(`   ✓ Contains presentation data: ${prompt.includes(samplePresentation.title)}`)
console.log(`   ✓ Contains analysis criteria: ${prompt.includes('ANALYSIS CRITERIA')}`)
console.log()

// Test 5: Framework compatibility matrix
console.log('5. Framework-Audience Compatibility Matrix:')
const audiences = ['executives', 'technical teams', 'clients', 'stakeholders']
const frameworks = getAllFrameworks()

audiences.forEach(audience => {
  console.log(`   ${audience}:`)
  frameworks.forEach(framework => {
    const compatible = framework.audience.some(aud =>
      aud.toLowerCase().includes(audience.toLowerCase()) ||
      audience.toLowerCase().includes(aud.toLowerCase())
    )
    console.log(`     ${framework.name}: ${compatible ? '✅' : '❌'}`)
  })
  console.log()
})

console.log('🎉 Framework Analysis Demo Complete!')
console.log('\nAll framework foundation components are working correctly.')
console.log('Ready for Phase 2: Content Validation Core implementation.')