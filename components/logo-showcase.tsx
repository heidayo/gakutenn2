"use client"

import { Logo, AnimatedLogo, FaviconLogo } from "@/components/logo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            学転インターン ロゴシステム
          </h1>
          <p className="text-gray-600 text-lg">「学」の文字をベースにした独自ロゴデザインとバリエーション</p>
        </div>

        {/* メインロゴ */}
        <Card>
          <CardHeader>
            <CardTitle>メインロゴ</CardTitle>
            <CardDescription>
              「学」の文字をモダンにデザインしたメインロゴ。グラデーション背景と成長を表すアクセント要素を含む。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="full" size="sm" />
                </div>
                <p className="text-sm text-gray-600">Small (sm)</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="full" size="md" />
                </div>
                <p className="text-sm text-gray-600">Medium (md)</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="full" size="lg" />
                </div>
                <p className="text-sm text-gray-600">Large (lg)</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="full" size="xl" />
                </div>
                <p className="text-sm text-gray-600">Extra Large (xl)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* バリエーション */}
        <Card>
          <CardHeader>
            <CardTitle>ロゴバリエーション</CardTitle>
            <CardDescription>様々な用途に対応するロゴのバリエーション</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="icon" size="lg" />
                </div>
                <p className="text-sm text-gray-600">アイコンのみ</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="horizontal" size="md" />
                </div>
                <p className="text-sm text-gray-600">横型レイアウト</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <Logo variant="vertical" size="md" />
                </div>
                <p className="text-sm text-gray-600">縦型レイアウト</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-white p-4 rounded-lg border">
                  <FaviconLogo />
                </div>
                <p className="text-sm text-gray-600">ファビコン用</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アニメーションロゴ */}
        <Card>
          <CardHeader>
            <CardTitle>アニメーション付きロゴ</CardTitle>
            <CardDescription>特別なシーンで使用するアニメーション効果付きロゴ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="bg-white p-8 rounded-lg border">
                <AnimatedLogo />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 背景バリエーション */}
        <Card>
          <CardHeader>
            <CardTitle>背景バリエーション</CardTitle>
            <CardDescription>異なる背景色での表示例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="bg-white p-6 rounded-lg border">
                  <Logo variant="horizontal" size="md" />
                </div>
                <p className="text-sm text-gray-600">白背景</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <Logo variant="horizontal" size="md" className="[&_span]:text-white" />
                </div>
                <p className="text-sm text-gray-600">ダーク背景</p>
              </div>
              <div className="text-center space-y-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg">
                  <Logo variant="icon" size="lg" className="[&_svg_circle]:fill-white [&_svg_g]:fill-blue-600" />
                </div>
                <p className="text-sm text-gray-600">グラデーション背景</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 使用ガイドライン */}
        <Card>
          <CardHeader>
            <CardTitle>使用ガイドライン</CardTitle>
            <CardDescription>ロゴの適切な使用方法とブランドガイドライン</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">✅ 推奨される使用方法</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 十分な余白を確保する</li>
                  <li>• ブランドカラー（青〜紫グラデーション）を維持</li>
                  <li>• 読みやすいサイズで表示</li>
                  <li>• 背景とのコントラストを確保</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">❌ 避けるべき使用方法</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• ロゴの変形や歪み</li>
                  <li>• ブランドカラー以外の色使用</li>
                  <li>• 小さすぎる表示サイズ</li>
                  <li>• 背景との区別が困難な配置</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
