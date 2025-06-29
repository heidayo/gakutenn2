'use client'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo, AnimatedLogo } from "@/components/logo"
import {
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Monitor,
  MapPin,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

const iconMap = {
  MessageSquare,
  Clock,
  TrendingUp,
  Star,
  Users,
  Building2,
} as const

type LandingFeature = {
  id: string
  title: string
  description: string
  icon: keyof typeof iconMap
  color: string
}


export default function LandingPage() {
  const [stats, setStats] = useState({ applications: 0, interviews: 0, averageRating: 0 })
  const [features, setFeatures] = useState<LandingFeature[] | null>(null)
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) router.push(`/search=${encodeURIComponent(q)}`)
  }

  useEffect(() => {
    const fetchStatsAndFeatures = async () => {
      // ----- ログインユーザー情報 -----
      const { data: { user } } = await supabase.auth.getUser()

      if (user && user.email) {
        const email = user.email

        // ----- 応募総数取得 -----
        const { count: appsCount, error: appsErr } = await supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("email", email)

        if (appsErr) console.error("applications fetch error", appsErr)

        // ----- 面談予定数取得 -----
        const { count: interviewsCount, error: interviewsErr } = await supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .eq("email", email)
          .eq("status", "面談予定")

        if (interviewsErr) console.error("interviews fetch error", interviewsErr)

        // ----- 体験(評価)取得 -----
        const { data: experiences, error: expErr } = await supabase
          .from("student_experiences")
          .select("rating")
          .eq("email", email)

        if (expErr) console.error("experiences fetch error", expErr)

        // ----- 平均評価を計算 -----
        const averageRating =
          experiences && experiences.length > 0
            ? experiences.reduce((sum, exp) => sum + (exp.rating as number), 0) /
              experiences.length
            : 0

        setStats({
          applications: appsCount ?? 0,
          interviews: interviewsCount ?? 0,
          averageRating,
        })
      }

      // ----- ランディング用特徴取得 -----
      const { data: landingFeatures, error: featErr } = await supabase
        .from("landing_features")
        .select("id, title, description, icon, color")
        .order("display_order")

      if (featErr) {
        console.error("features fetch error", featErr)
      } else {
        setFeatures(landingFeatures as LandingFeature[] | null)
      }
    }

    fetchStatsAndFeatures()
  }, [])

  useEffect(() => {
    const fetchRecommended = async () => {
      const { data: jobs, error } = await supabase
        .from("jobs")
        .select("id, title, location, duration, salary, salary_type, work_hours, image_url")
        .eq("status", "published")
        .order("publish_date", { ascending: false })
        .limit(10)

      if (error) {
        console.error("Error fetching recommended jobs:", error)
        return
      }
      if (!jobs) {
        setRecommendedJobs([])
        return
      }
      const jobsWithUrls = jobs.map((job) => {
        let publicUrl = job.image_url
        if (publicUrl && !publicUrl.startsWith("http")) {
          const { data } = supabase.storage
            .from("company-jobs")
            .getPublicUrl(publicUrl)
          publicUrl = data?.publicUrl ?? null
        }
        return { ...job, image_url: publicUrl }
      })
      setRecommendedJobs(jobsWithUrls)
    }
    fetchRecommended()
  }, [])

  // --- Supabase data fetch ---
  // (Keep the rest of the component as is, or move the async data fetching logic to useEffect if needed)

  // fallback so the page renders even if the table is empty
  const hero = {
    headline: "企業からリアルなフィードバック。",
    subtitle: "キャリアの\"転換点\"が、もっとクリアになる。",
    description:
      "短期・単発OKの成長インターンで実務経験を積み、企業からの詳細なフィードバックを通じて自分の強みと課題を明確化。忙しい学生でも挑戦できるキャリア転換プラットフォーム。",
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Logo variant="horizontal" size="md" />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
            特徴
          </Link>
          <Link href="#for-students" className="text-sm font-medium hover:text-blue-600 transition-colors">
            学生向け
          </Link>
          <Link href="#for-companies" className="text-sm font-medium hover:text-blue-600 transition-colors">
            企業向け
          </Link>
        </nav>
        <form onSubmit={handleSearch} className="ml-4 flex items-center">
          <Input
            type="text"
            placeholder="キーワード検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-32 sm:w-48"
          />
          <Button type="submit" size="sm" className="ml-2">
            検索
          </Button>
        </form>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">
                学生のキャリア転換を支援
              </Badge>

              {/* アニメーション付きロゴを中央に配置 */}
              <AnimatedLogo className="mb-6" />

              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                {hero.headline}
                <br />
                {hero.subtitle}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                {hero.description}
              </p>
              <div className="space-x-4 mt-8">
                <Link href="/auth/student/login">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                  >
                    学生として始める
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/company/login">
                  <Button variant="outline" size="lg">
                    企業として参加する
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Jobs */}
        <section id="recommended-jobs" className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">おすすめ求人</h2>
              <Link href="/search" className="text-primary-500 hover:underline">
                すべて見る →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  {job.image_url && (
                    <img src={job.image_url} alt={job.title} className="w-full h-40 object-cover rounded-t-md" />
                  )}
                  <CardContent className="p-3 pt-2">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">{job.title}</h3>
                    <div className="space-y-1 text-xs text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{job.work_hours}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600 mb-2">¥{job.salary}</div>
                    <Link href={`/jobs/${job.id}`} className="text-primary-500 hover:underline mt-2 block">
                      詳細を見る →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Card className="bg-white shadow-lg rounded-lg p-8 lg:p-36">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <Logo variant="icon" size="lg" className="mb-4" />
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">学転インターンの特徴</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                  従来の求人サイトとは違う、キャリア転換にフォーカスした新しいプラットフォーム
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                {features?.map((f) => {
                  const Icon =
                    iconMap[f.icon as keyof typeof iconMap] ?? MessageSquare
                  return (
                    <Card
                      key={f.id}
                      className="border-2 hover:border-blue-200 transition-colors"
                    >
                      <CardHeader>
                        <Icon
                          className={`h-10 w-10 text-${f.color}-600 mb-2`}
                        />
                        <CardTitle>{f.title}</CardTitle>
                        <CardDescription>{f.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        </section>

        {/* For Students */}
        <section id="for-students" className="w-full py-12 md:py-24 lg:py-32 bg-orange-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <Badge className="bg-orange-100 text-orange-800">
                  <Smartphone className="w-4 h-4 mr-1" />
                  学生向け（スマホ対応）
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  あなたのペースで
                  <br />
                  キャリアを転換しよう
                </h2>
                <p className="text-gray-600 md:text-lg">
                  大学1〜3年生を対象に、短期間でも成長できる実務経験の機会を提供。
                  企業からの具体的なフィードバックで、自分の可能性を発見できます。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>週1回〜単発OKの案件多数</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>未経験歓迎・丁寧な指導</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>選考結果に必ずフィードバック</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>志向性診断で自己理解を深化</span>
                  </div>
                </div>
                <Link href="/auth/student/register">
                  <Button className="bg-primary-500 hover:bg-primary-600">学生登録を始める</Button>
                </Link>
              </div>
              <div className="lg:order-first">
                <Card className="p-6 bg-white shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">プロフィール作成</h3>
                        <p className="text-sm text-gray-600">スキルと志向性を登録</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-orange-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold">案件に応募</h3>
                        <p className="text-sm text-gray-600">条件に合う仕事を探して応募</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">フィードバック受領</h3>
                        <p className="text-sm text-gray-600">企業から詳細な評価とアドバイス</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* For Companies */}
        <section id="for-companies" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <Badge className="bg-purple-100 text-purple-800">
                  <Monitor className="w-4 h-4 mr-1" />
                  企業向け（PC対応）
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  優秀な学生との
                  <br />
                  早期接点を創出
                </h2>
                <p className="text-gray-600 md:text-lg">
                  フィードバック提供を条件に無料で求人掲載が可能。
                  短期間でも学生の成長をサポートし、将来の採用候補を発掘できます。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>フィードバック提供で無料掲載</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>短期・単発案件でも学生の成長支援</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>将来の採用候補をタレントプール化</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>採用KPIと効果測定ダッシュボード</span>
                  </div>
                </div>
                <Link href="/auth/company/login">
                  <Button className="bg-purple-600 hover:bg-purple-700">企業登録を始める</Button>
                </Link>
              </div>
              <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">求人情報登録</h3>
                      <p className="text-sm text-gray-600">短期・単発案件を簡単作成</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">学生選考</h3>
                      <p className="text-sm text-gray-600">プロフィールと診断結果で判断</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">フィードバック提供</h3>
                      <p className="text-sm text-gray-600">学生の成長を支援する評価</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback Process */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Logo variant="icon" size="md" className="mb-2" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">フィードバックプロセス</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                学転インターン独自のフィードバックシステムで、学生の成長を加速
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4 lg:gap-8">
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">面談実施</h3>
                <p className="text-sm text-gray-600">企業と学生が面談を実施</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">評価入力</h3>
                <p className="text-sm text-gray-600">企業が★評価とコメントを必須入力</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">通知受信</h3>
                <p className="text-sm text-gray-600">学生にプッシュ通知でお知らせ</p>
              </Card>
              <Card className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">学習記録</h3>
                <p className="text-sm text-gray-600">学びメモを記録してキャリアに活用</p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary-500 to-primary-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <Logo variant="icon" size="lg" className="mb-4 [&_svg_circle]:fill-white [&_svg_g]:fill-primary-700" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">今すぐ学転インターンを始めよう</h2>
              <p className="max-w-[600px] md:text-xl/relaxed">あなたのキャリア転換の第一歩を、今日から始めませんか？</p>
              <div className="space-x-4 mt-8">
                <Link href="/auth/student/register">
                  <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                    学生として登録
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/company/login">
                  <Button size="lg" className="bg-white text-primary-600 border border-white hover:bg-white/90">
                    企業として参加
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="flex items-center space-x-2">
          <Logo variant="icon" size="sm" />
          <p className="text-xs text-gray-500">© 2024 学転インターン. All rights reserved.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            利用規約
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            プライバシーポリシー
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            お問い合わせ
          </Link>
        </nav>
      </footer>
    </div>
  )
}
