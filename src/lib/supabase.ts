import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client untuk client-side (browser)
 * Pakai anon key, aman untuk dipakai di browser
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'
  );
}
