// app/student/mypage/page.tsx
export const dynamic = 'force-dynamic'; 

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyPageRoot() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインならログインページへ
  if (!user) redirect("/auth/student/login");

  // 自分専用ページへジャンプ
  redirect(`/student/mypage/${user.id}`);
}