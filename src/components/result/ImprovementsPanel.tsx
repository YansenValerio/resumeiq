'use client'

import { useState } from 'react'
import type { AnalysisResult } from '@/types/analysis'
import PriorityBadge from './PriorityBadge'

type FilterType = 'all' | 'high' | 'medium' | 'low'

const SECTION_OF: Record<string, string> = {
  summary: 'Summary', experience: 'Experience', skills: 'Skills', education: 'Education',
}

function guessSection(issue: string, suggestion: string): string {
  const text = (issue + ' ' + suggestion).toLowerCase()
  if (text.includes('summary')) return 'Summary'
  if (text.includes('experience') || text.includes('bullet') || text.includes('quantif')) return 'Experience'
  if (text.includes('skill') || text.includes('keyword')) return 'Skills'
  if (text.includes('education') || text.includes('coursework')) return 'Education'
  return 'Format'
}

export default function ImprovementsPanel({ result }: { result: AnalysisResult }) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [done, setDone] = useState<Set<number>>(new Set())

  const imps = result.top_improvements
  const counts = {
    high:   imps.filter(i => i.priority === 'high').length,
    medium: imps.filter(i => i.priority === 'medium').length,
    low:    imps.filter(i => i.priority === 'low').length,
  }

  const filtered = filter === 'all' ? imps : imps.filter(i => i.priority === filter)

  function toggleDone(idx: number) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-4 flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
        <span className="text-slate-400">Filter:</span>
        {(['all', 'high', 'medium', 'low'] as FilterType[]).map((f) => {
          const label = f === 'all' ? `All · ${imps.length}` : f === 'high' ? `High · ${counts.high}` : f === 'medium' ? `Med · ${counts.medium}` : `Low · ${counts.low}`
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-2.5 py-1 transition ${active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((imp, i) => {
          const globalIdx = imps.indexOf(imp)
          const isDone = done.has(globalIdx)
          const section = guessSection(imp.issue, imp.suggestion)
          const hasExample = !!imp.example

          return (
            <article key={globalIdx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <header className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <PriorityBadge priority={imp.priority} />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{section}</span>
                </div>
                <button
                  onClick={() => toggleDone(globalIdx)}
                  data-done={isDone}
                  className={`check-pill inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                    isDone
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className={`check-box grid h-3.5 w-3.5 place-items-center rounded-sm border transition ${isDone ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                    <svg className={`h-2 w-2 transition ${isDone ? 'opacity-100 text-white' : 'opacity-0'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  <span className={`check-label ${isDone ? 'line-through opacity-70' : ''}`}>
                    {isDone ? 'Done' : 'Mark as done'}
                  </span>
                </button>
              </header>

              <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-900">{imp.issue}</h3>
              <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-slate-600">{imp.suggestion}</p>

              {hasExample && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {imp.example!.split('\n').filter(l => l.startsWith('Before:') || l.startsWith('After:')).length >= 2 ? (
                    imp.example!.split('\n').reduce<string[][]>((acc, line) => {
                      if (line.startsWith('Before:')) acc.push([line.replace('Before:', '').trim()])
                      else if (line.startsWith('After:')) acc.push([line.replace('After:', '').trim()])
                      else if (acc.length > 0) acc[acc.length - 1][0] += '\n' + line
                      return acc
                    }, []).map((lines, bi) => (
                      <div key={bi} className={`rounded-xl border p-3.5 ${bi === 0 ? 'border-rose-200/70 bg-rose-50/50' : 'border-emerald-200/70 bg-emerald-50/50'}`}>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                          <span className={`rounded-sm px-1 text-white ${bi === 0 ? 'bg-rose-600' : 'bg-emerald-600'}`}>{bi === 0 ? 'Before' : 'After'}</span>
                        </div>
                        <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-700">{lines[0]}</pre>
                      </div>
                    ))
                  ) : (
                    <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Contoh</div>
                      <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-700">{imp.example}</pre>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                <span className="font-mono">+ estimasi poin naik</span>
                <button className="font-medium text-brand-600 hover:underline">Apply suggestion</button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
