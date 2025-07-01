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
      // ① Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) console.error(userError);
      if (!user) return;

      // Determine whether the user is a student or a company from metadata
      const userRole = (user.user_metadata?.role as 'student' | 'company') ?? 'student';
      const filterColumn = userRole === 'company' ? 'company_id' : 'student_id';

      // ② Fetch unified notifications for this user
      const { data: rows, error: fetchError } = await supabase
        .from("notifications")
        .select("id, resource, resource_id, payload, is_read, created_at")
        .eq(filterColumn, user.id)
        .order("created_at", { ascending: false });
      if (fetchError) console.error(fetchError);

      // ③ Normalize into Notification[]
      const combined: Notification[] = (rows ?? []).map(row => {
        const pl = (row.payload ?? {}) as { title?: string; message?: string; link?: string };
        // Determine resource path and default link:
        let defaultLink: string;
        if (row.resource === "feedback") {
          // feedback uses singular with ID
          defaultLink = `/${userRole}/feedback/${row.resource_id}`;
        } else if (row.resource === "interview") {
          // interview (面談予定) uses singular without ID
          defaultLink = `/${userRole}/interviews`;
        } else {
          // others use plural with ID
          defaultLink = `/${userRole}/${row.resource}s/${row.resource_id}`;
        }
        const resolvedLink = pl.link
          ? pl.link.startsWith("/")
            ? `/${userRole}${pl.link}`
            : `/${userRole}/${pl.link}`
          : defaultLink;
        return {
          id: row.id,
          type: row.resource as NotificationType,
          title: pl.title ?? "通知",
          message: pl.message ?? "",
          time: new Date(row.created_at).toLocaleString(),
          isRead: row.is_read,
          link: resolvedLink,
        };
      });

      setNotifications(combined);
    }

    fetchNotifications()
  }, [])

  // 未読通知の数を計算
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  // 通知を既読にする関数
  const markAsRead = async (id: string, type: NotificationType) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    if (error) console.error("Failed to mark read:", error);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }

  // すべての通知を既読にする関数
  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", unreadIds);
      if (error) console.error("Failed to mark all read:", error);
    }
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
