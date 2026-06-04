'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

// ─── Types ───────────────────────────────────────────────────────────────────

type ParseStatus = 'idle' | 'parsing' | 'parsed' | 'error'
type SubmitStatus = 'idle' | 'submitting'
type Lang = 'ID' | 'EN'

interface ParseResult {
  text: string
  wordCount: number
  pageCount: number
  detectedLang: 'id' | 'en'
}

interface AppError {
  title: string
  body: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const JD_DRAFT_KEY = 'resumeiq.jd.draft'

const SAMPLE_CV = `SARAH WIJAYA
Senior Product Designer · Jakarta, Indonesia
sarah.wijaya@email.com · +62 812-3456-7890 · linkedin.com/in/sarahwijaya · sarahwijaya.design

SUMMARY
Product Designer dengan 5 tahun pengalaman merancang produk B2B SaaS dan tools berbasis data. Fokus pada design system, riset pengguna, dan kolaborasi lintas tim. Memimpin redesign yang meningkatkan activation rate sebesar 32%.

EXPERIENCE
Senior Product Designer — Kredivo (2022 – Sekarang)
• Memimpin desain end-to-end untuk modul analytics dashboard yang dipakai 12.000+ merchant enterprise.
• Membangun dan memelihara design system di Figma bersama 8 engineer, mengurangi waktu handoff 40%.
• Menjalankan 30+ sesi user interview dan usability testing dengan pelanggan enterprise.
• Bermitra dengan tim Product, Engineering, dan Data Science pada inisiatif cross-functional.

Product Designer — Tokopedia (2019 – 2022)
• Mendesain ulang alur checkout untuk fitur seller, menaikkan konversi 18%.
• Menerapkan A/B testing pada landing page, meningkatkan sign-up 24%.
• Mentoring 2 desainer junior dan berkontribusi pada budaya desain tim.

SKILLS
Figma, Prototyping, Design Tokens, Design Systems, User Research, Usability Testing, A/B Testing, SQL (dasar), HTML/CSS, Stakeholder Management, Agile.

EDUCATION
S1 Desain Komunikasi Visual — Universitas Indonesia (2015 – 2019), IPK 3.78

LANGUAGES
Bahasa Indonesia (native), English (fluent — working proficiency).`

const SAMPLE_JD = `Senior Product Designer · TechCorp Indonesia (Hybrid · Jakarta)

About the role:
We're looking for a Senior Product Designer with 4+ years of experience designing B2B SaaS products. You'll own end-to-end design for a new analytics module — from research through ship — and contribute to our growing design system.

Responsibilities:
• Lead design for complex data-heavy features (charts, dashboards, table views)
• Build and maintain our design system in Figma, with engineering counterparts
• Conduct user interviews and usability testing with our enterprise customers
• Partner closely with Product, Engineering, and Data Science on cross-functional initiatives
• Mentor mid-level designers and contribute to design culture

Requirements:
• 4+ years in product design, ideally with B2B SaaS or data products
• Strong portfolio showing design systems work and complex flows
• Experience with stakeholder management across multiple teams
• Fluent in Figma, prototyping, and design tokens
• Bonus: experience with A/B testing, SQL, or front-end implementation
• Strong written communication (English is our working language)

What we offer:
Competitive salary, equity, remote-friendly culture, learning budget.`

// Heuristic keyword tags from JD text
const SKILL_TAGS = ['React','TypeScript','JavaScript','Next.js','Node.js','Python','SQL','Figma','Tailwind','GraphQL','AWS','Docker','Kubernetes','A/B testing','Agile','Stakeholder','Design systems','B2B','SaaS','Remote','Hybrid','English','Bahasa']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function getExt(name: string): 'pdf' | 'docx' {
  return /\.docx$/i.test(name) ? 'docx' : 'pdf'
}

function detectJDInfo(text: string) {
  if (text.length < 60) return null
  const roleRe = /(senior|junior|lead|principal|staff)?\s*(product|software|frontend|backend|fullstack|full-stack|data|devops|ml|machine learning|qa|ui|ux)\s*(designer|engineer|developer|manager|analyst|scientist|architect)/i
  const titleMatch = text.match(roleRe)
  const title = titleMatch
    ? titleMatch[0].replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Belum terdeteksi'
  let company = '—'
  const atMatch = text.match(/\b(at|@|·)\s+([A-Z][\w&.\- ]{2,30})/)
  if (atMatch) company = atMatch[2].trim().replace(/\s+\(.*$/, '')
  const tags = SKILL_TAGS.filter((s) =>
    new RegExp('\\b' + s.replace(/[.+]/g, '\\$&') + '\\b', 'i').test(text),
  ).slice(0, 8)
  return { title, company, tags }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-3 w-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className ?? 'h-3.5 w-3.5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function AnalyzeNav({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const steps = [
    { id: '01', label: 'Upload & JD', active: true },
    { id: '02', label: 'Analisis', active: false },
    { id: '03', label: 'Hasil', active: false },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
            <ShieldIcon />
          </span>
          <span className="text-[17px] font-semibold tracking-tight grad-text">ResumeIQ</span>
        </Link>

        {/* Desktop step indicator */}
        <ol aria-label="Progress" className="hidden items-center gap-2 md:flex">
          {steps.map((step, i) => (
            <li key={step.id} className="flex items-center gap-2">
              {i > 0 && <ChevronRight />}
              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                  step.active
                    ? 'step-active'
                    : 'bg-slate-100 text-slate-500 font-medium'
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full font-mono text-[10px] ${step.active ? 'bg-white/20' : 'bg-white ring-1 ring-slate-200'}`}>
                  {step.id}
                </span>
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2">
          <div role="group" aria-label="Language" className="hidden items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium sm:flex">
            {(['ID', 'EN'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-full px-2.5 py-1 transition ${lang === l ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                aria-pressed={lang === l}
              >
                {l}
              </button>
            ))}
          </div>
          <Link href="/dashboard" className="hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 sm:inline-flex">
            Riwayat
          </Link>
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="border-t border-slate-100 px-4 py-2 md:hidden">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-500">
          <span className="text-brand-600">Step 1 / 3 · Upload</span>
          <span>33%</span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-500 to-violet2-500" />
        </div>
      </div>
    </header>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyzePage() {
  const router = useRouter()
  const { user } = useAuth()

  // ── State ──
  const [lang, setLang] = useState<Lang>('ID')

  // CV upload state
  const [file, setFile] = useState<File | null>(null)
  const [parseStatus, setParseStatus] = useState<ParseStatus>('idle')
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // JD state
  const [jdText, setJdText] = useState('')
  const [jdSaved, setJdSaved] = useState(false)
  const jdInfo = jdText.length >= 60 ? detectJDInfo(jdText) : null

  // Submit state
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  // Error + toast
  const [error, setError] = useState<AppError | null>(null)
  const [toast, setToast] = useState<{ msg: string; key: number } | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const jdSaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  // Restore JD draft from localStorage
  useEffect(() => {
    try {
      const draft = localStorage.getItem(JD_DRAFT_KEY)
      if (draft) {
        setJdText(draft)
        setJdSaved(true)
      }
    } catch {}
  }, [])

  // ── Helpers ──

  function showToast(msg: string) {
    clearTimeout(toastTimer.current)
    setToast({ msg, key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 2400)
  }

  function isReady() {
    return parseStatus === 'parsed' && jdText.length >= 100
  }

  // ── File handling ──

  const parseFile = useCallback(async (f: File) => {
    setError(null)

    // Client-side validation
    const ext = getExt(f.name)
    const mimeOk = ALLOWED_TYPES.includes(f.type) || ext === 'pdf' || ext === 'docx'
    if (!mimeOk) {
      setError({ title: 'Format file tidak didukung', body: 'ResumeIQ hanya menerima file PDF atau DOCX. Silakan pilih file lain.' })
      return
    }
    if (f.size > MAX_SIZE) {
      setError({ title: 'File terlalu besar', body: `Ukuran maksimum 5 MB. File kamu ${fmtSize(f.size)}. Coba kompres atau hapus halaman yang tidak perlu.` })
      return
    }

    setFile(f)
    setParseStatus('parsing')
    setParseResult(null)

    try {
      const formData = new FormData()
      formData.append('file', f)
      const res = await fetch('/api/parse', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Gagal memproses file')
      }

      const data = json.data
      setParseResult({
        text: data.text,
        wordCount: data.wordCount,
        pageCount: data.pageCount ?? 1,
        detectedLang: data.text.length > 0 ? 'id' : 'en', // will be auto-detected by analyze API
      })
      setParseStatus('parsed')
      showToast('CV berhasil diproses')
    } catch (err) {
      setParseStatus('error')
      setError({
        title: 'Gagal memproses CV',
        body: err instanceof Error ? err.message : 'Terjadi kesalahan. Coba file lain.',
      })
    }
  }, [])

  function removeFile() {
    setFile(null)
    setParseStatus('idle')
    setParseResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Drag & drop ──

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) parseFile(f)
  }

  // ── JD handlers ──

  function onJdChange(val: string) {
    setJdText(val)
    clearTimeout(jdSaveTimer.current)
    jdSaveTimer.current = setTimeout(() => {
      try { localStorage.setItem(JD_DRAFT_KEY, val) } catch {}
      setJdSaved(val.length > 0)
    }, 500)
  }

  // ── Sample data ──

  function loadSample() {
    // Fake file
    setFile(new File([''], 'Sample_CV_Sarah.pdf', { type: 'application/pdf' }))
    setParseStatus('parsing')
    setParseResult(null)
    setTimeout(() => {
      setParseResult({
        text: SAMPLE_CV,
        wordCount: SAMPLE_CV.trim().split(/\s+/).length,
        pageCount: 2,
        detectedLang: 'id',
      })
      setParseStatus('parsed')
    }, 900)
    // JD
    setJdText(SAMPLE_JD)
    setJdSaved(true)
    try { localStorage.setItem(JD_DRAFT_KEY, SAMPLE_JD) } catch {}
    showToast('Sample data dimuat')
  }

  // ── Submit ──

  async function handleSubmit() {
    if (!isReady() || submitStatus === 'submitting') return
    if (!parseResult) return

    setSubmitStatus('submitting')
    setError(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: parseResult.text,
          jobDescription: jdText,
          language: lang === 'ID' ? 'id' : 'en',
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Analisis gagal')
      }

      // Save to DB if user is logged in (fire-and-forget, non-blocking)
      let analysisId: string | null = null
      if (user && parseResult) {
        try {
          const saveRes = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              resumeText: parseResult.text,
              jobDescription: jdText,
              fileName: file?.name ?? 'Resume',
              fileSize: file?.size,
              result: json.result,
              meta: json.meta,
            }),
          })
          const saveJson = await saveRes.json()
          if (saveJson.saved) analysisId = saveJson.id
        } catch {
          // Saving failed silently — result still navigates
        }
      }

      // Store result for result page (sessionStorage as cache)
      try {
        sessionStorage.setItem('resumeiq.result', JSON.stringify({
          result: json.result,
          meta: json.meta,
          fileName: file?.name ?? 'Resume',
          jdText,
          analyzedAt: new Date().toISOString(),
          analysisId,      // null for guest, UUID for logged-in user
          isSaved: !!analysisId,
        }))
      } catch {}

      router.push('/result')
    } catch (err) {
      setSubmitStatus('idle')
      setError({
        title: 'Analisis gagal',
        body: err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.',
      })
    }
  }

  // ── Derived display ──

  const ext = file ? getExt(file.name) : 'pdf'
  const fileIconStyle = ext === 'docx'
    ? 'bg-sky-50 text-sky-600'
    : 'bg-rose-50 text-rose-600'

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-200 selection:text-brand-900">
      <AnalyzeNav lang={lang} setLang={setLang} />

      <main className="relative pb-32 sm:pb-28">
        {/* Background */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-brand-50/60 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg" />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

          {/* Page header */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-brand-700 shadow-soft backdrop-blur">
              <span className="font-mono text-[10px]">01</span> · Mulai analisis baru
            </span>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Unggah CV + paste <span className="grad-text">job description</span>.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 sm:text-base">
              Dua input. Dua puluh detik. Hasil yang langsung bisa kamu kerjakan.
            </p>
          </div>

          {/* Quick actions row */}
          <div className="mx-auto mt-8 flex max-w-5xl flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-left shadow-soft transition hover:border-slate-300 hover:shadow-card"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/>
                  </svg>
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-slate-900">Analisis terakhir · 2 hari lalu</span>
                  <span className="block font-mono text-[11px] text-slate-500">Senior PM · Tokopedia — skor 87</span>
                </span>
              </span>
              <svg className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>

            <button
              type="button"
              onClick={loadSample}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300"
            >
              <svg className="h-3.5 w-3.5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.94 14.34a4 4 0 1 1 4.72-4.72M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
              Coba dengan sample CV &amp; JD
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mx-auto mt-6 max-w-5xl">
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900 shadow-soft">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-100 text-rose-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v10M12 16h.01M5 22h14a2 2 0 0 0 1.74-3l-7-12a2 2 0 0 0-3.48 0l-7 12A2 2 0 0 0 5 22Z"/>
                  </svg>
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{error.title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-rose-800/90">{error.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-rose-700 transition hover:bg-rose-100"
                  aria-label="Tutup"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Two-column grid */}
          <div className="mx-auto mt-6 grid max-w-5xl gap-4 lg:grid-cols-2 lg:gap-5">

            {/* ── LEFT: Upload CV ── */}
            <section aria-labelledby="upload-h" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-600">A</span>
                    <h2 id="upload-h" className="text-[15px] font-semibold tracking-tight text-slate-900">Upload CV</h2>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">PDF atau DOCX, maksimal 5 MB</p>
                </div>
                {parseStatus === 'parsed' && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/60">
                    <CheckCircle className="h-3 w-3" />
                    Siap dianalisis
                  </span>
                )}
              </header>

              <div className="p-5 sm:p-6">
                {/* Dropzone — shown when no file */}
                {parseStatus === 'idle' || parseStatus === 'error' ? (
                  <div
                    className={`dz relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-8 text-center sm:p-10 ${isDragging ? 'is-drag' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label="Pilih atau drop file CV"
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  >
                    <div className="dz-icon grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-card ring-1 ring-slate-200">
                      <svg className="h-6 w-6 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <p className="mt-4 text-[15px] font-medium text-slate-900">
                      Drop CV di sini, atau{' '}
                      <span className="text-brand-600 underline-offset-2 hover:underline">klik untuk browse</span>
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">PDF · DOCX · max 5 MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      aria-label="Pilih file CV"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) parseFile(f)
                      }}
                    />
                  </div>
                ) : (
                  /* File preview — parsing or parsed */
                  <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${fileIconStyle}`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{file?.name}</p>
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-600">
                          {ext}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                        {file && file.size > 0 ? fmtSize(file.size) : '—'} · diunggah
                      </p>

                      {/* Progress bar (parsing state) */}
                      {parseStatus === 'parsing' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-700">Memproses CV…</span>
                            <span className="font-mono text-slate-500">parsing</span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div className="indet h-full"><span /></div>
                          </div>
                        </div>
                      )}

                      {/* Parsed details */}
                      {parseStatus === 'parsed' && parseResult && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/60">
                            <CheckCircle className="h-2.5 w-2.5" /> Parsed
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-brand-200/60">
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                            Detected: <span className="font-semibold">{parseResult.detectedLang === 'id' ? 'Bahasa Indonesia' : 'English'}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200">
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
                            </svg>
                            {parseResult.pageCount} halaman · {parseResult.wordCount.toLocaleString('id-ID')} kata
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Hapus file"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                )}

                <ul className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <li className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-slate-300" />Format DOCX lebih akurat</li>
                  <li className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-slate-300" />Tanpa password protection</li>
                </ul>
              </div>
            </section>

            {/* ── RIGHT: Job Description ── */}
            <section aria-labelledby="jd-h" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
              <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-brand-600">B</span>
                    <h2 id="jd-h" className="text-[15px] font-semibold tracking-tight text-slate-900">Job Description</h2>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">Copy dari LinkedIn, JobStreet, atau sumber lain</p>
                </div>
                {jdSaved && jdText.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Draft tersimpan
                  </span>
                )}
              </header>

              <div className="p-5 sm:p-6">
                <div className="relative">
                  <textarea
                    rows={12}
                    maxLength={10000}
                    value={jdText}
                    onChange={(e) => onJdChange(e.target.value)}
                    placeholder={`Tempelkan job description di sini…\n\nContoh: We are seeking a Senior Frontend Engineer with 5+ years of experience in React, TypeScript…`}
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/40 p-4 pb-10 text-[14px] leading-relaxed text-slate-900 placeholder:text-slate-400 transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
                  />
                  <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-2 text-[11px]">
                    {jdText.length > 0 && jdText.length < 100 && (
                      <span className="font-mono text-amber-600">min 100</span>
                    )}
                    <span className="font-mono text-slate-400">
                      {jdText.length.toLocaleString('id-ID')} / 10.000
                    </span>
                  </div>
                </div>

                {/* Detected JD info */}
                {jdInfo && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3.5">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      <svg className="h-3 w-3 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      Detected from JD
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Job title</div>
                        <div className="text-[13px] font-semibold text-slate-900">{jdInfo.title}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Company</div>
                        <div className="text-[13px] font-semibold text-slate-900">{jdInfo.company}</div>
                      </div>
                    </div>
                    {jdInfo.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {jdInfo.tags.map((tag) => (
                          <span key={tag} className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] text-slate-700 ring-1 ring-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="mt-3 text-[11px] text-slate-500">
                  Tip: lebih lengkap JD-nya, lebih akurat hasilnya. Sertakan responsibilities &amp; requirements.
                </p>
              </div>
            </section>

            {/* ── Tips accordion (full width) ── */}
            <details className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-soft">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600 text-lg">💡</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Tips untuk hasil terbaik</div>
                    <div className="text-[11px] text-slate-500">4 hal yang biasa bikin skor naik 20+ poin</div>
                  </div>
                </div>
                <svg className="chev h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <div className="grid gap-3 border-t border-slate-100 px-5 pb-5 pt-4 sm:grid-cols-2 sm:px-6 sm:pb-6">
                {[
                  { n: '01', text: 'Pakai JD lengkap (responsibilities + requirements), bukan cuma title.', bold: 'lengkap' },
                  { n: '02', text: 'Pastikan CV bukan scan/foto — file teks selectable.', bold: 'bukan scan/foto' },
                  { n: '03', text: 'Format DOCX umumnya lebih akurat di-parse dibanding PDF.', bold: 'DOCX' },
                  { n: '04', text: 'Hindari password protection atau ATS akan gagal parse.', bold: 'password protection' },
                ].map((tip) => (
                  <div key={tip.n} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                    <span className="font-mono text-xs font-semibold text-brand-600">{tip.n}</span>
                    <p className="text-[13px] leading-relaxed text-slate-700">
                      {tip.text.split(tip.bold).map((part, i, arr) => (
                        i < arr.length - 1
                          ? <>{part}<span className="font-medium text-slate-900">{tip.bold}</span></>
                          : part
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </main>

      {/* ── Sticky CTA bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-8">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
            <li className={`flex items-center gap-1.5 ${parseStatus === 'parsed' ? 'text-emerald-700' : 'text-slate-400'}`}>
              {parseStatus === 'parsed'
                ? <CheckCircle />
                : <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
              }
              <span className="font-medium">CV uploaded</span>
            </li>
            <li className={`flex items-center gap-1.5 ${jdText.length >= 100 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {jdText.length >= 100
                ? <CheckCircle />
                : <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>
              }
              <span className="font-medium">
                JD pasted{' '}
                <span className="font-mono text-slate-400">({jdText.length.toLocaleString('id-ID')} chars)</span>
              </span>
            </li>
            <li className="hidden items-center gap-1.5 text-slate-500 sm:flex">
              <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              ~15 detik
            </li>
          </ul>

          <button
            type="button"
            disabled={!isReady() || submitStatus === 'submitting'}
            onClick={handleSubmit}
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-brand-500 to-violet2-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition enabled:hover:brightness-110 enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none sm:w-auto"
          >
            <span>{submitStatus === 'submitting' ? 'Menganalisis…' : 'Mulai Analisis'}</span>
            {submitStatus === 'submitting' ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            ) : (
              <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          key={toast.key}
          className="pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 toast-in"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-float">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle />
            </span>
            <span className="text-sm font-medium text-slate-900">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  )
}
