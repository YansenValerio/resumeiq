# Product Requirements Document (PRD)
## ResumeIQ — AI-Powered Resume Analyzer & ATS Score Checker

---

**Versi Dokumen:** 1.0
**Tanggal:** 27 Mei 2026
**Status:** Draft
**Author:** [Nama Kamu]

---

## 1. Executive Summary

ResumeIQ adalah web application gratis yang membantu job seeker mengoptimalkan CV mereka agar lolos sistem Applicant Tracking System (ATS) dan menarik perhatian recruiter. User mengunggah CV (PDF/DOCX), menempelkan job description target, lalu mendapatkan skor ATS, analisis kata kunci, dan saran perbaikan yang konkret dalam hitungan detik.

Produk ini dibangun sebagai portfolio project untuk menunjukkan kemampuan full-stack development, AI integration, dan product thinking.

---

## 2. Problem Statement

### 2.1 Latar Belakang

Mayoritas perusahaan menengah-besar menggunakan ATS untuk menyaring CV sebelum sampai ke recruiter. Lebih dari 75% CV ditolak oleh ATS sebelum dibaca manusia, sering kali karena masalah formatting, kurang kata kunci, atau struktur yang tidak ATS-friendly.

### 2.2 Pain Points User

Job seeker tidak tahu apakah CV mereka ATS-friendly atau tidak. Mereka mengirim CV ke puluhan lowongan tanpa feedback mengapa selalu ditolak. Layanan profesional untuk review CV mahal (Rp 200.000 - Rp 1.500.000 per session). Tools yang ada sering berbahasa Inggris dan tidak optimal untuk pasar Indonesia.

### 2.3 Opportunity

Membangun tool gratis yang memberikan analisis berkualitas profesional dalam hitungan detik, dengan dukungan dual-language (Indonesia & Inggris).

---

## 3. Goals & Success Metrics

### 3.1 Product Goals

Memberikan analisis ATS yang akurat dan actionable. Membantu user meningkatkan kualitas CV mereka tanpa biaya. Menjadi case study yang kuat untuk portfolio software engineering.

### 3.2 Success Metrics

**Untuk portfolio purpose:**
- Project di-deploy dan berfungsi penuh
- Minimal 50 user mencoba dalam bulan pertama
- README dan dokumentasi yang lengkap di GitHub
- Mendapat 20+ stars di GitHub
- Mendapat traction di LinkedIn/Twitter (post yang dibagikan)

**Untuk produk (jika dilanjutkan):**
- Average analysis time < 15 detik
- User satisfaction score > 4/5
- Conversion rate dari landing ke complete analysis > 40%

### 3.3 Non-Goals

Bukan platform job board atau lowongan kerja. Tidak menyediakan template CV yang siap pakai (mungkin di V2). Tidak menjamin user diterima kerja — tool hanya bantu optimasi CV.

---

## 4. Target User

### 4.1 Primary Persona: Fresh Graduate

Nama persona: Andi, 22 tahun, baru lulus S1 Informatika. Sudah apply ke 30+ perusahaan dalam 2 bulan, hanya dapat 2 panggilan interview. Tidak tahu mengapa CV-nya selalu ditolak. Menggunakan laptop dan mobile untuk job hunting. Budget terbatas untuk layanan berbayar.

**Kebutuhan utama:** Feedback konkret apa yang salah dengan CV-nya dan cara memperbaikinya.

### 4.2 Secondary Persona: Career Switcher

Nama persona: Sari, 28 tahun, ingin pindah dari marketing ke product management. CV-nya penuh pengalaman marketing tapi sedang apply ke posisi PM. Bingung bagaimana memposisikan pengalamannya.

**Kebutuhan utama:** Insight kata kunci industri baru yang harus ditambahkan ke CV.

### 4.3 Tertiary Persona: Active Job Seeker

Nama persona: Budi, 30 tahun, software engineer dengan 5 tahun pengalaman. Sedang aktif cari kerja, ingin tailor CV per lowongan untuk meningkatkan response rate.

**Kebutuhan utama:** Tool cepat untuk customize CV per job description.

---

## 5. User Stories

**Sebagai job seeker pemula**, saya ingin upload CV saya dan langsung tahu skornya tanpa registrasi, agar saya bisa cepat tahu kualitas CV saya.

**Sebagai user**, saya ingin paste job description dari LinkedIn/JobStreet, agar analisisnya kontekstual terhadap posisi yang saya incar.

**Sebagai user**, saya ingin melihat kata kunci spesifik yang hilang dari CV saya, agar saya tahu apa yang harus ditambahkan.

**Sebagai user**, saya ingin dapat saran perbaikan per section (summary, experience, dll), agar saya bisa improve dengan terstruktur.

**Sebagai user**, saya ingin bisa download laporan dalam format PDF, agar bisa referensi nanti saat revisi CV.

**Sebagai user yang sudah login**, saya ingin melihat history analisis sebelumnya, agar bisa track progress improvement CV saya.

---

## 6. Functional Requirements

### 6.1 Fitur Inti (MVP)

**F1: Upload Resume**
- Support format PDF dan DOCX
- Maksimal ukuran file 5 MB
- Drag-and-drop atau click to upload
- Preview hasil parsing untuk verifikasi
- Error handling untuk file corrupt atau format tidak didukung

**F2: Job Description Input**
- Text area untuk paste JD (minimal 100 karakter, maksimal 10.000 karakter)
- Opsi: paste URL job posting (V2, butuh scraping)
- Auto-detect bahasa (Indonesia atau Inggris)

**F3: Analisis ATS**
- Overall ATS score (0-100)
- Compatibility score per kategori (formatting, keywords, content)
- Visualisasi skor dengan circular progress dan color coding (merah/kuning/hijau)
- Waktu proses maksimal 20 detik

**F4: Keyword Analysis**
- List kata kunci yang ditemukan di CV
- List kata kunci penting dari JD yang hilang
- Klasifikasi: critical vs nice-to-have
- Frequency count untuk kata kunci penting

**F5: Section-by-Section Feedback**
- Analisis per section: summary, experience, education, skills
- Score per section dengan penjelasan
- Saran konkret per section (bukan generic advice)

**F6: Actionable Recommendations**
- Top 5 prioritas perbaikan
- Setiap rekomendasi punya: priority level, issue, suggested action
- Contoh "before-after" untuk bullet point yang lemah

**F7: Multi-language Support**
- UI dalam Bahasa Indonesia dan Inggris
- Analisis CV bisa untuk dua bahasa
- Toggle bahasa di header

### 6.2 Fitur Tambahan (V1.5)

**F8: User Account & History**
- Sign up via Google OAuth
- Save analisis ke history
- Compare antar versi CV
- Rate limiting: 5 analisis/hari untuk user gratis

**F9: Export to PDF**
- Download laporan analisis dalam PDF
- Branded report dengan logo ResumeIQ
- Include semua section + rekomendasi

**F10: Industry Templates**
- Pilih industry: Tech, Finance, Marketing, dll
- Scoring disesuaikan dengan ekspektasi industri
- Industry-specific keyword library

### 6.3 Fitur Future (V2)

URL scraping untuk JD dari LinkedIn/JobStreet. AI-powered resume rewriter (suggest rewrite bullet points). Resume builder dengan template ATS-friendly. Browser extension untuk auto-fill ke ATS perusahaan. Mobile app native (iOS/Android). Premium tier dengan unlimited analysis dan advanced features.

---

## 7. Non-Functional Requirements

### 7.1 Performance

Page load time < 2 detik. Analisis CV selesai dalam < 20 detik. Support 100 concurrent users (gratisan tier).

### 7.2 Security

File upload divalidasi mime-type dan size. Resume tidak disimpan permanen kecuali user login. Implementasi rate limiting untuk anti-abuse. CSRF protection untuk semua form. Tidak ada PII (Personal Identifiable Information) yang di-log.

### 7.3 Reliability

Uptime target 99% (gratisan tier Vercel). Graceful error handling — kalau AI API down, tampilkan pesan jelas. Fallback parser kalau primary PDF parser gagal.

### 7.4 Accessibility

WCAG 2.1 Level AA compliance. Keyboard navigation untuk semua interactive elements. Screen reader friendly. Color contrast minimum 4.5:1.

### 7.5 Browser Support

Chrome, Firefox, Safari, Edge versi 2 tahun terakhir. Mobile responsive: iPhone Safari, Android Chrome.

---

## 8. Technical Architecture

### 8.1 Tech Stack

**Frontend:**
- Next.js 14 (App Router) — full-stack framework
- TypeScript — type safety
- Tailwind CSS — styling
- shadcn/ui — component library
- React Hook Form + Zod — form validation
- Recharts — visualisasi data

**Backend:**
- Next.js API Routes — serverless functions
- pdf-parse — PDF text extraction
- mammoth — DOCX text extraction

**AI/LLM:**
- Google Gemini 2.0 Flash API (gratis tier)
- Structured output mode untuk JSON yang valid

**Database & Auth:**
- Supabase (PostgreSQL + Auth + Storage) — gratis tier

**Hosting:**
- Vercel — frontend & API (gratis tier)
- Supabase Cloud — database (gratis tier)

**Analytics:**
- Vercel Analytics (gratis)
- Plausible Analytics (opsional, gratis untuk open source)

### 8.2 System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Next.js Frontend   │
│  (Vercel CDN Edge)  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Next.js API Routes │
│  ┌───────────────┐  │
│  │ File Parser   │  │
│  │ (pdf/docx)    │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Gemini Client │──┼──→ Google Gemini API
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Score Engine  │  │
│  └───────────────┘  │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Supabase           │
│  - PostgreSQL DB    │
│  - Auth             │
│  - Storage          │
└─────────────────────┘
```

### 8.3 Data Model

**Tabel `users`** (dikelola Supabase Auth)
- id, email, created_at

**Tabel `analyses`**
- id (uuid), user_id (nullable untuk guest), created_at
- resume_filename, resume_text (compressed)
- job_description
- overall_score, ats_score
- analysis_result (JSONB)

**Tabel `usage_tracking`**
- id, user_id atau ip_hash, date, count

---

## 9. User Flow

### 9.1 Happy Path — Guest User

User landing di homepage. User klik "Analyze My Resume". User drag CV ke upload area. System parsing dan tampilkan preview text. User paste JD di text area. User klik "Start Analysis". Loading state dengan animasi (10-20 detik). System tampilkan halaman hasil dengan skor dan feedback. User scroll baca rekomendasi. User klik "Download Report" (opsional). User klik "Try Another Resume" untuk analisis lagi.

### 9.2 Returning User Path

User login via Google. User landing di dashboard. User lihat history analisis sebelumnya. User klik "New Analysis" atau "Re-analyze with new JD". System tampilkan comparison dengan analisis lama (jika ada).

### 9.3 Error Paths

File terlalu besar → tampilkan error dengan saran kompres file. File format tidak didukung → tampilkan format yang didukung. JD terlalu pendek → minta minimal 100 karakter. API limit tercapai → tampilkan pesan dan estimasi reset time. AI API error → suggest retry dengan tombol.

---

## 10. UI/UX Design Principles

### 10.1 Design Direction

Clean, modern, professional. Inspirasi: Linear, Notion, Stripe. Color palette: primary blue/purple gradient, neutral grays. Typography: Inter atau Geist untuk readability. Mobile-first responsive design.

### 10.2 Key Screens

**Landing Page**
- Hero section dengan value prop yang jelas
- Demo/preview hasil analisis
- Social proof (kalau ada)
- CTA besar "Analyze My Resume Free"

**Upload & Input Page**
- Two-column layout di desktop
- Single column stack di mobile
- Progress indicator (step 1/2)
- Clear visual hierarchy

**Analysis Result Page**
- Score hero di atas (large circular progress)
- Tab navigation untuk section yang berbeda
- Color-coded recommendations
- Sticky action bar untuk download/share

**Dashboard (logged in)**
- Recent analyses cards
- Quick stats (total analyses, avg score)
- CTA untuk new analysis

---

## 11. Timeline & Milestones

### Sprint 1 (Minggu 1): Foundation
Setup project, repo, dan deployment pipeline. Build landing page. Implementasi file upload dengan drag-and-drop. Parser PDF dan DOCX dengan error handling. Deliverable: working file upload yang tampilkan extracted text.

### Sprint 2 (Minggu 2): Core AI Engine
Setup Gemini API client. Design dan iterate prompt untuk analisis. Implementasi structured output dengan schema. Build scoring algorithm. Deliverable: bisa generate analisis JSON dari resume + JD.

### Sprint 3 (Minggu 3): Results UI
Build halaman hasil dengan komponen visualisasi. Implementasi loading states yang menarik. Section feedback components. Mobile responsive testing. Deliverable: full flow upload → analyze → result.

### Sprint 4 (Minggu 4): Auth & Polish
Implementasi Supabase Auth dengan Google OAuth. Build dashboard dan history. PDF export functionality. Rate limiting dan abuse prevention. Deliverable: production-ready V1.

### Sprint 5 (Minggu 5): Launch
Final testing dan bug fixes. Tulis dokumentasi dan README. Buat demo video 60 detik. Deploy ke custom domain. Launch di LinkedIn, Reddit, Product Hunt. Deliverable: live product dengan user pertama.

---

## 12. Risks & Mitigations

### 12.1 Technical Risks

**Risk:** PDF parsing tidak akurat untuk layout kolom dua atau dengan grafik.
**Mitigation:** Pakai multiple parser sebagai fallback. Beri user opsi paste manual jika parsing gagal.

**Risk:** Gemini API rate limit habis di tengah hari.
**Mitigation:** Implementasi caching agresif untuk JD yang sama. Limit per user. Monitor usage harian.

**Risk:** Gemini return JSON yang invalid kadang-kadang.
**Mitigation:** Pakai structured output mode dengan schema. Implementasi retry dengan exponential backoff. Validasi JSON di server side.

### 12.2 Product Risks

**Risk:** Hasil analisis tidak akurat atau generic.
**Mitigation:** Iterate prompt dengan banyak sample. Test dengan CV real dari berbagai industri. Kumpulkan feedback user dan refine.

**Risk:** User tidak percaya hasil analisis AI.
**Mitigation:** Tunjukkan reasoning di balik scoring. Berikan link sumber/best practices. Transparansi tentang limitasi.

### 12.3 Business Risks (untuk portfolio)

**Risk:** Tidak dapat traction atau visibility.
**Mitigation:** Strategi konten dari hari 1 — build in public di Twitter/LinkedIn. Submit ke Product Hunt, Hacker News, Indie Hackers. Reach out ke career coach untuk endorsement.

---

## 13. Open Questions

Apakah perlu menyimpan resume user secara permanen? Pro: bisa compare, con: privacy concern. Bagaimana handling resume dengan foto atau grafik kompleks? Bisakah dideteksi dan diberi warning? Apakah ada partner yang mau kolaborasi (kampus, komunitas job seeker)? Bagaimana monetization strategy jika produk ini berkembang? (Subscription, freemium, sponsored content?)

---

## 14. Appendix

### 14.1 Competitor Analysis

**Jobscan** ($49/bulan) — fitur lengkap tapi mahal, English only, fokus US market.
**Resume Worded** ($19/bulan) — bagus tapi berbayar, tidak ATS-focused.
**Rezi** ($29/bulan) — fokus builder, bukan analyzer.
**Free alternatives** — kebanyakan basic keyword matching tanpa AI insight.

**Differentiator ResumeIQ:** Gratis, dual-language (ID/EN), AI-powered analysis yang kontekstual, fokus ke pasar Indonesia.

### 14.2 Glossary

**ATS (Applicant Tracking System):** Software yang dipakai perusahaan untuk filter dan kelola lamaran kerja.
**Keyword Matching:** Proses mencocokkan kata kunci dari JD dengan kata kunci di CV.
**Parsing:** Proses mengekstrak text terstruktur dari file (PDF/DOCX).
**RAG:** Retrieval-Augmented Generation, teknik untuk memberikan konteks tambahan ke LLM.

### 14.3 References

Google Gemini API docs: ai.google.dev. Next.js docs: nextjs.org/docs. Supabase docs: supabase.com/docs. shadcn/ui: ui.shadcn.com.

---

**End of Document**
