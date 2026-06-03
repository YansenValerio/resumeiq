'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RevealInit from '@/components/landing/RevealInit'
import { useAuth } from '@/components/AuthProvider'

// ─── Types ───────────────────────────────────────────────────────────────────

type ScoreClass = 'score-good' | 'score-mid' | 'score-low'

// Chart data points: { x, y, score, role, company, date, delta } — static demo
const CHART_POINTS = [
  { x:  80, y: 172, score: 45, role: 'Frontend Engineer', company: 'Tokopedia', date: 'Apr 02', delta: '' },
  { x: 160, y: 140, score: 58, role: 'Frontend Engineer', company: 'GoTo',      date: 'Apr 09', delta: '+13' },
  { x: 300, y: 155, score: 52, role: 'Product Manager',   company: 'Traveloka', date: 'Apr 22', delta: '' },
  { x: 370, y: 119, score: 67, role: 'Frontend Engineer', company: 'Shopee',    date: 'Apr 28', delta: '+9' },
  { x: 430, y: 126, score: 64, role: 'Product Manager',   company: 'Blibli',    date: 'May 03', delta: '+12' },
  { x: 560, y: 110, score: 71, role: 'Product Manager',   company: 'Xendit',    date: 'May 14', delta: '+7' },
  { x: 610, y:  92, score: 78, role: 'Frontend Engineer', company: 'Grab',      date: 'May 18', delta: '+11' },
  { x: 680, y:  91, score: 79, role: 'Product Manager',   company: 'DANA',      date: 'May 22', delta: '+8' },
  { x: 770, y:  71, score: 87, role: 'Frontend Engineer', company: 'Traveloka', date: 'May 27', delta: '+9' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreClass(score: number): ScoreClass {
  if (score >= 70) return 'score-good'
  if (score >= 50) return 'score-mid'
  return 'score-low'
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ShieldLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

function NavItem({ href, active, children, badge }: {
  href: string; active?: boolean; badge?: string; children: React.ReactNode
}) {
  return (
    <li>
      <Link
        href={href}
        className={`nav-link flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium transition hover:bg-ink-100 dark:hover:bg-ink-800 ${
          active ? 'active' : 'text-ink-700 dark:text-ink-300'
        }`}
      >
        <span className="flex items-center gap-2.5">{children}</span>
        {badge && (
          <span className="rounded-full bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300">
            {badge}
          </span>
        )}
      </Link>
    </li>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose, displayName, initials, avatarUrl, email, onSignOut }: {
  open: boolean; onClose: () => void
  displayName: string; initials: string
  avatarUrl?: string; email?: string; onSignOut: () => void
}) {
  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        className={`scrim fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`}
      />

      <aside
        className={`sidebar fixed left-0 top-0 z-50 flex h-screen w-[244px] flex-col border-r border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900 ${
          open ? 'open' : ''
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2.5 px-4 pb-4 pt-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
              <ShieldLogo />
            </span>
            <span className="text-[16px] font-semibold tracking-tight grad-text">ResumeIQ</span>
          </Link>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-50 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Workspace pill */}
        <div className="px-3 pb-2">
          <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-ink-100 dark:hover:bg-ink-800">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-rose-400 to-pink-500 text-[11px] font-bold text-white">{initials[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink-900 dark:text-ink-100">{displayName.split(' ')[0]}&apos;s Workspace</span>
              <span className="block font-mono text-[10px] text-ink-400">free plan</span>
            </span>
            <svg className="h-3 w-3 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3">
          <p className="px-2 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-widest text-ink-400">Workspace</p>
          <ul className="space-y-0.5">
            <NavItem href="/dashboard" active>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/>
                <rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
              </svg>
              Dashboard
            </NavItem>
            <li>
              <Link href="/analyze" className="nav-link flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-700 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                <span className="flex items-center gap-2.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  New Analysis
                </span>
                <span className="rounded-md bg-brand-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">⌘N</span>
              </Link>
            </li>
            <NavItem href="#" badge="12">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/><path d="M12 8v4l3 2"/>
              </svg>
              History
            </NavItem>
            <NavItem href="#">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Settings
            </NavItem>
          </ul>

          <p className="px-2 pb-1.5 pt-5 font-mono text-[10px] uppercase tracking-widest text-ink-400">Resources</p>
          <ul className="space-y-0.5">
            {[
              { label: 'ATS Guide', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
              { label: 'Help & FAQ', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3M12 17h.01' },
            ].map((item) => (
              <li key={item.label}>
                <a href="#" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-700 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon}/>
                  </svg>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User card */}
        <div className="border-t border-ink-200 p-3 dark:border-ink-800">
          <div className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={displayName} className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-violet2-500 text-sm font-semibold text-white">
                {initials}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-ink-900 dark:text-ink-100">{displayName}</span>
              <span className="block truncate text-[11px] text-ink-500">{email}</span>
            </span>
            <button onClick={onSignOut} aria-label="Sign out" className="grid h-7 w-7 place-items-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-200 transition">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

// ─── Chart ───────────────────────────────────────────────────────────────────

function ScoreChart() {
  const chartRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState<{
    visible: boolean; x: number; y: number
    date: string; role: string; company: string; score: number; delta: string
  }>({ visible: false, x: 0, y: 0, date: '', role: '', company: '', score: 0, delta: '' })

  function handleMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const svg = chartRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scale = rect.width / 800
    const xSvg = (e.clientX - rect.left) / scale
    let nearest = CHART_POINTS[0], best = Infinity
    for (const p of CHART_POINTS) {
      const d = Math.abs(p.x - xSvg)
      if (d < best) { best = d; nearest = p }
    }
    const px = nearest.x * scale
    const py = nearest.y * scale
    setTooltip({ visible: true, x: px, y: py, date: nearest.date, role: nearest.role, company: nearest.company, score: nearest.score, delta: nearest.delta })
  }

  return (
    <div className="relative p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 p-0.5 text-[11px] font-medium dark:border-ink-700 dark:bg-ink-800">
          {['60 hari', '30 hari', '7 hari'].map((l, i) => (
            <button key={l} className={`rounded-full px-2.5 py-1 transition ${i === 0 ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-900 dark:text-ink-100' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="font-mono text-[10px] text-ink-400 hidden sm:block">Hover untuk detail</div>
      </div>

      <div className="relative">
        <svg ref={chartRef} viewBox="0 0 800 280" className="w-full" role="img" aria-label="Line chart of resume scores">
          <defs>
            <linearGradient id="areaBrand" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity=".25"/>
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="areaEmerald" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity=".22"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* Grid */}
          <g stroke="#E2E8F0" strokeWidth="1">
            {[40, 100, 160, 220].map(y => (
              <line key={y} x1="48" y1={y} x2="780" y2={y} strokeDasharray="2 4"/>
            ))}
          </g>

          {/* Y labels */}
          <g fill="#94A3B8" style={{ font: '500 10px monospace' }}>
            {[['100',44],['75',104],['50',164],['25',224]].map(([v,y]) => (
              <text key={v} x="38" y={y} textAnchor="end">{v}</text>
            ))}
          </g>

          {/* X labels */}
          <g fill="#94A3B8" style={{ font: '500 10px monospace' }}>
            {[['Apr 02',80],['Apr 15',220],['Apr 28',370],['May 10',520],['May 22',670],['May 27',770]].map(([d,x]) => (
              <text key={d} x={x} y="256" textAnchor="middle">{d}</text>
            ))}
          </g>

          {/* Brand area */}
          <path
            d="M 80 172 C 120 165, 130 145, 160 140 S 270 130, 370 119 S 540 100, 610 92 S 730 78, 770 71 L 770 230 L 80 230 Z"
            fill="url(#areaBrand)" style={{ opacity: 0, transition: 'opacity .6s ease', transitionDelay: '2.2s' }}
            onAnimationEnd={(e) => { (e.target as SVGElement).style.opacity = '1' }}
          />

          {/* Brand line */}
          <path
            className="chart-line"
            d="M 80 172 C 120 165, 130 145, 160 140 S 270 130, 370 119 S 540 100, 610 92 S 730 78, 770 71"
            fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Emerald area */}
          <path
            d="M 300 155 C 350 145, 380 135, 430 126 S 510 115, 560 110 S 640 100, 680 91 L 680 230 L 300 230 Z"
            fill="url(#areaEmerald)" style={{ opacity: 0, transition: 'opacity .6s ease', transitionDelay: '2.5s' }}
          />

          {/* Emerald line */}
          <path
            className="chart-line l2"
            d="M 300 155 C 350 145, 380 135, 430 126 S 510 115, 560 110 S 640 100, 680 91"
            fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />

          {/* Brand points */}
          {([
            [80,172,1.5],[160,140,1.65],[370,119,1.8],[610,92,1.95],
          ] as [number,number,number][]).map(([cx,cy,delay],i) => (
            <circle key={i} className="chart-pt" cx={cx} cy={cy} r="4" fill="#fff" stroke="#6366F1" strokeWidth="2" style={{ animationDelay: `${delay}s` }}/>
          ))}
          <circle className="chart-pt" cx="770" cy="71" r="5" fill="#6366F1" stroke="#fff" strokeWidth="2" style={{ animationDelay: '2.1s' }}/>

          {/* Emerald points */}
          {([
            [300,155,1.85],[430,126,2.0],[560,110,2.15],
          ] as [number,number,number][]).map(([cx,cy,delay],i) => (
            <circle key={i} className="chart-pt" cx={cx} cy={cy} r="4" fill="#fff" stroke="#10B981" strokeWidth="2" style={{ animationDelay: `${delay}s` }}/>
          ))}
          <circle className="chart-pt" cx="680" cy="91" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" style={{ animationDelay: '2.3s' }}/>

          {/* Best callout */}
          <g className="chart-pt" style={{ animationDelay: '2.5s' }}>
            <line x1="770" y1="71" x2="770" y2="50" stroke="#6366F1" strokeWidth="1" strokeDasharray="2 2"/>
            <rect x="710" y="20" width="68" height="26" rx="6" fill="#6366F1"/>
            <text x="744" y="37" textAnchor="middle" fill="white" style={{ font: '600 11px sans-serif' }}>Best 87</text>
          </g>

          {/* Hover marker */}
          {tooltip.visible && (
            <g className="chart-hover show">
              <line x1={tooltip.x / (chartRef.current?.getBoundingClientRect().width ?? 800) * 800} y1="40" x2={tooltip.x / (chartRef.current?.getBoundingClientRect().width ?? 800) * 800} y2="230" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 3"/>
            </g>
          )}

          {/* Hit area */}
          <rect
            x="48" y="20" width="732" height="210" fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
          />
        </svg>

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-[11px] shadow-card dark:border-ink-700 dark:bg-ink-900"
            style={{ left: tooltip.x, top: tooltip.y - 12 }}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{tooltip.date}</div>
            <div className="mt-0.5 font-semibold text-ink-900 dark:text-ink-100">{tooltip.role} · {tooltip.company}</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold grad-text">{tooltip.score}</span>
              <span className="font-mono text-[10px] text-ink-500">{tooltip.delta ? `${tooltip.delta} vs prev` : '— first'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string
  resume_filename: string
  job_title: string | null
  job_description: string
  overall_score: number
  ats_score: number
  language: string
  duration_ms: number | null
  created_at: string
}

interface HistoryStats {
  total: number
  today_count: number
  best_score: number | null
  best_job: string | null
  improvement: number | null
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [lang, setLang] = useState<'ID' | 'EN'>('ID')
  const { user, signOut } = useAuth()

  // History data
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Pengguna'
  const initials = displayName.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  // Restore theme on mount
  useEffect(() => {
    try {
      const t = localStorage.getItem('resumeiq.theme')
      const dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDark(dark)
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
  }, [])

  // Fetch history data
  useEffect(() => {
    if (!user) {
      setHistoryLoading(false)
      return
    }
    fetchHistory()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchHistory() {
    setHistoryLoading(true)
    try {
      const res = await fetch('/api/history?limit=6')
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setHistory(json.data ?? [])
      setStats(json.stats ?? null)
    } catch {
      // Supabase not configured or network error — use empty state
      setHistory([])
      setStats(null)
    } finally {
      setHistoryLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setHistory(prev => prev.filter(h => h.id !== id))
        if (stats) setStats(prev => prev ? { ...prev, total: prev.total - 1 } : null)
      }
    } finally {
      setDeletingId(null)
    }
  }

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      try { localStorage.setItem('resumeiq.theme', next ? 'dark' : 'light') } catch {}
      return next
    })
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'pagi' : hour < 15 ? 'siang' : hour < 19 ? 'sore' : 'malam'

  // Build stat cards from real data (with static fallback for demo)
  const MAX_DAILY = 10
  const statCards = [
    {
      label: 'Total analyses',
      value: stats ? String(stats.total) : historyLoading ? '…' : '0',
      sub: 'semua waktu',
      badge: null,
      iconPath: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
      iconBg: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300',
      gradValue: false,
    },
    {
      label: 'Best score',
      value: stats?.best_score != null ? String(stats.best_score) : historyLoading ? '…' : '—',
      sub: stats?.best_job ?? 'belum ada analisis',
      badge: null,
      iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21 7 14 2 9.27l6.91-1.01L12 2z',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
      gradValue: true,
    },
    {
      label: 'Avg improvement',
      value: stats?.improvement != null
        ? (stats.improvement >= 0 ? `+${stats.improvement}` : String(stats.improvement))
        : historyLoading ? '…' : '—',
      sub: 'analisis pertama → terbaru',
      badge: null,
      iconPath: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
      iconBg: 'bg-violet-50 text-violet2-600 dark:bg-violet-900/30 dark:text-violet-300',
      gradValue: false,
    },
    {
      label: 'Daily limit',
      value: stats ? String(stats.today_count) : historyLoading ? '…' : '0',
      sub: `/ ${MAX_DAILY} hari ini`,
      badge: null,
      iconPath: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 7v5l3 2',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
      progress: stats ? Math.round((stats.today_count / MAX_DAILY) * 100) : 0,
    },
  ]

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      <RevealInit />
      <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          displayName={displayName}
          initials={initials}
          avatarUrl={avatarUrl}
          email={user?.email}
          onSignOut={signOut}
        />

      {/* Main area */}
      <div className="lg:pl-[244px]">

        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[18px] font-semibold tracking-tight sm:text-xl">
                Selamat {greeting}, {displayName.split(' ')[0]} <span className="ml-1 inline-block animate-pulse">👋</span>
              </h1>
              <p className="hidden text-[12px] text-ink-500 sm:block dark:text-ink-400">
                Lihat progress CV-mu dan analisis terbaru di bawah.
              </p>
            </div>

            {/* Search */}
            <div className="relative hidden md:block">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input type="search" placeholder="Search history…" className="w-56 rounded-lg border border-ink-200 bg-ink-50 py-1.5 pl-8 pr-12 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-100 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100 dark:placeholder:text-ink-500"/>
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-ink-200 bg-white px-1 font-mono text-[10px] text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-400">⌘K</kbd>
            </div>

            {/* Lang */}
            <div role="group" aria-label="Language" className="hidden items-center rounded-full border border-ink-200 bg-white p-0.5 text-[11px] font-medium dark:border-ink-700 dark:bg-ink-800 sm:flex">
              {(['ID','EN'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2 py-0.5 transition ${lang === l ? 'bg-ink-900 text-white dark:bg-ink-100 dark:text-ink-900' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'}`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Notifications */}
            <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute right-2 top-2 grid h-3.5 w-3.5 place-items-center rounded-full bg-rose-500 font-mono text-[9px] font-semibold text-white">2</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              {isDark ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-64 dot-bg"
            style={{ maskImage: 'linear-gradient(to bottom, #000 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 100%)' }}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

            {/* Stats grid */}
            <section className="reveal grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {statCards.map((stat) => (
                <article key={stat.label} className="rounded-2xl border border-ink-200 bg-white p-4 shadow-soft transition hover:shadow-card dark:border-ink-800 dark:bg-ink-900">
                  <header className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">{stat.label}</span>
                    <span className={`grid h-7 w-7 place-items-center rounded-lg ${stat.iconBg}`}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={stat.iconPath}/>
                      </svg>
                    </span>
                  </header>
                  <div className="mt-2 flex items-baseline gap-2">
                    <div className={`text-3xl font-semibold tracking-tight ${stat.gradValue ? 'grad-text' : ''}`}>{stat.value}</div>
                    {stat.sub && 'progress' in stat && stat.progress !== undefined && (
                      <span className="font-mono text-xs text-ink-400">{stat.sub.startsWith('/') ? stat.sub : ''}</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[11px] text-ink-500">{stat.sub}</p>
                  {'progress' in stat && stat.progress !== undefined && (
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                      <div className="bar-fill h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 in" style={{ width: `${stat.progress}%` }}/>
                    </div>
                  )}
                </article>
              ))}
            </section>

            {/* Chart + Insights */}
            <section className="reveal mt-4 grid gap-4 lg:grid-cols-3 lg:gap-4">

              {/* Chart */}
              <article className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft lg:col-span-2 dark:border-ink-800 dark:bg-ink-900">
                <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4 dark:border-ink-800">
                  <div>
                    <h2 className="text-[15px] font-semibold tracking-tight">Resume score progress</h2>
                    <p className="mt-0.5 text-[12px] text-ink-500">Skor CV-mu per analisis dalam 60 hari terakhir</p>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-brand-500"/>Frontend Engineer</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"/>Product Manager</span>
                  </div>
                </header>
                <ScoreChart />
              </article>

              {/* Insights */}
              <article className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900">
                <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4 dark:border-ink-800">
                  <h2 className="text-[15px] font-semibold tracking-tight"><span className="mr-1">💡</span> Insights untuk kamu</h2>
                  <button className="font-mono text-[10px] uppercase tracking-widest text-ink-400 hover:text-ink-700 dark:hover:text-ink-200">Refresh</button>
                </header>

                <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                  {[
                    {
                      icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
                      iconPath: 'M22 7 13.5 15.5 8.5 10.5 2 17',
                      title: <p className="text-[13.5px] font-medium">Skor kamu naik <span className="text-emerald-600 dark:text-emerald-400">+42 poin</span> dalam 2 bulan 🎉</p>,
                      sub: 'Dari 45 (Apr 02) ke 87 (May 27). Trajectory di atas rata-rata 92% user.',
                    },
                    {
                      icon: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
                      iconPath: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
                      title: <p className="text-[13.5px] font-medium">Keyword yang sering hilang: <span className="font-mono text-[12px] font-semibold text-rose-700 dark:text-rose-300">GraphQL</span>, <span className="font-mono text-[12px] font-semibold text-rose-700 dark:text-rose-300">AWS</span></p>,
                      sub: 'Muncul di 7 dari 12 JD yang kamu target. Pertimbangkan tambahkan atau ambil short course.',
                    },
                    {
                      icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
                      iconPath: 'M12 2v10M12 16h.01M5 22h14a2 2 0 0 0 1.74-3l-7-12a2 2 0 0 0-3.48 0l-7 12A2 2 0 0 0 5 22Z',
                      title: <p className="text-[13.5px] font-medium">Section yang konsisten low: <span className="text-amber-700 dark:text-amber-300">Summary</span></p>,
                      sub: 'Rata-rata 64/100 di 8 analisis terakhir.',
                    },
                  ].map((insight, i) => (
                    <li key={i} className="flex gap-3 p-4 sm:p-5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${insight.icon}`}>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={insight.iconPath}/>
                        </svg>
                      </span>
                      <div className="min-w-0">
                        {insight.title}
                        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-400">{insight.sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink-100 p-3 dark:border-ink-800">
                  <Link href="/analyze" className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-brand-600 to-violet2-600 p-3.5 text-white shadow-glow transition hover:brightness-110">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/15">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-semibold">Mulai analisis baru</span>
                      <span className="block text-[11px] text-brand-100">Tinggal 7 quota hari ini</span>
                    </span>
                    <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              </article>
            </section>

            {/* Recent analyses */}
            <section className="reveal mt-4 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4 dark:border-ink-800">
                <div>
                  <h2 className="text-[15px] font-semibold tracking-tight">Recent analyses</h2>
                  <p className="mt-0.5 text-[12px] text-ink-500">
                    {historyLoading ? 'Memuat…' : `${stats?.total ?? 0} total · ${history.length} terbaru di bawah`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden items-center rounded-full border border-ink-200 bg-ink-50 p-0.5 text-[11px] font-medium dark:border-ink-700 dark:bg-ink-800 sm:flex">
                    {['All','Frontend','PM','Design'].map((l, i) => (
                      <button key={l} className={`rounded-full px-2.5 py-1 transition ${i === 0 ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-900 dark:text-ink-100' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100'}`}>{l}</button>
                    ))}
                  </div>
                  <a href="#" className="font-mono text-[11px] font-medium text-brand-600 hover:underline dark:text-brand-400">View all →</a>
                </div>
              </header>

              {/* Table header (desktop) */}
              <div className="hidden border-b border-ink-100 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-ink-500 dark:border-ink-800 sm:grid sm:grid-cols-[110px_1fr_1fr_120px_60px_120px] sm:gap-3">
                <span>Date</span><span>Resume</span><span>Target role</span>
                <span className="text-center">Score</span><span className="text-center">Δ</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Loading skeleton */}
              {historyLoading && (
                <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-4 px-5 py-4">
                      <div className="skel h-3 w-20 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="skel h-3 w-40 rounded-full" />
                        <div className="skel h-2.5 w-32 rounded-full" />
                      </div>
                      <div className="skel h-6 w-10 rounded-md" />
                    </li>
                  ))}
                </ul>
              )}

              {/* Empty state */}
              {!historyLoading && history.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-ink-800">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-medium text-ink-700 dark:text-ink-300">Belum ada analisis</p>
                  <p className="mt-1 text-[12px] text-ink-500">Mulai analisis pertama CV-mu sekarang.</p>
                  <Link href="/analyze" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700">
                    Mulai Analisis →
                  </Link>
                </div>
              )}

              {/* Data rows */}
              {!historyLoading && history.length > 0 && (
                <>
                  <ul className="divide-y divide-ink-100 dark:divide-ink-800">
                    {history.map((a) => {
                      const dateStr = new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                      const roleDisplay = a.job_title || a.job_description.split('\n')[0].slice(0, 50)
                      return (
                        <li key={a.id} className="group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 transition hover:bg-ink-50/60 dark:hover:bg-ink-800/40 sm:grid-cols-[110px_1fr_1fr_120px_120px]">
                          <span className="font-mono text-[11px] text-ink-500 sm:order-1">{dateStr}</span>
                          <span className="sm:order-2 min-w-0">
                            <span className="block truncate text-[13px] font-semibold">{a.resume_filename}</span>
                            <span className="block font-mono text-[10px] text-ink-400 sm:hidden">vs {roleDisplay}</span>
                          </span>
                          <span className="hidden truncate text-[12.5px] text-ink-600 dark:text-ink-300 sm:order-3 sm:block">{roleDisplay}</span>
                          <span className="col-start-2 row-start-1 sm:order-4 sm:col-start-auto sm:row-start-auto sm:text-center">
                            <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${scoreClass(a.overall_score)}`}>
                              {a.overall_score}
                            </span>
                          </span>
                          <span className="col-span-2 flex items-center justify-end gap-1 sm:order-5 sm:col-span-1">
                            <Link href="/result" className="rounded-md bg-white px-2 py-1 text-[11px] font-medium text-ink-700 ring-1 ring-ink-200 transition hover:bg-ink-50 dark:bg-ink-900 dark:text-ink-200 dark:ring-ink-700 dark:hover:bg-ink-800">
                              View
                            </Link>
                            <button
                              aria-label="Delete"
                              disabled={deletingId === a.id}
                              onClick={() => handleDelete(a.id)}
                              className="grid h-7 w-7 place-items-center rounded-md text-ink-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 dark:hover:bg-rose-900/20"
                            >
                              {deletingId === a.id ? (
                                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                              )}
                            </button>
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <footer className="flex items-center justify-between border-t border-ink-100 px-5 py-3 dark:border-ink-800">
                    <span className="font-mono text-[11px] text-ink-500">
                      Menampilkan 1–{history.length} dari {stats?.total ?? history.length}
                    </span>
                    <a href="#" className="font-mono text-[11px] font-medium text-brand-600 hover:underline dark:text-brand-400">
                      Lihat semua →
                    </a>
                  </footer>
                </>
              )}
            </section>

            <div className="h-12"/>
          </div>
        </main>
      </div>
    </div>
  )
}
