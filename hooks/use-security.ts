"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface SecurityEvent {
  id: number
  type: string
  severity: "high" | "medium" | "low"
  timestamp: string
  description: string
  resolved: boolean
}

interface SecurityMetrics {
  threatCount: number
  blockedAttempts: number
  riskScore: number
  lastUpdate: string
}

export function useSecurity() {
  const { toast } = useToast()
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    threatCount: 0,
    blockedAttempts: 0,
    riskScore: 0,
    lastUpdate: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(false)

  // セキュリティイベントの監視
  const monitorSecurityEvents = useCallback(async () => {
    setIsLoading(true)

    try {
      // APIコール（モック）
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 新しいセキュリティイベントをシミュレート
      const newEvent: SecurityEvent = {
        id: Date.now(),
        type: "suspicious_login",
        severity: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        timestamp: new Date().toISOString(),
        description: "不審なログイン試行を検出しました",
        resolved: false,
      }

      setEvents((prev) => [newEvent, ...prev.slice(0, 9)]) // 最新10件を保持

      // メトリクス更新
      setMetrics((prev) => ({
        ...prev,
        threatCount: prev.threatCount + 1,
        lastUpdate: new Date().toISOString(),
      }))

      // 高リスクイベントの場合は通知
      if (newEvent.severity === "high") {
        toast({
          title: "高リスクセキュリティイベント",
          description: newEvent.description,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Security monitoring error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // イベント解決
  const resolveEvent = useCallback(
    (eventId: number) => {
      setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, resolved: true } : event)))

      toast({
        title: "セキュリティイベントを解決しました",
        description: "イベントを確認済みにしました",
        variant: "default",
      })
    },
    [toast],
  )

  // ブロック実行
  const blockThreat = useCallback(
    async (threatId: number) => {
      setIsLoading(true)

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))

        setMetrics((prev) => ({
          ...prev,
          blockedAttempts: prev.blockedAttempts + 1,
        }))

        toast({
          title: "脅威をブロックしました",
          description: "不正アクセスを正常にブロックしました",
          variant: "default",
        })
      } catch (error) {
        toast({
          title: "ブロックに失敗しました",
          description: "もう一度お試しください",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // リスクスコア計算
  const calculateRiskScore = useCallback(() => {
    const unresolvedEvents = events.filter((event) => !event.resolved)
    const highRiskEvents = unresolvedEvents.filter((event) => event.severity === "high").length
    const mediumRiskEvents = unresolvedEvents.filter((event) => event.severity === "medium").length
    const lowRiskEvents = unresolvedEvents.filter((event) => event.severity === "low").length

    const score = Math.min(100, highRiskEvents * 30 + mediumRiskEvents * 15 + lowRiskEvents * 5)

    setMetrics((prev) => ({
      ...prev,
      riskScore: score,
    }))
  }, [events])

  // 自動監視の開始
  useEffect(() => {
    const interval = setInterval(monitorSecurityEvents, 30000) // 30秒ごと
    return () => clearInterval(interval)
  }, [monitorSecurityEvents])

  // リスクスコアの再計算
  useEffect(() => {
    calculateRiskScore()
  }, [events, calculateRiskScore])

  return {
    events,
    metrics,
    isLoading,
    resolveEvent,
    blockThreat,
    monitorSecurityEvents,
  }
}
