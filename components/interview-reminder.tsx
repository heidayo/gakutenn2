"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, X, Clock, Video, MapPin, Phone } from "lucide-react"

interface InterviewReminder {
  id: number
  company: string
  job: string
  date: string
  time: string
  type: "オンライン" | "対面" | "電話"
  minutesUntil: number
  meetingLink?: string
  location?: string
  phone?: string
}

export function InterviewReminder() {
  const [reminders, setReminders] = useState<InterviewReminder[]>([
    {
      id: 1,
      company: "株式会社テックスタート",
      job: "Webマーケティングアシスタント",
      date: "2024年6月5日",
      time: "14:00",
      type: "オンライン",
      minutesUntil: 15,
      meetingLink: "https://meet.example.com/abc123",
    },
  ])

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 15分前、5分前、1分前にリマインダーを表示
    const checkReminders = () => {
      const now = new Date()
      const hasUpcomingInterview = reminders.some(
        (reminder) => reminder.minutesUntil <= 15 && reminder.minutesUntil > 0,
      )
      setIsVisible(hasUpcomingInterview)
    }

    checkReminders()
    const interval = setInterval(checkReminders, 60000) // 1分ごとにチェック

    return () => clearInterval(interval)
  }, [reminders])

  const handleJoinMeeting = (reminder: InterviewReminder) => {
    if (reminder.meetingLink) {
      window.open(reminder.meetingLink, "_blank")
    }
  }

  const handleDismiss = (id: number) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "オンライン":
        return <Video className="h-4 w-4" />
      case "対面":
        return <MapPin className="h-4 w-4" />
      case "電話":
        return <Phone className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getUrgencyColor = (minutes: number) => {
    if (minutes <= 1) return "bg-red-100 border-red-300"
    if (minutes <= 5) return "bg-orange-100 border-orange-300"
    return "bg-blue-100 border-blue-300"
  }

  if (!isVisible || reminders.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {reminders
        .filter((reminder) => reminder.minutesUntil <= 15 && reminder.minutesUntil > 0)
        .map((reminder) => (
          <Card key={reminder.id} className={`w-80 border-2 ${getUrgencyColor(reminder.minutesUntil)} shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-sm">面談リマインダー</h4>
                      <Badge
                        className={
                          reminder.minutesUntil <= 1
                            ? "bg-red-500"
                            : reminder.minutesUntil <= 5
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }
                      >
                        {reminder.minutesUntil}分前
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{reminder.company}</p>
                    <p className="text-sm font-medium mb-2">{reminder.job}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                      <span>{reminder.date}</span>
                      <span>{reminder.time}</span>
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(reminder.type)}
                        <span>{reminder.type}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {reminder.meetingLink && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleJoinMeeting(reminder)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          参加
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleDismiss(reminder.id)}>
                        後で
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDismiss(reminder.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
