/**
 * CLI testing tool for framework analysis validation
 */

import { FrameworkAnalyzer, FrameworkAnalysisResult } from './frameworkAnalysis'
import { PresentationData, GenerationRequest } from '@/lib/types'
import { SUPPORTED_FRAMEWORKS } from './supportedFrameworks'

/**
 * Test case interface
 */
interface TestCase {
  name: string
  description: string
  presentation: PresentationData
  context: GenerationRequest
  expectedFramework: string
  expectedConfidence: number
}

/**
 * Test result interface
 */
interface TestResult {
  testCase: TestCase
  result: FrameworkAnalysisResult
  success: boolean
  details: {
    frameworkMatch: boolean
    confidenceInRange: boolean
    hasRationale: boolean
    validAnalysis: boolean
  }
}

/**
 * Framework testing class
 */
export class FrameworkTester {
  private analyzer: FrameworkAnalyzer

  constructor(apiKey: string) {
    this.analyzer = new FrameworkAnalyzer(apiKey)
  }

  /**
   * Run all test cases
   */
  async runAllTests(): Promise<TestResult[]> {
    const testCases = this.generateTestCases()
    const results: TestResult[] = []

    console.log(`Running ${testCases.length} framework analysis test cases...\n`)

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      console.log(`Running test ${i + 1}/${testCases.length}: ${testCase.name}`)

      try {
        const result = await this.analyzer.analyzeFramework(testCase.presentation, testCase.context)
        const testResult = this.evaluateTestResult(testCase, result)
        results.push(testResult)

        console.log(`  Result: ${testResult.success ? '✅ PASS' : '❌ FAIL'}`)
        if (!testResult.success) {
          console.log(`  Expected: ${testCase.expectedFramework}, Got: ${result.recommendation.primary_framework}`)
        }
        console.log()

      } catch (error) {
        console.log(`  Result: ❌ ERROR - ${error}`)
        results.push({
          testCase,
          result: {} as FrameworkAnalysisResult,
          success: false,
          details: {
            frameworkMatch: false,
            confidenceInRange: false,
            hasRationale: false,
            validAnalysis: false
          }
        })
        console.log()
      }
    }

    this.printTestSummary(results)
    return results
  }

  /**
   * Generate test cases for framework validation
   */
  private generateTestCases(): TestCase[] {
    return [
      {
        name: 'Problem-Solving Presentation',
        description: 'Strategic initiative addressing operational inefficiencies',
        presentation: {
          id: 'test-1',
          title: 'Digital Transformation Initiative',
          subtitle: 'Modernizing Our Operations for Competitive Advantage',
          description: 'Proposal to address current operational challenges through digital transformation',
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
              type: 'title',
              title: 'Digital Transformation Initiative',
              layout: 'title-only',
              content: { mainText: 'Modernizing operations for competitive advantage' }
            },
            {
              id: 'slide-2',
              type: 'problem',
              title: 'Current Operational Challenges',
              layout: 'title-content',
              content: {
                sections: [
                  {
                    title: 'Manual Processes',
                    description: 'Heavy reliance on manual processes causing delays',
                    items: ['High error rates', 'Slow processing times', 'Resource intensive']
                  }
                ]
              }
            },
            {
              id: 'slide-3',
              type: 'solution',
              title: 'Digital Transformation Strategy',
              layout: 'two-column',
              content: {
                sections: [
                  {
                    title: 'Automation Platform',
                    description: 'Implement comprehensive automation solution',
                    items: ['Process automation', 'Digital workflows', 'Real-time monitoring']
                  }
                ]
              }
            }
          ]
        },
        context: {
          prompt: 'Create a presentation proposing digital transformation to address operational inefficiencies and improve competitive positioning',
          presentation_type: 'business',
          slide_count: 5,
          audience: 'Senior Leadership',
          tone: 'professional'
        },
        expectedFramework: 'scqa',
        expectedConfidence: 80
      },
      {
        name: 'Case Study Presentation',
        description: 'Showcasing successful project implementation and results',
        presentation: {
          id: 'test-2',
          title: 'Customer Service Transformation Success',
          subtitle: 'How We Achieved 40% Improvement in Customer Satisfaction',
          description: 'Case study of successful customer service transformation project',
          metadata: {
            author: 'Test',
            created_at: new Date().toISOString(),
            presentation_type: 'technical',
            target_audience: 'Project Teams',
            estimated_duration: 12,
            slide_count: 4,
            tone: 'professional',
            version: '1.0'
          },
          slides: [
            {
              id: 'slide-1',
              type: 'title',
              title: 'Customer Service Transformation Success',
              layout: 'title-only',
              content: { mainText: '40% improvement in customer satisfaction achieved' }
            },
            {
              id: 'slide-2',
              type: 'problem',
              title: 'Initial Challenge',
              layout: 'title-content',
              content: {
                sections: [
                  {
                    title: 'Service Quality Issues',
                    description: 'Customer satisfaction at historic lows',
                    items: ['Long wait times', 'Inconsistent service', 'Poor first-call resolution']
                  }
                ]
              }
            },
            {
              id: 'slide-3',
              type: 'implementation',
              title: 'Our Approach',
              layout: 'three-column',
              content: {
                sections: [
                  {
                    title: 'Training Program',
                    description: 'Comprehensive agent training initiative',
                    items: ['Product knowledge', 'Soft skills', 'Problem resolution']
                  }
                ]
              }
            },
            {
              id: 'slide-4',
              type: 'benefits',
              title: 'Results Achieved',
              layout: 'metrics',
              content: {
                keyMetrics: [
                  { label: 'Customer Satisfaction', value: '+40%', description: 'Significant improvement' },
                  { label: 'First Call Resolution', value: '+65%', description: 'Much better efficiency' }
                ]
              }
            }
          ]
        },
        context: {
          prompt: 'Create a case study presentation showcasing our successful customer service transformation project and the impressive results achieved',
          presentation_type: 'technical',
          slide_count: 4,
          audience: 'Project Teams',
          tone: 'professional'
        },
        expectedFramework: 'star',
        expectedConfidence: 85
      },
      {
        name: 'Executive Briefing',
        description: 'High-level strategic recommendation for board',
        presentation: {
          id: 'test-3',
          title: 'Market Expansion Recommendation',
          subtitle: 'Strategic Growth Opportunity in Asia-Pacific',
          description: 'Executive briefing on recommended market expansion strategy',
          metadata: {
            author: 'Test',
            created_at: new Date().toISOString(),
            presentation_type: 'business',
            target_audience: 'Board of Directors',
            estimated_duration: 10,
            slide_count: 4,
            tone: 'executive',
            version: '1.0'
          },
          slides: [
            {
              id: 'slide-1',
              type: 'title',
              title: 'Market Expansion Recommendation',
              layout: 'title-only',
              content: { mainText: 'Immediate expansion into Asia-Pacific markets recommended' }
            },
            {
              id: 'slide-2',
              type: 'solution',
              title: 'Key Strategic Arguments',
              layout: 'two-column',
              content: {
                sections: [
                  {
                    title: 'Market Opportunity',
                    description: '$2.4B addressable market with 15% growth rate',
                    items: ['High demand', 'Limited competition', 'Strong margins']
                  },
                  {
                    title: 'Competitive Advantage',
                    description: 'Our unique positioning provides significant advantage',
                    items: ['Technology leadership', 'Brand recognition', 'Partner network']
                  }
                ]
              }
            }
          ]
        },
        context: {
          prompt: 'Create an executive briefing recommending immediate expansion into Asia-Pacific markets with compelling business case',
          presentation_type: 'business',
          slide_count: 4,
          audience: 'Board of Directors',
          tone: 'executive'
        },
        expectedFramework: 'pyramid',
        expectedConfidence: 85
      },
      {
        name: 'Vendor Selection',
        description: 'Comparison and recommendation for ERP system selection',
        presentation: {
          id: 'test-4',
          title: 'ERP System Selection Recommendation',
          subtitle: 'Comprehensive Vendor Evaluation and Final Recommendation',
          description: 'Detailed comparison of ERP vendors with final recommendation',
          metadata: {
            author: 'Test',
            created_at: new Date().toISOString(),
            presentation_type: 'technical',
            target_audience: 'Selection Committee',
            estimated_duration: 20,
            slide_count: 6,
            tone: 'professional',
            version: '1.0'
          },
          slides: [
            {
              id: 'slide-1',
              type: 'title',
              title: 'ERP System Selection Recommendation',
              layout: 'title-only',
              content: { mainText: 'Comprehensive vendor evaluation and final recommendation' }
            },
            {
              id: 'slide-2',
              type: 'agenda',
              title: 'Vendor Options',
              layout: 'bullet-list',
              content: {
                bulletPoints: ['SAP S/4HANA', 'Oracle Cloud ERP', 'Microsoft Dynamics 365', 'Workday']
              }
            }
          ]
        },
        context: {
          prompt: 'Create a presentation comparing ERP system vendors and providing a clear recommendation based on evaluation criteria',
          presentation_type: 'technical',
          slide_count: 6,
          audience: 'Selection Committee',
          tone: 'professional'
        },
        expectedFramework: 'comparison',
        expectedConfidence: 90
      },
      {
        name: 'Persuasive Argument',
        description: 'Convincing stakeholders to adopt new policy',
        presentation: {
          id: 'test-5',
          title: 'Remote Work Policy Proposal',
          subtitle: 'Building a Flexible, Productive Future',
          description: 'Argument for implementing comprehensive remote work policy',
          metadata: {
            author: 'Test',
            created_at: new Date().toISOString(),
            presentation_type: 'process',
            target_audience: 'Management Team',
            estimated_duration: 15,
            slide_count: 5,
            tone: 'conversational',
            version: '1.0'
          },
          slides: [
            {
              id: 'slide-1',
              type: 'title',
              title: 'Remote Work Policy Proposal',
              layout: 'title-only',
              content: { mainText: 'We should implement a comprehensive remote work policy now' }
            },
            {
              id: 'slide-2',
              type: 'benefits',
              title: 'Why Remote Work Makes Sense',
              layout: 'metrics',
              content: {
                keyMetrics: [
                  { label: 'Productivity Increase', value: '+22%', description: 'Studies show significant gains' },
                  { label: 'Employee Satisfaction', value: '+85%', description: 'Higher retention rates' }
                ]
              }
            }
          ]
        },
        context: {
          prompt: 'Create a persuasive presentation arguing for the implementation of a comprehensive remote work policy',
          presentation_type: 'process',
          slide_count: 5,
          audience: 'Management Team',
          tone: 'conversational'
        },
        expectedFramework: 'prep',
        expectedConfidence: 80
      }
    ]
  }

  /**
   * Evaluate test result against expected outcome
   */
  private evaluateTestResult(testCase: TestCase, result: FrameworkAnalysisResult): TestResult {
    const details = {
      frameworkMatch: result.recommendation.primary_framework === testCase.expectedFramework,
      confidenceInRange: result.recommendation.confidence_score >= (testCase.expectedConfidence - 10) &&
                         result.recommendation.confidence_score <= 100,
      hasRationale: result.recommendation.rationale && result.recommendation.rationale.length > 10,
      validAnalysis: result.analysis &&
                    result.analysis.content_purpose &&
                    result.framework_evaluation &&
                    result.framework_evaluation.length === Object.keys(SUPPORTED_FRAMEWORKS).length
    }

    const success = details.frameworkMatch &&
                   details.confidenceInRange &&
                   details.hasRationale &&
                   details.validAnalysis

    return {
      testCase,
      result,
      success,
      details
    }
  }

  /**
   * Print test summary
   */
  private printTestSummary(results: TestResult[]): void {
    const totalTests = results.length
    const passedTests = results.filter(r => r.success).length
    const failedTests = totalTests - passedTests

    console.log('\n' + '='.repeat(60))
    console.log('FRAMEWORK ANALYSIS TEST SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total Tests: ${totalTests}`)
    console.log(`Passed: ${passedTests} (${Math.round(passedTests / totalTests * 100)}%)`)
    console.log(`Failed: ${failedTests} (${Math.round(failedTests / totalTests * 100)}%)`)
    console.log()

    if (failedTests > 0) {
      console.log('FAILED TESTS:')
      results.filter(r => !r.success).forEach(result => {
        console.log(`❌ ${result.testCase.name}`)
        console.log(`   Expected: ${result.testCase.expectedFramework}`)
        console.log(`   Got: ${result.result.recommendation?.primary_framework || 'ERROR'}`)
        console.log(`   Issues: ${Object.entries(result.details)
          .filter(([key, value]) => !value)
          .map(([key]) => key)
          .join(', ')}`)
        console.log()
      })
    }

    console.log('FRAMEWORK DISTRIBUTION:')
    const frameworkCounts: Record<string, number> = {}
    results.forEach(result => {
      const framework = result.result.recommendation?.primary_framework || 'ERROR'
      frameworkCounts[framework] = (frameworkCounts[framework] || 0) + 1
    })

    Object.entries(frameworkCounts).forEach(([framework, count]) => {
      console.log(`  ${framework}: ${count} recommendations`)
    })
    console.log()
  }

  /**
   * Test single presentation
   */
  async testSinglePresentation(
    presentation: PresentationData,
    context: GenerationRequest
  ): Promise<FrameworkAnalysisResult> {
    console.log(`Testing framework analysis for: ${presentation.title}`)
    console.log(`Context: ${context.prompt}`)
    console.log()

    const result = await this.analyzer.analyzeFramework(presentation, context)

    console.log('ANALYSIS RESULT:')
    console.log(`Recommended Framework: ${result.recommendation.primary_framework}`)
    console.log(`Confidence: ${result.recommendation.confidence_score}%`)
    console.log(`Rationale: ${result.recommendation.rationale}`)
    console.log()

    console.log('FRAMEWORK SCORES:')
    result.framework_evaluation
      .sort((a, b) => b.suitability_score - a.suitability_score)
      .forEach(eval => {
        console.log(`  ${eval.framework_id}: ${eval.suitability_score}% - ${eval.rationale}`)
      })
    console.log()

    return result
  }
}

/**
 * CLI function to run framework tests
 */
export async function runFrameworkTests(apiKey: string): Promise<void> {
  if (!apiKey) {
    console.error('API key is required for framework testing')
    process.exit(1)
  }

  const tester = new FrameworkTester(apiKey)
  await tester.runAllTests()
}

/**
 * CLI function to test single presentation
 */
export async function testPresentationFramework(
  presentation: PresentationData,
  context: GenerationRequest,
  apiKey: string
): Promise<FrameworkAnalysisResult> {
  if (!apiKey) {
    throw new Error('API key is required for framework testing')
  }

  const tester = new FrameworkTester(apiKey)
  return tester.testSinglePresentation(presentation, context)
}