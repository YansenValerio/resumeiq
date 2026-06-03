'use client'

import { useEffect, useRef } from 'react'
import { getScoreLevel } from '@/types/analysis'

interface ScoreRingProps {
  score: number
  size?: 'sm' | 'lg'
}

function ringColor(score: number) {
  const level = getScoreLevel(score)
  if (level === 'excellent' || level === 'good') return 'emerald'
  if (level === 'fair') return 'amber'
  return 'rose'
}

function scoreLabel(score: number) {
  const level = getScoreLevel(score)
  return { excellent: 'Excellent', good: 'Good', fair: 'Fair', poor: 'Poor', very_poor: 'Very Poor' }[level]
}

const GRADIENTS: Record<string, [string, string]> = {
  emerald: ['#34D399', '#10B981'],
  amber:   ['#FCD34D', '#F59E0B'],
  rose:    ['#FB7185', '#F43F5E'],
}

const BADGE_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  amber:   'bg-amber-50 text-amber-700 ring-amber-200/60',
  rose:    'bg-rose-50 text-rose-700 ring-rose-200/60',
}

export default function ScoreRing({ score, size = 'lg' }: ScoreRingProps) {
  const ringRef = useRef<SVGCircleElement>(null)
  const numRef  = useRef<HTMLSpanElement>(null)
  const color   = ringColor(score)
  const [c1, c2] = GRADIENTS[color]
  const gradId = `ring-${size}-grad`

  const isLg = size === 'lg'
  const viewBox = isLg ? '0 0 140 140' : '0 0 60 60'
  const cx = isLg ? 70 : 30
  const r  = isLg ? 60 : 25
  const sw = isLg ? 10 : 5
  const C  = 2 * Math.PI * r

  useEffect(() => {
    const offset = C * (1 - score / 100)
    const el = ringRef.current
    if (!el) return
    // Trigger animation via RAF
    const raf = requestAnimationFrame(() => {
      el.style.strokeDashoffset = String(offset)
    })

    if (isLg && numRef.current) {
      const numEl = numRef.current
      const start = performance.now()
      const duration = 1600
      function tick(now: number) {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        numEl.textContent = String(Math.round(eased * score))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    return () => cancelAnimationFrame(raf)
  }, [score, C, isLg])

  if (isLg) {
    return (
      <div className="relative mx-auto">
        <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-emerald-300/40 via-brand-300/30 to-violet2-300/30 blur-2xl" />
        <div className="relative h-44 w-44 sm:h-56 sm:w-56">
          <svg viewBox={viewBox} className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cx} r={r} fill="none" className="ring-track" strokeWidth={sw} />
            <circle
              ref={ringRef} cx={cx} cy={cx} r={r} fill="none"
              className="ring-fill" stroke={`url(#${gradId})`}
              strokeWidth={sw} strokeDasharray={C} strokeDashoffset={C}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">Overall Score</div>
              <div className="mt-1 flex items-baseline justify-center gap-0.5">
                <span ref={numRef} className="text-6xl font-semibold tracking-tight text-slate-900 sm:text-7xl">0</span>
                <span className="font-mono text-sm text-slate-400">/ 100</span>
              </div>
              <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${BADGE_COLORS[color]}`}>
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7" />
                </svg>
                {scoreLabel(score)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Small ring (sidebar)
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox={viewBox} className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#E2E8F0" strokeWidth={sw} />
        <circle
          ref={ringRef} cx={cx} cy={cx} r={r} fill="none"
          className="ring-fill" stroke={`url(#${gradId})`}
          strokeWidth={sw} strokeDasharray={C} strokeDashoffset={C}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-lg font-semibold tracking-tight text-slate-900">{score}</span>
      </div>
    </div>
  )
}
