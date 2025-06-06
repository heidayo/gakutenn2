"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Eye, EyeOff, Smartphone, Globe, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function StudentRegisterPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    university: "",
    grade: "",
    major: "",
    phone: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "メールアドレスを入力してください"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください"
    }

    if (!formData.password) {
      newErrors.password = "パスワードを入力してください"
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "パスワードは大文字・小文字・数字を含む必要があります"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName) newErrors.firstName = "名前を入力してください"
    if (!formData.lastName) newErrors.lastName = "姓を入力してください"
    if (!formData.university) newErrors.university = "大学名を入力してください"
    if (!formData.grade) newErrors.grade = "学年を選択してください"
    if (!formData.major) newErrors.major = "専攻を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.agreeTerms) newErrors.agreeTerms = "利用規約への同意が必要です"
    if (!formData.agreePrivacy) newErrors.agreePrivacy = "プライバシーポリシーへの同意が必要です"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false

    if (step === 1) isValid = validateStep1()
    else if (step === 2) isValid = validateStep2()
    else if (step === 3) isValid = validateStep3()

    if (isValid && step < 3) {
      setStep(step + 1)
    } else if (isValid && step === 3) {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (isLoading) return
    setIsLoading(true)
    setErrors({}) // 送信前にエラーをリセット

    try {
      const { email, password } = formData

      // 1) Supabase でユーザー登録
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            university: formData.university,
            grade: formData.grade,
            major: formData.major,
            phone: formData.phone,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (error) {
        setErrors({ submit: error.message })
        return
      }

      // 2) プロフィールテーブルに基本情報を保存 / 更新
      if (data?.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              user_id: data.user.id,                       // RLS で本人のみ更新可
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.lastName} ${formData.firstName}`,
              university: formData.university,
              faculty: formData.major,                     // 専攻を faculty に一旦格納
              phone: formData.phone,
            },
            { onConflict: "user_id" }                     // 既存レコードがあれば更新
          )

        if (profileError) {
          setErrors({ submit: profileError.message })
          return
        }
      }

      // 3) 完了ページへリダイレクト
      router.push("/auth/student/register/complete")
    } catch (err: any) {
      setErrors({ submit: err.message ?? "登録に失敗しました。もう一度お試しください。" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true)
    // ソーシャルログイン処理
    console.log(`${provider}で登録`)
  }

  const progressValue = (step / 3) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            トップページに戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">学生アカウント作成</h1>
          <p className="text-gray-600 mt-2">キャリプラで理想のキャリアを見つけよう</p>
        </div>

        {/* プログレスバー */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>アカウント情報</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>基本情報</span>
            <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>利用規約</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {step === 1 && "ステップ 1: アカウント情報"}
              {step === 2 && "ステップ 2: 基本情報"}
              {step === 3 && "ステップ 3: 利用規約"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "ログインに使用するメールアドレスとパスワードを設定してください"}
              {step === 2 && "あなたの基本情報を入力してください"}
              {step === 3 && "利用規約とプライバシーポリシーをご確認ください"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ステップ1: アカウント情報 */}
            {step === 1 && (
              <>
                {/* ソーシャルログインボタン */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("LINE")}
                    disabled={isLoading}
                  >
                    <Smartphone className="h-4 w-4 mr-2 text-green-500" />
                    LINEで登録
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                  >
                    <Globe className="h-4 w-4 mr-2 text-blue-500" />
                    Googleで登録
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">または</span>
                  </div>
                </div>

                {/* メール登録フォーム */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password">パスワード</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    <p className="text-xs text-gray-500 mt-1">8文字以上、大文字・小文字・数字を含む</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ステップ2: 基本情報 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastName">姓</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="firstName">名</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="university">大学名</Label>
                  <Input
                    id="university"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className={errors.university ? "border-red-500" : ""}
                    placeholder="例: 東京大学"
                  />
                  {errors.university && <p className="text-sm text-red-500 mt-1">{errors.university}</p>}
                </div>

                <div>
                  <Label htmlFor="grade">学年</Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger className={errors.grade ? "border-red-500" : ""}>
                      <SelectValue placeholder="学年を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1年生</SelectItem>
                      <SelectItem value="2">2年生</SelectItem>
                      <SelectItem value="3">3年生</SelectItem>
                      <SelectItem value="4">4年生</SelectItem>
                      <SelectItem value="master1">修士1年</SelectItem>
                      <SelectItem value="master2">修士2年</SelectItem>
                      <SelectItem value="doctor">博士課程</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.grade && <p className="text-sm text-red-500 mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <Label htmlFor="major">専攻</Label>
                  <Input
                    id="major"
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className={errors.major ? "border-red-500" : ""}
                    placeholder="例: 情報工学科"
                  />
                  {errors.major && <p className="text-sm text-red-500 mt-1">{errors.major}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">電話番号（任意）</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="例: 090-1234-5678"
                  />
                </div>
              </div>
            )}

            {/* ステップ3: 利用規約 */}
            {step === 3 && (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>サービスをご利用いただくために、以下の規約への同意が必要です。</AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                      className={errors.agreeTerms ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agreeTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          利用規約
                        </Link>
                        に同意する（必須）
                      </Label>
                    </div>
                  </div>
                  {errors.agreeTerms && <p className="text-sm text-red-500">{errors.agreeTerms}</p>}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: checked as boolean })}
                      className={errors.agreePrivacy ? "border-red-500" : ""}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agreePrivacy"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          プライバシーポリシー
                        </Link>
                        に同意する（必須）
                      </Label>
                    </div>
                  </div>
                  {errors.agreePrivacy && <p className="text-sm text-red-500">{errors.agreePrivacy}</p>}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: checked as boolean })}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agreeMarketing"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        メールマガジンやお知らせの受信に同意する（任意）
                      </Label>
                      <p className="text-xs text-gray-500">新着求人情報やキャリア情報をお送りします</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1 || isLoading}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  "処理中..."
                ) : step === 3 ? (
                  <>
                    アカウント作成
                    <Check className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    次へ
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ログインリンク */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <Link href="/auth/student/login" className="text-blue-600 hover:underline">
              ログインはこちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
