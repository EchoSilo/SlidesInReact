/**
 * Test script for validation API endpoint
 * Tests the complete validation system integration
 */

import { PresentationData, GenerationRequest } from '../lib/types'

// Test data
const testPresentation: PresentationData = {
  id: 'test-validation-presentation',
  title: 'Digital Transformation Strategy',
  subtitle: 'Driving Innovation and Growth',
  description: 'Strategic presentation on digital transformation initiatives',
  metadata: {
    author: 'Test Author',
    created_at: '2024-01-01T00:00:00Z',
    presentation_type: 'business',
    target_audience: 'executives',
    estimated_duration: 15,
    slide_count: 5,
    tone: 'professional',
    version: '1.0'
  },
  slides: [
    {
      id: 'slide-1',
      type: 'title',
      title: 'Digital Transformation Strategy',
      subtitle: 'Driving Innovation and Growth',
      layout: 'title-only',
      content: {
        mainText: 'Strategic initiative to modernize operations and drive competitive advantage',
        callout: 'Key to future success'
      }
    },
    {
      id: 'slide-2',
      type: 'problem',
      title: 'Current Challenges',
      layout: 'title-content',
      content: {
        sections: [
          {
            title: 'Legacy Systems',
            description: 'Outdated technology limiting growth and efficiency',
            items: ['Manual processes', 'Data silos', 'Security vulnerabilities']
          }
        ],
        keyMetrics: [
          { label: 'Efficiency Loss', value: '30%', description: 'due to manual processes' },
          { label: 'Cost Increase', value: '$2M', description: 'annual maintenance overhead' }
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'solution',
      title: 'Proposed Solution',
      layout: 'two-column',
      content: {
        sections: [
          {
            title: 'Cloud Migration',
            description: 'Move to modern cloud infrastructure',
            items: ['Scalable architecture', 'Enhanced security', 'Cost optimization']
          },
          {
            title: 'Process Automation',
            description: 'Automate key business processes',
            items: ['Workflow optimization', 'Data integration', 'Real-time analytics']
          }
        ],
        keyMetrics: [
          { label: 'Cost Savings', value: '$5M', description: 'annual operational savings' },
          { label: 'Efficiency Gain', value: '50%', description: 'process improvement' }
        ]
      }
    },
    {
      id: 'slide-4',
      type: 'implementation',
      title: 'Implementation Timeline',
      layout: 'three-column',
      content: {
        sections: [
          {
            title: 'Phase 1 (Q1)',
            description: 'Foundation setup',
            items: ['Infrastructure planning', 'Team formation', 'Vendor selection']
          },
          {
            title: 'Phase 2 (Q2-Q3)',
            description: 'Core implementation',
            items: ['System migration', 'Process automation', 'User training']
          },
          {
            title: 'Phase 3 (Q4)',
            description: 'Optimization',
            items: ['Performance tuning', 'User feedback', 'Continuous improvement']
          }
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'conclusion',
      title: 'Next Steps',
      layout: 'centered',
      content: {
        bulletPoints: [
          'Approve budget allocation for digital transformation',
          'Establish project steering committee',
          'Begin vendor evaluation process',
          'Schedule monthly progress reviews'
        ],
        callout: 'Time to act is now for competitive advantage'
      }
    }
  ]
}

const testRequest: GenerationRequest = {
  prompt: 'Create a compelling business case for digital transformation targeting executive decision-makers',
  audience: 'executives',
  presentation_type: 'business',
  tone: 'professional',
  slide_count: 5
}

async function testValidationAPI() {
  console.log('🧪 Testing Validation API')
  console.log('=' .repeat(50))

  try {
    // Test 1: Full Validation Session
    console.log('\n📋 Test 1: Full Validation Session')
    console.log('-'.repeat(30))

    const validationResponse = await fetch('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        presentation: testPresentation,
        originalRequest: testRequest,
        config: {
          maxRefinementRounds: 2,
          targetQualityScore: 85,
          minConfidenceThreshold: 75,
          includeMinorIssues: true
        }
      })
    })

    if (!validationResponse.ok) {
      const errorData = await validationResponse.json()
      console.error('❌ Validation API failed:', errorData)
      return
    }

    const validationData = await validationResponse.json()
    console.log('✅ Validation completed successfully!')
    console.log(`📊 Final Score: ${validationData.data.finalScore}/100`)
    console.log(`🔄 Total Rounds: ${validationData.data.totalRounds}`)
    console.log(`🎯 Target Achieved: ${validationData.data.targetAchieved}`)
    console.log(`⏱️  Processing Time: ${validationData.data.processing.duration}ms`)

    // Show progress updates
    console.log('\n📈 Progress Updates:')
    validationData.data.processing.progressUpdates.forEach((update: any) => {
      console.log(`  Round ${update.round}: ${update.status}`)
    })

    // Show session summary
    console.log('\n📋 Session Summary:')
    console.log(`  Score Improvement: +${validationData.data.sessionSummary.scoreImprovement} points`)
    console.log(`  Critical Issues Resolved: ${validationData.data.sessionSummary.criticalIssuesResolved}`)
    console.log(`  Major Improvements: ${validationData.data.sessionSummary.majorImprovements.join(', ')}`)

    // Show framework analysis
    console.log('\n🏗️  Framework Analysis:')
    console.log(`  Recommended: ${validationData.data.frameworkAnalysis.recommendation.primary_framework.toUpperCase()}`)
    console.log(`  Confidence: ${validationData.data.frameworkAnalysis.recommendation.confidence_score}%`)
    console.log(`  Rationale: ${validationData.data.frameworkAnalysis.recommendation.rationale}`)

    // Show dimension scores
    console.log('\n📏 Final Dimension Scores:')
    const finalAnalysis = validationData.data.roundResults[validationData.data.roundResults.length - 1].analysis
    Object.entries(finalAnalysis.dimensionScores).forEach(([dimension, score]) => {
      console.log(`  ${dimension}: ${score}/100`)
    })

    // Show top issues
    console.log('\n⚠️  Top Issues:')
    finalAnalysis.issues.slice(0, 3).forEach((issue: any) => {
      console.log(`  ${issue.severity.toUpperCase()}: ${issue.title}`)
      console.log(`    Fix: ${issue.suggestedFix}`)
    })

    // Show top recommendations
    console.log('\n💡 Top Recommendations:')
    finalAnalysis.recommendations.slice(0, 3).forEach((rec: any) => {
      console.log(`  ${rec.priority.toUpperCase()}: ${rec.title}`)
      console.log(`    Implementation: ${rec.implementation}`)
    })

    // Test 2: Quick Validation
    console.log('\n📋 Test 2: Quick Validation Check')
    console.log('-'.repeat(30))

    const quickResponse = await fetch(
      'http://localhost:3000/api/validate?type=quick&dimension=executiveReadiness&targetScore=85&presentationId=test-123'
    )

    if (quickResponse.ok) {
      const quickData = await quickResponse.json()
      console.log('✅ Quick validation successful!')
      console.log(`📊 Current Score: ${quickData.data.currentScore}/100`)
      console.log(`🎯 Target Score: ${quickData.data.targetScore}/100`)
      console.log(`📈 Can Reach Target: ${quickData.data.canReachTarget}`)
      console.log('💡 Suggestions:')
      quickData.data.improvementSuggestions.forEach((suggestion: string) => {
        console.log(`  - ${suggestion}`)
      })
    } else {
      console.error('❌ Quick validation failed')
    }

    // Test 3: Configuration Update
    console.log('\n📋 Test 3: Configuration Update')
    console.log('-'.repeat(30))

    const configResponse = await fetch('http://localhost:3000/api/validate/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        maxRefinementRounds: 3,
        targetQualityScore: 90,
        minConfidenceThreshold: 80
      })
    })

    if (configResponse.ok) {
      const configData = await configResponse.json()
      console.log('✅ Configuration updated successfully!')
      console.log(`⚙️  Message: ${configData.data.message}`)
    } else {
      console.error('❌ Configuration update failed')
    }

    console.log('\n🎉 All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Error handling for invalid request
async function testErrorHandling() {
  console.log('\n📋 Test 4: Error Handling')
  console.log('-'.repeat(30))

  try {
    // Test with invalid data
    const invalidResponse = await fetch('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Missing required fields
        presentation: { title: 'Test' },
        originalRequest: {}
      })
    })

    const errorData = await invalidResponse.json()
    console.log('✅ Error handling working correctly!')
    console.log(`📋 Error Type: ${errorData.error}`)
    console.log(`📝 Details: ${errorData.details?.length || 0} validation errors`)

  } catch (error) {
    console.error('❌ Error handling test failed:', error)
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Validation API Tests')
  console.log('Make sure the Next.js server is running on localhost:3000')
  console.log('=' .repeat(60))

  // Check if server is running
  try {
    const healthCheck = await fetch('http://localhost:3000/api/generate')
    if (!healthCheck.ok) {
      console.error('❌ Server not responding. Make sure to run: npm run dev')
      return
    }
  } catch (error) {
    console.error('❌ Cannot connect to server. Make sure to run: npm run dev')
    return
  }

  await testValidationAPI()
  await testErrorHandling()

  console.log('\n🏁 Test suite completed!')
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

export { testValidationAPI, testErrorHandling, runTests }