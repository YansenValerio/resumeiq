import type { AnalysisResult } from '@/types/analysis'
import AnimatedBar from './AnimatedBar'
import PriorityBadge from './PriorityBadge'

function barColor(score: number) {
  if (score >= 70) return 'from-emerald-400 to-emerald-500'
  if (score >= 50) return 'from-amber-400 to-amber-500'
  return 'from-rose-400 to-rose-500'
}

interface OverviewPanelProps {
  result: AnalysisResult
  onGoToTab: (tab: string) => void
}

const SECTION_LABELS: Record<string, string> = {
  summary: 'Summary', experience: 'Experience', skills: 'Skills', education: 'Education',
}

export default function OverviewPanel({ result, onGoToTab }: OverviewPanelProps) {
  const sections = Object.entries(result.section_scores) as [string, { score: number; feedback: string }][]
  const avg = Math.round(sections.reduce((s, [, v]) => s + v.score, 0) / sections.length)

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Strengths */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              <span className="mr-1.5">✨</span> Apa yang sudah bagus
            </h3>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700">
              {result.strengths.length} items
            </span>
          </header>
          <ul className="mt-4 space-y-3">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </span>
                <p className="text-[14px] leading-relaxed text-slate-700">{s}</p>
              </li>
            ))}
          </ul>
        </article>

        {/* Top Priority */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              <span className="mr-1.5">🎯</span> Prioritas utama
            </h3>
            <button
              onClick={() => onGoToTab('improvements')}
              className="font-mono text-[11px] font-medium text-brand-600 hover:underline"
            >
              Lihat semua →
            </button>
          </header>
          <ul className="mt-4 space-y-3">
            {result.top_improvements.slice(0, 3).map((imp, i) => (
              <li key={i} className="group rounded-xl border border-slate-200 p-3.5 transition hover:border-slate-300">
                <div className="flex items-start gap-3">
                  <PriorityBadge priority={imp.priority} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold tracking-tight text-slate-900">{imp.issue}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{imp.suggestion}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* Score Breakdown */}
      <article className="reveal mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Score breakdown per section</h3>
            <p className="mt-0.5 text-xs text-slate-500">Klik Section Analysis untuk detail per bagian</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">avg · {avg}</span>
        </header>
        <ul className="mt-5 space-y-4">
          {sections.map(([key, val], i) => (
            <li key={key}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-900">{SECTION_LABELS[key]}</span>
                <span className="font-mono text-slate-700">
                  <span className="font-semibold">{val.score}</span>
                  <span className="text-slate-400"> / 100</span>
                </span>
              </div>
              <div className="mt-2">
                <AnimatedBar pct={val.score} color={barColor(val.score)} delay={120 + i * 80} />
              </div>
              <p className="mt-1.5 text-[12px] text-slate-500">
                {val.feedback.slice(0, 80)}…{' '}
                <button onClick={() => onGoToTab('sections')} className="text-brand-600 hover:underline">detail →</button>
              </p>
            </li>
          ))}
        </ul>
      </article>

      {/* Formatting issues */}
      {result.formatting_issues.length > 0 && (
        <article className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-slate-900">⚠️ Formatting issues ({result.formatting_issues.length})</h3>
          <ul className="mt-3 space-y-1.5">
            {result.formatting_issues.map((issue, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-slate-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {issue}
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  )
}
