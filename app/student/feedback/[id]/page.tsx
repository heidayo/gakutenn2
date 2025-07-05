"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Star,
  Building2,
  Calendar,
  Clock,
  BookOpen,
  Save,
  Share,
  Copy,
  CheckCircle,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from '@/lib/supabase/client'
import { useParams } from 'next/navigation'

export default function FeedbackDetailPage() {
  const [learningNote, setLearningNote] = useState("")
  const [isSaved, setIsSaved] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [existingLearningNote, setExistingLearningNote] = useState<string | null>(null)
  const params = useParams();
  // Next.js useParams returns string | string[] | undefined, so cast to string
  const id = Array.isArray(params.id) || !params.id ? '' : params.id;

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedbacks')
        .select(`*, company:companies(name), template_id`)
        .eq('id', id)
        .single()
      if (error) {
        console.error('Error fetching feedback:', error)
      } else {
        setFeedback(data)
      }
    }
    fetchFeedback()
  }, [id])
  
  useEffect(() => {
    if (!id) return
    const fetchLearningNote = async () => {
      const { data, error } = await supabase
        .from('learning_notes')
        .select('note')
        .eq('feedback_id', id)
        .single()
      if (!error && data) {
        setExistingLearningNote(data.note)
      }
    }
    fetchLearningNote()
  }, [id])

  if (!feedback) {
    return <div className="p-4">Loading...</div>
  }

  // JSONBから各プロパティを取り出し
  const { ratings = {}, comments = {}, overall_rating, overall_comment } = feedback

  const handleSaveLearningNote = () => {
    const saveNote = async () => {
      const { error } = await supabase
        .from('learning_notes')
        .insert({ feedback_id: id, note: learningNote })
      if (error) {
        console.error('Error saving learning note:', error)
      } else {
        setExistingLearningNote(learningNote)
        setLearningNote('')
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 2000)
      }
    }
    saveNote()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ))
  }

  const renderSkillProgress = (skill: { name: string; before: number; after: number }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{skill.name}</span>
          <span className="text-gray-600">
            {skill.before} → {skill.after}
          </span>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${(skill.before / 5) * 100}%` }}></div>
          </div>
          <span className="text-xs text-gray-500">→</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(skill.after / 5) * 100}%` }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/student/feedback">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <span className="text-lg font-semibold">フィードバック詳細</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Header Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{feedback.company.name}</span>
                  {feedback.isNew && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">NEW</Badge>}
                </div>
                <h1 className="text-xl font-bold mb-2">{feedback.role}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{feedback.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{feedback.duration}</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1 mb-1">{renderStars(overall_rating)}</div>
                <div className="text-2xl font-bold text-yellow-600">{overall_rating}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{feedback.category}</Badge>
              <span className="text-sm text-gray-600">評価者: {feedback.interviewer}</span>
            </div>
          </CardContent>
        </Card>

        {/* Company Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Award className="h-4 w-4 mr-2" />
              企業からのフィードバック
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed">{overall_comment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                評価された強み
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ratings.strengths?.map((strength: string, index: number) => (
                  <Badge key={index} className="bg-green-100 text-green-800">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center text-orange-600">
                <Target className="h-4 w-4 mr-2" />
                改善ポイント
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ratings.improvements?.map((improvement: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                    {improvement}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Growth */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              スキル成長
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratings.skills?.map((skill: { name: string; before: number; after: number }, index: number) => (
              <div key={index}>{renderSkillProgress(skill)}</div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Note */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              学びメモ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingLearningNote && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{existingLearningNote}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>追加の学びや気づき</Label>
              <Textarea
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                placeholder="この経験から学んだことや今後活かしたいポイントを記入してください..."
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveLearningNote} className="flex-1" disabled={!learningNote.trim()}>
                {isSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    保存済み
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    学びメモを保存
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
