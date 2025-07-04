"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft, Check, AlertCircle, RefreshCw } from "lucide-react"

// Helper: retry fetch on network failure with exponential backoff
const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retries = 3,
  backoff = 1000
): Promise<Response> => {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries > 0) {
      await new Promise((res) => setTimeout(res, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
};

export default function StudentVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  useEffect(() => {
    // Send initial OTP on first mount
    handleResend();
  }, []);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("認証コードを入力してください")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetchWithRetry("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: verificationCode }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || "認証コードが正しくありません");
      }
      // 成功時にプロフィール入力ページへ遷移
      router.push("/auth/student/register/complete");
    } catch (error: any) {
      if (error.message.includes("Failed to fetch")) {
        setError("通信に失敗しました。しばらくしてから再試行してください。");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError("")

    try {
      await fetchWithRetry("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      setError("通信に失敗しました。しばらくしてから再試行してください。")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <Link
            href="/auth/student/register"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            登録に戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">メール認証</h1>
          <p className="text-gray-600 mt-2">認証コードを入力してください</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>メールを確認してください</CardTitle>
            <CardDescription>
              登録したメールアドレスに6桁の認証コードを送信しました。
              <br />
              <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">認証コード</Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onPaste={(e) => {
                  e.preventDefault();
                  const pasted = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
                  setVerificationCode(pasted);
                }}
                placeholder="123456"
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">6桁の数字を入力してください</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleVerify}
              disabled={isLoading || isResending || verificationCode.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                "認証中..."
              ) : (
                <>
                  認証する
                  <Check className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>

            {/* 再送信 */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">メールが届かない場合</p>
              <Button variant="outline" onClick={handleResend} disabled={!canResend || isResending || isLoading} className="text-sm">
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    送信中...
                  </>
                ) : (
                  "認証メールを再送信"
                )}
              </Button>
            </div>

            {/* ヘルプ */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>メールが届かない場合：</strong>
                <br />• 迷惑メールフォルダをご確認ください
                <br />• メールアドレスに誤りがないかご確認ください
                <br />• しばらく待ってから再送信をお試しください
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* サポートリンク */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            問題が解決しない場合は{" "}
            <Link href="/support" className="text-blue-600 hover:underline">
              サポートにお問い合わせ
            </Link>
            ください
          </p>
        </div>
      </div>
    </div>
  )
}
