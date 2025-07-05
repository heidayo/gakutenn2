"use client";

import { FC, useEffect, useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Star,
  Award,
  BookOpen,
  BarChart3,
  Target,
  Camera,
  ChevronRight,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase/client";

type ProfileRow = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  university: string | null;
  faculty: string | null;
  email: string | null;
  phone: string | null;
  year: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type Props = {
  email?: string; // optional; not currently used
};

const StudentProfileClient: FC<Props> = ({ email: _email }) => {
  // ----- データ型 -----
  type Skill = { name: string; level: number };
  type Experience = {
    company: string;
    role: string;
    period: string;
    rating: number;
    feedback: string;
  };
  type Diagnosis = {
    category: string;
    score: number;
    comment: string;
  };

  // ----- Supabase から取得したデータを保持する state -----
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
  const [totalApplications, setTotalApplications] = useState<number>(0);
  const [profileInfo, setProfileInfo] = useState<ProfileRow | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [feedbackRatings, setFeedbackRatings] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ----- 初回マウント時に Supabase からデータを取得 -----
  useEffect(() => {
    const fetchData = async () => {
      // Supabase Auth から user_id を取得
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        console.error("auth fetch error", authErr);
        return;
      }
      const userId = authUser.id;

      // プロフィール取得
      const { data: profData, error: profErr } = await (supabase as any)
        .from("profiles")
        .select("user_id, first_name, last_name, full_name, university, faculty, email, phone, year, location, bio, avatar_url")
        .eq("user_id", userId)
        .single();

      console.log("profData ↓↓↓", profData);   // ←★ 追加
      console.log("profErr  ↓↓↓", profErr);     // ←★ 追加

      if (profErr) {
        console.error("profile fetch error", profErr);
      } else {
        setProfileInfo(profData as ProfileRow);

        // ── avatarUrl の取得ロジック ──────────────────────────────
        const rawAvatarPath = (profData as any)?.avatar_url;
        if (rawAvatarPath) {
          // ① すでにフル URL が保存されている場合
          if (rawAvatarPath.startsWith("http")) {
            setAvatarUrl(rawAvatarPath);
          } else {
            // ② オブジェクトパスのみの場合は公開 URL を生成
            const {
              data: { publicUrl },
            } = (supabase as any)
              .storage
              .from("student.profile.picture")
              .getPublicUrl(rawAvatarPath);
            setAvatarUrl(publicUrl);
          }
        }

      // スキル取得
      const { data: skillData, error: skillErr } = await (supabase as any)
        .from("student_skills")
        .select("name, level")
        .eq("user_id", userId);

      if (skillErr) {
        console.error("skill fetch error", skillErr);
      } else {
        setSkills((skillData ?? []) as Skill[]);
      }

      // 経験取得
      const { data: expData, error: expErr } = await (supabase as any)
        .from("student_experiences")
        .select("company, role, period, rating, feedback")
        .eq("user_id", userId)
        .order("period", { ascending: false });

      if (expErr) {
        console.error("experience fetch error", expErr);
      } else {
        setExperiences((expData ?? []) as Experience[]);
      }

      // 志向性テスト結果取得
      const { data: diagData, error: diagErr } = await (supabase as any)
        .from("student_diagnosis_results")
        .select("category, score, comment")
        .eq("user_id", userId);

      if (diagErr) {
        console.error("diagnosis fetch error", diagErr);
      } else {
        setDiagnosis((diagData ?? []) as Diagnosis[]);
      }

      // フィードバック評価取得
      const { data: feedbackData, error: feedbackErr } = await (supabase as any)
        .from("feedbacks")
        .select("overall_rating")
        .eq("student_id", userId);

      if (feedbackErr) {
        console.error("feedback fetch error", feedbackErr);
      } else {
        setFeedbackRatings(
          (feedbackData ?? []).map((f: any) => f.overall_rating)
        );
      }

      // 応募総数取得
      const { count: appsCount, error: appsErr } = await (supabase as any)
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (appsErr) {
        console.error("applications fetch error", appsErr);
      } else {
        setTotalApplications(appsCount ?? 0);
      }
    }    // ← close the outer `else` block
    };   // ← close fetchData

    fetchData();
  }, []);

  // ----- アバターアップロード処理 -----
  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // user_id を取得
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;
    const userId = authUser.id;

    const filePath = `${userId}-${Date.now()}`;

    // ストレージへアップロード
    const { error: uploadErr } = await (supabase as any)
      .storage
      .from("student.profile.picture")
      .upload(filePath, file, { upsert: true });

    if (uploadErr) {
      console.error("avatar upload error", uploadErr);
      return;
    }

    // プロフィールテーブルを更新
    const { error: updateErr } = await (supabase as any)
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("user_id", userId);

    if (updateErr) {
      console.error("avatar url update error", updateErr);
      return;
    }

    const {
      data: { publicUrl },
    } = (supabase as any).storage.from("student.profile.picture").getPublicUrl(filePath);

    setAvatarUrl(publicUrl);
  };

  // ----- 平均評価を計算 -----
  const averageRating =
    feedbackRatings.length > 0
      ? feedbackRatings.reduce((sum, rating) => sum + rating, 0) / feedbackRatings.length
      : 0;

  // ----- プロフィール完成度計算用フィールド一覧 -----
  const profileFields = [
    'first_name',
    'last_name',
    'full_name',
    'university',
    'faculty',
    'email',
    'phone',
    'year',
    'location',
    'bio',
    'avatar_url'
  ] as const;
  // ----- プロフィール完成度を計算 -----
  const filledCount = profileFields.reduce(
    (cnt, field) => (profileInfo && (profileInfo as any)[field] ? cnt + 1 : cnt),
    0
  );
  const completionPercent = profileInfo
    ? Math.floor((filledCount / profileFields.length) * 100)
    : 0;

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
          <Link href="/student/account/edit">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              編集
            </Button>
          </Link>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* ------- 以下 UI は今までと同じ ------- */}
        {/* Profile Header */}
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profileInfo?.full_name?.charAt(0) ?? ""}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {profileInfo?.full_name ?? "氏名未登録"}
                </h2>
                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{profileInfo?.university ?? "大学名未登録"}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{profileInfo?.phone ?? "電話番号未登録"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">プロフィール完成度</span>
                <span className="font-semibold">{completionPercent}%</span>
              </div>
              <Progress value={completionPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Applications */}
          <Card className="text-center p-4 shadow-sm rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalApplications}</div>
            <div className="text-sm text-gray-600">応募総数</div>
          </Card>

          {/* Average Rating */}
          <Card className="shadow-sm rounded-lg text-center p-4">
            <div className="flex items-center justify-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-yellow-600">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">平均評価</div>
          </Card>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="space-y-3 max-w-2xl mx-auto px-4">

        <Card className="p-4 shadow-sm rounded-lg">
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

        <Card className="p-4 shadow-sm rounded-lg">
          <Link href="/student/dashboard" className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold text-sm">ダッシュボード</div>
                <div className="text-xs text-gray-600">応募状況を確認</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfileClient;