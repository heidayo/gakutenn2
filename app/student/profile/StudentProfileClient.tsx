"use client";

import { FC } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Star,
  Award,
  BookOpen,
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

type ProfileRow = {
  full_name: string | null;
  university: string | null;
  prefecture: string | null;
};

type Props = {
  profile: ProfileRow | null;
  email: string;
};

const StudentProfileClient: FC<Props> = ({ profile, email }) => {
  /* ------ ダミーデータ ------ */
  const skills = [
    { name: "Webマーケティング", level: 3 },
    { name: "データ分析", level: 2 },
    { name: "SNS運用", level: 4 },
    { name: "Excel", level: 3 },
    { name: "PowerPoint", level: 4 },
  ];

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
  ];
  /* -------------------------- */

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

      <div className="px-4 py-6 space-y-6">
        {/* ------- 以下 UI は今までと同じ ------- */}
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {profile?.full_name?.charAt(0) ?? "田"}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0 bg-white border-2 border-gray-200"
                >
                  <Camera className="h-3 w-3 text-gray-600" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {profile?.full_name ?? "氏名未登録"}
                </h2>
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

        {/* 略 — ここから下は元コードそのまま貼り付けてください */}
        {/* Contact Info, Stats, Skills, Diagnosis Results, Experience, Quick Actions */}
      </div>
    </div>
  );
};

export default StudentProfileClient;