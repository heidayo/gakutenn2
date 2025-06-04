"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageSquare,
  Clock,
  CheckCheck,
  Star,
  Archive,
  Filter,
  MoreVertical,
  User,
  Calendar,
  Paperclip,
  Send,
  Phone,
  Video,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CompanyMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedChat, setSelectedChat] = useState<number | null>(1)

  // メッセージ統計
  const messageStats = {
    total: 45,
    unread: 8,
    urgent: 3,
    archived: 12,
    averageResponseTime: "2.3時間",
    responseRate: 94,
  }

  // チャットルーム一覧
  const chatRooms = [
    {
      id: 1,
      student: {
        name: "田中 太郎",
        university: "東京大学 経済学部 2年生",
        avatar: "T",
        profileImage: "/placeholder.svg?height=40&width=40",
      },
      job: "Webマーケティングアシスタント",
      lastMessage: "面談の件でご連絡いたします。来週の火曜日14:00はいかがでしょうか？",
      timestamp: "14:30",
      unreadCount: 2,
      isRead: false,
      hasAttachment: false,
      status: "面談調整中",
      priority: "normal",
      isOnline: true,
      lastSeen: "オンライン",
    },
    {
      id: 2,
      student: {
        name: "佐藤 花子",
        university: "早稲田大学 商学部 3年生",
        avatar: "S",
        profileImage: "/placeholder.svg?height=40&width=40",
      },
      job: "SNS運用サポート",
      lastMessage: "資料をありがとうございました。質問があります。",
      timestamp: "昨日",
      unreadCount: 1,
      isRead: false,
      hasAttachment: true,
      status: "書類確認中",
      priority: "high",
      isOnline: false,
      lastSeen: "2時間前",
    },
    {
      id: 3,
      student: {
        name: "山田 次郎",
        university: "慶應義塾大学 理工学部 2年生",
        avatar: "Y",
        profileImage: "/placeholder.svg?height=40&width=40",
      },
      job: "データ分析補助",
      lastMessage: "ありがとうございました！",
      timestamp: "2日前",
      unreadCount: 0,
      isRead: true,
      hasAttachment: false,
      status: "完了",
      priority: "normal",
      isOnline: false,
      lastSeen: "1日前",
    },
    {
      id: 4,
      student: {
        name: "鈴木 美咲",
        university: "上智大学 文学部 1年生",
        avatar: "S",
        profileImage: "/placeholder.svg?height=40&width=40",
      },
      job: "コンテンツ制作アシスタント",
      lastMessage: "面談の準備について教えてください。",
      timestamp: "3日前",
      unreadCount: 0,
      isRead: true,
      hasAttachment: false,
      status: "面談予定",
      priority: "normal",
      isOnline: true,
      lastSeen: "オンライン",
    },
  ]

  // 個別チャットのメッセージ
  const chatMessages = [
    {
      id: 1,
      sender: "student",
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
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "面談調整中":
        return "bg-blue-100 text-blue-800"
      case "書類確認中":
        return "bg-orange-100 text-orange-800"
      case "面談予定":
        return "bg-purple-100 text-purple-800"
      case "フィードバック済み":
        return "bg-green-100 text-green-800"
      case "完了":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-yellow-500"
      default:
        return "border-l-gray-200"
    }
  }

  const filteredChatRooms = chatRooms.filter((room) => {
    const matchesSearch =
      room.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.job.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedChatData = chatRooms.find((room) => room.id === selectedChat)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">メッセージ管理</h1>
            <p className="text-sm text-gray-600">学生とのコミュニケーション管理</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              アーカイブ
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Chat List */}
        <div className="w-96 bg-white border-r flex flex-col">
          {/* Stats */}
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{messageStats.total}</div>
                <div className="text-xs text-gray-600">総メッセージ</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">{messageStats.unread}</div>
                <div className="text-xs text-gray-600">未読</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">{messageStats.urgent}</div>
                <div className="text-xs text-gray-600">緊急</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="p-4 space-y-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="学生名または求人名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="面談調整中">面談調整中</SelectItem>
                <SelectItem value="書類確認中">書類確認中</SelectItem>
                <SelectItem value="面談予定">面談予定</SelectItem>
                <SelectItem value="完了">完了</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
                <TabsTrigger value="active">アクティブ</TabsTrigger>
                <TabsTrigger value="archived">アーカイブ</TabsTrigger>
                <TabsTrigger value="urgent">緊急</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-0">
                <div className="space-y-1 p-2">
                  {filteredChatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedChat(room.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${getPriorityColor(room.priority)} ${
                        selectedChat === room.id ? "bg-blue-50 border-r-2 border-r-blue-500" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{room.student.avatar}</span>
                          </div>
                          {room.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                          {room.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{room.unreadCount}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{room.student.name}</h3>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">{room.timestamp}</span>
                              {room.priority === "high" && <Star className="h-3 w-3 text-red-500 fill-current" />}
                            </div>
                          </div>

                          <p className="text-xs text-gray-600 mb-1">{room.student.university}</p>
                          <p className="text-xs text-blue-600 mb-2">{room.job}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {room.hasAttachment && <Paperclip className="h-3 w-3 text-gray-400 flex-shrink-0" />}
                              <p
                                className={`text-xs truncate ${
                                  room.unreadCount > 0 ? "font-semibold text-gray-900" : "text-gray-600"
                                }`}
                              >
                                {room.lastMessage}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="secondary" className={`text-xs ${getStatusColor(room.status)}`}>
                              {room.status}
                            </Badge>
                            <span className="text-xs text-gray-500">{room.lastSeen}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="archived" className="mt-0">
                <div className="p-4 text-center text-gray-500">
                  <Archive className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">アーカイブされたメッセージはありません</p>
                </div>
              </TabsContent>

              <TabsContent value="urgent" className="mt-0">
                <div className="space-y-1 p-2">
                  {filteredChatRooms
                    .filter((room) => room.priority === "high")
                    .map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedChat(room.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 border-l-red-500 ${
                          selectedChat === room.id ? "bg-blue-50 border-r-2 border-r-blue-500" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{room.student.avatar}</span>
                            </div>
                            <Star className="absolute -top-1 -right-1 h-4 w-4 text-red-500 fill-current" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-red-700">{room.student.name}</h3>
                            <p className="text-xs text-gray-600">{room.job}</p>
                            <p className="text-xs text-gray-700 mt-1">{room.lastMessage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{selectedChatData.student.avatar}</span>
                      </div>
                      {selectedChatData.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="font-semibold">{selectedChatData.student.name}</h2>
                        <Badge className={getStatusColor(selectedChatData.status)}>{selectedChatData.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{selectedChatData.student.university}</p>
                      <p className="text-sm text-blue-600">{selectedChatData.job}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/company/applications/${selectedChatData.id}`}>
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
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "company" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] ${msg.sender === "company" ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === "company"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${msg.sender === "company" ? "justify-end" : ""}`}
                      >
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

              {/* Message Input */}
              <div className="bg-white border-t px-6 py-4">
                <div className="flex items-end space-x-3">
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </Button>
                  <div className="flex-1">
                    <Input placeholder="メッセージを入力..." className="rounded-full border-gray-300" />
                  </div>
                  <Button className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick Replies */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" size="sm" className="text-xs">
                    面談日程を調整しましょう
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    書類を確認いたします
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    ありがとうございます
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">メッセージを選択</h3>
                <p className="text-sm text-gray-500">左側のリストからメッセージを選択してください</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Student Info */}
        {selectedChatData && (
          <div className="w-80 bg-white border-l p-6 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">{selectedChatData.student.avatar}</span>
              </div>
              <h3 className="font-semibold">{selectedChatData.student.name}</h3>
              <p className="text-sm text-gray-600">{selectedChatData.student.university}</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${selectedChatData.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                ></div>
                <span className="text-xs text-gray-600">{selectedChatData.lastSeen}</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">応募情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">応募求人:</span>
                  <p className="font-semibold text-sm">{selectedChatData.job}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ステータス:</span>
                  <Badge className={`ml-2 ${getStatusColor(selectedChatData.status)}`}>{selectedChatData.status}</Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">優先度:</span>
                  <Badge variant={selectedChatData.priority === "high" ? "destructive" : "secondary"} className="ml-2">
                    {selectedChatData.priority === "high" ? "高" : "通常"}
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
                  <span className="font-semibold">{selectedChatData.timestamp}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Link href={`/company/applications/${selectedChatData.id}`}>
                <Button className="w-full" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  詳細プロフィール
                </Button>
              </Link>
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                面談をスケジュール
              </Button>
              <Button className="w-full" variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                アーカイブ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
