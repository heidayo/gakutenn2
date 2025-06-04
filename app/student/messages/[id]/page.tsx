"use client"

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

export default function ChatPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)

  const company = {
    name: "株式会社テックスタート",
    logo: "T",
    status: "面談調整中",
  }

  const messages = [
    {
      id: 1,
      sender: "company",
      content: "この度は弊社の求人にご応募いただき、ありがとうございます。",
      timestamp: "10:30",
      isRead: true,
      type: "text",
    },
    {
      id: 2,
      sender: "company",
      content: "書類選考の結果、面談をさせていただきたく思います。",
      timestamp: "10:31",
      isRead: true,
      type: "text",
    },
    {
      id: 3,
      sender: "student",
      content: "ありがとうございます！ぜひよろしくお願いいたします。",
      timestamp: "11:15",
      isRead: true,
      type: "text",
    },
    {
      id: 4,
      sender: "company",
      content: "面談の件でご連絡いたします。来週の火曜日14:00はいかがでしょうか？",
      timestamp: "14:30",
      isRead: false,
      type: "text",
    },
    {
      id: 5,
      sender: "company",
      content: "",
      timestamp: "14:31",
      isRead: false,
      type: "file",
      fileName: "面談資料.pdf",
      fileSize: "2.3MB",
    },
  ]

  const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const handleSendMessage = () => {
    if (message.trim()) {
      // メッセージ送信処理
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime) {
      // 日程調整送信処理
      console.log("Scheduling:", selectedDate, selectedTime)
      setShowScheduleDialog(false)
    }
  }

  const handleFileUpload = (type: "image" | "file") => {
    // ファイルアップロード処理
    console.log("Uploading:", type)
    setShowAttachmentMenu(false)
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
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{company.logo}</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold text-sm">{company.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 mt-1">
                  {company.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
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
              ) : (
                <Card className="p-3 bg-white border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
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
              <div className={`flex items-center space-x-1 mt-1 ${msg.sender === "student" ? "justify-end" : ""}`}>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                {msg.sender === "student" && (
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

      {/* Input Area */}
      <div className="bg-white border-t px-4 py-3">
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
