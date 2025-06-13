"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

// モックデータ
const mockJobs = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `${["フロントエンド", "バックエンド", "デザイナー", "マーケティング", "データ分析"][i % 5]}インターン`,
  company: `株式会社${["テック", "イノベーション", "クリエイト", "グロース", "フューチャー"][i % 5]}`,
  location: ["東京都", "大阪府", "リモート", "神奈川県", "愛知県"][i % 5],
  salary: `時給 ${1000 + (i % 10) * 200}円`,
  period: ["アルバイト", "インターン"][i % 2],
  industry: ["IT・Web", "金融", "小売・EC", "製造業", "サービス業"][i % 5],
  jobType: ["エンジニア", "デザイナー", "営業", "マーケティング", "企画", "人事", "カスタマーサポート", "経理・財務"][
    i % 8
  ],
  benefits: [
    i % 3 === 0 ? "交通費支給" : null,
    i % 4 === 0 ? "昇給あり" : null,
    i % 5 === 0 ? "社会保険完備" : null,
    i % 6 === 0 ? "研修制度" : null,
  ].filter(Boolean),
  timeSlot: ["朝（9:00-12:00）", "昼（12:00-18:00）", "夕方（18:00-21:00）", "夜間（21:00-24:00）"][i % 4],
  remote: i % 3 === 0,
  tags: [
    i % 4 === 0 ? "週1OK" : null,
    i % 3 === 0 ? "未経験歓迎" : null,
    i % 5 === 0 ? "リモート可" : null,
    i % 6 === 0 ? "高時給" : null,
  ].filter(Boolean),
  matchScore: Math.floor(Math.random() * 5) + 1,
  isPopular: i % 7 === 0,
  postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  saved: false,
  image: `/placeholder.svg?height=180&width=320&query=job-${i}`,
}))

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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [displayedJobs, setDisplayedJobs] = useState(20)
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set())

  // フィルタ状態
  const [filters, setFilters] = useState({
    salary: [1000, 3000],
    period: [] as string[],
    location: [] as string[],
    industry: [] as string[],
    jobType: [] as string[], // 職種フィルタを追加
    benefits: [] as string[],
    hashtags: [] as string[], // ハッシュタグフィルタを追加
    remote: false,
  })

  // フィルタの展開状態
  const [expandedSections, setExpandedSections] = useState({
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
  const toggleSection = (section: string) => {
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
  const toggleSaveJob = useCallback((jobId: number) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }, [])

  // フィルタリング＆ソート処理
  const filteredAndSortedJobs = useMemo(() => {
    const filtered = mockJobs.filter((job) => {
      // 検索クエリフィルタ
      if (
        searchQuery &&
        !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.company.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // タグフィルタ
      if (selectedTags.length > 0) {
        const hasSelectedTag = selectedTags.some((tag) => job.tags.includes(tag))
        if (!hasSelectedTag) return false
      }

      // 報酬フィルタ
      const jobSalary = Number.parseInt(job.salary.match(/\d+/)?.[0] || "0")
      if (jobSalary < filters.salary[0] || jobSalary > filters.salary[1]) {
        return false
      }

      // 期間フィルタ
      if (filters.period.length > 0 && !filters.period.includes(job.period)) {
        return false
      }

      // 勤務地フィルタ
      if (filters.location.length > 0 && !filters.location.includes(job.location)) {
        return false
      }

      // 業種フィルタ
      if (filters.industry.length > 0 && !filters.industry.includes(job.industry)) {
        return false
      }

      // 職種フィルタ
      if (filters.jobType.length > 0 && !filters.jobType.includes(job.jobType)) {
        return false
      }

      // 待遇フィルタ
      if (filters.benefits.length > 0) {
        const hasBenefit = filters.benefits.some((benefit) => job.benefits.includes(benefit))
        if (!hasBenefit) return false
      }


      // ハッシュタグフィルタ
      if (filters.hashtags.length > 0) {
        const hasHashtag = filters.hashtags.some((hashtag) => job.tags.includes(hashtag))
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
        case "newest":
          return b.postedAt.getTime() - a.postedAt.getTime()
        case "popular":
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0)
        case "match":
          return b.matchScore - a.matchScore
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedTags, sortBy, filters])

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
      salary: [1000, 3000],
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
    (filters.salary[0] !== 1000 || filters.salary[1] !== 3000 ? 1 : 0) +
    selectedTags.length

  // フィルタ項目の表示値を取得する関数
  const getFilterDisplayValue = (filterType: string) => {
    switch (filterType) {
      case "jobType":
        return filters.jobType.length > 0 ? filters.jobType.join(", ") : "すべて"
      case "salary":
        return filters.salary[0] === 1000 && filters.salary[1] === 3000
          ? "指定なし"
          : `¥${filters.salary[0]} - ¥${filters.salary[1]}`
      case "benefits":
        return filters.benefits.length > 0 ? filters.benefits.join(", ") : "指定なし"
      case "excludeKeywords":
        return filters.excludeKeywords.length > 0 ? filters.excludeKeywords.join(", ") : "指定なし"
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
                        <Yen className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium">時給範囲</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.salary ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <Slider
                        value={filters.salary}
                        onValueChange={(value) => setFilters((prev) => ({ ...prev, salary: value }))}
                        max={3000}
                        min={1000}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>¥{filters.salary[0]}</span>
                        <span>¥{filters.salary[1]}</span>
                      </div>
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
                        <Briefcase className="h-5 w-5 text-gray-600" />
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
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium">勤務地</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${expandedSections.location ? "rotate-180" : ""}`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pt-3">
                      <div className="space-y-2">
                        {["東京都", "大阪府", "神奈川県", "愛知県", "リモート"].map((location) => (
                          <div key={location} className="flex items-center space-x-2">
                            <Checkbox
                              id={location}
                              checked={filters.location.includes(location)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFilters((prev) => ({ ...prev, location: [...prev.location, location] }))
                                } else {
                                  setFilters((prev) => ({
                                    ...prev,
                                    location: prev.location.filter((l) => l !== location),
                                  }))
                                }
                              }}
                            />
                            <label htmlFor={location} className="text-sm">
                              {location}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
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
                        <Sparkles className="h-5 w-5 text-gray-600" />
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
                    <Button className="flex-1">適用</Button>
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
                    src={job.image || "/placeholder.svg"}
                    alt={job.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  {Math.floor((Date.now() - job.postedAt.getTime()) / (1000 * 60 * 60 * 24)) < 3 && (
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
                      <span>{job.timeSlot}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold text-green-600 mb-2">{job.salary}</div>

                  {job.isPopular && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 mb-2">人気</Badge>}
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
