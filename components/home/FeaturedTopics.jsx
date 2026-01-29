// components/home/FeaturedTopics.jsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiArrowRight, FiBook, FiChevronRight } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function FeaturedTopics() {
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [topics, setTopics] = useState([])
  const [activeDepartment, setActiveDepartment] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalDepartments: 0,
    totalFaculties: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch departments
      const deptRes = await fetch('/api/departments')
      const deptData = await deptRes.json()
      
      if (deptData.departments && deptData.departments.length > 0) {
        // Get top 6 departments by topic count
        const sortedDepts = deptData.departments
          .filter(d => d._count?.topics > 0)
          .sort((a, b) => (b._count?.topics || 0) - (a._count?.topics || 0))
          .slice(0, 6)
        
        setDepartments(sortedDepts)
        
        // Set first department as active
        if (sortedDepts.length > 0) {
          setActiveDepartment(sortedDepts[0].id)
          fetchTopicsForDepartment(sortedDepts[0].id)
        }

        // Calculate stats
        const totalDepts = deptData.departments.length
        const totalTopics = deptData.departments.reduce((sum, d) => sum + (d._count?.topics || 0), 0)
        const uniqueFaculties = new Set(deptData.departments.map(d => d.facultyId)).size
        
        setStats({
          totalTopics,
          totalDepartments: totalDepts,
          totalFaculties: uniqueFaculties
        })
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopicsForDepartment = async (departmentId) => {
    try {
      const res = await fetch(`/api/topics?departmentId=${departmentId}&limit=5`)
      const data = await res.json()
      if (data.topics) {
        setTopics(data.topics)
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    }
  }

  const handleDepartmentClick = (deptId) => {
    setActiveDepartment(deptId)
    fetchTopicsForDepartment(deptId)
  }

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (departments.length === 0) {
    return null // Don't show section if no departments with topics
  }

  const activeDeptName = departments.find(d => d.id === activeDepartment)?.name || ''

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Browse Project Topics
            </h2>
            <p className="text-lg text-dark-500">
              Explore our extensive collection of research topics across various departments. 
              Find inspiration or order any topic directly.
            </p>
          </div>
          <Link href="/topics" className="flex-shrink-0">
            <Button variant="outline">
              View All Topics
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Department Tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max pb-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleDepartmentClick(dept.id)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  activeDepartment === dept.id
                    ? 'bg-primary-900 text-white shadow-md'
                    : 'bg-white text-dark-600 hover:bg-primary-50 hover:text-primary-900 border border-gray-200'
                )}
              >
                {dept.name}
                <span className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeDepartment === dept.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-dark-500'
                )}>
                  {dept._count?.topics || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Topics List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                    <FiBook className="w-5 h-5 text-primary-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-dark-800 font-medium group-hover:text-primary-900 transition-colors truncate">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-dark-400 mt-0.5">
                      {topic.department?.name || activeDeptName}
                    </p>
                  </div>

                  {/* Level Badge */}
                  <span className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium flex-shrink-0',
                    topic.level === 'MSc' || topic.level === 'PhD'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-primary-100 text-primary-700'
                  )}>
                    {topic.level}
                  </span>

                  {/* Arrow */}
                  <FiChevronRight className="w-5 h-5 text-dark-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-dark-500">
                No topics found for this department
              </div>
            )}
          </div>

          {/* View More Link */}
          {topics.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Link
                href={`/topics?department=${activeDepartment}`}
                className="flex items-center justify-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                View all {activeDeptName} topics
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-900">{stats.totalTopics}+</div>
            <div className="text-sm text-dark-500">Project Topics</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-900">{stats.totalDepartments}+</div>
            <div className="text-sm text-dark-500">Departments</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-900">{stats.totalFaculties}</div>
            <div className="text-sm text-dark-500">Faculties</div>
          </div>
          <div className="bg-white rounded-xl p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary-900">Daily</div>
            <div className="text-sm text-dark-500">New Additions</div>
          </div>
        </div>
      </div>
    </section>
  )
}