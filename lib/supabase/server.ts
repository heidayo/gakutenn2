// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "./types";

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * サーバーサイド専用の Supabase クライアントを返します。
 * - RSC / Route Handlers では Cookie は **読み取りだけ** 行い、
 *   書き込みは no‑op にしておく（書き込みが必要な場合は middleware.ts で行う）
 */
export async function createServerSupabase() {
  // next/headers を動的 import（クライアントバンドル汚染を防ぐ）
  const { cookies } = await import("next/headers");
  // Next.js 15 以降は `cookies()` が Promise を返すため await が必要
  const cookieStore = await cookies(); // ReadonlyRequestCookies

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        // 読み取り: 値が無い場合は undefined
        get: (key) => cookieStore.get(key)?.value,
        // RSC では Cookie の書き込みが出来ないため no‑op 関数を渡す
        set: () => {},
        remove: () => {},
      },
    }
  );
}

// ─── ここでエイリアスを作成 ───────────────────────────────────────
/**
 * 通常の呼び出し名 createClient としても使えるようにするエイリアス
 */
export const createClient = createServerSupabase;

/**
 * App Router でよく使われる命名への対応。
 * 内部実装は createServerSupabase と同一です。
 */
export const createSupabaseServerClient = createServerSupabase;