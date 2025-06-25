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
            <p className="text-sm text-gray-600">フィードバック送信・返信時の通知を管理</p>
          </div>
          <Button onClick={handleSaveSettings} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>設定を保存</span>
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>プロフィール</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>通知</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>テンプレート</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>連携設定</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>通知履歴</span>
            </TabsTrigger>
          </TabsList>

          {/* Notification Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>メール通知</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-feedback-sent">フィードバック送信時</Label>
                    <Switch
                      id="email-feedback-sent"
                      checked={emailNotifications.feedbackSent}
                      onCheckedChange={(value) => handleEmailToggle("feedbackSent", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-student-reply">学生からの返信時</Label>
                    <Switch
                      id="email-student-reply"
                      checked={emailNotifications.studentReply}
                      onCheckedChange={(value) => handleEmailToggle("studentReply", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-reminder">期限リマインダー</Label>
                    <Switch
                      id="email-reminder"
                      checked={emailNotifications.reminder}
                      onCheckedChange={(value) => handleEmailToggle("reminder", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-weekly">週次サマリー</Label>
                    <Switch
                      id="email-weekly"
                      checked={emailNotifications.weeklySummary}
                      onCheckedChange={(value) => handleEmailToggle("weeklySummary", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-monthly">月次サマリー</Label>
                    <Switch
                      id="email-monthly"
                      checked={emailNotifications.monthlySummary}
                      onCheckedChange={(value) => handleEmailToggle("monthlySummary", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>プッシュ通知</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-feedback-sent">フィードバック送信時</Label>
                    <Switch
                      id="push-feedback-sent"
                      checked={pushNotifications.feedbackSent}
                      onCheckedChange={(value) => handlePushToggle("feedbackSent", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-student-reply">学生からの返信時</Label>
                    <Switch
                      id="push-student-reply"
                      checked={pushNotifications.studentReply}
                      onCheckedChange={(value) => handlePushToggle("studentReply", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-reminder">期限リマインダー</Label>
                    <Switch
                      id="push-reminder"
                      checked={pushNotifications.reminder}
                      onCheckedChange={(value) => handlePushToggle("reminder", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-weekly">週次サマリー</Label>
                    <Switch
                      id="push-weekly"
                      checked={pushNotifications.weeklySummary}
                      onCheckedChange={(value) => handlePushToggle("weeklySummary", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-monthly">月次サマリー</Label>
                    <Switch
                      id="push-monthly"
                      checked={pushNotifications.monthlySummary}
                      onCheckedChange={(value) => handlePushToggle("monthlySummary", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Slack Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Slack className="h-5 w-5" />
                    <span>Slack通知</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-feedback-sent">フィードバック送信時</Label>
                    <Switch
                      id="slack-feedback-sent"
                      checked={slackNotifications.feedbackSent}
                      onCheckedChange={(value) => handleSlackToggle("feedbackSent", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-student-reply">学生からの返信時</Label>
                    <Switch
                      id="slack-student-reply"
                      checked={slackNotifications.studentReply}
                      onCheckedChange={(value) => handleSlackToggle("studentReply", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-reminder">期限リマインダー</Label>
                    <Switch
                      id="slack-reminder"
                      checked={slackNotifications.reminder}
                      onCheckedChange={(value) => handleSlackToggle("reminder", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-weekly">週次サマリー</Label>
                    <Switch
                      id="slack-weekly"
                      checked={slackNotifications.weeklySummary}
                      onCheckedChange={(value) => handleSlackToggle("weeklySummary", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="slack-monthly">月次サマリー</Label>
                    <Switch
                      id="slack-monthly"
                      checked={slackNotifications.monthlySummary}
                      onCheckedChange={(value) => handleSlackToggle("monthlySummary", value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* LINE Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>LINE通知</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-feedback-sent">フィードバック送信時</Label>
                    <Switch
                      id="line-feedback-sent"
                      checked={lineNotifications.feedbackSent}
                      onCheckedChange={(value) => handleLineToggle("feedbackSent", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-student-reply">学生からの返信時</Label>
                    <Switch
                      id="line-student-reply"
                      checked={lineNotifications.studentReply}
                      onCheckedChange={(value) => handleLineToggle("studentReply", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-reminder">期限リマインダー</Label>
                    <Switch
                      id="line-reminder"
                      checked={lineNotifications.reminder}
                      onCheckedChange={(value) => handleLineToggle("reminder", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-weekly">週次サマリー</Label>
                    <Switch
                      id="line-weekly"
                      checked={lineNotifications.weeklySummary}
                      onCheckedChange={(value) => handleLineToggle("weeklySummary", value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="line-monthly">月次サマリー</Label>
                    <Switch
                      id="line-monthly"
                      checked={lineNotifications.monthlySummary}
                      onCheckedChange={(value) => handleLineToggle("monthlySummary", value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>通知タイミング設定</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="reminder-days">リマインダー（日前）</Label>
                  <Select
                    value={notificationSettings.reminderDays}
                    onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, reminderDays: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1日前</SelectItem>
                      <SelectItem value="2">2日前</SelectItem>
                      <SelectItem value="3">3日前</SelectItem>
                      <SelectItem value="5">5日前</SelectItem>
                      <SelectItem value="7">7日前</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="summary-day">サマリー送信日</Label>
                  <Select
                    value={notificationSettings.summaryDay}
                    onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, summaryDay: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">月曜日</SelectItem>
                      <SelectItem value="tuesday">火曜日</SelectItem>
                      <SelectItem value="wednesday">水曜日</SelectItem>
                      <SelectItem value="thursday">木曜日</SelectItem>
                      <SelectItem value="friday">金曜日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="summary-time">サマリー送信時刻</Label>
                  <Input
                    id="summary-time"
                    type="time"
                    value={notificationSettings.summaryTime}
                    onChange={(e) => setNotificationSettings((prev) => ({ ...prev, summaryTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">タイムゾーン</Label>
                  <Select
                    value={notificationSettings.timezone}
                    onValueChange={(value) => setNotificationSettings((prev) => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>フィードバック送信時</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={emailTemplates.feedbackSent}
                    onChange={(e) => handleTemplateChange("feedbackSent", e.target.value)}
                    placeholder="フィードバック送信時のメールテンプレート"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    使用可能な変数: {"{studentName}"}, {"{rating}"}, {"{companyName}"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>学生からの返信時</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={emailTemplates.studentReply}
                    onChange={(e) => handleTemplateChange("studentReply", e.target.value)}
                    placeholder="学生返信時のメールテンプレート"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    使用可能な変数: {"{studentName}"}, {"{replyContent}"}, {"{feedbackTitle}"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>期限リマインダー</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={emailTemplates.reminder}
                    onChange={(e) => handleTemplateChange("reminder", e.target.value)}
                    placeholder="期限リマインダーのメールテンプレート"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    使用可能な変数: {"{days}"}, {"{studentName}"}, {"{dueDate}"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>週次サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={emailTemplates.weeklySummary}
                    onChange={(e) => handleTemplateChange("weeklySummary", e.target.value)}
                    placeholder="週次サマリーのメールテンプレート"
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    使用可能な変数: {"{weekStart}"}, {"{weekEnd}"}, {"{totalFeedbacks}"}, {"{avgRating}"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Settings */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Slack className="h-5 w-5" />
                    <span>Slack連携</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      type="url"
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleTestNotification("slack")}
                      disabled={isTestLoading}
                      className="flex-1"
                    >
                      {isTestLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      テスト送信
                    </Button>
                    {testResult && (
                      <Badge variant={testResult === "success" ? "default" : "destructive"}>
                        {testResult === "success" ? "成功" : "失敗"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>LINE連携</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="line-token">アクセストークン</Label>
                    <Input
                      id="line-token"
                      type="password"
                      value={lineToken}
                      onChange={(e) => setLineToken(e.target.value)}
                      placeholder="LINE Notify アクセストークン"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleTestNotification("line")}
                      disabled={isTestLoading}
                      className="flex-1"
                    >
                      {isTestLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      テスト送信
                    </Button>
                    {testResult && (
                      <Badge variant={testResult === "success" ? "default" : "destructive"}>
                        {testResult === "success" ? "成功" : "失敗"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>メール設定</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-from">送信者メールアドレス</Label>
                    <Input
                      id="email-from"
                      type="email"
                      defaultValue="noreply@company.com"
                      placeholder="送信者のメールアドレス"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-name">送信者名</Label>
                    <Input id="email-name" defaultValue="キャリプラ通知システム" placeholder="送信者名" />
                  </div>
                  <Button variant="outline" onClick={() => handleTestNotification("email")} className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    テストメール送信
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>プッシュ通知設定</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="push-key">Firebase Server Key</Label>
                    <Input id="push-key" type="password" placeholder="Firebase Cloud Messaging サーバーキー" />
                  </div>
                  <div>
                    <Label htmlFor="push-sender">Sender ID</Label>
                    <Input id="push-sender" placeholder="Firebase Sender ID" />
                  </div>
                  <Button variant="outline" onClick={() => handleTestNotification("push")} className="w-full">
                    <TestTube className="h-4 w-4 mr-2" />
                    テストプッシュ送信
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>通知履歴</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notificationHistory.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div>{getTypeIcon(notification.resource)}</div>
                        <div>
                          <p className="font-semibold">{notification.resource}</p>
                          <p className="text-sm text-gray-600">{notification.resource_id}</p>
                          {notification.payload && (
                            <p className="text-xs text-gray-500">{JSON.stringify(notification.payload)}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {new Date(notification.created_at).toLocaleString("ja-JP")}
                        </p>
                        <Badge variant={notification.is_read ? "secondary" : "destructive"}>
                          {notification.is_read ? "既読" : "未読"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>プロフィール編集</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">会社名</Label>
                  <Input id="company-name" type="text" placeholder="会社名を入力" />
                </div>
                <div>
                  <Label htmlFor="company-logo">ロゴURL</Label>
                  <Input id="company-logo" type="text" placeholder="ロゴのURLを入力" />
                </div>
                <div>
                  <Label htmlFor="company-location">所在地</Label>
                  <Input id="company-location" type="text" placeholder="所在地を入力" />
                </div>                
                <div>
                  <Label htmlFor="company-description">会社説明</Label>
                  <Textarea
                    id="company-description"
                    placeholder="会社説明を入力"
                    className="min-h-[100px]"
                  />
                </div>
                <Button onClick={() => { /* TODO: save profile */ }} className="mt-4">
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
