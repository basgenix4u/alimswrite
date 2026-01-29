// components/common/FirstVisitPopup.jsx
'use client'

import { useState, useEffect } from 'react'
import { FiX, FiPhone, FiArrowRight } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import DepartmentSearch from '@/components/common/DepartmentSearch'
import { cn } from '@/lib/utils'

const serviceOptions = [
  { id: 'project', label: 'Project Writing (Chapter 1-5)' },
  { id: 'topics', label: 'Find Project Topics' },
  { id: 'analysis', label: 'Data Analysis (SPSS, Excel, R)' },
  { id: 'thesis', label: 'Thesis or Dissertation' },
  { id: 'assignment', label: 'Assignment Help' },
  { id: 'other', label: 'Other Services' },
]

export default function FirstVisitPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    service: '',
    department: '',
    departmentId: '',
    description: '',
    phone: '',
    name: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Check if popup has been shown before
    const hasSeenPopup = localStorage.getItem('alimswrite_popup_seen')
    const lastSeen = localStorage.getItem('alimswrite_popup_timestamp')
    
    // Show popup if never seen or if it's been more than 24 hours
    const shouldShow = !hasSeenPopup || 
      (lastSeen && Date.now() - parseInt(lastSeen) > 24 * 60 * 60 * 1000)

    if (shouldShow) {
      // Delay popup to not interrupt initial experience
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('alimswrite_popup_seen', 'true')
    localStorage.setItem('alimswrite_popup_timestamp', Date.now().toString())
  }

  const handleSkip = () => {
    handleClose()
  }

  const handleServiceSelect = (serviceId) => {
    setFormData({ ...formData, service: serviceId })
    setStep(2)
  }

  const handleDepartmentSelect = (dept) => {
    setFormData({ 
      ...formData, 
      department: dept.name || dept.customValue,
      departmentId: dept.id || ''
    })
    setStep(3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'popup',
          serviceNeeded: formData.service,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Store in localStorage that user has interacted
        localStorage.setItem('alimswrite_user_department', formData.department)
        
        // Close popup after showing success
        setTimeout(() => {
          handleClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Popup submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-dark-400 hover:text-dark-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white px-6 py-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to AlimsWrite</h2>
          <p className="text-primary-100">
            Let us help you find exactly what you need
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            // Success State
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-dark-900 mb-2">Thank You!</h3>
              <p className="text-dark-500">
                We have received your request. Our team will call you back shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-colors',
                      step >= s ? 'bg-primary-900' : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>

              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 text-center mb-4">
                    What do you need help with?
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {serviceOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleServiceSelect(option.id)}
                        className="flex items-center justify-between w-full p-4 text-left border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                      >
                        <span className="font-medium text-dark-700 group-hover:text-primary-900">
                          {option.label}
                        </span>
                        <FiArrowRight className="w-5 h-5 text-dark-300 group-hover:text-primary-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Department Selection */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-dark-900 text-center mb-4">
                    What is your department?
                  </h3>
                  <DepartmentSearch
                    onSelect={handleDepartmentSelect}
                    placeholder="Type to search your department..."
                    showCustomOption={true}
                  />
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-sm text-dark-500 hover:text-primary-600 transition-colors"
                  >
                    Back to services
                  </button>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold text-dark-900 text-center mb-4">
                    How can we reach you?
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Your Name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="WhatsApp Number"
                      placeholder="e.g., 08012345678"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                    <Textarea
                      label="Brief Description (Optional)"
                      placeholder="Tell us more about your project..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      type="submit"
                      loading={isSubmitting}
                      className="w-full justify-center"
                    >
                      <FiPhone className="w-4 h-4 mr-2" />
                      Request Callback
                    </Button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full text-sm text-dark-500 hover:text-primary-600 transition-colors"
                    >
                      Back to department
                    </button>
                  </div>
                </form>
              )}

              {/* Skip Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleSkip}
                  className="text-sm text-dark-400 hover:text-dark-600 transition-colors"
                >
                  Skip for now, I will browse on my own
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}