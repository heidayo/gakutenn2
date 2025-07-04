// lib/supabase/auth.ts
import { supabase } from "./client";

/**
 * Sign in with email & password, then enforce 2FA by checking `profiles.is_verified`.
 * If 2FA is not yet completed, immediately sign out and throw an error.
 */
export async function signInWith2FA(email: string, password: string) {
  // 1) 通常ログイン
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.session) {
    throw new Error(signInError?.message || "ログインに失敗しました");
  }

  // 2) プロフィール読み込み
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_verified")
    .eq("email", email)
    .single();
  if (profileError) {
    // セッションを破棄してからエラーを投げる
    await supabase.auth.signOut();
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  // 3) まだ2FA未完了ならセッションを破棄してエラー
  if (!profile.is_verified) {
    await supabase.auth.signOut();
    throw new Error("二段階認証が完了していません");
  }

  // 4) すべてOKならセッション情報を返却
  return signInData.session;
}