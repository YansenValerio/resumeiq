import type { AnalysisResult } from "@/types/analysis";

/**
 * Mock analysis result untuk development
 * Pakai dengan set USE_MOCK_GEMINI=true di .env.local
 * Berguna untuk hemat quota Gemini saat ngembangin UI
 */
export const mockAnalysisResult: AnalysisResult = {
  overall_score: 72,
  ats_compatibility: 85,

  keyword_match: {
    match_percentage: 65,
    matched: [
      "React",
      "TypeScript",
      "Node.js",
      "REST API",
      "Git",
      "Agile",
    ],
    missing_critical: [
      "Next.js",
      "GraphQL",
      "AWS",
      "CI/CD",
    ],
    missing_nice_to_have: [
      "Docker",
      "Kubernetes",
      "Redis",
      "Microservices",
    ],
  },

  section_scores: {
    summary: {
      score: 65,
      feedback:
        "Summary terlalu generic dan tidak menonjolkan unique value. Sebaiknya tambahkan angka konkret seperti tahun pengalaman dan impact yang sudah dibuat. Contoh: 'Software Engineer dengan 5 tahun pengalaman, telah memimpin 3 product launch yang menghasilkan 40% peningkatan user engagement.'",
    },
    experience: {
      score: 78,
      feedback:
        "Pengalaman kerja sudah cukup baik dengan action verbs yang kuat. Namun, kurang quantified achievements. Tambahkan angka, persen, atau metric impact di setiap bullet point. Contoh: ganti 'Improved performance' jadi 'Improved page load time by 40% (from 3.2s to 1.9s)'.",
    },
    skills: {
      score: 70,
      feedback:
        "Skills section perlu pengelompokan yang lebih baik. Pisahkan menjadi: Languages, Frameworks, Tools, Methodologies. Juga tambahkan beberapa skill yang ada di JD seperti Next.js dan GraphQL.",
    },
    education: {
      score: 80,
      feedback:
        "Education section sudah cukup baik. Karena bukan fresh graduate, GPA tidak perlu dicantumkan kecuali sangat tinggi (>3.7). Pertimbangkan menambahkan relevant coursework atau project akademik kalau relevan.",
    },
  },

  top_improvements: [
    {
      priority: "high",
      issue: "Bullet point pengalaman kurang quantified",
      suggestion:
        "Tambahkan angka, persen, atau metric impact di setiap pencapaian. Recruiter sangat menyukai CV yang menunjukkan dampak konkret.",
      example:
        "Before: 'Developed new features for the application'\nAfter: 'Developed 5 new features serving 50K+ daily active users, contributing to 25% increase in user retention'",
    },
    {
      priority: "high",
      issue: "Missing critical keywords: Next.js, GraphQL, AWS",
      suggestion:
        "Tambahkan keyword ini ke section skills atau experience kalau memang punya pengalaman. Kalau belum, pertimbangkan untuk belajar dan tambahkan project kecil sebagai portofolio.",
    },
    {
      priority: "medium",
      issue: "Summary terlalu generic",
      suggestion:
        "Tulis ulang summary dengan format: [Role] dengan [X tahun] pengalaman di [domain]. Specialize in [unique skill]. Track record [specific achievement].",
      example:
        "Senior Frontend Engineer dengan 5+ tahun pengalaman membangun web applications berskala enterprise. Specialize in React ecosystem dan performance optimization. Berhasil memimpin migrasi codebase legacy ke modern stack yang meningkatkan developer productivity 50%.",
    },
    {
      priority: "medium",
      issue: "Skills section tidak terorganisir dengan baik",
      suggestion:
        "Kelompokkan skills berdasarkan kategori: Programming Languages, Frameworks & Libraries, Tools & Platforms, Methodologies. Ini memudahkan recruiter scan CV.",
    },
    {
      priority: "low",
      issue: "Format tanggal tidak konsisten",
      suggestion:
        "Gunakan format yang konsisten untuk semua tanggal. Recommended: 'Jan 2020 - Dec 2022' atau '01/2020 - 12/2022'. Pilih satu dan stick to it.",
    },
  ],

  formatting_issues: [
    "Format tanggal tidak konsisten antara section experience",
    "Beberapa bullet point terlalu panjang (>3 baris)",
    "Tense tidak konsisten - mix antara past dan present tense",
  ],

  strengths: [
    "Struktur CV sudah clear dengan section yang well-defined",
    "Action verbs yang dipakai sudah cukup variatif dan strong",
    "Contact information lengkap dan profesional",
    "Pengalaman kerja relevan dengan posisi yang dituju",
    "Education section formatted dengan baik",
  ],
};
