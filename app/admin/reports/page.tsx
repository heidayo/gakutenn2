"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, AlertTriangle, MessageSquare, User, Building2, Eye, CheckCircle, X, Search, Filter } from "lucide-react"
import { useState } from "react"

export default function ReportsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const reports = [
    {
      id: 1,
      type: "inappropriate_content",
      title: "不適切な求人内容",
      description: "求人内容に差別的な表現が含まれています",
      reportedBy: "田中太郎（学生）",
      targetUser: "株式会社ABC",
      targetContent: "Webデザイナー募集",
      status: "pending",
      priority: "high",
      createdAt: "2024-06-02 14:30",
      category: "job_posting",
    },
    {
      id: 2,
      type: "harassment",
      title: "メッセージでのハラスメント",
      description: "面談後に不適切なメッセージを受信しました",
      reportedBy: "佐藤花子（学生）",
      targetUser: "株式会社XYZ 採用担当",
      targetContent: "プライベートメッセージ",
      status: "investigating",
      priority: "high",
      createdAt: "2024-06-02 11:15",
      category: "message",
    },
    {
      id: 3,
      type: "fake_profile",
      title: "偽の企業プロフィール",
      description: "実在しない企業の可能性があります",
      reportedBy: "システム自動検出",
      targetUser: "株式会社フェイク",
      targetContent: "企業プロフィール",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-06-01 16:45",
      category: "profile",
    },
    {
      id: 4,
      type: "spam",
      title: "スパム応募",
      description: "同一ユーザーから大量の応募が送信されています",
      reportedBy: "株式会社テック（企業）",
      targetUser: "山田次郎（学生）",
      targetContent: "応募メッセージ",
      status: "pending",
      priority: "low",
      createdAt: "2024-06-01 09:20",
      category: "application",
    },
  ]

  const handleReportAction = (reportId: number, action: string) => {
    console.log(`Report ${reportId}: ${action}`)
    // 実際の処理をここに実装
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "対応待ち"
      case "investigating":
        return "調査中"
      case "resolved":
        return "解決済み"
      case "dismissed":
        return "却下"
      default:
        return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return priority
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "job_posting":
        return <Building2 className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "profile":
        return <User className="h-4 w-4" />
      case "application":
        return <Flag className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || report.type === filterType
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">報告・通報管理</h1>
            <p className="text-sm text-gray-600">ユーザーからの報告と通報の管理・対応</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-red-100 text-red-800">
              未対応: {reports.filter((r) => r.status === "pending").length}件
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 統計カード */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総報告数</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Flag className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">対応待ち</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reports.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">調査中</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reports.filter((r) => r.status === "investigating").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">解決済み</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reports.filter((r) => r.status === "resolved").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルター・検索 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              フィルター・検索
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="タイトル・説明・報告者で検索"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="報告タイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのタイプ</SelectItem>
                  <SelectItem value="inappropriate_content">不適切コンテンツ</SelectItem>
                  <SelectItem value="harassment">ハラスメント</SelectItem>
                  <SelectItem value="fake_profile">偽プロフィール</SelectItem>
                  <SelectItem value="spam">スパム</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">対応待ち</SelectItem>
                  <SelectItem value="investigating">調査中</SelectItem>
                  <SelectItem value="resolved">解決済み</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 報告一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>報告一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(report.category)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge className={getPriorityColor(report.priority)} size="sm">
                            優先度: {getPriorityText(report.priority)}
                          </Badge>
                          <Badge className={getStatusColor(report.status)} size="sm">
                            {getStatusText(report.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>
                            <span className="font-medium">報告者:</span> {report.reportedBy}
                          </div>
                          <div>
                            <span className="font-medium">対象:</span> {report.targetUser}
                          </div>
                          <div>
                            <span className="font-medium">対象コンテンツ:</span> {report.targetContent}
                          </div>
                          <div>
                            <span className="font-medium">報告日時:</span> {report.createdAt}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleReportAction(report.id, "view")}>
                        <Eye className="h-4 w-4 mr-1" />
                        詳細
                      </Button>
                      {report.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "investigate")}
                            className="text-blue-600"
                          >
                            調査開始
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReportAction(report.id, "resolve")}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            解決
                          </Button>
                        </>
                      )}
                      {report.status === "investigating" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportAction(report.id, "resolve")}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          解決
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportAction(report.id, "dismiss")}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4 mr-1" />
                        却下
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>検索条件に一致する報告が見つかりません</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
