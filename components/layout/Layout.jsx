// components/layout/Layout.jsx
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '@/components/common/WhatsAppButton'
import ChatWidget from '@/components/common/ChatWidget'
import FirstVisitPopup from '@/components/common/FirstVisitPopup'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* Floating Elements */}
      <WhatsAppButton />
      <ChatWidget />
      <FirstVisitPopup />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}