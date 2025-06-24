"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Bell,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function CompanyInterviewsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedInterviews, setSelectedInterviews] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [applicants, setApplicants] = useState<{ id: string; name: string; job_id: string; user_id: string }[]>([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("");
  const params = useParams<{ companyId: string }>()
  const companyId = (params?.companyId ?? "") as string

  // 面談データ (Supabase から取得)
  interface Interview {
    id: number
    applicant: string
    applicantId: number
    job: string
    date: string
    time: string
    type: string
    status: string
    interviewer: string
    meetingLink?: string
    location?: string
    notes?: string
    evaluation?: string
    priority: string
  }

  const [interviews, setInterviews] = useState<Interview[]>([])

  // 面談一覧取得
  const fetchInterviews = async () => {
    const { data: interviewsData, error: interviewsError } = await supabase
      .from("interviews")
      .select(`
        id,
        date,
        start_time,
        end_time,
        type,
        status,
        interviewer,
        meeting_link,
        location,
        notes,
        evaluation,
        priority,
        applicant_id,
        job_id,
        jobs!interviews_job_id_fkey(title)
      `)
      .eq("company_id", companyId)
      .order("date");
    if (interviewsError) {
      console.error("interviews fetch error", interviewsError);
      return;
    }

    const applicantIds = (interviewsData ?? []).map((row: any) => row.applicant_id);
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", applicantIds);
    if (profilesError) {
      console.error("profiles fetch error", profilesError);
    }

    setInterviews(
      (interviewsData ?? []).map((row: any) => {
        const profile = profilesData?.find((p: any) => p.user_id === row.applicant_id);
        return {
          id: row.id,
          applicant: profile?.full_name ?? "未設定",
          applicantId: row.applicant_id,
          job: row.jobs?.title ?? "",
          date: new Date(row.date).toLocaleDateString("ja-JP"),
          time:
            row.start_time && row.end_time
              ? `${row.start_time}-${row.end_time}`
              : "",
          type: row.type,
          status: row.status,
          interviewer: row.interviewer ?? "-",
          meetingLink: row.meeting_link ?? undefined,
          location: row.location ?? undefined,
          notes: row.notes ?? undefined,
          evaluation: row.evaluation ?? undefined,
          priority: row.priority ?? "中",
        };
      })
    );
  };

  // データ取得（companyIdが取得できてから実行、companyIdでフィルタ）
  useEffect(() => {
    if (!companyId) return;
    fetchInterviews();
  }, [companyId]);

  // 応募者データ取得
  useEffect(() => {
    if (!companyId) return;
    const fetchApplicants = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id, name, job_id, user_id")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("applications fetch error", error);
        return;
      }
      const formatted = (data ?? []).map((item) => ({
        id:     item.id,
        name:   item.name   ?? "未設定",
        job_id: item.job_id,
        user_id: item.user_id,
      }));
      setApplicants(formatted);
    };
    fetchApplicants();
  }, [companyId]);

  // 面談枠設定
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, day: "月曜日", times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    { id: 2, day: "火曜日", times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    { id: 3, day: "水曜日", times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    { id: 4, day: "木曜日", times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
    { id: 5, day: "金曜日", times: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"] },
  ])

  // 面談作成ダイアログ用 state とハンドラ
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [newTime, setNewTime] = useState<string>("09:00");
  const [newType, setNewType] = useState<string>("オンライン");
  const [newNotes, setNewNotes] = useState("");
  const handleCreateInterview = async () => {
    setIsLoading(true);
    const applicant = applicants.find(a => a.id === selectedApplicantId);
    if (!applicant) {
      alert("応募者を選択してください");
      setIsLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("interviews")
      .insert([{
        company_id:   companyId,
        applicant_id: applicant.user_id,
        job_id:       applicant.job_id,
        date:         newDate,
        start_time:   newTime,
        end_time:     newTime,
        type:         newType,
        notes:        newNotes,
        status:       "予定",
      }]);
    if (error) {
      console.error("面談作成エラー", error);
      alert("面談作成失敗: " + error.message);
    } else {
      alert("面談が作成されました");
      await fetchInterviews();
      setShowCreateDialog(false);
    }
    setIsLoading(false);
  };

  // リマインド設定
  const [reminderSettings, setReminderSettings] = useState({
    email: true,
    push: true,
    sms: false,
    timings: ["1日前", "1時間前", "15分前"],
  })

  // フィルタリング
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || interview.status === statusFilter
    const matchesType = typeFilter === "all" || interview.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // ステータス別統計
  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === "予定" || i.status === "確定").length,
    completed: interviews.filter((i) => i.status === "完了").length,
    cancelled: interviews.filter((i) => i.status === "キャンセル").length,
    today: interviews.filter((i) => i.date === new Date().toLocaleDateString("ja-JP")).length,
  }

  // 自動更新
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  const handleStatusChange = (id: number, newStatus: string) => {
    setInterviews((prev) =>
      prev.map((interview) => (interview.id === id ? { ...interview, status: newStatus } : interview)),
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for interviews:`, selectedInterviews)
    setSelectedInterviews([])
  }

  const handleSendReminder = (id: number) => {
    console.log(`Sending reminder for interview ${id}`)
    alert("リマインダーを送信しました！")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "予定":
        return "bg-blue-100 text-blue-800"
      case "確定":
        return "bg-green-100 text-green-800"
      case "完了":
        return "bg-gray-100 text-gray-800"
      case "キャンセル":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "オンライン":
        return <Video className="h-4 w-4" />
      case "対面":
        return <MapPin className="h-4 w-4" />
      case "電話":
        return <Phone className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "高":
        return "text-red-600"
      case "中":
        return "text-yellow-600"
      case "低":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">面談管理</h1>
            <p className="text-sm text-gray-600">
              面談の予約・管理・リマインド | 最終更新: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              更新
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  面談を作成
                </Button>
              </DialogTrigger>
            </Dialog>
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  設定
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* 統計カード */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総面談数</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">予定・確定</p>
                  <p className="text-2xl font-bold text-green-600">{stats.scheduled}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">完了</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                </div>
                <Eye className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">キャンセル</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">今日の面談</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.today}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">面談一覧</TabsTrigger>
            <TabsTrigger value="calendar">カレンダー</TabsTrigger>
            <TabsTrigger value="schedule">面談枠設定</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
          </TabsList>

          {/* 面談一覧 */}
          <TabsContent value="list" className="space-y-6">
            {/* 検索・フィルター */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="応募者名、求人、面接官で検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="ステータス" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全てのステータス</SelectItem>
                      <SelectItem value="予定">予定</SelectItem>
                      <SelectItem value="確定">確定</SelectItem>
                      <SelectItem value="完了">完了</SelectItem>
                      <SelectItem value="キャンセル">キャンセル</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="面談形式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全ての形式</SelectItem>
                      <SelectItem value="オンライン">オンライン</SelectItem>
                      <SelectItem value="対面">対面</SelectItem>
                      <SelectItem value="電話">電話</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedInterviews.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{selectedInterviews.length}件選択中</span>
                      <Button size="sm" onClick={() => handleBulkAction("reminder")}>
                        <Bell className="h-4 w-4 mr-1" />
                        一括リマインド
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction("cancel")}>
                        <XCircle className="h-4 w-4 mr-1" />
                        一括キャンセル
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 面談リスト */}
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredInterviews.map((interview) => (
                    <div key={interview.id} className="border-b last:border-b-0 p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={selectedInterviews.includes(interview.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedInterviews([...selectedInterviews, interview.id])
                              } else {
                                setSelectedInterviews(selectedInterviews.filter((id) => id !== interview.id))
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{interview.applicant}</h3>
                              <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                              <div className="flex items-center space-x-1 text-gray-500">
                                {getTypeIcon(interview.type)}
                                <span className="text-sm">{interview.type}</span>
                              </div>
                              <div className={`text-sm font-medium ${getPriorityColor(interview.priority)}`}>
                                優先度: {interview.priority}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{interview.job}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{interview.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{interview.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4" />
                                <span>{interview.interviewer}</span>
                              </div>
                            </div>
                            {interview.notes && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">{interview.notes}</p>
                            )}
                            {interview.meetingLink && (
                              <div className="mt-2">
                                <a
                                  href={interview.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline"
                                >
                                  面談リンク: {interview.meetingLink}
                                </a>
                              </div>
                            )}
                            {interview.location && (
                              <div className="mt-2 text-sm text-gray-600">場所: {interview.location}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {interview.status === "予定" || interview.status === "確定" ? (
                            <>
                              <Button size="sm" onClick={() => handleSendReminder(interview.id)}>
                                <Bell className="h-4 w-4 mr-1" />
                                リマインド
                              </Button>
                              <Select onValueChange={(value) => handleStatusChange(interview.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="ステータス変更" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="確定">確定</SelectItem>
                                  <SelectItem value="完了">完了</SelectItem>
                                  <SelectItem value="キャンセル">キャンセル</SelectItem>
                                </SelectContent>
                              </Select>
                            </>
                          ) : interview.status === "完了" ? (
                            <div className="flex items-center space-x-2">
                              {interview.evaluation && <Badge variant="outline">評価: {interview.evaluation}</Badge>}
                              <Link href={companyId ? `/company/${companyId}/applications/${interview.applicantId}` : "#"}>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  詳細
                                </Button>
                              </Link>
                            </div>
                          ) : null}
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* カレンダー表示 */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>面談カレンダー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedDate?.toLocaleDateString("ja-JP")} の面談</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {interviews
                        .filter((interview) => interview.date === selectedDate?.toLocaleDateString("ja-JP"))
                        .map((interview) => (
                          <div key={interview.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{interview.applicant}</h4>
                              <Badge className={`${getStatusColor(interview.status)} text-xs`}>
                                {interview.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{interview.job}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{interview.time}</span>
                              {getTypeIcon(interview.type)}
                              <span>{interview.type}</span>
                            </div>
                          </div>
                        ))}
                      {interviews.filter((interview) => interview.date === selectedDate?.toLocaleDateString("ja-JP"))
                        .length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">この日の面談はありません</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 面談枠設定 */}
          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>面談可能時間の設定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{slot.day}</h4>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          編集
                        </Button>
                      </div>
                      <div className="grid grid-cols-6 gap-2">
                        {slot.times.map((time) => (
                          <Badge key={time} variant="outline" className="justify-center">
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 分析 */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>面談実施状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">今月の面談数</span>
                      <span className="font-semibold">24件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">平均面談時間</span>
                      <span className="font-semibold">52分</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">キャンセル率</span>
                      <span className="font-semibold">8.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">面談後採用率</span>
                      <span className="font-semibold">65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>面談形式別統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">オンライン</span>
                      </div>
                      <span className="font-semibold">15件 (62.5%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">対面</span>
                      </div>
                      <span className="font-semibold">7件 (29.2%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">電話</span>
                      </div>
                      <span className="font-semibold">2件 (8.3%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 面談作成ダイアログ */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新しい面談を作成</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>応募者</Label>
                <Select value={selectedApplicantId} onValueChange={setSelectedApplicantId}>
                  <SelectTrigger>
                    <SelectValue placeholder="応募者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicants.map((app) => (
                      <SelectItem key={app.id} value={app.id}>{app.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>面談日</Label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>時間</Label>
                <Select value={newTime} onValueChange={setNewTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="時間を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00-10:00</SelectItem>
                    <SelectItem value="10:00">10:00-11:00</SelectItem>
                    <SelectItem value="11:00">11:00-12:00</SelectItem>
                    <SelectItem value="14:00">14:00-15:00</SelectItem>
                    <SelectItem value="15:00">15:00-16:00</SelectItem>
                    <SelectItem value="16:00">16:00-17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>面談形式</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger>
                  <SelectValue placeholder="面談形式を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">オンライン</SelectItem>
                  <SelectItem value="offline">対面</SelectItem>
                  <SelectItem value="phone">電話</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>メモ（任意）</Label>
              <Textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="面談に関するメモや準備事項を入力..."
              />
            </div>
            <div className="space-y-2">
              <Label>リマインダー設定</Label>
              <div className="flex flex-wrap gap-2">
                {["1週間前", "1日前", "1時間前", "15分前"].map((timing) => (
                  <div key={timing} className="flex items-center space-x-2">
                    <Checkbox id={timing} />
                    <Label htmlFor={timing} className="text-sm">
                      {timing}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="flex-1"
              >
                キャンセル
              </Button> <Button
                onClick={handleCreateInterview}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                面談を作成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* リマインダー設定ダイアログ */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>リマインダー設定</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>通知方法</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={reminderSettings.email}
                    onCheckedChange={(checked) =>
                      setReminderSettings((prev) => ({ ...prev, email: checked as boolean }))
                    }
                  />
                  <Label htmlFor="email">メール通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push"
                    checked={reminderSettings.push}
                    onCheckedChange={(checked) =>
                      setReminderSettings((prev) => ({ ...prev, push: checked as boolean }))
                    }
                  />
                  <Label htmlFor="push">プッシュ通知</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={reminderSettings.sms}
                    onCheckedChange={(checked) => setReminderSettings((prev) => ({ ...prev, sms: checked as boolean }))}
                  />
                  <Label htmlFor="sms">SMS通知</Label>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label>通知タイミング</Label>
              <div className="space-y-2">
                {["1週間前", "1日前", "1時間前", "15分前"].map((timing) => (
                  <div key={timing} className="flex items-center space-x-2">
                    <Checkbox
                      id={`timing-${timing}`}
                      checked={reminderSettings.timings.includes(timing)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setReminderSettings((prev) => ({
                            ...prev,
                            timings: [...prev.timings, timing],
                          }))
                        } else {
                          setReminderSettings((prev) => ({
                            ...prev,
                            timings: prev.timings.filter((t) => t !== timing),
                          }))
                        }
                      }}
                    />
                    <Label htmlFor={`timing-${timing}`}>{timing}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowSettingsDialog(false)} className="flex-1">
                キャンセル
              </Button>
              <Button onClick={() => setShowSettingsDialog(false)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                設定を保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
