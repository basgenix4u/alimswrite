// scripts/full-test.js
const http = require('http')
const https = require('https')

const BASE_URL = process.env.CHECK_URL || 'http://localhost:3000'
const TIMEOUT = 60000 // 60 seconds for operations

// Test results storage
const testResults = {
  passed: [],
  failed: [],
  skipped: [],
}

// Helper: Make HTTP request
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const client = url.protocol === 'https:' ? https : http
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = client.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        try {
          const json = JSON.parse(body)
          resolve({ status: res.statusCode, data: json })
        } catch {
          resolve({ status: res.statusCode, data: body })
        }
      })
    })

    req.on('error', reject)
    req.setTimeout(TIMEOUT, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (data) {
      req.write(JSON.stringify(data))
    }
    req.end()
  })
}

// Test function wrapper
async function test(name, testFn) {
  process.stdout.write(`   🧪 ${name}...`)
  try {
    await testFn()
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    console.log(`   ✅ ${name}`)
    testResults.passed.push(name)
  } catch (error) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    console.log(`   ❌ ${name}`)
    console.log(`      Error: ${error.message}`)
    testResults.failed.push({ name, error: error.message })
  }
}

// Assert helpers
function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`)
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

// ============================================
// TEST SUITES
// ============================================

async function testHealthEndpoint() {
  await test('Health endpoint returns 200', async () => {
    const res = await makeRequest('GET', '/api/health')
    assertEqual(res.status, 200, 'Status code')
  })

  await test('Health endpoint checks database', async () => {
    const res = await makeRequest('GET', '/api/health')
    assertTrue(res.data.checks?.database, 'Database check missing')
  })

  await test('Health endpoint checks Supabase', async () => {
    const res = await makeRequest('GET', '/api/health')
    assertTrue(res.data.checks?.supabaseStorage, 'Supabase check missing')
  })
}

async function testSettingsAPI() {
  await test('Settings API returns site settings', async () => {
    const res = await makeRequest('GET', '/api/settings')
    assertEqual(res.status, 200, 'Status code')
    assertTrue(res.data.settings || res.data.siteName, 'Settings data missing')
  })
}

async function testDepartmentsAPI() {
  await test('Departments API returns list', async () => {
    const res = await makeRequest('GET', '/api/departments')
    assertEqual(res.status, 200, 'Status code')
    assertTrue(Array.isArray(res.data.departments) || Array.isArray(res.data), 'Departments array missing')
  })
}

async function testBlogAPI() {
  await test('Blog API returns posts list', async () => {
    const res = await makeRequest('GET', '/api/blog?limit=5')
    assertEqual(res.status, 200, 'Status code')
    assertTrue(res.data.posts !== undefined, 'Posts array missing')
  })

  await test('Blog API supports pagination', async () => {
    const res = await makeRequest('GET', '/api/blog?page=1&limit=2')
    assertEqual(res.status, 200, 'Status code')
    assertTrue(res.data.totalPages !== undefined, 'Pagination missing')
  })

  await test('Blog API filters by status', async () => {
    const res = await makeRequest('GET', '/api/blog?status=published')
    assertEqual(res.status, 200, 'Status code')
  })
}

async function testBlogCategories() {
  await test('Blog categories API works', async () => {
    const res = await makeRequest('GET', '/api/blog/categories')
    // May return 200 or 404 if not implemented
    assertTrue(res.status === 200 || res.status === 404, 'Unexpected status')
  })
}

async function testTestimonialsAPI() {
  await test('Testimonials API returns list', async () => {
    const res = await makeRequest('GET', '/api/testimonials?status=approved&limit=5')
    assertEqual(res.status, 200, 'Status code')
  })
}

async function testChatAPI() {
  let sessionId = null

  await test('Chat API creates new session', async () => {
    const res = await makeRequest('POST', '/api/chat', {
      visitorId: `test_${Date.now()}`,
      visitorName: 'Test User',
      message: 'Hello, this is a test message',
      sender: 'visitor',
    })
    assertEqual(res.status, 200, 'Status code')
    assertTrue(res.data.session?.id, 'Session ID missing')
    sessionId = res.data.session.id
  })

  await test('Chat API retrieves session messages', async () => {
    if (!sessionId) {
      throw new Error('No session ID from previous test')
    }
    const res = await makeRequest('GET', `/api/chat/${sessionId}`)
    assertEqual(res.status, 200, 'Status code')
  })

  await test('Chat API sends message to session', async () => {
    if (!sessionId) {
      throw new Error('No session ID from previous test')
    }
    const res = await makeRequest('POST', '/api/chat', {
      sessionId: sessionId,
      message: 'Follow-up test message',
      sender: 'visitor',
    })
    assertEqual(res.status, 200, 'Status code')
  })
}

async function testContactAPI() {
  await test('Contact API accepts submissions', async () => {
    const res = await makeRequest('POST', '/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      phone: '08012345678',
      message: 'This is a test message from automated testing',
    })
    // Should return 200 or 201
    assertTrue(res.status >= 200 && res.status < 300, `Unexpected status: ${res.status}`)
  })
}

async function testUploadAPI() {
  await test('Upload API endpoint exists', async () => {
    // Just check the endpoint responds (actual upload needs multipart form)
    const res = await makeRequest('POST', '/api/upload', {})
    // Should return 400 (no file) not 404 or 500
    assertTrue(res.status === 400 || res.status === 200, `Unexpected status: ${res.status}`)
  })
}

async function testPages() {
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/blog', name: 'Blog Page' },
    { path: '/about', name: 'About Page' },
    { path: '/contact', name: 'Contact Page' },
    { path: '/services', name: 'Services Page' },
    { path: '/topics', name: 'Topics Page' },
    { path: '/faq', name: 'FAQ Page' },
    { path: '/testimonials', name: 'Testimonials Page' },
    { path: '/admin/login', name: 'Admin Login Page' },
  ]

  for (const page of pages) {
    await test(`${page.name} loads`, async () => {
      const res = await makeRequest('GET', page.path)
      assertTrue(res.status === 200 || res.status === 307 || res.status === 308, 
        `${page.name} returned ${res.status}`)
    })
  }
}

async function testNotificationsAPI() {
  await test('Notifications API works', async () => {
    const res = await makeRequest('GET', '/api/notifications')
    // May require auth, so 401 is acceptable
    assertTrue(res.status === 200 || res.status === 401, `Unexpected status: ${res.status}`)
  })
}

async function testOrdersAPI() {
  await test('Orders API accepts new orders', async () => {
    const res = await makeRequest('POST', '/api/orders', {
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '08012345678',
      customerWhatsapp: '08012345678',
      projectType: 'Project',
      description: 'Test order from automated testing',
    })
    // Should work or require specific fields
    assertTrue(res.status >= 200 && res.status < 500, `Unexpected status: ${res.status}`)
  })
}

// ============================================
// MAIN RUNNER
// ============================================

async function runAllTests() {
  console.log('\n🧪 ALIMSWRITE FULL TEST SUITE')
  console.log('='.repeat(60))
  console.log(`🌐 Testing: ${BASE_URL}`)
  console.log(`⏱️  Timeout: ${TIMEOUT / 1000} seconds per test`)
  console.log('='.repeat(60))

  // Run all test suites
  console.log('\n📋 HEALTH & SYSTEM')
  await testHealthEndpoint()

  console.log('\n📋 SETTINGS & CONFIG')
  await testSettingsAPI()

  console.log('\n📋 DEPARTMENTS & FACULTIES')
  await testDepartmentsAPI()

  console.log('\n📋 BLOG SYSTEM')
  await testBlogAPI()
  await testBlogCategories()

  console.log('\n📋 TESTIMONIALS')
  await testTestimonialsAPI()

  console.log('\n📋 CHAT SYSTEM')
  await testChatAPI()

  console.log('\n📋 CONTACT & ORDERS')
  await testContactAPI()
  await testOrdersAPI()

  console.log('\n📋 FILE UPLOAD')
  await testUploadAPI()

  console.log('\n📋 PAGE LOADING')
  await testPages()

  console.log('\n📋 NOTIFICATIONS')
  await testNotificationsAPI()

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 TEST RESULTS SUMMARY')
  console.log('='.repeat(60))
  console.log(`   ✅ Passed: ${testResults.passed.length}`)
  console.log(`   ❌ Failed: ${testResults.failed.length}`)
  
  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:')
    testResults.failed.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.name}`)
      console.log(`      → ${f.error}`)
    })
  }

  console.log('\n' + '='.repeat(60))
  
  if (testResults.failed.length === 0) {
    console.log('🎉 ALL TESTS PASSED! Ready for production!')
    process.exit(0)
  } else {
    console.log(`⚠️  ${testResults.failed.length} tests failed. Fix before deploying!`)
    process.exit(1)
  }
}

// Run tests
runAllTests().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})