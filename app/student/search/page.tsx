"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import ReactSelect from 'react-select'

import rows from '../../../data/000925835.json'

// 都道府県から地域（北海道・東北、関東、中部、近畿、中国・四国、九州・沖縄）へのマッピング
const prefectureToRegion: Record<string, string> = {
  '北海道': '北海道・東北',
  '青森県': '北海道・東北',
  '岩手県': '北海道・東北',
  '宮城県': '北海道・東北',
  '秋田県': '北海道・東北',
  '山形県': '北海道・東北',
  '福島県': '北海道・東北',
  '茨城県': '関東',
  '栃木県': '関東',
  '群馬県': '関東',
  '埼玉県': '関東',
  '千葉県': '関東',
  '東京都': '関東',
  '神奈川県': '関東',
  '新潟県': '中部',
  '富山県': '中部',
  '石川県': '中部',
  '福井県': '中部',
  '山梨県': '中部',
  '長野県': '中部',
  '岐阜県': '中部',
  '静岡県': '中部',
  '愛知県': '中部',
  '三重県': '近畿',
  '滋賀県': '近畿',
  '京都府': '近畿',
  '大阪府': '近畿',
  '兵庫県': '近畿',
  '奈良県': '近畿',
  '和歌山県': '近畿',
  '鳥取県': '中国・四国',
  '島根県': '中国・四国',
  '岡山県': '中国・四国',
  '広島県': '中国・四国',
  '山口県': '中国・四国',
  '徳島県': '中国・四国',
  '香川県': '中国・四国',
  '愛媛県': '中国・四国',
  '高知県': '中国・四国',
  '福岡県': '九州・沖縄',
  '佐賀県': '九州・沖縄',
  '長崎県': '九州・沖縄',
  '熊本県': '九州・沖縄',
  '大分県': '九州・沖縄',
  '宮崎県': '九州・沖縄',
  '鹿児島県': '九州・沖縄',
  '沖縄県': '九州・沖縄',
}
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ChevronDown,
  Home,
  User,
  MessageSquare,
  MoreHorizontal,
  Bookmark,
  Briefcase,
  JapaneseYenIcon as Yen,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

import { supabase } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/types"


type Job = Omit<Database["public"]["Tables"]["jobs"]["Row"], "search_vector">

// クイックタグ
const quickTags = [
  { label: "#週1OK", value: "週1OK", color: "bg-blue-100 text-blue-700" },
  { label: "#未経験歓迎", value: "未経験歓迎", color: "bg-green-100 text-green-700" },
  { label: "#リモート可", value: "リモート可", color: "bg-purple-100 text-purple-700" },
  { label: "#高時給", value: "高時給", color: "bg-orange-100 text-orange-700" },
  { label: "#短期", value: "短期", color: "bg-pink-100 text-pink-700" },
  { label: "#成長重視", value: "成長重視", color: "bg-indigo-100 text-indigo-700" },
]

// 並び替えオプション
const sortOptions = [
  { value: "newest", label: "新着順" },
  { value: "popular", label: "人気順" },
  { value: "match", label: "相性順" },
]

export default function SearchPage() {
  // JSONファイル(data/000925835.json)から都道府県・市区町村データを読み込み、階層構造を生成
  const regionData = Object.values(
    rows.reduce((acc, { prefecture, city }) => {
      const region = prefectureToRegion[prefecture] || 'その他'
      if (!acc[region]) {
        acc[region] = { name: region, prefectures: {} as Record<string, Set<string>> }
      }
      if (city) {
        if (!acc[region].prefectures[prefecture]) {
          acc[region].prefectures[prefecture] = new Set<string>()
        }
        acc[region].prefectures[prefecture].add(city)
      }
      return acc
    }, {} as Record<string, { name: string; prefectures: Record<string, Set<string>> }>)
  ).map(({ name, prefectures }) => ({
    name,
    prefectures: Object.entries(prefectures).map(([pref, cities]) => ({
      name: pref,
      cities: Array.from(cities).sort((a, b) => {
        const order = ["区", "市", "町", "村"]
        const rank = (s: string) => {
          const suffix = order.find((o) => s.endsWith(o))
          return suffix ? order.indexOf(suffix) : order.length
        }
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra - rb
        return a.localeCompare(b, "ja")
      }),
    })),
  }))
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [displayedJobs, setDisplayedJobs] = useState(20)
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  // 階層展開状態
  const [expandedRegions, setExpandedRegions] = useState<string[]>([])
  const [expandedPrefectures, setExpandedPrefectures] = useState<string[]>([])
  // Load bookmarks from Supabase
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error("Error getting user:", userError)
        return
      }
      if (!user) return
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
  // 時給レンジ
  const [hourlyRange, setHourlyRange] = useState<[number, number]>([0, 5000])
  const [dailyRange, setdailyRange] = useState<[number, number]>([0, 30000])

  // デバッグ: jobsテーブルのIDを取得してログ出力
  useEffect(() => {
    supabase
      .from("jobs")
      .select("id")
      .then(({ data, error }) => {
        console.log("jobs data:", data, " error:", error)
      })
  }, [])

  useEffect(() => {
    supabase
      .from("jobs")
      .select("*")
      .eq("status", "published")
      .then(({ data, error }) => {
        console.log("jobs fetch →", { data, error })
        if (error) {
          console.error("Error fetching jobs:", error)
        } else {
          const jobsWithUrls = (data ?? []).map((job) => {
            let publicUrl: string | null | undefined = job.image_url
            if (publicUrl && !publicUrl.startsWith("http")) {
              const { data: urlData } = supabase
                .storage
                .from("company-jobs")
                .getPublicUrl(publicUrl)
              publicUrl = urlData?.publicUrl ?? null
            }
            return { ...job, image_url: publicUrl }
          })
          setJobs(jobsWithUrls)
        }
      })
  }, [])

  // 取りうるセクション名の型
  type SectionKey =
    | "salary"
    | "period"
    | "jobType"
    | "location"
    | "industry"
    | "benefits"
    | "hashtags"
    | "remote"

  // フィルタ状態
  const [filters, setFilters] = useState({
    salary:  [] as string[],
    period: [] as string[],
    location: [] as string[],
    industry: [] as string[],
    jobType: [] as string[], // 職種フィルタを追加
    benefits: [] as string[],
    hashtags: [] as string[], // ハッシュタグフィルタを追加
    remote: false,
  })
  

  // フィルタの展開状態
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    salary: false,
    period: false,
    jobType: false,
    location: false,
    industry: false,
    benefits: false,
    hashtags: false, // ハッシュタグセクションを追加
    remote: false,
  })

  // セクション展開切り替え関数
  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // タグ選択処理
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  // 求人保存処理
  const toggleSaveJob = useCallback(async (jobId: string) => {
    const getUserResponse = await supabase.auth.getUser()
    const user = getUserResponse.data.user
    if (getUserResponse.error || !user) {
      console.error("Error getting user or no user:", getUserResponse.error)
      return
    }
    if (!savedJobs.has(jobId)) {
      // Insert bookmark
      const { error: insertError } = await supabase
        .from("bookmarks")
        .insert({ student_id: user.id, job_id: jobId })
      if (insertError) {
        console.error("Error inserting bookmark:", insertError)
      } else {
        setSavedJobs(new Set(savedJobs).add(jobId))
      }
    } else {
      // Delete bookmark
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

  // フィルタリング＆ソート処理
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      // 検索クエリフィルタ
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // タグフィルタ
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => (job.tags || []).includes(tag))
        if (!hasSelectedTag) return false
      }

      // 報酬体系フィルタ
      if (filters.salary.length > 0) {
        const type = job.salary_type
        if (!type || !filters.salary.includes(type)) {
          return false
        }
      }

      // 期間フィルタ
      if (filters.period.length > 0) {
        const dur = job.duration
        if (!dur || !filters.period.includes(dur)) {
          return false
        }
      }

      // 勤務地フィルタ
      if (filters.location.length > 0) {
        const loc = job.location
        if (!loc || !filters.location.includes(loc)) {
          return false
        }
      }

      // 業種フィルタ
      if (filters.industry.length > 0 && !filters.industry.includes(job.category)) {
        return false
      }

      // 職種フィルタ
      if (filters.jobType.length > 0 && !filters.jobType.some((t) => (job.tags || []).includes(t))) {
        return false
      }

      // 待遇フィルタ
      if (filters.benefits.length > 0) {
        const hasBenefit = filters.benefits.some((benefit) => (job.benefits || []).includes(benefit))
        if (!hasBenefit) return false
      }

      // ハッシュタグフィルタ
      if (filters.hashtags.length > 0) {
        const hasHashtag = filters.hashtags.some((hashtag) => (job.tags || []).includes(hashtag))
        if (!hasHashtag) return false
      }

      // リモートフィルタ
      if (filters.remote && !job.remote) {
        return false
      }

      return true
    })

    // ソート処理
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const bTime = b.publish_date ? new Date(b.publish_date).getTime() : 0
          const aTime = a.publish_date ? new Date(a.publish_date).getTime() : 0
          return bTime - aTime
        }
        default:
          return 0
      }
    })

    return filtered
  }, [jobs, searchQuery, selectedTags, sortBy, filters])

  // 無限スクロール
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        setDisplayedJobs((prev) => Math.min(prev + 20, filteredAndSortedJobs.length))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [filteredAndSortedJobs.length])

  // フィルタリセット
  const resetFilters = () => {
    setFilters({
      salary: [],
      period: [],
      location: [],
      industry: [],
      jobType: [],
      benefits: [],
      hashtags: [],
      remote: false,
    })
    setSelectedTags([])
    setSearchQuery("")
  }

  const activeFiltersCount =
    (filters.period.length > 0 ? 1 : 0) +
    (filters.location.length > 0 ? 1 : 0) +
    (filters.industry.length > 0 ? 1 : 0) +
    (filters.jobType.length > 0 ? 1 : 0) +
    (filters.benefits.length > 0 ? 1 : 0) +
    (filters.hashtags.length > 0 ? 1 : 0) +
    (filters.remote ? 1 : 0) +
    (filters.salary.length > 0 ? 1 : 0) +
    selectedTags.length

  // フィルタ項目の表示値を取得する関数
  const getFilterDisplayValue = (filterType: string) => {
    switch (filterType) {
      case "jobType":
        return filters.jobType.length > 0 ? filters.jobType.join(", ") : "すべて"
      case "salary":
        return filters.salary.length > 0 ? filters.salary.join(", ") : "指定なし"
      case "benefits":
        return filters.benefits.length > 0 ? filters.benefits.join(", ") : "指定なし"
      default:
        return "指定なし"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="px-4 py-3">
          {/* 検索バー */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="求人を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>

          {/* クイックタグ */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickTags.map((tag) => (
              <Badge
                key={tag.value}
                variant={selectedTags.includes(tag.value) ? "default" : "secondary"}
                className={cn(
                  "cursor-pointer whitespace-nowrap transition-all",
                  selectedTags.includes(tag.value) ? "bg-blue-600 text-white" : tag.color,
                )}
                onClick={() => toggleTag(tag.value)}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* フィルタ＆ソートバー */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="h-4 w-4 mr-1" />
                  フィルタ
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>フィルタ設定</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4 overflow-y-auto max-h-[60vh]">
                  
                  {/* 報酬フィルタ */}
                  <Collapsible open={expandedSections.salary} onOpenChange={() => toggleSection("salary")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">給与体系</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.salary ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {["時給", "歩合","日給"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`salary-${type}`}
                              checked={filters.salary.includes(type)}
                              onCheckedChange={(checked) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  salary: checked
                                    ? [...prev.salary, type]
                                    : prev.salary.filter((s) => s !== type),
                                }))
                              }
                            />
                            <label htmlFor={`salary-${type}`} className="text-sm">
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                      {filters.salary.includes("時給") && (
                        <div className="mt-4 -mx-3 px-3">
                          <span className="text-xs text-gray-500">時給範囲</span>
                          <Slider
                            value={hourlyRange}
                            onValueChange={(value) => setHourlyRange(value as [number, number])}
                            min={0}
                            max={5000}
                            step={100}
                            className="w-full mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>¥{hourlyRange[0]}</span>
                            <span>¥{hourlyRange[1]}</span>
                          </div>
                        </div>
                      )}
                       {filters.salary.includes("日給") && (
                        <div className="mt-4 -mx-3 px-3">
                          <span className="text-xs text-gray-500">日給範囲</span>
                          <Slider
                            value={dailyRange}
                            onValueChange={(value) => setdailyRange(value as [number, number])}
                            min={0}
                            max={5000}
                            step={100}
                            className="w-full mt-2"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>¥{dailyRange[0]}</span>
                            <span>¥{dailyRange[1]}</span>
                          </div>
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 雇用形態フィルタ */}
                  <Collapsible open={expandedSections.period} onOpenChange={() => toggleSection("period")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium">雇用形態</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.period ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {["アルバイト", "インターン"].map((period) => (
                          <div key={period} className="flex items-center space-x-2">
                            <Checkbox
                              id={period}
                              checked={filters.period.includes(period)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, period: [...prev.period, period] }))
                                } else {
                                  setFilters((prev) => ({ ...prev, period: prev.period.filter((p) => p !== period) }))
                                }
                              }}
                            />
                            <label htmlFor={period} className="text-sm">
                              {period}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 職種フィルタ */}
                  <Collapsible open={expandedSections.jobType} onOpenChange={() => toggleSection("jobType")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">職種</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.jobType ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {[
                          "エンジニア",
                          "デザイナー",
                          "営業",
                          "マーケティング",
                          "企画",
                          "人事",
                          "カスタマーサポート",
                          "経理・財務",
                          "コンサルタント",
                          "ライター",
                          "動画編集",
                        ].map((jobType) => (
                          <div key={jobType} className="flex items-center space-x-2">
                            <Checkbox
                              id={jobType}
                              checked={filters.jobType.includes(jobType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, jobType: [...prev.jobType, jobType] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    jobType: prev.jobType.filter((j) => j !== jobType),
                                  }))
                                }
                              }}
                            />
                            <label htmlFor={jobType} className="text-sm">
                              {jobType}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 勤務地フィルタ */}
                  <Collapsible open={expandedSections.location} onOpenChange={() => toggleSection("location")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <span className="text-sm font-medium">勤務地</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.location ? "rotate-180" : ""}`} />
                    </CollapsibleTrigger>
                    {expandedSections.location && (
                      <CollapsibleContent className="px-3 pt-3">
                        <div className="space-y-2">
                          {regionData.map(region => (
                            <div key={region.name}>
                              {/* 地域 */}
                              <div
                                className="flex items-center justify-between w-full p-2 bg-white hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() =>
                                  setExpandedRegions(prev =>
                                    prev.includes(region.name)
                                      ? prev.filter(r => r !== region.name)
                                      : [...prev, region.name]
                                  )
                                }
                              >
                                <span className="text-sm font-medium">{region.name}</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${expandedRegions.includes(region.name) ? "rotate-180" : ""}`}
                                />
                              </div>
                              {expandedRegions.includes(region.name) && (
                                <div className="pl-4 space-y-1">
                                  {region.prefectures.map(pref => (
                                    <div key={pref.name}>
                                      {/* 都道府県（チェックボックス付き） */}
                                      <div
                                        className="flex items-center justify-between w-full p-1 bg-white hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={() =>
                                          setExpandedPrefectures(prev =>
                                            prev.includes(pref.name)
                                              ? prev.filter(p => p !== pref.name)
                                              : [...prev, pref.name]
                                          )
                                        }
                                      >
                                        <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                                          <Checkbox
                                            id={`pref-${pref.name}`}
                                            checked={pref.cities.every(city => filters.location.includes(city))}
                                            onCheckedChange={checked => {
                                              setFilters(prev => ({
                                                ...prev,
                                                location: checked
                                                  ? Array.from(new Set([...prev.location, ...pref.cities]))
                                                  : prev.location.filter(l => !pref.cities.includes(l))
                                              }))
                                            }}
                                          />
                                          <span className="text-sm">{pref.name}</span>
                                        </div>
                                        <ChevronDown
                                          className={`h-4 w-4 transition-transform ${expandedPrefectures.includes(pref.name) ? "rotate-180" : ""}`}
                                        />
                                      </div>
                                      {expandedPrefectures.includes(pref.name) && (
                                        <div className="pl-4">
                                          {pref.cities.map(city => (
                                            <div key={city} className="flex items-center space-x-2 py-0.5">
                                              <Checkbox
                                                id={`city-${city}`}
                                                checked={filters.location.includes(city)}
                                                onCheckedChange={checked =>
                                                  setFilters(prev => ({
                                                    ...prev,
                                                    location: checked
                                                      ? [...prev.location, city]
                                                      : prev.location.filter(l => l !== city)
                                                  }))
                                                }
                                              />
                                              <label htmlFor={`city-${city}`} className="text-sm">{city}</label>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>

                  {/* 業種フィルタ */}
                  <Collapsible open={expandedSections.industry} onOpenChange={() => toggleSection("industry")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium">業種</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.industry ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {[
                          "IT・Web",
                          "金融",
                          "小売・EC",
                          "製造業",
                          "サービス業",
                          "コンサルティング",
                          "広告・メディア",
                          "教育",
                        ].map((industry) => (
                          <div key={industry} className="flex items-center space-x-2">
                            <Checkbox
                              id={industry}
                              checked={filters.industry.includes(industry)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, industry: [...prev.industry, industry] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    industry: prev.industry.filter((i) => i !== industry),
                                  }))
                                }
                              }}
                            />
                            <label htmlFor={industry} className="text-sm">
                              {industry}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* 待遇フィルタ */}
                  <Collapsible open={expandedSections.benefits} onOpenChange={() => toggleSection("benefits")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">待遇</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.benefits ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {[
                          "交通費支給",
                          "昇給あり",
                          "賞与あり",
                          "社会保険完備",
                          "有給休暇",
                          "研修制度",
                          "制服貸与",
                          "食事補助",
                        ].map((benefit) => (
                          <div key={benefit} className="flex items-center space-x-2">
                            <Checkbox
                              id={benefit}
                              checked={filters.benefits.includes(benefit)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, benefits: [...prev.benefits, benefit] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    benefits: prev.benefits.filter((b) => b !== benefit),
                                  }))
                                }
                              }}
                            />
                            <label htmlFor={benefit} className="text-sm">
                              {benefit}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>


                  {/* ハッシュタグフィルタ */}
                  <Collapsible open={expandedSections.hashtags} onOpenChange={() => toggleSection("hashtags")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium">ハッシュタグ</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.hashtags ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {[
                          "週1OK",
                          "未経験歓迎",
                          "リモート可",
                          "高時給",
                          "短期",
                          "成長重視",
                          "急募",
                          "学生歓迎",
                          "土日休み",
                          "平日のみ",
                          "夜勤",
                          "シフト自由",
                        ].map((hashtag) => (
                          <div key={hashtag} className="flex items-center space-x-2">
                            <Checkbox
                              id={hashtag}
                              checked={filters.hashtags.includes(hashtag)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, hashtags: [...prev.hashtags, hashtag] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    hashtags: prev.hashtags.filter((h) => h !== hashtag),
                                  }))
                                }
                              }}
                            />
                            <label htmlFor={hashtag} className="text-sm">
                              #{hashtag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* リモート可フィルタ */}
                  <Collapsible open={expandedSections.remote} onOpenChange={() => toggleSection("remote")}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium">リモート勤務</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.remote ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remote"
                          checked={filters.remote}
                          onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, remote: !!checked }))}
                        />
                        <label htmlFor="remote" className="text-sm">
                          リモート勤務可のみ
                        </label>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={resetFilters} variant="outline" className="flex-1">
                      リセット
                    </Button>
                    <SheetClose asChild>
                      <Button className="flex-1">適用</Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-500">{filteredAndSortedJobs.length}件</div>
        </div>
      </div>

      {/* 求人リスト */}
      <div className="px-4 py-4 pb-20">
        <div className="grid grid-cols-2 gap-3">
          {filteredAndSortedJobs.slice(0, displayedJobs).map((job) => (
            <Link href={`/student/jobs/${job.id}`} key={job.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={job.image_url ?? "/placeholder.svg"}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  {job.publish_date && Math.floor((Date.now() - new Date(job.publish_date).getTime()) / (1000 * 60 * 60 * 24)) < 3 && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>
                  )}
                  {/* Bookmark */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleSaveJob(job.id)
                      }}
                      className="transition-transform hover:scale-110 active:scale-95 bg-white/30 backdrop-blur-sm p-1 rounded-full"
                      aria-label={savedJobs.has(job.id) ? "お気に入りから削除" : "お気に入りに追加"}
                    >
                      <Bookmark
                        className={`h-5 w-5 drop-shadow-md ${
                          savedJobs.has(job.id) ? "text-orange-500 fill-orange-500" : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <CardContent className="p-3 pt-2">
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

                  <div className="text-lg font-bold text-green-600 mb-2">
                    ¥{job.salary}
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ローディング表示 */}
        {displayedJobs < filteredAndSortedJobs.length && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">読み込み中...</p>
          </div>
        )}

        {filteredAndSortedJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">求人が見つかりませんでした</h3>
            <p className="text-gray-500 mb-4">検索条件を変更してお試しください</p>
            <Button onClick={resetFilters} variant="outline">
              フィルタをリセット
            </Button>
          </div>
        )}
      </div>

      {/* フローティングアクションボタン */}
      <div className="fixed bottom-20 right-4">
        <Button className="rounded-full h-12 w-12 shadow-lg">
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-5 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/search" className="flex flex-col items-center justify-center space-y-1 text-blue-600">
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
