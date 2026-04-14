// 공통 UI 컴포넌트 Props 타입 정의
import type { LucideIcon } from 'lucide-react'
import type { Event, EventParticipant } from '@/lib/types/event'
import type { UserProfile } from '@/lib/types/user'

/** 내비게이션 항목 타입 */
export interface NavItem {
  href: string
  label: string
  /** lucide-react 아이콘 컴포넌트 */
  icon: LucideIcon
}

/** 이벤트 카드 Props */
export interface EventCardProps {
  event: Event
  isOwner: boolean
  className?: string
}

/** 참여자 카드 Props */
export interface ParticipantCardProps {
  participant: EventParticipant & {
    profile: Pick<UserProfile, 'full_name' | 'avatar_url'>
  }
  className?: string
}

/** 빈 상태 안내 Props */
export interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  /** TODO: 액션 버튼 클릭 핸들러 구현 필요 */
  onAction?: () => void
  className?: string
}

/** 아바타 이미지 Props */
export interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
