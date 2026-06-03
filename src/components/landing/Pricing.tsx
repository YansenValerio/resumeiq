import Link from 'next/link'

const features = [
  'Unlimited analysis',
  'Semua fitur — tanpa kunci',
  'Tidak perlu kartu kredit',
  'Bahasa Indonesia & English',
  'Export PDF report',
  'Riwayat analisis',
]

export default function Pricing() {
  return (
    <section id="analyze" className="relative mt-28 sm:mt-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">Pricing</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Mulai gratis. <span className="italic font-serif text-slate-500">Selamanya.</span>
          </h2>
          <p className="mt-4 text-pretty text-slate-600 sm:text-lg">
            Karena kesempatan kerja seharusnya tidak punya paywall.
          </p>
        </div>

        <div className="reveal mt-12">
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-r from-brand-400/40 via-violet2-500/40 to-brand-400/40 blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-1 shadow-float">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Free Forever
                    </span>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Semua fitur. Tanpa batas.</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs uppercase tracking-wider text-slate-400">harga</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-semibold tracking-tight text-slate-900">Rp 0</span>
                      <span className="text-sm text-slate-500">/ selamanya</span>
                    </div>
                  </div>
                </div>

                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/analyze"
                  className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet2-600 px-6 py-4 text-base font-semibold text-white shadow-glow transition hover:brightness-110 hover:scale-[1.01]"
                >
                  Analisis CV Gratis Sekarang
                  <svg className="h-4 w-4 transition group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
                <p className="mt-3 text-center text-xs text-slate-500">
                  No signup required untuk first analysis · ~20 detik
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
