export const dynamic = 'force-dynamic'

// 이벤트 상세 페이지 — /events/:id
import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { ChevronLeft, Calendar, MapPin, Pencil } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import {
  getDummyEventById,
  getDummyParticipantsByEventId,
  isDummyParticipant,
} from '@/lib/data/dummy'
import { formatEventDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ParticipantCard } from '@/components/participant-card'
import { EmptyState } from '@/components/empty-state'
import { InviteLinkButton } from '@/components/invite-link-button'
import type { EventStatus } from '@/lib/types/event'

// 더미 데이터 단계에서 주최자 확인에 사용할 고정 사용자 ID
const DUMMY_OWNER_ID = 'user-1'

/** 이벤트 상태별 Badge 설정 */
const STATUS_BADGE_CONFIG: Record<
  EventStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  upcoming: { label: '예정', variant: 'default' },
  ongoing: { label: '진행중', variant: 'secondary' },
  ended: { label: '종료', variant: 'outline' },
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // 인증 체크 — 미인증 사용자는 로그인 페이지로 리디렉션
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  // 이벤트 데이터 로드
  const event = getDummyEventById(id)
  if (!event) notFound()

  // 참여자 목록 로드
  const participants = getDummyParticipantsByEventId(id)

  // 주최자 여부 판단
  const isOwner = event.created_by === DUMMY_OWNER_ID

  // 참여자 여부 판단 (주최자 여부와 독립적으로 확인)
  const isParticipant = isDummyParticipant(id, DUMMY_OWNER_ID)

  const { label: statusLabel, variant: statusVariant } =
    STATUS_BADGE_CONFIG[event.status]

  return (
    <div className="flex flex-col">
      {/* 상단 헤더 — 돌아가기 링크 + 제목 + 수정 버튼 */}
      <header className="flex items-center gap-2 p-4">
        <Link
          href="/events"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          돌아가기
        </Link>

        <h1 className="flex-1 truncate text-center text-lg font-semibold text-foreground">
          {event.title}
        </h1>

        {/* 주최자 전용 수정 링크 */}
        {isOwner && (
          <Link
            href={`/events/${id}/edit`}
            aria-label="이벤트 수정"
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil size={18} aria-hidden="true" />
          </Link>
        )}
      </header>

      {/* 커버 이미지 영역 */}
      {event.cover_image_url ? (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      ) : (
        <div className="h-48 bg-muted" aria-hidden="true" />
      )}

      {/* 이벤트 정보 섹션 */}
      <section className="flex flex-col gap-3 p-4">
        {/* 상태 배지 */}
        <Badge variant={statusVariant} className="w-fit">
          {statusLabel}
        </Badge>

        {/* 이벤트 제목 */}
        <h2 className="text-xl font-bold text-foreground">{event.title}</h2>

        {/* 날짜 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} aria-hidden="true" />
          <span>{formatEventDate(event.date)}</span>
        </div>

        {/* 장소 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} aria-hidden="true" />
          <span>{event.location}</span>
        </div>

        {/* 설명 — 있을 때만 표시 */}
        {event.description && (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        )}
      </section>

      {/* 주최자 전용 섹션 — 초대 링크 복사, 수정/삭제 버튼 */}
      {isOwner && (
        <section className="flex flex-col gap-3 border-t p-4">
          <InviteLinkButton inviteCode={event.invite_code} />

          <div className="flex gap-2">
            {/* 수정 버튼 */}
            <Button variant="outline" asChild>
              <Link href={`/events/${id}/edit`}>수정</Link>
            </Button>

            {/* 삭제 버튼 — 더미 단계에서는 비활성 */}
            <Button variant="destructive" disabled>
              삭제
            </Button>
          </div>
        </section>
      )}

      {/* 참여자 전용 섹션 — 참여 취소 버튼 (더미 단계 비활성) */}
      {!isOwner && isParticipant && (
        <section className="flex flex-col gap-3 border-t p-4">
          <p className="text-sm text-muted-foreground">
            참여 중인 이벤트입니다
          </p>
          <Button variant="outline" disabled>
            참여 취소 (추후 지원 예정)
          </Button>
        </section>
      )}

      {/* 참여자 섹션 */}
      <section className="flex flex-col gap-3 border-t p-4">
        <h2 className="text-base font-semibold text-foreground">
          참여자 {participants.length}명
        </h2>

        {participants.length === 0 ? (
          // 참여자 없을 때 빈 상태 안내
          <EmptyState title="아직 참여자가 없어요" />
        ) : (
          // 참여자 목록
          <div className="flex flex-col gap-3">
            {participants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
