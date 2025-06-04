"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Star,
  Target,
  Brain,
  Trophy,
  CheckCircle,
  Home,
  MessageSquare,
  BarChart3,
  User,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// 診断設問データ
const questions = [
  // Big Five - 開放性
  {
    id: 1,
    category: "openness",
    text: "新しいアイデアや創造的な活動に興味がある",
    type: "bigfive",
  },
  {
    id: 2,
    category: "openness",
    text: "芸術や美的なものに関心が高い",
    type: "bigfive",
  },
  {
    id: 3,
    category: "openness",
    text: "変化や新しい経験を求める",
    type: "bigfive",
  },
  // Big Five - 誠実性
  {
    id: 4,
    category: "conscientiousness",
    text: "計画を立てて物事を進めるのが得意",
    type: "bigfive",
  },
  {
    id: 5,
    category: "conscientiousness",
    text: "責任感が強く、約束は必ず守る",
    type: "bigfive",
  },
  {
    id: 6,
    category: "conscientiousness",
    text: "細かい作業も丁寧に取り組める",
    type: "bigfive",
  },
  // Big Five - 外向性
  {
    id: 7,
    category: "extraversion",
    text: "人と話すことが好きで、エネルギッシュ",
    type: "bigfive",
  },
  {
    id: 8,
    category: "extraversion",
    text: "グループの中心になることが多い",
    type: "bigfive",
  },
  {
    id: 9,
    category: "extraversion",
    text: "積極的に行動を起こすタイプ",
    type: "bigfive",
  },
  // Big Five - 協調性
  {
    id: 10,
    category: "agreeableness",
    text: "他人に対して親切で思いやりがある",
    type: "bigfive",
  },
  {
    id: 11,
    category: "agreeableness",
    text: "チームワークを大切にする",
    type: "bigfive",
  },
  {
    id: 12,
    category: "agreeableness",
    text: "争いごとは避けたいと思う",
    type: "bigfive",
  },
  // Big Five - 神経症的傾向
  {
    id: 13,
    category: "neuroticism",
    text: "ストレスを感じやすい",
    type: "bigfive",
  },
  {
    id: 14,
    category: "neuroticism",
    text: "心配事があると気になって仕方がない",
    type: "bigfive",
  },
  {
    id: 15,
    category: "neuroticism",
    text: "感情の起伏が激しい方だ",
    type: "bigfive",
  },
  // キャリアアンカー
  {
    id: 16,
    category: "technical",
    text: "専門的なスキルや技術を極めたい",
    type: "anchor",
  },
  {
    id: 17,
    category: "management",
    text: "将来は管理職として組織を率いたい",
    type: "anchor",
  },
  {
    id: 18,
    category: "autonomy",
    text: "自分のペースで自由に働きたい",
    type: "anchor",
  },
  {
    id: 19,
    category: "security",
    text: "安定した職場環境で働きたい",
    type: "anchor",
  },
  {
    id: 20,
    category: "entrepreneurship",
    text: "新しいビジネスを創造したい",
    type: "anchor",
  },
  {
    id: 21,
    category: "service",
    text: "社会に貢献できる仕事をしたい",
    type: "anchor",
  },
  {
    id: 22,
    category: "challenge",
    text: "困難な課題に挑戦することが好き",
    type: "anchor",
  },
  {
    id: 23,
    category: "lifestyle",
    text: "仕事とプライベートのバランスを重視する",
    type: "anchor",
  },
  {
    id: 24,
    category: "technical",
    text: "技術的な問題解決に興味がある",
    type: "anchor",
  },
  {
    id: 25,
    category: "management",
    text: "人をまとめることが得意",
    type: "anchor",
  },
]

const scaleLabels = [
  "全く当てはまらない",
  "あまり当てはまらない",
  "どちらでもない",
  "やや当てはまる",
  "とても当てはまる",
]

export default function DiagnosisPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime] = useState(Date.now())
  const [isCompleted, setIsCompleted] = useState(false)

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const estimatedTime = Math.max(1, Math.ceil((questions.length - currentQuestion - 1) * 0.4))

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: Number.parseInt(value) }
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // 診断完了
      setIsCompleted(true)
      const completionTime = Math.round((Date.now() - startTime) / 1000 / 60)

      // 結果を保存（実際の実装では API 呼び出し）
      localStorage.setItem("diagnosisAnswers", JSON.stringify(answers))
      localStorage.setItem("diagnosisCompletionTime", completionTime.toString())

      // 結果ページに遷移
      router.push("/student/diagnosis/result")
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const currentAnswer = answers[questions[currentQuestion]?.id]
  const canProceed = currentAnswer !== undefined

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">診断完了！</h2>
            <p className="text-gray-600 mb-4">結果を分析中です...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">志向性診断</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>約{estimatedTime}分</span>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">進捗状況</span>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />

            {/* ゲーミフィケーション要素 */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">経験値 +{Math.floor(progress)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-orange-500" />
                <span className="text-sm">レベル {Math.floor(progress / 20) + 1}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">Q{currentQuestion + 1}</span>
              </div>
              <div className="flex items-center space-x-1">
                {questions[currentQuestion].type === "bigfive" ? (
                  <>
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600">性格特性</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">キャリア志向</span>
                  </>
                )}
              </div>
            </div>
            <CardTitle className="text-lg leading-relaxed">{questions[currentQuestion]?.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer?.toString()} onValueChange={handleAnswer} className="space-y-3">
              {scaleLabels.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                    {label}
                  </Label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= index ? "bg-blue-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            前の質問
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="flex-1">
            {currentQuestion === questions.length - 1 ? "診断完了" : "次の質問"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-blue-600">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">診断のコツ</h4>
                <p className="text-sm text-blue-700">
                  直感的に答えることで、より正確な結果が得られます。深く考えすぎず、最初に感じた印象で回答してください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
