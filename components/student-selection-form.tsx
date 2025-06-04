"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, MapPin, Calendar, Building, GraduationCap } from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  university: string
  department: string
  year: number
  location: string
  internshipTitle: string
  internshipPeriod: string
  internshipDepartment: string
  status: "active" | "completed" | "upcoming"
  profileImage?: string
}

interface StudentSelectionFormProps {
  onStudentSelect: (studentId: number) => void
}

export default function StudentSelectionForm({ onStudentSelect }: StudentSelectionFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  // モックデータ
  const students: Student[] = [
    {
      id: 1,
      name: "田中 太郎",
      email: "tanaka.taro@example.com",
      university: "東京大学",
      department: "経済学部",
      year: 2,
      location: "東京都",
      internshipTitle: "Webマーケティングアシスタント",
      internshipPeriod: "2024年6月1日 - 2024年8月31日",
      internshipDepartment: "マーケティング部",
      status: "active",
    },
    {
      id: 2,
      name: "佐藤 花子",
      email: "sato.hanako@example.com",
      university: "早稲田大学",
      department: "商学部",
      year: 3,
      location: "東京都",
      internshipTitle: "フロントエンド開発インターン",
      internshipPeriod: "2024年7月1日 - 2024年9月30日",
      internshipDepartment: "エンジニアリング部",
      status: "active",
    },
    {
      id: 3,
      name: "鈴木 一郎",
      email: "suzuki.ichiro@example.com",
      university: "慶應義塾大学",
      department: "理工学部",
      year: 4,
      location: "神奈川県",
      internshipTitle: "データサイエンスインターン",
      internshipPeriod: "2024年5月1日 - 2024年7月31日",
      internshipDepartment: "データ分析部",
      status: "completed",
    },
    {
      id: 4,
      name: "高橋 美咲",
      email: "takahashi.misaki@example.com",
      university: "上智大学",
      department: "外国語学部",
      year: 2,
      location: "東京都",
      internshipTitle: "営業アシスタント",
      internshipPeriod: "2024年9月1日 - 2024年11月30日",
      internshipDepartment: "営業部",
      status: "upcoming",
    },
    {
      id: 5,
      name: "山田 健太",
      email: "yamada.kenta@example.com",
      university: "明治大学",
      department: "情報コミュニケーション学部",
      year: 3,
      location: "東京都",
      internshipTitle: "UI/UXデザインインターン",
      internshipPeriod: "2024年6月15日 - 2024年8月15日",
      internshipDepartment: "デザイン部",
      status: "active",
    },
  ]

  const departments = Array.from(new Set(students.map((s) => s.internshipDepartment)))

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.university.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || student.status === statusFilter
      const matchesDepartment = departmentFilter === "all" || student.internshipDepartment === departmentFilter

      return matchesSearch && matchesStatus && matchesDepartment
    })
  }, [searchTerm, statusFilter, departmentFilter, students])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-orange-100 text-orange-800">実習中</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">完了</Badge>
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">予定</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
  }

  return (
    <div className="space-y-6">
      {/* 検索・フィルタ */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="学生名、インターンシップ名、大学名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status-filter">ステータス</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="active">実習中</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
                <SelectItem value="upcoming">予定</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="department-filter">部署</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 学生一覧 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>条件に一致する学生が見つかりません</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        {getStatusBadge(student.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>
                            {student.university} {student.department} {student.year}年
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>
                            {student.internshipTitle} - {student.internshipDepartment}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{student.internshipPeriod}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{student.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => onStudentSelect(student.id)}
                    size="sm"
                    disabled={student.status === "upcoming"}
                  >
                    選択
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredStudents.length > 0 && (
        <div className="text-sm text-gray-500 text-center">{filteredStudents.length}件の学生が見つかりました</div>
      )}
    </div>
  )
}

export { StudentSelectionForm }
