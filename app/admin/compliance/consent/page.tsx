"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { UserCheck, Search, Download, TrendingUp, TrendingDown, Users, Mail, BarChart3, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ConsentManagementPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [timeRange, setTimeRange] = useState("30d")

  // 同意統計
  const [consentStats, setConsentStats] = useState({
    totalUsers: 15420,
    consentedUsers: 14526,
    consentRate: 94.2,
    marketingConsent: 87.3,
    analyticsConsent: 91.8,
    thirdPartyConsent: 76.5,
    recentOptOuts: 23,
    recentOptIns: 156,
  })

  // 同意カテゴリ
  const [consentCategories, setConsentCategories] = useState([
    {
      id: 1,
      name: "必須機能",
      description: "サービス提供に必要な基本機能",
      type: "necessary",
      consentRate: 100,
      userCount: 15420,
      required: true,
      canOptOut: false,
    },
    {
      id: 2,
      name: "分析・改善",
      description: "サービス分析・改善のためのデータ利用",
      type: "analytics",
      consentRate: 91.8,
      userCount: 14155,
      required: false,
      canOptOut: true,
    },
    {
      id: 3,
      name: "マーケティング",
      description: "個別化された広告・プロモーション",
      type: "marketing",
      consentRate: 87.3,
      userCount: 13462,
      required: false,
      canOptOut: true,
    },
    {
      id: 4,
      name: "第三者連携",
      description: "パートナー企業との情報共有",
      type: "third_party",
      consentRate: 76.5,
      userCount: 11796,
      required: false,
      canOptOut: true,
    },
  ])

  // ユーザー同意履歴
  const [consentHistory, setConsentHistory] = useState([
    {
      id: 1,
      userId: "student_001",
      userType: "student",
      email: "tanaka@university.ac.jp",
      action: "opt_in",
      category: "marketing",
      timestamp: "2024-06-02 16:30:15",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/125.0",
    },
    {
      id: 2,
      userId: "company_001",
      userType: "company",
      email: "hr@techstart.com",
      action: "opt_out",
      category: "third_party",
      timestamp: "2024-06-02 14:20:10",
      ipAddress: "203.104.209.104",
      userAgent: "Safari/17.0",
    },
    {
      id: 3,
      userId: "student_002",
      userType: "student",
      email: "sato@university.ac.jp",
      action: "opt_in",
      category: "analytics",
      timestamp: "2024-06-02 12:15:22",
      ipAddress: "192.168.1.101",
      userAgent: "Firefox/126.0",
    },
  ])

  // 同意設定更新
  const handleConsentUpdate = async (categoryId: number, enabled: boolean) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setConsentCategories((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            const newConsentRate = enabled
              ? Math.min(100, category.consentRate + 5)
              : Math.max(0, category.consentRate - 5)
            return {
              ...category,
              consentRate: newConsentRate,
              userCount: Math.floor((newConsentRate / 100) * consentStats.totalUsers),
            }
          }
          return category
        }),
      )

      toast({
        title: "同意設定を更新しました",
        description: `同意カテゴリの設定を${enabled ? "有効" : "無効"}にしました`,
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

  // 同意データエクスポート
  const exportConsentData = () => {
    const csvData = consentHistory
      .map((record) =>
        [
          record.timestamp,
          record.userType,
          record.email,
          record.action,
          record.category,
          record.ipAddress,
          record.userAgent,
        ].join(","),
      )
      .join("\n")

    const blob = new Blob(
      [`日時,ユーザータイプ,メールアドレス,アクション,カテゴリ,IPアドレス,ユーザーエージェント\n${csvData}`],
      { type: "text/csv" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `consent-history-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "同意履歴をエクスポートしました",
      description: "CSVファイルがダウンロードされました",
      variant: "default",
    })
  }

  // フィルタリング
  const filteredHistory = consentHistory.filter((record) => {
    const matchesSearch = record.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || record.userType === filterType || record.action === filterType
    return matchesSearch && matchesFilter
  })

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "necessary":
        return "bg-green-100 text-green-800"
      case "analytics":
        return "bg-blue-100 text-blue-800"
      case "marketing":
        return "bg-purple-100 text-purple-800"
      case "third_party":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "opt_in":
        return "bg-green-100 text-green-800"
      case "opt_out":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "opt_in":
        return "同意"
      case "opt_out":
        return "拒否"
      default:
        return action
    }
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "company":
        return "bg-green-100 text-green-800"
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
            <h1 className="text-2xl font-bold">同意管理</h1>
            <p className="text-sm text-gray-600">ユーザー同意の取得・管理・追跡</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportConsentData}>
              <Download className="h-4 w-4 mr-2" />
              履歴エクスポート
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 同意統計 */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総合同意率</p>
                  <p className="text-3xl font-bold text-green-600">{consentStats.consentRate}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-xs text-green-600">+2.3% (30日)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">マーケティング同意</p>
                  <p className="text-3xl font-bold text-purple-600">{consentStats.marketingConsent}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <p className="text-xs text-purple-600">+1.8% (30日)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">分析同意</p>
                  <p className="text-3xl font-bold text-blue-600">{consentStats.analyticsConsent}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <p className="text-xs text-blue-600">+0.9% (30日)</p>
                  </div>
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
                  <p className="text-sm font-medium text-gray-600">第三者連携同意</p>
                  <p className="text-3xl font-bold text-orange-600">{consentStats.thirdPartyConsent}%</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <p className="text-xs text-red-600">-1.2% (30日)</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 同意カテゴリ管理 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              同意カテゴリ管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {consentCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{category.name}</h4>
                        <Badge className={getCategoryColor(category.type)}>
                          {category.type === "necessary"
                            ? "必須"
                            : category.type === "analytics"
                              ? "分析"
                              : category.type === "marketing"
                                ? "マーケティング"
                                : "第三者"}
                        </Badge>
                        {category.required && <Badge className="bg-red-100 text-red-800">必須</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">同意率</span>
                            <span className="text-sm text-gray-600">{category.consentRate}%</span>
                          </div>
                          <Progress value={category.consentRate} className="h-2" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{category.userCount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">ユーザー</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      <Switch
                        checked={category.consentRate > 0}
                        onCheckedChange={(checked) => handleConsentUpdate(category.id, checked)}
                        disabled={category.required || isLoading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 同意履歴 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                同意履歴
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
                    <SelectItem value="opt_in">同意</SelectItem>
                    <SelectItem value="opt_out">拒否</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="期間" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7日</SelectItem>
                    <SelectItem value="30d">30日</SelectItem>
                    <SelectItem value="90d">90日</SelectItem>
                    <SelectItem value="1y">1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{record.email}</h4>
                          <Badge className={getUserTypeColor(record.userType)}>
                            {record.userType === "student" ? "学生" : "企業"}
                          </Badge>
                          <Badge className={getActionColor(record.action)}>{getActionText(record.action)}</Badge>
                          <Badge className={getCategoryColor(record.category)}>
                            {record.category === "marketing"
                              ? "マーケティング"
                              : record.category === "analytics"
                                ? "分析"
                                : record.category === "third_party"
                                  ? "第三者"
                                  : record.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <span>{record.timestamp}</span>
                          <span>{record.ipAddress}</span>
                          <span>{record.userAgent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>検索条件に一致する履歴が見つかりません</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
