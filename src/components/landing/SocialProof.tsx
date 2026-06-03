const companies = [
  { name: 'Tokopedia', style: 'font-semibold tracking-tight' },
  { name: 'GoTo',      style: 'font-light italic tracking-tight' },
  { name: 'Traveloka', style: 'font-semibold tracking-tight' },
  { name: 'Bukalapak', style: 'font-semibold tracking-tight' },
  { name: 'Shopee',    style: 'font-bold uppercase tracking-[0.2em]' },
  { name: 'Blibli',   style: 'font-semibold tracking-tight' },
  { name: 'Grab',     style: 'font-light uppercase tracking-widest' },
  { name: 'Ruangguru',style: 'font-semibold tracking-tight' },
  { name: 'Xendit',   style: 'font-semibold tracking-tight' },
  { name: 'DANA',     style: 'font-bold tracking-tight' },
]

export default function SocialProof() {
  return (
    <section aria-label="Trusted by" className="mt-20 sm:mt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Trusted by job seekers diterima di
        </p>
        <div
          className="relative mt-6 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)',
            WebkitMaskImage: 'linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)',
          }}
        >
          <div className="marquee-track flex w-max items-center gap-12 whitespace-nowrap text-slate-400">
            {/* Duplicated for seamless loop */}
            {[...companies, ...companies].map((c, i) => (
              <span key={i} className={`text-2xl ${c.style}`}>{c.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
