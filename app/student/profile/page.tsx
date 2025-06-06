// app/student/profile/page.tsx

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import StudentProfileClient from "./StudentProfileClient";

/**
 * Narrowed row type for the columns this page actually needs from `profiles`.
 * Adding this keeps TypeScript strict but flexible even if the generated Supabase
 * types are stale.
 */
type ProfileRow = {
  full_name: string | null;
  university: string | null;
  prefecture: string | null;
};

export default async function StudentProfilePage() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/student/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, university, prefecture")
    .eq("auth_user_id", user.id)
    .single<ProfileRow>();

  return (
    <StudentProfileClient
      profile={profile}
      email={user.email ?? ""}
    />
  );
}