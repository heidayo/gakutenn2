"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Trash2,
  Archive,
} from "lucide-react"
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client";

export default function EditJobPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    // 基本情報
    title: "",
    category: "",
    description: "",
    responsibilities: [] as string[],
    requirements: [] as string[],

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
    benefits: [] as string[],

    // 選考フロー
    selectionSteps: [
      { title: "書類選考", duration: "3日以内", description: "" },
      { title: "オンライン面談", duration: "1週間以内", description: "" },
    ] as { title: string; duration: string; description: string }[],

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [jobStats, setJobStats] = useState({
    views: 0,
    applications: 0,
    interviews: 0,
  })
  const router = useRouter();

  // 既存の求人データを読み込み
  useEffect(() => {
    if (!id || Array.isArray(id)) {
      console.error("Invalid job id:", id);
      return;
    }
    const jobId = id;
    const fetchJob = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
         title,
         category,
         description,
         responsibilities,
         requirements,
         location,
         salary,
         salary_type,
         work_days,
         work_hours,
         duration,
         start_date,
         remote,
         remote_details,
         frequency,
         benefits,
         selection_steps,
         mentor_name,
         mentor_role,
         mentor_experience,
         mentor_message,
         status,
         publish_date,
         tags,
         created_at,
         updated_at,
         search_vector
         `)
        .eq('id', jobId)
        .single();
      if (error) {
        console.error('Error fetching job:', error);
      } else if (data) {
        setFormData({
          title: data.title,
          category: data.category,
          description: data.description,
          responsibilities: data.responsibilities || [],
          requirements: data.requirements || [],
          location: data.location ?? "",
          salary: data.salary != null ? String(data.salary) : "",
          salaryType: data.salary_type ?? formData.salaryType,
          workDays: data.work_days || [],
          workHours: data.work_hours ?? "",
          duration: data.duration ?? "",
          startDate: data.start_date ?? "",
          remote: data.remote ?? false,
          remoteDetails: data.remote_details ?? "",
          frequency: data.frequency ?? "",
          benefits: data.benefits || [],
          selectionSteps: (Array.isArray(data.selection_steps)
            ? data.selection_steps.map((step) => ({
                title: String((step as any).title || ""),
                duration: String((step as any).duration || ""),
                description: String((step as any).description || ""),
              }))
            : []) as { title: string; duration: string; description: string }[],
          mentorName: data.mentor_name ?? "",
          mentorRole: data.mentor_role ?? "",
          mentorExperience: data.mentor_experience ?? "",
          mentorMessage: data.mentor_message ?? "",
          status: data.status ?? "draft",
          publishDate: data.publish_date ?? "",
          tags: data.tags || [],
        });
      }
    };
    fetchJob();
  }, [id]);

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

  type ArrayFieldKey =
    | 'responsibilities'
    | 'requirements'
    | 'benefits'
    | 'workDays'
    | 'selectionSteps';

  const handleArrayFieldAdd = (field: ArrayFieldKey) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...((prev[field] as any[]) || []), ""],
    }))
  }

  const handleArrayFieldRemove = (field: ArrayFieldKey, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ((prev[field] as any[]) || []).filter((_, i) => i !== index),
    }))
  }

  const handleArrayFieldChange = (field: ArrayFieldKey, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ((prev[field] as any[]) || []).map((item, i) =>
        i === index ? value : item
      ),
    }))
  }

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

  const handleSave = (status: string) => {
    // バリデーション
    const newErrors: { [key: string]: string } = {}
    if (!formData.title) newErrors.title = "職種名は必須です"
    if (!formData.category) newErrors.category = "カテゴリは必須です"
    if (!formData.description) newErrors.description = "業務内容は必須です"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 保存処理
    console.log("Updating job:", { ...formData, status })

    if (status === "published") {
      alert("求人を更新・公開しました！")
    } else {
      alert("変更を保存しました！")
    }
  }

  const handleDelete = () => {
    if (!id || Array.isArray(id)) {
      console.error("Invalid job id:", id);
      return;
    }
    const jobId = id;
    if (confirm("この求人を削除しますか？この操作は取り消せません。")) {
      console.log("Deleting job:", jobId)
      alert("求人を削除しました")
      // 求人一覧に戻る
    }
  }

  const handleArchive = () => {
    if (!id || Array.isArray(id)) {
      console.error("Invalid job id:", id);
      return;
    }
    const jobId = id;
    if (confirm("この求人をアーカイブしますか？")) {
      console.log("Archiving job:", jobId)
      alert("求人をアーカイブしました")
    }
  }

  const handlePreview = () => {
    // プレビュー画面を開く
    console.log("Opening preview:", formData)
  }

  const handleDuplicate = () => {
    // 複製して新規作成画面へ
    console.log("Duplicating job:", formData)
    alert("求人を複製しました。新規作成画面に移動します。")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/company/jobs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              求人一覧に戻る
            </Button>
            <div>
              <h1 className="text-2xl font-bold">求人編集</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              複製
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
              更新・公開
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
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
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
                    {formData.responsibilities &&
                      formData.responsibilities.map((item, index) => (
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
                    {formData.requirements &&
                      formData.requirements.map((item, index) => (
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
                        <Input
                          type="number"
                          value={formData.salary}
                          onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                          placeholder="1200"
                          className="flex-1"
                        />
                        <Select
                          value={formData.salaryType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, salaryType: value }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">時給</SelectItem>
                            <SelectItem value="daily">日給</SelectItem>
                            <SelectItem value="monthly">月給</SelectItem>
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
                            onCheckedChange={(state) => handleWorkDayChange(day.id, state === true)}
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
                        onCheckedChange={(state) =>
                          setFormData((prev) => ({ ...prev, remote: state === true }))
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
                    {formData.benefits &&
                      formData.benefits.map((item, index) => (
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
                  {formData.selectionSteps &&
                    formData.selectionSteps.map((step, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">ステップ {index + 1}</h4>
                          {formData.selectionSteps.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArrayFieldRemove("selectionSteps", index)}
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
                  <Button variant="outline" onClick={() => handleArrayFieldAdd("selectionSteps")}>
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
                      {formData.tags &&
                        formData.tags.map((tag) => (
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

                  {/* 危険な操作 */}
                  <div className="border-t pt-6 space-y-4">
                    <h4 className="font-semibold text-red-600">危険な操作</h4>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleArchive}
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        アーカイブ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      アーカイブした求人は非公開になりますが、データは保持されます。削除した求人は完全に削除され、復元できません。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 bg-white border-l">
          <div className="space-y-6">
            {/* 求人統計 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">求人統計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">閲覧数</span>
                  <span className="font-semibold">{jobStats.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">応募数</span>
                  <span className="font-semibold">{jobStats.applications}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">面談数</span>
                  <span className="font-semibold">{jobStats.interviews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">応募率</span>
                  <span className="font-semibold">{((jobStats.applications / jobStats.views) * 100).toFixed(1)}%</span>
                </div>
              </CardContent>
            </Card>

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
                <div className="flex items-center justify-between text-sm">
                  <span>メンター情報</span>
                  {formData.mentorName && formData.mentorRole ? (
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

            {/* 変更履歴 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">変更履歴</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>2024/06/01 14:30</span>
                  <span className="text-gray-600">給与を更新</span>
                </div>
                <div className="flex justify-between">
                  <span>2024/05/30 10:15</span>
                  <span className="text-gray-600">業務内容を追加</span>
                </div>
                <div className="flex justify-between">
                  <span>2024/05/28 16:45</span>
                  <span className="text-gray-600">求人を公開</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
