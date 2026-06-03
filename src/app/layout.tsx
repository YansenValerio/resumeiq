import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AuthProvider } from '@/components/AuthProvider'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resumeiq.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'ResumeIQ — Lolos ATS dalam 20 Detik',
    template: '%s · ResumeIQ',
  },
  description:
    'AI-powered resume analyzer yang kasih tahu kenapa CV-mu ditolak — dan cara memperbaikinya. Gratis untuk semua job seeker Indonesia.',
  keywords: ['resume', 'ATS', 'CV', 'analisis CV', 'job seeker', 'Indonesia'],
  applicationName: 'ResumeIQ',
  openGraph: {
    title: 'ResumeIQ — Lolos ATS dalam 20 Detik',
    description: 'AI-powered resume analyzer gratis untuk job seeker Indonesia.',
    url: APP_URL,
    siteName: 'ResumeIQ',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeIQ — Lolos ATS dalam 20 Detik',
    description: 'AI-powered resume analyzer gratis untuk job seeker Indonesia.',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366F1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-white text-slate-900 selection:bg-brand-200 selection:text-brand-900`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
