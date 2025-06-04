"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Star,
  Target,
  Clock,
  BarChart3,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function CompanyDashboard() {
  // KPI データ
  const kpis = {
    totalJobs: { value: 12, change: 20, trend: "up" },
    activeJobs: { value: 8, change: 14.3, trend: "up" },
    totalApplications: { value: 156, change: 32.8, trend: "up" },
    totalInterviews: { value: 45, change: 27.8, trend: "up" },
    totalHires: { value: 18, change: 60.0, trend: "up" },
    responseRate: { value: 78, change: -5.2, trend: "down" },
  }

  // 最近の応募者
  const recentApplications = [
    {
      id: 1,
      name: "田中 太郎",
      job: "Webマーケティングアシスタント",
      appliedDate: "2024年6月1日",
      status: "書類選考中",
      rating: 4.3,
      university: "東京大学",
    },
    {
      id: 2,
      name: "佐藤 花子",
      job: "SNS運用サポート",
      appliedDate: "2024年5月30日",
      status: "面談予定",
      rating: 4.6,
      university: "早稲田大学",
    },
    {
      id: 3,
      name: "山田 次郎",
      job: "データ分析補助",
      appliedDate: "2024年5月28日",
      status: "合格",
      rating: 4.8,
      university: "慶應義塾大学",
    },
  ]

  // 面談予定
  const upcomingInterviews = [
    {
      id: 1,
      applicant: "田中 太郎",
      job: "Webマーケティングアシスタント",
      date: "2024年6月5日",
      time: "14:00",
      type: "オンライン",
    },
    {
      id: 2,
      applicant: "佐藤 花子",
      job: "SNS運用サポート",
      date: "2024年6月6日",
      time: "16:00",
      type: "対面",
    },
  ]

  // 求人パフォーマンス
  const jobPerformance = [
    {
      id: 1,
      title: "Webマーケティングアシスタント",
      applications: 23,
      views: 245,
      conversionRate: 9.4,
      status: "公開中",
    },
    {
      id: 2,
      title: "SNS運用サポート",
      applications: 18,
      views: 189,
      conversionRate: 9.5,
      status: "公開中",
    },
    {
      id: 3,
      title: "データ分析補助",
      applications: 0,
      views: 0,
      conversionRate: 0,
      status: "下書き",
    },
  ]

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "書類選考中":
        return "bg-yellow-100 text-yellow-800"
      case "面談予定":
        return "bg-blue-100 text-blue-800"
      case "合格":
        return "bg-green-100 text-green-800"
      case "公開中":
        return "bg-green-100 text-green-800"
      case "下書き":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <p className="text-sm text-gray-600">採用活動の概要と最新情報</p>
          </div>
          <div className="flex items-center space-x-3">
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
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総求人数</p>
                  <p className="text-2xl font-bold">{kpis.totalJobs.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalJobs.trend, kpis.totalJobs.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalJobs.trend)}`}>
                      {kpis.totalJobs.change > 0 ? "+" : ""}
                      {kpis.totalJobs.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総応募者数</p>
                  <p className="text-2xl font-bold">{kpis.totalApplications.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalApplications.trend, kpis.totalApplications.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalApplications.trend)}`}>
                      +{kpis.totalApplications.change}% (30日)
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
                  <p className="text-sm font-medium text-gray-600">採用成功数</p>
                  <p className="text-2xl font-bold">{kpis.totalHires.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalHires.trend, kpis.totalHires.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalHires.trend)}`}>
                      +{kpis.totalHires.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">面談実施数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">{kpis.totalInterviews.value}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(kpis.totalInterviews.trend, kpis.totalInterviews.change)}
                <p className={`text-xs ${getTrendColor(kpis.totalInterviews.trend)}`}>
                  +{kpis.totalInterviews.change}% (30日)
                </p>
              </div>
              <Progress value={65} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">応答率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">{kpis.responseRate.value}%</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(kpis.responseRate.trend, kpis.responseRate.change)}
                <p className={`text-xs ${getTrendColor(kpis.responseRate.trend)}`}>
                  {kpis.responseRate.change}% (30日)
                </p>
              </div>
              <Progress value={kpis.responseRate.value} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">公開中求人</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-2">{kpis.activeJobs.value}</div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(kpis.activeJobs.trend, kpis.activeJobs.change)}
                <p className={`text-xs ${getTrendColor(kpis.activeJobs.trend)}`}>+{kpis.activeJobs.change}% (30日)</p>
              </div>
              <Progress value={67} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">最新の応募者</CardTitle>
                <Link href="/company/applications">
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{application.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{application.name}</h4>
                        <p className="text-xs text-gray-600">{application.university}</p>
                        <p className="text-xs text-gray-500">{application.job}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(application.status)} size="sm">
                        {application.status}
                      </Badge>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold">{application.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">面談予定</CardTitle>
                <Link href="/company/interviews">
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{interview.applicant}</h4>
                        <p className="text-xs text-gray-600">{interview.job}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{interview.time}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {interview.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                {upcomingInterviews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">予定されている面談はありません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">求人パフォーマンス</CardTitle>
              <Link href="/company/jobs">
                <Button variant="ghost" size="sm">
                  求人管理
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobPerformance.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">閲覧数: </span>
                        <span className="font-semibold">{job.views}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">応募数: </span>
                        <span className="font-semibold">{job.applications}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">応募率: </span>
                        <span className="font-semibold">{job.conversionRate}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/company/jobs/${job.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            詳細
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <Link href="/company/jobs/create">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">新規求人作成</h3>
                <p className="text-xs text-gray-600 mt-1">新しい求人を作成</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/company/applications">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm">応募者管理</h3>
                <p className="text-xs text-gray-600 mt-1">応募者を確認・管理</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/company/messages">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm">メッセージ</h3>
                <p className="text-xs text-gray-600 mt-1">学生とのやり取り</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/company/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm">分析レポート</h3>
                <p className="text-xs text-gray-600 mt-1">採用データを分析</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
