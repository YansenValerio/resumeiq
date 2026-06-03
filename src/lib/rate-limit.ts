// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

type AnySupabase = SupabaseClient<any, any, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const MAX_GUEST = parseInt(process.env.MAX_DAILY_ANALYSES_GUEST ?? "3");
const MAX_USER  = parseInt(process.env.MAX_DAILY_ANALYSES_USER  ?? "10");

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string; // ISO date of next reset (midnight UTC)
}

/**
 * Check and increment rate limit counter.
 * Uses Supabase usage_tracking table (service role key required).
 * Gracefully allows all requests when Supabase is not configured.
 */
export async function checkRateLimit(
  userId: string | null,
  ipAddress: string
): Promise<RateLimitResult> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Supabase not configured — dev mode, allow everything
  if (!serviceKey || !supabaseUrl ||
      supabaseUrl === "https://placeholder.supabase.co") {
    return { allowed: true, remaining: 999, limit: 999, resetAt: tomorrowMidnight() };
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const limit = userId ? MAX_USER : MAX_GUEST;
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    if (userId) {
      return await checkByUser(supabase, userId, today, limit);
    } else {
      const ipHash = crypto.createHash("sha256").update(ipAddress).digest("hex");
      return await checkByIp(supabase, ipHash, today, limit);
    }
  } catch (err) {
    // If rate limit check itself fails, allow request but log the error
    console.error("Rate limit check error:", err);
    return { allowed: true, remaining: 1, limit, resetAt: tomorrowMidnight() };
  }
}

async function checkByUser(
  supabase: AnySupabase,
  userId: string,
  today: string,
  limit: number
): Promise<RateLimitResult> {
  const { data } = await supabase
    .from("usage_tracking")
    .select("analysis_count")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  const count = data?.analysis_count ?? 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt: tomorrowMidnight() };
  }

  // Upsert — increment or insert
  await supabase.from("usage_tracking").upsert(
    { user_id: userId, date: today, analysis_count: count + 1 },
    { onConflict: "user_id,date" }
  );

  return { allowed: true, remaining: limit - count - 1, limit, resetAt: tomorrowMidnight() };
}

async function checkByIp(
  supabase: AnySupabase,
  ipHash: string,
  today: string,
  limit: number
): Promise<RateLimitResult> {
  const { data } = await supabase
    .from("usage_tracking")
    .select("analysis_count")
    .eq("ip_hash", ipHash)
    .eq("date", today)
    .maybeSingle();

  const count = data?.analysis_count ?? 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt: tomorrowMidnight() };
  }

  await supabase.from("usage_tracking").upsert(
    { ip_hash: ipHash, date: today, analysis_count: count + 1 },
    { onConflict: "ip_hash,date" }
  );

  return { allowed: true, remaining: limit - count - 1, limit, resetAt: tomorrowMidnight() };
}

function tomorrowMidnight(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}
