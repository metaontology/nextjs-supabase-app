export const dynamic = 'force-dynamic'

// 초대 링크 참여 페이지 — /invite/:code
import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import {
  getDummyEventByInviteCode,
  getDummyParticipantsByEventId,
  isDummyParticipant,
} from '@/lib/data/dummy'
import { formatEventDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// 이벤트 상태별 Badge 설정
const STATUS_CONFIG = {
  upcoming: { label: '예정', variant: 'default' as const },
  ongoing: { label: '진행중', variant: 'secondary' as const },
  ended: { label: '종료', variant: 'outline' as const },
}

// 더미 데이터 기준 현재 로그인 사용자 ID
const DUMMY_USER_ID = 'user-1'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  // 인증 체크 — 미인증 사용자는 로그인 페이지로 리디렉션
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect(`/auth/login?next=/invite/${code}`)

  // 초대 코드로 이벤트 조회 — 없으면 404
  const event = getDummyEventByInviteCode(code)
  if (!event) notFound()

  // 참여자 현황 및 현재 사용자 참여 여부 확인
  const participants = getDummyParticipantsByEventId(event.id)
  const participantCount = participants.length
  const alreadyJoined = isDummyParticipant(event.id, DUMMY_USER_ID)

  const statusConfig = STATUS_CONFIG[event.status]

  return (
    <main className="mx-auto max-w-lg">
      {/* 커버 이미지 영역 */}
      <div className="relative h-48 w-full bg-muted">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          // 커버 이미지 없을 때 fallback
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">이미지 없음</span>
          </div>
        )}
      </div>

      {/* 이벤트 정보 섹션 */}
      <div className="flex flex-col gap-4 p-4">
        {/* 상태 Badge */}
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>

        {/* 이벤트 제목 */}
        <h1 className="text-xl font-bold text-foreground">{event.title}</h1>

        {/* 날짜 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span>{formatEventDate(event.date)}</span>
        </div>

        {/* 장소 */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        )}

        {/* 설명 */}
        {event.description && (
          <p className="text-sm text-foreground">{event.description}</p>
        )}

        {/* 참여자 현황 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 shrink-0" />
          <span>
            현재 {participantCount}명 참여 중
            {event.max_participants != null &&
              ` / 최대 ${event.max_participants}명`}
          </span>
        </div>
      </div>

      {/* 하단 액션 섹션 */}
      <div className="flex flex-col gap-3 border-t border-border p-4">
        {alreadyJoined ? (
          // 이미 참여 중인 경우
          <>
            <Badge variant="secondary" className="w-fit">
              이미 참여 중
            </Badge>
            <Button asChild>
              <Link href={`/events/${event.id}`}>이벤트 상세 보기</Link>
            </Button>
          </>
        ) : (
          // 미참여 상태 — 참여 기능 미지원 안내
          <>
            <Button disabled>참여하기 (추후 지원 예정)</Button>
            <p className="text-xs text-muted-foreground">
              실제 참여 기능은 추후 업데이트 예정입니다.
            </p>
          </>
        )}
      </div>
    </main>
  )
}
