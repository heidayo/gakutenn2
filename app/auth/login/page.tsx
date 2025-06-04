"use client"

import Link from "next/link"
import { GraduationCap, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">キャリプラにログイン</h1>
          <p className="text-gray-600">あなたの立場を選択してください</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 学生ログイン */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">学生として</CardTitle>
              <CardDescription>インターンシップや就職活動を始めましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  LINE・Googleで簡単ログイン
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  志向性診断で適性を発見
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  企業からのスカウト受信
                </div>
              </div>
              <Link href="/auth/student/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  学生ログイン
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="text-center mt-3">
                <Link href="/auth/student/register" className="text-sm text-blue-600 hover:underline">
                  学生アカウントを作成
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 企業ログイン */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-slate-500 to-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">企業として</CardTitle>
              <CardDescription>優秀な学生と出会い、採用活動を効率化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                  AI応募者管理システム
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                  面接調整の自動化
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-slate-500 rounded-full mr-2"></div>
                  詳細な分析レポート
                </div>
              </div>
              <Link href="/auth/company/login">
                <Button className="w-full bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700">
                  企業ログイン
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <div className="text-center mt-3">
                <Link href="/auth/company/register" className="text-sm text-blue-600 hover:underline">
                  企業アカウントを作成
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
