// scripts/health-check.js
const http = require('http')
const https = require('https')

const BASE_URL = process.env.CHECK_URL || 'http://localhost:3000'
const TIMEOUT = 30000 // 30 seconds timeout (increased from 10)

const endpoints = [
  { path: '/api/health', name: 'Health Check', critical: true },
  { path: '/api/settings', name: 'Settings API', critical: true },
  { path: '/api/departments', name: 'Departments API', critical: true },
  { path: '/api/blog?status=published&limit=1', name: 'Blog API', critical: true },
  { path: '/api/testimonials?status=approved&limit=1', name: 'Testimonials API', critical: false },
  { path: '/api/faculties', name: 'Faculties API', critical: false },
  { path: '/', name: 'Homepage', critical: true },
  { path: '/blog', name: 'Blog Page', critical: true },
  { path: '/about', name: 'About Page', critical: false },
  { path: '/contact', name: 'Contact Page', critical: false },
  { path: '/services', name: 'Services Page', critical: false },
  { path: '/topics', name: 'Topics Page', critical: false },
  { path: '/admin/login', name: 'Admin Login', critical: true },
]

function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint.path}`
    const client = url.startsWith('https') ? https : http
    const startTime = Date.now()
    
    const req = client.get(url, (res) => {
      const duration = Date.now() - startTime
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: res.statusCode,
        duration: `${duration}ms`,
        ok: res.statusCode >= 200 && res.statusCode < 400,
        critical: endpoint.critical,
      })
    })
    
    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'ERROR',
        error: error.message,
        ok: false,
        critical: endpoint.critical,
      })
    })
    
    req.setTimeout(TIMEOUT, () => {
      req.destroy()
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 'TIMEOUT',
        ok: false,
        critical: endpoint.critical,
      })
    })
  })
}

async function runHealthCheck() {
  console.log('\n🏥 ALIMSWRITE HEALTH CHECK')
  console.log('='.repeat(60))
  console.log(`🌐 Testing: ${BASE_URL}`)
  console.log(`⏱️  Timeout: ${TIMEOUT / 1000} seconds`)
  console.log('='.repeat(60) + '\n')

  const results = []
  
  for (const endpoint of endpoints) {
    process.stdout.write(`   Testing ${endpoint.name}...`)
    const result = await checkEndpoint(endpoint)
    results.push(result)
    
    // Clear the line and print result
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    
    const icon = result.ok ? '✅' : (result.critical ? '❌' : '⚠️')
    const status = result.error || `${result.status} (${result.duration})`
    console.log(`${icon} ${result.name.padEnd(25)} ${status}`)
  }

  console.log('\n' + '='.repeat(60))
  
  const passed = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok && r.critical).length
  const warnings = results.filter(r => !r.ok && !r.critical).length
  const total = results.length
  
  console.log(`\n📊 RESULTS:`)
  console.log(`   ✅ Passed: ${passed}/${total}`)
  console.log(`   ❌ Failed (Critical): ${failed}`)
  console.log(`   ⚠️  Warnings: ${warnings}`)
  
  if (failed === 0) {
    console.log('\n🚀 Ready for production!')
    process.exit(0)
  } else {
    console.log('\n🔧 Fix critical issues before deploying!')
    process.exit(1)
  }
}

runHealthCheck()