"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Bookmark,
  Share,
  MapPin,
  Clock,
  Building2,
  Users,
  Calendar,
  Wifi,
  Heart,
  CheckCircle,
  AlertCircle,
  JapaneseYenIcon as Yen,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

import { supabase } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/types"

type JobRow = Database["public"]["Tables"]["jobs"]["Row"]
type JobDetail = JobRow & {
  selection_steps?: {
    step: number
    title: string
    duration: string
    description: string
  }[],
  mentor_name: string | null,
  mentor_role: string | null,
  mentor_experience: string | null,
  mentor_message: string | null,
  company: { name: string } | null,
}

export default function JobDetailPage() {
  const { id } = useParams()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    // Get current authenticated user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()
    if (userError) {
      console.error("Error getting user:", userError)
    }

    // Fetch job detail
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("*, company:companies(name)")
      .eq("id", id as string)
      .single<JobDetail>()
    if (jobError) {
      console.error("Error fetching job:", jobError)
    } else {
      setJob(jobData)
    }

    // Fetch bookmark status
    if (user) {
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("student_id", user.id)
        .eq("job_id", id as string)
        .single()
      // Ignore "row not found" error
      if (bookmarkError && bookmarkError.code !== "PGRST116") {
        console.error("Error fetching bookmark:", bookmarkError)
      }
      setIsBookmarked(!!bookmarkData)
    }

    setLoading(false)
  }
  fetchData()
}, [id])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!job) {
    return <div>求人が見つかりませんでした</div>
  }

const handleBookmark = async () => {
  // Get authenticated user
  const getUserResponse = await supabase.auth.getUser()
  const user = getUserResponse.data.user
  if (getUserResponse.error || !user) {
    console.error("Error getting user or no user:", getUserResponse.error)
    return
  }
  if (!isBookmarked) {
    const { error: insertError } = await supabase
      .from("bookmarks")
      .insert({ student_id: user.id, job_id: id as string })
    if (insertError) {
      console.error("Error inserting bookmark:", insertError)
    } else {
      setIsBookmarked(true)
    }
  } else {
    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .match({ student_id: user.id, job_id: id as string })
    if (deleteError) {
      console.error("Error deleting bookmark:", deleteError)
    } else {
      setIsBookmarked(false)
    }
  }
}


  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">求人詳細</span>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Job Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{job.category.charAt(0)}</span>
                  </div>
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{job.company?.name}</span>
                </div>
                <h1 className="text-xl font-bold mb-3">{job.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.duration}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-green-600 font-semibold mb-3">
                  <Yen className="h-5 w-5" />
                  <span>{job.salary}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Work Style */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">働き方</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">リモート</div>
                  <div className="text-sm font-semibold">{job.remote ?? "ー"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-xs text-gray-600">勤務時間</div>
                  <div className="text-sm font-semibold">{job.work_hours ?? "ー"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-gray-600">頻度</div>
                  <div className="text-sm font-semibold">{job.frequency ?? "ー"}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <div className="text-xs text-gray-600">期間</div>
                  <div className="text-sm font-semibold">{job.duration ?? "ー"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">業務内容</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.responsibilities?.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">応募条件</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements?.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待遇・福利厚生</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.benefits?.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Selection Process */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">選考フロー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {job.selection_steps?.map((process, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">{process.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-sm">{process.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {process.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mentor Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">メンター紹介</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">田</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{job.mentor_name}</h4>
                <p className="text-xs text-gray-600 mb-1">{job.mentor_role}</p>
                <p className="text-xs text-gray-600 mb-2">{job.mentor_experience}</p>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-gray-700">"{job.mentor_message}"</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href={`/auth/student/login`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base">この求人に応募する</Button>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center justify-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              質問する
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <Building2 className="h-4 w-4 mr-2" />
              企業ページ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
