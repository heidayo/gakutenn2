// app/student/mypage/[id]/page.tsx
import { supabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function StudentMyPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 自分以外の URL を叩かれたら 404
  if (!user || user.id !== params.id) notFound();

  // プロフィール取得例
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', user.id)
    .single();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">
        こんにちは、{profile?.full_name ?? '学生さん'}
      </h1>
      {/* 好きな UI を追加 */}
    </main>
  );
}