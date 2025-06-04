"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarIcon,
  Clock,
  Video,
  Phone,
  MapPin,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminInterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // 面談統計データ
  const [stats, setStats] = useState({
    totalInterviews: { value: 156, change: 23.5, trend: "up" },
    scheduledInterviews: { value: 45, change: 12.8, trend: "up" },
    completedInterviews: { value: 89, change: 18.2, trend: "up" },
    cancelledInterviews: { value: 22, change: -15.3, trend: "down" },
    averageDuration: { value: 52, change: 5.2, trend: "up" },
    noShowRate: { value: 8.5, change: -2.1, trend: "down" },
  })

  // 面談データ
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      student: "田中 太郎",
      studentId: 1,
      company: "株式会社テックスタート",
      companyId: 1,
      job: "Webマーケティングアシスタント",
      date: "2024年6月5日",
      time: "14:00-15:00",
      type: "オンライン",
      status: "確定",
      interviewer: "佐藤マネージャー",
      duration: 60,
      rating: null,
      feedback: null,
      noShow: false,
    },
    {
      id: 2,
      student: "佐藤 花子",
      studentId: 2,
      company: "イノベーション株式会社",
      companyId: 2,
      job: "データ分析補助",
      date: "2024年6月6日",
      time: "16:00-17:00",
      type: "対面",
      status: "予定",
      interviewer: "田中部長",
      duration: 60,
      rating: null,
      feedback: null,
      noShow: false,
    },
    {
      id: 3,
      student: "山田 次郎",
      studentId: 3,
      company: "クリエイティブ合同会社",
      companyId: 3,
      job: "SNS運用サポート",
      date: "2024年6月3日",
      time: "10:00-11:00",
      type: "オンライン",
      status: "完了",
      interviewer: "鈴木リーダー",
      duration: 55,
      rating: 4.8,
      feedback: "とても良い印象でした",
      noShow: false,
    },
    {
      id: 4,
      student: "鈴木 美咲",
      studentId: 4,
      company: "マーケティングプロ",
      companyId: 4,
      job: "市場調査アシスタント",
      date: "2024年6月4日",
      time: "13:00-14:00",
      type: "電話",
      status: "キャンセル",
      interviewer: "高橋マネージャー",
      duration: 0,
      rating: null,
      feedback: null,
      noShow: false,
    },
    {
      id: 5,
      student: "伊藤 健太",
      studentId: 5,
      company: "株式会社テックスタート",
      companyId: 1,
      job: "カスタマーサポート",
      date: "2024年6月2日",
      time: "15:00-16:00",
      type: "オンライン",
      status: "完了",
      interviewer: "佐藤マネージャー",
      duration: 45,
      rating: 3.2,
      feedback: "基本的なスキルは十分",
      noShow: true,
    },
  ])

  // フィルタリング
  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch =
      interview.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.job.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || interview.status === statusFilter
    const matchesType = typeFilter === "all" || interview.type === typeFilter

    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = interview.date === "2024年6月5日"
    } else if (dateFilter === "week") {
      // 今週の面談（簡略化）
      matchesDate = true
    } else if (dateFilter === "month") {
      // 今月の面談（簡略化）
      matchesDate = true
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

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

  const handleExport = () => {
    console.log("Exporting interview data...")
    alert("面談データをエクスポートしました！")
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

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">面談管理（管理者）</h1>
            <p className="text-sm text-gray-600">
              システム全体の面談状況監視・管理 | 最終更新: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              更新
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* 統計カード */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">総面談数</p>
                  <p className="text-2xl font-bold">{stats.totalInterviews.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.totalInterviews.trend)}
                    <p className={`text-xs ${getTrendColor(stats.totalInterviews.trend)}`}>
                      {stats.totalInterviews.change > 0 ? "+" : ""}
                      {stats.totalInterviews.change}%
                    </p>
                  </div>
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
                  <p className="text-2xl font-bold text-green-600">{stats.scheduledInterviews.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.scheduledInterviews.trend)}
                    <p className={`text-xs ${getTrendColor(stats.scheduledInterviews.trend)}`}>
                      +{stats.scheduledInterviews.change}%
                    </p>
                  </div>
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
                  <p className="text-2xl font-bold text-gray-600">{stats.completedInterviews.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.completedInterviews.trend)}
                    <p className={`text-xs ${getTrendColor(stats.completedInterviews.trend)}`}>
                      +{stats.completedInterviews.change}%
                    </p>
                  </div>
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
                  <p className="text-2xl font-bold text-red-600">{stats.cancelledInterviews.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.cancelledInterviews.trend)}
                    <p className={`text-xs ${getTrendColor(stats.cancelledInterviews.trend)}`}>
                      {stats.cancelledInterviews.change}%
                    </p>
                  </div>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">平均時間</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.averageDuration.value}分</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.averageDuration.trend)}
                    <p className={`text-xs ${getTrendColor(stats.averageDuration.trend)}`}>
                      +{stats.averageDuration.change}%
                    </p>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">無断欠席率</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.noShowRate.value}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(stats.noShowRate.trend)}
                    <p className={`text-xs ${getTrendColor(stats.noShowRate.trend)}`}>{stats.noShowRate.change}%</p>
                  </div>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">面談一覧</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
            <TabsTrigger value="reports">レポート</TabsTrigger>
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
                        placeholder="学生名、企業名、求人、面接官で検索..."
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
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="期間" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全期間</SelectItem>
                      <SelectItem value="today">今日</SelectItem>
                      <SelectItem value="week">今週</SelectItem>
                      <SelectItem value="month">今月</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{interview.student}</h3>
                            <span className="text-gray-400">→</span>
                            <span className="font-semibold text-blue-600">{interview.company}</span>
                            <Badge className={getStatusColor(interview.status)}>{interview.status}</Badge>
                            {interview.noShow && <Badge className="bg-orange-100 text-orange-800">無断欠席</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{interview.job}</p>
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
                              {getTypeIcon(interview.type)}
                              <span>{interview.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{interview.interviewer}</span>
                            </div>
                            {interview.duration > 0 && (
                              <div className="flex items-center space-x-1">
                                <span>実施時間: {interview.duration}分</span>
                              </div>
                            )}
                          </div>
                          {interview.rating && (
                            <div className="mt-2 flex items-center space-x-2">
                              <span className="text-sm text-gray-600">評価:</span>
                              <Badge variant="outline">★ {interview.rating}</Badge>
                              {interview.feedback && (
                                <span className="text-sm text-gray-600">"{interview.feedback}"</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/admin/users/${interview.studentId}`}>
                            <Button size="sm" variant="outline">
                              <Users className="h-4 w-4 mr-1" />
                              学生
                            </Button>
                          </Link>
                          <Link href={`/admin/companies/${interview.companyId}`}>
                            <Button size="sm" variant="outline">
                              <Building2 className="h-4 w-4 mr-1" />
                              企業
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            詳細
                          </Button>
                        </div>
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
                  <CardTitle>面談形式別統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm">オンライン</span>
                      </div>
                      <span className="font-semibold">89件 (57.1%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">対面</span>
                      </div>
                      <span className="font-semibold">52件 (33.3%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">電話</span>
                      </div>
                      <span className="font-semibold">15件 (9.6%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>時間帯別面談数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">09:00-12:00</span>
                      <span className="font-semibold">34件 (21.8%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">13:00-15:00</span>
                      <span className="font-semibold">67件 (42.9%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">15:00-18:00</span>
                      <span className="font-semibold">55件 (35.3%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>月別面談実施状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">4月</span>
                      <span className="font-semibold">42件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">5月</span>
                      <span className="font-semibold">58件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">6月（予定含む）</span>
                      <span className="font-semibold">56件</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>企業別面談実施数（上位5社）</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">株式会社テックスタート</span>
                      <span className="font-semibold">23件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">イノベーション株式会社</span>
                      <span className="font-semibold">18件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">クリエイティブ合同会社</span>
                      <span className="font-semibold">15件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">マーケティングプロ</span>
                      <span className="font-semibold">12件</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">その他</span>
                      <span className="font-semibold">88件</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* レポート */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>面談効率性レポート</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">92.3%</div>
                      <div className="text-sm text-gray-600">面談実施率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">67.4%</div>
                      <div className="text-sm text-gray-600">面談後採用率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">4.2</div>
                      <div className="text-sm text-gray-600">平均評価</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">1.8日</div>
                      <div className="text-sm text-gray-600">平均調整期間</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>問題・改善点</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-red-800 mb-1">高い無断欠席率</h4>
                      <p className="text-sm text-red-700">
                        無断欠席率が8.5%と高めです。リマインダー機能の強化を検討してください。
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-yellow-800 mb-1">面談時間のばらつき</h4>
                      <p className="text-sm text-yellow-700">
                        面談時間が30分〜90分と大きくばらついています。標準化を検討してください。
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-sm text-green-800 mb-1">オンライン面談の普及</h4>
                      <p className="text-sm text-green-700">
                        オンライン面談の利用率が57.1%と高く、効率的な面談が実現できています。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
