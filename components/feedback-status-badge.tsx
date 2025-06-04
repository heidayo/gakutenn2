import { Badge } from "@/components/ui/badge"

type FeedbackStatus = "draft" | "sent" | "scheduled"

interface FeedbackStatusBadgeProps {
  status: FeedbackStatus
}

// 送信済みのバッジ色を更新
const statusConfig = {
  draft: { label: "下書き", color: "bg-gray-500" },
  sent: { label: "送信済み", color: "bg-orange-500" },
  scheduled: { label: "送信予定", color: "bg-blue-500" },
}

export function FeedbackStatusBadge({ status }: FeedbackStatusBadgeProps) {
  const config = statusConfig[status]
  return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
}
