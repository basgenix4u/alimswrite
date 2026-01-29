// app/about/page.jsx
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiCheck, FiTarget, FiEye, FiHeart, FiAward, FiUsers, FiBookOpen, FiShield } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { FaWhatsapp } from 'react-icons/fa'

export const metadata = {
  title: 'About Us - Our Story & Mission',
  description: 'Learn about AlimsWrite, our mission to help Nigerian students succeed academically, and our commitment to quality academic writing services.',
}

const values = [
  {
    icon: FiAward,
    title: 'Quality First',
    description: 'We never compromise on quality. Every project undergoes rigorous review before delivery to ensure it meets the highest academic standards.',
  },
  {
    icon: FiShield,
    title: 'Integrity',
    description: 'We operate with transparency and honesty. What we promise is what we deliver. No hidden fees, no false claims.',
  },
  {
    icon: FiUsers,
    title: 'Student-Centered',
    description: 'Your success is our priority. We tailor our approach to your specific needs, department requirements, and supervisor expectations.',
  },
  {
    icon: FiBookOpen,
    title: 'Continuous Learning',
    description: 'We stay updated with the latest research methodologies, citation styles, and academic trends across all disciplines.',
  },
]

const stats = [
  { value: '5,000+', label: 'Projects Delivered' },
  { value: '70+', label: 'Departments Covered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '4.9/5', label: 'Average Rating' },
]

const team = [
  {
    role: 'Research Writers',
    description: 'Specialists with Masters and PhD degrees across various disciplines.',
  },
  {
    role: 'Data Analysts',
    description: 'Experts in SPSS, R, Python, Excel, and Stata statistical analysis.',
  },
  {
    role: 'Editors & Proofreaders',
    description: 'Language specialists who ensure clarity, grammar, and proper formatting.',
  },
  {
    role: 'Project Managers',
    description: 'Dedicated coordinators who ensure timely delivery and communication.',
  },
]

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Empowering Students to Achieve Academic Excellence
              </h1>
              <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                AlimsWrite was founded with a simple mission: to help Nigerian students 
                overcome the challenges of academic writing and research. We understand 
                the pressure of deadlines, the complexity of research methodologies, and 
                the high standards expected by supervisors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/order">
                  <Button variant="secondary" size="lg">
                    Start Your Project
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-900">
                    Get In Touch
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-primary-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="lg:hidden py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-primary-900 mb-1">{stat.value}</div>
                <div className="text-sm text-dark-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6">
              Our Story
            </h2>
            <div className="text-lg text-dark-600 space-y-4 text-left">
              <p>
                AlimsWrite began as a response to a common struggle among Nigerian university 
                students: the challenge of producing quality research projects while juggling 
                coursework, exams, and personal responsibilities.
              </p>
              <p>
                We observed that many students had brilliant ideas but lacked the research 
                skills, writing expertise, or time to translate those ideas into well-structured 
                academic papers. Some faced language barriers, while others struggled with 
                complex data analysis requirements.
              </p>
              <p>
                Today, we have grown into a trusted academic support service, helping thousands 
                of students across Nigerian universities achieve their academic goals. Our team 
                has expanded to include specialists in virtually every academic discipline, 
                equipped to handle projects from undergraduate to doctoral level.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
              <div className="w-14 h-14 bg-primary-900 rounded-xl flex items-center justify-center mb-6">
                <FiTarget className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Our Mission</h3>
              <p className="text-dark-600 leading-relaxed">
                To provide accessible, high-quality academic writing support that empowers 
                Nigerian students to excel in their studies. We aim to be the bridge between 
                academic challenges and academic success, offering expertise, guidance, and 
                reliable support at every step.
              </p>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-8 border border-secondary-100">
              <div className="w-14 h-14 bg-secondary-500 rounded-xl flex items-center justify-center mb-6">
                <FiEye className="w-7 h-7 text-dark-900" />
              </div>
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Our Vision</h3>
              <p className="text-dark-600 leading-relaxed">
                To become the most trusted academic writing partner for students across 
                Africa, known for quality, reliability, and genuine commitment to student 
                success. We envision a future where no student fails due to lack of 
                research support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as a service.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-900" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{value.title}</h3>
                <p className="text-dark-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Our Team
            </h2>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              A dedicated team of professionals committed to your academic success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.role} className="text-center p-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{member.role}</h3>
                <p className="text-dark-500 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6">
                Why Students Trust AlimsWrite
              </h2>
              <div className="space-y-4">
                {[
                  'Experienced writers with advanced degrees',
                  'Coverage of 70+ departments and disciplines',
                  'Plagiarism-free work with quality guarantees',
                  'Timely delivery that respects your deadlines',
                  'Free revisions based on supervisor feedback',
                  'Confidential and secure service',
                  'Affordable pricing with no hidden costs',
                  '24/7 WhatsApp support for quick responses',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-dark-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary-900 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <FiHeart className="w-8 h-8 text-secondary-400" />
                <h3 className="text-2xl font-bold">Our Commitment</h3>
              </div>
              <p className="text-primary-100 leading-relaxed mb-6">
                We are not just a writing service. We are your academic partners. Every 
                project we handle is treated with the same care and attention as if it 
                were our own. Your success is our success, and we go the extra mile to 
                ensure you are satisfied with our work.
              </p>
              <p className="text-primary-100 leading-relaxed">
                When you work with AlimsWrite, you are not just getting a project. You are 
                getting a team that genuinely cares about your academic journey and is 
                committed to helping you achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Experience the AlimsWrite Difference?
          </h2>
          <p className="text-primary-100 mb-8">
            Join thousands of students who have trusted us with their academic success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/order">
              <Button variant="secondary" size="lg">
                Start Your Project
              </Button>
            </Link>
            <a
              href="https://wa.me/2349039611238"
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
      </section>
    </Layout>
  )
}
