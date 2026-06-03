import { NextRequest, NextResponse } from "next/server";
import { analyzeResume, truncateForAnalysis } from "@/lib/gemini";
import { detectLanguage } from "@/lib/parser";
import { checkRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase-server";
import { z } from "zod";

// Validasi input dengan Zod
const analyzeSchema = z.object({
  resumeText: z.string().min(100, "Resume terlalu pendek (minimal 100 karakter)"),
  jobDescription: z
    .string()
    .min(100, "Job description terlalu pendek (minimal 100 karakter)")
    .max(10000, "Job description terlalu panjang (maksimal 10.000 karakter)"),
  language: z.enum(["id", "en"]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // ── Rate limiting ──────────────────────────────────────
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const rateLimit = await checkRateLimit(user?.id ?? null, ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Batas harian tercapai. Kamu bisa analisis lagi mulai ${new Date(rateLimit.resetAt).toLocaleString("id-ID", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })} WIB.`,
          code: "RATE_LIMIT_EXCEEDED",
          remaining: 0,
          resetAt: rateLimit.resetAt,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetAt,
          },
        }
      );
    }
    // ──────────────────────────────────────────────────────

    const body = await request.json();

    // Validate input
    const validationResult = analyzeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { resumeText, jobDescription, language } = validationResult.data;

    // Auto-detect language kalau tidak disebut
    const detectedLang = language || detectLanguage(resumeText);

    // Truncate untuk efisiensi token
    const truncatedResume = truncateForAnalysis(resumeText, 6000);
    const truncatedJD = truncateForAnalysis(jobDescription, 2000);

    // TODO: Implementasi rate limiting di sini
    // const ip = request.headers.get("x-forwarded-for") || "unknown";
    // const rateLimitOk = await checkRateLimit(ip);
    // if (!rateLimitOk) {
    //   return NextResponse.json(
    //     { error: "Rate limit exceeded. Coba lagi besok." },
    //     { status: 429 }
    //   );
    // }

    // Analyze!
    const startTime = Date.now();
    const result = await analyzeResume(truncatedResume, truncatedJD, detectedLang);
    const duration = Date.now() - startTime;

    console.log(`Analysis completed in ${duration}ms`);

    return NextResponse.json(
      {
        success: true,
        result,
        meta: {
          language: detectedLang,
          duration_ms: duration,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": rateLimit.resetAt,
        },
      }
    );
  } catch (error) {
    console.error("Analysis API error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Untuk health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "resumeiq-analyze",
    timestamp: new Date().toISOString(),
  });
}
