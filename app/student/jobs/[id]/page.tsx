"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bookmark,
  Share,
  MapPin,
  Clock,
  Star,
  Building2,
  Users,
  Calendar,
  Wifi,
  Heart,
  CheckCircle,
  AlertCircle,
  JapaneseYenIcon as Yen,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const job = {
    id: 1,
    company: "株式会社テックスタート",
    companyLogo: "T",
    title: "Webマーケティングアシスタント",
    location: "東京都渋谷区",
    salary: "時給1,200円",
    duration: "週1回〜",
    isNew: true,
    matchRate: 85,
    tags: ["未経験歓迎", "週1OK", "リモート可", "交通費支給"],
    description:
      "急成長中のスタートアップで、Webマーケティングの実務経験を積みませんか？データ分析からSNS運用まで、幅広いマーケティング業務を経験できます。未経験でも丁寧に指導しますので、安心してご応募ください。",
    responsibilities: [
      "Google Analytics等を使用したWebサイトのデータ分析",
      "SNSアカウント（Instagram、Twitter）の運用サポート",
      "マーケティング資料の作成（PowerPoint、Excel使用）",
      "競合他社の調査・分析",
      "広告運用の補助業務",
    ],
    requirements: [
      "大学1〜3年生",
      "Excel、PowerPointの基本操作ができる方",
      "SNSを日常的に使用している方",
      "データ分析に興味がある方",
      "週1回以上の勤務が可能な方",
    ],
    benefits: [
      "交通費全額支給",
      "リモートワーク可（週1回以上の出社必須）",
      "実務経験証明書の発行",
      "社員との1on1メンタリング",
      "マーケティングツールの使用経験",
    ],
    workStyle: {
      remote: "可能（週1回出社）",
      hours: "10:00-18:00（応相談）",
      frequency: "週1回〜3回",
      duration: "1ヶ月〜3ヶ月",
    },
    selectionProcess: [
      { step: 1, title: "書類選考", duration: "3日以内", description: "プロフィールと志望動機を確認" },
      { step: 2, title: "オンライン面談", duration: "1週間以内", description: "30分程度のカジュアル面談" },
      { step: 3, title: "体験勤務", duration: "1日", description: "実際の業務を体験（有給）" },
      { step: 4, title: "最終結果", duration: "2日以内", description: "合否連絡とフィードバック" },
    ],
    companyInfo: {
      name: "株式会社テックスタート",
      industry: "IT・インターネット",
      employees: "50名",
      founded: "2020年",
      description: "AIを活用したマーケティングソリューションを提供するスタートアップ企業です。",
    },
    mentor: {
      name: "田中 マネージャー",
      role: "マーケティング部門責任者",
      experience: "マーケティング歴8年",
      message: "未経験でも大歓迎！一緒に成長していきましょう。",
    },
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const renderMatchRate = (rate: number) => {
    const color = rate >= 80 ? "text-green-600" : rate >= 60 ? "text-yellow-600" : "text-red-600"
    const bgColor = rate >= 80 ? "bg-green-100" : rate >= 60 ? "bg-yellow-100" : "bg-red-100"

    return (
      <div className={`${bgColor} px-3 py-1 rounded-full`}>
        <div className="flex items-center space-x-1">
          <Star className={`h-4 w-4 ${color} fill-current`} />
          <span className={`text-sm font-semibold ${color}`}>マッチ度 {rate}%</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">求人詳細</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleBookmark}>
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current text-blue-600" : "text-gray-600"}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Job Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{job.companyLogo}</span>
                  </div>
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{job.company}</span>
                  {job.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                </div>
                <h1 className="text-xl font-bold mb-3">{job.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-green-600 font-semibold mb-3">
                  <Yen className="h-5 w-5" />
                  <span>{job.salary}</span>
                </div>
              </div>
              <div className="text-right">{renderMatchRate(job.matchRate)}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Work Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">働き方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">リモート</div>
                  <div className="text-sm font-semibold">{job.workStyle.remote}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-xs text-gray-600">勤務時間</div>
                  <div className="text-sm font-semibold">{job.workStyle.hours}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-600">頻度</div>
                  <div className="text-sm font-semibold">{job.workStyle.frequency}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-xs text-gray-600">期間</div>
                  <div className="text-sm font-semibold">{job.workStyle.duration}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">業務内容</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">応募条件</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待遇・福利厚生</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.benefits.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Selection Process */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">選考フロー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {job.selectionProcess.map((process, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{process.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-sm">{process.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {process.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">企業情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">業界:</span>
                <span className="ml-2 font-semibold">{job.companyInfo.industry}</span>
              </div>
              <div>
                <span className="text-gray-600">従業員数:</span>
                <span className="ml-2 font-semibold">{job.companyInfo.employees}</span>
              </div>
              <div>
                <span className="text-gray-600">設立:</span>
                <span className="ml-2 font-semibold">{job.companyInfo.founded}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700">{job.companyInfo.description}</p>
          </CardContent>
        </Card>

        {/* Mentor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">メンター紹介</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">田</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{job.mentor.name}</h4>
                <p className="text-xs text-gray-600 mb-1">{job.mentor.role}</p>
                <p className="text-xs text-gray-600 mb-2">{job.mentor.experience}</p>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-700">"{job.mentor.message}"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/student/jobs/${job.id}/apply`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">この求人に応募する</Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              質問する
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <Building2 className="h-4 w-4 mr-2" />
              企業ページ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
