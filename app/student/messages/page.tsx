"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search,
  ArrowLeft,
  MoreVertical,
  Home,
  MessageSquare,
  BarChart3,
  User,
  Building2,
  CheckCheck,
  Paperclip,
} from "lucide-react"
import Link from "next/link"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface ChatRoom {
  id: number
  company: string
  companyLogo: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isRead: boolean
  hasAttachment: boolean
  status: string
  messageId: string
}

export default function StudentMessagesPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      // 現在ログイン中の student_id を取得
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: rooms, error } = await supabase
        .from("student_chat_rooms_view")
        .select("room_id, company_name, company_logo, last_message, last_message_at, has_attachment, status, last_message_id")
        .eq("student_id", user.id)
        .order("last_message_at", { ascending: false })

      if (error) {
        console.error("ルーム取得エラー", error)
        return
      }

      const mapped = (rooms ?? []).map((r: any) => ({
        id: r.room_id,
        company: r.company_name,
        companyLogo: r.company_logo ?? r.company_name.charAt(0),
        lastMessage: r.last_message,
        timestamp: new Date(r.last_message_at).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        unreadCount: 0,
        isRead: true,
        hasAttachment: r.has_attachment,
        status: r.status,
        messageId: r.last_message_id,
      }))

      const roomsWithUnread = await Promise.all(
        mapped.map(async (room) => {
          const { count, error: countError } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: false })
            .eq('student_id', user.id)
            .eq('resource', 'message')
            .eq('resource_id', room.messageId)
            .eq('is_read', false)
          if (countError) console.error('通知カウントエラー', countError)
          return { ...room, unreadCount: count ?? 0 }
        })
      )

      setChatRooms(roomsWithUnread)
      if (roomsWithUnread.length > 0) setSelectedRoomId(roomsWithUnread[0].id)
    }

    fetchRooms()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "面談調整中":
        return "bg-blue-100 text-blue-800"
      case "書類確認中":
        return "bg-orange-100 text-orange-800"
      case "フィードバック済み":
        return "bg-green-100 text-green-800"
      case "完了":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">メッセージ</span>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="企業名で検索" className="pl-10 h-10 bg-gray-50 border-gray-200" />
        </div>
      </div>

      {/* Chat Rooms List */}
      <div className="px-4 py-2">
        {chatRooms.map((room) => (
          <Link key={room.id} href={`/student/messages/${room.id}`}>
            <Card
              onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                  const { error: updateError } = await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .eq('student_id', user.id)
                    .eq('resource', 'message')
                    .eq('resource_id', room.messageId)
                  if (updateError) console.error('通知既読エラー', updateError)
                }
                // Optimistically clear badge for this room
                setChatRooms(prev =>
                  prev.map(r =>
                    r.id === room.id ? { ...r, unreadCount: 0 } : r
                  )
                )
                setSelectedRoomId(room.id)
              }}
              className={`mb-2 p-4 hover:bg-gray-50 transition-colors ${
                selectedRoomId === room.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Company Logo */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{room.companyLogo}</span>
                  </div>
                  {room.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{room.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold text-sm truncate">{room.company}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{room.timestamp}</span>
                      {room.isRead && <CheckCheck className="h-3 w-3 text-blue-500" />}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {room.hasAttachment && <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                      <p
                        className={`text-sm truncate ${
                          room.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {room.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Badge variant="secondary" className={`text-xs ${getStatusColor(room.status)}`}>
                      {room.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {chatRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">メッセージはありません</h3>
          <p className="text-sm text-gray-500 text-center">
            企業に応募すると、こちらでメッセージのやり取りができます。
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/messages" className="flex flex-col items-center justify-center space-y-1 text-blue-600">
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
