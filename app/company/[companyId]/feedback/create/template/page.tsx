"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Send, ArrowLeft, User, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// 評価テンプレート
const feedbackTemplates = [
  {
    id: "interview",
    name: "面接評価",
    description: "面接での評価項目",
    categories: [
      { name: "コミュニケーション能力", weight: 20 },
      { name: "技術スキル", weight: 30 },
      { name: "問題解決能力", weight: 25 },
      { name: "チームワーク", weight: 15 },
      { name: "成長意欲", weight: 10 },
    ],
  },
  {
    id: "internship",
    name: "インターン評価",
    description: "インターンシップでの評価項目",
    categories: [
      { name: "業務遂行能力", weight: 25 },
      { name: "学習意欲", weight: 20 },
      { name: "責任感", weight: 20 },
      { name: "協調性", weight: 15 },
      { name: "創造性", weight: 20 },
    ],
  },
  {
    id: "project",
    name: "プロジェクト評価",
    description: "プロジェクトでの評価項目",
    categories: [
      { name: "企画力", weight: 25 },
      { name: "実行力", weight: 30 },
      { name: "リーダーシップ", weight: 20 },
      { name: "成果物の質", weight: 25 },
    ],
  },
  {
    id: "custom",
    name: "カスタム評価",
    description: "自由に評価項目を設定",
    categories: [],
  },
]

// 学生データ（サンプル）
const students = [
  { id: "1", name: "田中太郎", university: "東京大学", major: "情報工学" },
  { id: "2", name: "佐藤花子", university: "早稲田大学", major: "経済学" },
  { id: "3", name: "高橋次郎", university: "慶應義塾大学", major: "商学" },
  { id: "4", name: "伊藤美咲", university: "上智大学", major: "外国語学" },
]

interface FeedbackData {
  templateId: string
  studentId: string
  ratings: { [key: string]: number }
  comments: { [key: string]: string }
  overallComment: string
  overallRating: number
}

export default function CreateFeedbackTemplatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: テンプレート選択, 2: 学生選択, 3: 評価入力
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    templateId: "",
    studentId: "",
    ratings: {},
    comments: {},
    overallComment: "",
    overallRating: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentTemplate = feedbackTemplates.find((t) => t.id === selectedTemplate)
  const currentStudent = students.find((s) => s.id === selectedStudent)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    setFeedbackData((prev) => ({ ...prev, templateId }))
  }

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId)
    setFeedbackData((prev) => ({ ...prev, studentId }))
  }

  const handleRatingChange = (category: string, rating: number) => {
    setFeedbackData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: rating },
    }))
  }

  const handleCommentChange = (category: string, comment: string) => {
    setFeedbackData((prev) => ({
      ...prev,
      comments: { ...prev.comments, [category]: comment },
    }))
  }

  const handleOverallRatingChange = (rating: number) => {
    setFeedbackData((prev) => ({ ...prev, overallRating: rating }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // フィードバック送信処理（実際のAPIコール）
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 送信シミュレーション

      // 成功時の処理
      alert("フィードバックを送信しました！")
      router.push("/company/feedback")
    } catch (error) {
      alert("送信に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
        }`}
        onClick={() => onRatingChange && onRatingChange(i + 1)}
      />
    ))
  }

  const canProceedToStep2 = selectedTemplate !== ""
  const canProceedToStep3 = selectedStudent !== ""
  const canSubmit =
    currentTemplate &&
    feedbackData.overallRating > 0 &&
    feedbackData.overallComment.trim() !== "" &&
    (currentTemplate.id === "custom" || currentTemplate.categories.every((cat) => feedbackData.ratings[cat.name] > 0))

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold">新規フィードバック作成</h1>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 3 && <div className={`w-8 h-0.5 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* ステップ1: テンプレート選択 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>評価テンプレートを選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{template.name}</h3>
                      {selectedTemplate === template.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    {template.categories.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">評価項目:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.categories.slice(0, 3).map((category) => (
                            <Badge key={category.name} variant="secondary" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                          {template.categories.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{template.categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="px-8">
                次へ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ2: 学生選択 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>評価対象の学生を選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStudent === student.id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.university}</p>
                          </div>
                        </div>
                        {selectedStudent === student.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                      <p className="text-sm text-gray-500">{student.major}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                戻る
              </Button>
              <Button onClick={() => setStep(3)} disabled={!canProceedToStep3} className="px-8">
                次へ
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ステップ3: 評価入力 */}
      {step === 3 && currentTemplate && currentStudent && (
        <div className="space-y-6">
          {/* 選択内容の確認 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{currentTemplate.name}</Badge>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{currentStudent.name}</span>
                    <span className="text-sm text-gray-600">({currentStudent.university})</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                  変更
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 評価入力 */}
          <Card>
            <CardHeader>
              <CardTitle>評価を入力</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* カテゴリ別評価 */}
              {currentTemplate.categories.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">項目別評価</h3>
                  {currentTemplate.categories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant="secondary">重要度: {category.weight}%</Badge>
                      </div>

                      {/* 5段階評価 */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 w-12">評価:</span>
                        <div className="flex space-x-1">
                          {renderStars(feedbackData.ratings[category.name] || 0, (rating) =>
                            handleRatingChange(category.name, rating),
                          )}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">{feedbackData.ratings[category.name] || 0}/5</span>
                      </div>

                      {/* コメント */}
                      <Textarea
                        placeholder={`${category.name}についてのコメントを入力してください...`}
                        value={feedbackData.comments[category.name] || ""}
                        onChange={(e) => handleCommentChange(category.name, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {/* 総合評価 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">総合評価</h3>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-12">評価:</span>
                  <div className="flex space-x-1">
                    {renderStars(feedbackData.overallRating, handleOverallRatingChange)}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{feedbackData.overallRating}/5</span>
                </div>

                <Textarea
                  placeholder="総合的なコメントを入力してください..."
                  value={feedbackData.overallComment}
                  onChange={(e) => setFeedbackData((prev) => ({ ...prev, overallComment: e.target.value }))}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* 送信ボタン */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              戻る
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || isSubmitting} className="px-8">
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  フィードバックを送信
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
