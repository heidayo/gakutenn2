import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Star,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = {
    id: 1,
    company: "株式会社テックスタート",
    role: "Webマーケティングアシスタント",
    appliedDate: "2024年6月1日",
    status: "面談予定",
    statusColor: "bg-blue-100 text-blue-800",
    progress: 50,
    location: "東京都渋谷区",
    salary: "時給1,200円",

    selectionFlow: [
      {
        step: 1,
        title: "書類選考",
        status: "completed",
        date: "2024年6月1日",
        result: "通過",
        feedback: "プロフィールと志望動機が非常に良く書けています。",
      },
      {
        step: 2,
        title: "オンライン面談",
        status: "scheduled",
        date: "2024年6月5日 14:00",
        result: "",
        feedback: "",
      },
      {
        step: 3,
        title: "体験勤務",
        status: "pending",
        date: "",
        result: "",
        feedback: "",
      },
      {
        step: 4,
        title: "最終結果",
        status: "pending",
        date: "",
        result: "",
        feedback: "",
      },
    ],

    applicationData: {
      motivation:
        "データ分析に興味があり、実際のビジネスデータを扱う経験を積みたいと思い応募いたします。大学でマーケティングを学んでおり、理論と実践を結びつけたいと考えています。",
      selfPR:
        "大学のゼミでデータ分析プロジェクトを担当し、Excelを使った分析経験があります。また、SNSを日常的に使用しており、トレンドに敏感です。",
      availableDays: ["月曜日", "水曜日", "金曜日"],
      startDate: "2024年6月10日",
    },

    interviewer: {
      name: "田中 マネージャー",
      role: "マーケティング部門責任者",
      message: "面談でお会いできることを楽しみにしています。",
    },
  }

  const getStepStatus = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: <CheckCircle className="h-5 w-5 text-green-600" />, color: "bg-green-100" }
      case "scheduled":
        return { icon: <Clock className="h-5 w-5 text-blue-600" />, color: "bg-blue-100" }
      case "pending":
        return { icon: <AlertCircle className="h-5 w-5 text-gray-400" />, color: "bg-gray-100" }
      default:
        return { icon: <AlertCircle className="h-5 w-5 text-gray-400" />, color: "bg-gray-100" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href="/student/applications">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <span className="text-lg font-semibold">応募詳細</span>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Application Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{application.company}</span>
                </div>
                <h1 className="text-xl font-bold mb-2">{application.role}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{application.location}</span>
                  </div>
                  <span>{application.salary}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>応募日: {application.appliedDate}</span>
                </div>
              </div>
              <Badge className={application.statusColor}>{application.status}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">選考進捗</span>
                <span>{application.progress}%</span>
              </div>
              <Progress value={application.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Selection Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">選考フロー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {application.selectionFlow.map((step, index) => {
                const stepStatus = getStepStatus(step.status)
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stepStatus.color}`}>
                      {stepStatus.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sm">{step.title}</h4>
                        {step.result && (
                          <Badge variant="outline" className="text-xs">
                            {step.result}
                          </Badge>
                        )}
                      </div>
                      {step.date && <p className="text-xs text-gray-600 mb-1">{step.date}</p>}
                      {step.feedback && (
                        <div className="bg-blue-50 p-2 rounded text-xs text-gray-700">{step.feedback}</div>
                      )}
                      {step.status === "scheduled" && (
                        <div className="mt-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            面談詳細を確認
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Interviewer Info */}
        {application.interviewer && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">面接官情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">田</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{application.interviewer.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{application.interviewer.role}</p>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-gray-700">"{application.interviewer.message}"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">応募内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">志望動機</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{application.applicationData.motivation}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">自己PR</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{application.applicationData.selfPR}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">勤務可能曜日</h4>
              <div className="flex flex-wrap gap-1">
                {application.applicationData.availableDays.map((day, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">勤務開始希望日</h4>
              <p className="text-sm text-gray-700">{application.applicationData.startDate}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/student/messages/1`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              企業とメッセージ
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              応募内容編集
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              求人を保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
