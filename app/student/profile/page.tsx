'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Star,
  Award,
  BookOpen,
  Target,
  Camera,
  ChevronRight,
  Home,
  MessageSquare,
  BarChart3,
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Database } from "@/lib/supabase/types";

export default function StudentProfilePage() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // 1) 認証ユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/student/mypage"); // ログインしていなければログイン画面へ
        return;
      }
      setAuthUser(user);

      // 2) プロフィールを取得
      const { data, error } = await supabase
        .from("profiles")            // ← プロフィールテーブル名
        .select("*")
        .eq("auth_user_id", user.id) // ← 認証ユーザーと紐づく列
        .single();

      if (!error) {
        setProfile(data);
      }
      setLoading(false);
    };

    load();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        読み込み中...
      </div>
    );
  }

  const skills = [
    { name: "Webマーケティング", level: 3 },
    { name: "データ分析", level: 2 },
    { name: "SNS運用", level: 4 },
    { name: "Excel", level: 3 },
    { name: "PowerPoint", level: 4 },
  ]

  const experiences = [
    {
      company: "株式会社テックスタート",
      role: "マーケティングアシスタント",
      period: "2024年1月 - 2024年3月",
      rating: 4.5,
      feedback: "積極的に取り組み、データ分析スキルが向上しました。",
    },
    {
      company: "クリエイティブ合同会社",
      role: "SNS運用サポート",
      period: "2023年11月 - 2023年12月",
      rating: 4.8,
      feedback: "クリエイティブな発想力と実行力が素晴らしかったです。",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">プロフィール</span>
          </div>
          {/* 編集ボタンのリンク先を変更します */}
          <Link href="/student/account/edit">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              編集
            </Button>
          </Link>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">田</span>
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0 bg-white border-2 border-gray-200"
                >
                  <Camera className="h-3 w-3 text-gray-600" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile?.full_name ?? "氏名未登録"}</h2>
                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{profile?.university ?? "大学名未登録"}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profile?.prefecture ?? "所在地未登録"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">プロフィール完成度</span>
                <span className="font-semibold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">連絡先情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{authUser?.email ?? "メール未登録"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">090-1234-5678</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-blue-600">15</div>
            <div className="text-sm text-gray-600">応募総数</div>
          </Card>
          <Card className="text-center p-4">
            <div className="flex items-center justify-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-yellow-600">4.3</span>
            </div>
            <div className="text-sm text-gray-600">平均評価</div>
          </Card>
        </div>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Target className="h-4 w-4 mr-2" />
              スキル
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skills.map((skill, index) => (
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

        {/* Diagnosis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              志向性診断結果
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">最新診断日</span>
              <span className="text-sm text-gray-600">2024年6月3日</span>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">トップ志向</div>
              <div className="flex flex-wrap gap-1">
                <Badge className="bg-green-100 text-green-700">技術・機能的能力 85%</Badge>
                <Badge className="bg-blue-100 text-blue-700">純粋な挑戦 78%</Badge>
                <Badge className="bg-purple-100 text-purple-700">起業家的創造性 72%</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">性格特性</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>開放性</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span>誠実性</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>外向性</span>
                  <span className="font-semibold">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>協調性</span>
                  <span className="font-semibold">82%</span>
                </div>
              </div>
            </div>

            <Link href="/student/diagnosis/result" className="block">
              <Button variant="outline" size="sm" className="w-full">
                詳細結果を見る
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Award className="h-4 w-4 mr-2" />
              実務経験
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4 space-y-2">
                <div>
                  <h4 className="font-semibold text-sm">{exp.role}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">{exp.period}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{exp.rating}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    フィードバックあり
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{exp.feedback}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Card className="p-4">
            <Link href="/student/diagnosis" className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-semibold text-sm">志向性診断</div>
                  <div className="text-xs text-gray-600">あなたの適性を診断</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </Link>
          </Card>

          <Card className="p-4">
            <Link href="/student/feedback" className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="font-semibold text-sm">フィードバック履歴</div>
                  <div className="text-xs text-gray-600">企業からの評価を確認</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
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
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-blue-600">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
