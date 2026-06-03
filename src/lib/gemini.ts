import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ANALYSIS_PROMPT } from "./prompts";
import type { AnalysisResult } from "@/types/analysis";

// Lazy-init so mock mode works without GEMINI_API_KEY set
let _genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!_genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di environment variables");
    }
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

/**
 * Schema untuk structured output Gemini
 * Memastikan response selalu valid JSON sesuai struktur yang kita butuhkan
 */
const analysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    overall_score: {
      type: SchemaType.NUMBER,
      description: "Skor keseluruhan 0-100",
    },
    ats_compatibility: {
      type: SchemaType.NUMBER,
      description: "Skor ATS compatibility 0-100",
    },
    keyword_match: {
      type: SchemaType.OBJECT,
      properties: {
        match_percentage: { type: SchemaType.NUMBER },
        matched: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        missing_critical: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
        missing_nice_to_have: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["match_percentage", "matched", "missing_critical", "missing_nice_to_have"],
    },
    section_scores: {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            feedback: { type: SchemaType.STRING },
          },
          required: ["score", "feedback"],
        },
        experience: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            feedback: { type: SchemaType.STRING },
          },
          required: ["score", "feedback"],
        },
        skills: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            feedback: { type: SchemaType.STRING },
          },
          required: ["score", "feedback"],
        },
        education: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.NUMBER },
            feedback: { type: SchemaType.STRING },
          },
          required: ["score", "feedback"],
        },
      },
      required: ["summary", "experience", "skills", "education"],
    },
    top_improvements: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          priority: {
            type: SchemaType.STRING,
            enum: ["high", "medium", "low"],
          },
          issue: { type: SchemaType.STRING },
          suggestion: { type: SchemaType.STRING },
          example: { type: SchemaType.STRING },
        },
        required: ["priority", "issue", "suggestion"],
      },
    },
    formatting_issues: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: [
    "overall_score",
    "ats_compatibility",
    "keyword_match",
    "section_scores",
    "top_improvements",
    "formatting_issues",
    "strengths",
  ],
};

/**
 * Analisis resume terhadap job description
 *
 * @param resumeText - Text hasil parsing dari resume
 * @param jobDescription - Job description target
 * @param language - Bahasa untuk feedback ('id' atau 'en')
 * @returns Analysis result dalam format JSON terstruktur
 */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  language: "id" | "en" = "id"
): Promise<AnalysisResult> {
  // Mock mode untuk development (hemat quota)
  if (process.env.USE_MOCK_GEMINI === "true") {
    const { mockAnalysisResult } = await import("./mock-data");
    return mockAnalysisResult;
  }

  const model = getGenAI().getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.2, // Rendah untuk konsistensi
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  const prompt = ANALYSIS_PROMPT[language]
    .replace("{{RESUME}}", resumeText)
    .replace("{{JOB_DESCRIPTION}}", jobDescription);

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const parsed = JSON.parse(text) as AnalysisResult;

    // Validasi tambahan
    if (parsed.overall_score < 0 || parsed.overall_score > 100) {
      throw new Error("Invalid overall_score range");
    }

    return parsed;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Gagal menganalisis resume"
    );
  }
}

/**
 * Helper untuk count token (approximate)
 * Gemini Flash punya limit 1M token input
 */
export function estimateTokens(text: string): number {
  // Approximate: 1 token ≈ 4 karakter untuk English, 3 karakter untuk Indonesia
  return Math.ceil(text.length / 3.5);
}

/**
 * Truncate text agar tidak melebihi limit token
 */
export function truncateForAnalysis(
  text: string,
  maxTokens: number = 8000
): string {
  const currentTokens = estimateTokens(text);
  if (currentTokens <= maxTokens) return text;

  const ratio = maxTokens / currentTokens;
  const targetLength = Math.floor(text.length * ratio * 0.9); // 0.9 untuk safety margin
  return text.substring(0, targetLength) + "\n\n[Content truncated for analysis]";
}
