"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Users, Search, Clock, CheckCircle, AlertTriangle, Download, Eye, Calendar, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DataSubjectRequestsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // データ主体権利要求
  const [dataRequests, setDataRequests] = useState([
    {
      id: 1,
      requestId: "DSR-2024-001",
      userType: "student",
      requesterName: "田中太郎",
      requesterEmail: "tanaka@university.ac.jp",
      requestType: "access",
      description: "自分の個人データの開示を求めます",
      submittedAt: "2024-06-02 16:30:15",
      dueDate: "2024-07-02",
      status: "pending",
      priority: "medium",
      assignedTo: "データ保護責任者",
      documents: ["身分証明書.pdf"],
      notes: "本人確認完了済み",
    },
    {
      id: 2,
      requestId: "DSR-2024-002",
      userType: "company",
      requesterName: "佐藤花子",
      requesterEmail: "sato@techstart.com",
      requestType: "deletion",
      description: "退職に伴い、個人データの削除を要求します",
      submittedAt: "2024-06-01 14:20:10",
      dueDate: "2024-07-01",
      status: "in_progress",
      priority: "high",
      assignedTo: "システム管理者",
      documents: ["退職証明書.pdf", "削除要求書.pdf"],
      notes: "システムからの削除作業中",
    },
    {
      id: 3,
      requestId: "DSR-2024-003",
      userType: "student",
      requesterName: "山田次郎",
      requesterEmail: "yamada@university.ac.jp",
      requestType: "rectification",
      description: "登録されている住所情報に誤りがあるため訂正を求めます",
      submittedAt: "2024-05-30 10:15:22",
      dueDate: "2024-06-29",
      status: "completed",
      priority: "low",
      assignedTo: "データ管理者",
      documents: ["住民票.pdf"],
      notes: "住所情報を正しく更新完了",
    },
    {
      id: 4,
      requestId: "DSR-2024-004",
      userType: "student",
      requesterName: "鈴木美咲",
      requesterEmail: "suzuki@university.ac.jp",
      requestType: "portability",
      description: "他のサービスへの移行のため、データの可搬性を求めます",
      submittedAt: "2024-05-28 18:45:33",
      dueDate: "2024-06-27",
      status: "rejected",
      priority: "medium",
      assignedTo: "法務担当者",
      documents: ["移行先サービス証明書.pdf"],
      notes: "技術的制約により対応不可",
    },
  ])

  // 要求処理
  const handleRequestAction = async (requestId: number, action: string, note?: string) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDataRequests((prev) =>
        prev.map((request) => {
          if (request.id === requestId) {
            let newStatus = request.status
            switch (action) {
              case "approve":
                newStatus = "in_progress"
                break
              case "complete":
                newStatus = "completed"
                break
              case "reject":
                newStatus = "rejected"
                break
            }
            return {
              ...request,
              status: newStatus,
              notes: note || request.notes,
            }
          }
          return request
        }),
      )

      toast({
        title: "要求を処理しました",
        description: `データ主体権利要求を${action}しました`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "処理に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 詳細表示
  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setIsDetailDialogOpen(true)
  }

  // エクスポート
  const exportRequests = () => {
    const csvData = dataRequests
      .map((request) =>
        [
          request.requestId,
          request.requesterName,
          request.requesterEmail,
          request.requestType,
          request.status,
          request.priority,
          request.submittedAt,
          request.dueDate,
          request.assignedTo,
        ].join(","),
      )
      .join("\n")

    const blob = new Blob(
      [`要求ID,要求者名,メールアドレス,要求タイプ,ステータス,優先度,提出日時,期限,担当者\n${csvData}`],
      { type: "text/csv" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-subject-requests-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "要求履歴をエクスポートしました",
      description: "CSVファイルがダウンロードされました",
      variant: "default",
    })
  }

  // フィルタリング
  const filteredRequests = dataRequests.filter((request) => {
    const matchesSearch =
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesType = filterType === "all" || request.requestType === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "保留中"
      case "in_progress":
        return "処理中"
      case "completed":
        return "完了"
      case "rejected":
        return "拒否"
      default:
        return status
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

  const getRequestTypeText = (type: string) => {
    switch (type) {
      case "access":
        return "アクセス権"
      case "deletion":
        return "削除権"
      case "rectification":
        return "訂正権"
      case "portability":
        return "可搬性"
      case "restriction":
        return "処理制限"
      case "objection":
        return "異議申立"
      default:
        return type
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

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">データ主体権利要求</h1>
            <p className="text-sm text-gray-600">GDPR・個人情報保護法に基づく権利要求の管理</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportRequests}>
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
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
                  <p className="text-sm font-medium text-gray-600">総要求数</p>
                  <p className="text-2xl font-bold">{dataRequests.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">保留中</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {dataRequests.filter((r) => r.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">処理中</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dataRequests.filter((r) => r.status === "in_progress").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">完了</p>
                  <p className="text-2xl font-bold text-green-600">
                    {dataRequests.filter((r) => r.status === "completed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="要求者名、メールアドレス、要求IDで検索"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">保留中</SelectItem>
                  <SelectItem value="in_progress">処理中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="rejected">拒否</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="要求タイプ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="access">アクセス権</SelectItem>
                  <SelectItem value="deletion">削除権</SelectItem>
                  <SelectItem value="rectification">訂正権</SelectItem>
                  <SelectItem value="portability">可搬性</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 要求一覧 */}
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const daysUntilDue = getDaysUntilDue(request.dueDate)
            const isOverdue = daysUntilDue < 0
            const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0

            return (
              <Card key={request.id} className={isOverdue ? "border-red-200 bg-red-50" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <h3 className="text-lg font-semibold">{request.requestId}</h3>
                        <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority === "high" ? "高" : request.priority === "medium" ? "中" : "低"}
                        </Badge>
                        <Badge className={getUserTypeColor(request.userType)}>
                          {request.userType === "student" ? "学生" : "企業"}
                        </Badge>
                        {isOverdue && <Badge className="bg-red-100 text-red-800">期限超過</Badge>}
                        {isUrgent && <Badge className="bg-orange-100 text-orange-800">緊急</Badge>}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">要求者情報</h4>
                          <p className="text-sm">
                            <span className="font-medium">{request.requesterName}</span>
                          </p>
                          <p className="text-sm text-gray-600">{request.requesterEmail}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-gray-700 mb-2">要求内容</h4>
                          <p className="text-sm">
                            <span className="font-medium">{getRequestTypeText(request.requestType)}</span>
                          </p>
                          <p className="text-sm text-gray-600">{request.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">提出日時:</span>
                          <p className="text-gray-600 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {request.submittedAt}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">期限:</span>
                          <p
                            className={`mt-1 flex items-center ${isOverdue ? "text-red-600" : isUrgent ? "text-orange-600" : "text-gray-600"}`}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {request.dueDate}
                            {isOverdue && ` (${Math.abs(daysUntilDue)}日超過)`}
                            {isUrgent && ` (残り${daysUntilDue}日)`}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">担当者:</span>
                          <p className="text-gray-600 mt-1">{request.assignedTo}</p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mt-4">
                          <span className="font-semibold text-gray-700 text-sm">備考:</span>
                          <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(request)}>
                        <Eye className="h-4 w-4 mr-2" />
                        詳細
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleRequestAction(request.id, "approve")}
                            disabled={isLoading}
                          >
                            承認
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestAction(request.id, "reject")}
                            disabled={isLoading}
                          >
                            拒否
                          </Button>
                        </>
                      )}
                      {request.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() => handleRequestAction(request.id, "complete")}
                          disabled={isLoading}
                        >
                          完了
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredRequests.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">要求が見つかりません</h3>
                <p className="text-gray-500">検索条件を変更してください</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 詳細ダイアログ */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>要求詳細: {selectedRequest?.requestId}</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>要求者名</Label>
                    <p className="text-sm font-medium">{selectedRequest.requesterName}</p>
                  </div>
                  <div>
                    <Label>メールアドレス</Label>
                    <p className="text-sm font-medium">{selectedRequest.requesterEmail}</p>
                  </div>
                </div>

                <div>
                  <Label>要求内容</Label>
                  <p className="text-sm font-medium">{getRequestTypeText(selectedRequest.requestType)}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>提出日時</Label>
                    <p className="text-sm font-medium">{selectedRequest.submittedAt}</p>
                  </div>
                  <div>
                    <Label>期限</Label>
                    <p className="text-sm font-medium">{selectedRequest.dueDate}</p>
                  </div>
                </div>

                <div>
                  <Label>添付書類</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedRequest.documents.map((doc: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>備考</Label>
                  <Textarea value={selectedRequest.notes} readOnly className="mt-1" />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                    閉じる
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
