import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Filter,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Home,
  MessageSquare,
  BarChart3,
  User,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function ApplicationsPage() {
  // ── Supabase client ─────────────────────────────────────────────
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      [
        "❌ Supabase env vars are missing.",
        `NEXT_PUBLIC_SUPABASE_URL = ${supabaseUrl}`,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY = ${
          supabaseAnonKey ? supabaseAnonKey.slice(0, 10) + "…" : supabaseAnonKey
        }`,
        "Check your .env.local (development) or Vercel env vars (production).",
      ].join("\n")
    );
  }

  // Cookie wrapper (read‑only; get だけ実装、set/remove は no‑op)
  const cookieStore: any = (await (async () => cookies())()); // handles both sync / async typings

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get:    (name: string) => cookieStore?.get?.(name)?.value,
      set:    () => { /* no‑op on server component */ },
      remove: () => { /* no‑op on server component */ },
    },
  });

  // ───────────── dev helper ─────────────
  if (process.env.NODE_ENV === "development") {
    console.log("[Supabase] server client initialised on ApplicationsPage");
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return <div className="p-6">このページを見るにはログインが必要です。</div>;
  }

  const { data: rawApps, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      status,
      next_step,
      next_date,
      jobs!applications_job_id_fkey (
        title,
        companies!jobs_company_id_fkey (
          name
        )
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });
  console.log("rawApps:", rawApps, "fetch error:", error);

  if (error) console.error("applications fetch error", error);

  // ── helpers ────────────────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "面談予定":
        return "bg-blue-100 text-blue-800";
      case "書類選考中":
        return "bg-yellow-100 text-yellow-800";
      case "合格":
        return "bg-green-100 text-green-800";
      case "不合格":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const applications = (rawApps ?? []).map((row) => {
    const job = row.jobs as any;
    const companyObj = job?.companies as any;
    return {
      id: row.id,
      company: companyObj?.name ?? "",
      jobTitle: job?.title ?? "",
      status: row.status,
      next_step: row.next_step,
      next_date: row.next_date,
      progress:
        row.status === "合格" || row.status === "不合格"
          ? 100
          : row.status === "面談予定"
          ? 50
          : 25,
      appliedDate: row.created_at
        ? new Date(row.created_at).toLocaleDateString("ja-JP")
        : "",
    };
  });
  console.log("applications:", applications);

  const stats = {
    total: applications.length,
    inProgress: applications.filter((a) =>
      ["面談予定", "書類選考中"].includes(a.status)
    ).length,
    passed: applications.filter((a) => a.status === "合格").length,
    rejected: applications.filter((a) => a.status === "不合格").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "面談予定":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "書類選考中":
        return <Eye className="h-4 w-4 text-yellow-600" />
      case "合格":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "不合格":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/dashboard">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">応募状況</span>
          </div>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">総応募数</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-xs text-gray-600">選考中</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-xs text-gray-600">合格</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-600">不合格</div>
            </div>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">応募一覧</h2>
            <span className="text-sm text-gray-600">{applications.length}件</span>
          </div>

          {applications.map((app) => (
            <Link key={app.id} href={`/student/applications/${app.id}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {/* Company Name */}
                      <div className="flex items-center space-x-2 mb-1">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{app.company}</span>
                      </div>
                      {/* Job Title */}
                      <h3 className="font-semibold text-base mb-1">{app.jobTitle}</h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>応募日: {app.appliedDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1">{app.status}</span>
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>選考進捗</span>
                      <span>{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-1.5" />
                  </div>

                  {/* Next Step */}
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-gray-700">次のステップ</div>
                        <div className="text-xs text-gray-600">{app.next_step}</div>
                      </div>
                      {app.next_date && <div className="text-xs text-gray-600">{app.next_date}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="grid grid-cols-4 h-16">
          <Link href="/student" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <Home className="h-5 w-5" />
            <span className="text-xs">ホーム</span>
          </Link>
          <Link href="/student/messages" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">メッセージ</span>
          </Link>
          <Link href="/student/dashboard" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">ダッシュボード</span>
          </Link>
          <Link href="/student/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-500">
            <User className="h-5 w-5" />
            <span className="text-xs">プロフィール</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
