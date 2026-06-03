'use client'

// Menangkap error yang terjadi di root layout / di luar jangkauan error.tsx.
// Wajib me-render <html>/<body> sendiri karena menggantikan root layout.
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Terjadi kesalahan
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Ada sesuatu yang tidak berjalan dengan benar. Coba refresh halaman.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Coba Lagi
        </button>
      </body>
    </html>
  )
}
