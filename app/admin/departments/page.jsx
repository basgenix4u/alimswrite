// app/admin/departments/page.jsx
'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function DepartmentsPage() {
  const [faculties, setFaculties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFaculties, setExpandedFaculties] = useState({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    aliases: '',
    description: '',
  })

  useEffect(() => {
    fetchFaculties()
  }, [])

  const fetchFaculties = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/faculties')
      const data = await response.json()
      setFaculties(data.faculties || [])
      
      // Expand first faculty by default
      if (data.faculties?.length > 0) {
        setExpandedFaculties({ [data.faculties[0].id]: true })
      }
    } catch (error) {
      console.error('Failed to fetch faculties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFaculty = (facultyId) => {
    setExpandedFaculties(prev => ({
      ...prev,
      [facultyId]: !prev[facultyId],
    }))
  }

  const handleAddDepartment = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.facultyId) {
      toast.error('Name and faculty are required')
      return
    }

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const aliases = formData.aliases.split(',').map(a => a.trim().toLowerCase()).filter(Boolean)

      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug,
          facultyId: formData.facultyId,
          aliases,
          description: formData.description,
        }),
      })

      if (response.ok) {
        toast.success('Department added successfully')
        setShowAddForm(false)
        setFormData({ name: '', facultyId: '', aliases: '', description: '' })
        fetchFaculties()
      } else {
        throw new Error('Failed to add')
      }
    } catch (error) {
      toast.error('Failed to add department')
    }
  }

  const handleDeleteDepartment = async (id) => {
    if (!confirm('Are you sure? This will also delete all topics in this department.')) return

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Department deleted')
        fetchFaculties()
      }
    } catch (error) {
      toast.error('Failed to delete department')
    }
  }

  const totalDepartments = faculties.reduce((acc, f) => acc + (f.departments?.length || 0), 0)
  const totalTopics = faculties.reduce((acc, f) => 
    acc + f.departments?.reduce((dacc, d) => dacc + (d._count?.topics || 0), 0), 0
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Departments</h1>
          <p className="text-dark-500 mt-1">
            {faculties.length} faculties, {totalDepartments} departments, {totalTopics} topics
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Add New Department</h2>
          <form onSubmit={handleAddDepartment}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Department Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Computer Science"
                required
              />
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">
                  Faculty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Aliases (comma-separated)"
              value={formData.aliases}
              onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
              placeholder="e.g., comp sci, computing, cs"
              helper="Alternative names for fuzzy search matching"
            />
            <div className="mt-4">
              <Textarea
                label="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Department
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Faculties & Departments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : faculties.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {faculties.map((faculty) => (
              <div key={faculty.id}>
                {/* Faculty Header */}
                <button
                  onClick={() => toggleFaculty(faculty.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedFaculties[faculty.id] ? (
                      <FiChevronDown className="w-5 h-5 text-dark-400" />
                    ) : (
                      <FiChevronRight className="w-5 h-5 text-dark-400" />
                    )}
                    <span className="font-semibold text-dark-900">{faculty.name}</span>
                    <Badge variant="default" size="sm">
                      {faculty.departments?.length || 0} depts
                    </Badge>
                  </div>
                </button>

                {/* Departments */}
                {expandedFaculties[faculty.id] && faculty.departments?.length > 0 && (
                  <div className="bg-gray-50 px-4 py-2">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-dark-500 uppercase">
                          <th className="text-left py-2 px-3">Department</th>
                          <th className="text-left py-2 px-3">Topics</th>
                          <th className="text-right py-2 px-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faculty.departments.map((dept) => (
                          <tr key={dept.id} className="border-t border-gray-200">
                            <td className="py-3 px-3">
                              <span className="text-dark-800">{dept.name}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-dark-600">{dept._count?.topics || 0}</span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setEditingDepartment(dept)}
                                  className="p-1.5 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDepartment(dept.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-dark-500">
            <p>No faculties found. Run the database seeder first.</p>
          </div>
        )}
      </div>
    </div>
  )
}