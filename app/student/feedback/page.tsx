"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Filter,
  Home,
  MessageSquare,
  BarChart3,
  User,
  Calendar,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

export default function FeedbackListPage() {
  const [selectedCategory, setSelectedCategory] = useState("すべて")

  const [feedbackStats, setFeedbackStats] = useState({
    totalFeedbacks: 0,
    averageRating: 0,
    improvementRate: 0,
    learningNotes: 0,
  });

  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      // ① 認証セッションを取得
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('session fetch error', sessionError);
        return;
      }
      const user = session?.user;
      if (!user) {
        console.error('No logged-in user');
        return;
      }

      // ② フィードバック一覧を取得（テーブル名・カラムはスキーマに合わせて調整）
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*, company:companies(name), learning_notes(note)")
        .eq("student_id", user.id);

      if (error) {
        console.error("student_feedbacks fetch error", error);
        return;
      }

      // ③ UI 用に整形
      const formatted = (data ?? []).map((f: any) => ({
        id: f.id,
        company: f.company?.name ?? "",
        role: f.role,
        rating: f.rating,
        date: f.feedback_date,            // 例: "2025-06-01"
        isNew: f.is_new,
        hasLearningNote: Array.isArray(f.learning_notes) && f.learning_notes.length > 0,
        learningNote: Array.isArray(f.learning_notes) && f.learning_notes.length > 0 ? f.learning_notes[0].note : "",
        preview: f.preview_text,
        category: f.category,
        duration: f.duration_weeks ? `${f.duration_weeks}週間` : "",
      }));

      setFeedbackList(formatted);

      // ④ 統計計算
      const total = formatted.length;
      const avg =
        total > 0
          ? formatted.reduce((sum: number, f: any) => sum + (f.rating ?? 0), 0) / total
          : 0;
      const notes = formatted.filter((f: any) => f.hasLearningNote).length;

      setFeedbackStats({
        totalFeedbacks: total,
        averageRating: Number(avg.toFixed(1)),
        improvementRate: 0, // ← 必要に応じて計算ロジックを追加
        learningNotes: notes,
      });
    };

    fetchFeedbacks();
  }, []);

  const categories = ["すべて", "マーケティング", "クリエイティブ", "データ分析", "リサーチ"]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/dashboard">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">フィードバック</span>
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">{feedbackStats.totalFeedbacks}</div>
                <div className="text-xs text-gray-600">総フィードバック数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-600">{feedbackStats.learningNotes}</div>
                <div className="text-xs text-gray-600">学びメモ数</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <Badge
              key={index}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`whitespace-nowrap cursor-pointer ${
                selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">フィードバック履歴</h2>
            <span className="text-sm text-gray-600">
              {
                feedbackList.filter(
                  (feedback) => selectedCategory === "すべて" || feedback.category === selectedCategory,
                ).length
              }
              件
            </span>
          </div>

          {feedbackList
            .filter((feedback) => selectedCategory === "すべて" || feedback.category === selectedCategory)
            .map((feedback) => (
              <Link key={feedback.id} href={`/student/feedback/${feedback.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{feedback.company}</span>
                          {feedback.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                        </div>
                        <h3 className="font-semibold text-base mb-1">{feedback.role}</h3>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{feedback.date}</span>
                          </div>
                          <span>期間: {feedback.duration}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{feedback.rating}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{feedback.preview}</p>

                    {feedback.hasLearningNote && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-700">{feedback.learningNote}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {feedback.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {feedback.hasLearningNote ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            学びメモあり
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                            学びメモ未作成
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
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
