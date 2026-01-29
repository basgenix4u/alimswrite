// app/admin/settings/page.jsx
'use client'

export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { FiSave, FiGlobe, FiPhone, FiMail, FiShare2, FiSearch, FiLayout } from 'react-icons/fi'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteName: '',
    tagline: '',
    whatsappNumber: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    googleAnalytics: '',
    primaryColor: '',
    secondaryColor: '',
    chatEnabled: true,
    popupEnabled: true,
    chatTimeout: 60,
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: FiGlobe },
    { id: 'contact', label: 'Contact', icon: FiPhone },
    { id: 'social', label: 'Social Media', icon: FiShare2 },
    { id: 'seo', label: 'SEO', icon: FiSearch },
    { id: 'appearance', label: 'Appearance', icon: FiLayout },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Settings</h1>
          <p className="text-dark-500 mt-1">Manage your website settings</p>
        </div>
        <Button variant="primary" onClick={handleSave} loading={isSaving}>
          <FiSave className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-dark-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* General */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">General Settings</h2>
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="AlimsWrite"
                />
                <Input
                  label="Tagline"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="Your Academic Writing Partner"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={settings.chatEnabled}
                      onChange={(e) => setSettings({ ...settings, chatEnabled: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-dark-900">Enable Chat Widget</p>
                      <p className="text-sm text-dark-500">Show live chat on website</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={settings.popupEnabled}
                      onChange={(e) => setSettings({ ...settings, popupEnabled: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-dark-900">Enable Welcome Popup</p>
                      <p className="text-sm text-dark-500">Show popup for first-time visitors</p>
                    </div>
                  </label>
                </div>
                <Input
                  label="Chat Timeout (seconds)"
                  type="number"
                  value={settings.chatTimeout}
                  onChange={(e) => setSettings({ ...settings, chatTimeout: parseInt(e.target.value) })}
                  helper="Time before showing WhatsApp fallback in chat"
                />
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Contact Information</h2>
                <Input
                  label="WhatsApp Number"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="09039611238"
                />
                <Input
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="09039611238"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="contact@alimswrite.com"
                />
                <Textarea
                  label="Address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Lagos, Nigeria"
                  rows={3}
                />
              </div>
            )}

            {/* Social Media */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Social Media Links</h2>
                <Input
                  label="Facebook"
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="https://facebook.com/alimswrite"
                />
                <Input
                  label="Twitter"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  placeholder="https://twitter.com/alimswrite"
                />
                <Input
                  label="Instagram"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/alimswrite"
                />
                <Input
                  label="LinkedIn"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/alimswrite"
                />
              </div>
            )}

            {/* SEO */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">SEO Settings</h2>
                <Input
                  label="Meta Title"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="AlimsWrite - Professional Academic Writing Services"
                  helper="Recommended: 50-60 characters"
                />
                <Textarea
                  label="Meta Description"
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Get quality project writing, thesis, dissertation, and data analysis services..."
                  rows={3}
                  helper="Recommended: 150-160 characters"
                />
                <Textarea
                  label="Meta Keywords"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                  placeholder="project writing, thesis, dissertation, Nigeria"
                  rows={2}
                  helper="Comma-separated keywords"
                />
                <Input
                  label="Google Analytics ID"
                  value={settings.googleAnalytics}
                  onChange={(e) => setSettings({ ...settings, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
              </div>
            )}

            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-dark-900 mb-4">Appearance</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor || '#1E3A8A'}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <Input
                        value={settings.primaryColor || '#1E3A8A'}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        placeholder="#1E3A8A"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-2">
                      Secondary Color (Gold)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.secondaryColor || '#F59E0B'}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <Input
                        value={settings.secondaryColor || '#F59E0B'}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        placeholder="#F59E0B"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-dark-500">
                    Color changes will take effect after saving and refreshing the page.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}