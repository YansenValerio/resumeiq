import Link from 'next/link'

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Try free', href: '/analyze' },
    { label: 'Changelog', href: '#' },
  ],
  Resources: [
    { label: 'ATS guide', href: '#' },
    { label: 'CV templates', href: '#' },
    { label: 'Career blog', href: '#' },
    { label: 'FAQ', href: '#faq' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Cookies', href: '#' },
    { label: 'Security', href: '#' },
  ],
  Social: [
    { label: 'Twitter', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-slate-200 bg-slate-50/60 sm:mt-40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet2-600 text-white shadow-glow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <span className="text-[17px] font-semibold tracking-tight grad-text">ResumeIQ</span>
            </Link>
            <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-slate-600">
              AI-powered resume analyzer untuk job seeker Indonesia. Lolos ATS dalam 20 detik — gratis, selamanya.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                {
                  label: 'Twitter',
                  icon: <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.91l-4.83-6.31L5.6 22H2.34l8.02-9.17L1.5 2h7.08l4.36 5.77L18.244 2Zm-2.42 18.13h1.87L7.27 3.77H5.27l10.55 16.36Z" />,
                },
                {
                  label: 'LinkedIn',
                  icon: <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.45-2.13 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />,
                },
                {
                  label: 'GitHub',
                  icon: <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.02c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.41-5.25 5.69.41.35.78 1.04.78 2.1v3.11c0 .3.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5Z" />,
                },
              ].map((social) => (
                <a
                  key={social.label}
                  aria-label={social.label}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-900 hover:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">{social.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group}</h4>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="hover:text-slate-900">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© 2026 ResumeIQ. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <span className="text-rose-500">♥</span> in Indonesia · <span className="font-mono">v1.0</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
