import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {}

// withSentryConfig aman dipanggil tanpa DSN/auth token — source map upload
// otomatis di-skip kalau SENTRY_AUTH_TOKEN tidak ada (build tetap lolos).
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Sembunyikan & hanya upload source map saat token tersedia.
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Route tunneling agar event tidak diblok ad-blocker.
  tunnelRoute: '/monitoring',
  // Hapus log Sentry dari bundle produksi.
  disableLogger: true,
  // Jangan instrument route Vercel Cron secara otomatis.
  automaticVercelMonitors: false,
})
