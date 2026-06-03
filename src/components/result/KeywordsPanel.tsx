import type { AnalysisResult } from '@/types/analysis'
import AnimatedBar from './AnimatedBar'

export default function KeywordsPanel({ result }: { result: AnalysisResult }) {
  const { keyword_match: kw } = result
  const total = kw.matched.length + kw.missing_critical.length + kw.missing_nice_to_have.length
  const matchedPct = total > 0 ? Math.round((kw.matched.length / total) * 100) : kw.match_percentage
  const criticalPct = total > 0 ? Math.round((kw.missing_critical.length / total) * 100) : 0
  const nicePct = total > 0 ? Math.round((kw.missing_nice_to_have.length / total) * 100) : 0

  return (
    <div>
      {/* Match summary */}
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Keyword match</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="grad-text text-5xl font-semibold tracking-tight">{kw.match_percentage}%</span>
              <span className="text-sm text-slate-500">
                — <span className="font-semibold text-slate-900">{kw.matched.length} dari {total}</span> keyword penting ditemukan
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> {kw.matched.length} cocok</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> {kw.missing_critical.length} critical</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> {kw.missing_nice_to_have.length} nice</span>
          </div>
        </div>

        {/* Segmented bar */}
        <div className="mt-4 flex h-3 overflow-hidden rounded-full">
          <AnimatedBar pct={matchedPct} color="from-emerald-400 to-emerald-500" height="h-3" delay={100} />
          <AnimatedBar pct={criticalPct} color="from-rose-400 to-rose-500" height="h-3" delay={160} />
          <AnimatedBar pct={nicePct} color="from-amber-400 to-amber-500" height="h-3" delay={220} />
        </div>
      </article>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Matched keywords */}
        <article className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 shadow-soft sm:p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">
              <span className="mr-1.5 text-emerald-600">✓</span> Keywords yang sudah ada
            </h3>
            <span className="rounded-full bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
              {kw.matched.length}
            </span>
          </header>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {kw.matched.map((k) => (
              <span key={k} className="kw inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[12px] font-medium text-white">
                {k}
              </span>
            ))}
          </div>
        </article>

        {/* Missing keywords */}
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <header className="flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-slate-900">Keywords yang hilang</h3>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-rose-700 ring-1 ring-rose-200/60">
              {kw.missing_critical.length + kw.missing_nice_to_have.length}
            </span>
          </header>

          {kw.missing_critical.length > 0 && (
            <>
              <h4 className="mt-4 font-mono text-[10px] uppercase tracking-widest text-rose-600">Critical · must-have</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {kw.missing_critical.map((k) => (
                  <span key={k} className="kw inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[12px] font-medium text-rose-700 ring-1 ring-rose-200/60">
                    {k}
                  </span>
                ))}
              </div>
            </>
          )}

          {kw.missing_nice_to_have.length > 0 && (
            <>
              <h4 className="mt-4 font-mono text-[10px] uppercase tracking-widest text-amber-600">Nice to have</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {kw.missing_nice_to_have.map((k) => (
                  <span key={k} className="kw inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-700 ring-1 ring-amber-200/60">
                    {k}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="mt-5 flex items-start gap-3 rounded-xl bg-amber-50/70 p-3 ring-1 ring-amber-200/60">
            <span className="text-base">💡</span>
            <p className="text-[12px] leading-relaxed text-amber-900">
              Tambahkan critical keyword ke section <span className="font-semibold">Skills</span> atau bukti penggunaan di{' '}
              <span className="font-semibold">Experience</span> — jangan keyword stuffing.
            </p>
          </div>
        </article>
      </div>
    </div>
  )
}
