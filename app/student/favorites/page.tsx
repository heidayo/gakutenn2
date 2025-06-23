"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  Bell,
  User,
  Home,
  MessageSquare,
  MapPin,
  Clock,
  Bookmark,
  ChevronLeft,
  MoreHorizontal,
  Heart,
  Filter,
  SortAsc,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "salary" | "location">("newest")
  const [filterBy, setFilterBy] = useState<"all" | "part-time" | "internship">("all")

  // Supabase から取得したブックマーク済み求人
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error("Error getting user:", userError)
        return
      }
      const { data: bookmarks, error: bmError } = await supabase
        .from("bookmarks")
        .select("job:jobs(*, company:companies(name)), created_at")
        .eq("student_id", user.id)
      if (bmError) {
        console.error("Error fetching bookmarks:", bmError)
      } else {
        setJobs(
          bookmarks.map((b) => ({
            ...b.job,
            company: b.job.company.name,
            savedAt: b.created_at
          }))
        )
      }
    }
    fetchBookmarks()
  }, [])

  const toggleFavorite = async (jobId: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("Error getting user:", userError)
      return
    }
    const { error: delError } = await supabase
      .from("bookmarks")
      .delete()
      .match({ student_id: user.id, job_id: jobId })
    if (delError) {
      console.error("Error deleting bookmark:", delError)
    } else {
      setJobs((prev) => prev.filter((job) => job.id !== jobId))
    }
  }

  const favoriteJobs = jobs

  // 検索とフィルタリング
  const filteredJobs = favoriteJobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterBy === "all" || job.type === filterBy
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        case "salary":
          const salaryA = Number.parseInt(a.salary.replace(/[^\d]/g, ""))
          const salaryB = Number.parseInt(b.salary.replace(/[^\d]/g, ""))
          return salaryB - salaryA
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <Link href="/student">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-lg font-semibold">お気に入り</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="h-6 w-6 text-gray-600" />
          <User className="h-6 w-6 text-gray-600" />
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="お気に入りから検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-gray-100 border-0 rounded-lg text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="text-sm border-0 bg-transparent focus:outline-none"
            >
              <option value="all">すべて</option>
              <option value="part-time">アルバイト</option>
              <option value="internship">インターン</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <SortAsc className="h-4 w-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border-0 bg-transparent focus:outline-none"
            >
              <option value="newest">保存日順</option>
              <option value="salary">時給順</option>
              <option value="location">勤務地順</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex items-center space-x-2">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm text-gray-600">{filteredJobs.length}件のお気に入り求人</span>
        </div>
      </div>

      {/* Job List */}
      <div className="px-4 py-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filterBy !== "all" ? "条件に合う求人が見つかりません" : "お気に入りがありません"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterBy !== "all"
                ? "検索条件を変更してみてください"
                : "気になる求人をお気に入りに追加してみましょう"}
            </p>
            <Link href="/student/search">
              <Button className="bg-orange-600 hover:bg-orange-700">求人を探す</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Link href={`/student/jobs/${job.id}`} key={job.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex">
                    <div className="relative w-24 h-20 flex-shrink-0">
                      <img src={job.image || "/placeholder.svg"} alt={job.title} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(job.id)
                          }}
                          className="transition-transform hover:scale-110 active:scale-95"
                          aria-label="お気に入りから削除"
                        >
                          <Bookmark className="h-4 w-4 text-orange-500 fill-orange-500" />
                        </button>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-sm line-clamp-2 leading-tight flex-1 mr-2">{job.title}</h3>
                        {job.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                      </div>

                      <p className="text-xs text-gray-600 mb-2">{job.company}</p>

                      <div className="space-y-1 text-xs text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{job.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-green-600">¥{job.salary}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(job.savedAt).toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                          })}
                          保存
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.tags.slice(0, 2).map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600">
                            +{job.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-5 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/search" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Search className="h-5 w-5" />
            <span className="text-xs">探す</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
          <Link href="/student/feedback" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">フィードバック</span>
          </Link>
          <Link href="/student/other" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs">その他</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
