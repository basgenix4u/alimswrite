// app/services/page.jsx
import { sanitizeHtml } from '@/lib/sanitize'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
import { 
  FiFileText, 
  FiBookOpen, 
  FiBarChart2, 
  FiEdit3, 
  FiClipboard, 
  FiDatabase,
  FiLayout,
  FiRefreshCw,
  FiCheckCircle,
  FiUser,
  FiAward,
  FiHelpCircle
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { FaWhatsapp } from 'react-icons/fa'

export const metadata = {
  title: 'Our Services - Academic Writing & Research Services',
  description: 'Comprehensive academic writing services including project writing, thesis, dissertation, data analysis, assignments, and more. Quality guaranteed for all Nigerian universities.',
}

const services = [
  {
    icon: FiFileText,
    title: 'Project Writing',
    slug: 'project-writing',
    shortDesc: 'Complete undergraduate and postgraduate projects from Chapter 1 to 5.',
    description: 'Our flagship service covers full project writing for final year students. We handle everything from topic selection to the final chapter, ensuring your work meets your institution\'s standards and your supervisor\'s expectations.',
    features: [
      'Complete Chapter 1-5 writing',
      'Single chapter available',
      'Proper APA/Harvard referencing',
      'Plagiarism-free content',
      'Free topic suggestions',
      'Supervisor feedback corrections',
    ],
    popular: true,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiBookOpen,
    title: 'Thesis & Dissertation',
    slug: 'thesis-dissertation',
    shortDesc: 'Masters and PhD level research with rigorous academic standards.',
    description: 'Advanced research writing for postgraduate students. Our team of specialists with advanced degrees ensures your thesis or dissertation demonstrates the depth of research and analysis expected at the Masters and PhD level.',
    features: [
      'Masters thesis writing',
      'PhD dissertation support',
      'Literature review',
      'Research methodology',
      'Original research',
      'Defense preparation',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiBarChart2,
    title: 'Data Analysis',
    slug: 'data-analysis',
    shortDesc: 'Expert analysis using SPSS, Excel, Stata, R, and Python.',
    description: 'Transform your raw data into meaningful insights. Our statisticians handle everything from data entry to complex analysis, providing clear interpretations that strengthen your research findings.',
    features: [
      'SPSS analysis',
      'Excel data analysis',
      'Stata analysis',
      'R programming',
      'Python analysis',
      'Results interpretation',
    ],
    popular: true,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiEdit3,
    title: 'Assignment Writing',
    slug: 'assignment-writing',
    shortDesc: 'Well-structured assignments and coursework delivered on time.',
    description: 'From essays to case studies, we deliver quality assignments that demonstrate understanding of your course material. Every assignment is researched, well-written, and properly referenced.',
    features: [
      'Essays and reports',
      'Case study analysis',
      'Coursework',
      'Term papers',
      'Presentation content',
      'Quick turnaround available',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiClipboard,
    title: 'Research Proposals',
    slug: 'research-proposals',
    shortDesc: 'Compelling proposals that get approved by supervisors.',
    description: 'A strong proposal is the foundation of successful research. We craft proposals that clearly articulate your research problem, objectives, methodology, and significance, increasing your chances of approval.',
    features: [
      'Problem statement',
      'Research objectives',
      'Literature framework',
      'Methodology outline',
      'Timeline and budget',
      'Revision support',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiDatabase,
    title: 'SIWES & IT Reports',
    slug: 'siwes-it-reports',
    shortDesc: 'Professional industrial training documentation.',
    description: 'Document your industrial training experience professionally. We help you structure your SIWES or IT report to reflect your learning and meet your institution\'s requirements.',
    features: [
      'SIWES report writing',
      'IT attachment reports',
      'Log book entries',
      'Experience documentation',
      'Proper formatting',
      'Institution-specific requirements',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiLayout,
    title: 'PowerPoint Design',
    slug: 'powerpoint-design',
    shortDesc: 'Professional presentation slides for defense and seminars.',
    description: 'Create impactful presentations that complement your research. Our designers create visually appealing slides that help you communicate your findings effectively during defense or seminars.',
    features: [
      'Defense presentations',
      'Seminar slides',
      'Professional design',
      'Visual data presentation',
      'Speaker notes',
      'Editable templates',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiRefreshCw,
    title: 'Paraphrasing & Rewriting',
    slug: 'paraphrasing-rewriting',
    shortDesc: 'Transform existing content while maintaining meaning.',
    description: 'Need to rework existing content? Our paraphrasing service maintains the original meaning while creating fresh, original text that passes plagiarism checks.',
    features: [
      'Content paraphrasing',
      'Article rewriting',
      'Plagiarism reduction',
      'Meaning preservation',
      'Academic tone',
      'Quick delivery',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiCheckCircle,
    title: 'Proofreading & Editing',
    slug: 'proofreading-editing',
    shortDesc: 'Polish your work for grammar, clarity, and formatting.',
    description: 'Give your work the professional finish it deserves. Our editors check for grammar, spelling, punctuation, clarity, and formatting to ensure your work is error-free.',
    features: [
      'Grammar correction',
      'Spelling check',
      'Punctuation review',
      'Clarity improvement',
      'Format consistency',
      'Citation check',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiHelpCircle,
    title: 'Project Correction',
    slug: 'project-correction',
    shortDesc: 'Fix existing work based on supervisor feedback.',
    description: 'Supervisor returned your work with corrections? We help you address feedback efficiently, making the necessary changes to meet your supervisor\'s expectations.',
    features: [
      'Feedback implementation',
      'Content revision',
      'Structure adjustment',
      'Methodology fixes',
      'Reference updates',
      'Quality improvement',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiUser,
    title: 'CV & Resume Writing',
    slug: 'cv-resume-writing',
    shortDesc: 'Professional CVs that stand out to employers.',
    description: 'Land your dream job with a professionally crafted CV. We highlight your skills, experience, and achievements in a format that catches the attention of recruiters.',
    features: [
      'Professional CV writing',
      'Resume formatting',
      'Cover letters',
      'LinkedIn optimization',
      'Industry-specific',
      'ATS-friendly format',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
  {
    icon: FiAward,
    title: 'Statement of Purpose',
    slug: 'statement-of-purpose',
    shortDesc: 'Compelling SOPs for scholarship and admission applications.',
    description: 'Make your application stand out with a powerful statement of purpose. We craft compelling narratives that highlight your achievements, goals, and fit for your target program.',
    features: [
      'Scholarship applications',
      'Admission essays',
      'Personal statements',
      'Motivation letters',
      'Goal articulation',
      'Unique positioning',
    ],
    popular: false,
    startingPrice: 'Contact for quote',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Submit Requirements',
    description: 'Share your project details, deadline, and any specific instructions through our order form or WhatsApp.',
  },
  {
    step: '02',
    title: 'Get a Quote',
    description: 'We review your requirements and provide a fair quote based on complexity, length, and deadline.',
  },
  {
    step: '03',
    title: 'Confirm and Pay',
    description: 'Once you agree to the quote, make payment and we begin working on your project immediately.',
  },
  {
    step: '04',
    title: 'Receive Your Work',
    description: 'Get your completed project before the deadline, with free revisions if needed.',
  },
]

export default function ServicesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Academic Writing Services Tailored for Your Success
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              From project writing to data analysis, we provide comprehensive support 
              for every stage of your academic journey. Quality work, delivered on time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/order">
                <Button variant="secondary" size="lg">
                  Get Started Now
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://wa.me/2349039611238?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Chat With Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              Choose from our comprehensive range of academic writing and research services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-100 relative"
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute -top-3 right-6 bg-secondary-500 text-dark-900 text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}

                {/* Icon */}
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-900 transition-colors duration-300">
                  <service.icon className="w-7 h-7 text-primary-900 group-hover:text-white transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-dark-900 mb-2 group-hover:text-primary-900 transition-colors">
                  {service.title}
                </h3>
                <p className="text-dark-500 text-sm mb-4 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Features Preview */}
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-dark-600">
                      <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  Learn more
                  <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              Getting started is simple. Follow these four easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                )}

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary-900">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-dark-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-dark-500 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Tell us about your project and get a free quote. No obligations, just solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button variant="secondary" size="lg">
                Submit Your Requirements
              </Button>
            </Link>
            <a
              href="https://wa.me/2349039611238"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                <FaWhatsapp className="w-5 h-5 mr-2" />
                09039611238
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}