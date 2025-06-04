"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, FileText, CheckCircle, Upload } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    motivation: "",
    selfPR: "",
    experience: "",
    availableDays: [] as string[],
    startDate: "",
    additionalInfo: "",
    agreeTerms: false,
  })

  const [isConfirmMode, setIsConfirmMode] = useState(false)

  const job = {
    id: 1,
    company: "株式会社テックスタート",
    title: "Webマーケティングアシスタント",
    salary: "時給1,200円",
    duration: "週1回〜",
  }

  const weekDays = [
    { id: "monday", label: "月曜日" },
    { id: "tuesday", label: "火曜日" },
    { id: "wednesday", label: "水曜日" },
    { id: "thursday", label: "木曜日" },
    { id: "friday", label: "金曜日" },
    { id: "saturday", label: "土曜日" },
    { id: "sunday", label: "日曜日" },
  ]

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
    if (!formData.motivation || !formData.selfPR || !formData.agreeTerms) {
      alert("必須項目を入力してください")
      return
    }
    setIsConfirmMode(true)
  }

  const handleSubmit = () => {
    // 応募処理
    console.log("Application submitted:", formData)
    // 成功画面へリダイレクト
  }

  const isFormValid = formData.motivation && formData.selfPR && formData.agreeTerms

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
                <p className="text-sm text-gray-600">{job.company}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{job.salary}</span>
              <span>{job.duration}</span>
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
              {/* Motivation */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <span>志望動機</span>
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    必須
                  </Badge>
                </Label>
                <Textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, motivation: e.target.value }))}
                  placeholder="この求人に応募する理由や、興味を持った点について教えてください（200文字以上）"
                  className="min-h-[120px]"
                />
                <div className="text-xs text-gray-500 text-right">{formData.motivation.length}/200文字以上</div>
              </div>

              {/* Self PR */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-1">
                  <span>自己PR</span>
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    必須
                  </Badge>
                </Label>
                <Textarea
                  value={formData.selfPR}
                  onChange={(e) => setFormData((prev) => ({ ...prev, selfPR: e.target.value }))}
                  placeholder="あなたの強みや特技、これまでの経験について教えてください（150文字以上）"
                  className="min-h-[100px]"
                />
                <div className="text-xs text-gray-500 text-right">{formData.selfPR.length}/150文字以上</div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label>関連する経験・スキル</Label>
                <Textarea
                  value={formData.experience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="マーケティングやデータ分析に関する経験があれば教えてください（任意）"
                  className="min-h-[80px]"
                />
              </div>

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
              <div>
                <h4 className="font-semibold text-sm mb-2">志望動機</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{formData.motivation}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">自己PR</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{formData.selfPR}</p>
              </div>
              {formData.experience && (
                <div>
                  <h4 className="font-semibold text-sm mb-2">関連する経験・スキル</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{formData.experience}</p>
                </div>
              )}
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
