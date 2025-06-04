import { Card, CardContent } from "@/components/ui/card"

export default function DiagnosisLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Skeleton */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Progress Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse" />
              <div className="flex justify-center space-x-6">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-6 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3">
                    <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Skeleton */}
        <div className="flex space-x-3">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
