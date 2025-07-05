"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  Star,
  Target,
  Clock,
  BarChart3,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"   // Supabase browser client

export default function CompanyDashboard() {
  // ---------- Supabase‑backed state ----------

  type Trend = "up" | "down"

  interface KPIData {
    value: number
    change: number
    trend: Trend
  }

  interface KPIs {
    totalJobs: KPIData
    activeJobs: KPIData
    totalApplications: KPIData
    totalInterviews: KPIData
    totalHires: KPIData
    responseRate: KPIData
  }

  interface Application {
    id: string
    name: string
    job: string
    appliedDate: string
    status: string
  }

  interface Interview {
    id: string
    applicant: string
    job: string
    date: string
    time: string
    type: string
  }

  interface JobPerf {
    id: string
    title: string
    applications: number
    views: number
    conversionRate: number
    status: string
  }

  const [kpis, setKpis] = useState<KPIs>({
    totalJobs: { value: 0, change: 0, trend: "up" },
    activeJobs: { value: 0, change: 0, trend: "up" },
    totalApplications: { value: 0, change: 0, trend: "up" },
    totalInterviews: { value: 0, change: 0, trend: "up" },
    totalHires: { value: 0, change: 0, trend: "up" },
    responseRate: { value: 0, change: 0, trend: "up" },
  })
  const [recentApplications, setRecentApplications] = useState<Application[]>([])
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([])
  const [jobPerformance, setJobPerformance] = useState<JobPerf[]>([])

  // --- Get companyId from route params ---
  const params = useParams<{ companyId: string }>()
  const companyId = (params?.companyId ?? "") as string

  useEffect(() => {
    if (!companyId) return
    const fetchData = async () => {
      // 型エラー回避用 — 型が揃うまで any キャスト
      const sb = supabase as any
      // ------ KPI counts ------
      const [{ count: totalJobs }, { count: activeJobs }] = await Promise.all([
        sb.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        sb.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("is_active", true),
      ])

      const [{ count: totalApplications }, { count: totalHires }] = await Promise.all([
        sb.from("applications").select("id", { count: "exact", head: true }).eq("company_id", companyId),
        sb.from("applications").select("id", { count: "exact", head: true }).eq("company_id", companyId).eq("status", "合格"),
      ])

      // ------ Upcoming interviews (manual resolution) ------
      // 1) fetch raw interview records
      const { data: interviewRows, error: interviewError } = await sb
        .from("interviews")
        .select("id,applicant_id,job_id,date,start_time,type")
        .eq("company_id", companyId)
        .gte("date", new Date().toISOString().slice(0, 10))
        .order("date", { ascending: true })
      if (interviewError) console.error("Interview fetch error:", interviewError)

      // 2) fetch all related profiles based on user_id
      const applicantIds = Array.from(new Set((interviewRows ?? []).map((r: any) => r.applicant_id)))
      const { data: profileRows } = await sb
        .from("profiles")
        .select("user_id,full_name")
        .in("user_id", applicantIds)

      // 3) fetch job titles
      const jobIds = Array.from(new Set((interviewRows ?? []).map((r: any) => r.job_id)))
      const { data: interviewJobRows } = await sb
        .from("jobs")
        .select("id,title")
        .in("id", jobIds)

      // 4) map interviews with names/titles
      const realInterviews = (interviewRows ?? []).map((row: any) => {
        const profile = profileRows?.find((p: any) => p.user_id === row.applicant_id)
        const job = interviewJobRows?.find((j: any) => j.id === row.job_id)
        return {
          id: row.id,
          applicant: profile?.full_name ?? row.applicant_id,
          job: job?.title ?? row.job_id,
          date: new Date(row.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }),
          time: row.start_time,
          type: row.type,
        }
      })
      setUpcomingInterviews(realInterviews)

      // ------ Recent applications ------
      const { data: recentAppRows } = await sb
        .from("applications")
        .select("id,name,title,created_at,status")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(3)

      // ------ Job performance ------
      const { data: jobRows } = await sb
        .from("jobs")
        .select("id,title,views,applications,is_active")
        .eq("company_id", companyId)

      // (任意) 応答率を RPC で計算している例。なければ 0 を設定
      const { data: respStat } = await sb.rpc("calculate_response_rate", { p_company_id: companyId })
      const responseRate = respStat?.rate ?? 0

      // ---------- state 更新 ----------
      setKpis({
        totalJobs: { value: totalJobs ?? 0, change: 0, trend: "up" },
        activeJobs: { value: activeJobs ?? 0, change: 0, trend: "up" },
        totalApplications: { value: totalApplications ?? 0, change: 0, trend: "up" },
        totalInterviews: { value: interviewRows?.length ?? 0, change: 0, trend: "up" },
        totalHires: { value: totalHires ?? 0, change: 0, trend: "up" },
        responseRate: { value: responseRate, change: 0, trend: responseRate >= 0 ? "up" : "down" },
      })

      setRecentApplications(
        (recentAppRows ?? []).map((r: any) => ({
          id: r.id,
          name: r.name,
          job: r.title,
          appliedDate: new Date(r.created_at).toLocaleDateString("ja-JP"),
          status: r.status,
        }))
      )


      setJobPerformance(
        jobRows?.map((row: any) => ({
          id: row.id,
          title: row.title,
          applications: row.applications ?? 0,
          views: row.views ?? 0,
          conversionRate:
            row.views && row.views > 0
              ? Math.round(((row.applications ?? 0) / row.views) * 1000) / 10
              : 0,
          status: row.is_active ? "公開中" : "下書き",
        })) ?? []
      )
    }
    fetchData()
  }, [companyId])

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "書類選考中":
        return "bg-yellow-100 text-yellow-800"
      case "面談予定":
        return "bg-blue-100 text-blue-800"
      case "合格":
        return "bg-green-100 text-green-800"
      case "公開中":
        return "bg-green-100 text-green-800"
      case "下書き":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Group upcoming interviews by date
  const groupedInterviewsByDate = upcomingInterviews.reduce(
    (acc: Record<string, Interview[]>, interview) => {
      const key = interview.date
      if (!acc[key]) acc[key] = []
      acc[key].push(interview)
      return acc
    }, {}
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <p className="text-sm text-gray-600">採用活動の概要と最新情報</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href={companyId ? `/company/${companyId}/jobs/create` : "#"}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                新規求人作成
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総求人数</p>
                  <p className="text-2xl font-bold">{kpis.totalJobs.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalJobs.trend, kpis.totalJobs.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalJobs.trend)}`}>
                      {kpis.totalJobs.change > 0 ? "+" : ""}
                      {kpis.totalJobs.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総応募者数</p>
                  <p className="text-2xl font-bold">{kpis.totalApplications.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalApplications.trend, kpis.totalApplications.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalApplications.trend)}`}>
                      +{kpis.totalApplications.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">採用成功数</p>
                  <p className="text-2xl font-bold">{kpis.totalHires.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getTrendIcon(kpis.totalHires.trend, kpis.totalHires.change)}
                    <p className={`text-xs ${getTrendColor(kpis.totalHires.trend)}`}>
                      +{kpis.totalHires.change}% (30日)
                    </p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="grid grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">最新の応募者</CardTitle>
                <Link href={companyId ? `/company/${companyId}/applications` : "#"}>
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{application.name?.charAt(0) ?? ""}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{application.name}</h4>
                        <p className="text-xs text-gray-500">{application.job}</p>
                        <p className="text-xs text-gray-600">{application.appliedDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(application.status)} text-xs`}>
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Interviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">面談予定</CardTitle>
                <Link href={companyId ? `/company/${companyId}/interviews` : "#"}>
                  <Button variant="ghost" size="sm">
                    すべて見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(groupedInterviewsByDate).map(([date, interviews]) => (
                  <div key={date} className="space-y-2">
                    <h4 className="font-semibold text-sm">{date}</h4>
                    {interviews.map((iv) => (
                      <div key={iv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="text-sm font-medium">{iv.applicant}</h5>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{iv.time}</span>
                            <Badge variant="outline" className="text-xs ml-2">{iv.type}</Badge>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {iv.job}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ))}
                {upcomingInterviews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">予定されている面談はありません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <Link href={companyId ? `/company/${companyId}/jobs/create` : "#"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sm">新規求人作成</h3>
                <p className="text-xs text-gray-600 mt-1">新しい求人を作成</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={companyId ? `/company/${companyId}/applications` : "#"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sm">応募者管理</h3>
                <p className="text-xs text-gray-600 mt-1">応募者を確認・管理</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={companyId ? `/company/${companyId}/messages` : "#"}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-sm">メッセージ</h3>
                <p className="text-xs text-gray-600 mt-1">学生とのやり取り</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
