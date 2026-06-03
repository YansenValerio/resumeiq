const testimonials = [
  {
    quote: '"CV gue dari skor 45 jadi 87 setelah pakai ResumeIQ semalaman. Minggu depannya langsung dapet 3 interview call. Tools yang gue gak tahu kenapa gratis."',
    initials: 'SA',
    name: 'Sarah A.',
    role: 'Fresh Graduate · UI Designer @ Tokopedia',
    avatarGrad: 'from-rose-400 to-pink-500',
  },
  {
    quote: '"Career switcher dari teaching ke product management. Akhirnya tahu kata kunci apa yang harus muncul. Pivot tanpa sekolah lagi, dan dapet kerja di startup."',
    initials: 'BP',
    name: 'Budi P.',
    role: 'Career Switcher · APM @ Traveloka',
    avatarGrad: 'from-brand-500 to-violet2-600',
  },
  {
    quote: '"Tool wajib sebelum apply lowongan kerja. Gue rutin pakai untuk setiap aplikasi — tailor CV ke JD-nya. Hit rate interview gue naik dari ~5% ke 28%."',
    initials: 'MR',
    name: 'Maya R.',
    role: 'Software Engineer · Senior SWE @ GoTo',
    avatarGrad: 'from-emerald-400 to-teal-500',
  },
]

function StarIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="mt-28 sm:mt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">Stories</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Dari ditolak, jadi diterima.
          </h2>
        </div>

        <div className="reveal mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center gap-1 text-amber-500" aria-label="Rating 5 out of 5">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty text-[15px] leading-relaxed text-slate-700">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${t.avatarGrad} font-semibold text-white`}>
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
