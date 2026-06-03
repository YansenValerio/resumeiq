import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ─── GET /api/history ─────────────────────────────────────────────────────────
// List user's analyses + stats (total, best score, today count)

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 50);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  // Fetch analyses list
  const { data, error, count } = await supabase
    .from("analyses")
    .select(
      "id, resume_filename, job_title, job_description, overall_score, ats_score, language, duration_ms, created_at",
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch stats in parallel
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [bestResult, todayResult, oldestResult] = await Promise.all([
    supabase
      .from("analyses")
      .select("overall_score, job_title, job_description, created_at")
      .eq("user_id", user.id)
      .order("overall_score", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayStart.toISOString()),
    supabase
      .from("analyses")
      .select("overall_score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const best = bestResult.data;
  const todayCount = todayResult.count ?? 0;
  const oldestScore = oldestResult.data?.overall_score ?? null;
  const latestScore = data?.[0]?.overall_score ?? null;

  const improvement =
    oldestScore !== null && latestScore !== null && count! > 1
      ? latestScore - oldestScore
      : null;

  return NextResponse.json({
    data,
    count,
    stats: {
      total: count ?? 0,
      today_count: todayCount,
      best_score: best?.overall_score ?? null,
      best_job: best?.job_title ?? best?.job_description?.split("\n")[0]?.slice(0, 50) ?? null,
      improvement,
    },
  });
}

// ─── POST /api/history ────────────────────────────────────────────────────────
// Save analysis to DB (authenticated users only; returns { saved, id })

const saveSchema = z.object({
  resumeText: z.string().min(1),
  jobDescription: z.string().min(1),
  fileName: z.string(),
  fileSize: z.number().optional(),
  result: z.object({
    overall_score: z.number(),
    ats_compatibility: z.number(),
  }).passthrough(),
  meta: z.object({
    language: z.string(),
    duration_ms: z.number(),
  }),
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guest — silently skip saving
  if (!user) {
    return NextResponse.json({ saved: false, reason: "guest" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { resumeText, jobDescription, fileName, fileSize, result, meta } =
    parsed.data;

  // Extract job title: first non-empty line up to 100 chars
  const jobTitle = jobDescription.split("\n").find((l) => l.trim())?.trim().slice(0, 100) ?? "";

  const { data: inserted, error } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      resume_filename: fileName,
      resume_text: resumeText,
      resume_size_bytes: fileSize ?? null,
      job_description: jobDescription,
      job_title: jobTitle,
      overall_score: result.overall_score,
      ats_score: result.ats_compatibility,
      result,
      language: meta.language,
      duration_ms: meta.duration_ms,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Save analysis error:", error.message);
    return NextResponse.json(
      { saved: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ saved: true, id: inserted.id });
}

// ─── DELETE /api/history?id=xxx ───────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // RLS double-check

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
