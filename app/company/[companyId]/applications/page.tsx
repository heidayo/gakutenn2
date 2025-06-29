"use client"; // ───── React hooks を使うためにクライアントコンポーネント化

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Calendar,
  Eye,
  MessageSquare,
  GraduationCap,
  MapPin,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

interface ApplicationRow {
  id: string;
  jobId: string;
  userId: string;
  availableDays: string[];
  startDate: string;
  additionalInfo: string | null;
  agreeTerms: boolean;
  createdAt: string;
  jobTitle: string;
  name: string;
  university: string;
  location: string;
  status: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "書類選考中":
      return <Clock className="h-4 w-4" />;
    case "面談予定":
      return <Calendar className="h-4 w-4" />;
    case "採用":
      return <CheckCircle className="h-4 w-4" />;
    case "不採用":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "書類選考中":
      return "bg-yellow-100 text-yellow-800";
    case "面談予定":
      return "bg-blue-100 text-blue-800";
    case "採用":
      return "bg-green-100 text-green-800";
    case "不採用":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ApplicationsPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewing: 0,
    hired: 0,
    rejected: 0,
  });
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  const params = useParams<{ companyId: string }>()
  const companyId = (params?.companyId ?? "") as string

  useEffect(() => {
    if (!companyId) return    // companyId 未取得時は待機

    const fetchData = async () => {
      const { count: total } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("company_id", companyId)
      setStats({ total: total ?? 0, pending: 0, interviewing: 0, hired: 0, rejected: 0 })

      const { data: rows, error } = await supabase
        .from("applications")
        .select(`
          id,
          job_id,
          user_id,
          available_days,
          start_date,
          additional_info,
          agree_terms,
          created_at,
          name,
          title,
          status,
          next_step,
          next_date
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching applications:", error)
      }

      setApplications(
        (rows ?? []).map((r: any) => ({
          id: r.id,
          status: r.status,
          jobId: r.job_id,
          userId: r.user_id,
          availableDays: r.available_days ?? [],
          startDate: new Date(r.start_date).toLocaleDateString("ja-JP"),
          additionalInfo: r.additional_info,
          agreeTerms: r.agree_terms,
          createdAt: new Date(r.created_at).toLocaleDateString("ja-JP"),
          jobTitle: r.title ?? "-",
          name: r.name ?? "名前未登録",
          university: "-",
          location: "-",
        }))
      )
    }

    fetchData()
  }, [companyId])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">応募者管理</h1>
            <p className="text-sm text-gray-600">求人への応募者を確認・管理できます</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              CSV出力
            </Button>
            <Button variant="outline">
              フィルター
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">総応募者数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">選考中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.interviewing}</div>
              <div className="text-sm text-gray-600">面談中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
              <div className="text-sm text-gray-600">採用</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-gray-600">不採用</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="応募者名、大学名で検索..." className="pl-10" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">選考中</SelectItem>
                  <SelectItem value="interviewing">面談中</SelectItem>
                  <SelectItem value="hired">採用</SelectItem>
                  <SelectItem value="rejected">不採用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>応募者一覧 ({applications.length}件)</CardTitle>
              {/* Optional: add select-all or actions here */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((applicant) => (
                <div
                  key={applicant.id}
                  className="border rounded-lg p-4 transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{applicant.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${getStatusColor(applicant.status)} rounded-full px-3 py-1 flex items-center space-x-1 text-sm`}>
                            {getStatusIcon(applicant.status)}
                            <span className="text-sm">{applicant.status}</span>
                          </Badge>
                        </div>
                        <div className="mb-1">
                          <h3 className="font-semibold">{applicant.name}</h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-1">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{applicant.university}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{applicant.location}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            応募日: {applicant.createdAt}
                          </div>
                          <div>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            参加可能日: {applicant.availableDays.join(", ")}
                          </div>
                          <div>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            開始希望日: {applicant.startDate}
                          </div>
                          <div>
                            追加情報: {applicant.additionalInfo ?? "なし"}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span>求人: {applicant.jobTitle}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={companyId ? `/company/${companyId}/applications/${applicant.id}` : "#"}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Button>
                      </Link>
                      <Link href={companyId ? `/company/${companyId}/messages` : "#"}>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          メッセージ
                        </Button>
                      </Link>
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
