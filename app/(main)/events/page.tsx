export const dynamic = 'force-dynamic'

// 내 이벤트 목록 페이지 — /events
// 주최자/참여자가 자신의 이벤트를 확인하는 메인 페이지
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getDummyEvents, getDummyParticipatedEvents } from '@/lib/data/dummy'
import { EventCard } from '@/components/event-card'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/** 더미 데이터 기준 현재 로그인 사용자 ID */
const DUMMY_OWNER_ID = 'user-1'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  // 내가 만든 이벤트 (created_by === 현재 사용자)
  const ownedEvents = getDummyEvents().filter(
    (e) => e.created_by === DUMMY_OWNER_ID,
  )
  // 내가 참여한 이벤트 (주최한 이벤트 제외)
  const participatedEvents = getDummyParticipatedEvents(DUMMY_OWNER_ID)

  // 전체 이벤트 수 (헤더 배지용)
  const totalCount = ownedEvents.length + participatedEvents.length

  return (
    <main className="flex flex-col">
      {/* 페이지 헤더 */}
      <div className="flex items-center gap-2 p-4 pb-2">
        <h1 className="text-xl font-bold text-foreground">내 이벤트</h1>
        {/* 전체 이벤트 수 배지 */}
        <Badge variant="secondary" className="text-xs">
          {totalCount}
        </Badge>
      </div>

      {/* 섹션1: 내가 만든 이벤트 */}
      <div className="flex items-center gap-2 p-4 pb-2">
        <h2 className="text-sm font-semibold text-foreground">
          내가 만든 이벤트
        </h2>
        <Badge variant="secondary" className="text-xs">
          {ownedEvents.length}
        </Badge>
      </div>
      {ownedEvents.length > 0 ? (
        <div className="flex flex-col gap-3 p-4 pt-0">
          {ownedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard event={event} isOwner={true} />
            </Link>
          ))}
        </div>
      ) : (
        /* 빈 상태 — 만든 이벤트 없음 */
        <EmptyState
          title="아직 만든 이벤트가 없어요"
          description="첫 이벤트를 만들어 팀원들을 초대해보세요"
          className="mt-4"
        />
      )}

      {/* 섹션2: 내가 참여한 이벤트 (border-t 구분선) */}
      <div className="flex items-center gap-2 border-t p-4 pb-2">
        <h2 className="text-sm font-semibold text-foreground">
          내가 참여한 이벤트
        </h2>
        <Badge variant="secondary" className="text-xs">
          {participatedEvents.length}
        </Badge>
      </div>
      {participatedEvents.length > 0 ? (
        <div className="flex flex-col gap-3 p-4 pt-0">
          {participatedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventCard event={event} isOwner={false} />
            </Link>
          ))}
        </div>
      ) : (
        /* 빈 상태 — 참여한 이벤트 없음 */
        <EmptyState
          title="아직 참여한 이벤트가 없어요"
          description="초대 링크를 받으면 이벤트에 참여할 수 있어요"
          className="mt-4"
        />
      )}

      {/* FAB — 이벤트 만들기 버튼 (MobileNav z-50보다 낮은 z-40) */}
      <Link href="/events/new">
        <Button
          size="lg"
          className="fixed bottom-20 right-4 z-40 min-h-[48px] gap-2 rounded-full shadow-lg"
          aria-label="새 이벤트 만들기"
        >
          <Plus className="h-5 w-5" />
          <span>만들기</span>
        </Button>
      </Link>
    </main>
  )
}
