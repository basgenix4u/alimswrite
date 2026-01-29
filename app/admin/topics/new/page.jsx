// app/admin/topics/new/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiSave, FiPlus, FiX } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import toast from 'react-hot-toast'

const levels = [
  { value: 'ND', label: 'ND' },
  { value: 'HND', label: 'HND' },
  { value: 'BSc', label: 'BSc/BTech' },
  { value: 'MSc', label: 'MSc/MBA' },
  { value: 'PhD', label: 'PhD' },
]

export default function NewTopicPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    departmentId: '',
    level: 'BSc',
    year: new Date().getFullYear(),
    chapters: 5,
    pages: '',
    description: '',
    abstract: '',
    methodology: '',
    objectives: [''],
    keywords: [''],
    isFeatured: false,
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments')
      const data = await response.json()
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Failed to fetch departments:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.departmentId) {
      toast.error('Title and department are required')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          objectives: formData.objectives.filter(o => o.trim()),
          keywords: formData.keywords.filter(k => k.trim()),
        }),
      })

      if (response.ok) {
        toast.success('Topic created successfully')
        router.push('/admin/topics')
      } else {
        throw new Error('Failed to create topic')
      }
    } catch (error) {
      toast.error('Failed to create topic')
    } finally {
      setIsLoading(false)
    }
  }

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] })
  }

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index)
    setFormData({ ...formData, objectives: newObjectives })
  }

  const updateObjective = (index, value) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData({ ...formData, objectives: newObjectives })
  }

  const addKeyword = () => {
    setFormData({ ...formData, keywords: [...formData.keywords, ''] })
  }

  const removeKeyword = (index) => {
    const newKeywords = formData.keywords.filter((_, i) => i !== index)
    setFormData({ ...formData, keywords: newKeywords })
  }

  const updateKeyword = (index, value) => {
    const newKeywords = [...formData.keywords]
    newKeywords[index] = value
    setFormData({ ...formData, keywords: newKeywords })
  }

  const departmentOptions = departments.map(d => ({
    value: d.id,
    label: `${d.name} (${d.faculty?.name || 'Unknown Faculty'})`,
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/topics"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Add New Topic</h1>
          <p className="text-dark-500 mt-1">Create a new project topic</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-dark-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <Input
                  label="Topic Title"
                  placeholder="Enter the project topic title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Textarea
                  label="Description"
                  placeholder="Brief description of the project topic"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
                <Textarea
                  label="Abstract"
                  placeholder="Abstract or summary of the project"
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  rows={4}
                />
                <Textarea
                  label="Methodology"
                  placeholder="Research methodology used"
                  value={formData.methodology}
                  onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Research Objectives</h2>
                <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Objective ${index + 1}`}
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                    />
                    {formData.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Keywords (SEO)</h2>
                <Button type="button" variant="outline" size="sm" onClick={addKeyword}>
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Keyword"
                      value={keyword}
                      onChange={(e) => updateKeyword(index, e.target.value)}
                      className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    {formData.keywords.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeKeyword(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-dark-900 mb-4">Publish</h2>
              <div className="space-y-4">
                <Select
                  label="Department"
                  options={departmentOptions}
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  placeholder="Select department"
                  required
                />
                <Select
                  label="Academic Level"
                  options={levels}
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                  <Input
                    label="Chapters"
                    type="number"
                    value={formData.chapters}
                    onChange={(e) => setFormData({ ...formData, chapters: parseInt(e.target.value) })}
                  />
                </div>
                <Input
                  label="Pages (approx)"
                  type="number"
                  placeholder="e.g., 75"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-dark-700">Featured topic</span>
                </label>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Topic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}