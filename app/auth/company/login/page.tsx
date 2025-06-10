"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Mail, Building, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ─── Supabase client ────────────────────────────────
import { supabase } from "@/lib/supabase/client"

export default function CompanyLoginPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [isAdminMode, setIsAdminMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 管理者ログインの場合
      if (isAdminMode) {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            if (email !== "admin@careerpla.com" || password !== "admin123") {
              reject(new Error("管理者のメールアドレスまたはパスワードが正しくありません。"))
            } else {
              resolve(true)
            }
          }, 1500),
        )

        toast({
          title: "管理者ログイン成功！",
          description: "管理ダッシュボードへ移動します。",
          variant: "default",
        })

        // 管理ダッシュボードへリダイレクト
        window.location.href = "/admin/dashboard"
      } else {
        // ───────── 通常の企業ログイン（Supabase連携） ─────────
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) {
            throw new Error(error.message)
          }

          toast({
            title: "ログイン成功！",
            description: "企業ダッシュボードへ移動します。",
            variant: "default",
          })

          // 企業ダッシュボードへリダイレクト
          window.location.href = "/company/dashboard"
        } catch (signInErr: any) {
          throw new Error(signInErr.message || "メールアドレスまたはパスワードが正しくありません。")
        }
      }
    } catch (err: any) {
      toast({
        title: isAdminMode ? "管理者ログインに失敗しました" : "ログインに失敗しました",
        description: err.message || "エラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setSocialLoading("Google")
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/company/dashboard`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // If Supabase returns a redirect URL in the same tab, navigate manually
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      toast({
        title: "Googleログインに失敗しました",
        description: err.message || "エラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isAdminMode ? "管理者ログイン" : "企業ログイン"}
          </CardTitle>
          <CardDescription>
            {isAdminMode ? "システム管理機能にアクセス" : "キャリプラで優秀な学生と出会いましょう"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 管理者モード時の注意書き */}
          {isAdminMode && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>管理者アカウントでシステム全体を管理できます。</AlertDescription>
            </Alert>
          )}

          {/* 承認状況の注意書き - 企業モードのみ */}
          {!isAdminMode && (
            <Alert>
              <Building className="h-4 w-4" />
              <AlertDescription>企業アカウントは管理者承認後にご利用いただけます。</AlertDescription>
            </Alert>
          )}

          {/* Googleログインボタン */}
          <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={socialLoading !== null}>
            {socialLoading === "Google" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4 text-red-600" />
            )}
            Googleでログイン
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">または</span>
            </div>
          </div>

          {/* メールログインフォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">企業メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder={isAdminMode ? "admin@careerpla.com" : "hr@company.co.jp"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700"
              disabled={isLoading || socialLoading !== null}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : isAdminMode ? (
                "管理者ログイン"
              ) : (
                "ログイン"
              )}
            </Button>

            {/* 管理者ログインオプション */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="adminMode"
                checked={isAdminMode}
                onChange={(e) => {
                  setIsAdminMode(e.target.checked)
                  setEmail("")
                  setPassword("")
                }}
                className="rounded border-gray-300"
              />
              <Label htmlFor="adminMode" className="text-sm text-muted-foreground cursor-pointer">
                管理者としてログイン
              </Label>
            </div>
          </form>

          {/* リンク */}
          <div className="space-y-2 text-center text-sm">
            <div>
              企業アカウントをお持ちではありませんか？{" "}
              <Link href="/auth/company/register" className="text-blue-600 hover:underline">
                新規登録
              </Link>
            </div>
            <div>
              <Link href="/auth/forgot-password" className="text-muted-foreground hover:underline">
                パスワードを忘れた場合
              </Link>
            </div>
            <div className="pt-2">
              <Link href="/auth/student/login" className="text-sm text-muted-foreground hover:underline">
                学生の方はこちら
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
