const problems = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 3-3 3"/>
        <path d="M12 17h.01"/>
      </svg>
    ),
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'CV ditolak, tidak tahu kenapa',
    desc: 'Email rejection generik tanpa feedback. Kamu cuma menebak-nebak apa yang salah, lagi dan lagi.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    iconBg: 'bg-amber-50 text-amber-600',
    title: 'Layanan profesional terlalu mahal',
    desc: 'Rp 200K–1.5jt untuk satu kali review. Tidak masuk akal untuk fresh graduate yang belum digaji.',
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    iconBg: 'bg-sky-50 text-sky-600',
    title: 'Tools yang ada English-only',
    desc: 'Jobscan, Resume Worded — bagus tapi tidak paham konteks lokal, istilah Indonesia, atau format CV Asia.',
  },
]

export default function Problem() {
  return (
    <section className="mt-24 sm:mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-rose-600">The problem</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            75% CV ditolak ATS <span className="italic font-serif text-slate-500">sebelum</span> dibaca recruiter.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-600 sm:text-lg">
            Robot menyaring lamaranmu duluan. Tanpa tahu aturan mainnya, CV terbaik pun bisa berakhir di tempat sampah.
          </p>
        </div>

        <div className="reveal mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {problems.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${p.iconBg}`}>
                {p.icon}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{p.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-slate-600">{p.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
