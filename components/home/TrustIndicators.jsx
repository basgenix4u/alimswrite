// components/home/TrustIndicators.jsx
import { FiShield, FiClock, FiUsers, FiAward, FiBookOpen, FiHeadphones } from 'react-icons/fi'

const indicators = [
  {
    icon: FiShield,
    title: 'Plagiarism-Free',
    description: 'Every project passes through rigorous originality checks before delivery',
  },
  {
    icon: FiClock,
    title: 'On-Time Delivery',
    description: 'We respect your deadlines and deliver when promised, every time',
  },
  {
    icon: FiUsers,
    title: 'Expert Writers',
    description: 'Our team comprises specialists with advanced degrees across disciplines',
  },
  {
    icon: FiAward,
    title: 'Quality Assured',
    description: 'Thorough review process ensures your work meets academic standards',
  },
  {
    icon: FiBookOpen,
    title: 'All Departments',
    description: 'From sciences to humanities, we cover every academic field',
  },
  {
    icon: FiHeadphones,
    title: 'Dedicated Support',
    description: 'Reach us anytime via WhatsApp for updates and revisions',
  },
]

export default function TrustIndicators() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Why Students Choose AlimsWrite
          </h2>
          <p className="text-lg text-dark-500">
            We understand the pressure of academic deadlines. That is why we have built 
            a service that delivers quality, reliability, and peace of mind.
          </p>
        </div>

        {/* Indicators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {indicators.map((item) => (
            <div
              key={item.title}
              className="group p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-900 group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-7 h-7 text-primary-900 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 mb-2">
                {item.title}
              </h3>
              <p className="text-dark-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}