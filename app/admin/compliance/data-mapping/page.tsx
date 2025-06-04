"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Database, Search, Plus, Edit, Trash2, Download, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DataMappingPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // データマッピング
  const [dataMappings, setDataMappings] = useState([
    {
      id: 1,
      dataType: "学生個人情報",
      category: "personal_data",
      fields: ["氏名", "メールアドレス", "電話番号", "住所", "生年月日"],
      purpose: "学生登録・認証・連絡",
      legalBasis: "契約履行",
      retention: "卒業後5年",
      location: "日本（AWS Tokyo）",
      thirdParties: ["メール配信サービス"],
      riskLevel: "medium",
      lastUpdated: "2024-06-01",
      dataController: "キャリプラ運営事務局",
      dataProcessor: "AWS Japan",
    },
    {
      id: 2,
      dataType: "企業情報",
      category: "business_data",
      fields: ["企業名", "担当者名", "連絡先", "事業内容", "従業員数"],
      purpose: "企業登録・求人管理・連絡",
      legalBasis: "契約履行",
      retention: "契約終了後3年",
      location: "日本（AWS Tokyo）",
      thirdParties: ["決済代行サービス"],
      riskLevel: "low",
      lastUpdated: "2024-05-30",
      dataController: "キャリプラ運営事務局",
      dataProcessor: "AWS Japan",
    },
    {
      id: 3,
      dataType: "応募・選考データ",
      category: "sensitive_data",
      fields: ["履歴書", "職歴", "志望動機", "面接記録", "評価結果"],
      purpose: "採用選考・マッチング",
      legalBasis: "同意",
      retention: "選考終了後1年",
      location: "日本（AWS Tokyo）",
      thirdParties: ["AI分析サービス"],
      riskLevel: "high",
      lastUpdated: "2024-06-02",
      dataController: "キャリプラ運営事務局",
      dataProcessor: "AWS Japan, AI Analytics Co.",
    },
    {
      id: 4,
      dataType: "アクセスログ",
      category: "technical_data",
      fields: ["IPアドレス", "アクセス時刻", "ページ情報", "デバイス情報"],
      purpose: "セキュリティ監視・サービス改善",
      legalBasis: "正当な利益",
      retention: "6ヶ月",
      location: "日本（AWS Tokyo）",
      thirdParties: ["セキュリティ監視サービス"],
      riskLevel: "low",
      lastUpdated: "2024-06-01",
      dataController: "キャリプラ運営事務局",
      dataProcessor: "AWS Japan",
    },
  ])

  // 新規データマッピング
  const [newMapping, setNewMapping] = useState({
    dataType: "",
    category: "",
    fields: "",
    purpose: "",
    legalBasis: "",
    retention: "",
    location: "",
    thirdParties: "",
    riskLevel: "low",
    dataController: "",
    dataProcessor: "",
  })

  // データマッピング追加
  const handleAddMapping = async () => {
    if (!newMapping.dataType || !newMapping.purpose) {
      toast({
        title: "入力エラー",
        description: "データタイプと処理目的は必須です",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mapping = {
        id: Date.now(),
        ...newMapping,
        fields: newMapping.fields.split(",").map((field) => field.trim()),
        thirdParties: newMapping.thirdParties
          .split(",")
          .map((party) => party.trim())
          .filter(Boolean),
        lastUpdated: new Date().toISOString().split("T")[0],
      }

      setDataMappings((prev) => [mapping, ...prev])
      setNewMapping({
        dataType: "",
        category: "",
        fields: "",
        purpose: "",
        legalBasis: "",
        retention: "",
        location: "",
        thirdParties: "",
        riskLevel: "low",
        dataController: "",
        dataProcessor: "",
      })
      setIsDialogOpen(false)

      toast({
        title: "データマッピングを追加しました",
        description: "新しいデータマッピングが正常に登録されました",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "追加に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // データマッピング削除
  const handleDeleteMapping = async (id: number) => {
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      setDataMappings((prev) => prev.filter((mapping) => mapping.id !== id))

      toast({
        title: "データマッピングを削除しました",
        description: "データマッピングが正常に削除されました",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "削除に失敗しました",
        description: "もう一度お試しください",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // エクスポート
  const exportDataMapping = () => {
    const csvData = dataMappings
      .map((mapping) =>
        [
          mapping.dataType,
          mapping.category,
          mapping.fields.join(";"),
          mapping.purpose,
          mapping.legalBasis,
          mapping.retention,
          mapping.location,
          mapping.thirdParties.join(";"),
          mapping.riskLevel,
          mapping.lastUpdated,
        ].join(","),
      )
      .join("\n")

    const blob = new Blob(
      [
        `データタイプ,カテゴリ,データ項目,処理目的,法的根拠,保存期間,保存場所,第三者提供先,リスクレベル,最終更新日\n${csvData}`,
      ],
      { type: "text/csv" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `data-mapping-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "データマッピングをエクスポートしました",
      description: "CSVファイルがダウンロードされました",
      variant: "default",
    })
  }

  // フィルタリング
  const filteredMappings = dataMappings.filter((mapping) => {
    const matchesSearch =
      mapping.dataType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.purpose.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || mapping.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal_data":
        return "bg-blue-100 text-blue-800"
      case "sensitive_data":
        return "bg-red-100 text-red-800"
      case "business_data":
        return "bg-green-100 text-green-800"
      case "technical_data":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case "personal_data":
        return "個人データ"
      case "sensitive_data":
        return "機微データ"
      case "business_data":
        return "事業データ"
      case "technical_data":
        return "技術データ"
      default:
        return category
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "high":
        return "高"
      case "medium":
        return "中"
      case "low":
        return "低"
      default:
        return risk
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">データマッピング</h1>
            <p className="text-sm text-gray-600">個人データの処理状況を可視化・管理</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportDataMapping}>
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  新規追加
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>新規データマッピング</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataType">データタイプ *</Label>
                      <Input
                        id="dataType"
                        value={newMapping.dataType}
                        onChange={(e) => setNewMapping((prev) => ({ ...prev, dataType: e.target.value }))}
                        placeholder="例: 学生個人情報"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">カテゴリ</Label>
                      <Select
                        value={newMapping.category}
                        onValueChange={(value) => setNewMapping((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="カテゴリを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal_data">個人データ</SelectItem>
                          <SelectItem value="sensitive_data">機微データ</SelectItem>
                          <SelectItem value="business_data">事業データ</SelectItem>
                          <SelectItem value="technical_data">技術データ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fields">データ項目（カンマ区切り）</Label>
                    <Input
                      id="fields"
                      value={newMapping.fields}
                      onChange={(e) => setNewMapping((prev) => ({ ...prev, fields: e.target.value }))}
                      placeholder="例: 氏名, メールアドレス, 電話番号"
                    />
                  </div>

                  <div>
                    <Label htmlFor="purpose">処理目的 *</Label>
                    <Textarea
                      id="purpose"
                      value={newMapping.purpose}
                      onChange={(e) => setNewMapping((prev) => ({ ...prev, purpose: e.target.value }))}
                      placeholder="例: 学生登録・認証・連絡"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="legalBasis">法的根拠</Label>
                      <Select
                        value={newMapping.legalBasis}
                        onValueChange={(value) => setNewMapping((prev) => ({ ...prev, legalBasis: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="法的根拠を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="同意">同意</SelectItem>
                          <SelectItem value="契約履行">契約履行</SelectItem>
                          <SelectItem value="法的義務">法的義務</SelectItem>
                          <SelectItem value="正当な利益">正当な利益</SelectItem>
                          <SelectItem value="公共の利益">公共の利益</SelectItem>
                          <SelectItem value="生命の保護">生命の保護</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="retention">保存期間</Label>
                      <Input
                        id="retention"
                        value={newMapping.retention}
                        onChange={(e) => setNewMapping((prev) => ({ ...prev, retention: e.target.value }))}
                        placeholder="例: 卒業後5年"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">保存場所</Label>
                      <Input
                        id="location"
                        value={newMapping.location}
                        onChange={(e) => setNewMapping((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="例: 日本（AWS Tokyo）"
                      />
                    </div>
                    <div>
                      <Label htmlFor="riskLevel">リスクレベル</Label>
                      <Select
                        value={newMapping.riskLevel}
                        onValueChange={(value) => setNewMapping((prev) => ({ ...prev, riskLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="thirdParties">第三者提供先（カンマ区切り）</Label>
                    <Input
                      id="thirdParties"
                      value={newMapping.thirdParties}
                      onChange={(e) => setNewMapping((prev) => ({ ...prev, thirdParties: e.target.value }))}
                      placeholder="例: メール配信サービス, 決済代行サービス"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataController">データ管理者</Label>
                      <Input
                        id="dataController"
                        value={newMapping.dataController}
                        onChange={(e) => setNewMapping((prev) => ({ ...prev, dataController: e.target.value }))}
                        placeholder="例: キャリプラ運営事務局"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataProcessor">データ処理者</Label>
                      <Input
                        id="dataProcessor"
                        value={newMapping.dataProcessor}
                        onChange={(e) => setNewMapping((prev) => ({ ...prev, dataProcessor: e.target.value }))}
                        placeholder="例: AWS Japan"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={handleAddMapping} disabled={isLoading}>
                      {isLoading ? "追加中..." : "追加"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* 検索・フィルター */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="データタイプや処理目的で検索"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="カテゴリでフィルター" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべてのカテゴリ</SelectItem>
                  <SelectItem value="personal_data">個人データ</SelectItem>
                  <SelectItem value="sensitive_data">機微データ</SelectItem>
                  <SelectItem value="business_data">事業データ</SelectItem>
                  <SelectItem value="technical_data">技術データ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* データマッピング一覧 */}
        <div className="space-y-4">
          {filteredMappings.map((mapping) => (
            <Card key={mapping.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="text-lg font-semibold">{mapping.dataType}</h3>
                      <Badge className={getCategoryColor(mapping.category)}>{getCategoryText(mapping.category)}</Badge>
                      <Badge className={getRiskColor(mapping.riskLevel)}>
                        リスク: {getRiskText(mapping.riskLevel)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">データ項目</h4>
                        <div className="flex flex-wrap gap-1">
                          {mapping.fields.map((field, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">第三者提供先</h4>
                        <div className="flex flex-wrap gap-1">
                          {mapping.thirdParties.length > 0 ? (
                            mapping.thirdParties.map((party, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {party}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">なし</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">処理目的:</span>
                        <p className="text-gray-600 mt-1">{mapping.purpose}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">法的根拠:</span>
                        <p className="text-gray-600 mt-1">{mapping.legalBasis}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">保存期間:</span>
                        <p className="text-gray-600 mt-1">{mapping.retention}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">保存場所:</span>
                        <p className="text-gray-600 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {mapping.location}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">データ管理者:</span>
                        <p className="text-gray-600 mt-1">{mapping.dataController}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">最終更新:</span>
                        <p className="text-gray-600 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {mapping.lastUpdated}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteMapping(mapping.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      削除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredMappings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">データマッピングが見つかりません</h3>
                <p className="text-gray-500">検索条件を変更するか、新しいデータマッピングを追加してください</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
