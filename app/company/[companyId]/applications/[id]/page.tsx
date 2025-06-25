"use client"

import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Star,
  Download,
  Share,
  MapPin,
  Mail,
  Phone,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useEffect } from "react"

export default function ApplicantDetailPage() {
  const params = useParams()
  const paramCompanyId = Array.isArray(params.companyId) ? params.companyId[0] : params.companyId
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id
  if (!paramId) {
    return <div className="p-6 text-center">応募IDが不正です</div>
  }
  const id = paramId
  const [showInterviewDialog, setShowInterviewDialog] = useState(false)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [rating, setRating] = useState("")
  const [decision, setDecision] = useState("")

  const [applicant, setApplicant] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplicant = async () => {
      // Fetch application record
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", id)
        .single();

      if (appError) {
        console.error("Error fetching application:", appError);
        setLoading(false);
        return;
      }

      // Fetch profile based on user_id
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, full_name, phone, email, location")
        .eq("user_id", appData.user_id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Combine and set applicant
      setApplicant({ ...appData, profiles: profileData });
      setLoading(false);
    };
    fetchApplicant();
  }, [id]);

  const handleScheduleInterview = () => {
    if (interviewDate && interviewTime) {
      console.log("Scheduling interview:", { date: interviewDate, time: interviewTime })
      alert("面談をスケジュールしました！")
      setShowInterviewDialog(false)
    }
  }

  const handleSubmitFeedback = () => {
    if (feedbackText && rating && decision) {
      console.log("Submitting feedback:", { feedback: feedbackText, rating, decision })
      alert("フィードバックを送信しました！")
      setShowFeedbackDialog(false)
    }
  }

  const handleDecision = async (status: string) => {
    if (!applicant) return;
    // TODO: Replace with real Supabase update when integrated
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Error updating status:", error);
      alert("ステータスの更新に失敗しました");
    } else {
      setApplicant({ ...applicant, status });
      alert(`ステータスを「${status}」に更新しました`);
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  if (loading) {
    return <div className="p-6 text-center">読み込み中...</div>
  }
  if (!applicant) {
    return <div className="p-6 text-center">応募情報が見つかりません</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/company/${paramCompanyId}/applications`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                応募者一覧に戻る
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{applicant.name}</h1>
              <p className="text-sm text-gray-600">
                {applicant.title} への応募 | 応募日: {new Date(applicant.created_at).toLocaleDateString("ja-JP")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              className={
                applicant.status === "書類選考中"
                  ? "bg-yellow-100 text-yellow-800"
                  : applicant.status === "面談予定"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
              }
            >
              {applicant.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF出力
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              共有
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Profile Summary */}
        <div className="w-80 bg-white border-r p-6 space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">
                {applicant.name ? applicant.name.split(" ").map((n: string) => n[0]).join("") : ""}
              </span>
            </div>
            <h2 className="text-xl font-bold">{applicant.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{applicant.university}</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{applicant.profiles?.location}</span>
            </div>
          </div>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">連絡先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{applicant.profiles?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{applicant.profiles?.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {/* ここは applications テーブルに統計がなければ非表示にするか、ダミーで空欄 */}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  面談をスケジュール
                </Button>
              </DialogTrigger>
            </Dialog>

            <Link href={`/company/messages/${applicant.id}`}>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                メッセージを送信
              </Button>
            </Link>

            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  評価・フィードバック
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* Quick Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">選考判定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleDecision("採用")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                採用
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => handleDecision("不採用")}
              >
                <XCircle className="h-4 w-4 mr-2" />
                不採用
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDecision("保留")}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                保留
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="application" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="application">応募情報</TabsTrigger>
              <TabsTrigger value="experience">実務経験</TabsTrigger>
              <TabsTrigger value="skills">スキル</TabsTrigger>
              <TabsTrigger value="personality">診断結果</TabsTrigger>
              <TabsTrigger value="learning">学習記録</TabsTrigger>
            </TabsList>

            {/* 応募情報 */}
            <TabsContent value="application" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>応募内容・自己PR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-gray-700">{applicant.additional_info}</p>
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">勤務可能日</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(applicant.available_days)
                        ? applicant.available_days.map((day: string) => (
                            <Badge key={day} variant="outline">
                              {day}
                            </Badge>
                          ))
                        : null}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">勤務開始希望日</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-semibold">
                      {applicant.start_date
                        ? new Date(applicant.start_date).toLocaleDateString("ja-JP")
                        : ""}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 実務経験 */}
            <TabsContent value="experience" className="space-y-6">
              {applicant.workExperience?.map((exp: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{exp.role}</CardTitle>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {exp.period} ({exp.duration})
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(exp.rating)}
                        <span className="text-sm font-semibold ml-1">{exp.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">業務内容</h4>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">企業からのフィードバック</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{exp.feedback}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">習得スキル</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.skills?.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* スキル */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>スキル一覧</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {applicant.skills?.map((skill: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{skill.name}</span>
                            {skill.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5">実証済み</Badge>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${star <= skill.level ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <Progress value={(skill.level / 5) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {applicant.skillGrowthHistory && applicant.skillGrowthHistory.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>スキル成長履歴</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applicant.skillGrowthHistory.map((growth: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold">{growth.skillName}</p>
                            <p className="text-xs text-gray-600">
                              レベル {growth.fromLevel} → {growth.toLevel} に向上
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">{growth.date}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>スキル成長履歴</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">データがありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* 診断結果 */}
            <TabsContent value="personality" className="space-y-6">
              {applicant.personalityTest ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>志向性診断結果</CardTitle>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{applicant.personalityTest.overallScore}</div>
                          <div className="text-xs text-gray-600">総合スコア</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">実施日: {applicant.personalityTest.completedDate}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applicant.personalityTest.categories?.map((category: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{category.name}</h4>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getScoreColor(category.score)}`}
                              >
                                {category.score}点
                              </div>
                            </div>
                            <Progress value={category.score} className="h-2" />
                            <p className="text-xs text-gray-600">{category.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {category.strengths?.map((strength: any) => (
                                <Badge key={strength} variant="outline" className="text-xs">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">推奨職種</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {applicant.personalityTest.recommendedRoles?.map((role: any) => (
                            <div key={role} className="flex items-center space-x-2">
                              <Target className="h-4 w-4 text-green-600" />
                              <span className="text-sm">{role}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">働き方の特徴</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{applicant.personalityTest.workStyle}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">診断結果の詳細分析</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <BarChart3 className="h-8 w-8 text-blue-600" />
                          </div>
                          <p className="text-xs font-semibold">分析思考型</p>
                          <p className="text-xs text-gray-600">データ重視</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Users className="h-8 w-8 text-green-600" />
                          </div>
                          <p className="text-xs font-semibold">協調型</p>
                          <p className="text-xs text-gray-600">チームワーク</p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                          </div>
                          <p className="text-xs font-semibold">成長志向</p>
                          <p className="text-xs text-gray-600">学習意欲</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </TabsContent>

            {/* 学習記録 */}
            <TabsContent value="learning" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>学習メモ一覧</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applicant.learningNotes?.map((note: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{note.company}</h4>
                          <span className="text-xs text-gray-500">{note.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{note.content}</p>
                        <div className="flex flex-wrap gap-1">
                          {note.skills?.map((skill: any) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {applicant.learningStats ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学習統計</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {applicant.learningStats.totalNotes}
                        </div>
                        <div className="text-xs text-gray-600">総学習メモ数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {applicant.learningStats.skillCount}
                        </div>
                        <div className="text-xs text-gray-600">習得スキル数</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {applicant.learningStats.averageGrowth}
                        </div>
                        <div className="text-xs text-gray-600">平均成長率</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">学習統計</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">データがありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>面談スケジュール</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>面談日</Label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>時間</Label>
              <Select value={interviewTime} onValueChange={setInterviewTime}>
                <SelectTrigger>
                  <SelectValue placeholder="時間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowInterviewDialog(false)} className="flex-1">
                キャンセル
              </Button>
              <Button onClick={handleScheduleInterview} className="flex-1 bg-blue-600 hover:bg-blue-700">
                スケジュール
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>評価・フィードバック</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>評価</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="評価を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">★★★★★ (5.0)</SelectItem>
                  <SelectItem value="4">★★★★☆ (4.0)</SelectItem>
                  <SelectItem value="3">★★★☆☆ (3.0)</SelectItem>
                  <SelectItem value="2">★★☆☆☆ (2.0)</SelectItem>
                  <SelectItem value="1">★☆☆☆☆ (1.0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>選考結果</Label>
              <Select value={decision} onValueChange={setDecision}>
                <SelectTrigger>
                  <SelectValue placeholder="結果を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pass">採用</SelectItem>
                  <SelectItem value="fail">不採用</SelectItem>
                  <SelectItem value="hold">保留</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>フィードバック</Label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="学生への詳細なフィードバックを入力してください..."
                className="min-h-[120px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)} className="flex-1">
                キャンセル
              </Button>
              <Button onClick={handleSubmitFeedback} className="flex-1 bg-blue-600 hover:bg-blue-700">
                送信
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
