"use client"

import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, FileText, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    availableDays: [] as string[],
    startDate: "",
    additionalInfo: "",
    agreeTerms: false,
  })

  const [isConfirmMode, setIsConfirmMode] = useState(false)

  type Job = {
    id: string;
    title: string;
    publish_date: string | null;
    salary: number | null;
    salary_type: string | null;
    duration: string | null;
  };
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("id, title, publish_date, salary, salary_type, duration")
        .eq("id", params.id)
        .single();
      if (error) {
        console.error("Failed to fetch job:", error);
      } else {
        setJob(data);
      }
    };
    fetchJob();
  }, [params.id]);

  const weekDays = [
    { id: "monday", label: "月曜日" },
    { id: "tuesday", label: "火曜日" },
    { id: "wednesday", label: "水曜日" },
    { id: "thursday", label: "木曜日" },
    { id: "friday", label: "金曜日" },
    { id: "saturday", label: "土曜日" },
    { id: "sunday", label: "日曜日" },
  ]

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        求人情報を読み込み中...
      </div>
    );
  }

  const handleDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        availableDays: [...prev.availableDays, dayId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        availableDays: prev.availableDays.filter((day) => day !== dayId),
      }))
    }
  }

  const handleConfirm = () => {
    if (!formData.agreeTerms) {
      alert("必須項目を入力してください")
      return
    }
    setIsConfirmMode(true)
  }

  const handleSubmit = async () => {
    // 認証済みユーザーを取得
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("応募にはログインが必要です。")
      return
    }

    const availableDaysJapanese = formData.availableDays.map(dayId =>
      weekDays.find(d => d.id === dayId)?.label ?? dayId
    );

    // applications テーブルに挿入
    const { error } = await supabase
      .from("applications")
      .insert([
        {
          job_id: params.id,
          user_id: user.id,
          available_days: availableDaysJapanese,
          start_date: formData.startDate,
          additional_info: formData.additionalInfo,
          agree_terms: formData.agreeTerms,
        },
      ])

    if (error) {
      console.error("応募の保存に失敗しました:", error)
      alert("応募の送信中にエラーが発生しました。")
    } else {
      alert("応募を送信しました。")
      // 必要に応じてリダイレクト処理を追加
    }
  }

  const isFormValid = formData.agreeTerms

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href={`/student/jobs/${params.id}`}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <span className="text-lg font-semibold">応募フォーム</span>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Job Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 mb-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <h2 className="font-semibold">{job.title}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{job.salary !== null ? `¥${job.salary.toLocaleString()}` : "―"}</span>
              <span>{job.duration ?? "―"}</span>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        {!isConfirmMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                応募情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Days */}
              <div className="space-y-3">
                <Label>勤務可能曜日</Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.availableDays.includes(day.id)}
                        onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                      />
                      <Label htmlFor={day.id} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>勤務開始希望日</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <Label>その他・質問事項</Label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="企業への質問や特記事項があれば記入してください（任意）"
                  className="min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
        {!isConfirmMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                添付ファイル（任意）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">ポートフォリオや関連資料をアップロード</p>
                <p className="text-xs text-gray-500">PDF, Word, PowerPoint (最大10MB)</p>
                <Button variant="outline" size="sm" className="mt-3">
                  ファイルを選択
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms Agreement */}
        {!isConfirmMode && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    <Link href="/terms" className="text-blue-600 underline">
                      利用規約
                    </Link>
                    および
                    <Link href="/privacy" className="text-blue-600 underline">
                      プライバシーポリシー
                    </Link>
                    に同意します
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation View */}
        {isConfirmMode && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                入力内容の確認
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.availableDays.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">勤務可能曜日</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {formData.availableDays.map((day) => weekDays.find((d) => d.id === day)?.label).join(", ")}
                  </p>
                </div>
              )}
              {formData.startDate && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">勤務開始希望日</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{formData.startDate}</p>
                </div>
              )}
              {formData.additionalInfo && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">その他・質問事項</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{formData.additionalInfo}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="space-y-3">
          {!isConfirmMode ? (
            <Button
              onClick={handleConfirm}
              disabled={!isFormValid}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              確認画面へ
            </Button>
          ) : (
            <div className="space-y-3">
              <Button onClick={() => setIsConfirmMode(false)} variant="outline" className="w-full h-12 text-base">
                入力内容を修正する
              </Button>
              <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">
                <CheckCircle className="h-5 w-5 mr-2" />
                応募を送信する
              </Button>
            </div>
          )}
          <p className="text-xs text-gray-500 text-center">
            応募後、企業からの連絡をお待ちください。通常3営業日以内にご連絡いたします。
          </p>
        </div>
      </div>
    </div>
  )
}
