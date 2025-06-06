'use client'
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/* ------------------------------------------------------------
 * Supabase singleton client
 * ------------------------------------------------------------
 * - Reads NEXT_PUBLIC_SUPABASE_URL / KEY at build‑time.
 * - Throws immediately if env vars are missing (easier debug).
 * - In development, exposes `window.supabase` for quick console tests.
 * ------------------------------------------------------------ */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    [
      "❌ Supabase env vars are missing.",
      `NEXT_PUBLIC_SUPABASE_URL = ${supabaseUrl}`,
      `NEXT_PUBLIC_SUPABASE_ANON_KEY = ${
        supabaseKey ? supabaseKey.slice(0, 10) + "…" : supabaseKey
      }`,
      "Check your .env.local (development) or Vercel env vars (production).",
    ].join("\n")
  );
}

/** Browser / SSR client (Anon key) */
export const supabase: SupabaseClient<Database> = createBrowserClient<Database>(
  supabaseUrl,
  supabaseKey
);

// ──────────────── dev helper ─────────────────
if (
  process.env.NODE_ENV === "development" &&
  typeof window !== "undefined"
) {
  // @ts-ignore
  window.supabase = supabase;
  // Helpful one‑shot log
  // eslint-disable-next-line no-console
  console.log("[Supabase] client attached to window.supabase");
}