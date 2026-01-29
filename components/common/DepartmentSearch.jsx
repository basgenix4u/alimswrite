// components/common/DepartmentSearch.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { FiSearch, FiCheck } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export default function DepartmentSearch({
  onSelect,
  placeholder = "Search for your department...",
  showCustomOption = true,
  selectedDepartment = null,
  className,
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const wrapperRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search departments
  useEffect(() => {
    const searchDepartments = async () => {
      if (query.length < 2) {
        setResults([])
        setShowCustom(false)
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch(`/api/departments/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        
        setResults(data.departments || [])
        setShowCustom(showCustomOption && data.departments?.length === 0)
        setIsOpen(true)
      } catch (error) {
        console.error('Department search error:', error)
        setResults([])
        setShowCustom(showCustomOption)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(searchDepartments, 300)
    return () => clearTimeout(debounce)
  }, [query, showCustomOption])

  const handleSelect = (department) => {
    setQuery(department.name)
    setIsOpen(false)
    onSelect(department)
  }

  const handleCustomSelect = () => {
    onSelect({ customValue: query, name: query, id: null })
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Selected Department Badge */}
      {selectedDepartment && (
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
          <FiCheck className="w-4 h-4" />
          <span>{selectedDepartment.name}</span>
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto z-20">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((dept) => (
                <li key={dept.id}>
                  <button
                    onClick={() => handleSelect(dept)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-dark-800">{dept.name}</span>
                    {dept.faculty && (
                      <span className="block text-sm text-dark-400 mt-0.5">
                        {dept.faculty.name}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : showCustom ? (
            <div className="p-4">
              <p className="text-sm text-dark-500 mb-3">
                &quot;{query}&quot; not found in our database.
              </p>
              <button
                onClick={handleCustomSelect}
                className="w-full py-2.5 px-4 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors"
              >
                Use &quot;{query}&quot; anyway
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-dark-400 text-sm">
              No departments found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
