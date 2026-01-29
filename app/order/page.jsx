// app/order/page.jsx
'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { FiCheck, FiArrowRight, FiArrowLeft, FiUpload, FiX, FiAlertCircle } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import DepartmentSearch from '@/components/common/DepartmentSearch'
import { cn, projectTypes, levels } from '@/lib/utils'
import toast from 'react-hot-toast'

const steps = [
  { id: 1, title: 'Service', description: 'Select service type' },
  { id: 2, title: 'Details', description: 'Project information' },
  { id: 3, title: 'Contact', description: 'Your information' },
  { id: 4, title: 'Review', description: 'Confirm order' },
]

const services = [
  { id: 'project-writing', name: 'Project Writing (Chapter 1-5)', popular: true },
  { id: 'single-chapter', name: 'Single Chapter Writing', popular: false },
  { id: 'thesis-dissertation', name: 'Thesis / Dissertation', popular: false },
  { id: 'data-analysis', name: 'Data Analysis', popular: true },
  { id: 'research-proposal', name: 'Research Proposal', popular: false },
  { id: 'assignment', name: 'Assignment Writing', popular: false },
  { id: 'siwes-it-report', name: 'SIWES / IT Report', popular: false },
  { id: 'paraphrasing', name: 'Paraphrasing / Rewriting', popular: false },
  { id: 'proofreading', name: 'Proofreading / Editing', popular: false },
  { id: 'powerpoint', name: 'PowerPoint Design', popular: false },
  { id: 'cv-resume', name: 'CV / Resume Writing', popular: false },
  { id: 'sop', name: 'Statement of Purpose', popular: false },
  { id: 'other', name: 'Other Services', popular: false },
]

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1
    service: '',
    // Step 2
    projectTitle: '',
    department: '',
    departmentId: '',
    level: '',
    numberOfChapters: '',
    numberOfPages: '',
    deadline: '',
    description: '',
    attachments: [],
    // Step 3
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    preferredContact: 'whatsapp',
  })
  const [errors, setErrors] = useState({})

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.service) newErrors.service = 'Please select a service'
    }

    if (step === 2) {
      if (!formData.description) newErrors.description = 'Please describe your project requirements'
    }

    if (step === 3) {
      if (!formData.name) newErrors.name = 'Please enter your name'
      if (!formData.email) newErrors.email = 'Please enter your email'
      if (!formData.phone) newErrors.phone = 'Please enter your phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast.success('Order submitted successfully!')
      } else {
        throw new Error('Failed to submit order')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try WhatsApp instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getWhatsAppLink = () => {
    const message = `Hello, I would like to place an order:

Service: ${services.find(s => s.id === formData.service)?.name || formData.service}
${formData.projectTitle ? `Topic: ${formData.projectTitle}` : ''}
${formData.department ? `Department: ${formData.department}` : ''}
${formData.level ? `Level: ${formData.level}` : ''}
${formData.deadline ? `Deadline: ${formData.deadline}` : ''}

Description:
${formData.description || 'Not provided'}

Contact:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}`

    return `https://wa.me/2349039611238?text=${encodeURIComponent(message)}`
  }

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20 md:py-32">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-dark-900 mb-4">
              Order Received!
            </h1>
            <p className="text-lg text-dark-500 mb-8">
              Thank you for your order. We have received your request and will contact you 
              shortly via WhatsApp to discuss the details and provide a quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  <FaWhatsapp className="w-5 h-5 mr-2" />
                  Chat Now for Faster Response
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" size="lg">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Project
          </h1>
          <p className="text-primary-100">
            Fill out the form below and we will get back to you with a quote within hours.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                        ? 'bg-primary-900 text-white'
                        : 'bg-gray-200 text-dark-500'
                  )}>
                    {currentStep > step.id ? (
                      <FiCheck className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center hidden sm:block">
                    <div className={cn(
                      'text-sm font-medium',
                      currentStep >= step.id ? 'text-dark-900' : 'text-dark-400'
                    )}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-12 sm:w-24 h-0.5 mx-2',
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="py-8 md:py-12 bg-gray-50 min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  What service do you need?
                </h2>
                <p className="text-dark-500 mb-6">
                  Select the type of service you require. You can provide more details in the next step.
                </p>

                {errors.service && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.service}
                  </div>
                )}

                <div className="grid gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => updateFormData('service', service.id)}
                      className={cn(
                        'flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left',
                        formData.service === service.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          formData.service === service.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        )}>
                          {formData.service === service.id && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={cn(
                          'font-medium',
                          formData.service === service.id ? 'text-primary-900' : 'text-dark-700'
                        )}>
                          {service.name}
                        </span>
                      </div>
                      {service.popular && (
                        <span className="px-2 py-0.5 bg-secondary-100 text-secondary-700 text-xs font-medium rounded-full">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Tell us about your project
                </h2>
                <p className="text-dark-500 mb-6">
                  Provide as much detail as possible to help us understand your requirements.
                </p>

                <div className="space-y-5">
                  <Input
                    label="Project Topic / Title"
                    placeholder="Enter your project topic (if you have one)"
                    value={formData.projectTitle}
                    onChange={(e) => updateFormData('projectTitle', e.target.value)}
                    helper="Leave blank if you need topic suggestions"
                  />

                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">
                      Department
                    </label>
                    <DepartmentSearch
                      onSelect={(dept) => {
                        updateFormData('department', dept.name || dept.customValue)
                        updateFormData('departmentId', dept.id || '')
                      }}
                      placeholder="Search for your department..."
                      showCustomOption={true}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select
                      label="Academic Level"
                      value={formData.level}
                      onChange={(e) => updateFormData('level', e.target.value)}
                      options={levels.map(l => ({ value: l, label: l }))}
                      placeholder="Select level"
                    />
                    <Input
                      label="Deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateFormData('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Number of Chapters"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.numberOfChapters}
                      onChange={(e) => updateFormData('numberOfChapters', e.target.value)}
                      min="1"
                      max="10"
                    />
                    <Input
                      label="Number of Pages"
                      type="number"
                      placeholder="e.g., 75"
                      value={formData.numberOfPages}
                      onChange={(e) => updateFormData('numberOfPages', e.target.value)}
                      min="1"
                    />
                  </div>

                  <Textarea
                    label="Project Description / Requirements"
                    placeholder="Describe your project requirements, special instructions, or any other details we should know..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    rows={5}
                    required
                    error={errors.description}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Your Contact Information
                </h2>
                <p className="text-dark-500 mb-6">
                  We will use this information to contact you with a quote and project updates.
                </p>

                <div className="space-y-5">
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    required
                    error={errors.name}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    required
                    error={errors.email}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g., 08012345678"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    required
                    error={errors.phone}
                  />

                  <Input
                    label="WhatsApp Number"
                    type="tel"
                    placeholder="Same as phone or different"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData('whatsapp', e.target.value)}
                    helper="Leave blank if same as phone number"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-dark-900 mb-2">
                  Review Your Order
                </h2>
                <p className="text-dark-500 mb-6">
                  Please review your information before submitting.
                </p>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-dark-900 mb-3">Service</h3>
                    <p className="text-dark-600">
                      {services.find(s => s.id === formData.service)?.name}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-dark-900 mb-3">Project Details</h3>
                    <div className="space-y-2 text-sm">
                      {formData.projectTitle && (
                        <div className="flex justify-between">
                          <span className="text-dark-500">Topic:</span>
                          <span className="text-dark-700 font-medium">{formData.projectTitle}</span>
                        </div>
                      )}
                      {formData.department && (
                        <div className="flex justify-between">
                          <span className="text-dark-500">Department:</span>
                          <span className="text-dark-700">{formData.department}</span>
                        </div>
                      )}
                      {formData.level && (
                        <div className="flex justify-between">
                          <span className="text-dark-500">Level:</span>
                          <span className="text-dark-700">{formData.level}</span>
                        </div>
                      )}
                      {formData.deadline && (
                        <div className="flex justify-between">
                          <span className="text-dark-500">Deadline:</span>
                          <span className="text-dark-700">{formData.deadline}</span>
                        </div>
                      )}
                      {formData.description && (
                        <div className="pt-2 border-t border-gray-200 mt-2">
                          <span className="text-dark-500 block mb-1">Description:</span>
                          <p className="text-dark-700">{formData.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-dark-900 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-dark-500">Name:</span>
                        <span className="text-dark-700">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-500">Email:</span>
                        <span className="text-dark-700">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-500">Phone:</span>
                        <span className="text-dark-700">{formData.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-xl">
                    <h3 className="font-medium text-dark-900 mb-2">What Happens Next?</h3>
                    <ul className="space-y-2 text-sm text-dark-600">
                      <li className="flex items-start gap-2">
                        <FiCheck className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                        We review your requirements within 1-2 hours
                      </li>
                      <li className="flex items-start gap-2">
                        <FiCheck className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                        We contact you via WhatsApp with a quote
                      </li>
                      <li className="flex items-start gap-2">
                        <FiCheck className="w-4 h-4 text-secondary-600 mt-0.5 flex-shrink-0" />
                        Work begins immediately after payment confirmation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button variant="ghost" onClick={prevStep}>
                  <FiArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button variant="primary" onClick={nextStep}>
                  Continue
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-3">
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <Button variant="whatsapp">
                      <FaWhatsapp className="w-4 h-4 mr-2" />
                      Submit via WhatsApp
                    </Button>
                  </a>
                  <Button variant="primary" onClick={handleSubmit} loading={isSubmitting}>
                    Submit Order
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Contact */}
          <div className="mt-6 text-center">
            <p className="text-dark-500 text-sm">
              Prefer to chat directly?{' '}
              <a
                href="https://wa.me/2349039611238"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 font-medium hover:text-primary-700"
              >
                Message us on WhatsApp
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
