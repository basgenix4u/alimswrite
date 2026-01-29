// app/sitemap.js
import { prisma } from '@/lib/db'

const BASE_URL = 'https://alimswrite.com'

export default async function sitemap() {
  // Static pages
  const staticPages = [
    '',
    '/services',
    '/topics',
    '/blog',
    '/testimonials',
    '/about',
    '/contact',
    '/faq',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // Service pages
  const servicePages = [
    'project-writing',
    'thesis-dissertation',
    'data-analysis',
    'assignment-writing',
    'research-proposals',
    'siwes-it-reports',
    'powerpoint-design',
    'paraphrasing-rewriting',
    'proofreading-editing',
    'project-correction',
    'cv-resume-writing',
    'statement-of-purpose',
  ].map((service) => ({
    url: `${BASE_URL}/services/${service}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic topic pages
  let topicPages = []
  try {
    const topics = await prisma.topic.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })

    topicPages = topics.map((topic) => ({
      url: `${BASE_URL}/topics/${topic.slug}`,
      lastModified: topic.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching topics for sitemap:', error)
  }

  // Dynamic blog pages
  let blogPages = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
    })

    blogPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [...staticPages, ...servicePages, ...topicPages, ...blogPages]
}