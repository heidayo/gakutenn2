 "use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Mail,
  MessageSquare,
  Slack,
  Clock,
  Settings,
  TestTube,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Smartphone,
  Globe,
  Edit,
  Save,
  RefreshCw,
  User,
} from "lucide-react"

export default function NotificationsPage() {
  // State management
  const [emailNotifications, setEmailNotifications] = useState({
    feedbackSent: true,
    studentReply: true,
    reminder: false,
    weeklySummary: true,
    monthlySummary: false,
  })

  const [pushNotifications, setPushNotifications] = useState({
    feedbackSent: false,
    studentReply: true,
    reminder: true,
    weeklySummary: false,
    monthlySummary: false,
  })

  const [slackNotifications, setSlackNotifications] = useState({
    feedbackSent: true,
    studentReply: false,
    reminder: false,
    weeklySummary: true,
    monthlySummary: true,
  })

  const [lineNotifications, setLineNotifications] = useState({
    feedbackSent: false,
    studentReply: false,
    reminder: false,
    weeklySummary: false,
    monthlySummary: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    reminderDays: "3",
    summaryDay: "monday",
    summaryTime: "09:00",
    timezone: "Asia/Tokyo",
  })

  const [emailTemplates, setEmailTemplates] = useState({
    feedbackSent: "フィードバックを送信しました。学生: {studentName}, 評価: {rating}",
    studentReply: "{studentName}さんからフィードバックへの返信がありました。",
    reminder: "フィードバック送信期限が{days}日後に迫っています。",
    weeklySummary: "今週のフィードバック送信状況をお知らせします。",
  })

  const [slackWebhook, setSlackWebhook] = useState("")
  const [lineToken, setLineToken] = useState("")
  const [companyEmail, setCompanyEmail] = useState("")
  const [companyPhone, setCompanyPhone] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyPostalCode, setCompanyPostalCode] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
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
  const [companyIndustry, setCompanyIndustry] = useState("")
  const [testResult, setTestResult] = useState<string | null>(null)
  const [isTestLoading, setIsTestLoading] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState<any[]>([]);
  const params = useParams();
  const companyId = Array.isArray(params.companyId) ? params.companyId[0] : params.companyId;

  useEffect(() => {
    if (!companyId) {
      console.warn("companyId is undefined, skipping fetchNotifications");
      return;
    }
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("通知履歴取得エラー:", error);
      } else {
        setNotificationHistory(data);
      }
    };
    fetchNotifications();
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return
    const fetchCompany = async () => {
      // Try to fetch from company_profiles first
      const { data, error } = await supabase
        .from("company_profiles")
        .select("name, address, postal_code, email, phone, industry, description")
        .eq("company_id", companyId)
        .single()
      if (error) {
        // If not found in company_profiles, fallback to companies table
        // (Assume error.code is "PGRST116" or similar for not found, but fallback anyway)
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("name, address, email, phone, industry, description")
          .eq("id", companyId)
          .single()
        if (companyError) {
          console.error("会社情報取得エラー(companies):", companyError)
        } else if (companyData) {
          setCompanyName(companyData.name || "")
          // Split postal code and address from address field
          const fullAddress = companyData.address || '';
          const match = fullAddress.match(/^(\d{3}-\d{4})\s*(.*)$/);
          const postal = match ? match[1] : '';
          const addr = match ? match[2] : fullAddress;
          setCompanyPostalCode(postal);
          setCompanyAddress(addr);
          setCompanyEmail(companyData.email || "")
          setCompanyPhone(companyData.phone || "")
          setCompanyIndustry(companyData.industry || "")
          setCompanyDescription(companyData.description || "")
        }
      } else if (data) {
        setCompanyName(data.name)
        setCompanyPostalCode(data.postal_code || "")
        setCompanyAddress(data.address || "")
        setCompanyEmail(data.email || "")
        setCompanyPhone(data.phone || "")
        setCompanyIndustry(data.industry || "")
        setCompanyDescription(data.description || "")
      }
    }
    fetchCompany()
  }, [companyId])
  // Auto-fill address when postal code changes
  useEffect(() => {
    // Remove hyphen and check for 7 digits
    const zip = companyPostalCode.replace(/-/g, "");
    if (/^\d{7}$/.test(zip)) {
      fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.results && json.results.length > 0) {
            const { address1, address2, address3 } = json.results[0];
            setCompanyAddress(`${address1}${address2}${address3}`);
          }
        })
        .catch((err) => {
          console.error("住所自動取得エラー:", err);
        });
    }
  }, [companyPostalCode]);

  const handleSaveProfile = async () => {
    if (!companyId) {
      console.error("companyId is undefined");
      return;
    }
    const payload = {
      company_id: companyId!,
      name: companyName,
      postal_code: companyPostalCode,
      address: companyAddress,
      email: companyEmail,
      phone: companyPhone,
      industry: companyIndustry,
      description: companyDescription,
    }
    const { error } = await supabase.from("company_profiles").upsert(payload, { onConflict: "company_id" })
    if (error) {
      console.error("プロフィール保存エラー:", error)
      alert("プロフィールの保存に失敗しました")
      return;
    }
    // Also update companies table
    const compPayload = {
      name: companyName,
      address: `${companyPostalCode} ${companyAddress}`,
      email: companyEmail,
      phone: companyPhone,
      industry: companyIndustry,
      description: companyDescription,
    };
    const { error: compError } = await supabase.from('companies').update(compPayload).eq('id', companyId);
    if (compError) {
      console.error("企業基本情報保存エラー（companies）:", compError);
      alert("会社の基本情報の保存に失敗しました");
      return;
    }
    alert("プロフィールを保存しました")
  }

  const handleEmailToggle = (key: string, value: boolean) => {
    setEmailNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePushToggle = (key: string, value: boolean) => {
    setPushNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleSlackToggle = (key: string, value: boolean) => {
    setSlackNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleLineToggle = (key: string, value: boolean) => {
    setLineNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handleTemplateChange = (key: string, value: string) => {
    setEmailTemplates((prev) => ({ ...prev, [key]: value }))
  }

  const handleTestNotification = async (type: string) => {
    setIsTestLoading(true)
    setTestResult(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock test results
    const success = Math.random() > 0.3
    setTestResult(success ? "success" : "error")
    setIsTestLoading(false)

    setTimeout(() => setTestResult(null), 5000)
  }

  const handleSaveSettings = () => {
    // Save settings logic
    console.log("Saving notification settings:", {
      emailNotifications,
      pushNotifications,
      slackNotifications,
      lineNotifications,
      notificationSettings,
      emailTemplates,
      slackWebhook,
      lineToken,
    })
    alert("通知設定を保存しました")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "push":
        return <Smartphone className="h-4 w-4" />
      case "slack":
        return <Slack className="h-4 w-4" />
      case "line":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">設定</h1>
            <p className="text-sm text-gray-600">企業プロフィールを管理</p>
          </div>
          <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>設定を保存</span>
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>プロフィール</span>
          </TabsTrigger>
        </TabsList>

        {/* Only the プロフィール編集 tab content remains */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>プロフィール編集</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">会社名</Label>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="会社名を入力"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-postal-code">郵便番号</Label>
                  <Input
                    id="company-postal-code"
                    type="text"
                    placeholder="000-0000"
                    value={companyPostalCode}
                    onChange={(e) => setCompanyPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-address">住所</Label>
                  <Input
                    id="company-address"
                    type="text"
                    placeholder="住所を入力"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-email">メールアドレス</Label>
                  <Input
                    id="company-email"
                    type="email"
                    placeholder="メールアドレスを入力"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-phone">電話番号</Label>
                  <Input
                    id="company-phone"
                    type="tel"
                    placeholder="電話番号を入力"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="company-industry">業種</Label>
                  <Select
                    value={companyIndustry}
                    onValueChange={(value) => setCompanyIndustry(value)}
                  >
                    <SelectTrigger id="company-industry">
                      <SelectValue placeholder="業種を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="company-description">会社説明</Label>
                  <Textarea
                    id="company-description"
                    placeholder="会社説明を入力"
                    className="min-h-[100px]"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="mt-4">
                  保存
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
