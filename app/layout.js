// app/layout.jsx
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

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
  description: 'Get quality project writing, thesis, dissertation, data analysis, and research services. Trusted by students across Nigerian universities. Chapter 1-5 available for all departments.',
  keywords: [
    'project writing',
    'thesis writing',
    'dissertation writing',
    'academic writing services',
    'Nigeria project help',
    'final year project',
    'research proposal',
    'data analysis SPSS',
    'assignment help Nigeria',
    'undergraduate project',
    'masters thesis',
    'PhD dissertation',
  ],
  authors: [{ name: 'AlimsWrite' }],
  creator: 'AlimsWrite',
  publisher: 'AlimsWrite',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://alimswrite.com',
    siteName: 'AlimsWrite',
    title: 'AlimsWrite - Professional Academic Writing Services in Nigeria',
    description: 'Get quality project writing, thesis, dissertation, data analysis, and research services. Trusted by students across Nigerian universities.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AlimsWrite - Academic Writing Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlimsWrite - Professional Academic Writing Services',
    description: 'Get quality project writing, thesis, dissertation, and data analysis services.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1E3A8A" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}