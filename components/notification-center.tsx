"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, ChevronRight, Clock, Info, MessageSquare, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 通知タイプの定義
type NotificationType = "message" | "application" | "interview" | "system" | "feedback"

// 通知の型定義
interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  isRead: boolean
  link?: string
}

// モックデータ
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "新しいメッセージ",
    message: "株式会社テックスタートからメッセージが届いています",
    time: "10分前",
    isRead: false,
    link: "/student/messages/1",
  },
  {
    id: "2",
    type: "application",
    title: "応募状況の更新",
    message: "Webマーケティングアシスタントの応募が「書類選考中」になりました",
    time: "1時間前",
    isRead: false,
    link: "/student/applications/2",
  },
  {
    id: "3",
    type: "interview",
    title: "面接日程の確定",
    message: "クリエイティブ合同会社との面接が確定しました",
    time: "3時間前",
    isRead: true,
    link: "/student/interviews",
  },
  {
    id: "4",
    type: "system",
    title: "プロフィール更新のお願い",
    message: "プロフィールの入力が完了していません。完了させると応募率が上がります！",
    time: "1日前",
    isRead: true,
    link: "/student/profile",
  },
  {
    id: "5",
    type: "feedback",
    title: "新しいフィードバック",
    message: "イノベーション株式会社からフィードバックが届いています",
    time: "2日前",
    isRead: true,
    link: "/student/feedback/5",
  },
  {
    id: "6",
    type: "message",
    title: "新しいメッセージ",
    message: "カフェ・ド・パリからメッセージが届いています",
    time: "3日前",
    isRead: true,
    link: "/student/messages/6",
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // 未読通知の数を計算
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  // 通知を既読にする関数
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // すべての通知を既読にする関数
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  // 通知をフィルタリングする関数
  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications
    }
    if (activeTab === "unread") {
      return notifications.filter((notification) => !notification.isRead)
    }
    return notifications.filter((notification) => notification.type === activeTab)
  }

  // 通知アイコンを取得する関数
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "application":
        return <Info className="h-5 w-5 text-green-500" />
      case "interview":
        return <Clock className="h-5 w-5 text-purple-500" />
      case "system":
        return <Info className="h-5 w-5 text-gray-500" />
      case "feedback":
        return <Star className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative" aria-label="通知を開く">
          <Bell className="h-6 w-6 text-gray-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">通知</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                すべて既読にする
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b overflow-x-auto">
            <TabsList className="bg-transparent h-12 w-full justify-start px-4 gap-2">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-100 rounded-md">
                すべて
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-gray-100 rounded-md">
                未読
                {unreadCount > 0 && <Badge className="ml-1 bg-red-500 text-white text-xs">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="message" className="data-[state=active]:bg-gray-100 rounded-md">
                メッセージ
              </TabsTrigger>
              <TabsTrigger value="application" className="data-[state=active]:bg-gray-100 rounded-md">
                応募
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-gray-100 rounded-md">
                面接
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="divide-y">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id)
                      }
                      setIsOpen(false)
                    }}
                  >
                    <a href={notification.link} className="block">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">{notification.title}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{notification.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                        </div>
                        <div className="flex items-center">
                          {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <div className="flex justify-center mb-4">
                    <Bell className="h-12 w-12 text-gray-300" />
                  </div>
                  <p>通知はありません</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
