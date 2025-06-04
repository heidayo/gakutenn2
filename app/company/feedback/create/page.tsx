"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Star,
  Upload,
  Save,
  Send,
  Clock,
  Eye,
  FileText,
  ImageIcon,
  Trash2,
  Download,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Target,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Settings,
  Lightbulb,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function FeedbackCreatePage() {
  // State management
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [strengthComment, setStrengthComment] = useState("")
  const [improvementComment, setImprovementComment] = useState("")
  const [generalComment, setGeneralComment] = useState("")
  const [internalMemo, setInternalMemo] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [sendOption, setSendOption] = useState("save")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isDraft, setIsDraft] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentField, setCurrentField] = useState("")

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (strengthComment || improvementComment || generalComment || internalMemo) {
        const draftData = {
          rating,
          strengthComment,
          improvementComment,
          generalComment,
          internalMemo,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem("feedback_draft", JSON.stringify(draftData))
        setLastSaved(new Date())
      }
    }, 5000)

    return () => clearInterval(autoSave)
  }, [rating, strengthComment, improvementComment, generalComment, internalMemo])

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("feedback_draft")
    if (savedDraft) {
      const draft = JSON.parse(savedDraft)
      setRating(draft.rating || 0)
      setStrengthComment(draft.strengthComment || "")
      setImprovementComment(draft.improvementComment || "")
      setGeneralComment(draft.generalComment || "")
      setInternalMemo(draft.internalMemo || "")
    }
  }, [])

  // useEffectを追加してクエリパラメータから学生IDを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const studentId = urlParams.get("studentId")
    if (studentId) {
      // 学生IDに基づいて学生情報を設定
      // 実際の実装では、APIから学生情報を取得
      console.log("Selected student ID:", studentId)
    }
  }, [])

  // Mock data
  const student = {
    id: 1,
    name: "田中 太郎",
    email: "tanaka.taro@example.com",
    phone: "090-1234-5678",
    university: "東京大学 経済学部 2年生",
    location: "東京都",
    profileImage: "T",
    internshipTitle: "Webマーケティングアシスタント",
    period: "2024年6月1日 - 2024年8月31日",
    department: "マーケティング部",
    mentor: "佐藤 花子",
    workDays: 15,
    totalHours: 120,
    profileCompletion: 85,
    skills: ["Excel", "データ分析", "SNS運用", "PowerPoint"],
    recentActivities: ["SNS投稿コンテンツ作成", "競合他社分析レポート作成", "顧客アンケート集計・分析"],
  }

  const templates = [
    {
      id: "marketing",
      name: "マーケティング向け",
      strengthTemplate: "データ分析能力が優秀で、論理的思考力を活かした提案ができています。",
      improvementTemplate: "プレゼンテーション力をさらに向上させることで、より効果的な提案ができるでしょう。",
    },
    {
      id: "engineering",
      name: "エンジニア向け",
      strengthTemplate: "技術習得が早く、コードの品質も高いレベルを維持しています。",
      improvementTemplate: "チーム開発でのコミュニケーションを意識することで、さらに成長できるでしょう。",
    },
    {
      id: "sales",
      name: "営業向け",
      strengthTemplate: "顧客との関係構築が上手で、信頼を得るのが早いです。",
      improvementTemplate: "数値管理とPDCAサイクルを意識することで、より成果を上げられるでしょう。",
    },
    {
      id: "general",
      name: "一般向け",
      strengthTemplate: "積極的な姿勢と学習意欲が素晴らしく、チームに良い影響を与えています。",
      improvementTemplate: "時間管理とタスクの優先順位付けを意識することで、より効率的に業務を進められるでしょう。",
    },
  ]

  const suggestions = {
    strength: [
      "積極的な姿勢で業務に取り組んでいます",
      "論理的思考力が優れています",
      "コミュニケーション能力が高いです",
      "学習意欲が旺盛で成長が早いです",
      "チームワークを大切にしています",
    ],
    improvement: [
      "時間管理をより意識することをお勧めします",
      "プレゼンテーション力の向上を期待しています",
      "細部への注意力を高めることで品質向上につながります",
      "自主性をさらに発揮することを期待しています",
      "技術スキルの継続的な向上を目指しましょう",
    ],
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setStrengthComment(template.strengthTemplate)
      setImprovementComment(template.improvementTemplate)
      setSelectedTemplate(templateId)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter((file) => file.size <= 20 * 1024 * 1024) // 20MB limit
    setAttachedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSuggestionClick = (suggestion: string, field: string) => {
    if (field === "strength") {
      setStrengthComment((prev) => prev + (prev ? " " : "") + suggestion)
    } else if (field === "improvement") {
      setImprovementComment((prev) => prev + (prev ? " " : "") + suggestion)
    }
    setShowSuggestions(false)
  }

  const validateForm = () => {
    const errors = []
    if (rating === 0) errors.push("評価を入力してください")
    if (strengthComment.length < 100) errors.push("強みコメントは100文字以上入力してください")
    if (improvementComment.length < 100) errors.push("改善コメントは100文字以上入力してください")
    return errors
  }

  const handleSubmit = (action: string) => {
    const errors = validateForm()
    if (errors.length > 0 && action !== "save") {
      alert(errors.join("\n"))
      return
    }

    const feedbackData = {
      studentId: student.id,
      rating,
      strengthComment,
      improvementComment,
      generalComment,
      internalMemo,
      attachedFiles: attachedFiles.map((f) => f.name),
      action,
      scheduledDate: action === "schedule" ? scheduledDate : null,
      scheduledTime: action === "schedule" ? scheduledTime : null,
      timestamp: new Date().toISOString(),
    }

    console.log("Feedback submission:", feedbackData)

    switch (action) {
      case "save":
        alert("フィードバックを保存しました")
        break
      case "send":
        alert("フィードバックを学生に送信しました")
        break
      case "schedule":
        alert(`フィードバックを${scheduledDate} ${scheduledTime}に送信予約しました`)
        break
    }

    // Clear draft after successful submission
    if (action !== "save") {
      localStorage.removeItem("feedback_draft")
    }
  }

  const renderStars = (currentRating: number, isInteractive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1
      const isHalf = currentRating >= i + 0.5 && currentRating < starValue
      const isFull = currentRating >= starValue

      return (
        <button
          key={i}
          type="button"
          className={`relative ${isInteractive ? "cursor-pointer" : "cursor-default"}`}
          onClick={() => isInteractive && setRating(starValue)}
          onMouseEnter={() => isInteractive && setHoverRating(starValue)}
          onMouseLeave={() => isInteractive && setHoverRating(0)}
          disabled={!isInteractive}
        >
          <Star
            className={`h-6 w-6 ${
              isFull || (isInteractive && hoverRating >= starValue)
                ? "text-yellow-500 fill-current"
                : isHalf
                  ? "text-yellow-500 fill-current"
                  : "text-gray-300"
            }`}
          />
        </button>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/company/feedback">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                フィードバック一覧に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">フィードバック作成</h1>
              <p className="text-sm text-gray-600">
                {student.name} - {student.internshipTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {lastSaved && (
              <div className="flex items-center text-sm text-gray-500">
                <Save className="h-4 w-4 mr-1" />
                {lastSaved.toLocaleTimeString()}に保存済み
              </div>
            )}
            <Badge variant={isDraft ? "secondary" : "default"}>{isDraft ? "下書き" : "送信済み"}</Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel - Student Profile (40%) */}
        <div className="w-2/5 bg-white border-r p-6 space-y-6 max-h-screen overflow-y-auto">
          {/* Student Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">{student.profileImage}</span>
            </div>
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{student.university}</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{student.location}</span>
            </div>
          </div>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">連絡先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{student.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Internship Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">インターンシップ情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">期間</span>
                <span className="text-sm font-semibold">{student.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">配属部署</span>
                <span className="text-sm font-semibold">{student.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">メンター</span>
                <span className="text-sm font-semibold">{student.mentor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">出勤日数</span>
                <span className="text-sm font-semibold">{student.workDays}日</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">総労働時間</span>
                <span className="text-sm font-semibold">{student.totalHours}時間</span>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">スキル</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最近の活動</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">プロフィール完成度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">完成度</span>
                  <span className="font-semibold">{student.profileCompletion}%</span>
                </div>
                <Progress value={student.profileCompletion} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Feedback Form (60%) */}
        <div className="w-3/5 p-6 space-y-6 max-h-screen overflow-y-auto">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>テンプレート選択</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="業務別テンプレートを選択" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>総合評価</span>
                <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {renderStars(hoverRating || rating, true)}
                <span className="ml-4 text-lg font-semibold">{(hoverRating || rating).toFixed(1)}</span>
              </div>
              {rating === 0 && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  評価を入力してください
                </p>
              )}
            </CardContent>
          </Card>

          {/* Strength Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>強みコメント</span>
                  <span className="text-red-500">*</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentField("strength")
                    setShowSuggestions(true)
                  }}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  AIサジェスト
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={strengthComment}
                onChange={(e) => setStrengthComment(e.target.value)}
                placeholder="学生の強みや優れている点を具体的に記載してください（100-400文字）"
                className={`min-h-[120px] ${
                  strengthComment.length > 0 && strengthComment.length < 100 ? "border-red-500" : ""
                }`}
                maxLength={400}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-sm ${
                    strengthComment.length < 100
                      ? "text-red-500"
                      : strengthComment.length > 350
                        ? "text-yellow-500"
                        : "text-gray-500"
                  }`}
                >
                  {strengthComment.length}/400文字
                  {strengthComment.length < 100 && " (最低100文字)"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>改善コメント</span>
                  <span className="text-red-500">*</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentField("improvement")
                    setShowSuggestions(true)
                  }}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  AIサジェスト
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={improvementComment}
                onChange={(e) => setImprovementComment(e.target.value)}
                placeholder="今後の成長に向けた改善点やアドバイスを記載してください（100-400文字）"
                className={`min-h-[120px] ${
                  improvementComment.length > 0 && improvementComment.length < 100 ? "border-red-500" : ""
                }`}
                maxLength={400}
              />
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-sm ${
                    improvementComment.length < 100
                      ? "text-red-500"
                      : improvementComment.length > 350
                        ? "text-yellow-500"
                        : "text-gray-500"
                  }`}
                >
                  {improvementComment.length}/400文字
                  {improvementComment.length < 100 && " (最低100文字)"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* General Comment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>総合コメント</span>
                <span className="text-gray-400">(任意)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generalComment}
                onChange={(e) => setGeneralComment(e.target.value)}
                placeholder="全体的な印象や今後への期待など、自由にコメントしてください（最大2,000文字）"
                className="min-h-[120px]"
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">{generalComment.length}/2,000文字</span>
              </div>
            </CardContent>
          </Card>

          {/* Internal Memo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>社内メモ</span>
                <Badge variant="secondary" className="text-xs">
                  学生非公開
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={internalMemo}
                onChange={(e) => setInternalMemo(e.target.value)}
                placeholder="社内向けのメモや引き継ぎ事項など（学生には表示されません）"
                className="min-h-[80px]"
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500">{internalMemo.length}/1,000文字</span>
              </div>
            </CardContent>
          </Card>

          {/* File Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>ファイル添付</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">ファイルをドラッグ&ドロップまたはクリックして選択</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, 画像, Word文書 (最大20MB)</p>
                  </label>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">添付ファイル</h4>
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          {file.type.startsWith("image/") ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : file.type === "application/pdf" ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>送信オプション</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={sendOption} onValueChange={setSendOption} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="save" id="save" />
                  <Label htmlFor="save" className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>保存のみ（社内閲覧可）</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="send" id="send" />
                  <Label htmlFor="send" className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>学生へ即時送信</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="schedule" id="schedule" />
                  <Label htmlFor="schedule" className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>送信予約</span>
                  </Label>
                </div>
              </RadioGroup>

              {sendOption === "schedule" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">送信日</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">送信時刻</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      プレビュー
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>学生画面プレビュー</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">総合評価</h3>
                        <div className="flex items-center space-x-2">
                          {renderStars(rating)}
                          <span className="font-semibold">{rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">強み</h3>
                        <p className="text-sm">{strengthComment || "未入力"}</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">改善点</h3>
                        <p className="text-sm">{improvementComment || "未入力"}</p>
                      </div>
                      {generalComment && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">総合コメント</h3>
                          <p className="text-sm">{generalComment}</p>
                        </div>
                      )}
                      {attachedFiles.length > 0 && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">添付ファイル</h3>
                          <div className="space-y-1">
                            {attachedFiles.map((file, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Download className="h-4 w-4" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleSubmit(sendOption)}
                  className="flex-1"
                  disabled={sendOption !== "save" && validateForm().length > 0}
                >
                  {sendOption === "save" && (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </>
                  )}
                  {sendOption === "send" && (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      送信
                    </>
                  )}
                  {sendOption === "schedule" && (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      予約
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Suggestions Modal */}
      <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AIサジェスト - {currentField === "strength" ? "強み" : "改善点"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(currentField === "strength" ? suggestions.strength : suggestions.improvement).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => handleSuggestionClick(suggestion, currentField)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
