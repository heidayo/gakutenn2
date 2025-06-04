"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Ban,
  Search,
  Download,
  RefreshCw,
  MapPin,
  Clock,
  Wifi,
  Monitor,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSecurityPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("24h")

  // セキュリティ統計
  const [securityStats, setSecurityStats] = useState({
    totalThreats: 156,
    blockedAttempts: 89,
    suspiciousActivities: 23,
    compromisedAccounts: 2,
    averageSecurityScore: 78.5,
    trendDirection: "up",
  })

  // 脅威検知データ
  const [threatDetections, setThreatDetections] = useState([
    {
      id: 1,
      type: "brute_force",
      severity: "high",
      target: "student@university.ac.jp",
      source: "192.168.1.xxx",
      location: "大阪府大阪市",
      timestamp: "2024-06-02 16:45:33",
      status: "blocked",
      attempts: 15,
    },
    {
      id: 2,
      type: "suspicious_login",
      severity: "medium",
      target: "hr@company.com",
      source: "203.104.209.xxx",
      location: "海外（VPN疑い）",
      timestamp: "2024-06-02 15:20:10",
      status: "investigating",
      attempts: 3,
    },
    {
      id: 3,
      type: "account_takeover",
      severity: "high",
      target: "admin@techstart.com",
      source: "Multiple IPs",
      location: "複数地点",
      timestamp: "2024-06-02 14:15:22",
      status: "contained",
      attempts: 8,
    },
  ])

  // 危険なアカウント
  const [riskAccounts, setRiskAccounts] = useState([
    {
      id: 1,
      email: "student@university.ac.jp",
      type: "student",
      riskScore: 85,
      issues: ["複数回ログイン失敗", "異常な地理的アクセス"],
      lastActivity: "2024-06-02 16:45:33",
      status: "monitoring",
    },
    {
      id: 2,
      email: "hr@company.com",
      type: "company",
      riskScore: 72,
      issues: ["2FA未設定", "弱いパスワード"],
      lastActivity: "2024-06-02 15:20:10",
      status: "action_required",
    },
  ])

  // システム全体のログイン履歴
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      userType: "student",
      email: "tanaka@university.ac.jp",
      timestamp: "2024-06-02 16:30:15",
      device: "iPhone 15 Pro",
      location: "東京都渋谷区",
      ip: "192.168.1.100",
      status: "success",
      suspicious: false,
    },
    {
      id: 2,
      userType: "company",
      email: "hr@techstart.com",
      timestamp: "2024-06-02 16:25:10",
      device: "MacBook Pro",
      location: "東京都千代田区",
      ip: "203.104.209.104",
      status: "success",
      suspicious: false,
    },
    {
      id: 3,
      userType: "student",
      email: "suspicious@example.com",
      timestamp: "2024-06-02 16:20:33",
      device: "Unknown Device",
      location: "大阪府大阪市",
      ip: "192.168.1.xxx",
      status: "blocked",
      suspicious: true,
    },
  ])

  // データ更新
  const handleRefresh = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 統計データの更新（モック）
    setSecurityStats((prev) => ({
      ...prev,
      totalThreats: prev.totalThreats + Math.floor(Math.random() * 5),
      blockedAttempts: prev.blockedAttempts + Math.floor(Math.random() * 3),
    }))

    setIsLoading(false)
    toast({
      title: "データを更新しました",
      description: "最新のセキュリティ情報を取得しました",
      variant: "default",
    })
  }

  // アカウントアクション
  const handleAccountAction = async (accountId: number, action: string) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setRiskAccounts((prev) =>
        prev.map((account) => {
          if (account.id === accountId) {
            switch (action) {
              case "suspend":
                return { ...account, status: "suspended" }
              case "monitor":
                return { ...account, status: "monitoring" }
              case "clear":
                return { ...account, status: "cleared", riskScore: 20 }
            }
          }
          return account
        }),
      )

      toast({
        title: "アクションを実行しました",
        description: `アカウントに対して${action}を実行しました`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "アクションの実行に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 脅威対応
  const handleThreatAction = async (threatId: number, action: string) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setThreatDetections((prev) =>
        prev.map((threat) => {
          if (threat.id === threatId) {
            switch (action) {
              case "block":
                return { ...threat, status: "blocked" }
              case "investigate":
                return { ...threat, status: "investigating" }
              case "resolve":
                return { ...threat, status: "resolved" }
            }
          }
          return threat
        }),
      )

      toast({
        title: "脅威対応を実行しました",
        description: `脅威に対して${action}を実行しました`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "脅威対応の実行に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // データエクスポート
  const exportSecurityReport = () => {
    const reportData = {
      stats: securityStats,
      threats: threatDetections,
      riskAccounts: riskAccounts,
      logs: systemLogs,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `security-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "セキュリティレポートをエクスポートしました",
      description: "JSONファイルがダウンロードされました",
      variant: "default",
    })
  }

  // フィルタリング
  const filteredLogs = systemLogs.filter((log) => {
    const matchesSearch = log.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === "all" || log.userType === filterType || (filterType === "suspicious" && log.suspicious)
    return matchesSearch && matchesFilter
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
      case "contained":
        return "bg-red-100 text-red-800"
      case "investigating":
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
      case "cleared":
        return "bg-green-100 text-green-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600"
    if (score >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  const getThreatTypeText = (type: string) => {
    switch (type) {
      case "brute_force":
        return "ブルートフォース攻撃"
      case "suspicious_login":
        return "不審なログイン"
      case "account_takeover":
        return "アカウント乗っ取り"
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">セキュリティ監視センター</h1>
            <p className="text-sm text-gray-600">プラットフォーム全体のセキュリティ監視・脅威検知</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportSecurityReport}>
              <Download className="h-4 w-4 mr-2" />
              レポート出力
            </Button>
            <Button size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              更新
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* セキュリティ統計 */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">検知された脅威</p>
                  <p className="text-2xl font-bold text-red-600">{securityStats.totalThreats}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    <p className="text-xs text-red-600">+12% (24時間)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ブロック済み攻撃</p>
                  <p className="text-2xl font-bold text-green-600">{securityStats.blockedAttempts}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600">+8% (24時間)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">不審なアクティビティ</p>
                  <p className="text-2xl font-bold text-yellow-600">{securityStats.suspiciousActivities}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600">-5% (24時間)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均セキュリティスコア</p>
                  <p className="text-2xl font-bold text-blue-600">{securityStats.averageSecurityScore}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-blue-600">+2.3% (30日)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* 脅威検知 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                脅威検知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatDetections.map((threat) => (
                  <div key={threat.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity === "high" ? "高" : threat.severity === "medium" ? "中" : "低"}
                          </Badge>
                          <Badge className={getStatusColor(threat.status)}>
                            {threat.status === "blocked"
                              ? "ブロック済み"
                              : threat.status === "investigating"
                                ? "調査中"
                                : threat.status === "contained"
                                  ? "封じ込め済み"
                                  : threat.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{getThreatTypeText(threat.type)}</h4>
                        <p className="text-sm text-gray-600">対象: {threat.target}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Wifi className="h-3 w-3" />
                            <span>{threat.source}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{threat.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{threat.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">試行回数: {threat.attempts}回</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {threat.status === "investigating" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleThreatAction(threat.id, "block")}
                            disabled={isLoading}
                          >
                            ブロック
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleThreatAction(threat.id, "resolve")}
                          disabled={isLoading}
                        >
                          解決
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 危険なアカウント */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-yellow-600" />
                危険なアカウント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAccounts.map((account) => (
                  <div key={account.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={
                              account.type === "student" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }
                          >
                            {account.type === "student" ? "学生" : "企業"}
                          </Badge>
                          <Badge className={getStatusColor(account.status)}>
                            {account.status === "monitoring"
                              ? "監視中"
                              : account.status === "action_required"
                                ? "要対応"
                                : account.status === "suspended"
                                  ? "停止中"
                                  : account.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold">{account.email}</h4>
                        <div className={`text-lg font-bold ${getRiskColor(account.riskScore)}`}>
                          リスクスコア: {account.riskScore}/100
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">検出された問題:</p>
                          <ul className="text-xs text-gray-500 mt-1">
                            {account.issues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">最終アクティビティ: {account.lastActivity}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAccountAction(account.id, "monitor")}
                          disabled={isLoading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAccountAction(account.id, "suspend")}
                          disabled={isLoading}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAccountAction(account.id, "clear")}
                          disabled={isLoading}
                        >
                          解除
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* システムログ */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                システムログ
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="メールアドレスで検索"
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="フィルター" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="student">学生</SelectItem>
                    <SelectItem value="company">企業</SelectItem>
                    <SelectItem value="suspicious">不審</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="期間" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1時間</SelectItem>
                    <SelectItem value="24h">24時間</SelectItem>
                    <SelectItem value="7d">7日</SelectItem>
                    <SelectItem value="30d">30日</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`border rounded-lg p-4 ${log.suspicious ? "border-red-200 bg-red-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {log.device.includes("iPhone") || log.device.includes("Android") ? (
                          <Smartphone className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Monitor className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{log.email}</h4>
                          <Badge
                            className={
                              log.userType === "student" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }
                          >
                            {log.userType === "student" ? "学生" : "企業"}
                          </Badge>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status === "success" ? "成功" : log.status === "blocked" ? "ブロック" : log.status}
                          </Badge>
                          {log.suspicious && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              不審
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{log.device}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{log.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wifi className="h-3 w-3" />
                            <span>{log.ip}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{log.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>検索条件に一致するログが見つかりません</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
