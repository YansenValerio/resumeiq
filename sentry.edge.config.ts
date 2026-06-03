// Sentry config untuk runtime Edge (middleware, edge routes seperti opengraph-image).
// No-op otomatis kalau DSN belum diisi.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.VERCEL_ENV || 'development',
  tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.2 : 1.0,
  sendDefaultPii: false,
  debug: false,
})
