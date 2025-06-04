import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Skeleton */}
      <header className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>
      </header>

      {/* Search Bar Skeleton */}
      <div className="bg-white px-4 py-3 border-b">
        <Skeleton className="h-10 w-full mb-3" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="px-4 py-3 bg-white border-b">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Job List Skeleton */}
      <div className="px-4 py-4 space-y-3">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="flex">
              <Skeleton className="w-24 h-20 flex-shrink-0" />
              <CardContent className="flex-1 p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/3 mb-1" />
                <Skeleton className="h-3 w-1/4 mb-2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
