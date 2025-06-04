import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  Star,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Home,
  MessageSquare,
  BarChart3,
  User,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboardPage() {
  const upcomingInterviews = [
    {
      company: "株式会社テックスタート",
      role: "Webマーケティングアシスタント",
      date: "2024年6月5日",
      time: "14:00",
      type: "オンライン面談",
    },
    {
      company: "イノベーション株式会社",
      role: "データ分析補助",
      date: "2024年6月7日",
      time: "16:30",
      type: "対面面談",
    },
  ]

  const recentFeedback = [
    {
      company: "クリエイティブ合同会社",
      role: "SNS運用サポート",
      rating: 4.8,
      comment:
        "クリエイティブな発想力と実行力が素晴らしかったです。今後はデータ分析スキルを身につけると更に成長できると思います。",
      date: "2024年5月28日",
      isNew: true,
    },
    {
      company: "株式会社マーケティングプロ",
      role: "市場調査アシスタント",
      rating: 4.2,
      comment: "丁寧な作業で信頼できます。プレゼンテーション力を向上させることをお勧めします。",
      date: "2024年5月20日",
      isNew: false,
    },
  ]

  const goals = [
    { title: "月3件の応募", current: 2, target: 3, progress: 67 },
    { title: "平均評価4.5以上", current: 4.3, target: 4.5, progress: 96 },
    { title: "新スキル習得", current: 1, target: 2, progress: 50 },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href="/student">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <span className="text-lg font-semibold">ダッシュボード</span>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-lg font-bold text-green-600">15</div>
                <div className="text-xs text-gray-600">総応募数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-bold text-yellow-600">4.3</div>
                <div className="text-xs text-gray-600">平均評価</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">8</div>
                <div className="text-xs text-gray-600">合格数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-600">3</div>
                <div className="text-xs text-gray-600">進行中</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Target className="h-4 w-4 mr-2" />
              今月の目標
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{goal.title}</span>
                  <span className="text-gray-600">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              面談予定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="border rounded-lg p-3 bg-blue-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{interview.role}</h4>
                    <p className="text-sm text-gray-600">{interview.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                      <span>{interview.date}</span>
                      <span>{interview.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {interview.type}
                      </Badge>
                    </div>
                  </div>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </div>
              </div>
            ))}
            {upcomingInterviews.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">現在予定されている面談はありません</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Award className="h-4 w-4 mr-2" />
                最新のフィードバック
              </CardTitle>
              <Link href="/student/feedback">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.map((feedback, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm">{feedback.role}</h4>
                      {feedback.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{feedback.company}</p>
                    <p className="text-xs text-gray-500 mt-1">{feedback.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{feedback.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{feedback.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <Link href="/student/applications" className="flex flex-col items-center text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="text-sm font-semibold">応募状況</div>
              <div className="text-xs text-gray-600">進捗を確認</div>
            </Link>
          </Card>
          <Card className="p-4">
            <Link href="/student/diagnosis" className="flex flex-col items-center text-center space-y-2">
              <Target className="h-8 w-8 text-purple-600" />
              <div className="text-sm font-semibold">志向性診断</div>
              <div className="text-xs text-gray-600">適性を診断</div>
            </Link>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/messages" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">メッセージ</span>
          </Link>
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-blue-600">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
