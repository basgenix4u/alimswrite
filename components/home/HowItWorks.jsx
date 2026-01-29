// components/home/HowItWorks.jsx
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { FiMessageCircle, FiFileText, FiCheckCircle } from 'react-icons/fi'

const steps = [
  {
    number: '01',
    icon: FiMessageCircle,
    title: 'Share Your Requirements',
    description: 'Tell us about your project. Include your topic, department, deadline, and any specific instructions from your supervisor.',
    color: 'primary',
  },
  {
    number: '02',
    icon: FiFileText,
    title: 'We Get to Work',
    description: 'Our expert writers begin researching and writing your project. We keep you updated on progress and address any questions.',
    color: 'secondary',
  },
  {
    number: '03',
    icon: FiCheckCircle,
    title: 'Receive Quality Work',
    description: 'Get your completed project on time, properly formatted, plagiarism-free, and ready for submission or review.',
    color: 'green',
  },
]

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'bg-primary-900 text-white',
    number: 'text-primary-900',
    line: 'bg-primary-200',
  },
  secondary: {
    bg: 'bg-secondary-100',
    icon: 'bg-secondary-500 text-dark-900',
    number: 'text-secondary-600',
    line: 'bg-secondary-200',
  },
  green: {
    bg: 'bg-green-100',
    icon: 'bg-green-500 text-white',
    number: 'text-green-600',
    line: 'bg-green-200',
  },
}

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-dark-500">
            Getting started is simple. Three easy steps stand between you and 
            a professionally written project.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gray-200" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color]
              return (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="text-center">
                    {/* Number Circle */}
                    <div className="relative inline-flex mb-6">
                      <div className={`w-20 h-20 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <div className={`w-14 h-14 rounded-full ${colors.icon} flex items-center justify-center shadow-lg`}>
                          <step.icon className="w-7 h-7" />
                        </div>
                      </div>
                      {/* Step Number */}
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-bold ${colors.number}`}>
                        {step.number}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-dark-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-dark-500 leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow - Mobile */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-6 md:hidden">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link href="/order">
              <Button variant="primary" size="lg">
                Start Your Project Now
              </Button>
            </Link>
            <Link href="/topics">
              <Button variant="outline" size="lg">
                Browse Project Topics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}