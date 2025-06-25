
"use client"

import { v4 as uuidv4 } from 'uuid'

import { useEffect } from "react"
import { useParams } from 'next/navigation'
import { supabase } from "@/lib/supabase/client"

/** Local type for rows from company_chat_rooms_view */
type CompanyChatRoom = {
  application_id: string | null
  application_status: string | null
  chat_room_id: string | null
  job_title: string | null
  company_name: string | null
  last_message: string | null
  last_message_at: string | null
  unread_count: number | null
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Send,
  Paperclip,
  CalendarIcon,
  Phone,
  Video,
  MoreVertical,
  Download,
  CheckCheck,
  Clock,
  Building2,
  ImageIcon,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ChatPage() {
  const params = useParams()
  const roomId = params.id as string
  const [message, setMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)

  const [chatRooms, setChatRooms] = useState<CompanyChatRoom[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    if (!roomId) return
    async function fetchChatRooms() {
      setLoading(true)
      const { data: room, error } = await supabase
        .from('chat_rooms')
        .select(`
          id,
          application_id,
          created_at,
          applications!chat_rooms_application_id_fkey (
            status,
            next_step,
            next_date,
            jobs!applications_job_id_fkey (
              title,
              companies!jobs_company_id_fkey (
                id,
                name
              )
            )
          )
        `)
        .eq('id', Number(roomId))
        .single()

      if (error || !room) {
        console.error('chat rooms fetch error:', error)
      } else {
        setApplicationId(room.application_id)
        setCompanyId(room.applications?.jobs?.companies?.id ?? null)
        const mapped = [{
          chat_room_id: room.id.toString(),
          application_id: room.application_id,
          application_status: room.applications?.status ?? null,
          company_name: room.applications?.jobs?.companies?.name ?? "",
          job_title: room.applications?.jobs?.title ?? "",
          last_message: "",    // placeholder
          last_message_at: "", // placeholder
          unread_count: null,  // placeholder
        }]
        // console.log("mapped chatRooms:", mapped)
        setChatRooms(mapped)
        // Immediately after setChatRooms, chatRooms state is not updated yet, so log mapped here.
        // console.log("chatRooms fetched from Supabase:", mapped)
      }
      setLoading(false)
    }

    fetchChatRooms()
  }, [roomId])

  /** Local type for rows from messages table */
  type MessageRow = {
    id: string
    application_id: string
    content: string
    created_at: string
    is_read: boolean
    sender: string
    type: string
  }

  useEffect(() => {
    if (!roomId) return
    async function fetchMessages() {
      // chat_rooms テーブルから application_id を取得
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('application_id')
        .eq('id', Number(roomId))
        .single()

      if (roomError || !room) {
        console.error('chat room fetch error:', roomError)
        return
      }
      const applicationId = room.application_id
      setApplicationId(applicationId)

      // messages テーブルからメッセージを取得
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('messages fetch error:', error)
      } else if (data) {
        setMessagesData(data as MessageRow[])
      }
    }
    fetchMessages()
  }, [roomId])

  useEffect(() => {
    if (!applicationId) return

    const channel = supabase
      .channel(`public:messages:application_id=eq.${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          setMessagesData((prev) => [...prev, payload.new as MessageRow])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [applicationId])

  const [messagesData, setMessagesData] = useState<MessageRow[]>([])

  // Derive company and job info from chatRooms
  const currentRoom = chatRooms[0] || {};
  const companyName = currentRoom.company_name ?? "";
  const jobTitle = currentRoom.job_title ?? "";
  const companyLogo = companyName.charAt(0) ?? "";
  const companyStatus = currentRoom.application_status ?? "";

  // Debug logs for derived data
  // console.log("currentRoom:", currentRoom)
  // console.log("companyName:", companyName)

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const handleSendMessage = async () => {
    if (!message.trim() || !applicationId || !companyId) return
    const { data: inserted, error } = await supabase
      .from('messages')
      .insert({
        application_id: applicationId,
        company_id: companyId,
        content: message.trim(),
        sender: 'student',
        type: 'text',
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('message send error:', error)
    } else if (inserted) {
      setMessagesData(prev => [
        ...prev,
        {
          id: inserted.id,
          application_id: inserted.application_id,
          content: inserted.content,
          created_at: inserted.created_at,
          is_read: inserted.is_read,
          sender: inserted.sender,
          type: inserted.type,
        }
      ])
      setMessage('')
    }
  }

  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime) {
      // 日程調整送信処理
      console.log("Scheduling:", selectedDate, selectedTime)
      setShowScheduleDialog(false)
    }
  }

  const handleFileUpload = async (type: "image" | "file") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !applicationId) return;

      // Generate a safe and unique file path using uuidv4
      const extension = file.name.split('.').pop();
      const filePath = `${applicationId}/${Date.now()}_${uuidv4()}.${extension}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("student-chat-uploads")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      const { data: urlData } = supabase.storage.from("student-chat-uploads").getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      const { data: inserted, error: insertError } = await supabase
        .from("messages")
        .insert({
          application_id: applicationId,
          company_id: companyId,
          content: publicUrl,
          sender: "student",
          type,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("message insert error:", insertError);
      } else if (inserted) {
        setMessagesData((prev) => [
          ...prev,
          {
            id: inserted.id,
            application_id: inserted.application_id,
            content: inserted.content,
            created_at: inserted.created_at,
            is_read: inserted.is_read,
            sender: inserted.sender,
            type: inserted.type,
          },
        ]);
      }
    };
    input.click();
    setShowAttachmentMenu(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/messages">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{companyLogo}</span>
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-900">{jobTitle}</span>
              <p className="text-sm text-gray-600">{companyName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-4">
        {messagesData.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.sender === "student" ? "order-2" : "order-1"}`}>
              {msg.type === "text" ? (
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.sender === "student"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              ) : msg.type === "image" ? (
                <img
                  src={msg.content}
                  alt="アップロード画像"
                  className="rounded-lg max-w-xs"
                />
              ) : msg.type === "file" ? (
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <a
                        href={msg.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 underline break-all"
                      >
                        ファイルを開く
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(msg.content, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ) : null}
              <div className={`flex items-center space-x-1 mt-1 ${msg.sender === "student" ? "justify-end" : ""}`}>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                </span>
                {msg.sender === "student" && (
                  <div className="flex items-center">
                    {msg.is_read ? (
                      <CheckCheck className="h-3 w-3 text-blue-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t px-4 py-3 z-50">
        <div className="flex items-end space-x-2">
          {/* Attachment Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="h-10 w-10 p-0"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </Button>
            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFileUpload("image")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  画像
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFileUpload("file")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  ファイル
                </Button>
                <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      日程調整
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="rounded-full border-gray-300"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>日程調整</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>希望日</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>
            <div>
              <Label>希望時間</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>メッセージ（任意）</Label>
              <Textarea placeholder="追加のメッセージがあれば入力してください" className="mt-1" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="flex-1">
                キャンセル
              </Button>
              <Button onClick={handleScheduleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                送信
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
