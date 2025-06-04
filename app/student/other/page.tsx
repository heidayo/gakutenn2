"use client"

import React from "react"
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Download,
  Star,
  MessageCircle,
  Bookmark,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Menu items for the other page
const menuSections = [
  {
    title: "アカウント",
    items: [
      {
        title: "プロフィール編集",
        description: "基本情報・スキル・経験を編集",
        icon: User,
        url: "/student/account/edit",
        badge: null,
      },
      {
        title: "通知設定",
        description: "メッセージ・求人通知の設定",
        icon: Bell,
        url: "/student/notifications",
        badge: null,
      },
      {
        title: "セキュリティ",
        description: "パスワード・2段階認証",
        icon: Shield,
        url: "/student/security",
        badge: null,
      },
    ],
  },
  {
    title: "活動",
    items: [
      {
        title: "保存した求人",
        description: "ブックマークした求人一覧",
        icon: Bookmark,
        url: "/student/favorites",
        badge: "12",
      },
      {
        title: "応募履歴",
        description: "過去の応募状況を確認",
        icon: FileText,
        url: "/student/applications",
        badge: null,
      },
      {
        title: "フィードバック履歴",
        description: "受け取ったフィードバック",
        icon: MessageCircle,
        url: "/student/feedback",
        badge: "3",
      },
    ],
  },
  {
    title: "サポート",
    items: [
      {
        title: "ヘルプセンター",
        description: "よくある質問・使い方ガイド",
        icon: HelpCircle,
        url: "/help",
        badge: null,
      },
      {
        title: "データダウンロード",
        description: "個人データのダウンロード",
        icon: Download,
        url: "/student/data-export",
        badge: null,
      },
      {
        title: "アプリを評価",
        description: "App Store・Google Playで評価",
        icon: Star,
        url: "/rate-app",
        badge: null,
      },
    ],
  },
]

export default function StudentOtherPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="プロフィール画像" />
              <AvatarFallback>山田</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold">山田 太郎</h1>
              <p className="text-gray-600">taro.yamada@example.com</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="text-xs">
                  プロフィール完成度: 85%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-4 py-6 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">{section.title}</h2>
            <Card>
              <CardContent className="p-0">
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    <Link href={item.url}>
                      <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{item.title}</h3>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Link>
                    {itemIndex < section.items.length - 1 && <Separator className="ml-16" />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Logout Button */}
        <Card>
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full justify-start p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">ログアウト</h3>
                  <p className="text-sm text-gray-600">アカウントからログアウト</p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* App Info */}
      <div className="px-4 pb-20">
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>学転インターン v1.0.0</p>
          <div className="flex justify-center space-x-4">
            <Link href="/privacy" className="hover:text-gray-700">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
