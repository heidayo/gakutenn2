"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  Archive,
  Download,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  JapaneseYenIcon as Yen,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JobsPage() {
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("created_desc")

  // 統計データ
  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 156,
    totalInterviews: 45,
    totalHires: 18,
    averageApplications: 13,
    conversionRate: 11.5,
    responseRate: 78,
  }

  // 期間別統計（過去30日）
  const periodStats = {
    applications: { current: 89, previous: 67, change: 32.8 },
    interviews: { current: 23, previous: 18, change: 27.8 },
    hires: { current: 8, previous: 5, change: 60.0 },
    views: { current: 1240, previous: 980, change: 26.5 },
  }

  // 求人データ
  const jobs = [
    {
      id: 1,
      title: "Webマーケティングアシスタント",
      category: "マーケティング",
      status: "published",
      statusLabel: "公開中",
      statusColor: "bg-green-100 text-green-800",
      createdDate: "2024年5月28日",
      publishedDate: "2024年5月30日",
      expiryDate: "2024年7月30日",
      location: "東京都渋谷区",
      salary: "時給1,200円",
      workType: "週1回〜",
      applications: 23,
      views: 245,
      interviews: 8,
      hires: 3,
      conversionRate: 13.0,
      tags: ["未経験歓迎", "週1OK", "リモート可"],
      isUrgent: false,
    },
    {
      id: 2,
      title: "SNS運用サポート",
      category: "クリエイティブ",
      status: "published",
      statusLabel: "公開中",
      statusColor: "bg-green-100 text-green-800",
      createdDate: "2024年5月25日",
      publishedDate: "2024年5月26日",
      expiryDate: "2024年7月26日",
      location: "大阪府大阪市",
      salary: "日給8,000円",
      workType: "単発OK",
      applications: 18,
      views: 189,
      interviews: 6,
      hires: 2,
      conversionRate: 11.1,
      tags: ["単発OK", "土日可", "交通費支給"],
      isUrgent: true,
    },
    {
      id: 3,
      title: "データ分析補助",
      category: "データ分析",
      status: "draft",
      statusLabel: "下書き",
      statusColor: "bg-gray-100 text-gray-800",
      createdDate: "2024年6月1日",
      publishedDate: "",
      expiryDate: "",
      location: "リモート",
      salary: "時給1,000円",
      workType: "週2回〜",
      applications: 0,
      views: 0,
      interviews: 0,
      hires: 0,
      conversionRate: 0,
      tags: ["リモート", "未経験歓迎", "平日のみ"],
      isUrgent: false,
    },
    {
      id: 4,
      title: "コンテンツ制作アシスタント",
      category: "クリエイティブ",
      status: "paused",
      statusLabel: "一時停止",
      statusColor: "bg-yellow-100 text-yellow-800",
      createdDate: "2024年5月20日",
      publishedDate: "2024年5月22日",
      expiryDate: "2024年7月22日",
      location: "東京都新宿区",
      salary: "時給1,100円",
      workType: "週1回〜",
      applications: 15,
      views: 156,
      interviews: 4,
      hires: 1,
      conversionRate: 6.7,
      tags: ["週1OK", "学生歓迎", "交通費支給"],
      isUrgent: false,
    },
    {
      id: 5,
      title: "営業アシスタント",
      category: "営業",
      status: "expired",
      statusLabel: "期限切れ",
      statusColor: "bg-red-100 text-red-800",
      createdDate: "2024年4月15日",
      publishedDate: "2024年4月16日",
      expiryDate: "2024年5月16日",
      location: "東京都港区",
      salary: "時給1,300円",
      workType: "週2回〜",
      applications: 31,
      views: 298,
      interviews: 12,
      hires: 4,
      conversionRate: 12.9,
      tags: ["高時給", "週2OK", "交通費支給"],
      isUrgent: false,
    },
  ]

  const handleSelectJob = (jobId: number) => {
    setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(jobs.map((job) => job.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for jobs:`, selectedJobs)
    alert(`${action}を実行しました`)
    setSelectedJobs([])
    setShowBulkActions(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "draft":
        return <Edit className="h-4 w-4 text-gray-600" />
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getChangeColor = (change: number) => {
    return change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
  }

  const filteredJobs = jobs.filter((job) => {
    if (filterStatus === "all") return true
    return job.status === filterStatus
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "created_desc":
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      case "created_asc":
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      case "applications_desc":
        return b.applications - a.applications
      case "applications_asc":
        return a.applications - b.applications
      case "title_asc":
        return a.title.localeCompare(b.title)
      case "title_desc":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">求人管理</h1>
            <p className="text-sm text-gray-600">求人の作成・編集・統計を管理できます</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              レポート出力
            </Button>
            <Link href="/company/jobs/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新規求人作成
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総求人数</p>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                  <p className="text-xs text-gray-500">公開中: {stats.activeJobs}件</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総応募者数</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-3 w-3 ${getChangeColor(periodStats.applications.change)}`} />
                    <p className={`text-xs ${getChangeColor(periodStats.applications.change)}`}>
                      +{periodStats.applications.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">面談実施数</p>
                  <p className="text-2xl font-bold">{stats.totalInterviews}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-3 w-3 ${getChangeColor(periodStats.interviews.change)}`} />
                    <p className={`text-xs ${getChangeColor(periodStats.interviews.change)}`}>
                      +{periodStats.interviews.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">採用成功数</p>
                  <p className="text-2xl font-bold">{stats.totalHires}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`h-3 w-3 ${getChangeColor(periodStats.hires.change)}`} />
                    <p className={`text-xs ${getChangeColor(periodStats.hires.change)}`}>
                      +{periodStats.hires.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">平均応募数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">{stats.averageApplications}</div>
              <p className="text-sm text-gray-600">求人あたりの平均応募者数</p>
              <Progress value={65} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">採用成功率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">{stats.conversionRate}%</div>
              <p className="text-sm text-gray-600">応募者から採用への転換率</p>
              <Progress value={stats.conversionRate} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">応答率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">{stats.responseRate}%</div>
              <p className="text-sm text-gray-600">メッセージへの応答率</p>
              <Progress value={stats.responseRate} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="求人名、カテゴリで検索..." className="pl-10 w-80" />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="published">公開中</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="paused">一時停止</SelectItem>
                    <SelectItem value="expired">期限切れ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="並び順" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_desc">作成日（新しい順）</SelectItem>
                    <SelectItem value="created_asc">作成日（古い順）</SelectItem>
                    <SelectItem value="applications_desc">応募数（多い順）</SelectItem>
                    <SelectItem value="applications_asc">応募数（少ない順）</SelectItem>
                    <SelectItem value="title_asc">タイトル（A-Z）</SelectItem>
                    <SelectItem value="title_desc">タイトル（Z-A）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  詳細フィルター
                </Button>
                {selectedJobs.length > 0 && (
                  <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        一括操作 ({selectedJobs.length})
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>求人一覧 ({sortedJobs.length}件)</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox checked={selectedJobs.length === jobs.length} onCheckedChange={handleSelectAll} />
                <span className="text-sm text-gray-600">すべて選択</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedJobs.map((job) => (
                <div
                  key={job.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedJobs.includes(job.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={() => handleSelectJob(job.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.isUrgent && <Badge className="bg-red-500 text-white text-xs px-2 py-1">急募</Badge>}
                          <Badge className={job.statusColor}>
                            {getStatusIcon(job.status)}
                            <span className="ml-1">{job.statusLabel}</span>
                          </Badge>
                          <Badge variant="outline">{job.category}</Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Yen className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{job.workType}</span>
                          </div>
                          <div className="text-sm text-gray-600">作成日: {job.createdDate}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{job.views}</div>
                            <div className="text-xs text-gray-600">閲覧数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{job.applications}</div>
                            <div className="text-xs text-gray-600">応募数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{job.interviews}</div>
                            <div className="text-xs text-gray-600">面談数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-orange-600">{job.hires}</div>
                            <div className="text-xs text-gray-600">採用数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-600">{job.conversionRate}%</div>
                            <div className="text-xs text-gray-600">成功率</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link href={`/company/jobs/${job.id}/preview`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          プレビュー
                        </Button>
                      </Link>
                      <Link href={`/company/jobs/${job.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          編集
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>一括操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{selectedJobs.length}件の求人が選択されています</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("公開")}>
                <Play className="h-4 w-4 mr-2" />
                公開する
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("一時停止")}>
                <Pause className="h-4 w-4 mr-2" />
                一時停止する
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("複製")}>
                <Copy className="h-4 w-4 mr-2" />
                複製する
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => handleBulkAction("アーカイブ")}>
                <Archive className="h-4 w-4 mr-2" />
                アーカイブする
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleBulkAction("削除")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除する
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
