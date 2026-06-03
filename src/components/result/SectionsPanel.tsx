import type { AnalysisResult } from '@/types/analysis'
import AnimatedBar from './AnimatedBar'

const SECTION_META: Record<string, { label: string; num: string }> = {
  summary:    { label: 'Summary',    num: '01' },
  experience: { label: 'Experience', num: '02' },
  skills:     { label: 'Skills',     num: '03' },
  education:  { label: 'Education',  num: '04' },
}

function scoreBadge(score: number) {
  if (score >= 70) return 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
  if (score >= 50) return 'bg-amber-50 text-amber-700 ring-amber-200/60'
  return 'bg-rose-50 text-rose-700 ring-rose-200/60'
}

function barColor(score: number) {
  if (score >= 70) return 'from-emerald-400 to-emerald-500'
  if (score >= 50) return 'from-amber-400 to-amber-500'
  return 'from-rose-400 to-rose-500'
}

export default function SectionsPanel({ result }: { result: AnalysisResult }) {
  const sections = Object.entries(result.section_scores) as [string, { score: number; feedback: string }][]

  return (
    <div className="space-y-3">
      {sections.map(([key, val], i) => {
        const meta = SECTION_META[key]
        return (
          <details key={key} className="acc rounded-2xl border border-slate-200 bg-white shadow-soft" open={i === 0}>
            <summary className="flex items-center justify-between gap-4 p-5 sm:p-6">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{meta.num}</span>
                  <h3 className="text-base font-semibold tracking-tight text-slate-900">{meta.label}</h3>
                  <span className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold ring-1 ${scoreBadge(val.score)}`}>
                    {val.score} / 100
                  </span>
                </div>
                <div className="mt-2">
                  <AnimatedBar pct={val.score} color={barColor(val.score)} height="h-2" delay={100 + i * 60} />
                </div>
              </div>
              <svg className="acc-chev h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <p className="text-[14px] leading-relaxed text-slate-700">{val.feedback}</p>
            </div>
          </details>
        )
      })}
    </div>
  )
}
