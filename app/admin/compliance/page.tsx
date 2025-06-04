"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Settings,
  Database,
  UserCheck,
  Scale,
  Bell,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function CompliancePage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // コンプライアンス統計
  const [complianceStats, setComplianceStats] = useState({
    overallScore: 87,
    gdprCompliance: 92,
    pippaCompliance: 85,
    dataSubjectRequests: 23,
    pendingRequests: 5,
    consentRate: 94.2,
    dataBreaches: 0,
    auditFindings: 3,
  })

  // 最近のアクティビティ
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "data_request",
      title: "データアクセス要求",
      description: "学生からの個人データアクセス要求を受理",
      timestamp: "2024-06-02 16:30:15",
      status: "pending",
      priority: "medium",
    },
    {
      id: 2,
      type: "consent_update",
      title: "同意設定更新",
      description: "マーケティング目的の同意率が95%に向上",
      timestamp: "2024-06-02 14:20:10",
      status: "completed",
      priority: "low",
    },
    {
      id: 3,
      type: "audit_finding",
      title: "監査指摘事項",
      description: "データ保存期間の設定に軽微な不備を発見",
      timestamp: "2024-06-02 10:15:22",
      status: "in_progress",
      priority: "high",
    },
    {
      id: 4,
      type: "policy_update",
      title: "プライバシーポリシー更新",
      description: "新機能追加に伴うプライバシーポリシーの改訂",
      timestamp: "2024-06-01 18:45:33",
      status: "completed",
      priority: "medium",
    },
  ])

  // コンプライアンス要件
  const [complianceRequirements, setComplianceRequirements] = useState([
    {
      id: 1,
      category: "GDPR",
      requirement: "データ処理の合法的根拠",
      status: "compliant",
      lastCheck: "2024-06-01",
      nextReview: "2024-09-01",
    },
    {
      id: 2,
      category: "GDPR",
      requirement: "データ主体の権利対応",
      status: "compliant",
      lastCheck: "2024-06-02",
      nextReview: "2024-08-02",
    },
    {
      id: 3,
      category: "個人情報保護法",
      requirement: "個人情報の適正取得",
      status: "compliant",
      lastCheck: "2024-05-30",
      nextReview: "2024-08-30",
    },
    {
      id: 4,
      category: "GDPR",
      requirement: "データ保護影響評価",
      status: "action_required",
      lastCheck: "2024-05-15",
      nextReview: "2024-06-15",
    },
    {
      id: 5,
      category: "個人情報保護法",
      requirement: "第三者提供の同意",
      status: "under_review",
      lastCheck: "2024-06-01",
      nextReview: "2024-07-01",
    },
  ])

  // 監査レポート生成
  const generateAuditReport = async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reportData = {
        generatedAt: new Date().toISOString(),
        complianceScore: complianceStats.overallScore,
        gdprStatus: complianceStats.gdprCompliance,
        pippaStatus: complianceStats.pippaCompliance,
        dataSubjectRequests: complianceStats.dataSubjectRequests,
        consentMetrics: complianceStats.consentRate,
        auditFindings: complianceStats.auditFindings,
        requirements: complianceRequirements,
        activities: recentActivities,
      }

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `compliance-audit-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "監査レポートを生成しました",
        description: "コンプライアンス監査レポートがダウンロードされました",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "レポート生成に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800"
      case "action_required":
        return "bg-red-100 text-red-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "compliant":
        return "準拠"
      case "action_required":
        return "要対応"
      case "under_review":
        return "確認中"
      case "completed":
        return "完了"
      case "pending":
        return "保留中"
      case "in_progress":
        return "進行中"
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
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "data_request":
        return <UserCheck className="h-4 w-4" />
      case "consent_update":
        return <CheckCircle className="h-4 w-4" />
      case "audit_finding":
        return <AlertTriangle className="h-4 w-4" />
      case "policy_update":
        return <FileText className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">コンプライアンス監査</h1>
            <p className="text-sm text-gray-600">GDPR・個人情報保護法対応の包括的監査システム</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={generateAuditReport} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "生成中..." : "監査レポート"}
            </Button>
            <Link href="/admin/compliance/settings">
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                設定
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* コンプライアンススコア */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総合コンプライアンススコア</p>
                  <p className={`text-3xl font-bold ${getScoreColor(complianceStats.overallScore)}`}>
                    {complianceStats.overallScore}%
                  </p>
                  <Progress value={complianceStats.overallScore} className="mt-2" />
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Scale className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">GDPR準拠率</p>
                  <p className={`text-3xl font-bold ${getScoreColor(complianceStats.gdprCompliance)}`}>
                    {complianceStats.gdprCompliance}%
                  </p>
                  <Progress value={complianceStats.gdprCompliance} className="mt-2" />
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
                  <p className="text-sm font-medium text-gray-600">個人情報保護法準拠率</p>
                  <p className={`text-3xl font-bold ${getScoreColor(complianceStats.pippaCompliance)}`}>
                    {complianceStats.pippaCompliance}%
                  </p>
                  <Progress value={complianceStats.pippaCompliance} className="mt-2" />
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">同意取得率</p>
                  <p className="text-3xl font-bold text-green-600">{complianceStats.consentRate}%</p>
                  <Progress value={complianceStats.consentRate} className="mt-2" />
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 要対応事項 */}
        {complianceRequirements.filter((req) => req.status === "action_required").length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-red-800">要対応事項があります</h4>
                  <p className="text-red-700">
                    {complianceRequirements.filter((req) => req.status === "action_required").length}
                    件のコンプライアンス要件で対応が必要です
                  </p>
                </div>
                <Link href="/admin/compliance/requirements">
                  <Button size="sm" variant="outline">
                    詳細確認
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* クイックアクセス */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                クイックアクセス
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/compliance/data-mapping">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Database className="h-6 w-6 mb-2" />
                    <span className="text-sm">データマッピング</span>
                  </Button>
                </Link>
                <Link href="/admin/compliance/consent">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <UserCheck className="h-6 w-6 mb-2" />
                    <span className="text-sm">同意管理</span>
                  </Button>
                </Link>
                <Link href="/admin/compliance/requests">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">権利要求</span>
                  </Button>
                </Link>
                <Link href="/admin/compliance/dpia">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <Shield className="h-6 w-6 mb-2" />
                    <span className="text-sm">DPIA</span>
                  </Button>
                </Link>
                <Link href="/admin/compliance/breach">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span className="text-sm">漏洩管理</span>
                  </Button>
                </Link>
                <Link href="/admin/compliance/reports">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">レポート</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 最近のアクティビティ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                最近のアクティビティ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm">{activity.title}</h4>
                        <Badge className={getStatusColor(activity.status)}>{getStatusText(activity.status)}</Badge>
                        <Badge className={getPriorityColor(activity.priority)}>
                          {activity.priority === "high" ? "高" : activity.priority === "medium" ? "中" : "低"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* コンプライアンス要件 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              コンプライアンス要件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceRequirements.map((requirement) => (
                <div key={requirement.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            requirement.category === "GDPR"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }
                        >
                          {requirement.category}
                        </Badge>
                        <Badge className={getStatusColor(requirement.status)}>
                          {getStatusText(requirement.status)}
                        </Badge>
                      </div>
                      <h4 className="font-semibold mt-2">{requirement.requirement}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>最終確認: {requirement.lastCheck}</span>
                        <span>次回確認: {requirement.nextReview}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        詳細
                      </Button>
                      {requirement.status === "action_required" && <Button size="sm">対応開始</Button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 統計サマリー */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">データ主体権利要求</p>
                  <p className="text-2xl font-bold">{complianceStats.dataSubjectRequests}</p>
                  <p className="text-sm text-gray-500">保留中: {complianceStats.pendingRequests}件</p>
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
                  <p className="text-sm font-medium text-gray-600">データ漏洩件数</p>
                  <p className="text-2xl font-bold text-green-600">{complianceStats.dataBreaches}</p>
                  <p className="text-sm text-gray-500">過去30日間</p>
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
                  <p className="text-sm font-medium text-gray-600">監査指摘事項</p>
                  <p className="text-2xl font-bold text-yellow-600">{complianceStats.auditFindings}</p>
                  <p className="text-sm text-gray-500">対応中</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
