"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Eye, EyeOff, Mail, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function StudentLoginPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 仮のログインロジック
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (email !== "student@example.com" || password !== "password123") {
            reject(new Error("メールアドレスまたはパスワードが正しくありません。"))
          } else {
            resolve(true)
          }
        }, 1500),
      )

      toast({
        title: "ログイン成功！",
        description: "学生ダッシュボードへ移動します。",
        variant: "default",
      })

      // 学生ダッシュボードへリダイレクト
      window.location.href = "/student/dashboard"
    } catch (err: any) {
      toast({
        title: "ログインに失敗しました",
        description: err.message || "エラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider)

    try {
      // 仮のソーシャルログインロジック
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: `${provider}ログイン成功！`,
        description: "学生ダッシュボードへ移動します。",
        variant: "default",
      })

      window.location.href = "/student/dashboard"
    } catch (err) {
      toast({
        title: `${provider}ログインに失敗しました`,
        description: "エラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">学生ログイン</CardTitle>
          <CardDescription>キャリプラにログインして、あなたのキャリアを始めましょう</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ソーシャルログインボタン */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("LINE")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "LINE" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Smartphone className="mr-2 h-4 w-4 text-green-600" />
              )}
              LINEでログイン
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin("Google")}
              disabled={socialLoading !== null}
            >
              {socialLoading === "Google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4 text-red-600" />
              )}
              Googleでログイン
            </Button>
          </div>

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
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.ac.jp"
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading || socialLoading !== null}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>

          {/* リンク */}
          <div className="space-y-2 text-center text-sm">
            <div>
              アカウントをお持ちではありませんか？{" "}
              <Link href="/auth/student/register" className="text-blue-600 hover:underline">
                新規登録
              </Link>
            </div>
            <div>
              <Link href="/auth/forgot-password" className="text-muted-foreground hover:underline">
                パスワードを忘れた場合
              </Link>
            </div>
            <div className="pt-2">
              <Link href="/auth/company/login" className="text-sm text-muted-foreground hover:underline">
                企業の方はこちら
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
