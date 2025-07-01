"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ImageIcon,
  FileText,
  User,
  Archive,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { supabase } from "@/lib/supabase/client";


type DisplayMessage = {
  id: string;
  sender: 'company' | 'student';
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'file';
  fileName?: string;
  fileSize?: string;
}

export default function CompanyChatPage({ params }: { params: { companyId: string; id: string } }) {
  const [message, setMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)

  

  const student = {
    id: 1,
    name: "田中 太郎",
    university: "東京大学 経済学部 2年生",
    avatar: "T",
    email: "tanaka.taro@example.com",
    phone: "090-1234-5678",
    status: "面談調整中",
    job: "Webマーケティングアシスタント",
    isOnline: true,
    lastSeen: "オンライン",
    priority: "normal",
  }

  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: "1",
      sender: "company",
      content: "この度は弊社の求人にご応募いただき、ありがとうございます。",
      timestamp: "10:30",
      isRead: true,
      type: "text",
    },
    {
      id: "2",
      sender: "company",
      content: "書類選考の結果、面談をさせていただきたく思います。",
      timestamp: "10:31",
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      sender: "student",
      content: "ありがとうございます！ぜひよろしくお願いいたします。",
      timestamp: "11:15",
      isRead: true,
      type: "text",
    },
    {
      id: "4",
      sender: "company",
      content: "面談の件でご連絡いたします。来週の火曜日14:00はいかがでしょうか？",
      timestamp: "14:30",
      isRead: false,
      type: "text",
    },
    {
      id: "5",
      sender: "student",
      content: "",
      timestamp: "14:31",
      isRead: false,
      type: "file",
      fileName: "履歴書.pdf",
      fileSize: "1.2MB",
    },
  ]);

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const quickReplies = [
    "面談日程を調整しましょう",
    "書類を確認いたします",
    "ありがとうございます",
    "詳細をお聞かせください",
    "お疲れ様でした",
  ]

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        sender: 'company',
        content: message.trim(),
        company_id: params.companyId,
        chat_room_id: Number(params.id),  // Convert string ID to number
        application_id: params.id,    // Keep if still needed for later
      }])
      .select();
    if (error) {
      console.error('メッセージ送信エラー', error);
    } else if (Array.isArray(data) && data.length > 0) {
      const newMsg = data[0];
      setMessages(prev => [
        ...prev,
        {
          id: newMsg.id,
          sender: newMsg.sender as 'company' | 'student',
          content: newMsg.content,
          timestamp: new Date(newMsg.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
          type: 'text',
        }
      ]);
      setMessage('');

      // --- 通知用の student_id を取得 ---
      let studentId: string;
      try {
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('student_id')
          .eq('id', params.id)
          .single();
        if (appError || !appData) {
          console.error('アプリケーション取得エラー', appError);
          return;
        }
        // @ts-ignore: override missing generated schema for student_id
        studentId = (appData as any).student_id;
      } catch (e) {
        console.error('アプリケーション取得例外', e);
        return;
      }

      // --- notifications テーブルに挿入 ---
      const { error: notifyError } = await supabase
        .from('notifications')
        .insert([{
          recipient_type: 'student',
          recipient_id: studentId,
          resource: 'message',
          resource_id: newMsg.id,
          payload: { content: newMsg.content },
        }]);
      if (notifyError) {
        console.error('通知送信エラー', notifyError);
      }
    }
  }

  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime) {
      console.log("Scheduling:", selectedDate, selectedTime)
      setShowScheduleDialog(false)
    }
  }

  const handleFileUpload = (type: "image" | "file") => {
    console.log("Uploading:", type)
    setShowAttachmentMenu(false)
  }

  const handleQuickReply = (reply: string) => {
    setMessage(reply)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "面談調整中":
        return "bg-blue-100 text-blue-800"
      case "書類確認中":
        return "bg-orange-100 text-orange-800"
      case "面談予定":
        return "bg-purple-100 text-purple-800"
      case "完了":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/company/messages">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                メッセージ一覧
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{student.avatar}</span>
                </div>
                {student.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-semibold">{student.name}</h2>
                  <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{student.university}</p>
                <p className="text-sm text-blue-600">{student.job}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href={`/company/applications/${student.id}`}>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                プロフィール
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              通話
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-2" />
              ビデオ通話
            </Button>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              重要
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              アーカイブ
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "company" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${msg.sender === "company" ? "order-2" : "order-1"}`}>
                  {msg.type === "text" ? (
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        msg.sender === "company"
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ) : (
                    <Card className="p-3 bg-white border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{msg.fileName}</p>
                          <p className="text-xs text-gray-500">{msg.fileSize}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )}
                  <div className={`flex items-center space-x-1 mt-1 ${msg.sender === "company" ? "justify-end" : ""}`}>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    {msg.sender === "company" && (
                      <div className="flex items-center">
                        {msg.isRead ? (
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

          {/* Quick Replies */}
          <div className="px-6 py-2 border-t bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t px-6 py-4">
            <div className="flex items-end space-x-3">
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
        </div>

        {/* Right Sidebar - Student Info */}
        <div className="w-80 bg-white border-l p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl font-bold">{student.avatar}</span>
            </div>
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-sm text-gray-600">{student.university}</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className={`w-2 h-2 rounded-full ${student.isOnline ? "bg-green-500" : "bg-gray-400"}`}></div>
              <span className="text-xs text-gray-600">{student.lastSeen}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">連絡先</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">メール:</span>
                <p className="font-semibold text-sm">{student.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">電話:</span>
                <p className="font-semibold text-sm">{student.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">応募情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">応募求人:</span>
                <p className="font-semibold text-sm">{student.job}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">ステータス:</span>
                <Badge className={`ml-2 ${getStatusColor(student.status)}`}>{student.status}</Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">優先度:</span>
                <Badge variant={student.priority === "high" ? "destructive" : "secondary"} className="ml-2">
                  {student.priority === "high" ? "高" : "通常"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">メッセージ統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">総メッセージ数:</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">平均応答時間:</span>
                <span className="font-semibold">1.2時間</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">最終メッセージ:</span>
                <span className="font-semibold">14:30</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Link href={`/company/applications/${student.id}`}>
              <Button className="w-full" variant="outline">
                <User className="h-4 w-4 mr-2" />
                詳細プロフィール
              </Button>
            </Link>
            <Button className="w-full" variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              面談をスケジュール
            </Button>
            <Button className="w-full" variant="outline">
              <Archive className="h-4 w-4 mr-2" />
              アーカイブ
            </Button>
          </div>
        </div>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>面談スケジュール</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>面談日</Label>
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
              <Label>面談形式</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="面談形式を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">オンライン</SelectItem>
                  <SelectItem value="offline">対面</SelectItem>
                  <SelectItem value="phone">電話</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>メッセージ（任意）</Label>
              <Textarea placeholder="面談に関する追加情報があれば入力してください" className="mt-1" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)} className="flex-1">
                キャンセル
              </Button>
              <Button onClick={handleScheduleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                スケジュール送信
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
