// components/home/ServicesPreview.jsx
import Link from 'next/link'
import { FiArrowRight, FiFileText, FiDatabase, FiEdit3, FiBookOpen, FiBarChart2, FiClipboard } from 'react-icons/fi'
import Button from '@/components/ui/Button'

const services = [
  {
    icon: FiFileText,
    title: 'Project Writing',
    description: 'Complete undergraduate and postgraduate projects from Chapter 1 to 5. Well-researched, properly formatted, and ready for submission.',
    href: '/services/project-writing',
    popular: true,
  },
  {
    icon: FiBookOpen,
    title: 'Thesis & Dissertation',
    description: 'Comprehensive Masters and PhD level research writing with proper methodology, analysis, and academic rigor.',
    href: '/services/thesis-dissertation',
    popular: false,
  },
  {
    icon: FiBarChart2,
    title: 'Data Analysis',
    description: 'Expert analysis using SPSS, Excel, Stata, R, and Python. Complete with interpretation and presentation of findings.',
    href: '/services/data-analysis',
    popular: true,
  },
  {
    icon: FiEdit3,
    title: 'Assignment Writing',
    description: 'Well-structured assignments, essays, and coursework delivered on time with proper research and referencing.',
    href: '/services/assignment-writing',
    popular: false,
  },
  {
    icon: FiClipboard,
    title: 'Research Proposals',
    description: 'Compelling proposals for thesis, dissertation, and research projects that get approved.',
    href: '/services/research-proposals',
    popular: false,
  },
  {
    icon: FiDatabase,
    title: 'SIWES & IT Reports',
    description: 'Professional industrial training and IT attachment reports that document your experience effectively.',
    href: '/services/siwes-it-reports',
    popular: false,
  },
]

export default function ServicesPreview() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Services Tailored for Academic Success
            </h2>
            <p className="text-lg text-dark-500">
              Every academic journey has its challenges. We provide the expertise you need 
              to overcome them and submit work you can be proud of.
            </p>
          </div>
          <Link href="/services" className="flex-shrink-0">
            <Button variant="outline">
              View All Services
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100"
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
              <h3 className="text-xl font-semibold text-dark-900 mb-3 group-hover:text-primary-900 transition-colors">
                {service.title}
              </h3>
              <p className="text-dark-500 leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Link */}
              <div className="flex items-center text-primary-600 font-medium">
                <span>Learn more</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-dark-500 mb-4">
            Do not see what you need? We offer many more services.
          </p>
          <Link href="/contact">
            <Button variant="primary">
              Contact Us for Custom Requests
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}