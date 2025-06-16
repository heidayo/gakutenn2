"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Building,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Lock,
  Download,
  Wifi,
  Monitor,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CompanySecurityPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState("all")

  // 企業セキュリティ設定
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorRequired: true,
    ipWhitelist: false,
    sessionTimeout: 30,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    dataExportRestrictions: true,
    adminApprovalRequired: true,
  })

  // チームメンバー
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "田中 人事部長",
      email: "tanaka@company.com",
      role: "admin",
      lastLogin: "2024-06-02 16:30:15",
      status: "active",
      twoFactorEnabled: true,
    },
    {
      id: 2,
      name: "佐藤 採用担当",
      email: "sato@company.com",
      role: "editor",
      lastLogin: "2024-06-02 14:20:10",
      status: "active",
      twoFactorEnabled: false,
    },
    {
      id: 3,
      name: "山田 マネージャー",
      email: "yamada@company.com",
      role: "editor",
      lastLogin: "2024-06-01 18:45:22",
      status: "suspended",
      twoFactorEnabled: true,
    },
  ])

  // 企業ログイン履歴
  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      userId: 1,
      userName: "田中 人事部長",
      timestamp: "2024-06-02 16:30:15",
      device: "MacBook Pro",
      browser: "Chrome 125.0",
      location: "東京都千代田区",
      ip: "203.104.209.104",
      status: "success",
      suspicious: false,
    },
    {
      id: 2,
      userId: 2,
      userName: "佐藤 採用担当",
      timestamp: "2024-06-02 14:20:10",
      device: "Windows PC",
      browser: "Edge 125.0",
      location: "東京都千代田区",
      ip: "203.104.209.105",
      status: "success",
      suspicious: false,
    },
    {
      id: 3,
      userId: null,
      userName: "不明なユーザー",
      timestamp: "2024-06-01 23:45:33",
      device: "Unknown Device",
      browser: "Chrome 124.0",
      location: "大阪府大阪市",
      ip: "192.168.1.xxx",
      status: "blocked",
      suspicious: true,
    },
  ])

  // セキュリティアラート
  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      type: "unauthorized_access",
      title: "不正アクセス試行を検出",
      description: "未登録IPアドレスからの管理者アカウントへのアクセス試行",
      timestamp: "2024-06-01 23:45:33",
      severity: "high",
      resolved: false,
      affectedUser: "管理者アカウント",
    },
    {
      id: 2,
      type: "weak_security",
      title: "2段階認証未設定のユーザー",
      description: "佐藤 採用担当が2段階認証を設定していません",
      timestamp: "2024-06-01 09:00:00",
      severity: "medium",
      resolved: false,
      affectedUser: "佐藤 採用担当",
    },
  ])

  // セキュリティスコア計算
  const calculateSecurityScore = () => {
    let score = 0
    if (securitySettings.twoFactorRequired) score += 25
    if (securitySettings.ipWhitelist) score += 20
    if (securitySettings.loginNotifications) score += 15
    if (securitySettings.suspiciousActivityAlerts) score += 15
    if (securitySettings.dataExportRestrictions) score += 15
    if (securitySettings.adminApprovalRequired) score += 10

    // チームメンバーの2FA設定状況
    const twoFactorUsers = teamMembers.filter((member) => member.twoFactorEnabled).length
    const twoFactorScore = (twoFactorUsers / teamMembers.length) * 100 * 0.2

    return Math.min(100, score + twoFactorScore)
  }

  const securityScore = calculateSecurityScore()

  // セキュリティ設定更新
  const handleSettingChange = async (setting: string, value: boolean | number) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSecuritySettings((prev) => ({
        ...prev,
        [setting]: value,
      }))

      toast({
        title: "設定を更新しました",
        description: `${getSettingName(setting)}を更新しました`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "設定の更新に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ユーザーアクション
  const handleUserAction = async (userId: number, action: string) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setTeamMembers((prev) =>
        prev.map((member) => {
          if (member.id === userId) {
            switch (action) {
              case "suspend":
                return { ...member, status: "suspended" }
              case "activate":
                return { ...member, status: "active" }
              case "require2fa":
                return { ...member, twoFactorEnabled: true }
            }
          }
          return member
        }),
      )

      toast({
        title: "ユーザーアクションを実行しました",
        description: `${action}を実行しました`,
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

  // アラート解決
  const resolveAlert = async (alertId: number) => {
    setSecurityAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))

    toast({
      title: "アラートを解決しました",
      description: "セキュリティアラートを確認済みにしました",
      variant: "default",
    })
  }

  // ログイン履歴エクスポート
  const exportLoginHistory = () => {
    const csvData = loginHistory
      .map(
        (log) =>
          `${log.timestamp},${log.userName},${log.device},${log.browser},${log.location},${log.ip},${log.status}`,
      )
      .join("\n")

    const blob = new Blob([`日時,ユーザー,デバイス,ブラウザ,場所,IPアドレス,ステータス\n${csvData}`], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `company-login-history-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "ログイン履歴をエクスポートしました",
      description: "CSVファイルがダウンロードされました",
      variant: "default",
    })
  }

  const getSettingName = (setting: string) => {
    const names: { [key: string]: string } = {
      twoFactorRequired: "2段階認証必須",
      ipWhitelist: "IPホワイトリスト",
      sessionTimeout: "セッションタイムアウト",
      loginNotifications: "ログイン通知",
      suspiciousActivityAlerts: "不審なアクティビティアラート",
      dataExportRestrictions: "データエクスポート制限",
      adminApprovalRequired: "管理者承認必須",
    }
    return names[setting] || setting
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "blocked":
        return "bg-red-100 text-red-800"
      case "failed":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "成功"
      case "blocked":
        return "ブロック"
      case "failed":
        return "失敗"
      default:
        return status
    }
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "管理者"
      case "editor":
        return "編集者"
      default:
        return role
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // フィルタリング
  const filteredLoginHistory =
    selectedUser === "all" ? loginHistory : loginHistory.filter((log) => log.userId?.toString() === selectedUser)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">企業セキュリティ管理</h1>
            <p className="text-sm text-gray-600">チーム全体のセキュリティを監視・管理</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportLoginHistory}>
              <Download className="h-4 w-4 mr-2" />
              履歴エクスポート
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* セキュリティスコア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              企業セキュリティスコア
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>
                  {Math.round(securityScore)}/100
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {securityScore >= 80
                    ? "優秀な企業セキュリティレベルです"
                    : securityScore >= 60
                      ? "セキュリティを強化することをお勧めします"
                      : "セキュリティが不十分です。設定を見直してください"}
                </p>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${(securityScore / 100) * 251.2} 251.2`}
                    className={getScoreColor(securityScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building className={`h-8 w-8 ${getScoreColor(securityScore)}`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* セキュリティアラート */}
        {securityAlerts.filter((alert) => !alert.resolved).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                セキュリティアラート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts
                  .filter((alert) => !alert.resolved)
                  .map((alert) => (
                    <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm mt-1">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              対象: {alert.affectedUser} • {alert.timestamp}
                            </p>
                          </div>
                          <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                            解決
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* セキュリティ設定 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                セキュリティポリシー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">2段階認証必須</h4>
                    <p className="text-sm text-gray-600">全メンバーに2FAを強制</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(value) => handleSettingChange("twoFactorRequired", value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">IPホワイトリスト</h4>
                    <p className="text-sm text-gray-600">許可されたIPからのみアクセス</p>
                  </div>
                  <Switch
                    checked={securitySettings.ipWhitelist}
                    onCheckedChange={(value) => handleSettingChange("ipWhitelist", value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">セッションタイムアウト</h4>
                    <p className="text-sm text-gray-600">自動ログアウト時間（分）</p>
                  </div>
                  <Select
                    value={securitySettings.sessionTimeout.toString()}
                    onValueChange={(value) => handleSettingChange("sessionTimeout", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">データエクスポート制限</h4>
                    <p className="text-sm text-gray-600">管理者承認が必要</p>
                  </div>
                  <Switch
                    checked={securitySettings.dataExportRestrictions}
                    onCheckedChange={(value) => handleSettingChange("dataExportRestrictions", value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* チームメンバー管理 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                チームメンバー
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge className={getUserStatusColor(member.status)}>
                            {member.status === "active" ? "アクティブ" : "停止中"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{getRoleText(member.role)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">最終ログイン: {member.lastLogin}</span>
                          {member.twoFactorEnabled ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              2FA
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              2FA未設定
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!member.twoFactorEnabled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(member.id, "require2fa")}
                            disabled={isLoading}
                          >
                            2FA要求
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUserAction(member.id, member.status === "active" ? "suspend" : "activate")
                          }
                          disabled={isLoading}
                        >
                          {member.status === "active" ? "停止" : "有効化"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ログイン履歴 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                ログイン履歴
              </CardTitle>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ユーザーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのユーザー</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLoginHistory.map((log) => (
                <div
                  key={log.id}
                  className={`border rounded-lg p-4 ${log.suspicious ? "border-red-200 bg-red-50" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Monitor className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{log.userName}</h4>
                          <Badge className={getStatusColor(log.status)}>{getStatusText(log.status)}</Badge>
                          {log.suspicious && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              不審
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {log.device} • {log.browser}
                        </p>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
