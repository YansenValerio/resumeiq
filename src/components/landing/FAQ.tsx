const faqs = [
  {
    q: 'Apakah ResumeIQ benar-benar gratis?',
    a: 'Iya. 100% gratis, tanpa trial, tanpa kartu kredit. Kami didanai komunitas dan donasi opsional — bukan paywall. Semua fitur terbuka untuk semua user.',
    open: true,
  },
  {
    q: 'Apakah CV saya disimpan?',
    a: 'Tidak permanen. File CV diproses sementara dan dihapus otomatis dalam 24 jam. Hanya metadata anonim (skor, kategori) yang disimpan untuk riwayatmu — itupun bisa kamu hapus kapan saja.',
  },
  {
    q: 'Bagaimana akurasi AI-nya?',
    a: 'Model di-tune dari pola screening 12+ ATS populer (Workday, Greenhouse, Lever, dll) plus feedback recruiter Indonesia. Tetap, ini alat bantu — bukan jaminan diterima. Gunakan saran sebagai panduan, bukan aturan kaku.',
  },
  {
    q: 'Format file apa yang didukung?',
    a: 'PDF dan DOCX hingga 5MB. Untuk hasil terbaik, gunakan PDF yang berisi teks (bukan hasil scan/foto). Kamu juga bisa paste teks langsung jika lebih cepat.',
  },
  {
    q: 'Apakah support Bahasa Indonesia?',
    a: 'Iya — Bahasa Indonesia adalah first-class citizen, bukan terjemahan. Model paham istilah lokal (mis. "magang", "freelance", "OJK") dan bisa kasih feedback dalam Bahasa atau English sesuai pilihanmu.',
  },
  {
    q: 'Bagaimana cara kerja ATS sebenarnya?',
    a: 'Applicant Tracking System (ATS) memparsing CV jadi data terstruktur, lalu mencocokkan dengan kata kunci dari JD. CV yang format-nya rapi dan keyword-nya cocok di-bypass langsung ke recruiter. Sisanya di-rank atau di-filter otomatis.',
  },
  {
    q: 'Apakah ada limit jumlah analisis?',
    a: 'Tanpa login: 3 analisis/hari per browser. Login dengan email (gratis): unlimited, plus riwayat dan perbandingan revisi. Tanpa langganan tersembunyi.',
  },
]

function ChevIcon() {
  return (
    <svg className="faq-chev h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="mt-28 sm:mt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-600">FAQ</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Pertanyaan yang sering ditanya.
          </h2>
        </div>

        <div className="reveal mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft">
          {faqs.map((faq) => (
            <details key={faq.q} className="group p-5 sm:p-6" open={faq.open}>
              <summary className="flex items-start justify-between gap-4">
                <span className="text-[15px] font-medium text-slate-900 sm:text-base">{faq.q}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700">
                  <ChevIcon />
                </span>
              </summary>
              <p className="mt-3 text-pretty text-[14px] leading-relaxed text-slate-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
