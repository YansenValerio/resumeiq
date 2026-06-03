// Sentry config untuk runtime Node.js (server-side).
// Dijalankan via instrumentation.ts -> register().
// No-op otomatis kalau SENTRY_DSN belum diisi (enabled: false).
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.VERCEL_ENV || 'development',
  // Sample 100% di non-prod, 20% di prod biar hemat quota.
  tracesSampleRate: process.env.VERCEL_ENV === 'production' ? 0.2 : 1.0,
  // Jangan kirim PII (isi CV/JD) ke Sentry.
  sendDefaultPii: false,
  debug: false,
})
