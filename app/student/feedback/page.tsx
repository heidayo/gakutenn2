"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Filter,
  Home,
  MessageSquare,
  BarChart3,
  User,
  Calendar,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function FeedbackListPage() {
  const [selectedCategory, setSelectedCategory] = useState("すべて")

  const feedbackStats = {
    totalFeedbacks: 12,
    averageRating: 4.3,
    improvementRate: 85,
    learningNotes: 8,
  }

  const feedbackList = [
    {
      id: 1,
      company: "株式会社テックスタート",
      role: "Webマーケティングアシスタント",
      rating: 4.5,
      date: "2024年5月28日",
      isNew: true,
      hasLearningNote: false,
      preview: "積極的に取り組み、データ分析スキルが向上しました。今後はプレゼンテーション力を...",
      category: "マーケティング",
      duration: "2週間",
    },
    {
      id: 2,
      company: "クリエイティブ合同会社",
      role: "SNS運用サポート",
      rating: 4.8,
      date: "2024年5月20日",
      isNew: false,
      hasLearningNote: true,
      preview: "クリエイティブな発想力と実行力が素晴らしかったです。チームワークも...",
      category: "クリエイティブ",
      duration: "1ヶ月",
    },
    {
      id: 3,
      company: "イノベーション株式会社",
      role: "データ分析補助",
      rating: 4.2,
      date: "2024年5月15日",
      isNew: false,
      hasLearningNote: true,
      preview: "丁寧な作業で信頼できます。Excel スキルが大幅に向上しました...",
      category: "データ分析",
      duration: "3週間",
    },
    {
      id: 4,
      company: "マーケティングプロ",
      role: "市場調査アシスタント",
      rating: 4.0,
      date: "2024年5月10日",
      isNew: false,
      hasLearningNote: false,
      preview: "基本的なリサーチスキルは身についています。より深い分析力を...",
      category: "リサーチ",
      duration: "2週間",
    },
  ]

  const categories = ["すべて", "マーケティング", "クリエイティブ", "データ分析", "リサーチ"]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/dashboard">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">フィードバック</span>
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">{feedbackStats.totalFeedbacks}</div>
                <div className="text-xs text-gray-600">総フィードバック数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-bold text-yellow-600">{feedbackStats.averageRating}</div>
                <div className="text-xs text-gray-600">平均評価</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold text-green-600">{feedbackStats.improvementRate}%</div>
                <div className="text-xs text-gray-600">成長実感度</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-600">{feedbackStats.learningNotes}</div>
                <div className="text-xs text-gray-600">学びメモ数</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">今月の成長目標</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>学びメモ作成</span>
                <span className="text-gray-600">8/10</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>平均評価向上</span>
                <span className="text-gray-600">4.3/4.5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`whitespace-nowrap cursor-pointer ${
                selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">フィードバック履歴</h2>
            <span className="text-sm text-gray-600">
              {
                feedbackList.filter(
                  (feedback) => selectedCategory === "すべて" || feedback.category === selectedCategory,
                ).length
              }
              件
            </span>
          </div>

          {feedbackList
            .filter((feedback) => selectedCategory === "すべて" || feedback.category === selectedCategory)
            .map((feedback) => (
              <Link key={feedback.id} href={`/student/feedback/${feedback.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{feedback.company}</span>
                          {feedback.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                        </div>
                        <h3 className="font-semibold text-base mb-1">{feedback.role}</h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{feedback.date}</span>
                          </div>
                          <span>期間: {feedback.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{feedback.rating}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{feedback.preview}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {feedback.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {feedback.hasLearningNote ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            学びメモあり
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                            学びメモ未作成
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/messages" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">メッセージ</span>
          </Link>
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
