// lib/SettingsContext.jsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

const defaultSettings = {
  siteName: 'AlimsWrite',
  tagline: 'Your Academic Writing Partner',
  whatsappNumber: '09039611238',
  email: '',
  phone: '',
  address: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  primaryColor: '#1E3A8A',
  secondaryColor: '#F59E0B',
  accentColor: '#3B82F6',
  metaTitle: 'AlimsWrite - Professional Academic Writing Services',
  metaDescription: 'Get quality project writing services.',
  chatEnabled: true,
  popupEnabled: true,
  chatTimeout: 60,
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      
      if (data.settings) {
        setSettings({ ...defaultSettings, ...data.settings })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshSettings = () => {
    fetchSettings()
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    // Return defaults if used outside provider
    return { settings: defaultSettings, loading: false, refreshSettings: () => {} }
  }
  return context
}
