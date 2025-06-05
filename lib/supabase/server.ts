// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * サーバー用 Supabase クライアント
 * - 認証クッキーを共通化するために get / set / remove を渡す
 */
export const supabaseServer = () => {
  const cookieStore = cookies(); // ← Next.js の CookieStore

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options) =>
          cookieStore.set({ name, value: "", ...options }),
      },
    }
  );
};