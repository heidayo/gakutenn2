// app/student/mypage/[id]/page.tsx
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function StudentMyPage() {
  // 1. 認証ユーザーを取得
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. 未ログインならログインページへ
  if (!user) redirect('/auth/student/login')

  // 3. プロフィール取得
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) notFound()

  /* ---------- ここから表示 ---------- */
  return (
    <section className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">マイページ</h1>

      {/* 基本情報 */}
      <div className="flex items-center gap-6">
        {/* アバター */}
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name ?? 'avatar'}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <span className="text-xl font-semibold text-gray-500">
              {profile.full_name?.charAt(0) ?? '?'}
            </span>
          </div>
        )}

        <div>
          <p className="text-lg font-semibold">
            {profile.full_name ?? '名前未設定'}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <hr className="my-8" />

      {/* 追加プロフィール情報 */}
      <div className="space-y-2">
        <p>
          <span className="font-medium">学部・学科:</span>{' '}
          {profile.faculty ?? '未設定'}
        </p>
        <p>
          <span className="font-medium">卒業予定:</span>{' '}
          {profile.graduation_month ?? '未設定'}
        </p>
        <p>
          <span className="font-medium">自己紹介:</span>{' '}
          {profile.bio ?? '未設定'}
        </p>
      </div>
    </section>
  )
}