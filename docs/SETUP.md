# 🚀 Setup Guide — ResumeIQ

Panduan lengkap untuk setup dan deploy ResumeIQ dari nol. Estimasi waktu: 30-45 menit.

## Prerequisites

Sebelum mulai, pastikan kamu punya:
- Node.js 18+ ([download](https://nodejs.org/))
- Akun GitHub
- Akun Google (untuk Gemini API)
- Akun Supabase ([daftar gratis](https://supabase.com/))
- Akun Vercel ([daftar gratis](https://vercel.com/))

## Step 1: Setup Project (5 menit)

```bash
# Clone atau buat project baru
npx create-next-app@latest resumeiq \
  --typescript --tailwind --app --no-src-dir=false \
  --import-alias "@/*"

cd resumeiq

# Install dependencies
npm install @google/generative-ai @supabase/ssr @supabase/supabase-js \
  pdf-parse mammoth react-dropzone react-hook-form @hookform/resolvers zod \
  recharts lucide-react

# Dev dependencies
npm install -D @types/pdf-parse
```

Lalu install shadcn/ui:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label progress tabs toast dialog
```

## Step 2: Setup Gemini API (5 menit)

1. Buka [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Login dengan akun Google
3. Klik "Create API Key"
4. Pilih atau buat project baru
5. Copy API key — simpan baik-baik!

**Free tier limits:**
- 15 request per menit
- 1.500 request per hari
- Cukup banget untuk portfolio project

## Step 3: Setup Supabase (10 menit)

### 3.1 Buat Project

1. Buka [supabase.com](https://supabase.com/dashboard)
2. Klik "New Project"
3. Isi nama project: `resumeiq`
4. Set password database (simpan!)
5. Pilih region: Singapore (terdekat dari Indonesia)
6. Tunggu ~2 menit sampai project ready

### 3.2 Jalankan Database Schema

1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **New Query**
3. Copy paste isi file `scripts/schema.sql`
4. Klik **Run** (atau Cmd/Ctrl + Enter)
5. Verifikasi: harus muncul "Success. No rows returned"

### 3.3 Setup Authentication

1. Buka **Authentication** > **Providers**
2. Enable **Google** provider:
   - Toggle "Enable Sign in with Google"
   - Untuk dapat Client ID & Secret: ikuti panduan [di sini](https://supabase.com/docs/guides/auth/social-login/auth-google)
3. Save

### 3.4 Get API Keys

1. Buka **Project Settings** > **API**
2. Copy nilai berikut:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → untuk `SUPABASE_SERVICE_ROLE_KEY`

## Step 4: Setup Environment Variables (2 menit)

```bash
# Copy template
cp .env.example .env.local
```

Edit `.env.local` dan isi semua nilai dari step sebelumnya:

```bash
GEMINI_API_KEY=AIzaSy...                        # dari step 2
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co # dari step 3.4
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...         # dari step 3.4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...             # dari step 3.4
```

## Step 5: Test Local Development (3 menit)

```bash
npm run dev
```

Buka http://localhost:3000. Kalau ada error, cek:
- Apakah semua env vars terisi?
- Apakah Node version 18+?
- Apakah dependencies ter-install semua?

### Test API Endpoint

```bash
# Test health check
curl http://localhost:3000/api/analyze
# Expected: {"status":"ok","service":"resumeiq-analyze",...}

# Test analyze (mock data)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "John Doe, Software Engineer with 5 years experience in React, Node.js, and Python. Worked at TechCorp building scalable web applications.",
    "jobDescription": "We are looking for a Senior Frontend Developer with experience in React, TypeScript, and modern web technologies. Must have experience with state management, testing, and CI/CD."
  }'
```

## Step 6: Development Workflow dengan Claude Code (Tips)

### Cara Pakai Claude Code Effective

1. **Mulai dari PRD**: Saat buka Claude Code di project ini, kasih konteks dengan:
   ```
   Baca PRD.md dan README.md untuk memahami project.
   Saya mau implementasi [fitur X] di sprint [N].
   ```

2. **Per Sprint, Per Fitur**: Jangan minta semua sekaligus. Misal:
   ```
   Implementasi landing page sesuai mockup di section 10.2 PRD.
   Tech stack sudah ada di README. Pakai shadcn/ui untuk komponen.
   ```

3. **Test setiap fitur**: Sebelum lanjut ke fitur berikutnya, pastikan fitur sekarang berfungsi.

4. **Git commit yang sering**: Commit per fitur kecil. Bagus untuk portfolio (recruiter lihat commit history).

### Suggested Order untuk Coding

**Hari 1-2:** Setup + landing page + file upload UI
**Hari 3-4:** Parser PDF/DOCX + display extracted text
**Hari 5-7:** Gemini integration + scoring engine
**Hari 8-10:** Result page UI + visualizations
**Hari 11-14:** Auth + dashboard + history
**Hari 15-17:** PDF export + polish + bug fixes
**Hari 18-21:** Deploy + write blog post + launch

## Step 7: Deploy ke Vercel (5 menit)

### Via GitHub (Recommended)

1. Push code ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/resumeiq.git
   git push -u origin main
   ```

2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repository dari GitHub
4. Add environment variables (copy dari `.env.local`)
5. Klik **Deploy**
6. Tunggu ~2 menit, dapat URL `your-project.vercel.app`

### Custom Domain (Opsional)

Kalau punya domain sendiri:
1. Vercel Dashboard > Project > Settings > Domains
2. Add domain
3. Setup DNS sesuai instruksi Vercel

## Step 8: Promote di LinkedIn (Bonus)

Setelah deploy, post di LinkedIn dengan format:

```
🚀 Just launched ResumeIQ — AI-powered resume analyzer gratis!

Setelah lihat banyak teman frustrated CV-nya selalu di-reject ATS,
saya bangun tool ini biar mereka bisa optimize CV mereka sendiri.

✨ Features:
• ATS score 0-100
• Keyword matching
• Section-by-section feedback
• Support Bahasa Indonesia & Inggris
• 100% gratis, no signup needed

🛠️ Tech stack:
• Next.js 14 + TypeScript
• Google Gemini API
• Supabase
• Deployed di Vercel

Try it: [link]
Source code: [github link]

Feedback sangat diterima! 🙏

#WebDev #AI #SideProject #IndonesiaTech
```

## Troubleshooting

### Error: "GEMINI_API_KEY tidak ditemukan"
→ Pastikan `.env.local` ada di root project dan sudah terisi. Restart `npm run dev`.

### Error: "Failed to parse PDF"
→ Beberapa PDF (terutama scanned/image-based) tidak bisa di-parse. Test dengan PDF text-based dulu.

### Error: Supabase connection failed
→ Cek URL dan anon key. Pastikan tidak ada whitespace di env vars.

### Rate limit Gemini
→ Free tier ada limit 15 req/menit. Implementasi caching atau wait.

### Build error di Vercel
→ Cek `npm run build` lokal dulu. Sering masalah TypeScript strict mode.

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Need Help?

- Open issue di GitHub repo
- DM saya di [LinkedIn]
- Email: your.email@example.com

---

Happy coding! 🚀 Semoga proyek ini bermanfaat dan jadi portfolio yang impressive!
