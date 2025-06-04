"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Smartphone, MapPin, Clock, AlertTriangle, Lock, Download, Wifi, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentSecurityPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    deviceTracking: true,
    locationTracking: false,
  })

  // ログイン履歴データ
  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      timestamp: "2024-06-02 16:30:15",
      device: "iPhone 15 Pro",
      browser: "Safari 17.0",
      location: "東京都渋谷区",
      ip: "192.168.1.100",
      status: "success",
      suspicious: false,
    },
    {
      id: 2,
      timestamp: "2024-06-02 09:15:22",
      device: "MacBook Pro",
      browser: "Chrome 125.0",
      location: "東京都渋谷区",
      ip: "192.168.1.101",
      status: "success",
      suspicious: false,
    },
    {
      id: 3,
      timestamp: "2024-06-01 23:45:33",
      device: "Unknown Device",
      browser: "Chrome 124.0",
      location: "大阪府大阪市",
      ip: "203.104.209.xxx",
      status: "blocked",
      suspicious: true,
    },
    {
      id: 4,
      timestamp: "2024-06-01 14:20:10",
      device: "iPhone 15 Pro",
      browser: "Safari 17.0",
      location: "東京都渋谷区",
      ip: "192.168.1.100",
      status: "success",
      suspicious: false,
    },
  ])

  // セキュリティアラート
  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      type: "suspicious_login",
      title: "不審なログイン試行を検出",
      description: "大阪府からの未知のデバイスによるログイン試行がブロックされました",
      timestamp: "2024-06-01 23:45:33",
      severity: "high",
      resolved: false,
    },
    {
      id: 2,
      type: "new_device",
      title: "新しいデバイスからのアクセス",
      description: "MacBook Proからの初回ログインを検出しました",
      timestamp: "2024-05-30 10:30:00",
      severity: "medium",
      resolved: true,
    },
  ])

  // セキュリティスコア計算
  const calculateSecurityScore = () => {
    let score = 0
    if (securitySettings.twoFactorEnabled) score += 30
    if (securitySettings.loginNotifications) score += 20
    if (securitySettings.suspiciousActivityAlerts) score += 20
    if (securitySettings.deviceTracking) score += 15
    if (securitySettings.locationTracking) score += 15
    return score
  }

  const securityScore = calculateSecurityScore()

  // セキュリティ設定更新
  const handleSettingChange = async (setting: string, value: boolean) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSecuritySettings((prev) => ({
        ...prev,
        [setting]: value,
      }))

      toast({
        title: "設定を更新しました",
        description: `${getSettingName(setting)}を${value ? "有効" : "無効"}にしました`,
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
      .map((log) => `${log.timestamp},${log.device},${log.browser},${log.location},${log.ip},${log.status}`)
      .join("\n")

    const blob = new Blob([`日時,デバイス,ブラウザ,場所,IPアドレス,ステータス\n${csvData}`], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `login-history-${new Date().toISOString().split("T")[0]}.csv`
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
      twoFactorEnabled: "2段階認証",
      loginNotifications: "ログイン通知",
      suspiciousActivityAlerts: "不審なアクティビティアラート",
      deviceTracking: "デバイス追跡",
      locationTracking: "位置情報追跡",
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">セキュリティ設定</h1>
            <p className="text-sm text-gray-600">アカウントのセキュリティを管理・監視</p>
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
              セキュリティスコア
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</div>
                <p className="text-sm text-gray-600 mt-1">
                  {securityScore >= 80
                    ? "優秀なセキュリティレベルです"
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
                  <Shield className={`h-8 w-8 ${getScoreColor(securityScore)}`} />
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
                            <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
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

        {/* セキュリティ設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              セキュリティ設定
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">2段階認証</h4>
                  <p className="text-sm text-gray-600">ログイン時に追加の認証を要求</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(value) => handleSettingChange("twoFactorEnabled", value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">ログイン通知</h4>
                  <p className="text-sm text-gray-600">新しいログインをメールで通知</p>
                </div>
                <Switch
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(value) => handleSettingChange("loginNotifications", value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">不審なアクティビティアラート</h4>
                  <p className="text-sm text-gray-600">異常なアクセスパターンを検出</p>
                </div>
                <Switch
                  checked={securitySettings.suspiciousActivityAlerts}
                  onCheckedChange={(value) => handleSettingChange("suspiciousActivityAlerts", value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">デバイス追跡</h4>
                  <p className="text-sm text-gray-600">使用デバイスの記録と監視</p>
                </div>
                <Switch
                  checked={securitySettings.deviceTracking}
                  onCheckedChange={(value) => handleSettingChange("deviceTracking", value)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">位置情報追跡</h4>
                  <p className="text-sm text-gray-600">ログイン場所の記録（任意）</p>
                </div>
                <Switch
                  checked={securitySettings.locationTracking}
                  onCheckedChange={(value) => handleSettingChange("locationTracking", value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ログイン履歴 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              ログイン履歴
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginHistory.map((log) => (
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
                          <h4 className="font-semibold">{log.device}</h4>
                          <Badge className={getStatusColor(log.status)}>{getStatusText(log.status)}</Badge>
                          {log.suspicious && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              不審
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{log.browser}</p>
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
