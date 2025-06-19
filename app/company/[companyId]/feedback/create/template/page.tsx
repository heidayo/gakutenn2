"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Send, ArrowLeft, User, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import Image from "next/image"

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

  // 求人一覧を格納するstate
  const [jobsList, setJobsList] = useState<{ id: string; title: string }[]>([])
  // 選択された求人IDを格納するstate
  const [selectedJobId, setSelectedJobId] = useState<string>("")

  // SupabaseクライアントとルートからcompanyIdを取得
  const { companyId } = useParams()
  // companyId を string に正規化
  const normalizedCompanyId = Array.isArray(companyId) ? companyId[0] : companyId

  // 応募者データを格納するstate
  const [students, setStudents] = useState<Array<{
    user_id: string
    avatar_url: string | null
    first_name: string | null
    last_name: string | null
    full_name: string | null
    university: string | null
    faculty: string | null
  }>>([])

  useEffect(() => {
    if (!normalizedCompanyId || !selectedJobId) {
      setStudents([]);
      return;
    }
    const fetchStudents = async () => {
      const { data: applicationRows, error: appError } = await supabase
        .from('applications')
        .select('user_id')
        .eq('company_id', normalizedCompanyId)
        .eq('job_id', selectedJobId);
      if (appError) {
        console.error('応募者ID取得エラー:', appError);
        return;
      }
      const userIds = applicationRows.map((row) => row.user_id);
      if (userIds.length === 0) {
        setStudents([]);
        return;
      }
      const { data: profileRows, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, avatar_url, first_name, last_name, full_name, university, faculty')
        .in('user_id', userIds);
      if (profileError) {
        console.error('プロフィール取得エラー:', profileError);
        return;
      }
      setStudents(profileRows);
    };
    fetchStudents();
  }, [normalizedCompanyId, selectedJobId]);

  // 求人が変更されたときに学生選択をリセット
  useEffect(() => {
    setSelectedStudent('');
    setFeedbackData((prev) => ({ ...prev, studentId: '' }));
  }, [selectedJobId]);

  // 会社に紐づく求人一覧を取得
  useEffect(() => {
    if (!normalizedCompanyId) return
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title")
        .eq("company_id", normalizedCompanyId)
      if (error) {
        console.error("求人取得エラー:", error)
      } else {
        setJobsList(data || [])
      }
    }
    fetchJobs()
  }, [normalizedCompanyId])

  const currentTemplate = feedbackTemplates.find((t) => t.id === selectedTemplate)
  const currentStudent = students.find((s) => s.user_id === selectedStudent)

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
    if (!normalizedCompanyId) {
      alert("企業IDが取得できません。");
      return;
    }
    if (!feedbackData.studentId) {
      alert("評価対象の学生が選択されていません。");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .insert({
          company_id: normalizedCompanyId,
          student_id: feedbackData.studentId,
          job_id: selectedJobId,
          template_id: feedbackData.templateId,
          ratings: feedbackData.ratings,
          comments: feedbackData.comments,
          overall_comment: feedbackData.overallComment,
          overall_rating: feedbackData.overallRating,
        });

      if (error) {
        console.error('フィードバック保存エラー:', error);
        alert('送信に失敗しました。もう一度お試しください。');
      } else {
        alert('フィードバックを送信しました！');
        router.push(`/company/${normalizedCompanyId}/feedback`);
      }
    } finally {
      setIsSubmitting(false);
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

  const canProceedToStep2 = selectedTemplate !== "" && selectedJobId !== ""
  const canProceedToStep3 = selectedStudent !== "" && students.length > 0;
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
            {/* 求人選択ドロップダウン */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">対象求人</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                <option value="">-- 求人を選択 --</option>
                {jobsList.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
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
              <Button
                onClick={() => canProceedToStep2 && setStep(2)}
                disabled={!canProceedToStep2}
                className="px-8"
              >
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
                    key={student.user_id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStudent === student.user_id ? "ring-2 ring-blue-600 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleStudentSelect(student.user_id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {student.avatar_url ? (
                            <Image
                              src={student.avatar_url}
                              alt={student.full_name || "アバター"}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{student.full_name || `${student.first_name} ${student.last_name}`}</h3>
                            <p className="text-sm text-gray-600">{student.university}</p>
                          </div>
                        </div>
                        {selectedStudent === student.user_id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                      <p className="text-sm text-gray-500">{student.faculty}</p>
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
                    <span className="font-medium">{currentStudent.full_name || `${currentStudent.first_name} ${currentStudent.last_name}`}</span>
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
