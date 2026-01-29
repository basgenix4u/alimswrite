// app/contact/page.jsx
'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiMessageCircle } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import toast from 'react-hot-toast'

const contactInfo = [
  {
    icon: FaWhatsapp,
    label: 'WhatsApp',
    value: '09039611238',
    href: 'https://wa.me/2349039611238',
    description: 'Fastest response time',
    color: 'bg-green-500',
  },
  {
    icon: FiPhone,
    label: 'Phone',
    value: '09039611238',
    href: 'tel:09039611238',
    description: 'Available 9am - 9pm',
    color: 'bg-primary-600',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'contact@alimswrite.com',
    href: 'mailto:contact@alimswrite.com',
    description: 'Response within 24 hours',
    color: 'bg-secondary-500',
  },
  {
    icon: FiMapPin,
    label: 'Location',
    value: 'Lagos, Nigeria',
    href: null,
    description: 'Serving students nationwide',
    color: 'bg-purple-500',
  },
]

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'New Order' },
  { value: 'quote', label: 'Request a Quote' },
  { value: 'support', label: 'Order Support' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
]

const faqs = [
  {
    question: 'How quickly can I get a response?',
    answer: 'WhatsApp messages are typically answered within minutes during business hours. Emails are responded to within 24 hours.',
  },
  {
    question: 'What are your working hours?',
    answer: 'We are available from 9am to 9pm daily, including weekends. For urgent requests, WhatsApp is the fastest way to reach us.',
  },
  {
    question: 'Can I get a quote before placing an order?',
    answer: 'Yes, absolutely. Send us your requirements via the contact form, WhatsApp, or email, and we will provide a free quote.',
  },
  {
    question: 'Do you offer revisions?',
    answer: 'Yes, we offer free revisions based on supervisor feedback to ensure your project meets the required standards.',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: '',
          subject: '',
          message: '',
        })
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try WhatsApp instead.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-primary-100">
              Have a question or ready to start your project? We are here to help.
              Choose your preferred contact method below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <info.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-dark-900 mb-1">{info.label}</h3>
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <span className="text-dark-600">{info.value}</span>
                )}
                <p className="text-sm text-dark-400 mt-1">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiMessageCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-dark-900">Send Us a Message</h2>
                    <p className="text-sm text-dark-500">Fill out the form and we will get back to you</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label="Phone / WhatsApp"
                      placeholder="e.g., 08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Select
                      label="Inquiry Type"
                      options={inquiryTypes}
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      placeholder="Select type"
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What is your message about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />

                  <Textarea
                    label="Message"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />

                  <Button type="submit" variant="primary" className="w-full" loading={isSubmitting}>
                    <FiSend className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-primary-900 rounded-2xl p-6 md:p-8 text-white">
                <h3 className="text-xl font-semibold mb-4">Prefer Instant Chat?</h3>
                <p className="text-primary-200 mb-6">
                  For the fastest response, chat with us directly on WhatsApp. 
                  Our team is ready to assist you.
                </p>
                <a
                  href="https://wa.me/2349039611238?text=Hello%2C%20I%20have%20an%20inquiry%20about%20your%20services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="whatsapp" className="w-full justify-center" size="lg">
                    <FaWhatsapp className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-dark-900 mb-6">Frequently Asked</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-medium text-dark-900 mb-1">{faq.question}</h4>
                      <p className="text-sm text-dark-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="/faq"
                  className="inline-block mt-4 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                >
                  View All FAQs
                </a>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <FiClock className="w-5 h-5 text-primary-600" />
                  <h3 className="text-xl font-semibold text-dark-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dark-500">Monday - Friday</span>
                    <span className="text-dark-900 font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-500">Saturday</span>
                    <span className="text-dark-900 font-medium">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-500">Sunday</span>
                    <span className="text-dark-900 font-medium">12:00 PM - 6:00 PM</span>
                  </div>
                </div>
                <p className="text-xs text-dark-400 mt-4">
                  Response times may vary during holidays. For urgent requests, please use WhatsApp.
                </p>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-dark-900 mb-4">Follow Us</h3>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                  >
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark-600 hover:bg-primary-900 hover:text-white transition-all"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://wa.me/2349039611238"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-dark-600 hover:bg-green-500 hover:text-white transition-all"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
