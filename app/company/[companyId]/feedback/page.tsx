"use client"

import { useState, useMemo, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star, Search, Filter, Plus, Calendar as CalendarIcon, User, Briefcase, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useParams } from "next/navigation"
import { ja } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { addDays } from "date-fns"
import Link from "next/link"

type FeedbackStatus = "draft" | "sent" | "scheduled"

interface Feedback {
  id: string;
  studentName: string;
  overallRating: number;
  overallComment: string;
  createdAt: Date;
  updatedAt: Date;
}


const statusConfig = {
  draft: { label: "下書き", color: "bg-gray-500" },
  sent: { label: "送信済み", color: "bg-green-500" },
  scheduled: { label: "送信予定", color: "bg-blue-500" },
}

export default function CompanyFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [dateType, setDateType] = useState<"created" | "sent">("created")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  // ---- Supabase data ----
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  const params = useParams<{ companyId: string }>()
  const companyId = (params?.companyId ?? "") as string

  useEffect(() => {
    if (!companyId) return

    const fetchFeedbacks = async () => {
      // フィードバックデータを取得（student_id 含む）
      const { data: feedbackRows, error: feedbackError } = await supabase
        .from('feedbacks')
        .select('id, student_id, overall_rating, overall_comment, created_at, updated_at')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });
      if (feedbackError) {
        console.error('Feedback fetch error:', feedbackError);
        return;
      }

      // プロフィールから学生名を取得
      const studentIds = feedbackRows?.map((f) => f.student_id) ?? [];
      const { data: profilesRows, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', studentIds);
      if (profilesError) {
        console.error('Profiles fetch error:', profilesError);
        return;
      }

      // 学生IDと名前のマップを作成
      const profileMap = new Map<string, string>();
      profilesRows.forEach((p) => {
        const fullName = p.full_name ?? '';
        profileMap.set(p.user_id, fullName);
      });

      // ステートをセット
      setFeedbacks(
        (feedbackRows ?? []).map((row: any) => ({
          id: row.id,
          studentName: profileMap.get(row.student_id) || '',
          overallRating: row.overall_rating,
          overallComment: row.overall_comment,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(row.updated_at),
        }))
      );
    }

    fetchFeedbacks()
  }, [companyId])

  const filteredAndSortedFeedbacks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = feedbacks.filter((feedback) => {
      return (
        feedback.studentName.toLowerCase().includes(term) ||
        feedback.overallComment.toLowerCase().includes(term)
      );
    });
    // 作成日降順でソート
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return filtered;
  }, [searchTerm, feedbacks]);

  const totalPages = Math.ceil(filteredAndSortedFeedbacks.length / itemsPerPage)
  const paginatedFeedbacks = filteredAndSortedFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const getStatusBadge = (status: FeedbackStatus) => {
    const config = statusConfig[status]
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">フィードバック一覧</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
          <Button
            onClick={() =>
              (window.location.href = companyId
                ? `/company/${companyId}/feedback/create/template`
                : "/company/feedback/create/template")
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            新規フィードバック作成
          </Button>
        </div>
      </div>

      {/* 検索・フィルタセクション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            検索・フィルタ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 検索 */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="学生名・求人名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* ステータスフィルタ */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FeedbackStatus | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="送信状況" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="sent">送信済み</SelectItem>
                <SelectItem value="scheduled">送信予定</SelectItem>
              </SelectContent>
            </Select>

            {/* 評価フィルタ */}
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="評価" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="4-5">★4-5</SelectItem>
                <SelectItem value="3-3">★3</SelectItem>
                <SelectItem value="1-2">★1-2</SelectItem>
              </SelectContent>
            </Select>

            {/* 並び替え */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">最新作成順</SelectItem>
                <SelectItem value="sentAt-desc">最新送信順</SelectItem>
                <SelectItem value="rating-desc">評価高い順</SelectItem>
                <SelectItem value="studentName-asc">学生名 A→Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={dateType} onValueChange={(value) => setDateType(value as "created" | "sent")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="日付タイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">作成日</SelectItem>
                <SelectItem value="sent">送信日</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-[240px] justify-start text-left font-normal ${
                    !dateRange?.from && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "yyyy/MM/dd", { locale: ja })} -{" "}
                        {format(dateRange.to, "yyyy/MM/dd", { locale: ja })}
                      </>
                    ) : (
                      format(dateRange.from, "yyyy/MM/dd", { locale: ja })
                    )
                  ) : (
                    <span>期間を選択</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ja}
                />
                <div className="flex items-center justify-between p-3 border-t">
                  <Button variant="outline" size="sm" onClick={() => setDateRange(undefined)}>
                    クリア
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: today,
                          to: today,
                        })
                      }}
                    >
                      今日
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: addDays(today, -7),
                          to: today,
                        })
                      }}
                    >
                      過去7日間
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const today = new Date()
                        setDateRange({
                          from: addDays(today, -30),
                          to: today,
                        })
                      }}
                    >
                      過去30日間
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* フィードバック一覧テーブル */}
      <Card>
        <CardHeader>
          <CardTitle>フィードバック一覧 ({filteredAndSortedFeedbacks.length}件)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>学生名</TableHead>
                  <TableHead>総合評価</TableHead>
                  <TableHead>総評</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id} className="hover:bg-gray-50">
                    <TableCell>{feedback.studentName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < feedback.overallRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600"></span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{feedback.overallComment}</TableCell>
                    <TableCell>{format(feedback.createdAt, 'yyyy/MM/dd', { locale: ja })}</TableCell>
                    <TableCell>{format(feedback.updatedAt, 'yyyy/MM/dd', { locale: ja })}</TableCell>
                    <TableCell>
                      <Link href={`/company/${companyId}/feedback/${feedback.id}`}>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                前へ
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                次へ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
