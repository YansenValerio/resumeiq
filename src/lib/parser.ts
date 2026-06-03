import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export interface ParsedResume {
  text: string;
  pageCount?: number;
  wordCount: number;
  characterCount: number;
  metadata?: Record<string, unknown>;
}

export interface ParseError {
  code: "INVALID_FORMAT" | "FILE_TOO_LARGE" | "PARSE_FAILED" | "EMPTY_CONTENT";
  message: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MIN_CONTENT_LENGTH = 100; // Minimum karakter agar dianggap valid
const SUPPORTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/**
 * Parse file resume (PDF atau DOCX) menjadi text
 */
export async function parseResume(file: File): Promise<ParsedResume> {
  // Validasi ukuran file
  if (file.size > MAX_FILE_SIZE) {
    throw {
      code: "FILE_TOO_LARGE",
      message: `File terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    } as ParseError;
  }

  // Validasi format
  if (!SUPPORTED_TYPES.includes(file.type as typeof SUPPORTED_TYPES[number])) {
    throw {
      code: "INVALID_FORMAT",
      message: "Format file tidak didukung. Gunakan PDF atau DOCX",
    } as ParseError;
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let result: ParsedResume;

  try {
    if (file.type === "application/pdf") {
      result = await parsePDF(buffer);
    } else {
      result = await parseDOCX(buffer);
    }
  } catch (error) {
    console.error("Parse error:", error);
    throw {
      code: "PARSE_FAILED",
      message:
        "Gagal mengekstrak text dari file. Mungkin file corrupt atau format tidak standar.",
    } as ParseError;
  }

  // Validasi konten
  if (result.text.trim().length < MIN_CONTENT_LENGTH) {
    throw {
      code: "EMPTY_CONTENT",
      message:
        "Konten resume terlalu pendek. Pastikan file berisi text yang readable (bukan scanned image).",
    } as ParseError;
  }

  return result;
}

/**
 * Parse PDF menggunakan pdf-parse
 */
async function parsePDF(buffer: Buffer): Promise<ParsedResume> {
  const data = await pdfParse(buffer);
  const cleanedText = cleanText(data.text);

  return {
    text: cleanedText,
    pageCount: data.numpages,
    wordCount: countWords(cleanedText),
    characterCount: cleanedText.length,
    metadata: {
      info: data.info,
      version: data.version,
    },
  };
}

/**
 * Parse DOCX menggunakan mammoth
 */
async function parseDOCX(buffer: Buffer): Promise<ParsedResume> {
  const result = await mammoth.extractRawText({ buffer });
  const cleanedText = cleanText(result.value);

  return {
    text: cleanedText,
    wordCount: countWords(cleanedText),
    characterCount: cleanedText.length,
    metadata: {
      warnings: result.messages,
    },
  };
}

/**
 * Bersihkan text dari karakter aneh dan normalisasi whitespace
 */
function cleanText(text: string): string {
  return text
    // Hapus zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Normalisasi line breaks
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Hapus multiple consecutive line breaks (max 2)
    .replace(/\n{3,}/g, "\n\n")
    // Hapus trailing whitespace per baris
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    // Hapus leading/trailing whitespace overall
    .trim();
}

/**
 * Count words (untuk validasi minimal content)
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Detect bahasa dari text (heuristic sederhana)
 * Return 'id' kalau dominan Indonesia, 'en' kalau dominan Inggris
 */
export function detectLanguage(text: string): "id" | "en" {
  const indonesianMarkers = [
    "yang", "dan", "atau", "dengan", "untuk", "saya", "kami",
    "pengalaman", "pendidikan", "kemampuan", "keahlian", "ringkasan",
    "tahun", "bulan", "perusahaan", "universitas", "sekolah",
  ];

  const englishMarkers = [
    "the", "and", "or", "with", "for", "experience",
    "education", "skills", "summary", "company", "university",
    "year", "month", "responsible", "managed", "developed",
  ];

  const lowerText = text.toLowerCase();

  const idCount = indonesianMarkers.reduce(
    (count, word) =>
      count + (lowerText.match(new RegExp(`\\b${word}\\b`, "g"))?.length || 0),
    0
  );

  const enCount = englishMarkers.reduce(
    (count, word) =>
      count + (lowerText.match(new RegExp(`\\b${word}\\b`, "g"))?.length || 0),
    0
  );

  return idCount > enCount ? "id" : "en";
}

/**
 * Extract sections dari resume (heuristic)
 * Useful untuk debugging dan untuk dikirim ke AI dengan struktur
 */
export function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};

  const sectionPatterns = {
    summary: /(?:summary|ringkasan|profil|tentang saya|about)/i,
    experience: /(?:experience|pengalaman kerja|work experience|riwayat pekerjaan)/i,
    education: /(?:education|pendidikan|riwayat pendidikan)/i,
    skills: /(?:skills|kemampuan|keahlian|kompetensi)/i,
    projects: /(?:projects|proyek|portfolio)/i,
    certifications: /(?:certifications|sertifikasi|sertifikat)/i,
  };

  const lines = text.split("\n");
  let currentSection = "header";
  let currentContent: string[] = [];

  for (const line of lines) {
    let matched = false;

    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && line.length < 50) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join("\n").trim();
        }
        currentSection = section;
        currentContent = [];
        matched = true;
        break;
      }
    }

    if (!matched) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}
