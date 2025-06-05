// app/student/mypage/page.tsx
import { redirect } from "next/navigation";

export default function MyPage() {
  redirect("/student");   // 既存のプロフィールへ転送
}