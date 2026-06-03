'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')
  const { user, signOut, loading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300 ${
        scrolled ? 'nav-scrolled' : ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight grad-text">ResumeIQ</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <Link href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Features</Link>
          <Link href="#how-it-works" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">How it Works</Link>
          <Link href="#testimonials" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">Stories</Link>
          <Link href="#faq" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">FAQ</Link>
        </nav>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="Language" className="hidden items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium sm:flex">
            <button
              onClick={() => setLang('ID')}
              className={`rounded-full px-2.5 py-1 transition ${lang === 'ID' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
              aria-pressed={lang === 'ID'}
            >
              ID
            </button>
            <button
              onClick={() => setLang('EN')}
              className={`rounded-full px-2.5 py-1 transition ${lang === 'EN' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
              aria-pressed={lang === 'EN'}
            >
              EN
            </button>
          </div>
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:inline-flex">
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:inline-flex">
                  Masuk
                </Link>
                <Link
                  href="/analyze"
                  className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-violet2-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 hover:scale-[1.02]"
                >
                  Analyze Free
                  <svg className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
