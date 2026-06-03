'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { AnalysisResult } from '@/types/analysis'
import { mockAnalysisResult } from '@/lib/mock-data'
import ScoreRing from '@/components/result/ScoreRing'
import AnimatedBar from '@/components/result/AnimatedBar'
import OverviewPanel from '@/components/result/OverviewPanel'
import KeywordsPanel from '@/components/result/KeywordsPanel'
import SectionsPanel from '@/components/result/SectionsPanel'
import ImprovementsPanel from '@/components/result/ImprovementsPanel'
import RevealInit from '@/components/landing/RevealInit'

// ─── Types ───────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'keywords' | 'sections' | 'improvements'

interface StoredResult {
  result: AnalysisResult
  meta: { language: string; duration_ms: number }
  fileName: string
  jdText: string
  analyzedAt: string
  analysisId?: string | null
  isSaved?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  })
}

function extractTitle(jd: string): string {
  const lines = jd.split('\n').slice(0, 3)
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length > 3 && trimmed.length < 80) return trimmed.split('·')[0].trim()
  }
  return 'Posisi'
}

function barColor(score: number) {
  if (score >= 70) return 'from-emerald-400 to-emerald-500'
  if (score >= 50) return 'from-amber-400 to-amber-500'
  return 'from-rose-400 to-rose-500'
}

// ─── Tab strip ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'keywords',     label: 'Keywords' },
  { id: 'sections',     label: 'Section Analysis' },
  { id: 'improvements',label: 'Improvements' },
]

// ─── Main page ───────────────────────────────────────────────────────────────

export default function ResultPage() {
  const router = useRouter()
  const [data, setData] = useState<StoredResult | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('resumeiq.result')
      if (raw) {
        setData(JSON.parse(raw))
      } else {
        // Use mock data for development / direct navigation
        setData({
          result: mockAnalysisResult,
          meta: { language: 'id', duration_ms: 3200 },
          fileName: 'Resume_Demo.pdf',
          jdText: 'Senior Frontend Engineer · Demo Company',
          analyzedAt: new Date().toISOString(),
        })
      }
    } catch {
      router.push('/analyze')
    }
  }, [router])

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <p className="mt-4 text-sm text-slate-500">Memuat hasil analisis…</p>
        </div>
      </div>
    )
  }

  const { result, fileName, jdText, analyzedAt, meta, analysisId, isSaved } = data
  const jobTitle = extractTitle(jdText)
  const missingCount = result.keyword_match.missing_critical.length + result.keyword_match.missing_nice_to_have.length
  const highCount = result.top_improvements.filter(i => i.priority === 'high').length

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-brand-200 selection:text-brand-900">
      <RevealInit />

      {/* ── Print-only header (hidden on screen) ── */}
      <div className="print-only hidden border-b-2 border-slate-200 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <span className="text-lg font-semibold grad-text">ResumeIQ</span>
          <span className="ml-auto font-mono text-[11px] text-slate-500">
            Dicetak {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-semibold text-slate-900">{fileName} vs {jobTitle}</h1>
          <p className="mt-1 font-mono text-[11px] text-slate-500">
            Overall Score: {result.overall_score}/100 · ATS: {result.ats_compatibility}% · Keywords: {result.keyword_match.match_percentage}%
          </p>
        </div>
      </div>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur no-print">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              <Link href="/" className="hover:text-slate-900">Home</Link>
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <Link href="/analyze" className="hover:text-slate-900">Analysis</Link>
              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              <span className="text-slate-900">Result</span>
            </nav>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h1 className="text-sm font-semibold text-slate-900 sm:text-base">
                <span className="font-mono text-[12px] text-slate-700">{fileName}</span>
                <span className="mx-1 text-slate-400">vs</span>
                <span>{jobTitle}</span>
              </h1>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                · {formatDate(analyzedAt)} · {(meta.duration_ms / 1000).toFixed(1)}s
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Saved badge */}
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/60">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
                Tersimpan
              </span>
            )}
            {!isSaved && (
              <Link href="/auth/login?next=/dashboard" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Simpan
              </Link>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              PDF
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </button>
            <Link href="/analyze" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>
              </svg>
              Re-analyze
            </Link>
            <Link href="/analyze" className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              New
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-emerald-50/40 via-brand-50/30 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg" />

        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">

          {/* ── Hero score section ── */}
          <section aria-labelledby="hero-h" className="reveal">
            <div className="grid items-center gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-card backdrop-blur sm:p-8 lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-10">
              <ScoreRing score={result.overall_score} size="lg" />

              <div>
                <h2 id="hero-h" className="text-balance text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  {result.overall_score >= 70
                    ? <><span className="grad-text">Good match</span> — minor improvements needed.</>
                    : result.overall_score >= 50
                    ? <><span className="grad-text">Fair match</span> — several areas need work.</>
                    : <><span className="text-rose-600">Needs improvement</span> — significant gaps found.</>
                  }
                </h2>
                <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base">
                  {result.strengths[0] ?? 'CV-mu sudah punya beberapa kekuatan.'} Apply {highCount} prioritas utama untuk meningkatkan skor.
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">ATS Compat.</dt>
                    <dd className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">
                        {result.ats_compatibility}<span className="text-base text-slate-400">%</span>
                      </span>
                    </dd>
                    <div className="mt-2">
                      <AnimatedBar pct={result.ats_compatibility} color={barColor(result.ats_compatibility)} height="h-1" delay={300} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Keyword Match</dt>
                    <dd className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">
                        {result.keyword_match.match_percentage}<span className="text-base text-slate-400">%</span>
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {result.keyword_match.matched.length}/{result.keyword_match.matched.length + missingCount}
                      </span>
                    </dd>
                    <div className="mt-2">
                      <AnimatedBar pct={result.keyword_match.match_percentage} color={barColor(result.keyword_match.match_percentage)} height="h-1" delay={380} />
                    </div>
                  </div>
                  <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-3.5 sm:col-span-1">
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Sections</dt>
                    <dd className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">
                        4<span className="text-base text-slate-400">/4</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-600">complete</span>
                    </dd>
                    <div className="mt-2 flex gap-1">
                      {['summary','experience','skills','education'].map(k => (
                        <span key={k} className="h-1 flex-1 rounded-full bg-emerald-400" />
                      ))}
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* ── Main content + sidebar ── */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px] lg:gap-8">

            {/* Main column */}
            <div>
              {/* Tab strip */}
              <div
                role="tablist"
                aria-label="Result sections"
                className="tab-strip mb-4 flex w-full gap-1 overflow-x-auto rounded-full border border-slate-200 bg-slate-100/80 p-1 backdrop-blur"
              >
                {TABS.map((tab) => {
                  const badge = tab.id === 'keywords'
                    ? missingCount
                    : tab.id === 'improvements'
                    ? highCount
                    : null
                  const badgeColor = tab.id === 'keywords' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'

                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      className="tab-btn flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="tab-bg" />
                      <span>{tab.label}</span>
                      {badge !== null && badge > 0 && (
                        <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${badgeColor}`}>
                          {badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Panels */}
              <section className={`panel ${activeTab === 'overview' ? 'active' : ''}`} role="tabpanel">
                <OverviewPanel result={result} onGoToTab={(t) => setActiveTab(t as TabId)} />
              </section>
              <section className={`panel ${activeTab === 'keywords' ? 'active' : ''}`} role="tabpanel">
                <KeywordsPanel result={result} />
              </section>
              <section className={`panel ${activeTab === 'sections' ? 'active' : ''}`} role="tabpanel">
                <SectionsPanel result={result} />
              </section>
              <section className={`panel ${activeTab === 'improvements' ? 'active' : ''}`} role="tabpanel">
                <ImprovementsPanel result={result} />
              </section>
            </div>

            {/* ── Sidebar (desktop) ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Mini score card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <div className="flex items-center gap-3">
                    <ScoreRing score={result.overall_score} size="sm" />
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Overall</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {result.overall_score >= 70 ? 'Good match' : result.overall_score >= 50 ? 'Fair match' : 'Needs work'}
                      </div>
                      <div className="font-mono text-[10px] text-emerald-600">+{result.overall_score - 59} dari rata-rata</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-slate-50 p-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">ATS</div>
                      <div className="text-sm font-semibold text-slate-900">{result.ats_compatibility}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">KW</div>
                      <div className="text-sm font-semibold text-slate-900">{result.keyword_match.match_percentage}</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Sec</div>
                      <div className="text-sm font-semibold text-slate-900">4/4</div>
                    </div>
                  </div>
                </div>

                {/* Quick nav */}
                <nav aria-label="Quick nav" className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-soft">
                  {TABS.map((tab) => {
                    const badge = tab.id === 'keywords' ? missingCount : tab.id === 'improvements' ? highCount : null
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition hover:bg-slate-50 ${activeTab === tab.id ? 'bg-slate-50 text-slate-900' : 'text-slate-700'}`}
                      >
                        <span>{tab.label}</span>
                        {badge !== null && badge > 0 ? (
                          <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${tab.id === 'keywords' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {badge}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-400">→</span>
                        )}
                      </button>
                    )
                  })}
                </nav>

                {/* Save CTA — only for guests */}
                {!isSaved && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-600 to-violet2-600 p-4 text-white shadow-glow">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-100">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      Save analysis
                    </div>
                    <p className="mt-2 text-pretty text-[13px] leading-relaxed">Sign up untuk simpan analisis ini dan bandingkan revisi berikutnya.</p>
                    <Link href="/auth/login?next=/dashboard" className="mt-3 block w-full rounded-full bg-white px-3 py-2 text-center text-xs font-semibold text-brand-700 transition hover:bg-brand-50">
                      Buat akun gratis
                    </Link>
                    <div className="mt-2 text-center text-[10px] text-brand-100">No credit card · 10 detik</div>
                  </div>
                )}
                {isSaved && analysisId && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-800">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7"/>
                      </svg>
                      Tersimpan di akun kamu
                    </div>
                    <p className="mt-1.5 text-[11px] text-emerald-700">Lihat di Dashboard untuk membandingkan revisi.</p>
                    <Link href="/dashboard" className="mt-3 block w-full rounded-full bg-emerald-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-emerald-700">
                      Lihat Dashboard →
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* ── Bottom CTA ── */}
          <section className="reveal mt-16 sm:mt-20 no-print">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-float">
              <div className="grid items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:gap-10 md:p-10">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-300">Next step</span>
                  <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                    Ready to ship a better version?
                  </h2>
                  <p className="mt-2 max-w-md text-pretty text-[14px] leading-relaxed text-slate-300">
                    Apply {highCount} prioritas utama, lalu re-analyze. Estimasi skor naik ke{' '}
                    <span className="font-semibold text-white">{Math.min(result.overall_score + 15, 100)}+</span>.
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Share:</span>
                    {[
                      { label: 'LinkedIn', path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z' },
                      { label: 'Twitter', path: 'M18.244 2H21.5l-7.5 8.57L23 22h-6.91l-4.83-6.31L5.6 22H2.34l8.02-9.17L1.5 2h7.08l4.36 5.77L18.244 2Z' },
                    ].map((s) => (
                      <button key={s.label} aria-label={`Share ${s.label}`} className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-slate-900">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d={s.path}/></svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <button className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet2-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 hover:scale-[1.02] md:w-auto">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF Report
                  </button>
                  <Link href="/analyze" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 md:w-auto">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>
                    </svg>
                    Re-analyze dengan JD baru
                  </Link>
                  <Link href="/analyze" className="inline-flex w-full items-center justify-center gap-1.5 px-5 py-2 text-xs font-medium text-slate-300 transition hover:text-white md:w-auto">
                    Coba dengan CV lain →
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="h-16" />
        </div>
      </main>
    </div>
  )
}
