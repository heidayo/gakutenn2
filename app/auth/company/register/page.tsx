"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  MapPin,
  Users,
  Shield,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Database } from "@/lib/supabase/types"

export default function CompanyRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // ステップ1: 担当者情報
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",

    // ステップ2: 法人情報
    companyName: "",
    industry: "",
    website: "",
    description: "",

    // ステップ3: 住所情報
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",

    // ステップ4: 権限・同意
    role: "",
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = "メールアドレスは必須です"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "有効なメールアドレスを入力してください"

    if (!formData.password) newErrors.password = "パスワードは必須です"
    else if (formData.password.length < 8) newErrors.password = "パスワードは8文字以上で入力してください"
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "パスワードは大文字・小文字・数字を含む必要があります"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません"
    }

    if (!formData.firstName) newErrors.firstName = "名前は必須です"
    if (!formData.lastName) newErrors.lastName = "姓は必須です"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName) newErrors.companyName = "会社名は必須です"
    if (!formData.industry) newErrors.industry = "業界は必須です"
    if (!formData.website) newErrors.website = "ウェブサイトは必須です"
    else if (!/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "有効なURLを入力してください（http://またはhttps://）"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.postalCode) newErrors.postalCode = "郵便番号は必須です"
    else if (!/^\d{3}-\d{4}$/.test(formData.postalCode)) {
      newErrors.postalCode = "郵便番号は000-0000の形式で入力してください"
    }
    if (!formData.prefecture) newErrors.prefecture = "都道府県は必須です"
    if (!formData.city) newErrors.city = "市区町村は必須です"
    if (!formData.address) newErrors.address = "番地は必須です"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.role) newErrors.role = "権限ロールは必須です"
    if (!formData.termsAccepted) newErrors.termsAccepted = "利用規約への同意は必須です"
    if (!formData.privacyAccepted) newErrors.privacyAccepted = "プライバシーポリシーへの同意は必須です"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false

    switch (step) {
      case 1:
        isValid = validateStep1()
        break
      case 2:
        isValid = validateStep2()
        break
      case 3:
        isValid = validateStep3()
        break
      case 4:
        isValid = validateStep4()
        break
    }

    if (isValid && step < 4) {
      setStep(step + 1)
    } else if (isValid && step === 4) {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (loading) return
    setLoading(true)
    setErrors({}) // clear previous errors

    try {
      // 1) ユーザー登録
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: formData.role,
          },
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })

      if (authError) {
        setErrors({ submit: authError.message })
        return
      }

      // 2) 企業テーブルへ登録
      if (authData?.user) {
        // Supabase 上の companies テーブルは address だけを持つ想定
        const fullAddress =
          `${formData.postalCode} ${formData.prefecture}${formData.city}${formData.address}${
            formData.building ? " " + formData.building : ""
          }`.trim()

        const insertPayload: Database["public"]["Tables"]["companies"]["Insert"] = {
          name: formData.companyName,
          industry: formData.industry || null,
          website: formData.website || null,
          description: formData.description || null,
          user_id: authData.user.id,
          address: fullAddress || null, // 1本化した住所
          email: formData.email,
          // そのほかスキーマに存在する列のみ指定
        }

        const { error: companyError } = await supabase.from("companies").insert(insertPayload)
        if (companyError) {
          setErrors({ submit: companyError.message })
          return
        }
      }

      // 3) 完了ページへ遷移
      router.push("/auth/company/register/complete")
    } catch (err: any) {
      setErrors({ submit: err.message ?? "登録に失敗しました。もう一度お試しください。" })
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login`)
    // ソーシャルログイン処理
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ]

  const industries = [
    "IT・ソフトウェア",
    "Webサービス・アプリ",
    "ゲーム・エンタメ",
    "金融・保険",
    "商社・流通",
    "製造業",
    "建設・不動産",
    "コンサルティング",
    "広告・マーケティング",
    "メディア・出版",
    "教育・研修",
    "医療・ヘルスケア",
    "人材・派遣",
    "その他",
  ]

  const employeeCounts = ["1-10名", "11-50名", "51-100名", "101-300名", "301-500名", "501-1000名", "1001名以上"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            トップページに戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">企業登録</h1>
          <p className="text-gray-600">優秀な学生との出会いを始めましょう</p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>担当者情報</span>
            <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>法人情報</span>
            <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>住所情報</span>
            <span className={step >= 4 ? "text-blue-600 font-medium" : ""}>権限・同意</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-2" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && <Users className="h-5 w-5 mr-2 text-blue-600" />}
              {step === 2 && <Building2 className="h-5 w-5 mr-2 text-blue-600" />}
              {step === 3 && <MapPin className="h-5 w-5 mr-2 text-blue-600" />}
              {step === 4 && <Shield className="h-5 w-5 mr-2 text-blue-600" />}

              {step === 1 && "ステップ1: 担当者情報"}
              {step === 2 && "ステップ2: 法人情報"}
              {step === 3 && "ステップ3: 住所情報"}
              {step === 4 && "ステップ4: 権限設定・同意事項"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "登録担当者の情報を入力してください"}
              {step === 2 && "法人確認のため、正確な情報を入力してください"}
              {step === 3 && "法人の登記住所を入力してください"}
              {step === 4 && "権限ロールを選択し、利用規約に同意してください"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ステップ1: 担当者情報 */}
            {step === 1 && (
              <>
                {/* ソーシャルログイン */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full h-12" onClick={() => handleSocialLogin("google")}>
                    <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Googleアカウントで登録
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">または</span>
                  </div>
                </div>

                {/* メール登録フォーム */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastName">姓 *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="firstName">名 *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>


                <div>
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="例: 03-1234-5678"
                  />
                </div>

                <div>
                  <Label htmlFor="password">パスワード *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  <p className="text-sm text-gray-500 mt-1">8文字以上、大文字・小文字・数字を含む</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">パスワード確認 *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {/* ステップ2: 法人情報 */}
            {step === 2 && (
              <>

                <div>
                  <Label htmlFor="companyName">会社名 *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    placeholder="例: 株式会社キャリプラ"
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <Label htmlFor="industry">業界 *</Label>
                  <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                    <SelectTrigger className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="業界を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
                </div>

                <div>
                  <Label htmlFor="website">ウェブサイト *</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="例: https://www.example.com"
                    className={errors.website ? "border-red-500" : ""}
                  />
                  {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                </div>

                <div>
                  <Label htmlFor="description">事業内容</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="会社の事業内容を簡潔に説明してください"
                    rows={4}
                  />
                </div>
              </>
            )}

            {/* ステップ3: 住所情報 */}
            {step === 3 && (
              <>

                <div>
                  <Label htmlFor="postalCode">郵便番号 *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData("postalCode", e.target.value)}
                    placeholder="例: 123-4567"
                    className={errors.postalCode ? "border-red-500" : ""}
                  />
                  {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                </div>

                <div>
                  <Label htmlFor="prefecture">都道府県 *</Label>
                  <Select value={formData.prefecture} onValueChange={(value) => updateFormData("prefecture", value)}>
                    <SelectTrigger className={errors.prefecture ? "border-red-500" : ""}>
                      <SelectValue placeholder="都道府県を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {prefectures.map((prefecture) => (
                        <SelectItem key={prefecture} value={prefecture}>
                          {prefecture}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.prefecture && <p className="text-red-500 text-sm mt-1">{errors.prefecture}</p>}
                </div>

                <div>
                  <Label htmlFor="city">市区町村 *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    placeholder="例: 渋谷区"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="address">番地 *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="例: 道玄坂1-2-3"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="building">建物名・部屋番号</Label>
                  <Input
                    id="building"
                    value={formData.building}
                    onChange={(e) => updateFormData("building", e.target.value)}
                    placeholder="例: 渋谷ビル5F"
                  />
                </div>
              </>
            )}

            {/* ステップ4: 権限・同意 */}
            {step === 4 && (
              <>
                <div>
                  <Label htmlFor="role">権限ロール *</Label>
                  <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)}>
                    <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="権限ロールを選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main_admin">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-blue-600" />
                          <div>
                            <div className="font-medium">メイン管理者</div>
                            <div className="text-sm text-gray-500">全ての機能にアクセス可能</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="co_editor">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-green-600" />
                          <div>
                            <div className="font-medium">共同編集者</div>
                            <div className="text-sm text-gray-500">求人作成・応募者管理が可能</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => updateFormData("termsAccepted", checked as boolean)}
                      className={errors.termsAccepted ? "border-red-500" : ""}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="termsAccepted" className="text-sm font-normal">
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          利用規約
                        </Link>
                        に同意します *
                      </Label>
                    </div>
                  </div>
                  {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacyAccepted"
                      checked={formData.privacyAccepted}
                      onCheckedChange={(checked) => updateFormData("privacyAccepted", checked as boolean)}
                      className={errors.privacyAccepted ? "border-red-500" : ""}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="privacyAccepted" className="text-sm font-normal">
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          プライバシーポリシー
                        </Link>
                        に同意します *
                      </Label>
                    </div>
                  </div>
                  {errors.privacyAccepted && <p className="text-red-500 text-sm">{errors.privacyAccepted}</p>}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingAccepted"
                      checked={formData.marketingAccepted}
                      onCheckedChange={(checked) => updateFormData("marketingAccepted", checked as boolean)}
                    />
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="marketingAccepted" className="text-sm font-normal">
                        採用に関する情報やサービスのお知らせを受け取る
                      </Label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* サブミットエラー表示 */}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
            {/* ナビゲーションボタン */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>

              <Button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  "登録中..."
                ) : step === 4 ? (
                  "登録申請"
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
          <p className="text-gray-600">
            すでにアカウントをお持ちですか？{" "}
            <Link href="/auth/company/login" className="text-blue-600 hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
