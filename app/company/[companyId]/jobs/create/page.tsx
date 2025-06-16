"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus,
  X,
  MapPin,
  JapaneseYenIcon as Yen,
  AlertCircle,
  CheckCircle,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// ─── 型定義 ──────────────────────────────────────────────
interface FormData {
  // 基本情報
  title: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];

  // 勤務条件
  location: string;
  salary: string;
  salaryType: string;
  workDays: string[];
  workHours: string;
  duration: string;
  startDate: string;

  // 働き方
  remote: boolean;
  remoteDetails: string;
  frequency: string;

  // 待遇・福利厚生
  benefits: string[];

  // 選考フロー
  selectionSteps: { title: string; duration: string; description: string }[];

  // 企業・メンター情報
  mentorName: string;
  mentorRole: string;
  mentorExperience: string;
  mentorMessage: string;

  // 公開設定
  status: string;
  publishDate: string;
  tags: string[];
}

// 配列操作を許可するキーのみ
type ArrayField = "responsibilities" | "requirements" | "benefits";

export default function CreateJobPage() {
  const [formData, setFormData] = useState<FormData>({
    // 基本情報
    title: "",
    category: "",
    description: "",
    responsibilities: [""],
    requirements: [""],

    // 勤務条件
    location: "",
    salary: "",
    salaryType: "hourly",
    workDays: [] as string[],
    workHours: "",
    duration: "",
    startDate: "",

    // 働き方
    remote: false,
    remoteDetails: "",
    frequency: "",

    // 待遇・福利厚生
    benefits: [""],

    // 選考フロー
    selectionSteps: [
      { title: "書類選考", duration: "3日以内", description: "" },
      { title: "オンライン面談", duration: "1週間以内", description: "" },
    ],

    // 企業・メンター情報
    mentorName: "",
    mentorRole: "",
    mentorExperience: "",
    mentorMessage: "",

    // 公開設定
    status: "draft",
    publishDate: "",
    tags: [] as string[],
  })

  const [currentTab, setCurrentTab] = useState("basic")
  // 入力バリデーション用エラー
  type FieldErrorMap = Partial<Record<keyof FormData, string>>;
  const [errors, setErrors] = useState<FieldErrorMap>({})

  const router = useRouter();
  const params = useParams<{ companyId: string }>()
  const routeCompanyId = (params?.companyId ?? "") as string

  const categories = [
    "マーケティング",
    "営業",
    "エンジニア",
    "デザイン",
    "データ分析",
    "企画",
    "人事",
    "経理・財務",
    "カスタマーサポート",
    "その他",
  ]

  const workDayOptions = [
    { id: "monday", label: "月曜日" },
    { id: "tuesday", label: "火曜日" },
    { id: "wednesday", label: "水曜日" },
    { id: "thursday", label: "木曜日" },
    { id: "friday", label: "金曜日" },
    { id: "saturday", label: "土曜日" },
    { id: "sunday", label: "日曜日" },
  ]

  const suggestedTags = [
    "未経験歓迎",
    "週1OK",
    "リモート可",
    "単発OK",
    "土日可",
    "高時給",
    "交通費支給",
    "学生歓迎",
    "長期歓迎",
    "短期OK",
  ]

  const handleArrayFieldAdd = (field: ArrayField) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const handleArrayFieldRemove = (field: ArrayField, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleArrayFieldChange = (field: ArrayField, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  // ─── 選考ステップ専用 ───────────────────────────────
  const defaultStep = { title: "", duration: "", description: "" };

  const handleSelectionStepAdd = () => {
    setFormData((prev) => ({
      ...prev,
      selectionSteps: [...prev.selectionSteps, { ...defaultStep }],
    }));
  };

  const handleSelectionStepRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      selectionSteps: prev.selectionSteps.filter((_, i) => i !== index),
    }));
  };

  const handleWorkDayChange = (dayId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        workDays: [...prev.workDays, dayId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        workDays: prev.workDays.filter((day) => day !== dayId),
      }))
    }
  }

  const handleTagAdd = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSave = async (status: string) => {
    // --- 型安全外のテーブルは any キャストで回避 ---
    const sb = supabase as any
    // ─── バリデーション ──────────────────────────────
    const newErrors: FieldErrorMap = {};
    if (!formData.title) newErrors.title = "職種名は必須です";
    if (!formData.category) newErrors.category = "カテゴリは必須です";
    if (!formData.description) newErrors.description = "業務内容は必須です";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ─── ログインセッション取得 ────────────────────────────
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();

    if (sessionErr || !session) {
      alert("ログイン情報を取得できませんでした。再度ログインしてください。");
      return;
    }

    // --- 企業ID を解決 ---------------------------------------------
    let companyId: string | null = routeCompanyId || null

    if (!companyId) {
      // ① company_members から取得（推奨パス）
      const { data: memberRow, error: memberErr } = await sb
        .from("company_members")
        .select("company_id")
        .eq("user_id", session.user.id)
        .maybeSingle()

      if (memberRow?.company_id) {
        companyId = memberRow.company_id
      } else {
        // ② fallback: companies.email が Auth の email と一致する行を探す
        if (session.user.email) {
          const { data, error } = await sb
            .from("companies")
            .select("id")
            .eq("email", session.user.email)
            .maybeSingle()
          const companyRow = data as { id: string } | null
          const companyErr = error
          if (companyRow?.id) {
            companyId = companyRow.id
          } else {
            console.error("企業メンバー取得エラー:", memberErr ?? companyErr)
            alert(
              "企業情報を取得できませんでした。\n企業へ参加済みか、企業登録のメールアドレスが一致しているかをご確認ください。"
            )
            return
          }
        }
      }
    }

    // ─── 送信用データ整形 ─────────────────────────────
    const payload = {
      // ---- 必須 ----
      company_id: companyId,
      status,
      title: formData.title,
      category: formData.category,
      description: formData.description,

      // ---- 配列／詳細 ----
      responsibilities: formData.responsibilities.filter((v) => v.trim() !== ""),
      requirements: formData.requirements.filter((v) => v.trim() !== ""),
      benefits: formData.benefits.filter((v) => v.trim() !== ""),
      tags: formData.tags,

      // ---- 勤務条件 ----
      location: formData.location,
      salary: formData.salary ? Number(formData.salary) : null,
      salary_type: formData.salaryType,
      work_days: formData.workDays,
      work_hours: formData.workHours,
      duration: formData.duration,
      start_date: formData.startDate || null,
      frequency: formData.frequency,

      // ---- 働き方 ----
      remote: formData.remote,
      remote_details: formData.remoteDetails,

      // ---- 選考フロー & メンター ----
      selection_steps: formData.selectionSteps,
      mentor_name: formData.mentorName,
      mentor_role: formData.mentorRole,
      mentor_experience: formData.mentorExperience,
      mentor_message: formData.mentorMessage,

      // ---- 公開設定 & メタ ----
      publish_date: formData.publishDate
        ? new Date(formData.publishDate).toISOString()
        : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // ─── Supabase へ保存 ────────────────────────────
    const { error } = await sb.from("jobs").insert(payload);

    if (error) {
      console.error("Error saving job:", error);
      alert("求人の保存中にエラーが発生しました。");
      return;
    }

    alert(status === "published" ? "求人を公開しました！" : "下書きを保存しました！");
    router.push(companyId ? `/company/${companyId}/jobs` : "/company/jobs")
  };

  const handlePreview = () => {
    // プレビュー画面を開く
    console.log("Opening preview:", formData)
  }

  const handleCopyFromTemplate = () => {
    // テンプレートから複製
    const template = {
      title: "Webマーケティングアシスタント",
      category: "マーケティング",
      description: "急成長中のスタートアップで、Webマーケティングの実務経験を積みませんか？",
      responsibilities: [
        "Google Analytics等を使用したWebサイトのデータ分析",
        "SNSアカウント（Instagram、Twitter）の運用サポート",
        "マーケティング資料の作成（PowerPoint、Excel使用）",
      ],
      requirements: ["大学1〜3年生", "Excel、PowerPointの基本操作ができる方", "SNSを日常的に使用している方"],
      salary: "1200",
      salaryType: "hourly",
      benefits: ["交通費全額支給", "リモートワーク可", "実務経験証明書の発行"],
      tags: ["未経験歓迎", "週1OK", "リモート可"],
    }

    setFormData((prev) => ({ ...prev, ...template }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={routeCompanyId ? `/company/${routeCompanyId}/jobs` : "#"}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                求人一覧に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">新規求人作成</h1>
              <p className="text-sm text-gray-600">学生が応募したくなる魅力的な求人を作成しましょう</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleCopyFromTemplate}>
              <Copy className="h-4 w-4 mr-2" />
              テンプレートから複製
            </Button>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              プレビュー
            </Button>
            <Button variant="outline" onClick={() => handleSave("draft")}>
              <Save className="h-4 w-4 mr-2" />
              下書き保存
            </Button>
            <Button onClick={() => handleSave("published")} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4 mr-2" />
              公開する
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="conditions">勤務条件</TabsTrigger>
              <TabsTrigger value="selection">選考フロー</TabsTrigger>
              <TabsTrigger value="mentor">メンター</TabsTrigger>
              <TabsTrigger value="publish">公開設定</TabsTrigger>
            </TabsList>

            {/* 基本情報 */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>求人基本情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>職種名 *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="例: Webマーケティングアシスタント"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>カテゴリ *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>

                        {/* ポップアップがルート外に描画され、overflow hidden の親でも表示できるように */}
                        <SelectContent
                          position="popper"
                          className="z-[60] bg-white border shadow-lg"
                        >
                          <SelectGroup>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>業務内容 *</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="この求人の魅力や業務内容を詳しく説明してください"
                      className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    <p className="text-sm text-gray-500">{formData.description.length}/500文字</p>
                  </div>

                  <div className="space-y-4">
                    <Label>具体的な業務内容</Label>
                    {formData.responsibilities.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayFieldChange("responsibilities", index, e.target.value)}
                          placeholder="例: Google Analyticsを使用したWebサイトのデータ分析"
                          className="flex-1"
                        />
                        {formData.responsibilities.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArrayFieldRemove("responsibilities", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleArrayFieldAdd("responsibilities")}>
                      <Plus className="h-4 w-4 mr-2" />
                      業務内容を追加
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>応募条件・求める人物像</Label>
                    {formData.requirements.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                          placeholder="例: 大学1〜3年生"
                          className="flex-1"
                        />
                        {formData.requirements.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArrayFieldRemove("requirements", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleArrayFieldAdd("requirements")}>
                      <Plus className="h-4 w-4 mr-2" />
                      応募条件を追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 勤務条件 */}
            <TabsContent value="conditions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>勤務条件</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>勤務地</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="例: 東京都渋谷区 / リモート"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>勤務時間</Label>
                      <Input
                        value={formData.workHours}
                        onChange={(e) => setFormData((prev) => ({ ...prev, workHours: e.target.value }))}
                        placeholder="例: 10:00-18:00（応相談）"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>給与</Label>
                      <div className="flex space-x-2">
                        {formData.salaryType !== 'commission' && (
                          <Input
                            type="number"
                            value={formData.salary}
                            onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                            placeholder="1200"
                            className="flex-1"
                          />
                        )}
                        <Select
                          value={formData.salaryType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, salaryType: value }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-[9999] bg-white border shadow-lg">
                            <SelectItem value="hourly">時給</SelectItem>
                            <SelectItem value="daily">日給</SelectItem>
                            <SelectItem value="commission">歩合</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>勤務頻度</Label>
                      <Input
                        value={formData.frequency}
                        onChange={(e) => setFormData((prev) => ({ ...prev, frequency: e.target.value }))}
                        placeholder="例: 週1回〜3回"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>勤務期間</Label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                        placeholder="例: 1ヶ月〜3ヶ月"
                      />
                    </div>
                  </div>

                    <div className="space-y-3">
                      <Label>勤務可能曜日</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {workDayOptions.map((day) => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={day.id}
                              checked={formData.workDays.includes(day.id)}
                              onCheckedChange={(checked) => handleWorkDayChange(day.id, checked === true)}
                            />
                            <Label htmlFor={day.id} className="text-sm">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={formData.remote}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({ ...prev, remote: checked === true }))
                          }
                        />
                        <Label htmlFor="remote">リモートワーク可能</Label>
                      </div>
                      {formData.remote && (
                        <Input
                          value={formData.remoteDetails}
                          onChange={(e) => setFormData((prev) => ({ ...prev, remoteDetails: e.target.value }))}
                          placeholder="例: 週1回出社必須、完全リモート可"
                        />
                      )}
                    </div>

                  <div className="space-y-4">
                    <Label>待遇・福利厚生</Label>
                    {formData.benefits.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => handleArrayFieldChange("benefits", index, e.target.value)}
                          placeholder="例: 交通費全額支給"
                          className="flex-1"
                        />
                        {formData.benefits.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => handleArrayFieldRemove("benefits", index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleArrayFieldAdd("benefits")}>
                      <Plus className="h-4 w-4 mr-2" />
                      福利厚生を追加
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 選考フロー */}
            <TabsContent value="selection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>選考フロー</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {formData.selectionSteps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">ステップ {index + 1}</h4>
                        {formData.selectionSteps.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSelectionStepRemove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>選考内容</Label>
                          <Input
                            value={step.title}
                            onChange={(e) => {
                              const newSteps = [...formData.selectionSteps]
                              newSteps[index].title = e.target.value
                              setFormData((prev) => ({ ...prev, selectionSteps: newSteps }))
                            }}
                            placeholder="例: 書類選考"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>期間</Label>
                          <Input
                            value={step.duration}
                            onChange={(e) => {
                              const newSteps = [...formData.selectionSteps]
                              newSteps[index].duration = e.target.value
                              setFormData((prev) => ({ ...prev, selectionSteps: newSteps }))
                            }}
                            placeholder="例: 3日以内"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>詳細説明</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => {
                            const newSteps = [...formData.selectionSteps]
                            newSteps[index].description = e.target.value
                            setFormData((prev) => ({ ...prev, selectionSteps: newSteps }))
                          }}
                          placeholder="この選考ステップの詳細を説明してください"
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleSelectionStepAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    選考ステップを追加
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* メンター情報 */}
            <TabsContent value="mentor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>メンター情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>メンター名</Label>
                      <Input
                        value={formData.mentorName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, mentorName: e.target.value }))}
                        placeholder="例: 田中 マネージャー"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>役職・部門</Label>
                      <Input
                        value={formData.mentorRole}
                        onChange={(e) => setFormData((prev) => ({ ...prev, mentorRole: e.target.value }))}
                        placeholder="例: マーケティング部門責任者"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>経験・専門分野</Label>
                    <Input
                      value={formData.mentorExperience}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mentorExperience: e.target.value }))}
                      placeholder="例: マーケティング歴8年、データ分析専門"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>学生へのメッセージ</Label>
                    <Textarea
                      value={formData.mentorMessage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mentorMessage: e.target.value }))}
                      placeholder="学生に向けたメッセージを入力してください"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 公開設定 */}
            <TabsContent value="publish" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>公開設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>公開ステータス</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="published">公開中</SelectItem>
                        <SelectItem value="paused">一時停止</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>公開開始日</Label>
                    <Input
                      type="datetime-local"
                      value={formData.publishDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>タグ</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <button onClick={() => handleTagRemove(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">おすすめタグ</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags
                          .filter((tag) => !formData.tags.includes(tag))
                          .map((tag) => (
                            <Button key={tag} variant="outline" size="sm" onClick={() => handleTagAdd(tag)}>
                              <Plus className="h-3 w-3 mr-1" />
                              {tag}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 bg-white border-l">
          <div className="space-y-6">
            {/* 入力状況 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">入力状況</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>基本情報</span>
                  {formData.title && formData.category && formData.description ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>勤務条件</span>
                  {formData.salary && formData.location ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>選考フロー</span>
                  {formData.selectionSteps.length > 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* プレビュー */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">プレビュー</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border rounded-lg p-3 bg-gray-50">
                  <h4 className="font-semibold text-sm">{formData.title || "職種名"}</h4>
                  <p className="text-xs text-gray-600 mt-1">株式会社テックスタート</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{formData.location || "勤務地"}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                    <Yen className="h-3 w-3" />
                    <span>
                      {formData.salary
                        ? `${formData.salaryType === "hourly" ? "時給" : formData.salaryType === "daily" ? "日給" : "月給"}${formData.salary}円`
                        : "給与"}
                    </span>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={handlePreview} className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  詳細プレビュー
                </Button>
              </CardContent>
            </Card>

            {/* ヘルプ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">作成のコツ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• 具体的な業務内容を記載すると応募率が向上します</p>
                <p>• 未経験歓迎の場合は明記しましょう</p>
                <p>• メンターからのメッセージがあると安心感を与えます</p>
                <p>• 適切なタグ設定で検索されやすくなります</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
