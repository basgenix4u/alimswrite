// app/topics/[slug]/page.jsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiArrowLeft, FiBook, FiCalendar, FiEye, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// Fetch topic from database
async function getTopic(slug) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { slug },
      include: {
        department: {
          include: {
            faculty: true,
          },
        },
      },
    })

    if (topic) {
      // Increment views
      await prisma.topic.update({
        where: { id: topic.id },
        data: { views: { increment: 1 } },
      }).catch(() => {})
    }

    return topic
  } catch (error) {
    console.error('Error fetching topic:', error)
    return null
  }
}

// Fetch related topics
async function getRelatedTopics(departmentId, currentTopicId) {
  try {
    const topics = await prisma.topic.findMany({
      where: {
        departmentId,
        id: { not: currentTopicId },
        isActive: true,
      },
      include: {
        department: true,
      },
      take: 4,
      orderBy: { views: 'desc' },
    })
    return topics
  } catch (error) {
    console.error('Error fetching related topics:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }) {
  const { slug } = await params
  const topic = await getTopic(slug)

  if (!topic) {
    return {
      title: 'Topic Not Found',
    }
  }

  return {
    title: `${topic.title} | ${topic.department?.name} Project`,
    description: topic.metaDescription || topic.description || `Get complete ${topic.title} project for ${topic.department?.name} students. Chapter 1-5 available.`,
    keywords: topic.keywords || [],
  }
}

// Default chapter breakdown
const defaultChapterBreakdown = [
  { chapter: 1, title: 'Introduction', description: 'Background, problem statement, objectives, scope, and significance' },
  { chapter: 2, title: 'Literature Review', description: 'Review of existing systems, theoretical framework, and related works' },
  { chapter: 3, title: 'System Analysis and Design', description: 'Methodology, system requirements, and design specifications' },
  { chapter: 4, title: 'Implementation', description: 'System development, coding, testing, and screenshots' },
  { chapter: 5, title: 'Summary and Conclusion', description: 'Findings, recommendations, and conclusion' },
]

export default async function TopicDetailPage({ params }) {
  const { slug } = await params
  const topic = await getTopic(slug)

  if (!topic || !topic.isActive) {
    notFound()
  }

  const relatedTopics = await getRelatedTopics(topic.departmentId, topic.id)

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in ordering this project:\n\nTopic: ${topic.title}\nDepartment: ${topic.department?.name}\n\nPlease provide more details.`
  )

  // Get chapter breakdown based on topic's chapter count
  const chapterBreakdown = defaultChapterBreakdown.slice(0, topic.chapters || 5)

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="text-dark-500 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <span className="text-dark-300">/</span>
            <Link href="/topics" className="text-dark-500 hover:text-primary-600 transition-colors">
              Topics
            </Link>
            <span className="text-dark-300">/</span>
            <span className="text-dark-900 font-medium truncate">
              {topic.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <Link 
                href="/topics" 
                className="inline-flex items-center text-dark-500 hover:text-primary-600 mb-6 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Topics
              </Link>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-900 mb-4">
                {topic.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="primary">{topic.level}</Badge>
                <span className="flex items-center gap-1 text-dark-500 text-sm">
                  <FiBook className="w-4 h-4" />
                  {topic.department?.name}
                </span>
                <span className="flex items-center gap-1 text-dark-500 text-sm">
                  <FiCalendar className="w-4 h-4" />
                  {topic.year}
                </span>
                <span className="flex items-center gap-1 text-dark-500 text-sm">
                  <FiEye className="w-4 h-4" />
                  {topic.views} views
                </span>
              </div>

              {/* Description */}
              {topic.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-dark-900 mb-3">Project Overview</h2>
                  <p className="text-dark-600 leading-relaxed whitespace-pre-line">
                    {topic.description}
                  </p>
                </div>
              )}

              {/* Abstract */}
              {topic.abstract && (
                <div className="mb-8 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-500">
                  <h2 className="text-xl font-semibold text-dark-900 mb-3">Abstract</h2>
                  <p className="text-dark-600 leading-relaxed italic">
                    {topic.abstract}
                  </p>
                </div>
              )}

              {/* Objectives */}
              {topic.objectives && topic.objectives.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-dark-900 mb-4">Research Objectives</h2>
                  <ul className="space-y-3">
                    {topic.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-dark-600">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Methodology */}
              {topic.methodology && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-dark-900 mb-3">Methodology</h2>
                  <p className="text-dark-600 leading-relaxed">
                    {topic.methodology}
                  </p>
                </div>
              )}

              {/* Chapter Breakdown */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-dark-900 mb-4">Chapter Breakdown</h2>
                <div className="space-y-3">
                  {chapterBreakdown.map((chapter) => (
                    <div key={chapter.chapter} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-900 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        {chapter.chapter}
                      </div>
                      <div>
                        <h3 className="font-semibold text-dark-900">{chapter.title}</h3>
                        <p className="text-sm text-dark-500">{chapter.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {topic.keywords && topic.keywords.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-dark-900 mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {topic.keywords.map((keyword) => (
                      <span 
                        key={keyword} 
                        className="px-3 py-1.5 bg-gray-100 text-dark-600 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Topics */}
              {relatedTopics.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-dark-900 mb-4">Related Topics</h2>
                  <div className="space-y-3">
                    {relatedTopics.map((relatedTopic) => (
                      <Link
                        key={relatedTopic.id}
                        href={`/topics/${relatedTopic.slug}`}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                      >
                        <FiBook className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {relatedTopic.title}
                          </h3>
                          <p className="text-sm text-dark-500">{relatedTopic.department?.name}</p>
                        </div>
                        <Badge variant="default" size="sm">{relatedTopic.level}</Badge>
                        <FiArrowRight className="w-4 h-4 text-dark-300 group-hover:text-primary-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-primary-900 text-white p-6">
                    <h3 className="text-lg font-semibold mb-2">Order This Project</h3>
                    <p className="text-primary-100 text-sm">
                      Get the complete project delivered to you
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-900">{topic.chapters || 5}</div>
                        <div className="text-xs text-dark-500">Chapters</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-primary-900">{topic.pages || 65}+</div>
                        <div className="text-xs text-dark-500">Pages</div>
                      </div>
                    </div>

                    <h4 className="font-medium text-dark-900 mb-3">What You Get</h4>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Complete Chapter 1-5
                      </li>
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Well-researched content
                      </li>
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Proper referencing (APA)
                      </li>
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Plagiarism-free guarantee
                      </li>
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Free corrections
                      </li>
                      <li className="flex items-center gap-2 text-sm text-dark-600">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        Instant delivery after payment
                      </li>
                    </ul>

                    <div className="space-y-3">
                      <a
                        href={`https://wa.me/2349039611238?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button variant="whatsapp" className="w-full justify-center">
                          <FaWhatsapp className="w-5 h-5 mr-2" />
                          Order on WhatsApp
                        </Button>
                      </a>
                      <Link href="/order" className="block">
                        <Button variant="outline" className="w-full justify-center">
                          Use Order Form
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-xl p-6 border border-secondary-100">
                  <h4 className="font-semibold text-dark-900 mb-2">Need a Custom Topic?</h4>
                  <p className="text-sm text-dark-600 mb-4">
                    We can write a project on any topic of your choice. Contact us to discuss your requirements.
                  </p>
                  <Link href="/order">
                    <Button variant="secondary" size="sm" className="w-full justify-center">
                      Request Custom Topic
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-dark-900 mb-4">
            Need Help With Your Project?
          </h2>
          <p className="text-dark-500 mb-6">
            Whether you choose this topic or need something custom, we are here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/2349039611238?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="lg">
                <FaWhatsapp className="w-5 h-5 mr-2" />
                Chat With Us
              </Button>
            </a>
            <Link href="/topics">
              <Button variant="outline" size="lg">
                Browse More Topics
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}