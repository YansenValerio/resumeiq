export default function Features() {
  return (
    <section id="features" className="mt-28 sm:mt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">Features</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Semua yang kamu butuhkan untuk <span className="grad-text">lolos screening</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-600 sm:text-lg">
            Bukan sekadar skor. ResumeIQ kasih konteks, prioritas, dan saran yang bisa langsung kamu kerjakan.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-4 lg:grid-cols-6 lg:gap-5">
          {/* ATS Score */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card lg:col-span-3 lg:p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-600">01 · Scoring</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">ATS Score real-time</h3>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-slate-600">
              Skor 0–100 dengan breakdown 4 dimensi. Tahu persis di mana CV-mu kuat, dan di mana harus diperbaiki.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="grid grid-cols-2 items-center gap-5 sm:grid-cols-[160px_1fr]">
                <div className="relative mx-auto h-32 w-32">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="314" strokeDashoffset="69" />
                  </svg>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="text-3xl font-semibold text-slate-900">78</div>
                      <div className="font-mono text-[10px] text-slate-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center justify-between gap-2"><span className="text-slate-600">Keywords</span><span className="font-mono text-emerald-600">+18</span></li>
                  <li className="flex items-center justify-between gap-2"><span className="text-slate-600">Structure</span><span className="font-mono text-emerald-600">+12</span></li>
                  <li className="flex items-center justify-between gap-2"><span className="text-slate-600">Verbs</span><span className="font-mono text-amber-600">±0</span></li>
                  <li className="flex items-center justify-between gap-2"><span className="text-slate-600">Impact</span><span className="font-mono text-rose-600">-7</span></li>
                </ul>
              </div>
            </div>
          </article>

          {/* Keyword matching */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card lg:col-span-3 lg:p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-600">02 · Matching</span>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Keyword matching</h3>
            <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-slate-600">
              Lihat kata kunci dari JD yang ada, yang hilang, dan yang perlu kamu tambahkan — dengan prioritas.
            </p>
            <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'React', type: 'match' },
                  { label: 'TypeScript', type: 'match' },
                  { label: 'Tailwind', type: 'match' },
                  { label: 'Next.js', type: 'missing' },
                  { label: 'GraphQL', type: 'missing' },
                  { label: 'A/B testing', type: 'missing' },
                  { label: 'Agile', type: 'weak' },
                  { label: 'Stakeholder', type: 'weak' },
                ].map((kw) => (
                  <span
                    key={kw.label}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium ring-1 ${
                      kw.type === 'match'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
                        : kw.type === 'missing'
                        ? 'bg-rose-50 text-rose-700 ring-rose-200/60'
                        : 'bg-amber-50 text-amber-700 ring-amber-200/60'
                    }`}
                  >
                    <span className="font-mono text-[9px]">
                      {kw.type === 'match' ? '✓' : kw.type === 'missing' ? '×' : '!'}
                    </span>
                    {kw.label}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-mono text-[11px] text-slate-500">
                <span className="text-emerald-600">8 cocok</span> ·{' '}
                <span className="text-amber-600">2 lemah</span> ·{' '}
                <span className="text-rose-600">3 hilang</span>
              </p>
            </div>
          </article>

          {/* Section feedback */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card lg:col-span-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Section feedback</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Saran konkret per bagian — Summary, Experience, Skills — bukan komentar generik.
            </p>
          </article>

          {/* Bilingual */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card sm:col-span-3 lg:col-span-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet2-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/>
                <path d="M2 5h12"/><path d="M7 2h1"/>
                <path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Bilingual ID &amp; EN</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Paham istilah lokal dan internasional. Feedback dalam bahasa yang kamu pilih.
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-[11px] font-medium">
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">Bahasa</span>
              <span className="px-2 py-0.5 text-slate-500">English</span>
            </div>
          </article>

          {/* PDF export */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:shadow-card sm:col-span-3 lg:col-span-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">Export PDF report</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Simpan laporan rapi untuk dibandingkan antar revisi — atau dibagi ke mentor.
            </p>
          </article>

          {/* Privacy */}
          <article className="group relative col-span-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-card transition hover:shadow-float lg:col-span-6 lg:p-8">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-brand-300">Privacy first</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">CV-mu tidak disimpan permanen.</h3>
                <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-slate-300">
                  File diproses sementara, kemudian dihapus otomatis dalam 24 jam. Tidak dijual ke siapapun. Tidak dipakai untuk training AI eksternal.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-white/15">🔒 End-to-end encrypted</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-white/15">🗑️ Auto-delete 24h</span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium ring-1 ring-white/15">🚫 No training data</span>
                </div>
              </div>
              <div className="hidden lg:block">
                <svg className="h-32 w-32 animate-spin-slow text-brand-400/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
                  <circle cx="50" cy="50" r="48"/><circle cx="50" cy="50" r="36"/>
                  <circle cx="50" cy="50" r="24"/><circle cx="50" cy="50" r="12"/>
                  <line x1="2" y1="50" x2="98" y2="50"/><line x1="50" y1="2" x2="50" y2="98"/>
                </svg>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
