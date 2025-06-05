// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * サーバーサイドで安全に呼び出す Supabase クライアント
 *
 * Next.js 15 では `cookies()` が Promise を返すため、ここも `async` でラップ。
 * 利用側は `await createSupabaseServerClient()` で呼び出してください。
 */
export async function createSupabaseServerClient() {
  // `cookies()` は Promise<ReadonlyRequestCookies>
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        /**
         * NOTE: `ReadonlyRequestCookies` には型定義が無いので
         *       ダウンキャストして実行時のメソッドを呼び出す
         */
        set(name: string, value: string, options?: CookieOptions) {
          (cookieStore as any).set({ name, value, ...options });
        },
        remove(name: string, options?: CookieOptions) {
          (cookieStore as any).delete({ name, ...options });
        },
      },
    }
  );
}