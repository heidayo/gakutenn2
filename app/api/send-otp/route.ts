// /api/send-otp/route.ts
import { sendOtpEmail } from "@/lib/sendgrid";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // Initialize Supabase client that reads the Next.js cookies for session
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // Prevent rapid re-sends: check for existing OTP in the last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recentOtps, error: selectError } = await supabase
      .from("email_otps")
      .select("created_at")
      .eq("email", email)
      .gte("created_at", thirtySecondsAgo);
    if (selectError) {
      console.error("Supabase select error:", selectError);
      return NextResponse.json({ error: "OTPチェックに失敗しました" }, { status: 500 });
    }
    if (recentOtps && recentOtps.length > 0) {
      return NextResponse.json(
        { error: "認証コードはすでに送信済みです。しばらく待ってから再度お試しください。" },
        { status: 429 }
      );
    }

    // 6桁のOTPを生成
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Supabase に保存
    // @ts-ignore: table 型定義がない場合を抑制
    const { error: insertError } = await supabase
      .from("email_otps")
      .insert({ id: uuidv4(), email, otp, created_at: new Date().toISOString() });
    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "OTP保存に失敗しました" }, { status: 500 });
    }

    // メール送信
    await sendOtpEmail(email, otp);

    // 成功レスポンス
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}