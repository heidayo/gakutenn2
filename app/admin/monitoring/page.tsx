"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react"

export default function SystemMonitoring() {
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5秒
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h")
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      timestamp: "2024-06-02 16:15:23",
      level: "ERROR",
      service: "API Gateway",
      message: "Rate limit exceeded for IP 192.168.1.100",
    },
    {
      id: 2,
      timestamp: "2024-06-02 16:12:45",
      level: "WARN",
      service: "Database",
      message: "Slow query detected: SELECT * FROM applications (2.3s)",
    },
    {
      id: 3,
      timestamp: "2024-06-02 16:10:12",
      level: "INFO",
      service: "Auth Service",
      message: "User authentication successful: user_id=12345",
    },
    {
      id: 4,
      timestamp: "2024-06-02 16:08:30",
      level: "ERROR",
      service: "Email Service",
      message: "Failed to send notification email to user@example.com",
    },
  ])

  // サーバーメトリクス
  const serverMetrics = {
    cpu: { usage: 45, cores: 8, temperature: 62 },
    memory: { usage: 68, total: 32, used: 21.8 },
    disk: { usage: 34, total: 1000, used: 340 },
    network: { inbound: 125, outbound: 89 },
  }

  // データベースメトリクス
  const dbMetrics = {
    connections: { active: 45, max: 100 },
    queries: { perSecond: 234, slowQueries: 3 },
    storage: { usage: 78, total: 500, used: 390 },
    replication: { lag: 0.2, status: "healthy" },
  }

  // APIメトリクス
  const apiMetrics = {
    requests: { perMinute: 1250, errors: 5 },
    responseTime: { avg: 245, p95: 450, p99: 890 },
    endpoints: [
      { path: "/api/users", requests: 450, avgTime: 120, errors: 0 },
      { path: "/api/jobs", requests: 320, avgTime: 180, errors: 2 },
      { path: "/api/applications", requests: 280, avgTime: 200, errors: 1 },
      { path: "/api/messages", requests: 200, avgTime: 95, errors: 2 },
    ],
  }

  // データ更新関数
  const handleRefresh = async () => {
    setIsLoading(true)
    // APIコール（モック）
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 新しいログエントリを追加（モック）
    const newLog = {
      id: systemLogs.length + 1,
      timestamp: new Date().toLocaleString(),
      level: ["INFO", "WARN", "ERROR"][Math.floor(Math.random() * 3)],
      service: ["API Gateway", "Database", "Auth Service", "Email Service"][Math.floor(Math.random() * 4)],
      message: "System monitoring update - " + new Date().toLocaleTimeString(),
    }

    setSystemLogs((prev) => [newLog, ...prev.slice(0, 9)]) // 最新10件を保持
    setIsLoading(false)
  }

  // ログ出力機能
  const handleExportLogs = () => {
    const logData = systemLogs.map((log) => `${log.timestamp} [${log.level}] ${log.service}: ${log.message}`).join("\n")

    const blob = new Blob([logData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 自動更新
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      handleRefresh()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "bg-red-100 text-red-800"
      case "WARN":
        return "bg-yellow-100 text-yellow-800"
      case "INFO":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "text-red-600"
    if (usage >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">システム監視</h1>
            <p className="text-sm text-gray-600">リアルタイムシステム状況とパフォーマンス</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              ログ出力
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)}>
              <Settings className="h-4 w-4 mr-2" />
              自動更新: {autoRefresh ? "ON" : "OFF"}
            </Button>
            <Button size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* サーバーメトリクス */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              サーバーメトリクス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Cpu className="h-4 w-4 mr-1" />
                    CPU使用率
                  </span>
                  <span className={`text-sm font-bold ${getUsageColor(serverMetrics.cpu.usage)}`}>
                    {serverMetrics.cpu.usage}%
                  </span>
                </div>
                <Progress value={serverMetrics.cpu.usage} className="h-2" />
                <p className="text-xs text-gray-600">
                  {serverMetrics.cpu.cores}コア / 温度: {serverMetrics.cpu.temperature}°C
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <MemoryStick className="h-4 w-4 mr-1" />
                    メモリ使用率
                  </span>
                  <span className={`text-sm font-bold ${getUsageColor(serverMetrics.memory.usage)}`}>
                    {serverMetrics.memory.usage}%
                  </span>
                </div>
                <Progress value={serverMetrics.memory.usage} className="h-2" />
                <p className="text-xs text-gray-600">
                  {serverMetrics.memory.used}GB / {serverMetrics.memory.total}GB
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <HardDrive className="h-4 w-4 mr-1" />
                    ディスク使用率
                  </span>
                  <span className={`text-sm font-bold ${getUsageColor(serverMetrics.disk.usage)}`}>
                    {serverMetrics.disk.usage}%
                  </span>
                </div>
                <Progress value={serverMetrics.disk.usage} className="h-2" />
                <p className="text-xs text-gray-600">
                  {serverMetrics.disk.used}GB / {serverMetrics.disk.total}GB
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Wifi className="h-4 w-4 mr-1" />
                    ネットワーク
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {serverMetrics.network.inbound + serverMetrics.network.outbound}MB/s
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>受信: {serverMetrics.network.inbound}MB/s</div>
                  <div>送信: {serverMetrics.network.outbound}MB/s</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* データベースメトリクス */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              データベースメトリクス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">アクティブ接続</span>
                  <span className="text-sm font-bold text-blue-600">
                    {dbMetrics.connections.active}/{dbMetrics.connections.max}
                  </span>
                </div>
                <Progress value={(dbMetrics.connections.active / dbMetrics.connections.max) * 100} className="h-2" />
                <p className="text-xs text-gray-600">
                  最大接続数の{Math.round((dbMetrics.connections.active / dbMetrics.connections.max) * 100)}%
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">クエリ/秒</span>
                  <span className="text-sm font-bold text-green-600">{dbMetrics.queries.perSecond}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>スロークエリ: {dbMetrics.queries.slowQueries}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ストレージ使用率</span>
                  <span className={`text-sm font-bold ${getUsageColor(dbMetrics.storage.usage)}`}>
                    {dbMetrics.storage.usage}%
                  </span>
                </div>
                <Progress value={dbMetrics.storage.usage} className="h-2" />
                <p className="text-xs text-gray-600">
                  {dbMetrics.storage.used}GB / {dbMetrics.storage.total}GB
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">レプリケーション</span>
                  <Badge className="bg-green-100 text-green-800">正常</Badge>
                </div>
                <p className="text-xs text-gray-600">遅延: {dbMetrics.replication.lag}秒</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          {/* APIメトリクス */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                APIメトリクス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">リクエスト/分</p>
                    <p className="text-2xl font-bold text-blue-600">{apiMetrics.requests.perMinute}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">エラー数</p>
                    <p className="text-2xl font-bold text-red-600">{apiMetrics.requests.errors}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">応答時間</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">平均:</span>
                      <span className="font-semibold ml-1">{apiMetrics.responseTime.avg}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-600">95%:</span>
                      <span className="font-semibold ml-1">{apiMetrics.responseTime.p95}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-600">99%:</span>
                      <span className="font-semibold ml-1">{apiMetrics.responseTime.p99}ms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">エンドポイント別統計</h4>
                  <div className="space-y-2">
                    {apiMetrics.endpoints.map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between text-xs border-b pb-1">
                        <span className="font-mono">{endpoint.path}</span>
                        <div className="flex items-center space-x-2">
                          <span>{endpoint.requests}req</span>
                          <span>{endpoint.avgTime}ms</span>
                          <span className={endpoint.errors > 0 ? "text-red-600" : "text-green-600"}>
                            {endpoint.errors}err
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* システムログ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                システムログ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">自動更新:</span>
                  <Badge className={autoRefresh ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {autoRefresh ? "ON" : "OFF"}
                  </Badge>
                </div>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value={1000}>1秒</option>
                  <option value={5000}>5秒</option>
                  <option value={10000}>10秒</option>
                  <option value={30000}>30秒</option>
                </select>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-1">
                      <Badge className={getLogLevelColor(log.level)} size="sm">
                        {log.level}
                      </Badge>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{log.service}</div>
                    <div className="text-sm">{log.message}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
