// middleware.ts  ─ プロジェクトのルート (or src/) に配置
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/types'

export async function middleware(request: NextRequest) {
  // 1. 最初にレスポンスを生成し request を引き継ぐ
  const response = NextResponse.next({ request })

  // 2. Supabase Edge クライアント
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /** クライアント → サーバへ渡ってきた既存 Cookie 全取得 */
        getAll() {
          return request.cookies.getAll()
        },
        /** Supabase が返してきた新しい Cookie をすべて転写 */
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. これを呼ぶことでリフレッシュトークンがローテーションされ、
  //    setAll が発火して Cookie が response に書き込まれる
  await supabase.auth.getUser()

  return response
}

export const config = {
  // 静的アセットは除外する
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}