// Simple test script for API endpoints
const API_BASE = 'http://localhost:3000/api'

// Test outline generation
async function testOutline() {
  console.log('\n🧪 Testing /api/generate-outline...')

  try {
    const response = await fetch(`${API_BASE}/generate-outline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a presentation about cloud computing benefits',
        presentation_type: 'business',
        slide_count: '5',
        audience: 'Business executives',
        tone: 'professional'
      })
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Outline generation successful!')
      console.log(`   - Title: ${data.outline?.title}`)
      console.log(`   - Slides: ${data.outline?.slides?.length}`)
      console.log(`   - Score: ${data.validationScore}/100`)
    } else {
      console.log('❌ Outline generation failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message)
  }
}

// Test iterative generation
async function testIterative() {
  console.log('\n🧪 Testing /api/generate-iterative...')

  try {
    const response = await fetch(`${API_BASE}/generate-iterative`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a presentation about AI transformation',
        presentation_type: 'business',
        slide_count: '3',
        audience: 'Executive team',
        tone: 'professional',
        streamProgress: false
      })
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Iterative generation successful!')
      console.log(`   - Slides generated: ${data.presentation?.slides?.length}`)
      console.log(`   - Overall score: ${data.validationScores?.overall}/100`)
      console.log(`   - Total tokens: ${data.tokensUsed?.total}`)
    } else {
      console.log('❌ Iterative generation failed:', data.errors?.join(', '))
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message)
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API tests...')
  await testOutline()
  await testIterative()
  console.log('\n✨ Tests complete!')
}

runTests()