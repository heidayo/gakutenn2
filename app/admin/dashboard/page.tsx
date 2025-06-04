"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Activity,
  Server,
  Wifi,
  Shield,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "高負荷検出",
      message: "サーバー負荷が80%を超えています",
      time: "5分前",
      severity: "medium",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "新規企業登録",
      message: "株式会社テックイノベーションが登録申請",
      time: "15分前",
      severity: "low",
      read: false,
    },
    {
      id: 3,
      type: "error",
      title: "不正アクセス検出",
      message: "複数回のログイン失敗を検出",
      time: "1時間前",
      severity: "high",
      read: true,
    },
  ])

  // データ更新関数
  const handleRefresh = async () => {
    setIsLoading(true)
    // APIコール（モック）
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsLoading(false)
  }

  // アラート既読処理
  const markAlertAsRead = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  // アラート削除
  const dismissAlert = (alertId: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  // 自動更新
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 30000) // 30秒ごと

    return () => clearInterval(interval)
  }, [])

  // システム全体の統計
  const systemStats = {
    totalUsers: { value: 2847, change: 12.5, trend: "up" },
    totalCompanies: { value: 156, change: 8.3, trend: "up" },
    totalJobs: { value: 423, change: 15.2, trend: "up" },
    totalMatches: { value: 1234, change: 22.1, trend: "up" },
    activeUsers: { value: 1892, change: 5.7, trend: "up" },
    systemHealth: { value: 99.8, change: 0.1, trend: "up" },
  }

  // システムパフォーマンス
  const performance = {
    responseTime: 245, // ms
    errorRate: 0.02, // %
    uptime: 99.98, // %
    throughput: 1250, // requests/min
  }

  // 最近のアクティビティ
  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      description: "新規学生ユーザー登録: 田中太郎（東京大学）",
      time: "2分前",
      icon: Users,
    },
    {
      id: 2,
      type: "job_posted",
      description: "新規求人投稿: Webマーケティングアシスタント",
      time: "8分前",
      icon: Briefcase,
    },
    {
      id: 3,
      type: "company_approved",
      description: "企業承認: 株式会社スタートアップ",
      time: "12分前",
      icon: Building2,
    },
    {
      id: 4,
      type: "match_created",
      description: "マッチング成立: 佐藤花子 × SNS運用サポート",
      time: "18分前",
      icon: CheckCircle,
    },
  ]

  // システム状況
  const systemStatus = [
    { name: "Webサーバー", status: "正常", uptime: "99.9%", color: "green" },
    { name: "データベース", status: "正常", uptime: "99.8%", color: "green" },
    { name: "API", status: "正常", uptime: "99.9%", color: "green" },
    { name: "ファイルストレージ", status: "警告", uptime: "98.5%", color: "yellow" },
    { name: "メール配信", status: "正常", uptime: "99.7%", color: "green" },
    { name: "通知システム", status: "正常", uptime: "99.6%", color: "green" },
  ]

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "正常":
        return "bg-green-100 text-green-800"
      case "警告":
        return "bg-yellow-100 text-yellow-800"
      case "エラー":
        return "bg-red-100 text-red-800"
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
            <h1 className="text-2xl font-bold">システム管理ダッシュボード</h1>
            <p className="text-sm text-gray-600">
              プラットフォーム全体の監視・管理 • 最終更新: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "更新中..." : "更新"}
            </Button>
            <Link href="/admin/monitoring">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Activity className="h-4 w-4 mr-2" />
                詳細監視
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* システム全体統計 */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
                  <p className="text-2xl font-bold">{systemStats.totalUsers.value.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(systemStats.totalUsers.trend)}
                    <p className={`text-xs ${getTrendColor(systemStats.totalUsers.trend)}`}>
                      +{systemStats.totalUsers.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">登録企業数</p>
                  <p className="text-2xl font-bold">{systemStats.totalCompanies.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(systemStats.totalCompanies.trend)}
                    <p className={`text-xs ${getTrendColor(systemStats.totalCompanies.trend)}`}>
                      +{systemStats.totalCompanies.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">マッチング数</p>
                  <p className="text-2xl font-bold">{systemStats.totalMatches.value.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(systemStats.totalMatches.trend)}
                    <p className={`text-xs ${getTrendColor(systemStats.totalMatches.trend)}`}>
                      +{systemStats.totalMatches.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* システムパフォーマンス */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Server className="h-4 w-4 mr-2" />
                応答時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-2">{performance.responseTime}ms</div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">目標: 300ms以下</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                エラー率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">{performance.errorRate}%</div>
              <Progress value={2} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">目標: 1%以下</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                稼働率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">{performance.uptime}%</div>
              <Progress value={99.98} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">目標: 99.9%以上</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Wifi className="h-4 w-4 mr-2" />
                スループット
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-2">{performance.throughput}</div>
              <p className="text-xs text-gray-600">リクエスト/分</p>
              <Progress value={65} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* アラート・通知 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">アラート・通知</CardTitle>
                <Link href="/admin/alerts">
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts
                  .filter((alert) => !alert.read)
                  .slice(0, 3)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-3 ${getAlertColor(alert.severity)} cursor-pointer`}
                      onClick={() => markAlertAsRead(alert.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                            <p className="text-xs mt-1">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissAlert(alert.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                {alerts.filter((alert) => !alert.read).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">新しいアラートはありません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 最近のアクティビティ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">最近のアクティビティ</CardTitle>
                <Link href="/admin/activities">
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* システム状況 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">システム状況</CardTitle>
              <Link href="/admin/monitoring">
                <Button variant="ghost" size="sm">
                  詳細監視
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {systemStatus.map((system, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{system.name}</h4>
                    <Badge className={getStatusColor(system.status)}>{system.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">稼働率:</span>
                    <span className="font-semibold">{system.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* クイックアクション */}
        <div className="grid grid-cols-4 gap-4">
          <Link href="/admin/users">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-sm">ユーザー管理</h3>
                <p className="text-xs text-gray-600 mt-1">学生・企業の管理</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-sm">報告・通報</h3>
                <p className="text-xs text-gray-600 mt-1">問題の確認・対応</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/security">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm">セキュリティ</h3>
                <p className="text-xs text-gray-600 mt-1">セキュリティ監視</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm">分析・レポート</h3>
                <p className="text-xs text-gray-600 mt-1">データ分析・レポート</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
