"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CalendarIcon,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

// サンプルデータ
const sampleContent = [
  {
    id: 1,
    title: "2024年春季インターンシップ募集開始",
    type: "news",
    category: "お知らせ",
    tags: ["インターンシップ", "募集"],
    status: "published",
    publishDate: new Date("2024-01-15"),
    updateDate: new Date("2024-01-15"),
    autoUnpublishDate: new Date("2024-04-15"),
    author: "管理者",
    views: 1250,
  },
  {
    id: 2,
    title: "面接で聞かれる質問TOP10",
    type: "blog",
    category: "就活コラム",
    tags: ["面接", "コツ", "準備"],
    status: "published",
    publishDate: new Date("2024-01-10"),
    updateDate: new Date("2024-01-12"),
    autoUnpublishDate: null,
    author: "キャリアアドバイザー",
    views: 3420,
  },
  {
    id: 3,
    title: "エントリーシートとは？",
    type: "blog",
    category: "用語解説",
    tags: ["ES", "基礎知識"],
    status: "draft",
    publishDate: null,
    updateDate: new Date("2024-01-14"),
    autoUnpublishDate: null,
    author: "コンテンツ編集者",
    views: 0,
  },
  {
    id: 4,
    title: "パスワードを忘れた場合の対処法",
    type: "faq",
    category: "アカウント",
    tags: ["パスワード", "ログイン"],
    status: "published",
    publishDate: new Date("2023-12-01"),
    updateDate: new Date("2023-12-01"),
    autoUnpublishDate: new Date("2024-06-01"),
    author: "サポート",
    views: 890,
  },
]

const contentTypes = [
  { value: "all", label: "すべて" },
  { value: "news", label: "ニュース" },
  { value: "blog", label: "ブログ" },
  { value: "faq", label: "FAQ" },
]

const categories = ["お知らせ", "就活コラム", "用語解説", "アカウント", "システム", "その他"]

const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-blue-100 text-blue-800",
  expired: "bg-red-100 text-red-800",
}

const statusIcons = {
  published: CheckCircle,
  draft: Clock,
  scheduled: CalendarIcon,
  expired: XCircle,
}

export default function ContentManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [newContent, setNewContent] = useState({
    title: "",
    type: "news",
    category: "",
    content: "",
    tags: "",
    publishDate: null as Date | null,
    autoUnpublishDate: null as Date | null,
    isScheduled: false,
    hasAutoUnpublish: false,
  })

  const [editingContent, setEditingContent] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingContentId, setDeletingContentId] = useState<number | null>(null)
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [publishingContent, setPublishingContent] = useState<any>(null)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  const filteredContent = sampleContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesType && matchesCategory && matchesStatus
  })

  const getStatusInfo = (item: any) => {
    const now = new Date()
    if (item.status === "draft") return { status: "draft", label: "下書き" }
    if (item.publishDate && item.publishDate > now) return { status: "scheduled", label: "予約投稿" }
    if (item.autoUnpublishDate && item.autoUnpublishDate < now) return { status: "expired", label: "期限切れ" }
    return { status: "published", label: "公開中" }
  }

  const handleEdit = (content: any) => {
    setEditingContent(content)
    setNewContent({
      title: content.title,
      type: content.type,
      category: content.category,
      content: "", // 実際の本文データ
      tags: content.tags.join(", "),
      publishDate: content.publishDate,
      autoUnpublishDate: content.autoUnpublishDate,
      isScheduled: !!content.publishDate,
      hasAutoUnpublish: !!content.autoUnpublishDate,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (contentId: number) => {
    setDeletingContentId(contentId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("削除:", deletingContentId)
    // 実際の削除処理
    setIsDeleteDialogOpen(false)
    setDeletingContentId(null)
  }

  const handlePublishSettings = (content: any) => {
    setPublishingContent(content)
    setIsPublishDialogOpen(true)
  }

  const handleStatusChange = (newStatus: string) => {
    console.log("ステータス変更:", publishingContent.id, newStatus)
    // 実際のステータス変更処理
    setIsPublishDialogOpen(false)
    setPublishingContent(null)
  }

  const handleCreateContent = () => {
    // ここで実際のコンテンツ作成処理を行う
    console.log("新しいコンテンツ:", newContent)
    setIsCreateDialogOpen(false)
    setNewContent({
      title: "",
      type: "news",
      category: "",
      content: "",
      tags: "",
      publishDate: null,
      autoUnpublishDate: null,
      isScheduled: false,
      hasAutoUnpublish: false,
    })
  }

  const handleContentClick = (content: any) => {
    setSelectedContent(content)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">コンテンツ管理</h1>
            <p className="text-sm text-gray-600">お知らせ・FAQ・ブログ投稿の管理</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>新しいコンテンツを作成</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">タイトル</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    placeholder="コンテンツのタイトルを入力"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">種類</Label>
                    <Select
                      value={newContent.type}
                      onValueChange={(value) => setNewContent({ ...newContent, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">ニュース</SelectItem>
                        <SelectItem value="blog">ブログ</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">カテゴリ</Label>
                    <Select
                      value={newContent.category}
                      onValueChange={(value) => setNewContent({ ...newContent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">本文</Label>
                  <Textarea
                    id="content"
                    value={newContent.content}
                    onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                    placeholder="コンテンツの本文を入力"
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">タグ（カンマ区切り）</Label>
                  <Input
                    id="tags"
                    value={newContent.tags}
                    onChange={(e) => setNewContent({ ...newContent, tags: e.target.value })}
                    placeholder="タグ1, タグ2, タグ3"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scheduled"
                      checked={newContent.isScheduled}
                      onCheckedChange={(checked) => setNewContent({ ...newContent, isScheduled: checked })}
                    />
                    <Label htmlFor="scheduled">予約投稿</Label>
                  </div>

                  {newContent.isScheduled && (
                    <div>
                      <Label>公開日時</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newContent.publishDate
                              ? format(newContent.publishDate, "PPP", { locale: ja })
                              : "日付を選択"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newContent.publishDate || undefined}
                            onSelect={(date) => setNewContent({ ...newContent, publishDate: date || null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="autoUnpublish"
                      checked={newContent.hasAutoUnpublish}
                      onCheckedChange={(checked) => setNewContent({ ...newContent, hasAutoUnpublish: checked })}
                    />
                    <Label htmlFor="autoUnpublish">自動非公開設定</Label>
                  </div>

                  {newContent.hasAutoUnpublish && (
                    <div>
                      <Label>非公開日時</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newContent.autoUnpublishDate
                              ? format(newContent.autoUnpublishDate, "PPP", { locale: ja })
                              : "日付を選択"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={newContent.autoUnpublishDate || undefined}
                            onSelect={(date) => setNewContent({ ...newContent, autoUnpublishDate: date || null })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleCreateContent}>作成</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 編集ダイアログ */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>コンテンツを編集</DialogTitle>
              </DialogHeader>
              {/* 新規作成と同じフォーム内容 */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  onClick={() => {
                    console.log("更新:", editingContent.id, newContent)
                    setIsEditDialogOpen(false)
                  }}
                >
                  更新
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 削除確認ダイアログ */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>コンテンツを削除</DialogTitle>
              </DialogHeader>
              <p>このコンテンツを削除してもよろしいですか？この操作は取り消せません。</p>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  削除
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 公開設定ダイアログ */}
          <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>公開設定</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p>
                  現在のステータス: <Badge>{publishingContent?.status}</Badge>
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={() => handleStatusChange("published")}>公開する</Button>
                  <Button variant="outline" onClick={() => handleStatusChange("draft")}>
                    下書きに戻す
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusChange("scheduled")}>
                    予約投稿に設定
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* コンテンツ詳細ダイアログ */}
          <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedContent?.title}</DialogTitle>
              </DialogHeader>
              {selectedContent && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>種類</Label>
                      <p className="text-sm text-gray-600">{selectedContent.type}</p>
                    </div>
                    <div>
                      <Label>カテゴリ</Label>
                      <p className="text-sm text-gray-600">{selectedContent.category}</p>
                    </div>
                    <div>
                      <Label>作成者</Label>
                      <p className="text-sm text-gray-600">{selectedContent.author}</p>
                    </div>
                    <div>
                      <Label>閲覧数</Label>
                      <p className="text-sm text-gray-600">{selectedContent.views.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <Label>タグ</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedContent.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>本文プレビュー</Label>
                    <div className="border rounded-lg p-4 bg-gray-50 mt-1">
                      <p className="text-sm">
                        ここにコンテンツの本文が表示されます。実際の実装では、selectedContent.content を表示します。
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => handleEdit(selectedContent)}>
                      編集
                    </Button>
                    <Button onClick={() => setIsDetailDialogOpen(false)}>閉じる</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">総コンテンツ数</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">公開中</p>
                  <p className="text-2xl font-bold text-green-600">18</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">下書き</p>
                  <p className="text-2xl font-bold text-yellow-600">4</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">期限切れ</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* フィルタとコンテンツ一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>コンテンツ一覧</CardTitle>

            {/* 検索・フィルタ */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="タイトルやタグで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="カテゴリ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのカテゴリ</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    <SelectItem value="published">公開中</SelectItem>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="scheduled">予約投稿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {filteredContent.map((item) => {
                const statusInfo = getStatusInfo(item)
                const StatusIcon = statusIcons[statusInfo.status as keyof typeof statusIcons]

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleContentClick(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <Badge className={statusColors[statusInfo.status as keyof typeof statusColors]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>作成者: {item.author}</span>
                          <span>閲覧数: {item.views.toLocaleString()}</span>
                          {item.publishDate && (
                            <span>公開日: {format(item.publishDate, "yyyy/MM/dd", { locale: ja })}</span>
                          )}
                          {item.autoUnpublishDate && (
                            <span className="text-orange-600">
                              自動非公開: {format(item.autoUnpublishDate, "yyyy/MM/dd", { locale: ja })}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePublishSettings(item)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(item)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
