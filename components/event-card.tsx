'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatEventDate } from '@/lib/utils'
import { MapPin, Calendar, MoreVertical } from 'lucide-react'
import type { EventCardProps } from '@/lib/types/component'
import type { EventStatus } from '@/lib/types/event'

/** 이벤트 상태별 Badge 설정 */
const STATUS_BADGE_CONFIG: Record<
  EventStatus,
  { variant: 'default' | 'secondary' | 'outline'; label: string }
> = {
  upcoming: { variant: 'default', label: '예정' },
  ongoing: { variant: 'secondary', label: '진행중' },
  ended: { variant: 'outline', label: '종료' },
}

export function EventCard({ event, isOwner, className }: EventCardProps) {
  // DB의 status는 string 타입이므로 EventStatus로 단언하여 Badge 설정 조회
  const badgeConfig = STATUS_BADGE_CONFIG[event.status as EventStatus]

  return (
    <Card className={cn('overflow-hidden', className)}>
      {/* 커버 이미지 영역 */}
      <div className="relative h-40 bg-muted">
        {event.cover_image_url && (
          <Image
            src={event.cover_image_url}
            alt={`${event.title} 커버 이미지`}
            fill
            className="object-cover"
          />
        )}
      </div>

      <CardContent className="p-4">
        {/* 상태 배지 + 주최자 메뉴 버튼 */}
        <div className="flex items-center justify-between">
          <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
          {isOwner && (
            <button
              type="button"
              onClick={() => {}}
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="이벤트 관리 메뉴"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 이벤트 제목 */}
        <p className="mt-2 text-base font-semibold text-foreground">
          {event.title}
        </p>

        {/* 날짜 */}
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{formatEventDate(event.event_date)}</span>
        </div>

        {/* 장소 */}
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{event.location}</span>
        </div>
      </CardContent>
    </Card>
  )
}
