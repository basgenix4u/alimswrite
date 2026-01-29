// app/topics/[slug]/not-found.jsx
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiSearch, FiArrowLeft } from 'react-icons/fi'
import Button from '@/components/ui/Button'

export default function TopicNotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiSearch className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-dark-900 mb-2">Topic Not Found</h1>
          <p className="text-dark-500 mb-6">
            The topic you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/topics">
              <Button variant="primary">
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Browse All Topics
              </Button>
            </Link>
            <Link href="/order">
              <Button variant="outline">
                Request Custom Topic
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}