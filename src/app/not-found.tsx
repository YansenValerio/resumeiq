import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="relative">
        <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-brand-400/20 to-violet2-400/20 blur-3xl" />
        <span className="font-mono text-8xl font-bold tracking-tight text-slate-200 select-none">404</span>
      </div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Kembali ke Home
        </Link>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          Mulai Analisis CV
        </Link>
      </div>
    </div>
  )
}
