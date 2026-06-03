import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ResumeIQ — AI Resume Analyzer',
    short_name: 'ResumeIQ',
    description:
      'AI-powered resume analyzer & ATS score checker gratis untuk job seeker Indonesia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#6366F1',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
