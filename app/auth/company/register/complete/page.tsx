"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Sparkles,
  Users,
  Briefcase,
  BarChart3,
  ArrowRight,
  Star,
  Building2,
  Calendar,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CompanyRegisterCompletePage() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const setupTasks = [
    {
      title: "企業プロフィール完成",
      description: "会社情報・文化・福利厚生を詳しく設定",
      priority: "high",
      time: "10分",
      icon: Building2,
    },
    {
      title: "最初の求人作成",
      description: "魅力的な求人を作成して学生にアピール",
      priority: "high",
      time: "15分",
      icon: Briefcase,
    },
    {
      title: "チームメンバー招待",
      description: "採用担当者を招待して効率的な運用",
      priority: "medium",
      time: "5分",
      icon: Users,
    },
  ]

  const features = [
    {
      title: "スマート応募者管理",
      description: "AIが応募者をスコアリング・推薦",
      icon: BarChart3,
    },
    {
      title: "効率的な面接調整",
      description: "自動スケジューリング・リマインダー",
      icon: Calendar,
    },
    {
      title: "詳細な分析レポート",
      description: "採用活動の効果を可視化",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 relative overflow-hidden">
      {/* 背景装飾 */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 企業登録完了！</h1>
          <p className="text-xl text-gray-600 mb-4">キャリプラへようこそ！優秀な学生との出会いを始めましょう</p>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">アカウント有効化済み</Badge>
        </div>

        {/* セットアップガイド */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              セットアップガイド
            </CardTitle>
            <CardDescription>以下のステップを完了して、効果的な採用活動を始めましょう</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {setupTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        task.priority === "high" ? "bg-red-100" : "bg-blue-100"
                      }`}
                    >
                      <task.icon className={`h-5 w-5 ${task.priority === "high" ? "text-red-600" : "text-blue-600"}`} />
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center">
                        {task.title}
                        {task.priority === "high" && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            重要
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{task.time}</p>
                    <Button size="sm" variant="outline">
                      開始
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 プロのヒント</h4>
              <p className="text-sm text-blue-700">
                プロフィールと求人を充実させることで、応募率が平均3倍向上します。
                まずは企業プロフィールから始めることをお勧めします。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 機能紹介 */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle>キャリプラの主要機能</CardTitle>
            <CardDescription>効率的な採用活動をサポートする機能をご紹介します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 次のアクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">今すぐ始める</CardTitle>
              <CardDescription>セットアップを完了して採用活動を開始</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                asChild
              >
                <Link href="/company/onboarding">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  セットアップを開始
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>ダッシュボードを見る</CardTitle>
              <CardDescription>管理画面で機能を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/company/dashboard">ダッシュボードへ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* サポート情報 */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>サポート・ヘルプ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" asChild>
                <Link href="/help/getting-started">📚 スタートガイド</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/faq">❓ よくある質問</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@careerpla.com">📧 サポートに連絡</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ウェルカムメッセージ */}
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
          <h3 className="text-xl font-bold mb-2">キャリプラチームより</h3>
          <p className="text-blue-100">
            この度はキャリプラにご登録いただき、ありがとうございます。
            <br />
            優秀な学生との素晴らしい出会いをサポートできることを楽しみにしています！
          </p>
        </div>
      </div>
    </div>
  )
}
