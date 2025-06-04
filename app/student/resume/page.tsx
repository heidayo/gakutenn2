import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Download,
  Share,
  Star,
  Building2,
  Calendar,
  Award,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function ResumePage() {
  const resumeData = {
    personalInfo: {
      name: "田中 太郎",
      email: "tanaka.taro@example.com",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
      university: "東京大学 経済学部 2年生",
    },
    experiences: [
      {
        id: 1,
        company: "株式会社テックスタート",
        role: "Webマーケティングアシスタント",
        period: "2024年5月 - 2024年5月",
        duration: "2週間",
        rating: 4.5,
        description:
          "データ分析を中心としたマーケティング業務に従事。Excelの高度な機能（ピボットテーブル、VLOOKUP関数）を習得し、実際の顧客データを分析してレポートを作成。チームメンバーとの連携も円滑に行い、積極的な姿勢で業務に取り組んだ。",
        learnings: "データ分析の重要性を実感し、Excelスキルが大幅に向上。今後はプレゼンテーション力の向上が課題。",
        skills: ["Excel", "データ分析", "マーケティング基礎"],
      },
      {
        id: 2,
        company: "クリエイティブ合同会社",
        role: "SNS運用サポート",
        period: "2024年4月 - 2024年4月",
        duration: "1ヶ月",
        rating: 4.8,
        description:
          "Instagram、Twitter等のSNSアカウント運用をサポート。コンテンツ企画から投稿まで一連の業務を経験。フォロワー数20%増加に貢献し、エンゲージメント率も向上させた。",
        learnings: "クリエイティブな発想力と実行力を評価いただいた。SNSマーケティングの基礎を習得。",
        skills: ["SNS運用", "コンテンツ企画", "画像編集"],
      },
    ],
    skills: [
      { name: "Excel", level: 4 },
      { name: "データ分析", level: 3 },
      { name: "SNS運用", level: 4 },
      { name: "マーケティング基礎", level: 3 },
      { name: "コミュニケーション", level: 4 },
    ],
    completionRate: 85,
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/profile">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">履歴書</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Completion Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">履歴書完成度</span>
              <span className="text-sm font-semibold">{resumeData.completionRate}%</span>
            </div>
            <Progress value={resumeData.completionRate} className="h-2 mb-3" />
            <p className="text-xs text-gray-600">
              実務経験を追加して履歴書を充実させましょう。企業からのフィードバックが自動で反映されます。
            </p>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User className="h-4 w-4 mr-2" />
              基本情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resumeData.personalInfo.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resumeData.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resumeData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resumeData.personalInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{resumeData.personalInfo.university}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                実務経験
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.experiences.map((exp, index) => (
              <div key={exp.id} className="border-l-2 border-blue-200 pl-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{exp.role}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{exp.period}</span>
                      </div>
                      <span>期間: {exp.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(exp.rating)}
                    <span className="text-xs font-semibold ml-1">{exp.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">業務内容</h5>
                    <p className="text-xs text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">学びと成長</h5>
                    <p className="text-xs text-gray-600 leading-relaxed bg-blue-50 p-2 rounded">{exp.learnings}</p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">習得スキル</h5>
                    <div className="flex flex-wrap gap-1">
                      {exp.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Award className="h-4 w-4 mr-2" />
              スキル
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{skill.name}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= skill.level ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Notes Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              学びの記録
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
              <div className="text-sm text-gray-600">総学びメモ数</div>
              <p className="text-xs text-gray-500 mt-2">
                企業からのフィードバックを基に作成した学びメモが履歴書に反映されています。
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            PDF形式でダウンロード
          </Button>
          <Button variant="outline" className="w-full">
            <Share className="h-4 w-4 mr-2" />
            履歴書を共有
          </Button>
        </div>
      </div>
    </div>
  )
}
