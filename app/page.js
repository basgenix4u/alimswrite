// app/page.jsx
import Layout from '@/components/layout/Layout'
import Hero from '@/components/home/Hero'
import TrustIndicators from '@/components/home/TrustIndicators'
import ServicesPreview from '@/components/home/ServicesPreview'
import HowItWorks from '@/components/home/HowItWorks'
import FeaturedTopics from '@/components/home/FeaturedTopics'
import Testimonials from '@/components/home/Testimonials'
import BlogPreview from '@/components/home/BlogPreview'
import FinalCTA from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <TrustIndicators />
      <ServicesPreview />
      <HowItWorks />
      <FeaturedTopics />
      <Testimonials />
      <BlogPreview />
      <FinalCTA />
    </Layout>
  )
}