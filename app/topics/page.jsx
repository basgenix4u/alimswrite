// app/topics/page.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiSearch, FiFilter, FiX, FiBook, FiChevronRight, FiChevronDown } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { SectionLoader } from '@/components/ui/LoadingSpinner'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

const levels = [
  { id: 'nd', name: 'ND' },
  { id: 'hnd', name: 'HND' },
  { id: 'bsc', name: 'BSc/BTech' },
  { id: 'msc', name: 'MSc/MBA' },
  { id: 'phd', name: 'PhD' },
]

export default function TopicsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedFaculty, setSelectedFaculty] = useState(searchParams.get('faculty') || '')
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || '')
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Data from API
  const [topics, setTopics] = useState([])
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFaculty, setExpandedFaculty] = useState(selectedFaculty || '')
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 })

  // Fetch faculties and departments
  useEffect(() => {
    fetchFaculties()
  }, [])

  // Fetch topics when filters change
  useEffect(() => {
    fetchTopics()
  }, [selectedDepartment, selectedLevel, searchQuery, pagination.page])

  const fetchFaculties = async () => {
    try {
      const res = await fetch('/api/faculties')
      const data = await res.json()
      if (data.faculties) {
        setFaculties(data.faculties)
      }
    } catch (error) {
      console.error('Failed to fetch faculties:', error)
    }
  }

  const fetchDepartments = async (facultyId) => {
    try {
      const res = await fetch(`/api/departments?facultyId=${facultyId}`)
      const data = await res.json()
      if (data.departments) {
        setDepartments(data.departments)
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  const fetchTopics = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      
      if (searchQuery) params.set('search', searchQuery)
      if (selectedDepartment) params.set('departmentId', selectedDepartment)
      if (selectedLevel) params.set('level', selectedLevel)

      const res = await fetch(`/api/topics?${params.toString()}`)
      const data = await res.json()
      
      if (data.topics) {
        setTopics(data.topics)
        setPagination(prev => ({ ...prev, total: data.total || data.topics.length }))
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacultyClick = (facultyId) => {
    if (expandedFaculty === facultyId) {
      setExpandedFaculty('')
    } else {
      setExpandedFaculty(facultyId)
      fetchDepartments(facultyId)
    }
    setSelectedFaculty(facultyId)
    setSelectedDepartment('')
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedFaculty('')
    setSelectedDepartment('')
    setSelectedLevel('')
    setExpandedFaculty('')
    router.push('/topics', { scroll: false })
  }

  const hasActiveFilters = searchQuery || selectedFaculty || selectedDepartment || selectedLevel

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Project Topic Bank
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Browse research topics across 70+ departments. Find inspiration 
              or order any topic directly.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, departments, or keywords..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-dark-800 focus:outline-none focus:ring-4 focus:ring-primary-300 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5 text-dark-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-dark-900">Filters</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Faculty Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-dark-700 mb-3">Faculty</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {faculties.map((faculty) => (
                      <div key={faculty.id}>
                        <button
                          onClick={() => handleFacultyClick(faculty.id)}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                            selectedFaculty === faculty.id
                              ? 'bg-primary-50 text-primary-900'
                              : 'text-dark-600 hover:bg-gray-50'
                          )}
                        >
                          <span className="truncate">{faculty.name}</span>
                          <FiChevronDown className={cn(
                            'w-4 h-4 transition-transform flex-shrink-0',
                            expandedFaculty === faculty.id && 'rotate-180'
                          )} />
                        </button>

                        {/* Departments under faculty */}
                        {expandedFaculty === faculty.id && departments.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {departments
                              .filter(d => d.facultyId === faculty.id)
                              .map((dept) => (
                                <button
                                  key={dept.id}
                                  onClick={() => setSelectedDepartment(dept.id)}
                                  className={cn(
                                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                                    selectedDepartment === dept.id
                                      ? 'bg-primary-100 text-primary-900'
                                      : 'text-dark-500 hover:bg-gray-50'
                                  )}
                                >
                                  <span className="truncate">{dept.name}</span>
                                  <span className="text-xs text-dark-400">
                                    {dept._count?.topics || 0}
                                  </span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <h3 className="text-sm font-medium text-dark-700 mb-3">Level</h3>
                  <div className="space-y-1">
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(selectedLevel === level.id ? '' : level.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedLevel === level.id
                            ? 'bg-primary-50 text-primary-900'
                            : 'text-dark-600 hover:bg-gray-50'
                        )}
                      >
                        <span>{level.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex items-center justify-between">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-dark-700"
              >
                <FiFilter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="primary" size="sm">Active</Badge>
                )}
              </button>
              <span className="text-sm text-dark-500">
                {topics.length} topics found
              </span>
            </div>

            {/* Topics Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div>
                  <span className="text-dark-900 font-medium">{topics.length}</span>
                  <span className="text-dark-500 ml-1">topics found</span>
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>Most Recent</option>
                  <option>Most Popular</option>
                  <option>Alphabetical</option>
                </select>
              </div>

              {/* Active Filters Pills */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchQuery && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>Search: {searchQuery}</span>
                      <button onClick={() => setSearchQuery('')}>
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {selectedLevel && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                      <span>{levels.find(l => l.id === selectedLevel)?.name}</span>
                      <button onClick={() => setSelectedLevel('')}>
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Topics List */}
              {isLoading ? (
                <SectionLoader />
              ) : topics.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/topics/${topic.slug}`}
                        className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                          <FiBook className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-dark-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-dark-500">
                              {topic.department?.name || 'Unknown Department'}
                            </span>
                            <span className="text-dark-300">|</span>
                            <span className="text-sm text-dark-500">{topic.year}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={topic.level === 'MSc' || topic.level === 'PhD' ? 'secondary' : 'primary'} 
                          size="sm"
                        >
                          {topic.level}
                        </Badge>
                        <FiChevronRight className="w-5 h-5 text-dark-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon="search"
                  title="No topics found"
                  description="Try adjusting your search or filters to find what you are looking for."
                  actionLabel="Clear Filters"
                  onAction={clearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-dark-900">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-32">
              {/* Level Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-dark-700 mb-3">Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(selectedLevel === level.id ? '' : level.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                        selectedLevel === level.id
                          ? 'bg-primary-50 text-primary-900'
                          : 'text-dark-600 hover:bg-gray-50'
                      )}
                    >
                      <span>{level.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  Clear
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}