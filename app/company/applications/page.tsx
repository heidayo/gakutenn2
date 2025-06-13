"use client"; // ───── React hooks を使うためにクライアントコンポーネント化

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

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
}

export default function ApplicationsPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewing: 0,
    hired: 0,
    rejected: 0,
  });
  const [applications, setApplications] = useState<ApplicationRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { count: total } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true });
      setStats({ total: total ?? 0, pending: 0, interviewing: 0, hired: 0, rejected: 0 });

      const { data: rows, error } = await supabase
        .from("applications")
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching applications:', error);
      }

      setApplications((rows ?? []).map((r: any) => ({
        id: r.id,
        jobId: r.job_id,
        userId: r.user_id,
        availableDays: r.available_days,
        startDate: new Date(r.start_date).toLocaleDateString("ja-JP"),
        additionalInfo: r.additional_info,
        agreeTerms: r.agree_terms,
        createdAt: new Date(r.created_at).toLocaleDateString("ja-JP"),
        jobTitle: r.title, // fallback to ID if join fails
        name: r.name,     // fallback to user_id if join fails
        university: '-',     // placeholder
        location: '-',       // placeholder
      })));
    };

    fetchData();
  }, []);

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
                          <div>
                            利用規約同意: {applicant.agreeTerms ? "はい" : "いいえ"}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span>求人: {applicant.jobTitle}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/company/applications/${applicant.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        メッセージ
                      </Button>
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
