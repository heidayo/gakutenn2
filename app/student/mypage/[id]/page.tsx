// app/student/mypage/[id]/page.tsx
import { redirect, notFound } from 'next/navigation'
import Image from 'next/image'
import { createSupabaseServerClient } from '@/lib/supabase/server'

// 型定義: profiles テーブルの行
interface Profile {
  user_id: string
  full_name: string | null
  avatar_url: string | null
  faculty: string | null
  graduation_month: string | null
  bio: string | null
  created_at: string | null
}

export const dynamic = 'force-dynamic'

export default async function StudentMyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // 1. 認証ユーザーを取得
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. 未ログインならログインページへ
  if (!user) redirect('/auth/student/login')

  // URL の id と認証ユーザーの id が異なる場合は自分のページへリダイレクト
  // Next.js 15 では params が Promise になるため await で展開
  const { id: pageUserId } = await params
  if (user.id !== pageUserId) {
    redirect(`/student/mypage/${user.id}`)
  }

  // 3. プロフィール取得
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', pageUserId)
    .single<Profile>()

  if (error || !profile) notFound()

  /* ---------- ここから表示 ---------- */
  return (
    <section className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-center sm:text-left">
        マイページ
      </h1>

      {/* 基本情報 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* アバター */}
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name ?? 'avatar'}
            width={128}
            height={128}
            className="h-32 w-32 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
            <span className="text-3xl font-semibold text-gray-500">
              {profile.full_name?.charAt(0) ?? '?'}
            </span>
          </div>
        )}

        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xl font-semibold text-gray-900">
            {profile.full_name ?? '名前未設定'}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="my-8 h-px w-full bg-gray-200" />

      {/* 追加プロフィール情報 */}
      <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-gray-700">
        <dt className="font-medium">学部・学科</dt>
        <dd>{profile.faculty ?? '未設定'}</dd>

        <dt className="font-medium">卒業予定</dt>
        <dd>{profile.graduation_month ?? '未設定'}</dd>

        <dt className="font-medium">自己紹介</dt>
        <dd className="whitespace-pre-wrap">{profile.bio ?? '未設定'}</dd>
      </dl>
    </section>
  )
}