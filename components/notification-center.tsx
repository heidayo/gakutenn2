"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
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

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchNotifications = async () => {
      // messages
      const { data: messages, error: msgError } = await supabase
        .from("messages")
        .select("id, content, created_at, is_read")
      if (msgError) console.error(msgError)

      // applications
      const { data: applications, error: appError } = await supabase
        .from("applications")
        .select("id, status, created_at, is_read")
      if (appError) console.error(appError)

      // interviews
      const { data: interviews, error: intError } = await supabase
        .from("interviews")
        .select("id, date, start_time, status, is_read")
      if (intError) console.error(intError)

      // feedbacks
      const { data: feedbacks, error: fbError } = await supabase
        .from("feedbacks")
        .select("id, overall_comment, created_at, is_read")
      if (fbError) console.error(fbError)

      // normalize and combine
      const combined: Notification[] = [
        ...(messages ?? []).map(m => ({
          id: m.id,
          type: "message" as const,
          title: "新しいメッセージ",
          message: m.content,
          time: new Date(m.created_at).toLocaleString(),
          isRead: m.is_read,
          link: `/student/messages/${m.id}`,
        })),
        ...(applications ?? []).map(a => ({
          id: a.id,
          type: "application" as const,
          title: "応募状況の更新",
          message: `応募が「${a.status}」になりました`,
          time: new Date(a.created_at).toLocaleString(),
          isRead: a.is_read,
          link: `/student/applications/${a.id}`,
        })),
        ...(interviews ?? []).map(i => ({
          id: String(i.id),
          type: "interview" as const,
          title: "面接日程の確認",
          message: `${i.date} ${i.start_time} に面接が予定されています`,
          time: new Date(`${i.date}T${i.start_time}`).toLocaleString(),
          isRead: i.is_read,
          link: "/student/interviews",
        })),
        ...(feedbacks ?? []).map(fb => ({
          id: fb.id,
          type: "feedback" as const,
          title: "新しいフィードバック",
          message: fb.overall_comment,
          time: new Date(fb.created_at).toLocaleString(),
          isRead: fb.is_read,
          link: `/student/feedback/${fb.id}`,
        })),
      ]
      // sort by newest first
      combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setNotifications(combined)
    }

    fetchNotifications()
  }, [])

  // 未読通知の数を計算
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  // 通知を既読にする関数
  const markAsRead = async (id: string, type: NotificationType) => {
    let error;
    switch(type) {
      case "message":
        ({ error } = await supabase.from("messages").update({ is_read: true }).eq("id", id));
        break;
      case "application":
        ({ error } = await supabase.from("applications").update({ is_read: true }).eq("id", id));
        break;
      case "interview":
        ({ error } = await supabase
          .from("interviews")
          .update({ is_read: true })
          .eq("id", Number(id))  // convert string back to number
        );
        break;
      case "feedback":
        ({ error } = await supabase.from("feedbacks").update({ is_read: true }).eq("id", id));
        break;
    }
    if (error) console.error(`Failed to mark ${type} read:`, error);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  // すべての通知を既読にする関数
  const markAllAsRead = async () => {
    // update each table for unread items
    const updateTable = async (table: "messages" | "applications" | "interviews" | "feedbacks", ids: string[]) => {
      if (!ids.length) return;
      let error;
      if (table === "interviews") {
        // interviews.id is numeric
        const numIds = ids.map((id) => Number(id));
        ({ error } = await supabase.from(table).update({ is_read: true }).in("id", numIds));
      } else {
        ({ error } = await supabase.from(table).update({ is_read: true }).in("id", ids));
      }
      if (error) console.error(`Failed to mark all ${table} read:`, error);
    }
    const unreadByType = notifications.reduce<Record<NotificationType, string[]>>((acc, n) => {
      if (!n.isRead) acc[n.type].push(n.id);
      return acc;
    }, { message: [], application: [], interview: [], system: [], feedback: [] });
    await Promise.all([
      updateTable("messages", unreadByType.message),
      updateTable("applications", unreadByType.application),
      updateTable("interviews", unreadByType.interview),
      updateTable("feedbacks", unreadByType.feedback),
    ]);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
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

          <TabsContent value={activeTab} className="mt-0 flex-1 overflow-y-auto">
            <div className="divide-y">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50/30" : ""}`}
                    onClick={async () => {
                      if (!notification.isRead) {
                        await markAsRead(notification.id, notification.type)
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
