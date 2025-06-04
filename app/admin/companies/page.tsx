"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, UserCheck, Mail, Calendar, Building2, Eye, Ban } from "lucide-react"

export default function CompanyManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [weekendFilter, setWeekendFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<any>(null)

  // 企業ユーザー一覧
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "株式会社テックスタート",
      email: "hr@techstart.com",
      industry: "IT・ソフトウェア",
      size: "51-100名",
      registeredDate: "2024-04-01",
      lastLogin: "2024-06-02",
      status: "approved",
      jobsPosted: 12,
      applications: 156,
      jobTypes: ["engineer", "design"],
      locations: ["tokyo", "remote"],
      weekendWork: "weekends",
    },
    {
      id: 2,
      name: "株式会社イノベーション",
      email: "recruit@innovation.com",
      industry: "コンサルティング",
      size: "101-500名",
      registeredDate: "2024-05-10",
      lastLogin: "2024-06-01",
      status: "pending",
      jobsPosted: 0,
      applications: 0,
      jobTypes: ["sales", "marketing"],
      locations: ["tokyo", "osaka"],
      weekendWork: "weekdays",
    },
    {
      id: 3,
      name: "株式会社フューチャー",
      email: "contact@future.com",
      industry: "金融",
      size: "501-1000名",
      registeredDate: "2024-03-15",
      lastLogin: "2024-05-30",
      status: "approved",
      jobsPosted: 8,
      applications: 89,
      jobTypes: ["engineer", "hr"],
      locations: ["tokyo", "nagoya"],
      weekendWork: "weekdays",
    },
  ])

  // 企業ユーザー操作
  const handleCompanyAction = async (companyId: number, action: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCompanies((prev) =>
      prev.map((company) => {
        if (company.id === companyId) {
          switch (action) {
            case "approve":
              return { ...company, status: "approved" }
            case "suspend":
              return { ...company, status: "suspended" }
            case "view":
              alert(`${company.name}の詳細を表示します`)
              break
          }
        }
        return company
      }),
    )
    setIsLoading(false)
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = companyFilter === "all" || company.status === companyFilter
    const matchesJobType = jobTypeFilter === "all" || company.jobTypes.includes(jobTypeFilter)
    const matchesLocation = locationFilter === "all" || company.locations.includes(locationFilter)
    const matchesWeekend = weekendFilter === "all" || company.weekendWork === weekendFilter

    return matchesSearch && matchesStatus && matchesJobType && matchesLocation && matchesWeekend
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "アクティブ"
      case "approved":
        return "承認済み"
      case "pending":
        return "承認待ち"
      case "suspended":
        return "停止中"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">企業ユーザー管理</h1>
            <p className="text-sm text-gray-600">企業アカウントの管理と監視</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 企業ユーザー管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                企業ユーザー
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="企業名・業界で検索"
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="職種" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="engineer">エンジニア</SelectItem>
                    <SelectItem value="sales">営業</SelectItem>
                    <SelectItem value="marketing">マーケティング</SelectItem>
                    <SelectItem value="design">デザイン</SelectItem>
                    <SelectItem value="hr">人事</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="勤務地" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="tokyo">東京</SelectItem>
                    <SelectItem value="osaka">大阪</SelectItem>
                    <SelectItem value="nagoya">名古屋</SelectItem>
                    <SelectItem value="fukuoka">福岡</SelectItem>
                    <SelectItem value="remote">リモート</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={weekendFilter} onValueChange={setWeekendFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="土日可否" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="weekdays">平日のみ</SelectItem>
                    <SelectItem value="weekends">土日可</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={companyFilter} onValueChange={setCompanyFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="approved">承認済み</SelectItem>
                    <SelectItem value="pending">承認待ち</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{company.name}</h4>
                        <p className="text-sm text-gray-600">
                          {company.industry} • {company.size}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{company.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>登録: {company.registeredDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div>求人: {company.jobsPosted}件</div>
                        <div>応募: {company.applications}件</div>
                        <div className="text-xs text-gray-500">最終ログイン: {company.lastLogin}</div>
                      </div>
                      <Badge className={getStatusColor(company.status)}>{getStatusText(company.status)}</Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompanyAction(company.id, "view")}
                          disabled={isLoading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {company.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600"
                            onClick={() => handleCompanyAction(company.id, "approve")}
                            disabled={isLoading}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompanyAction(company.id, "suspend")}
                          disabled={isLoading}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCompanies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>検索条件に一致する企業が見つかりません</p>
                </div>
              )}
              {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/admin/jobs?company=${selectedCompany.id}`, "_blank")}
                        >
                          求人一覧を見る
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)}>
                          ✕
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">業界</label>
                          <p className="text-sm">{selectedCompany.industry}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">従業員数</label>
                          <p className="text-sm">{selectedCompany.size}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">メールアドレス</label>
                          <p className="text-sm">{selectedCompany.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">登録日</label>
                          <p className="text-sm">{selectedCompany.registeredDate}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">最終ログイン</label>
                          <p className="text-sm">{selectedCompany.lastLogin}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">ステータス</label>
                          <Badge className={getStatusColor(selectedCompany.status)}>
                            {getStatusText(selectedCompany.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">投稿求人数</label>
                          <button
                            className="text-sm text-blue-600 hover:underline cursor-pointer"
                            onClick={() => window.open(`/admin/jobs?company=${selectedCompany.id}`, "_blank")}
                          >
                            {selectedCompany.jobsPosted}件
                          </button>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">受信応募数</label>
                          <p className="text-sm">{selectedCompany.applications}件</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">募集職種</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedCompany.jobTypes.map((type: string) => (
                            <Badge key={type} variant="outline">
                              {type === "engineer"
                                ? "エンジニア"
                                : type === "sales"
                                  ? "営業"
                                  : type === "marketing"
                                    ? "マーケティング"
                                    : type === "design"
                                      ? "デザイン"
                                      : type === "hr"
                                        ? "人事"
                                        : type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">勤務地</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedCompany.locations.map((location: string) => (
                            <Badge key={location} variant="outline">
                              {location === "tokyo"
                                ? "東京"
                                : location === "osaka"
                                  ? "大阪"
                                  : location === "nagoya"
                                    ? "名古屋"
                                    : location === "fukuoka"
                                      ? "福岡"
                                      : location === "remote"
                                        ? "リモート"
                                        : location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">土日勤務</label>
                        <p className="text-sm">{selectedCompany.weekendWork === "weekdays" ? "平日のみ" : "土日可"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
