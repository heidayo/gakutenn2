"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Share2,
  Download,
  Star,
  Trophy,
  Target,
  Brain,
  TrendingUp,
  Users,
  Lightbulb,
  CheckCircle,
  Home,
  MessageSquare,
  BarChart3,
  User,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"

// 診断結果の型定義
interface DiagnosisResult {
  bigFive: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  careerAnchors: {
    technical: number
    management: number
    autonomy: number
    security: number
    entrepreneurship: number
    service: number
    challenge: number
    lifestyle: number
  }
  completionTime: number
  level: number
  experience: number
}

// Big Five の説明
const bigFiveDescriptions = {
  openness: {
    name: "開放性",
    description: "新しい経験や創造的な活動への関心",
    high: "創造的で好奇心旺盛、新しいアイデアを受け入れやすい",
    low: "伝統的で実用的、確立された方法を好む",
  },
  conscientiousness: {
    name: "誠実性",
    description: "責任感と自己統制の強さ",
    high: "計画的で責任感が強く、目標達成に向けて努力する",
    low: "柔軟で自発的、状況に応じて行動する",
  },
  extraversion: {
    name: "外向性",
    description: "社交性とエネルギーの向け方",
    high: "社交的でエネルギッシュ、人との交流を好む",
    low: "内省的で静か、少数の深い関係を好む",
  },
  agreeableness: {
    name: "協調性",
    description: "他者への思いやりと協力的態度",
    high: "思いやりがあり協力的、調和を重視する",
    low: "競争的で批判的、自分の意見をはっきり言う",
  },
  neuroticism: {
    name: "神経症的傾向",
    description: "感情の安定性とストレス耐性",
    high: "感情的で敏感、ストレスを感じやすい",
    low: "冷静で安定、ストレスに強い",
  },
}

// キャリアアンカーの説明
const careerAnchorDescriptions = {
  technical: {
    name: "技術・機能的能力",
    description: "専門的なスキルや技術を極めたい",
    jobs: ["エンジニア", "デザイナー", "研究職", "専門コンサルタント"],
  },
  management: {
    name: "管理能力",
    description: "組織を率いて成果を上げたい",
    jobs: ["マネージャー", "プロジェクトリーダー", "経営企画", "チームリーダー"],
  },
  autonomy: {
    name: "自律・独立",
    description: "自分のペースで自由に働きたい",
    jobs: ["フリーランス", "起業家", "コンサルタント", "在宅ワーカー"],
  },
  security: {
    name: "保障・安定",
    description: "安定した環境で働きたい",
    jobs: ["公務員", "大企業社員", "教員", "銀行員"],
  },
  entrepreneurship: {
    name: "起業家的創造性",
    description: "新しいビジネスを創造したい",
    jobs: ["起業家", "新規事業開発", "ベンチャー企業", "イノベーター"],
  },
  service: {
    name: "奉仕・社会貢献",
    description: "社会に貢献できる仕事をしたい",
    jobs: ["NPO職員", "医療従事者", "教育関係者", "社会起業家"],
  },
  challenge: {
    name: "純粋な挑戦",
    description: "困難な課題に挑戦したい",
    jobs: ["コンサルタント", "営業", "研究開発", "アスリート"],
  },
  lifestyle: {
    name: "ワーク・ライフ・バランス",
    description: "仕事と私生活の調和を重視",
    jobs: ["時短勤務", "リモートワーク", "フレックス勤務", "副業・複業"],
  },
}

export default function DiagnosisResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 診断結果を計算（実際の実装では API から取得）
    const answers = JSON.parse(localStorage.getItem("diagnosisAnswers") || "{}")
    const completionTime = Number.parseInt(localStorage.getItem("diagnosisCompletionTime") || "0")

    // 簡易的な結果計算
    const calculateResult = (): DiagnosisResult => {
      const bigFive = {
        openness: Math.floor(Math.random() * 40) + 60,
        conscientiousness: Math.floor(Math.random() * 40) + 60,
        extraversion: Math.floor(Math.random() * 40) + 60,
        agreeableness: Math.floor(Math.random() * 40) + 60,
        neuroticism: Math.floor(Math.random() * 40) + 30,
      }

      const careerAnchors = {
        technical: Math.floor(Math.random() * 40) + 60,
        management: Math.floor(Math.random() * 40) + 50,
        autonomy: Math.floor(Math.random() * 40) + 55,
        security: Math.floor(Math.random() * 40) + 45,
        entrepreneurship: Math.floor(Math.random() * 40) + 70,
        service: Math.floor(Math.random() * 40) + 50,
        challenge: Math.floor(Math.random() * 40) + 65,
        lifestyle: Math.floor(Math.random() * 40) + 60,
      }

      return {
        bigFive,
        careerAnchors,
        completionTime,
        level: 3,
        experience: 250,
      }
    }

    setResult(calculateResult())
  }, [])

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">結果を分析中...</p>
        </div>
      </div>
    )
  }

  // トップ3のキャリアアンカーを取得
  const topAnchors = Object.entries(result.careerAnchors)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">診断結果</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* 完了おめでとう */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">診断完了おめでとう！</h2>
            <p className="text-blue-100 mb-4">
              {result.completionTime}分で完了 • レベル{result.level}にアップ！
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>+{result.experience} EXP</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>診断バッジ獲得</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* あなたのキャリア志向 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              あなたのキャリア志向
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topAnchors.map(([key, value], index) => {
              const anchor = careerAnchorDescriptions[key as keyof typeof careerAnchorDescriptions]
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-semibold">{anchor.name}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                  <p className="text-sm text-gray-600">{anchor.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {anchor.jobs.slice(0, 3).map((job) => (
                      <Badge key={job} variant="outline" className="text-xs">
                        {job}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 性格特性 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              あなたの性格特性
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(result.bigFive).map(([key, value]) => {
              const trait = bigFiveDescriptions[key as keyof typeof bigFiveDescriptions]
              const isHigh = value >= 70
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{trait.name}</span>
                    <span className="text-sm font-bold text-purple-600">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                  <p className="text-sm text-gray-600">{isHigh ? trait.high : trait.low}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* おすすめアクション */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <Lightbulb className="h-5 w-5 mr-2" />
              あなたへのおすすめ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800">スキル開発</h4>
                <p className="text-sm text-orange-700">
                  技術志向が高いあなたには、プログラミングやデザインスキルの習得がおすすめです
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800">インターン選び</h4>
                <p className="text-sm text-orange-700">
                  スタートアップや技術系企業でのインターンがあなたの成長につながります
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Target className="h-4 w-4 mr-2" />
            おすすめ求人を見る
          </Button>
          <Button variant="outline" className="w-full">
            <User className="h-4 w-4 mr-2" />
            プロフィールに反映
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "詳細を隠す" : "詳細な分析を見る"}
          </Button>
        </div>

        {/* 詳細分析（展開可能） */}
        {showDetails && (
          <Card>
            <CardHeader>
              <CardTitle>詳細分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">強み</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 創造性と技術的思考のバランスが良い</li>
                  <li>• 新しい挑戦に対して積極的</li>
                  <li>• チームワークを大切にする</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">成長ポイント</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ストレス管理スキルの向上</li>
                  <li>• リーダーシップ経験の積み重ね</li>
                  <li>• 長期的な計画立案能力の強化</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">探す</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
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
