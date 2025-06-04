"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface ComplianceMetrics {
  overallScore: number
  gdprCompliance: number
  pippaCompliance: number
  dataSubjectRequests: number
  consentRate: number
  auditFindings: number
  lastUpdate: string
}

interface DataMapping {
  id: number
  dataType: string
  category: string
  purpose: string
  legalBasis: string
  retention: string
  riskLevel: "low" | "medium" | "high"
  lastUpdated: string
}

interface ConsentRecord {
  id: number
  userId: string
  category: string
  action: "opt_in" | "opt_out"
  timestamp: string
  ipAddress: string
}

export function useCompliance() {
  const { toast } = useToast()
  const [metrics, setMetrics] = useState<ComplianceMetrics>({
    overallScore: 0,
    gdprCompliance: 0,
    pippaCompliance: 0,
    dataSubjectRequests: 0,
    consentRate: 0,
    auditFindings: 0,
    lastUpdate: new Date().toISOString(),
  })
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([])
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // コンプライアンスメトリクス取得
  const fetchComplianceMetrics = useCallback(async () => {
    setIsLoading(true)

    try {
      // APIコール（モック）
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockMetrics: ComplianceMetrics = {
        overallScore: 87,
        gdprCompliance: 92,
        pippaCompliance: 85,
        dataSubjectRequests: 23,
        consentRate: 94.2,
        auditFindings: 3,
        lastUpdate: new Date().toISOString(),
      }

      setMetrics(mockMetrics)
    } catch (error) {
      toast({
        title: "メトリクス取得に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // データマッピング追加
  const addDataMapping = useCallback(
    async (mapping: Omit<DataMapping, "id" | "lastUpdated">) => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newMapping: DataMapping = {
          ...mapping,
          id: Date.now(),
          lastUpdated: new Date().toISOString().split("T")[0],
        }

        setDataMappings((prev) => [newMapping, ...prev])

        toast({
          title: "データマッピングを追加しました",
          description: "新しいデータマッピングが正常に登録されました",
          variant: "default",
        })

        return newMapping
      } catch (error) {
        toast({
          title: "追加に失敗しました",
          description: "もう一度お試しください",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // 同意記録追加
  const recordConsent = useCallback(
    async (consent: Omit<ConsentRecord, "id" | "timestamp">) => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 300))

        const newRecord: ConsentRecord = {
          ...consent,
          id: Date.now(),
          timestamp: new Date().toISOString(),
        }

        setConsentRecords((prev) => [newRecord, ...prev])

        // 同意率の更新
        setMetrics((prev) => ({
          ...prev,
          consentRate: consent.action === "opt_in" ? prev.consentRate + 0.1 : prev.consentRate - 0.1,
        }))

        toast({
          title: "同意記録を更新しました",
          description: `ユーザーの同意状況を記録しました`,
          variant: "default",
        })

        return newRecord
      } catch (error) {
        toast({
          title: "記録に失敗しました",
          description: "もう一度お試しください",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // コンプライアンススコア計算
  const calculateComplianceScore = useCallback(() => {
    const weights = {
      gdpr: 0.4,
      pippa: 0.3,
      consent: 0.2,
      audit: 0.1,
    }

    const auditPenalty = Math.min(metrics.auditFindings * 5, 20) // 監査指摘事項によるペナルティ
    const consentBonus = metrics.consentRate > 90 ? 5 : 0 // 高い同意率によるボーナス

    const score = Math.max(
      0,
      Math.min(
        100,
        metrics.gdprCompliance * weights.gdpr +
          metrics.pippaCompliance * weights.pippa +
          metrics.consentRate * weights.consent +
          (100 - auditPenalty) * weights.audit +
          consentBonus,
      ),
    )

    setMetrics((prev) => ({
      ...prev,
      overallScore: Math.round(score),
    }))
  }, [metrics])

  // 監査レポート生成
  const generateAuditReport = useCallback(async () => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const reportData = {
        generatedAt: new Date().toISOString(),
        metrics,
        dataMappings,
        consentRecords: consentRecords.slice(0, 100), // 最新100件
        recommendations: ["データ保護影響評価の定期実施", "同意取得プロセスの改善", "第三者データ処理契約の見直し"],
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
  }, [metrics, dataMappings, consentRecords, toast])

  // データ漏洩通知
  const reportDataBreach = useCallback(
    async (breachDetails: {
      description: string
      affectedUsers: number
      severity: "low" | "medium" | "high"
      containmentActions: string
    }) => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 監督当局への通知（72時間以内）
        const notificationData = {
          reportedAt: new Date().toISOString(),
          ...breachDetails,
          reportingObligation: "GDPR Article 33",
          notificationDeadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
        }

        // 監査指摘事項の増加
        setMetrics((prev) => ({
          ...prev,
          auditFindings:
            prev.auditFindings + (breachDetails.severity === "high" ? 3 : breachDetails.severity === "medium" ? 2 : 1),
        }))

        toast({
          title: "データ漏洩を報告しました",
          description: "監督当局への通知手続きを開始しました",
          variant: "default",
        })

        return notificationData
      } catch (error) {
        toast({
          title: "報告に失敗しました",
          description: "もう一度お試しください",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // 初期化
  useEffect(() => {
    fetchComplianceMetrics()
  }, [fetchComplianceMetrics])

  // スコア再計算
  useEffect(() => {
    calculateComplianceScore()
  }, [calculateComplianceScore])

  return {
    metrics,
    dataMappings,
    consentRecords,
    isLoading,
    fetchComplianceMetrics,
    addDataMapping,
    recordConsent,
    generateAuditReport,
    reportDataBreach,
  }
}
