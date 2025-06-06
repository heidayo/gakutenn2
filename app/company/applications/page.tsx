import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Download,
  Star,
  Calendar,
  Building2,
  GraduationCap,
  MapPin,
  ChevronRight,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function ApplicationsPage() {
  const stats = {
    total: 45,
    pending: 18,
    interviewing: 12,
    hired: 8,
    rejected: 7,
  }

  const applications = [
    {
      id: 1,
      name: "田中 太郎",
      university: "東京大学 経済学部 2年生",
      location: "東京都",
      appliedDate: "2024年6月1日",
      jobTitle: "Webマーケティングアシスタント",
      status: "書類選考中",
      statusColor: "bg-yellow-100 text-yellow-800",
      rating: 4.3,
      profileCompletion: 85,
      hasInterview: false,
      matchScore: 92,
    },
    {
      id: 2,
      name: "佐藤 花子",
      university: "早稲田大学 商学部 3年生",
      location: "東京都",
      appliedDate: "2024年5月30日",
      jobTitle: "SNS運用サポート",
      status: "面談予定",
      statusColor: "bg-blue-100 text-blue-800",
      rating: 4.6,
      profileCompletion: 92,
      hasInterview: true,
      matchScore: 88,
    },
    {
      id: 3,
      name: "山田 次郎",
      university: "慶應義塾大学 理工学部 2年生",
      location: "神奈川県",
      appliedDate: "2024年5月28日",
      jobTitle: "データ分析補助",
      status: "合格",
      statusColor: "bg-green-100 text-green-800",
      rating: 4.8,
      profileCompletion: 78,
      hasInterview: false,
      matchScore: 95,
    },
    {
      id: 4,
      name: "鈴木 美咲",
      university: "上智大学 文学部 1年生",
      location: "東京都",
      appliedDate: "2024年5月25日",
      jobTitle: "コンテンツ制作アシスタント",
      status: "不合格",
      statusColor: "bg-red-100 text-red-800",
      rating: 3.8,
      profileCompletion: 65,
      hasInterview: false,
      matchScore: 72,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "書類選考中":
        return <Clock className="h-4 w-4" />
      case "面談予定":
        return <Calendar className="h-4 w-4" />
      case "合格":
        return <CheckCircle className="h-4 w-4" />
      case "不合格":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100"
    if (score >= 80) return "text-blue-600 bg-blue-100"
    if (score >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

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
              <Download className="h-4 w-4 mr-2" />
              CSV出力
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
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
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="求人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての求人</SelectItem>
                  <SelectItem value="marketing">Webマーケティング</SelectItem>
                  <SelectItem value="sns">SNS運用</SelectItem>
                  <SelectItem value="data">データ分析</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>応募者一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((applicant) => (
                <div
                  key={applicant.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{applicant.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold">{applicant.name}</h3>
                          <Badge className={applicant.statusColor}>
                            {getStatusIcon(applicant.status)}
                            <span className="ml-1">{applicant.status}</span>
                          </Badge>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getMatchScoreColor(applicant.matchScore)}`}
                          >
                            マッチ度 {applicant.matchScore}%
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{applicant.university}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{applicant.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>応募日: {applicant.appliedDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{applicant.jobTitle}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold">{applicant.rating}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            プロフィール完成度: {applicant.profileCompletion}%
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
                      <ChevronRight className="h-5 w-5 text-gray-400" />
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
