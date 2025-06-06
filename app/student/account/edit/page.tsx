"use client"

import { useState, useEffect } from "react"
import { type Database } from "@/lib/supabase/types" 
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Row 型（読み取り用）
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export default function AccountEditPage() {
  const router = useRouter()
  type ProfileInsert =
   Database["public"]["Tables"]["profiles"]["Insert"]

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    university: "",
    faculty: "",
    year: "",
    location: "",
    bio: "",
    
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, email, phone, university, faculty, year, location, bio"
        )
        .eq("user_id", user.id)
        .single<ProfileRow>()

      if (error) {
        console.error("プロフィール取得エラー", error)
        return
      }
      if (!profile) return

      setFormData({
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        university: profile.university ?? "",
        faculty: profile.faculty ?? "",
        year: profile.year ?? "",
        location: profile.location ?? "",
        bio: profile.bio ?? "",
      })
    }

    fetchProfile()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (
    name: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    // 現在のユーザーを取得
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      alert("ログインしてください")
      return
    }

    // -------------- auth.users 側のメールアドレスも更新 --------------
    if (formData.email && formData.email !== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: formData.email,
      })
      if (emailError) {
        console.error("メールアドレス更新エラー", emailError)
        alert("メールアドレスの更新に失敗しました")
        return
      }
    }

    // profiles テーブルの Insert 型を利用して型エラーを防ぐ
    const updates: ProfileInsert = {
      user_id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email, // プロフィール側にも保持
      phone: formData.phone,
      university: formData.university,
      faculty: formData.faculty,
      year: formData.year,
      location: formData.location,
      bio: formData.bio
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(updates as ProfileInsert, {
        onConflict: "user_id"
      })

    if (upsertError) {
      console.error("プロフィール更新エラー", upsertError)
      alert("更新に失敗しました")
      return
    }

    alert("アカウント情報を更新しました")
    router.push("/student/profile")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/profile">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">アカウント編集</span>
          </div>
          <Button onClick={handleSubmit} size="sm">
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        <form onSubmit={handleSubmit}>
          {/* Profile Photo */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">プロフィール写真</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">写真</span>
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 bg-white border-2 border-gray-200"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>プロフィール写真を変更</p>
                  <p className="text-xs mt-1">JPG、PNG、GIF形式（最大5MB）</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">個人情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">姓</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">名</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">居住地</Label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="居住地を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="東京都">東京都</SelectItem>
                    <SelectItem value="神奈川県">神奈川県</SelectItem>
                    <SelectItem value="千葉県">千葉県</SelectItem>
                    <SelectItem value="埼玉県">埼玉県</SelectItem>
                    <SelectItem value="大阪府">大阪府</SelectItem>
                    <SelectItem value="京都府">京都府</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">学歴情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">大学名</Label>
                <Input id="university" name="university" value={formData.university} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">学部・学科</Label>
                <Input id="faculty" name="faculty" value={formData.faculty} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">学年</Label>
                <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="学年を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1年生</SelectItem>
                    <SelectItem value="2">2年生</SelectItem>
                    <SelectItem value="3">3年生</SelectItem>
                    <SelectItem value="4">4年生</SelectItem>
                    <SelectItem value="院1">修士1年</SelectItem>
                    <SelectItem value="院2">修士2年</SelectItem>
                    <SelectItem value="博士">博士課程</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">自己紹介</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="自己紹介を入力してください"
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 text-right">{formData.bio.length}/300文字</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button (Mobile) */}
          <div className="md:hidden">
            <Button type="submit" className="w-full">
              変更を保存
            </Button>
          </div>
        </form>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-1 h-16">
          <Button onClick={handleSubmit} className="m-3 h-10">
            変更を保存
          </Button>
        </div>
      </nav>
    </div>
  )
}
