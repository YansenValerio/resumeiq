export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-28 sm:mt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">How it works</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Tiga langkah. Dua puluh detik.
          </h2>
        </div>

        <div className="reveal relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Connector line */}
          <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-[68px] hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block" />

          {/* Step 1 */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white shadow-card">
                <svg className="h-5 w-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </span>
              <span className="font-mono text-xs text-slate-400">STEP 01</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Upload CV</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Drag &amp; drop PDF/DOCX. Atau paste teks langsung jika lebih cepat.
            </p>
            <div className="mt-5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white shadow-soft ring-1 ring-slate-200">
                <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600">Drop CV.pdf here</p>
              <p className="font-mono text-[10px] text-slate-400">PDF, DOCX · max 5MB</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white shadow-card">
                <svg className="h-5 w-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                </svg>
              </span>
              <span className="font-mono text-xs text-slate-400">STEP 02</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Paste Job Description</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Salin JD dari LinkedIn, Glints, atau email recruiter. AI auto-deteksi kata kunci.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span>Job · Senior Product Designer</span>
                <span className="text-brand-500">● live</span>
              </div>
              <p className="mt-2.5 line-clamp-3 text-[12px] leading-relaxed text-slate-600">
                We&apos;re looking for a designer with 4+ years experience in{' '}
                <mark className="rounded bg-brand-100 px-1 text-brand-800">B2B SaaS</mark>, strong skills in{' '}
                <mark className="rounded bg-brand-100 px-1 text-brand-800">design systems</mark>, and proven track record working with{' '}
                <mark className="rounded bg-brand-100 px-1 text-brand-800">cross-functional teams</mark>…
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white shadow-card">
                <svg className="h-5 w-5 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </span>
              <span className="font-mono text-xs text-slate-400">STEP 03</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">Get instant analysis</h3>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-600">
              Hasil lengkap dalam ~20 detik. Lihat skor, kata kunci, dan langkah perbaikan.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
                  <span className="text-base font-semibold">87</span>
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-medium text-slate-900">Skor naik dari 45 → 87</div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-brand-500 to-violet2-500" />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-slate-500">+ 12 saran prioritas tinggi</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
