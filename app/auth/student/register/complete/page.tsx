"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowRight, User, FileText, Search, Clock, Star, Target } from "lucide-react"

export default function StudentRegisterCompletePage() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)

  const quickTasks = [
    {
      icon: User,
      title: "プロフィールを完成させる",
      description: "自己紹介、スキル、経験を入力",
      time: "5分",
      priority: "high",
      href: "/student/profile",
    },
    {
      icon: Target,
      title: "志向性診断を受ける",
      description: "あなたに最適なキャリアを見つける",
      time: "10分",
      priority: "high",
      href: "/student/assessment",
    },
    {
      icon: Search,
      title: "気になる案件を探す",
      description: "条件に合う求人をチェック",
      time: "3分",
      priority: "medium",
      href: "/student/jobs",
    },
  ]

  const features = [
    {
      icon: FileText,
      title: "スマート履歴書作成",
      description: "AIが最適な履歴書を自動生成",
    },
    {
      icon: Star,
      title: "パーソナライズド求人",
      description: "あなたにぴったりの求人を推薦",
    },
    {
      icon: Clock,
      title: "効率的な就活管理",
      description: "応募状況を一元管理",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ウェルカムポップアップ */}
      <Dialog open={showWelcomePopup} onOpenChange={setShowWelcomePopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">🎉 登録完了！</DialogTitle>
            <DialogDescription className="text-center">
              キャリプラへようこそ！
              <br />
              理想のキャリアを見つけるために、まずは以下のことから始めましょう。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">すぐにやること</h4>
            {quickTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <task.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                <Badge variant={task.priority === "high" ? "default" : "secondary"} className="text-xs">
                  {task.time}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowWelcomePopup(false)} className="flex-1">
              後で
            </Button>
            <Button
              onClick={() => {
                setShowWelcomePopup(false)
                window.location.href = "/student/profile"
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              始める
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* 成功メッセージ */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">アカウント作成完了！</h1>
            <p className="text-lg text-gray-600">キャリプラへようこそ！理想のキャリアを見つける旅を始めましょう。</p>
          </div>

          {/* クイックアクション */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                次にやること
              </CardTitle>
              <CardDescription>効果的に就活を進めるために、以下のステップを完了しましょう</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickTasks.map((task, index) => (
                  <Link key={index} href={task.href}>
                    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <task.icon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={task.priority === "high" ? "default" : "secondary"}>{task.time}</Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 機能紹介 */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>キャリプラでできること</CardTitle>
              <CardDescription>あなたの就活を効率化する機能をご紹介します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <feature.icon className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/student/dashboard">
                ダッシュボードへ
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/student/profile">
                プロフィール設定
                <User className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* サポート情報 */}
          <div className="text-center mt-8 p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 mb-2">ご不明な点がございましたら、お気軽にお問い合わせください</p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/help" className="text-blue-600 hover:underline">
                ヘルプセンター
              </Link>
              <Link href="/support" className="text-blue-600 hover:underline">
                サポート
              </Link>
              <Link href="/guide" className="text-blue-600 hover:underline">
                利用ガイド
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
