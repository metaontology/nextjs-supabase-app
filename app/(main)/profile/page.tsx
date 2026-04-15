export const dynamic = 'force-dynamic'

// 프로필 페이지 — /profile
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, CheckCircle, Clock, UserCheck, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  DUMMY_PROFILES,
  getDummyEvents,
  getDummyParticipatedEvents,
  getDummyTotalParticipantCount,
} from '@/lib/data/dummy'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { EventCard } from '@/components/event-card'
import { EmptyState } from '@/components/empty-state'
import { LogoutButton } from '@/components/logout-button'

/** 가입일 포맷 변환 — ko-KR 로케일 기준 */
function formatJoinedDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  // 더미 사용자 데이터 로드 (user-1, 김앨리스)
  const DUMMY_USER = DUMMY_PROFILES[0]
  // 내가 주최한 이벤트 필터링
  const myEvents = getDummyEvents().filter(
    (e) => e.created_by === DUMMY_USER.id,
  )
  // 내가 참여한 이벤트 (주최 제외)
  const participatedEvents = getDummyParticipatedEvents(DUMMY_USER.id)

  // 통계 집계
  const stats = {
    total: myEvents.length,
    upcoming: myEvents.filter((e) => e.status === 'upcoming').length,
    ongoing: myEvents.filter((e) => e.status === 'ongoing').length,
    ended: myEvents.filter((e) => e.status === 'ended').length,
    totalParticipants: getDummyTotalParticipantCount(DUMMY_USER.id),
    participated: participatedEvents.length,
  }

  return (
    <main className="flex flex-col">
      {/* 프로필 섹션 */}
      <section className="flex flex-col items-center gap-4 p-6">
        {/* 아바타 — 이름 첫 글자를 fallback으로 표시 */}
        <Avatar className="h-20 w-20">
          {DUMMY_USER.avatar_url && (
            <AvatarImage
              src={DUMMY_USER.avatar_url}
              alt={DUMMY_USER.full_name ?? '프로필 이미지'}
            />
          )}
          <AvatarFallback className="text-2xl">
            {(DUMMY_USER.full_name ?? '?').charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* 이름 */}
        <p className="text-lg font-semibold">{DUMMY_USER.full_name}</p>

        {/* 이메일 */}
        <p className="text-sm text-muted-foreground">{DUMMY_USER.email}</p>

        {/* 가입일 */}
        <p className="text-xs text-muted-foreground">
          가입: {formatJoinedDate(DUMMY_USER.created_at)}
        </p>
      </section>

      {/* 활동 통계 섹션 */}
      <section className="border-t p-4">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          활동 요약
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* 전체 이벤트 */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl leading-none font-bold">{stats.total}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  전체 이벤트
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 총 참여자 */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl leading-none font-bold">
                  {stats.totalParticipants}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">총 참여자</p>
              </div>
            </CardContent>
          </Card>

          {/* 예정 이벤트 */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl leading-none font-bold">
                  {stats.upcoming}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">예정</p>
              </div>
            </CardContent>
          </Card>

          {/* 종료 이벤트 */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl leading-none font-bold">{stats.ended}</p>
                <p className="mt-1 text-xs text-muted-foreground">완료</p>
              </div>
            </CardContent>
          </Card>

          {/* 참여한 이벤트 — 마지막 카드이므로 col-span-2 */}
          <Card className="col-span-2">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                <UserCheck className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl leading-none font-bold">
                  {stats.participated}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  참여한 이벤트
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 내가 주최한 이벤트 섹션 */}
      <section className="border-t p-4">
        <h2 className="mb-3 text-base font-semibold">내가 만든 이벤트</h2>

        {myEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {myEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} isOwner />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="아직 만든 이벤트가 없어요" />
        )}
      </section>

      {/* 내가 참여한 이벤트 섹션 */}
      <section className="border-t p-4">
        <h2 className="mb-3 text-base font-semibold">내가 참여한 이벤트</h2>

        {participatedEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {participatedEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <EventCard event={event} isOwner={false} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="아직 참여한 이벤트가 없어요"
            description="초대 링크를 받으면 이벤트에 참여할 수 있어요"
          />
        )}
      </section>

      {/* 하단 액션 섹션 */}
      <section className="border-t p-4">
        <LogoutButton />
      </section>
    </main>
  )
}
