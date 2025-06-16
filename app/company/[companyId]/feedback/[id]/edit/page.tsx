"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Send, Star, User, Plus, X } from "lucide-react"

type FeedbackStatus = "draft" | "sent" | "scheduled"

interface Student {
  id: string
  name: string
  email: string
  university: string
  major: string
  year: number
  avatar?: string
}

interface FeedbackForm {
  rating: number
  content: string
  strengths: string[]
  improvements: string[]
  overallComment: string
  status: FeedbackStatus
  scheduledAt?: Date
}

// サンプル学生データ
const sampleStudent: Student = {
  id: "student-1",
  name: "田中太郎",
  email: "tanaka@example.com",
  university: "東京大学",
  major: "情報工学科",
  year: 3,
  avatar: "/placeholder.svg?height=40&width=40&text=田中",
}

// サンプルフィードバックデータ
const sampleFeedbackForm: FeedbackForm = {
  rating: 4,
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
  status: "draft",
}

export default function FeedbackEditPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [form, setForm] = useState<FeedbackForm>(sampleFeedbackForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newStrength, setNewStrength] = useState("")
  const [newImprovement, setNewImprovement] = useState("")

  useEffect(() => {
    // 実際の実装では、APIからデータを取得
    setTimeout(() => {
      setStudent(sampleStudent)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleSave = async (status: FeedbackStatus) => {
    setSaving(true)
    try {
      // 実際の実装では、APIにデータを送信
      const updatedForm = { ...form, status }
      console.log("Saving feedback:", updatedForm)

      // 保存成功後、詳細ページに戻る
      setTimeout(() => {
        setSaving(false)
        router.push(`/company/feedback/${params.id}`)
      }, 1000)
    } catch (error) {
      console.error("Save failed:", error)
      setSaving(false)
    }
  }

  const addStrength = () => {
    if (newStrength.trim()) {
      setForm((prev) => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()],
      }))
      setNewStrength("")
    }
  }

  const removeStrength = (index: number) => {
    setForm((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index),
    }))
  }

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setForm((prev) => ({
        ...prev,
        improvements: [...prev.improvements, newImprovement.trim()],
      }))
      setNewImprovement("")
    }
  }

  const removeImprovement = (index: number) => {
    setForm((prev) => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index),
    }))
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${
          interactive ? "cursor-pointer hover:text-yellow-400" : ""
        }`}
        onClick={interactive ? () => setForm((prev) => ({ ...prev, rating: i + 1 })) : undefined}
      />
    ))
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

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">学生情報が見つかりません</p>
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
            <h1 className="text-2xl font-bold">フィードバック編集</h1>
            <p className="text-gray-600">ID: {params.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            下書き保存
          </Button>
          <Button onClick={() => handleSave("sent")} disabled={saving}>
            <Send className="w-4 h-4 mr-2" />
            送信
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
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.university}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">専攻:</span> {student.major}
              </p>
              <p className="text-sm">
                <span className="font-medium">学年:</span> {student.year}年生
              </p>
              <p className="text-sm">
                <span className="font-medium">メール:</span> {student.email}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* フィードバック編集フォーム */}
        <div className="lg:col-span-2 space-y-6">
          {/* 評価 */}
          <Card>
            <CardHeader>
              <CardTitle>総合評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {renderStars(form.rating, true)}
                <span className="ml-2 font-semibold">{form.rating}/5</span>
              </div>
            </CardContent>
          </Card>

          {/* 総評 */}
          <Card>
            <CardHeader>
              <CardTitle>総評</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="インターンシップ全体を通しての評価を記入してください..."
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                rows={6}
              />
            </CardContent>
          </Card>

          {/* 強み */}
          <Card>
            <CardHeader>
              <CardTitle>強み・良かった点</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {form.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="flex-1">{strength}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeStrength(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="新しい強みを追加..."
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addStrength()}
                />
                <Button onClick={addStrength} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 改善点 */}
          <Card>
            <CardHeader>
              <CardTitle>改善点・今後の課題</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {form.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <p className="flex-1">{improvement}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeImprovement(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="新しい改善点を追加..."
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addImprovement()}
                />
                <Button onClick={addImprovement} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 総合コメント */}
          <Card>
            <CardHeader>
              <CardTitle>総合コメント・今後へのメッセージ</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="学生への励ましのメッセージや今後のアドバイスを記入してください..."
                value={form.overallComment}
                onChange={(e) => setForm((prev) => ({ ...prev, overallComment: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
