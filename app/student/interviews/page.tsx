"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  Search,
  Bell,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  Star,
  Building2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

export default function StudentInterviewsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // 面談データ
  const [interviews, setInterviews] = useState<any[]>([])
  const fetchInterviews = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("interviews")
      .select(
        `
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
      company:companies(name),
      job:jobs!interviews_job_id_fkey(title)
    `
      )
    if (error) {
      console.error("Error fetching interviews:", error)
    } else if (data) {
      setInterviews(
        data.map((i) => ({
          id: i.id,
          company: i.company?.name,        // joined company name
          job: i.job?.title,               // joined job title
          date: new Date(i.date).toLocaleDateString("ja-JP"),
          time: `${i.start_time}-${i.end_time}`,
          type: i.type,
          status: i.status,
          interviewer: i.interviewer || "",
          meetingLink: i.meeting_link || undefined,
          location: i.location || undefined,
          notes: i.notes || undefined,
          feedback: i.evaluation || undefined,
          canReschedule: i.status !== "完了",
        }))
      )
    }
    setIsLoading(false)
  }

  // フィルタリング
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || interview.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // ステータス別統計
  const stats = {
    total: interviews.length,
    upcoming: interviews.filter((i) => i.status === "予定" || i.status === "確定").length,
    completed: interviews.filter((i) => i.status === "完了").length,
    cancelled: interviews.filter((i) => i.status === "キャンセル").length,
    today: interviews.filter((i) => i.date === "2024年6月5日").length,
  }

  // fetch on mount
  useEffect(() => {
    fetchInterviews()
  }, [])

  // auto-refresh lastUpdated timestamp (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    await fetchInterviews()
  }


  const handleCancel = (id: number) => {
    if (confirm("面談をキャンセルしますか？")) {
      setInterviews((prev) =>
        prev.map((interview) => (interview.id === id ? { ...interview, status: "キャンセル" } : interview)),
      )
    }
  }

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, "_blank")
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

  const isToday = (dateString: string) => {
    const today = new Date().toLocaleDateString("ja-JP")
    return dateString === today
  }

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return dateString === tomorrow.toLocaleDateString("ja-JP")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div>
              <span className="text-lg font-semibold">面談予定</span>
              <p className="text-xs text-gray-600">最終更新: {lastUpdated.toLocaleTimeString()}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 統計カード */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">{stats.upcoming}</div>
                <div className="text-xs text-gray-600">予定・確定</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-gray-600">完了</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 今日・明日の面談 */}
        {interviews.filter((i) => isToday(i.date) || isTomorrow(i.date)).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                直近の面談
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {interviews
                .filter((i) => isToday(i.date) || isTomorrow(i.date))
                .map((interview) => (
                  <div key={interview.id} className="border rounded-lg p-3 bg-orange-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{interview.companyLogo}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{interview.job}</h4>
                          <p className="text-sm text-gray-600">{interview.company}</p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span className="font-medium text-orange-600">
                              {isToday(interview.date) ? "今日" : "明日"}
                            </span>
                            <span>{interview.time}</span>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(interview.type)}
                              <span>{interview.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {interview.meetingLink && interview.status === "確定" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleJoinMeeting(interview.meetingLink!)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          参加
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="list" className="space-y-6">

          <TabsContent value="list" className="space-y-6">
            {/* 検索・フィルター */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="企業名、求人、面接官で検索..."
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
                </div>
              </CardContent>
            </Card>

            {/* 面談リスト */}
            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{interview.companyLogo}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{interview.job}</h3>
                            <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                            {isToday(interview.date) && <Badge className="bg-orange-100 text-orange-800">今日</Badge>}
                            {isTomorrow(interview.date) && (
                              <Badge className="bg-yellow-100 text-yellow-800">明日</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{interview.company}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center space-x-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>{interview.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{interview.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(interview.type)}
                              <span>{interview.type}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">面接官: {interview.interviewer}</p>

                          {interview.notes && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-gray-700">
                              <strong>メモ:</strong> {interview.notes}
                            </div>
                          )}

                          {interview.meetingLink && interview.status === "確定" && (
                            <div className="mt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleJoinMeeting(interview.meetingLink!)}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                面談に参加
                              </Button>
                              <p className="text-xs text-gray-500 mt-1">ミーティングID: {interview.meetingId}</p>
                            </div>
                          )}

                          {interview.location && (
                            <div className="mt-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4 inline mr-1" />
                              {interview.location}
                            </div>
                          )}

                          {interview.phone && (
                            <div className="mt-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4 inline mr-1" />
                              {interview.phone}
                            </div>
                          )}

                          {interview.feedback && (
                            <div className="mt-2 p-2 bg-green-50 rounded">
                              <div className="flex items-center space-x-2 mb-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-semibold">評価: {interview.rating}</span>
                              </div>
                              <p className="text-sm text-gray-700">{interview.feedback}</p>
                            </div>
                          )}

                          {interview.cancelReason && (
                            <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                              <strong>キャンセル理由:</strong> {interview.cancelReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {interview.status === "予定" || interview.status === "確定" ? (
                          <Link href={`/student/messages/${interview.id}`}>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              メッセージ
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>


      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/messages" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">メッセージ</span>
          </Link>
          <Link
            href="/student/interviews"
            className="flex flex-col items-center justify-center space-y-1 text-blue-600"
          >
            <Video className="h-5 w-5" />
            <span className="text-xs">面談</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
