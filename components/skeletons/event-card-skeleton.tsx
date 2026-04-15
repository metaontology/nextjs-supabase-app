// EventCard 로딩 스켈레톤 컴포넌트
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* 커버 이미지 자리 */}
      <Skeleton className="h-40 w-full rounded-none" />

      <CardContent className="space-y-2 p-4">
        {/* Badge 자리 */}
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
        </div>

        {/* 제목 자리 */}
        <Skeleton className="h-5 w-3/4" />

        {/* 날짜 자리 */}
        <Skeleton className="h-4 w-1/2" />

        {/* 장소 자리 */}
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  )
}
