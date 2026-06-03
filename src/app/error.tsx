'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="relative">
        <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-rose-400/20 to-amber-400/20 blur-3xl" />
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v10M12 16h.01M5 22h14a2 2 0 0 0 1.74-3l-7-12a2 2 0 0 0-3.48 0l-7 12A2 2 0 0 0 5 22Z"/>
          </svg>
        </div>
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900">
        Terjadi kesalahan
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Ada sesuatu yang tidak berjalan dengan benar. Coba refresh halaman atau kembali ke beranda.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-[11px] text-slate-400">Error ID: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>
          </svg>
          Coba Lagi
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  )
}
