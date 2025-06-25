"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { NotificationCenter } from "@/components/notification-center"
import {
  Search,
  User,
  Home,
  MessageSquare,
  MapPin,
  Clock,
  Bookmark,
  ChevronRight,
  Users,
  GraduationCap,
  FileText,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback, useEffect, useState } from "react"

function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })])

  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  const slides = [
    {
      h1: '最短１日で "働く" が学びに変わる。',
      h2: "リアルな企業フィードバックでキャリアがクリアになる。",
    },
    {
      h1: "忙しくても、未来は鍛えられる。",
      h2: "スキマ時間でキャリアを先取り。",
    },
    {
      h1: "経験を言語化しよう。",
      h2: '職務経歴書サポートで"強み"が見える化。',
    },
  ]

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <div className="bg-[#f2923d] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-center md:text-left">
                  <h1 className="text-xl md:text-2xl font-bold mb-3 leading-tight">{slide.h1}</h1>
                  <h2 className="text-base md:text-lg mb-6 opacity-90 leading-relaxed">{slide.h2}</h2>
                </div>

                <div className="text-center md:text-left mb-6">
                  <p className="text-sm md:text-base opacity-80 mb-4">
                    学転インターンで、あなたのキャリアを次のステージへ。
                    実際の企業で働きながら、プロからの直接フィードバックを受けられます。
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button className="bg-white text-[#f2923d] hover:bg-gray-100 font-semibold px-6 py-3">
                    今すぐ始める
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#f2923d] text-[#f2923d] hover:bg-[#f2923d] hover:text-white font-semibold px-6 py-3"
                  >
                    詳しく見る
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex ? "bg-[#f2923d]" : "bg-gray-300"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function StudentHomePage() {
  const jobCards = [
    {
      id: 1,
      company: "株式会社テックスタート",
      title: "💻 Webマーケティングアシスタント",
      location: "東京都渋谷区",
      duration: "週1回〜",
      salary: "時給1,200円",
      time: "17:00〜18:00",
      image: "/placeholder.svg?height=120&width=200",
      tags: ["未経験歓迎", "週1OK", "リモート可"],
      isNew: true,
      matchRate: 85,
      urgency: "00:02:45",
    },
    {
      id: 2,
      company: "クリエイティブ合同会社",
      title: "📱 SNS運用サポート",
      location: "大阪府大阪市",
      duration: "単発OK",
      salary: "日給8,000円",
      time: "15:00〜16:00",
      image: "/placeholder.svg?height=120&width=200",
      tags: ["単発OK", "土日可", "交通費支給"],
      isNew: false,
      matchRate: 92,
      urgency: "00:01:30",
    },
    {
      id: 3,
      company: "イノベーション株式会社",
      title: "📊 データ入力・分析補助",
      location: "リモート",
      duration: "週2回〜",
      salary: "時給1,000円",
      time: "10:00〜14:00",
      image: "/placeholder.svg?height=120&width=200",
      tags: ["リモート", "未経験歓迎", "平日のみ"],
      isNew: true,
      matchRate: 78,
      urgency: "00:05:12",
    },
    {
      id: 4,
      company: "カフェ・ド・パリ",
      title: "☕ カフェスタッフ",
      location: "東京都新宿区",
      duration: "週3回〜",
      salary: "時給1,100円",
      time: "18:00〜22:00",
      image: "/placeholder.svg?height=120&width=200",
      tags: ["未経験歓迎", "学生歓迎", "まかない付"],
      isNew: false,
      matchRate: 88,
      urgency: "00:03:20",
    },
  ]

  const [displayedJobs, setDisplayedJobs] = useState(jobCards.slice(0, 4))
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  
  // おすすめ求人データ
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])

  useEffect(() => {
    const fetchRecommended = async () => {
      // ❶ 最新求人10件取得（画像パスも取得）※公開求人のみ
      const { data: jobs, error } = await supabase
        .from("jobs")
        .select("id, title, location, duration, salary, work_hours, image_url")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching recommended jobs:", error)
        return
      }

      if (!jobs) {
        setRecommendedJobs([])
        return
      }

      // ❷ 画像パスを公開 URL に変換（Storage バケット: company-jobs）
      const jobsWithUrls = jobs.map((job) => {
        // image_url が既に http から始まる場合はそのまま使用
        let publicUrl: string | null | undefined = job.image_url

        // まだフル URL でなければ Storage から生成
        if (publicUrl && !publicUrl.startsWith("http")) {
          const { data } = supabase.storage
            .from("company-jobs")
            .getPublicUrl(publicUrl)
          publicUrl = data?.publicUrl ?? null
        }

        return { ...job, image_url: publicUrl }
      })

      setRecommendedJobs(jobsWithUrls)
    }
    fetchRecommended()
  }, [])
  // 検索バー用
  const [searchQuery, setSearchQuery] = useState("")
  // 入力中のテキスト（Enter で確定）
  const [searchInput, setSearchInput] = useState("")
  const router = useRouter()

  // ダッシュボード統計用
  const [applicationsCount, setApplicationsCount] = useState<number | null>(null)
  const [interviewsCount, setInterviewsCount] = useState<number | null>(null)
  const [averageRating, setAverageRating] = useState<number | null>(null)

  // Supabase から応募数・面談数・平均評価を取得

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser()

      if (userErr || !user) return

      const userId = user.id

      // 応募中
      const { count: applyingCnt } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "応募中")

      // 面談予定
      const { count: interviewCnt } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "面談予定")

      // 平均評価 (feedbacks テーブル想定)
      const { data: ratingsRows } = await supabase
        .from("feedbacks")
        .select("rating")
        .eq("student_id", userId)

      let avg = null
      if (ratingsRows && ratingsRows.length > 0) {
        const total = ratingsRows.reduce((sum: number, row: any) => sum + (row.rating ?? 0), 0)
        avg = Number((total / ratingsRows.length).toFixed(1))
      }

      setApplicationsCount(applyingCnt ?? 0)
      setInterviewsCount(interviewCnt ?? 0)
      setAverageRating(avg)
    }

    fetchStats()
  }, [])

  // Load bookmarks from Supabase
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        console.error("Error getting user:", userError)
        return
      }
      const { data: bookmarks, error: bmError } = await supabase
        .from("bookmarks")
        .select("job_id")
        .eq("student_id", user.id)
      if (bmError) {
        console.error("Error fetching saved jobs:", bmError)
      } else {
        setSavedJobs(new Set(bookmarks.map((b) => b.job_id)))
      }
    }
    fetchSavedJobs()
  }, [])

  const toggleFavorite = useCallback(async (jobId: string) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error("Error getting user:", userError)
      return
    }
    if (!savedJobs.has(jobId)) {
      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({ student_id: user.id, job_id: jobId })
      if (insertError) {
        console.error("Error inserting bookmark:", insertError)
      } else {
        setSavedJobs(new Set(savedJobs).add(jobId))
      }
    } else {
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .match({ student_id: user.id, job_id: jobId })
      if (deleteError) {
        console.error("Error deleting bookmark:", deleteError)
      } else {
        const newSet = new Set(savedJobs)
        newSet.delete(jobId)
        setSavedJobs(newSet)
      }
    }
  }, [savedJobs])

  const loadMoreJobs = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // シミュレートされた API 呼び出し
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newJobs = [
      ...jobCards.map((job, index) => ({
        ...job,
        id: job.id + page * 4 + index,
        title: `${job.title} (ページ${page + 1})`,
      })),
    ]

    setDisplayedJobs((prev) => [...prev, ...newJobs])
    setPage((prev) => prev + 1)
    setIsLoading(false)

    // 3ページ目以降は hasMore を false に
    if (page >= 2) {
      setHasMore(false)
    }
  }, [isLoading, hasMore, page, jobCards])

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
      loadMoreJobs()
    }
  }, [loadMoreJobs])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const quickTags = ["週1OK", "未経験歓迎", "リモート可", "単発OK", "土日可", "高時給", "交通費支給"]

  // クエリに応じて表示するジョブを絞り込む
  const filteredJobs = displayedJobs.filter((job) => {
    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.company.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between">
        <NotificationCenter />
        <Logo variant="horizontal" size="md" />
        <div className="flex items-center space-x-4">
          <Link href="/student/favorites">
            <Bookmark className="h-6 w-6 text-gray-600" />
          </Link>
          <Link href="/student/other">
            <User className="h-6 w-6 text-gray-600" />
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const q = searchInput.trim()
            setSearchQuery(q)
            if (q) {
              router.push(`/student/search?query=${encodeURIComponent(q)}`)
            }
          }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="職種、キーワード、会社名"
            className="pl-10 h-12 bg-gray-100 border-0 rounded-lg text-base w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {/* Hero Carousel */}
      <div className="px-4 py-4">
        <HeroCarousel />
      </div>

      {/* Feature Icons */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-6">
          <div className="grid grid-cols-4 gap-4">
            <Link href="/student/search?type=part-time" className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-orange-700 transition-colors">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs text-gray-700">アルバイト</div>
            </Link>
            <Link href="/student/search?type=internship" className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-orange-700 transition-colors">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs text-gray-700">インターン</div>
            </Link>
            <Link href="/student/feedback" className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-orange-700 transition-colors">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs text-gray-700">フィードバック</div>
            </Link>
            <Link href="/student/articles" className="text-center">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-2 mx-auto hover:bg-orange-700 transition-colors">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-xs text-gray-700">ニュース・コラム</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Tags */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {quickTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="whitespace-nowrap bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer"
              onClick={() => {
                setSearchInput(tag)
                setSearchQuery(tag)
                router.push(`/student/search?query=${encodeURIComponent(tag)}`)
              }}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-orange-600">{applicationsCount ?? "—"}</div>
            <div className="text-xs text-gray-600">応募中</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-green-600">{interviewsCount ?? "—"}</div>
            <div className="text-xs text-gray-600">面談予定</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-purple-600">{averageRating ?? "—"}</div>
            <div className="text-xs text-gray-600">平均評価</div>
          </Card>
        </div>
      </div>

      {/* Job Feed */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">おすすめの求人</h2>
          <Link href="/student/search">
            <Button variant="ghost" size="sm" className="text-orange-600">
              すべて見る
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {recommendedJobs.map((job) => (
            <Link href={`/student/jobs/${job.id}`} key={job.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={job.image_url ?? "/placeholder.svg"}
                    alt={job.title}
                    className="w-full h-24 object-cover"
                  />
                  {/* Bookmark */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(job.id.toString())
                      }}
                      className="transition-transform hover:scale-110 active:scale-95"
                      aria-label={savedJobs.has(job.id?.toString?.()) ? "お気に入りから削除" : "お気に入りに追加"}
                    >
                      <Bookmark
                        className={`h-5 w-5 drop-shadow-md ${
                          savedJobs.has(job.id?.toString?.()) ? "text-orange-500 fill-orange-500" : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">{job.title}</h3>

                  <div className="space-y-1 text-xs text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.work_hours}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-green-600 mb-2">¥{job.salary}</div>

                  {job.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 mb-2">NEW</Badge>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        )}

        {/* No more jobs message */}
        {!hasMore && !isLoading && <div className="text-center py-4 text-gray-500">すべての求人を表示しました</div>}
      </div>

      {/* Load More Button - 手動読み込み用 */}
      {hasMore && !isLoading && (
        <div className="px-4 py-6">
          <Button variant="outline" className="w-full" onClick={loadMoreJobs}>
            さらに読み込む
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-5 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-orange-600">
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
