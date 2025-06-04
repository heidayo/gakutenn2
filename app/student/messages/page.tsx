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

export default function StudentMessagesPage() {
  const chatRooms = [
    {
      id: 1,
      company: "株式会社テックスタート",
      companyLogo: "T",
      lastMessage: "面談の件でご連絡いたします。来週の火曜日14:00はいかがでしょうか？",
      timestamp: "14:30",
      unreadCount: 2,
      isRead: false,
      hasAttachment: false,
      status: "面談調整中",
    },
    {
      id: 2,
      company: "クリエイティブ合同会社",
      companyLogo: "C",
      lastMessage: "ありがとうございました！",
      timestamp: "昨日",
      unreadCount: 0,
      isRead: true,
      hasAttachment: false,
      status: "完了",
    },
    {
      id: 3,
      company: "イノベーション株式会社",
      companyLogo: "I",
      lastMessage: "契約書を添付いたします。ご確認ください。",
      timestamp: "2日前",
      unreadCount: 1,
      isRead: false,
      hasAttachment: true,
      status: "書類確認中",
    },
    {
      id: 4,
      company: "マーケティングプロ",
      companyLogo: "M",
      lastMessage: "お疲れ様でした。フィードバックをお送りします。",
      timestamp: "1週間前",
      unreadCount: 0,
      isRead: true,
      hasAttachment: false,
      status: "フィードバック済み",
    },
  ]

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
            <Card className="mb-2 p-4 hover:bg-gray-50 transition-colors">
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
