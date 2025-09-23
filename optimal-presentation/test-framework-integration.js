/**
 * Test script to verify framework integration
 */

const { getQuickFrameworkRecommendation } = require('./lib/validation/frameworkAnalysis.ts')
const { generatePrompt } = require('./lib/prompts.ts')

// Test different scenarios
const testCases = [
  {
    name: "Case Study Scenario",
    presentationType: "business",
    audience: "executives",
    prompt: "Present our successful digital transformation project results and achievements"
  },
  {
    name: "Comparison Scenario",
    presentationType: "technical",
    audience: "procurement team",
    prompt: "Compare three ERP vendors and recommend the best option"
  },
  {
    name: "Strategy Scenario",
    presentationType: "business",
    audience: "board members",
    prompt: "Propose new market expansion strategy for next quarter"
  },
  {
    name: "Problem-Solution Scenario",
    presentationType: "process",
    audience: "managers",
    prompt: "Address current inefficiencies in our workflow processes"
  }
]

console.log("🧪 Testing Framework Integration System")
console.log("=" * 50)

testCases.forEach(testCase => {
  try {
    console.log(`\n📋 Test Case: ${testCase.name}`)
    console.log(`   Type: ${testCase.presentationType}`)
    console.log(`   Audience: ${testCase.audience}`)
    console.log(`   Prompt: "${testCase.prompt}"`)

    // Test framework selection
    const framework = getQuickFrameworkRecommendation(
      testCase.presentationType,
      testCase.audience,
      testCase.prompt
    )

    console.log(`✅ Selected Framework: ${framework.framework.name}`)
    console.log(`   Confidence: ${framework.confidence}%`)
    console.log(`   Rationale: ${framework.rationale}`)

    // Test prompt generation with framework
    const request = {
      prompt: testCase.prompt,
      presentation_type: testCase.presentationType,
      audience: testCase.audience,
      slide_count: "5",
      tone: "professional"
    }

    const generatedPrompt = generatePrompt(request, framework.framework)

    // Check if prompt contains framework-specific content
    const hasFrameworkContent = generatedPrompt.includes(framework.framework.name.toUpperCase())
    console.log(`✅ Framework-specific prompt generated: ${hasFrameworkContent}`)

    if (hasFrameworkContent) {
      console.log("   🎯 Framework integration successful!")
    } else {
      console.log("   ⚠️  Warning: Framework content not found in prompt")
    }

  } catch (error) {
    console.log(`❌ Error in test case: ${error.message}`)
  }
})

console.log("\n🏁 Framework Integration Test Complete")