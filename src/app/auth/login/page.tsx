'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const hasError = searchParams.get('error') === 'auth_failed'

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(hasError ? 'Autentikasi gagal. Coba lagi.' : null)

  const supabase = createClient()

  async function signInWithGoogle() {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  async function signInWithMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 selection:bg-brand-200 selection:text-brand-900">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-transparent to-violet2-50/40" />
        <div className="grid-bg absolute inset-0 opacity-60" />
      </div>

      {/* Nav */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </span>
            <span className="text-[17px] font-semibold tracking-tight grad-text">ResumeIQ</span>
          </Link>
        </div>
      </header>

      {/* Card */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-float">
            {/* Glow */}
            <div aria-hidden className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-brand-400/20 via-violet2-400/10 to-transparent blur-xl" />

            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Masuk ke ResumeIQ</h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Simpan analisis dan lacak progress CV-mu.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                <p className="text-[13px] text-rose-800">{error}</p>
              </div>
            )}

            {sent ? (
              /* Magic link sent state */
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">Cek email kamu!</h3>
                <p className="mt-1.5 text-[13px] text-slate-600">
                  Link masuk sudah dikirim ke <strong>{email}</strong>. Klik link di email untuk melanjutkan.
                </p>
                <button onClick={() => setSent(false)} className="mt-4 text-[12px] font-medium text-brand-600 hover:underline">
                  Kirim ulang →
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {/* Google OAuth */}
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Lanjutkan dengan Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">atau</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                {/* Magic link */}
                <form onSubmit={signInWithMagicLink} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-[12px] font-medium text-slate-700 mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="kamu@gmail.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mengirim…' : 'Kirim magic link'}
                  </button>
                </form>
              </div>
            )}

            <p className="mt-6 text-center text-[11px] text-slate-500">
              Dengan masuk, kamu menyetujui{' '}
              <Link href="#" className="font-medium text-slate-700 hover:underline">Privacy Policy</Link>
              {' '}dan{' '}
              <Link href="#" className="font-medium text-slate-700 hover:underline">Terms of Service</Link>
              {' '}ResumeIQ.
            </p>
          </div>

          <p className="mt-4 text-center text-[12px] text-slate-500">
            Ingin coba dulu?{' '}
            <Link href="/analyze" className="font-medium text-brand-600 hover:underline">
              Analisis tanpa akun →
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginForm />
    </Suspense>
  )
}
