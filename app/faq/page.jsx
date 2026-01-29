// app/faq/page.jsx
'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiPlus, FiMinus, FiSearch, FiMessageCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const faqCategories = [
  { id: 'general', name: 'General Questions' },
  { id: 'ordering', name: 'Ordering Process' },
  { id: 'payment', name: 'Payment & Pricing' },
  { id: 'delivery', name: 'Delivery & Revisions' },
  { id: 'quality', name: 'Quality & Guarantees' },
]

const faqs = {
  general: [
    {
      question: 'What services does AlimsWrite offer?',
      answer: 'We offer comprehensive academic writing services including full project writing (Chapter 1-5), single chapter writing, thesis and dissertation support, data analysis (SPSS, Excel, R, Python, Stata), research proposals, assignments, SIWES/IT reports, PowerPoint presentations, paraphrasing, proofreading, CV/resume writing, and statement of purpose writing.',
    },
    {
      question: 'Which departments do you cover?',
      answer: 'We cover over 70 departments across all faculties including Sciences, Engineering, Management Sciences, Social Sciences, Arts, Education, Law, Medicine, Agriculture, and Environmental Sciences. Whatever your field of study, we have specialists who can handle your project.',
    },
    {
      question: 'Who writes the projects?',
      answer: 'Our team consists of experienced academic writers with Masters and PhD degrees across various disciplines. Each project is assigned to a writer with expertise in the relevant field to ensure quality and accuracy.',
    },
    {
      question: 'Is your service confidential?',
      answer: 'Absolutely. We treat all client information with strict confidentiality. We do not share your personal details or project information with third parties. Your identity is completely protected.',
    },
  ],
  ordering: [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order through our website order form or directly via WhatsApp (09039611238). Simply provide your project details, department, deadline, and any specific requirements. We will review and provide a quote.',
    },
    {
      question: 'What information do I need to provide?',
      answer: 'We need your project topic (if you have one), department, academic level, deadline, number of chapters or pages required, and any specific instructions from your supervisor. The more details you provide, the better we can serve you.',
    },
    {
      question: 'Can you help me choose a topic?',
      answer: 'Yes! If you do not have a topic, we can suggest relevant, researchable topics for your department. Browse our Topic Bank for ideas, or chat with us and we will recommend options based on your interests and department requirements.',
    },
    {
      question: 'Can I order just one chapter?',
      answer: 'Yes, you can order individual chapters. Many students order Chapter 1 (Introduction), Chapter 2 (Literature Review), or Chapter 4 (Data Analysis) separately based on their needs.',
    },
  ],
  payment: [
    {
      question: 'How much do you charge?',
      answer: 'Pricing varies based on the type of project, academic level, number of pages/chapters, and deadline. We provide custom quotes for each project. Contact us with your requirements for a free, no-obligation quote.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers to Nigerian bank accounts. Payment details are provided after you receive and approve your quote.',
    },
    {
      question: 'Do I pay the full amount upfront?',
      answer: 'For larger projects, we typically work with a partial payment upfront and the balance upon delivery. The specific arrangement is discussed when you place your order.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer revisions until you are satisfied. In rare cases where we cannot meet your requirements despite our best efforts, we discuss appropriate refund options on a case-by-case basis.',
    },
  ],
  delivery: [
    {
      question: 'How long does it take to complete a project?',
      answer: 'Typical turnaround time is 2-4 weeks for a complete project (Chapter 1-5), depending on complexity. Single chapters can be completed in 3-7 days. We also offer express delivery for urgent requests at additional cost.',
    },
    {
      question: 'How will I receive my completed project?',
      answer: 'Completed projects are delivered via email and/or WhatsApp in Microsoft Word format. You will also receive any supporting files like SPSS output, questionnaires, or plagiarism reports as applicable.',
    },
    {
      question: 'What if my supervisor requests corrections?',
      answer: 'We offer free revisions based on supervisor feedback. Simply share the comments and we will address them promptly. This is included in our service at no extra cost.',
    },
    {
      question: 'Can you meet urgent deadlines?',
      answer: 'Yes, we offer express delivery for urgent projects. Contact us with your deadline and we will let you know if we can accommodate it. Rush orders may incur additional fees.',
    },
  ],
  quality: [
    {
      question: 'How do you ensure quality?',
      answer: 'Every project undergoes multiple quality checks including content review, plagiarism check, grammar and formatting review, and final quality assurance before delivery. We use credible academic sources and follow proper research methodologies.',
    },
    {
      question: 'Is the work plagiarism-free?',
      answer: 'Yes, all our work is written from scratch and checked through plagiarism detection software. We provide a plagiarism report upon request to verify originality.',
    },
    {
      question: 'What referencing styles do you use?',
      answer: 'We work with all major referencing styles including APA, Harvard, MLA, Chicago, and others. We format your work according to your institution\'s requirements.',
    },
    {
      question: 'What if I am not satisfied with the work?',
      answer: 'Your satisfaction is our priority. If you are not satisfied, we offer free revisions until the work meets your expectations. We work with you until you are happy with the final result.',
    },
  ],
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (question) => {
    setOpenItems(prev => ({
      ...prev,
      [question]: !prev[question],
    }))
  }

  // Filter FAQs based on search
  const filteredFaqs = searchQuery
    ? Object.values(faqs).flat().filter(
        faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory]

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Find answers to common questions about our services, ordering process, 
              and delivery.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-dark-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs (only show when not searching) */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all',
                    activeCategory === category.id
                      ? 'bg-primary-900 text-white'
                      : 'bg-white text-dark-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {/* Search Results Label */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-dark-600">
                Found {filteredFaqs.length} results for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.question)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-dark-900 pr-4">{faq.question}</span>
                  <span className="flex-shrink-0">
                    {openItems[faq.question] ? (
                      <FiMinus className="w-5 h-5 text-primary-600" />
                    ) : (
                      <FiPlus className="w-5 h-5 text-dark-400" />
                    )}
                  </span>
                </button>
                {openItems[faq.question] && (
                  <div className="px-5 pb-5">
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-dark-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <FiMessageCircle className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500 mb-4">No questions found matching your search.</p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12 text-center border border-primary-100">
            <FiMessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-dark-600 mb-8 max-w-xl mx-auto">
              Cannot find what you are looking for? Our team is ready to help. 
              Reach out to us and we will get back to you promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/2349039611238?text=Hello%2C%20I%20have%20a%20question%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="whatsapp" size="lg">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}