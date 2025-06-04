"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, UserCheck, Mail, Calendar, GraduationCap, Eye, Ban, Users } from "lucide-react"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [studentFilter, setStudentFilter] = useState("all")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ユーザー統計
  const [userStats, setUserStats] = useState({
    totalStudents: 2847,
    activeUsers: 1892,
  })

  // 学生ユーザー一覧
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "田中 太郎",
      email: "tanaka@example.com",
      university: "東京大学",
      faculty: "工学部",
      year: 3,
      registeredDate: "2024-05-15",
      lastLogin: "2024-06-01",
      status: "active",
      applications: 5,
      interviews: 2,
    },
    {
      id: 2,
      name: "佐藤 花子",
      email: "sato@example.com",
      university: "早稲田大学",
      faculty: "商学部",
      year: 2,
      registeredDate: "2024-05-20",
      lastLogin: "2024-06-02",
      status: "active",
      applications: 3,
      interviews: 1,
    },
    {
      id: 3,
      name: "山田 次郎",
      email: "yamada@example.com",
      university: "慶應義塾大学",
      faculty: "理工学部",
      year: 4,
      registeredDate: "2024-04-10",
      lastLogin: "2024-05-28",
      status: "suspended",
      applications: 8,
      interviews: 4,
    },
  ])

  // 学生ユーザー操作
  const handleStudentAction = async (studentId: number, action: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          switch (action) {
            case "suspend":
              return { ...student, status: "suspended" }
            case "activate":
              return { ...student, status: "active" }
            case "view":
              // 詳細表示の処理
              alert(`${student.name}の詳細を表示します`)
              break
          }
        }
        return student
      }),
    )
    setIsLoading(false)
  }

  // フィルタリング関数
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.university.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = studentFilter === "all" || student.status === studentFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "アクティブ"
      case "approved":
        return "承認済み"
      case "pending":
        return "承認待ち"
      case "suspended":
        return "停止中"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">学生ユーザー管理</h1>
            <p className="text-sm text-gray-600">学生ユーザーの管理と監視</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* ユーザー統計 */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学生ユーザー</p>
                  <p className="text-2xl font-bold">{userStats.totalStudents.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">アクティブユーザー</p>
                  <p className="text-2xl font-bold">{userStats.activeUsers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 学生ユーザー管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                学生ユーザー
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="名前・大学で検索"
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={studentFilter} onValueChange={setStudentFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="suspended">停止中</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-gray-600">
                          {student.university} {student.faculty} {student.year}年
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>登録: {student.registeredDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div>応募: {student.applications}件</div>
                        <div>面談: {student.interviews}件</div>
                        <div className="text-xs text-gray-500">最終ログイン: {student.lastLogin}</div>
                      </div>
                      <Badge className={getStatusColor(student.status)}>{getStatusText(student.status)}</Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStudentAction(student.id, "view")}
                          disabled={isLoading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleStudentAction(student.id, student.status === "active" ? "suspend" : "activate")
                          }
                          disabled={isLoading}
                          className={student.status === "suspended" ? "text-green-600" : "text-red-600"}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>検索条件に一致する学生が見つかりません</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
