import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Initialize Supabase client using Next.js cookies
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "email and otp are required" }, { status: 400 });
    }
    // @ts-ignore: table not defined in DB types
    const { data, error } = await supabase
      .from("email_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .single();
    if (error || !data) {
      return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 400 });
    }
    // Remove the used OTP record
    // @ts-ignore: table not defined in DB types
    await supabase
      .from("email_otps")
      .delete()
      .eq("email", email)
      .eq("otp", otp);
    // Mark user as verified
    // @ts-ignore: table not defined in DB types
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("email", email);
    if (updateError) {
      return NextResponse.json({ ok: false, error: "ユーザー検証ステータスの更新に失敗しました" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}