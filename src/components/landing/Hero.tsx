'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Hero() {
  const ringRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (ringRef.current) {
        // 87% score: dashoffset = 314 * (1 - 0.87) = ~40.8
        ringRef.current.style.strokeDashoffset = '40.8'
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 -z-10 mesh" />
      <div className="absolute inset-0 -z-10 grid-bg" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="lg:col-span-6 reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              ✨ Gratis Selamanya — tanpa kartu kredit
            </span>

            <h1 className="mt-5 text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] text-slate-900 sm:text-6xl lg:text-[68px]">
              Lolos ATS dalam <span className="grad-text">20&nbsp;detik</span>.
            </h1>

            <p className="mt-5 max-w-xl text-pretty text-[17px] leading-relaxed text-slate-600 sm:text-lg">
              AI-powered analyzer yang kasih tahu{' '}
              <em className="not-italic font-medium text-slate-900">kenapa</em> CV-mu
              ditolak — dan cara memperbaikinya. Gratis untuk semua job seeker Indonesia.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/analyze"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-float transition hover:bg-slate-800 hover:scale-[1.02]"
              >
                Analisis CV Saya
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                Lihat Demo
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200/80 pt-6">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">CV dianalisis</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">5,000<span className="text-brand-500">+</span></dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">Rekomendasi user</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">92<span className="text-brand-500">%</span></dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-slate-500">Rata-rata waktu</dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">18<span className="text-brand-500">s</span></dd>
              </div>
            </dl>
          </div>

          {/* Visual mockup */}
          <div className="lg:col-span-6 reveal">
            <div className="relative mx-auto max-w-[560px]">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-brand-400/40 via-violet2-500/30 to-transparent blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-float backdrop-blur sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">resumeiq.id/result/9f2a</span>
                </div>

                <div className="mt-5 grid grid-cols-5 gap-5">
                  {/* Score ring */}
                  <div className="col-span-2">
                    <div className="relative aspect-square">
                      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                        <defs>
                          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                          </linearGradient>
                        </defs>
                        <circle cx="60" cy="60" r="50" fill="none" className="ring-track" strokeWidth="10" />
                        <circle
                          ref={ringRef}
                          cx="60" cy="60" r="50" fill="none" className="ring-fill"
                          strokeWidth="10" strokeDasharray="314" strokeDashoffset="314"
                        />
                      </svg>
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-slate-400">ATS Score</div>
                          <div className="text-4xl font-semibold tracking-tight text-slate-900">87</div>
                          <div className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 12 5 5L20 7" />
                            </svg>
                            Excellent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown bars */}
                  <div className="col-span-3 space-y-3">
                    {[
                      { label: 'Keyword Match', value: 92, color: 'from-brand-500 to-violet2-500' },
                      { label: 'Format & Structure', value: 88, color: 'from-brand-500 to-violet2-500' },
                      { label: 'Action Verbs', value: 81, color: 'from-brand-500 to-violet2-500' },
                      { label: 'Quantified Impact', value: 74, color: 'from-amber-400 to-amber-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <span className="font-mono text-slate-500">{item.value}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestion row */}
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v10M12 16h.01M5 22h14a2 2 0 0 0 1.74-3l-7-12a2 2 0 0 0-3.48 0l-7 12A2 2 0 0 0 5 22Z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-slate-900">Tambah 3 kata kunci dari JD</div>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {['stakeholder management', 'A/B testing', 'SQL'].map((kw) => (
                          <span key={kw} className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chip: file */}
              <div className="absolute -left-4 top-8 hidden rotate-[-6deg] rounded-xl border border-slate-200 bg-white p-3 shadow-card sm:flex sm:items-center sm:gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </span>
                <div>
                  <div className="text-[12px] font-medium text-slate-900">CV_Sarah_2026.pdf</div>
                  <div className="font-mono text-[10px] text-slate-500">214 KB · diunggah</div>
                </div>
              </div>

              {/* Floating chip: match */}
              <div className="absolute -right-4 bottom-6 hidden rotate-[5deg] items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-card sm:flex">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <div className="text-[12px] font-medium text-slate-900">+42 poin</div>
                  <div className="text-[10px] text-slate-500">setelah revisi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
