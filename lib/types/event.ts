// 이벤트 관련 임시 프론트엔드 타입 정의
// TODO: Task 007 (DB 스키마 확정) 이후 database.types.ts 기반 실제 타입으로 교체 예정

/** 이벤트 상태 */
export type EventStatus = 'upcoming' | 'ongoing' | 'ended'

/** 이벤트 */
export interface Event {
  id: string
  title: string
  description: string | null
  /** 이벤트 날짜 및 시간 (ISO 8601 형식, UTC) */
  date: string
  location: string
  invite_code: string
  cover_image_url: string | null
  max_participants: number | null
  status: EventStatus
  created_by: string
  created_at: string
  updated_at: string
}

/** 이벤트 참여자 */
export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  joined_at: string
}

/** 참여자 목록 포함 이벤트 */
export interface EventWithParticipants extends Event {
  participants: EventParticipant[]
  participant_count: number
}
