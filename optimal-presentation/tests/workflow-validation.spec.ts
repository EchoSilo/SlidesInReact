import { test, expect } from '@playwright/test'

// **PLACEHOLDER SECTION - PLEASE FILL IN YOUR TEST DATA**
const TEST_CONFIG = {
  // Replace with your test prompt
  prompt: "CREATE_A_COMPREHENSIVE_CAPACITY_MANAGEMENT_FRAMEWORK_FOR_ENTERPRISE_TECHNOLOGY_TEAMS_THAT_INCLUDES_RESOURCE_ALLOCATION_WORKLOAD_PLANNING_AND_PERFORMANCE_OPTIMIZATION_STRATEGIES",

  // Replace with your desired settings
  presentationType: "capacity", // business, technical, process, transformation, capacity, custom
  presentationScope: "comprehensive", // executive, standard, detailed, comprehensive, deep_dive
  slideCount: "12",
  audience: "C-Level Executives and Engineering Managers",
  tone: "professional"
}

// Test constants - modify if needed
const EXPECTED_WORKFLOW_STEPS = [
  'INITIALIZATION',
  'REQUEST_PARSING',
  'VALIDATION',
  'API_KEY',
  'FRAMEWORK_ANALYSIS', // Should be AI-driven, not rule-based
  'FRAMEWORK_SELECTION', // Should show AI decision
  'PROMPT_GENERATION',
  'LLM_SETUP',
  'LLM_REQUEST',
  'LLM_RESPONSE',
  'JSON_PARSING',
  'STRUCTURE_VALIDATION',
  'COMPLETION'
]

const EXPECTED_AI_AGENTS = [
  'framework_analyzer', // Should analyze prompt and recommend framework via AI
  'content_generator', // Should generate slides based on framework
  'structure_validator' // Should validate and refine output
]
// **END PLACEHOLDER SECTION**

test.describe('Presentation Generation Workflow Validation', () => {
  let generationId: string
  let consoleMessages: string[] = []
  let llmRequests: any[] = []
  let apiCalls: any[] = []

  test.beforeEach(async ({ page }) => {
    // Capture console logs
    page.on('console', (msg) => {
      consoleMessages.push(`[${msg.type().toUpperCase()}] ${msg.text()}`)
    })

    // Capture network requests
    page.on('request', (request) => {
      if (request.url().includes('/api/')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          body: request.postData()
        })
      }
    })

    // Navigate to generate page
    await page.goto('/generate')
    await expect(page).toHaveTitle(/Generate Presentation/)
  })

  test('should use AI-driven framework analysis (not rule-based logic)', async ({ page }) => {
    // Fill in the form with test data
    await page.fill('#prompt', TEST_CONFIG.prompt)

    // Select presentation type
    await page.click(`[data-presentation-type="${TEST_CONFIG.presentationType}"]`)

    // Set slide count
    await page.fill('#slideCount', TEST_CONFIG.slideCount)

    // Select presentation scope
    await page.selectOption('[data-presentation-scope]', TEST_CONFIG.presentationScope)

    // Set audience
    await page.fill('#audience-grid', TEST_CONFIG.audience)

    // Set tone
    await page.selectOption('[data-tone]', TEST_CONFIG.tone)

    // Clear previous logs
    consoleMessages = []
    llmRequests = []
    apiCalls = []

    // Start generation and capture workflow
    await page.click('button:has-text("Generate Presentation")')

    // Wait for completion or error
    await page.waitForSelector('[data-testid="success-message"], [data-testid="error-message"]', {
      timeout: 120000 // 2 minutes
    })

    // Extract generation ID from logs
    const generationLog = consoleMessages.find(msg => msg.includes('FRONTEND] Starting presentation generation workflow'))
    console.log('🔍 Generation log found:', generationLog)

    // Fetch the complete log file via API
    const logResponse = await page.request.get('/api/logs')
    const logsList = await logResponse.json()

    if (logsList.success && logsList.logs.length > 0) {
      const latestLog = logsList.logs[0]
      const detailResponse = await page.request.get(`/api/logs/${latestLog.generationId}`)
      const logDetails = await detailResponse.json()

      console.log('📋 Complete workflow log:', JSON.stringify(logDetails, null, 2))

      // **VALIDATION 1: Framework Analysis Should Be AI-Driven**
      const frameworkLogs = logDetails.logs.filter((log: any) =>
        log.step.includes('FRAMEWORK') && log.type === 'llm_request'
      )

      expect(frameworkLogs.length).toBeGreaterThan(0,
        'Should have AI LLM requests for framework analysis, but found rule-based logic instead')

      // **VALIDATION 2: Multi-Agent System Present**
      const agentLogs = logDetails.logs.filter((log: any) =>
        log.message.includes('agent') || log.step.includes('AGENT')
      )

      expect(agentLogs.length).toBeGreaterThan(0,
        'Should have multi-agent system communications')

      // **VALIDATION 3: Framework Selection Should Show AI Decision**
      const frameworkDecision = logDetails.logs.find((log: any) =>
        log.step === 'FRAMEWORK_SELECTION' && log.type === 'decision'
      )

      expect(frameworkDecision).toBeDefined('Should have AI-driven framework selection decision')
      expect(frameworkDecision.data).toHaveProperty('ai_analysis',
        'Framework decision should include AI analysis, not just rules')

      // **VALIDATION 4: Expected Workflow Steps Present**
      const actualSteps = [...new Set(logDetails.logs.map((log: any) => log.step))]
      for (const expectedStep of EXPECTED_WORKFLOW_STEPS) {
        expect(actualSteps).toContain(expectedStep,
          `Missing expected workflow step: ${expectedStep}`)
      }

      // **VALIDATION 5: JSON Parsing Should Succeed**
      const jsonErrors = logDetails.logs.filter((log: any) =>
        log.step === 'JSON_PARSING' && log.type === 'error'
      )

      expect(jsonErrors.length).toBe(0,
        `JSON parsing should succeed, but found ${jsonErrors.length} errors: ${JSON.stringify(jsonErrors)}`)

      // **VALIDATION 6: LLM Communications Are Logged**
      const llmRequests = logDetails.logs.filter((log: any) => log.type === 'llm_request')
      const llmResponses = logDetails.logs.filter((log: any) => log.type === 'llm_response')

      expect(llmRequests.length).toBeGreaterThan(1,
        'Should have multiple LLM requests (framework analysis + content generation)')
      expect(llmResponses.length).toBe(llmRequests.length,
        'Should have matching LLM responses for each request')

      // **VALIDATION 7: Agent Communications**
      for (const expectedAgent of EXPECTED_AI_AGENTS) {
        const agentLogs = logDetails.logs.filter((log: any) =>
          log.message.toLowerCase().includes(expectedAgent) ||
          log.data?.agent?.includes(expectedAgent)
        )
        expect(agentLogs.length).toBeGreaterThan(0,
          `Should have communications with ${expectedAgent} agent`)
      }

    } else {
      throw new Error('No log files found - logging system may not be working')
    }
  })

  test('should properly handle multi-agent framework analysis', async ({ page }) => {
    // Test specifically focuses on the framework analysis agent
    await page.fill('#prompt', TEST_CONFIG.prompt)
    await page.click(`[data-presentation-type="${TEST_CONFIG.presentationType}"]`)

    await page.click('button:has-text("Generate Presentation")')

    // Wait for framework analysis completion
    await page.waitForFunction(() => {
      return window.localStorage.getItem('lastGenerationLogs') !== null
    }, { timeout: 60000 })

    const logs = JSON.parse(await page.evaluate(() =>
      window.localStorage.getItem('lastGenerationLogs') || '{}'
    ))

    // Verify framework analysis agent was called
    const frameworkAgentCalls = logs.logs?.filter((log: any) =>
      log.step.includes('FRAMEWORK_AGENT') ||
      (log.type === 'llm_request' && log.message.includes('framework'))
    ) || []

    expect(frameworkAgentCalls.length).toBeGreaterThan(0,
      'Framework analysis should use dedicated AI agent, not rule-based logic')
  })

  test.afterEach(async ({ page }) => {
    // Output diagnostic information
    console.log('🔍 Console Messages Captured:', consoleMessages.length)
    console.log('🌐 API Calls Captured:', apiCalls.length)

    // Print key workflow issues found
    const frameworkIssues = consoleMessages.filter(msg =>
      msg.includes('FALLBACK') || msg.includes('rule-based')
    )

    if (frameworkIssues.length > 0) {
      console.log('⚠️ Framework Analysis Issues Found:')
      frameworkIssues.forEach(issue => console.log(`  - ${issue}`))
    }
  })
})