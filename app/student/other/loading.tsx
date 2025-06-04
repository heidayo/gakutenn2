import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function StudentOtherLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="px-4 py-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections Skeleton */}
      <div className="px-4 py-6 space-y-6">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <Skeleton className="h-6 w-24 mb-3" />
            <Card>
              <CardContent className="p-0">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-3 p-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
