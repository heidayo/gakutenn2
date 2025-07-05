"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
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

  // ─── Supabase‑driven state ──────────────────────────────
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [acceptedCount, setAcceptedCount] = useState<number>(0);
  const [ongoingCount, setOngoingCount] = useState<number>(0);

  const [upcomingInterviews, setUpcomingInterviews] = useState<any[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<{ company: string; role: string; rating: number; comment: string; date: string; isNew: boolean }[]>([]);
  const [goals, setGoals] = useState<
    { title: string; current: number; target: number; progress: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const userId = user.id;

      // ── Applications & status counts ─────────────────────
      const { data: apps } = await supabase
        .from("applications")
        .select("status")
        .eq("user_id", userId);

      if (apps) {
        setTotalApplications(apps.length);
        setAcceptedCount(apps.filter(a => a.status === "合格").length);
        setOngoingCount(apps.filter(a => a.status === "進行中").length);
      }

      // ── Feedback ────────────────────────────────────────
      const { data: fb } = await supabase
        .from("feedbacks")
        .select(`
          overall_rating,
          overall_comment,
          created_at,
          company:companies(name),
          job:jobs(title)
        `)
        .eq("student_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (fb) {
        setRecentFeedback(
          fb.map(f => ({
            company: f.company.name,
            role: f.job?.title || "",
            rating: f.overall_rating,
            comment: f.overall_comment,
            date: new Date(f.created_at).toLocaleDateString("ja-JP"),
            isNew: new Date(f.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          }))
        );
        if (fb.length) {
          const avg = fb.reduce((s, f) => s + (f.overall_rating || 0), 0) / fb.length;
          setAverageRating(Number(avg.toFixed(1)));
        }
      }

      // ── Interviews ──────────────────────────────────────
      const { data: iv, error: ivError } = await supabase
        .from("interviews")
        .select(
          `
            date,
            start_time,
            end_time,
            type,
            company:companies!company_id(name),
            job:jobs!job_id(title)
          `
        )
        .eq("applicant_id", userId)
        .neq("status", "完了")
        .order("date", { ascending: true });

      if (ivError) {
        console.error("Error fetching upcoming interviews:", ivError);
      } else if (iv) {
        setUpcomingInterviews(
          iv.map((i) => ({
            company: i.company?.name || "",
            role: i.job?.title || "",
            date: new Date(i.date).toLocaleDateString("ja-JP"),
            time: i.start_time,
            type: `${i.type}面談`,
          }))
        );
      }

      // ── Monthly goals (example calc) ────────────────────
      const total = apps?.length ?? 0;
      const progressApplications = Math.min(Math.round((total / 3) * 100), 100);
      const progressRating = averageRating
        ? Math.min(Math.round((averageRating / 4.5) * 100), 100)
        : 0;

      setGoals([
        { title: "月3件の応募", current: total, target: 3, progress: progressApplications },
        { title: "平均評価4.5以上", current: averageRating, target: 4.5, progress: progressRating },
        { title: "新スキル習得", current: 1, target: 2, progress: 50 },
      ]);
    };

    fetchData();
  }, []);

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
                <div className="text-lg font-bold text-green-600">{totalApplications}</div>
                <div className="text-xs text-gray-600">総応募数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-lg font-bold text-yellow-600">{averageRating || 0}</div>
                <div className="text-xs text-gray-600">平均評価</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-lg font-bold text-blue-600">{acceptedCount}</div>
                <div className="text-xs text-gray-600">合格数</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-lg font-bold text-purple-600">{ongoingCount}</div>
                <div className="text-xs text-gray-600">進行中</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="p-4">
            <Link href="/student/applications" className="flex flex-col items-center text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="text-sm font-semibold">応募状況</div>
              <div className="text-xs text-gray-600">進捗を確認</div>
            </Link>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                面談予定
              </CardTitle>
              <Link href="/student/interviews">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  すべて見る
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingInterviews.map((interview, index) => (
              <Link key={index} href="/student/interviews" className="block">
                <div className="border rounded-lg p-3 bg-blue-50 hover:bg-blue-100">
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
              </Link>
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
