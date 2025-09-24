import { test, expect } from '@playwright/test'

// **FILL IN YOUR TEST DATA HERE**
const TEST_PROMPT = "Create a capacity management framework for technology teams that includes resource allocation, workload planning, and performance optimization strategies"

const TEST_CONFIG = {
  presentationType: "pov",        // Choose: business, technical, process, transformation, pov, custom
  presentationScope: "comprehensive", // Choose: executive, standard, detailed, comprehensive, deep_dive
  slideCount: "12",
  audience: "Engineering Managers and C-Level Executives",
  tone: "professional"                // Choose: professional, conversational, technical, executive
}
// **END FILL-IN SECTION**

test.describe('Framework Analysis Validation', () => {
  test('should demonstrate framework analysis issues', async ({ page }) => {
    console.log('🧪 Starting framework analysis validation test...')

    // Navigate to generate page
    await page.goto('/generate')
    await page.waitForLoadState('networkidle')

    // Fill out the form
    console.log('📝 Filling out generation form...')

    // Fill prompt
    await page.fill('textarea[placeholder*="Create a capacity management"]', TEST_PROMPT)

    // Select presentation type (using the Select component)
    await page.click('button:has-text("Select presentation type")')
    await page.click(`text=${TEST_CONFIG.presentationType === 'pov' ? 'Point of View (POV)' : 'Business Proposal'}`)

    // Set slide count
    await page.fill('input[type="number"]', TEST_CONFIG.slideCount)

    // Select presentation scope
    await page.click('button:has-text("Select presentation scope")')
    await page.click(`text=${TEST_CONFIG.presentationScope === 'comprehensive' ? 'Comprehensive' : 'Standard Presentation'}`)

    // Set audience
    await page.fill('input[placeholder*="C-Level Executives"]', TEST_CONFIG.audience)

    // Set tone
    await page.click('button:has-text("Professional")')
    await page.click(`text=${TEST_CONFIG.tone.charAt(0).toUpperCase() + TEST_CONFIG.tone.slice(1)}`)

    console.log('✅ Form filled successfully')

    // Capture console logs and network requests
    const consoleMessages: string[] = []
    const networkRequests: any[] = []

    page.on('console', (msg) => {
      const message = `[${msg.type().toUpperCase()}] ${msg.text()}`
      consoleMessages.push(message)
      console.log(`🔍 Console: ${message}`)
    })

    page.on('request', (request) => {
      if (request.url().includes('/api/generate')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          body: request.postData()
        })
        console.log(`🌐 API Request: ${request.method()} ${request.url()}`)
      }
    })

    // Click generate and monitor the workflow
    console.log('🚀 Starting generation workflow...')
    await page.click('button:has-text("Generate Presentation")')

    // Wait for completion or timeout
    try {
      await page.waitForSelector('text=Successfully generated', { timeout: 90000 })
      console.log('✅ Generation completed successfully')
    } catch (error) {
      console.log('⏰ Generation timed out or failed')

      // Check for error messages
      const errorElement = await page.$('text=Error')
      if (errorElement) {
        const errorText = await errorElement.textContent()
        console.log(`❌ Error found: ${errorText}`)
      }
    }

    // Analyze the logs after generation attempt
    console.log('\n📊 WORKFLOW ANALYSIS RESULTS:')
    console.log(`Total console messages: ${consoleMessages.length}`)
    console.log(`API requests made: ${networkRequests.length}`)

    // Check for framework analysis issues
    const frameworkLogs = consoleMessages.filter(msg =>
      msg.includes('FRAMEWORK') || msg.includes('framework')
    )
    console.log(`\n🧭 Framework-related logs (${frameworkLogs.length}):`)
    frameworkLogs.forEach(log => console.log(`  ${log}`))

    // Check for rule-based vs AI-driven analysis
    const ruleBased = consoleMessages.filter(msg =>
      msg.includes('rule-based') || msg.includes('heuristic') || msg.includes('Quick recommendation')
    )
    if (ruleBased.length > 0) {
      console.log(`\n⚠️ RULE-BASED ANALYSIS DETECTED (${ruleBased.length} instances):`)
      ruleBased.forEach(log => console.log(`  ${log}`))
    }

    // Check for LLM requests
    const llmLogs = consoleMessages.filter(msg =>
      msg.includes('LLM_REQUEST') || msg.includes('llm_request')
    )
    console.log(`\n🤖 LLM requests found: ${llmLogs.length}`)

    // Check for JSON parsing errors
    const jsonErrors = consoleMessages.filter(msg =>
      msg.includes('JSON_PARSING') && msg.includes('ERROR')
    )
    if (jsonErrors.length > 0) {
      console.log(`\n❌ JSON PARSING ERRORS (${jsonErrors.length}):`)
      jsonErrors.forEach(log => console.log(`  ${log}`))
    }

    // Check for multi-agent communications
    const agentLogs = consoleMessages.filter(msg =>
      msg.includes('agent') || msg.includes('AGENT')
    )
    console.log(`\n🤝 Multi-agent communications: ${agentLogs.length}`)

    // Try to fetch the log file
    try {
      const logResponse = await page.request.get('/api/logs')
      const logsList = await logResponse.json()

      if (logsList.success && logsList.logs.length > 0) {
        const latestLogId = logsList.logs[0].generationId
        console.log(`\n📁 Log file available: /api/logs/${latestLogId}`)

        const detailResponse = await page.request.get(`/api/logs/${latestLogId}`)
        const logDetails = await detailResponse.json()

        console.log('\n📋 COMPLETE WORKFLOW LOG ANALYSIS:')
        console.log(`- Total log entries: ${logDetails.logs?.length || 0}`)
        console.log(`- Generation ID: ${logDetails.generationId}`)
        console.log(`- Start time: ${logDetails.startTime}`)
        console.log(`- End time: ${logDetails.endTime || 'Not completed'}`)

        if (logDetails.summary) {
          console.log(`- Duration: ${logDetails.summary.totalDuration}ms`)
          console.log(`- LLM requests: ${logDetails.summary.llmRequestCount}`)
          console.log(`- Errors: ${logDetails.summary.errorCount}`)
          console.log(`- Decisions: ${logDetails.summary.decisionCount}`)
        }

        // Check for the specific issues you mentioned
        const workflowSteps = logDetails.logs?.map((log: any) => log.step) || []
        const uniqueSteps = [...new Set(workflowSteps)]

        console.log('\n🔍 ISSUE VALIDATION:')
        console.log(`1. Framework analysis AI requests: ${workflowSteps.filter((s:string) => s.includes('FRAMEWORK') && s.includes('LLM')).length}`)
        console.log(`2. Multi-agent steps: ${workflowSteps.filter((s:string) => s.includes('AGENT')).length}`)
        console.log(`3. JSON parsing errors: ${workflowSteps.filter((s:string) => s === 'JSON_PARSING').length}`)
        console.log(`4. Workflow steps: ${uniqueSteps.join(', ')}`)

      } else {
        console.log('\n❌ No log files found')
      }
    } catch (error) {
      console.log(`\n❌ Failed to fetch log files: ${error}`)
    }

    console.log('\n🎯 TEST COMPLETE - Review the analysis above to identify workflow issues')
  })
})