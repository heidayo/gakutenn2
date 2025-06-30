"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, Mail, Phone, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function CompanyRegisterPendingPage() {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}時間${minutes}分`
    } else if (minutes > 0) {
      return `${minutes}分${secs}秒`
    } else {
      return `${secs}秒`
    }
  }

  const verificationSteps = [
    {
      title: "申請受付",
      description: "企業登録申請を受け付けました",
      status: "completed",
      time: "完了",
    },
    {
      title: "管理者承認",
      description: "キャリプラ管理者による最終確認",
      status: "pending",
      time: "1-3営業日",
    },
    {
      title: "アカウント有効化",
      description: "ログイン可能になります",
      status: "pending",
      time: "即時",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">企業登録申請完了</h1>
          <p className="text-gray-600">管理者承認をお待ちください</p>
        </div>

        {/* ステータスカード */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>申請ステータス</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                承認待ち
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {step.status === "completed" ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ) : step.status === "in_progress" ? (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-medium ${
                          step.status === "completed"
                            ? "text-green-900"
                            : step.status === "in_progress"
                              ? "text-blue-900"
                              : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span
                        className={`text-sm ${
                          step.status === "completed"
                            ? "text-green-600"
                            : step.status === "in_progress"
                              ? "text-blue-600"
                              : "text-gray-400"
                        }`}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        step.status === "completed"
                          ? "text-green-700"
                          : step.status === "in_progress"
                            ? "text-blue-700"
                            : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* 重要な情報 */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              重要なお知らせ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">メール通知について</h4>
              <p className="text-sm text-blue-700">
                承認完了時に登録いただいたメールアドレスに通知をお送りします。 迷惑メールフォルダもご確認ください。
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">承認後の流れ</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• アカウント有効化のメール通知</li>
                <li>• ログイン・セットアップガイドの開始</li>
                <li>• 企業プロフィール設定</li>
                <li>• 最初の求人作成</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* お問い合わせ */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-green-600" />
              お困りの場合
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">メールサポート</h4>
                <p className="text-sm text-gray-600 mb-3">24時間受付</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:support@careerpla.com">メール送信</a>
                </Button>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">電話サポート</h4>
                <p className="text-sm text-gray-600 mb-3">平日 9:00-18:00</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="tel:03-1234-5678">03-1234-5678</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              トップページに戻る
            </Link>
          </Button>
          <Button asChild>
            <Link href="/auth/company/login">
              <ArrowRight className="h-4 w-4 mr-2" />
              ログインページへ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
