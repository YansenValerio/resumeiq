# 🎯 ResumeIQ

> AI-powered resume analyzer dan ATS score checker. Gratis, open source, dan mendukung Bahasa Indonesia & Inggris.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

![ResumeIQ Demo](./docs/demo.gif)

## ✨ Features

- 📄 **Smart Resume Parsing** — Support PDF dan DOCX dengan layout kompleks
- 🤖 **AI-Powered Analysis** — Pakai Google Gemini 2.0 Flash untuk analisis kontekstual
- 📊 **ATS Score** — Skor 0-100 dengan breakdown per kategori
- 🎯 **Keyword Matching** — Identifikasi kata kunci yang hilang dari CV
- 💡 **Actionable Feedback** — Saran konkret per section, bukan generic advice
- 🌐 **Bilingual** — Mendukung Bahasa Indonesia dan Inggris
- 📥 **Export Report** — Download hasil analisis dalam PDF
- 🔒 **Privacy First** — Resume tidak disimpan permanen (kecuali user login)

## 🚀 Demo

🔗 **Live Demo:** [resumeiq.vercel.app](https://resumeiq.vercel.app)

## 🛠️ Tech Stack

**Frontend & Backend**
- [Next.js 14](https://nextjs.org/) — App Router, Server Components
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [shadcn/ui](https://ui.shadcn.com/) — UI Components

**AI / LLM**
- [Google Gemini 2.0 Flash](https://ai.google.dev/) — Free tier, structured output

**Database & Auth**
- [Supabase](https://supabase.com/) — PostgreSQL, Auth, Storage

**Deployment**
- [Vercel](https://vercel.com/) — Frontend & API hosting (gratis)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ dan npm/pnpm
- Akun Google (untuk Gemini API key)
- Akun Supabase (gratis)
- Akun Vercel (untuk deploy)

### Setup Lokal

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/resumeiq.git
   cd resumeiq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Lalu isi nilai-nilai di `.env.local` (lihat `.env.example` untuk panduan).

4. **Setup Supabase**
   - Buat project di [supabase.com](https://supabase.com)
   - Jalankan migrasi SQL di `scripts/schema.sql` lewat SQL Editor
   - Copy URL dan anon key ke `.env.local`

5. **Run development server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Project Structure

```
resumeiq/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── analyze/        # Endpoint analisis utama
│   │   │   └── parse/          # Endpoint parsing file
│   │   ├── analyze/            # Halaman upload & input
│   │   ├── result/             # Halaman hasil analisis
│   │   ├── dashboard/          # Dashboard user (auth)
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── upload/             # Upload-related components
│   │   ├── result/             # Result visualization
│   │   └── shared/             # Shared components
│   ├── lib/                    # Utilities & business logic
│   │   ├── gemini.ts           # Gemini API client
│   │   ├── parser.ts           # PDF/DOCX parser
│   │   ├── scoring.ts          # Scoring algorithm
│   │   ├── prompts.ts          # AI prompts
│   │   └── supabase.ts         # Supabase client
│   └── types/                  # TypeScript types
├── docs/                       # Documentation
│   ├── PRD.md                  # Product Requirements
│   ├── ARCHITECTURE.md         # Technical architecture
│   └── PROMPTS.md              # Prompt engineering docs
├── scripts/                    # Setup scripts
│   └── schema.sql              # Database schema
└── public/                     # Static assets
```

## 🧪 Development Workflow

### Sprint Roadmap

- [x] **Sprint 1:** Setup, landing page, file upload & parsing
- [ ] **Sprint 2:** Gemini integration, scoring engine
- [ ] **Sprint 3:** Result UI, visualizations
- [ ] **Sprint 4:** Auth, dashboard, PDF export
- [ ] **Sprint 5:** Polish, deploy, launch

Detail lengkap di [PRD.md](./docs/PRD.md).

### Running Tests

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Lint code
npm run type-check    # Type check
```

## 🤝 Contributing

Contributions welcome! Buka issue dulu untuk diskusi sebelum bikin PR besar.

1. Fork repo
2. Buat branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Buka Pull Request

## 📝 License

MIT License — lihat [LICENSE](./LICENSE) untuk detail.

## 🙏 Acknowledgments

- Inspirasi awal dari Jobscan dan Resume Worded
- shadcn/ui untuk komponen yang gorgeous
- Google Gemini untuk free tier yang generous

## 📬 Contact

- LinkedIn: [Nama Kamu](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

⭐ Star repo ini kalau berguna! Built with ❤️ in Indonesia.
