// lib/rate-limit.js
import { RateLimiterMemory } from 'rate-limiter-flexible'

const apiLimiter = new RateLimiterMemory({
  points: 60,
  duration: 60,
})

const orderLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60,
})

const commentLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
})

const authLimiter = new RateLimiterMemory({
  points: 5,
  duration: 300,
})

export async function rateLimit(request, type = 'api') {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  
  const limiters = {
    api: apiLimiter,
    order: orderLimiter,
    comment: commentLimiter,
    auth: authLimiter,
  }
  
  const limiter = limiters[type] || apiLimiter
  
  try {
    await limiter.consume(ip)
    return { success: true, ip }
  } catch (error) {
    return { success: false, ip }
  }
}