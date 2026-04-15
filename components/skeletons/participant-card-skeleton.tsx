// ParticipantCard 로딩 스켈레톤 컴포넌트
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ParticipantCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* 아바타 자리 */}
      <Skeleton className="h-10 w-10 rounded-full" />

      {/* 이름 및 참여일 자리 */}
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}
