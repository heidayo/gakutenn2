"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Download, FileSpreadsheet, Filter, CalendarIcon, RefreshCcw, FileDown } from "lucide-react"

export default function ExportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">データエクスポート</h1>
            <p className="text-sm text-gray-600">応募者データをCSV形式でエクスポートできます</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="export">エクスポート</TabsTrigger>
            <TabsTrigger value="history">出力履歴</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          {/* エクスポートタブ */}
          <TabsContent value="export">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左側：エクスポート設定 */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>エクスポート設定</CardTitle>
                    <CardDescription>出力するデータの範囲と条件を設定してください</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* データ範囲 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">データ範囲</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="data-type">データタイプ</Label>
                          <Select defaultValue="applicants">
                            <SelectTrigger id="data-type">
                              <SelectValue placeholder="データタイプを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="applicants">応募者データ</SelectItem>
                              <SelectItem value="interviews">面談データ</SelectItem>
                              <SelectItem value="feedback">フィードバックデータ</SelectItem>
                              <SelectItem value="messages">メッセージデータ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="job-filter">求人</Label>
                          <Select defaultValue="all">
                            <SelectTrigger id="job-filter">
                              <SelectValue placeholder="求人を選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">すべての求人</SelectItem>
                              <SelectItem value="job1">Webマーケティングアシスタント</SelectItem>
                              <SelectItem value="job2">SNS運用サポート</SelectItem>
                              <SelectItem value="job3">データ分析補助</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>期間</Label>
                          <div className="flex items-center space-x-2">
                            <DatePickerWithRange />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status-filter">ステータス</Label>
                          <Select defaultValue="all">
                            <SelectTrigger id="status-filter">
                              <SelectValue placeholder="ステータスを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">すべてのステータス</SelectItem>
                              <SelectItem value="pending">選考中</SelectItem>
                              <SelectItem value="interview">面談予定</SelectItem>
                              <SelectItem value="hired">採用</SelectItem>
                              <SelectItem value="rejected">不採用</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* 出力項目 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">出力項目</h3>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            すべて選択
                          </Button>
                          <Button variant="outline" size="sm">
                            選択解除
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-dashed">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm font-medium">基本情報</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="name" defaultChecked />
                              <Label htmlFor="name" className="text-sm">
                                氏名
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="university" defaultChecked />
                              <Label htmlFor="university" className="text-sm">
                                大学・学部
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="grade" defaultChecked />
                              <Label htmlFor="grade" className="text-sm">
                                学年
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="email" defaultChecked />
                              <Label htmlFor="email" className="text-sm">
                                メールアドレス
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="phone" />
                              <Label htmlFor="phone" className="text-sm">
                                電話番号
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="address" />
                              <Label htmlFor="address" className="text-sm">
                                住所
                              </Label>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm font-medium">応募情報</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="job-title" defaultChecked />
                              <Label htmlFor="job-title" className="text-sm">
                                応募求人
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="apply-date" defaultChecked />
                              <Label htmlFor="apply-date" className="text-sm">
                                応募日
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="status" defaultChecked />
                              <Label htmlFor="status" className="text-sm">
                                ステータス
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="motivation" />
                              <Label htmlFor="motivation" className="text-sm">
                                志望動機
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="skills" />
                              <Label htmlFor="skills" className="text-sm">
                                スキル
                              </Label>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm font-medium">評価情報</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="rating" defaultChecked />
                              <Label htmlFor="rating" className="text-sm">
                                総合評価
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="skill-rating" />
                              <Label htmlFor="skill-rating" className="text-sm">
                                スキル評価
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="attitude-rating" />
                              <Label htmlFor="attitude-rating" className="text-sm">
                                姿勢評価
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="communication-rating" />
                              <Label htmlFor="communication-rating" className="text-sm">
                                コミュニケーション評価
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="feedback-comment" />
                              <Label htmlFor="feedback-comment" className="text-sm">
                                フィードバックコメント
                              </Label>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-dashed">
                          <CardHeader className="py-3">
                            <CardTitle className="text-sm font-medium">面談情報</CardTitle>
                          </CardHeader>
                          <CardContent className="py-0 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="interview-date" />
                              <Label htmlFor="interview-date" className="text-sm">
                                面談日時
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="interview-type" />
                              <Label htmlFor="interview-type" className="text-sm">
                                面談形式
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="interviewer" />
                              <Label htmlFor="interviewer" className="text-sm">
                                面談担当者
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="interview-result" />
                              <Label htmlFor="interview-result" className="text-sm">
                                面談結果
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="interview-notes" />
                              <Label htmlFor="interview-notes" className="text-sm">
                                面談メモ
                              </Label>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    {/* 出力形式 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">出力形式</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="file-format">ファイル形式</Label>
                          <RadioGroup defaultValue="csv" className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="csv" id="csv" />
                              <Label htmlFor="csv">CSV</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="excel" id="excel" />
                              <Label htmlFor="excel">Excel</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="encoding">文字コード</Label>
                          <Select defaultValue="utf8">
                            <SelectTrigger id="encoding">
                              <SelectValue placeholder="文字コードを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utf8">UTF-8</SelectItem>
                              <SelectItem value="sjis">Shift-JIS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">設定をリセット</Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      エクスポート
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* 右側：プレビューと履歴 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>エクスポートプレビュー</CardTitle>
                    <CardDescription>出力されるデータの概要</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">データタイプ:</span>
                        <span className="font-medium">応募者データ</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">対象レコード数:</span>
                        <span className="font-medium">45件</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">期間:</span>
                        <span className="font-medium">2024/05/01 - 2024/06/01</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">出力項目数:</span>
                        <span className="font-medium">12項目</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ファイル形式:</span>
                        <span className="font-medium">CSV (UTF-8)</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">出力項目プレビュー</h4>
                      <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-nowrap">
                        氏名,大学・学部,学年,メールアドレス,応募求人,応募日,ステータス,総合評価...
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">データサンプル</h4>
                      <div className="bg-gray-50 p-3 rounded-md text-xs font-mono overflow-x-auto whitespace-nowrap">
                        田中太郎,東京大学経済学部,2年,tanaka@example.com,Webマーケティングアシスタント,2024/06/01,書類選考中,4.3...
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>最近のエクスポート</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">応募者データ</p>
                            <p className="text-xs text-gray-500">2024/06/01 15:30</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">面談データ</p>
                            <p className="text-xs text-gray-500">2024/05/28 10:15</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">フィードバックデータ</p>
                            <p className="text-xs text-gray-500">2024/05/20 09:45</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 出力履歴タブ */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>エクスポート履歴</CardTitle>
                <CardDescription>過去に出力したデータの履歴を確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input placeholder="ファイル名で検索" className="max-w-sm" />
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      フィルター
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                      <div className="col-span-4">ファイル名</div>
                      <div className="col-span-2">タイプ</div>
                      <div className="col-span-2">レコード数</div>
                      <div className="col-span-2">出力日時</div>
                      <div className="col-span-2">操作</div>
                    </div>

                    {/* 履歴リスト */}
                    <div className="divide-y">
                      <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">応募者データ_20240601</p>
                            <p className="text-xs text-gray-500">CSV (UTF-8)</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">応募者</Badge>
                        </div>
                        <div className="col-span-2">45件</div>
                        <div className="col-span-2 text-sm">2024/06/01 15:30</div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">面談データ_20240528</p>
                            <p className="text-xs text-gray-500">Excel</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">面談</Badge>
                        </div>
                        <div className="col-span-2">28件</div>
                        <div className="col-span-2 text-sm">2024/05/28 10:15</div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">フィードバックデータ_20240520</p>
                            <p className="text-xs text-gray-500">CSV (Shift-JIS)</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">フィードバック</Badge>
                        </div>
                        <div className="col-span-2">32件</div>
                        <div className="col-span-2 text-sm">2024/05/20 09:45</div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">メッセージデータ_20240515</p>
                            <p className="text-xs text-gray-500">CSV (UTF-8)</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">メッセージ</Badge>
                        </div>
                        <div className="col-span-2">124件</div>
                        <div className="col-span-2 text-sm">2024/05/15 14:20</div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                        <div className="col-span-4 flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">応募者データ_20240501</p>
                            <p className="text-xs text-gray-500">Excel</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">応募者</Badge>
                        </div>
                        <div className="col-span-2">38件</div>
                        <div className="col-span-2 text-sm">2024/05/01 11:05</div>
                        <div className="col-span-2 flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 設定タブ */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>エクスポート設定</CardTitle>
                <CardDescription>データエクスポートの基本設定を行います</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">デフォルト設定</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-format">デフォルトファイル形式</Label>
                      <Select defaultValue="csv">
                        <SelectTrigger id="default-format">
                          <SelectValue placeholder="ファイル形式を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="default-encoding">デフォルト文字コード</Label>
                      <Select defaultValue="utf8">
                        <SelectTrigger id="default-encoding">
                          <SelectValue placeholder="文字コードを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utf8">UTF-8</SelectItem>
                          <SelectItem value="sjis">Shift-JIS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-format">日付形式</Label>
                      <Select defaultValue="yyyy-mm-dd">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="日付形式を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                          <SelectItem value="yyyy/mm/dd">YYYY/MM/DD</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="filename-format">ファイル名形式</Label>
                      <Select defaultValue="type-date">
                        <SelectTrigger id="filename-format">
                          <SelectValue placeholder="ファイル名形式を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type-date">[データタイプ]_[日付]</SelectItem>
                          <SelectItem value="date-type">[日付]_[データタイプ]</SelectItem>
                          <SelectItem value="custom">カスタム</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">自動エクスポート</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-export" />
                      <Label htmlFor="auto-export">定期的な自動エクスポートを有効にする</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="schedule">スケジュール</Label>
                        <Select defaultValue="weekly">
                          <SelectTrigger id="schedule">
                            <SelectValue placeholder="スケジュールを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">毎日</SelectItem>
                            <SelectItem value="weekly">毎週</SelectItem>
                            <SelectItem value="monthly">毎月</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="day">曜日</Label>
                        <Select defaultValue="monday">
                          <SelectTrigger id="day">
                            <SelectValue placeholder="曜日を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monday">月曜日</SelectItem>
                            <SelectItem value="tuesday">火曜日</SelectItem>
                            <SelectItem value="wednesday">水曜日</SelectItem>
                            <SelectItem value="thursday">木曜日</SelectItem>
                            <SelectItem value="friday">金曜日</SelectItem>
                            <SelectItem value="saturday">土曜日</SelectItem>
                            <SelectItem value="sunday">日曜日</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">時間</Label>
                        <Select defaultValue="03:00">
                          <SelectTrigger id="time">
                            <SelectValue placeholder="時間を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="00:00">00:00</SelectItem>
                            <SelectItem value="03:00">03:00</SelectItem>
                            <SelectItem value="06:00">06:00</SelectItem>
                            <SelectItem value="09:00">09:00</SelectItem>
                            <SelectItem value="12:00">12:00</SelectItem>
                            <SelectItem value="15:00">15:00</SelectItem>
                            <SelectItem value="18:00">18:00</SelectItem>
                            <SelectItem value="21:00">21:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="auto-data-type">データタイプ</Label>
                        <Select defaultValue="applicants">
                          <SelectTrigger id="auto-data-type">
                            <SelectValue placeholder="データタイプを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applicants">応募者データ</SelectItem>
                            <SelectItem value="interviews">面談データ</SelectItem>
                            <SelectItem value="feedback">フィードバックデータ</SelectItem>
                            <SelectItem value="messages">メッセージデータ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notification">通知設定</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="email-notification" defaultChecked />
                          <Label htmlFor="email-notification" className="text-sm">
                            メール通知
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="system-notification" />
                          <Label htmlFor="system-notification" className="text-sm">
                            システム通知
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">保存設定</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="history-retention">履歴保持期間</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="history-retention">
                          <SelectValue placeholder="保持期間を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30日間</SelectItem>
                          <SelectItem value="90">90日間</SelectItem>
                          <SelectItem value="180">180日間</SelectItem>
                          <SelectItem value="365">1年間</SelectItem>
                          <SelectItem value="unlimited">無期限</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storage-limit">ストレージ制限</Label>
                      <Select defaultValue="1gb">
                        <SelectTrigger id="storage-limit">
                          <SelectValue placeholder="制限を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500mb">500MB</SelectItem>
                          <SelectItem value="1gb">1GB</SelectItem>
                          <SelectItem value="5gb">5GB</SelectItem>
                          <SelectItem value="unlimited">無制限</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">デフォルトに戻す</Button>
                <Button>設定を保存</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function DatePickerWithRange() {
  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(2024, 4, 1), // 5月1日
    to: new Date(2024, 5, 1), // 6月1日
  })

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy/MM/dd", { locale: ja })} - {format(date.to, "yyyy/MM/dd", { locale: ja })}
                </>
              ) : (
                format(date.from, "yyyy/MM/dd", { locale: ja })
              )
            ) : (
              <span>日付を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
