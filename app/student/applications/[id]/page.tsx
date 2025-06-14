import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Star,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const cookieStore = (await (async () => cookies())());
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get:    (name: string) => cookieStore.get(name)?.value,
      set:    () => {},
      remove: () => {},
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return <div className="p-6">このページを見るにはログインが必要です。</div>;
  }

  // Await the dynamic route params in Next.js 15+
  const { id } = await params;

  // Fetch application with related job and company
  const { data: application, error } = await supabase
    .from("applications")
    .select(`
      id,
      created_at,
      status,
      next_step,
      next_date,
      available_days,
      start_date,
      additional_info,
      jobs!applications_job_id_fkey (
        id,
        title,
        location,
        salary,
        salary_type,
        companies!jobs_company_id_fkey (
          id,
          name
        )
      )
    `)
    .eq("user_id", session.user.id)
    .eq("id", id)
    .single();
  console.log("application data:", application, "fetch error:", error);

  if (error || !application) {
    console.error(error);
    return <div>データの取得に失敗しました。</div>;
  }

  // Supabase returns child relations as arrays or objects; extract the first element if array
  const job = Array.isArray(application.jobs)
    ? application.jobs[0]
    : application.jobs;
  const company = Array.isArray(job?.companies)
    ? job.companies[0]
    : job?.companies;
  console.log("nested job:", job, "nested company:", company);

  const getStepStatus = (status: string) => {
    switch (status) {
      case "completed":
        return { icon: <CheckCircle className="h-5 w-5 text-green-600" />, color: "bg-green-100" }
      case "scheduled":
        return { icon: <Clock className="h-5 w-5 text-blue-600" />, color: "bg-blue-100" }
      case "pending":
        return { icon: <AlertCircle className="h-5 w-5 text-gray-400" />, color: "bg-gray-100" }
      default:
        return { icon: <AlertCircle className="h-5 w-5 text-gray-400" />, color: "bg-gray-100" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "面談予定": return "bg-blue-100 text-blue-800";
      case "書類選考中": return "bg-yellow-100 text-yellow-800";
      case "合格": return "bg-green-100 text-green-800";
      case "不合格": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center space-x-3">
          <Link href="/student/applications">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <span className="text-lg font-semibold">応募詳細</span>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Application Header */}
        <Card>
  <CardContent className="pt-6">
    <Link href={`/student/jobs/${job?.id}`} className="block">
      <div className="flex items-start justify-between mb-4 cursor-pointer">
        <div className="flex-1">
          {/* Company Name */}
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {company?.name}
            </span>
          </div>
          {/* Job Title */}
          <h1 className="text-xl font-bold mb-2">
            {job?.title}
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{job?.location}</span>
            </div>
            <span>
              {job?.salary}
              {(job?.salary_type === 'hourly' ? '円／時' : '円')}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>応募日: {new Date(application.created_at).toLocaleDateString('ja-JP')}</span>
          </div>
        </div>
        <Badge className={getStatusColor(application.status)}>
          {application.status}
        </Badge>
      </div>
    </Link>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">選考進捗</span>
                {/* Assuming progress is not fetched, so no progress shown */}
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Application Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">応募内容</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.additional_info && (
              <div>
                <h4 className="font-semibold text-sm mb-1">追加情報</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{application.additional_info}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-sm mb-1">勤務可能曜日</h4>
              <div className="flex flex-wrap gap-1">
                {application.available_days.map((day: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">勤務開始希望日</h4>
              <p className="text-sm text-gray-700">{new Date(application.start_date).toLocaleDateString('ja-JP')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/student/messages/1`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              企業とメッセージ
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              応募内容編集
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              求人を保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
