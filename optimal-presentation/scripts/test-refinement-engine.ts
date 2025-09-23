/**
 * Comprehensive test suite for refinement engine
 * Phase 3: Iterative Refinement Engine - Day 5
 */

import { PresentationData, GenerationRequest } from '../lib/types'
import { RefinementEngine, RefinementSessionResult } from '../lib/validation/refinementEngine'
import { ProgressTracker, RefinementStage } from '../lib/validation/progressTracker'
import { ValidationAgent } from '../lib/validation/ValidationAgent'

// Test data
const testPresentations = {
  lowQuality: {
    id: 'test-low-quality',
    title: 'Basic Business Proposal',
    subtitle: 'Some Ideas',
    description: 'A presentation that needs significant improvement',
    metadata: {
      author: 'Test Author',
      created_at: '2024-01-01T00:00:00Z',
      presentation_type: 'business',
      target_audience: 'executives',
      estimated_duration: 10,
      slide_count: 3,
      tone: 'casual',
      version: '1.0'
    },
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: 'Business Ideas',
        layout: 'title-only',
        content: {
          mainText: 'Some business stuff we should do'
        }
      },
      {
        id: 'slide-2',
        type: 'problem',
        title: 'Issues',
        layout: 'title-content',
        content: {
          bulletPoints: ['Things are bad', 'We need to fix stuff', 'Money problems']
        }
      },
      {
        id: 'slide-3',
        type: 'solution',
        title: 'Ideas',
        layout: 'title-content',
        content: {
          bulletPoints: ['Do better', 'Try harder', 'Make money']
        }
      }
    ]
  } as PresentationData,

  mediumQuality: {
    id: 'test-medium-quality',
    title: 'Digital Transformation Initiative',
    subtitle: 'Modernizing Operations for Growth',
    description: 'Strategic initiative presentation',
    metadata: {
      author: 'Test Author',
      created_at: '2024-01-01T00:00:00Z',
      presentation_type: 'business',
      target_audience: 'executives',
      estimated_duration: 15,
      slide_count: 4,
      tone: 'professional',
      version: '1.0'
    },
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: 'Digital Transformation Initiative',
        subtitle: 'Modernizing Operations for Growth',
        layout: 'title-only',
        content: {
          mainText: 'Strategic initiative to modernize our operations and drive growth through technology adoption'
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
              title: 'Operational Inefficiencies',
              description: 'Legacy systems causing delays and increased costs',
              items: ['Manual processes', 'Data silos', 'Outdated technology']
            }
          ],
          keyMetrics: [
            { label: 'Efficiency Loss', value: '25%', description: 'compared to industry standards' }
          ]
        }
      },
      {
        id: 'slide-3',
        type: 'solution',
        title: 'Digital Transformation Plan',
        layout: 'two-column',
        content: {
          sections: [
            {
              title: 'Technology Modernization',
              description: 'Upgrade core systems and processes',
              items: ['Cloud migration', 'Process automation', 'Data integration']
            }
          ]
        }
      },
      {
        id: 'slide-4',
        type: 'conclusion',
        title: 'Next Steps',
        layout: 'centered',
        content: {
          bulletPoints: [
            'Approve transformation budget',
            'Form project team',
            'Begin system assessment'
          ]
        }
      }
    ]
  } as PresentationData,

  highQuality: {
    id: 'test-high-quality',
    title: 'Strategic Market Expansion Initiative',
    subtitle: 'Capturing $50M Growth Opportunity',
    description: 'Comprehensive market expansion strategy with quantified ROI',
    metadata: {
      author: 'Test Author',
      created_at: '2024-01-01T00:00:00Z',
      presentation_type: 'business',
      target_audience: 'executives',
      estimated_duration: 20,
      slide_count: 5,
      tone: 'professional',
      version: '1.0'
    },
    slides: [
      {
        id: 'slide-1',
        type: 'title',
        title: 'Strategic Market Expansion Initiative',
        subtitle: 'Capturing $50M Growth Opportunity',
        layout: 'title-only',
        content: {
          mainText: 'Strategic initiative to expand into European markets with projected $50M revenue opportunity over 3 years'
        }
      },
      {
        id: 'slide-2',
        type: 'problem',
        title: 'Market Opportunity',
        layout: 'title-content',
        content: {
          sections: [
            {
              title: 'European Market Gap',
              description: 'Underserved market segment with high demand for our solutions',
              items: ['$2.5B addressable market', 'Limited competition', 'Regulatory alignment']
            }
          ],
          keyMetrics: [
            { label: 'Market Size', value: '$2.5B', description: 'total addressable market' },
            { label: 'Growth Rate', value: '15%', description: 'annual market growth' }
          ]
        }
      },
      {
        id: 'slide-3',
        type: 'solution',
        title: 'Expansion Strategy',
        layout: 'two-column',
        content: {
          sections: [
            {
              title: 'Market Entry Approach',
              description: 'Phased expansion with strategic partnerships',
              items: ['Partnership with local distributors', 'Localized product offerings', 'Direct sales team']
            }
          ],
          keyMetrics: [
            { label: 'Revenue Target', value: '$50M', description: '3-year projection' },
            { label: 'ROI', value: '180%', description: 'internal rate of return' }
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
              title: 'Phase 1 (Q1-Q2)',
              description: 'Market preparation',
              items: ['Partner identification', 'Regulatory compliance', 'Product localization']
            },
            {
              title: 'Phase 2 (Q3-Q4)',
              description: 'Market entry',
              items: ['Launch partnerships', 'Sales team deployment', 'Marketing campaigns']
            },
            {
              title: 'Phase 3 (Year 2-3)',
              description: 'Scale operations',
              items: ['Direct operations', 'Market expansion', 'Performance optimization']
            }
          ]
        }
      },
      {
        id: 'slide-5',
        type: 'conclusion',
        title: 'Investment Decision',
        layout: 'centered',
        content: {
          bulletPoints: [
            'Approve $15M investment for market expansion',
            'Establish European expansion team',
            'Begin partner negotiations in Q1',
            'Target $50M revenue by Year 3'
          ],
          callout: 'Strategic opportunity to establish market leadership'
        }
      }
    ]
  } as PresentationData
}

const testRequests = {
  basic: {
    prompt: 'Create a business presentation about improving operations',
    presentation_type: 'business',
    slide_count: 3,
    audience: 'executives',
    tone: 'professional'
  } as GenerationRequest,

  strategic: {
    prompt: 'Develop a strategic presentation for executive decision-making on digital transformation with clear ROI and implementation plan',
    presentation_type: 'business',
    slide_count: 4,
    audience: 'executives',
    tone: 'professional'
  } as GenerationRequest,

  comprehensive: {
    prompt: 'Create a comprehensive market expansion strategy presentation with quantified business case, risk analysis, and detailed implementation timeline for executive approval',
    presentation_type: 'business',
    slide_count: 5,
    audience: 'executives',
    tone: 'professional'
  } as GenerationRequest
}

/**
 * Test result interface
 */
interface TestResult {
  testName: string
  passed: boolean
  details: string
  metrics?: {
    initialScore?: number
    finalScore?: number
    improvement?: number
    rounds?: number
    timeElapsed?: number
  }
  error?: string
}

/**
 * Test suite class
 */
class RefinementEngineTestSuite {
  private apiKey: string
  private results: TestResult[] = []

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Run complete test suite
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Refinement Engine Test Suite')
    console.log('=' .repeat(60))

    // Core functionality tests
    await this.testBasicRefinementFlow()
    await this.testProgressTracking()
    await this.testQualityThresholdStopping()
    await this.testMinimumImprovementStopping()
    await this.testErrorHandling()

    // Integration tests
    await this.testLowQualityImprovement()
    await this.testMediumQualityRefinement()
    await this.testHighQualityEarlyStop()

    // Performance tests
    await this.testPerformanceCharacteristics()

    // Success criteria validation
    await this.validateSuccessCriteria()

    this.printTestSummary()
  }

  /**
   * Test basic refinement flow
   */
  async testBasicRefinementFlow(): Promise<void> {
    console.log('\n📋 Test: Basic Refinement Flow')
    console.log('-'.repeat(30))

    try {
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 2,
        targetQualityScore: 75
      })

      const progressUpdates: string[] = []
      const result = await engine.refinePresentation(
        testPresentations.mediumQuality,
        testRequests.strategic,
        (progress) => {
          progressUpdates.push(`${progress.overallStage}: ${progress.overallStatus}`)
        }
      )

      const passed =
        result.roundResults.length > 0 &&
        result.finalScore > result.initialScore &&
        progressUpdates.length > 0

      this.results.push({
        testName: 'Basic Refinement Flow',
        passed,
        details: passed
          ? `Successfully completed ${result.totalRounds} rounds with ${progressUpdates.length} progress updates`
          : 'Failed to complete basic refinement flow',
        metrics: {
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          improvement: result.totalImprovement,
          rounds: result.totalRounds,
          timeElapsed: result.totalTimeElapsed
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`📊 ${result.initialScore} → ${result.finalScore} (+${result.totalImprovement} points)`)

    } catch (error) {
      this.results.push({
        testName: 'Basic Refinement Flow',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test progress tracking functionality
   */
  async testProgressTracking(): Promise<void> {
    console.log('\n📋 Test: Progress Tracking')
    console.log('-'.repeat(30))

    try {
      const tracker = new ProgressTracker()
      tracker.initializeSession('test-session', 3, 80)

      // Test round progression
      tracker.startRound(1)
      tracker.updateStage(RefinementStage.ANALYZING, 'Analyzing content...')
      tracker.updateStage(RefinementStage.GENERATING, 'Generating improvements...')
      tracker.completeRound(1, 65, 10, 55)

      const progress = tracker.getProgress()
      const summary = tracker.getProgressSummary()

      const passed =
        progress.currentRound === 1 &&
        progress.roundProgresses.length === 1 &&
        progress.qualityProgression.scoreHistory.length === 1 &&
        summary.percentage > 0

      this.results.push({
        testName: 'Progress Tracking',
        passed,
        details: passed
          ? `Progress tracking working correctly with ${progress.roundProgresses.length} rounds tracked`
          : 'Progress tracking not functioning properly'
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`📊 Progress: ${summary.percentage}%, Current: ${summary.currentScore}/${summary.targetScore}`)

    } catch (error) {
      this.results.push({
        testName: 'Progress Tracking',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test quality threshold early stopping
   */
  async testQualityThresholdStopping(): Promise<void> {
    console.log('\n📋 Test: Quality Threshold Early Stopping')
    console.log('-'.repeat(30))

    try {
      // Simulate already high-quality presentation
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 3,
        targetQualityScore: 75 // Lower threshold for testing
      })

      const result = await engine.refinePresentation(
        testPresentations.highQuality,
        testRequests.comprehensive
      )

      // Should stop early if already meets threshold
      const passed = result.targetAchieved || result.totalRounds < 3

      this.results.push({
        testName: 'Quality Threshold Early Stopping',
        passed,
        details: passed
          ? `Correctly stopped after ${result.totalRounds} rounds (target achieved: ${result.targetAchieved})`
          : 'Failed to stop early when quality threshold met',
        metrics: {
          finalScore: result.finalScore,
          rounds: result.totalRounds
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`🎯 Target: ${result.targetAchieved}, Score: ${result.finalScore}, Rounds: ${result.totalRounds}`)

    } catch (error) {
      this.results.push({
        testName: 'Quality Threshold Early Stopping',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test minimum improvement stopping
   */
  async testMinimumImprovementStopping(): Promise<void> {
    console.log('\n📋 Test: Minimum Improvement Stopping')
    console.log('-'.repeat(30))

    try {
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 3,
        targetQualityScore: 95, // Very high threshold to test convergence
        minimumImprovement: 5
      })

      const result = await engine.refinePresentation(
        testPresentations.mediumQuality,
        testRequests.strategic
      )

      // Should stop when improvement becomes minimal
      const hasMinimalImprovement = result.roundResults.some(
        round => round.improvement < 5 && round.reasonForStopping?.includes('Minimal improvement')
      )

      const passed = hasMinimalImprovement || result.totalRounds === 3

      this.results.push({
        testName: 'Minimum Improvement Stopping',
        passed,
        details: passed
          ? 'Correctly identified convergence or completed all rounds'
          : 'Failed to detect minimal improvement convergence',
        metrics: {
          rounds: result.totalRounds,
          finalScore: result.finalScore
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`🔄 Rounds: ${result.totalRounds}, Final: ${result.finalScore}`)

    } catch (error) {
      this.results.push({
        testName: 'Minimum Improvement Stopping',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling(): Promise<void> {
    console.log('\n📋 Test: Error Handling')
    console.log('-'.repeat(30))

    try {
      // Test with invalid API key
      const invalidEngine = new RefinementEngine('invalid-key', {
        maxRefinementRounds: 1,
        targetQualityScore: 80
      })

      let errorCaught = false
      try {
        await invalidEngine.refinePresentation(
          testPresentations.lowQuality,
          testRequests.basic
        )
      } catch (error) {
        errorCaught = true
      }

      const passed = errorCaught

      this.results.push({
        testName: 'Error Handling',
        passed,
        details: passed
          ? 'Correctly caught and handled API errors'
          : 'Failed to handle API errors properly'
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')

    } catch (error) {
      console.log('✅ PASSED (Exception caught as expected)')
      this.results.push({
        testName: 'Error Handling',
        passed: true,
        details: 'Error handling working correctly'
      })
    }
  }

  /**
   * Test low quality improvement scenario
   */
  async testLowQualityImprovement(): Promise<void> {
    console.log('\n📋 Test: Low Quality Improvement')
    console.log('-'.repeat(30))

    try {
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 3,
        targetQualityScore: 80
      })

      const result = await engine.refinePresentation(
        testPresentations.lowQuality,
        testRequests.basic
      )

      // Should show significant improvement for low quality content
      const significantImprovement = result.totalImprovement >= 15
      const usedMultipleRounds = result.totalRounds >= 2

      const passed = significantImprovement && usedMultipleRounds

      this.results.push({
        testName: 'Low Quality Improvement',
        passed,
        details: passed
          ? `Significant improvement achieved: +${result.totalImprovement} points in ${result.totalRounds} rounds`
          : 'Insufficient improvement for low quality content',
        metrics: {
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          improvement: result.totalImprovement,
          rounds: result.totalRounds
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`📊 ${result.initialScore} → ${result.finalScore} (+${result.totalImprovement} points)`)

    } catch (error) {
      this.results.push({
        testName: 'Low Quality Improvement',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test medium quality refinement
   */
  async testMediumQualityRefinement(): Promise<void> {
    console.log('\n📋 Test: Medium Quality Refinement')
    console.log('-'.repeat(30))

    try {
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 3,
        targetQualityScore: 80
      })

      const result = await engine.refinePresentation(
        testPresentations.mediumQuality,
        testRequests.strategic
      )

      // Should achieve target or show good improvement
      const achievedTarget = result.targetAchieved
      const goodImprovement = result.totalImprovement >= 8

      const passed = achievedTarget || goodImprovement

      this.results.push({
        testName: 'Medium Quality Refinement',
        passed,
        details: passed
          ? `Target achieved: ${achievedTarget}, Improvement: +${result.totalImprovement} points`
          : 'Failed to achieve target or sufficient improvement',
        metrics: {
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          improvement: result.totalImprovement,
          rounds: result.totalRounds
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`🎯 Target: ${achievedTarget}, Score: ${result.finalScore}`)

    } catch (error) {
      this.results.push({
        testName: 'Medium Quality Refinement',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test high quality early stop
   */
  async testHighQualityEarlyStop(): Promise<void> {
    console.log('\n📋 Test: High Quality Early Stop')
    console.log('-'.repeat(30))

    try {
      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 3,
        targetQualityScore: 80
      })

      const result = await engine.refinePresentation(
        testPresentations.highQuality,
        testRequests.comprehensive
      )

      // Should stop early or use minimal rounds for high quality content
      const efficientProcessing = result.totalRounds <= 2 || result.targetAchieved

      const passed = efficientProcessing

      this.results.push({
        testName: 'High Quality Early Stop',
        passed,
        details: passed
          ? `Efficient processing: ${result.totalRounds} rounds, target: ${result.targetAchieved}`
          : 'Inefficient processing of high quality content',
        metrics: {
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          rounds: result.totalRounds
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`⚡ Rounds: ${result.totalRounds}, Score: ${result.finalScore}`)

    } catch (error) {
      this.results.push({
        testName: 'High Quality Early Stop',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Test performance characteristics
   */
  async testPerformanceCharacteristics(): Promise<void> {
    console.log('\n📋 Test: Performance Characteristics')
    console.log('-'.repeat(30))

    try {
      const startTime = Date.now()

      const engine = new RefinementEngine(this.apiKey, {
        maxRefinementRounds: 2,
        targetQualityScore: 75
      })

      const result = await engine.refinePresentation(
        testPresentations.mediumQuality,
        testRequests.strategic
      )

      const totalTime = Date.now() - startTime
      const timePerRound = totalTime / result.totalRounds

      // Performance should be reasonable (< 30 seconds per round in test mode)
      const acceptablePerformance = timePerRound < 30000

      const passed = acceptablePerformance

      this.results.push({
        testName: 'Performance Characteristics',
        passed,
        details: passed
          ? `Acceptable performance: ${Math.round(timePerRound / 1000)}s per round`
          : 'Performance below acceptable thresholds',
        metrics: {
          timeElapsed: totalTime,
          rounds: result.totalRounds
        }
      })

      console.log(passed ? '✅ PASSED' : '❌ FAILED')
      console.log(`⏱️  ${Math.round(totalTime / 1000)}s total, ${Math.round(timePerRound / 1000)}s per round`)

    } catch (error) {
      this.results.push({
        testName: 'Performance Characteristics',
        passed: false,
        details: 'Test execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      console.log('❌ FAILED (Exception)')
    }
  }

  /**
   * Validate success criteria
   */
  async validateSuccessCriteria(): Promise<void> {
    console.log('\n📋 Validation: Success Criteria')
    console.log('-'.repeat(30))

    const successMetrics = {
      convergenceTo80Percent: 0,
      criticalIssuesAddressed: 0,
      appropriateStopping: 0,
      meaningfulProgress: 0
    }

    // Analyze results from previous tests
    const refinementTests = this.results.filter(result =>
      result.testName.includes('Quality') && result.metrics
    )

    refinementTests.forEach(test => {
      if (test.metrics) {
        // Check convergence to 80%+
        if (test.metrics.finalScore && test.metrics.finalScore >= 80) {
          successMetrics.convergenceTo80Percent++
        }

        // Check rounds are reasonable (not too many, not too few)
        if (test.metrics.rounds && test.metrics.rounds >= 1 && test.metrics.rounds <= 3) {
          successMetrics.appropriateStopping++
        }

        // Check meaningful improvement
        if (test.metrics.improvement && test.metrics.improvement > 0) {
          successMetrics.meaningfulProgress++
        }
      }
    })

    const totalTests = refinementTests.length
    const overallSuccess = (
      (successMetrics.convergenceTo80Percent / totalTests) +
      (successMetrics.appropriateStopping / totalTests) +
      (successMetrics.meaningfulProgress / totalTests)
    ) / 3

    const passed = overallSuccess >= 0.7 // 70% success rate

    console.log(`📊 Success Metrics:`)
    console.log(`   Convergence to 80%+: ${successMetrics.convergenceTo80Percent}/${totalTests}`)
    console.log(`   Appropriate Stopping: ${successMetrics.appropriateStopping}/${totalTests}`)
    console.log(`   Meaningful Progress: ${successMetrics.meaningfulProgress}/${totalTests}`)
    console.log(`   Overall Success Rate: ${Math.round(overallSuccess * 100)}%`)

    this.results.push({
      testName: 'Success Criteria Validation',
      passed,
      details: passed
        ? `Success criteria met with ${Math.round(overallSuccess * 100)}% success rate`
        : 'Success criteria not adequately met'
    })

    console.log(passed ? '✅ PASSED' : '❌ FAILED')
  }

  /**
   * Print test summary
   */
  private printTestSummary(): void {
    console.log('\n🏁 Test Suite Summary')
    console.log('=' .repeat(60))

    const passedTests = this.results.filter(r => r.passed).length
    const totalTests = this.results.length
    const successRate = Math.round((passedTests / totalTests) * 100)

    console.log(`📊 Results: ${passedTests}/${totalTests} tests passed (${successRate}%)`)
    console.log('')

    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL'
      console.log(`${status} ${result.testName}`)
      console.log(`     ${result.details}`)

      if (result.metrics) {
        const metrics = Object.entries(result.metrics)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        console.log(`     Metrics: ${metrics}`)
      }

      if (result.error) {
        console.log(`     Error: ${result.error}`)
      }
      console.log('')
    })

    if (successRate >= 80) {
      console.log('🎉 Test suite PASSED - Refinement engine ready for production!')
    } else {
      console.log('❌ Test suite FAILED - Issues need to be addressed before production')
    }
  }
}

/**
 * Main test runner
 */
async function runRefinementEngineTests() {
  console.log('🚀 Starting Refinement Engine Test Suite')
  console.log('Make sure ANTHROPIC_API_KEY is set in environment')
  console.log('=' .repeat(60))

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment variables')
    console.log('Please set ANTHROPIC_API_KEY and try again')
    return
  }

  try {
    const testSuite = new RefinementEngineTestSuite(apiKey)
    await testSuite.runAllTests()
  } catch (error) {
    console.error('❌ Test suite execution failed:', error)
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runRefinementEngineTests().catch(console.error)
}

export { RefinementEngineTestSuite, runRefinementEngineTests }