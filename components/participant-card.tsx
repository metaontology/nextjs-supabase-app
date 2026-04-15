// 이벤트 참여자 카드 컴포넌트 (Server Component)
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ParticipantCardProps } from '@/lib/types'

/** joined_at ISO 문자열을 한국어 날짜로 포맷 (예: 2024년 4월 14일) */
function formatJoinedAt(joinedAt: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(joinedAt))
}

export function ParticipantCard({
  participant,
  className,
}: ParticipantCardProps) {
  const { profile, joined_at } = participant
  const displayName = profile.full_name ?? '익명'
  const initial = profile.full_name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* 프로필 아바타 */}
      <Avatar className="h-10 w-10">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={displayName} />
        ) : null}
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>

      {/* 이름 및 참여일 */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatJoinedAt(joined_at)}
        </span>
      </div>
    </div>
  )
}
