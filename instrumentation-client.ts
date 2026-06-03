// Sentry config untuk browser (client-side). Sentry >= 9 pakai file ini
// menggantikan sentry.client.config.ts. No-op kalau DSN belum diisi.
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'development',
  tracesSampleRate: 0.2,
  // Session Replay hanya saat ada error, biar hemat quota.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: dsn ? 1.0 : 0,
  sendDefaultPii: false,
  debug: false,
})

// Wajib di-export agar navigasi App Router ke-trace dengan benar.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
