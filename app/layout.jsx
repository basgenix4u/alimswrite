// app/layout.jsx
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SettingsProvider } from '@/lib/SettingsContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://alimswrite.com'),
  title: {
    default: 'AlimsWrite - Professional Academic Writing Services in Nigeria',
    template: '%s | AlimsWrite',
  },
  description: 'Get quality project writing, thesis, dissertation, data analysis, and research services. Trusted by students across Nigerian universities.',
  keywords: [
    'project writing',
    'thesis writing',
    'dissertation writing',
    'academic writing services',
    'Nigeria project help',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://alimswrite.com',
    siteName: 'AlimsWrite',
    title: 'AlimsWrite - Professional Academic Writing Services in Nigeria',
    description: 'Get quality project writing, thesis, dissertation, data analysis, and research services.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A8A" />
      </head>
      <body className={inter.className}>
        <SettingsProvider>
          {children}
          <Toaster position="top-right" />
        </SettingsProvider>
      </body>
    </html>
  )
}