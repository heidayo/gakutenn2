"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Send, Clock, Star, User, Mail, Phone, Calendar, GraduationCap, FileText } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

type FeedbackStatus = "draft" | "sent" | "scheduled"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  university: string
  major: string
  year: number
  avatar?: string
}

interface Feedback {
  id: string
  student: Student
  jobTitle: string
  jobName: string
  rating: number
  status: FeedbackStatus
  content: string
  strengths: string[]
  improvements: string[]
  overallComment: string
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  scheduledAt?: Date
  assignee: string
  department: string
}

// サンプルデータ
const sampleFeedback: Feedback = {
  id: "1",
  student: {
    id: "student-1",
    name: "田中太郎",
    email: "tanaka@example.com",
    phone: "090-1234-5678",
    university: "東京大学",
    major: "情報工学科",
    year: 3,
    avatar: "/placeholder.svg?height=40&width=40&text=田中",
  },
  jobTitle: "フロントエンドエンジニア",
  jobName: "React開発エンジニア募集",
  rating: 4,
  status: "sent",
  content:
    "インターンシップ期間中、非常に積極的に取り組んでいただきました。技術的な理解力が高く、新しい技術への適応も早かったです。",
  strengths: [
    "技術的な理解力が高い",
    "積極的にコミュニケーションを取る",
    "問題解決能力に優れている",
    "チームワークが良い",
  ],
  improvements: ["コードレビューでの指摘事項への対応速度", "ドキュメント作成スキル", "プレゼンテーション能力"],
  overallComment: "今後の成長が非常に楽しみな学生です。継続的な学習意欲と向上心を持ち続けてください。",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-16"),
  sentAt: new Date("2024-01-16"),
  assignee: "山田花子",
  department: "開発部",
}

const statusConfig = {
  draft: { label: "下書き", color: "bg-gray-500", icon: FileText },
  sent: { label: "送信済み", color: "bg-green-500", icon: Send },
  scheduled: { label: "送信予定", color: "bg-blue-500", icon: Clock },
}

export default function FeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 実際の実装では、APIからフィードバックデータを取得
    setTimeout(() => {
      setFeedback(sampleFeedback)
      setLoading(false)
    }, 500)
  }, [params.id])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusBadge = (status: FeedbackStatus) => {
    const config = statusConfig[status]
    const IconComponent = config.icon
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">フィードバックが見つかりません</p>
          <Button onClick={() => router.back()} className="mt-4">
            戻る
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-2xl font-bold">フィードバック詳細</h1>
            <p className="text-gray-600">ID: {feedback.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(feedback.status)}
          <Button onClick={() => router.push(`/company/feedback/${feedback.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            編集
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 学生情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              学生情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={feedback.student.avatar || "/placeholder.svg"} />
                <AvatarFallback>{feedback.student.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{feedback.student.name}</h3>
                <p className="text-sm text-gray-600">{feedback.student.university}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{feedback.student.major}</p>
                  <p className="text-xs text-gray-600">{feedback.student.year}年生</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm">{feedback.student.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm">{feedback.student.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* フィードバック詳細 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">職種</label>
                  <p className="font-semibold">{feedback.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">求人名</label>
                  <p className="font-semibold">{feedback.jobName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">担当者</label>
                  <p className="font-semibold">{feedback.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">部署</label>
                  <p className="font-semibold">{feedback.department}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">総合評価</label>
                <div className="flex items-center gap-2 mt-1">
                  {renderStars(feedback.rating)}
                  <span className="font-semibold">{feedback.rating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* フィードバック内容 */}
          <Card>
            <CardHeader>
              <CardTitle>フィードバック内容</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">総評</TabsTrigger>
                  <TabsTrigger value="strengths">強み</TabsTrigger>
                  <TabsTrigger value="improvements">改善点</TabsTrigger>
                  <TabsTrigger value="overall">総合コメント</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="mt-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{feedback.content}</p>
                  </div>
                </TabsContent>

                <TabsContent value="strengths" className="mt-4">
                  <div className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p>{strength}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="improvements" className="mt-4">
                  <div className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p>{improvement}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="overall" className="mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{feedback.overallComment}</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 履歴情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                履歴情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">作成日</label>
                  <p className="font-semibold">{format(feedback.createdAt, "yyyy年MM月dd日 HH:mm", { locale: ja })}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">更新日</label>
                  <p className="font-semibold">{format(feedback.updatedAt, "yyyy年MM月dd日 HH:mm", { locale: ja })}</p>
                </div>
                {feedback.sentAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">送信日</label>
                    <p className="font-semibold">{format(feedback.sentAt, "yyyy年MM月dd日 HH:mm", { locale: ja })}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
