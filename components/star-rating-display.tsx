import { Star } from "lucide-react"

interface StarRatingDisplayProps {
  rating: number
  maxRating?: number
  showValue?: boolean
}

export function StarRatingDisplay({ rating, maxRating = 5, showValue = true }: StarRatingDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  )
}
