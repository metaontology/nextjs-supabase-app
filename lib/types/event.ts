// 이벤트 도메인 타입 — database.types.ts 기반 type alias
import type { Database } from './database.types'

/** events 테이블 Row 타입 */
export type Event = Database['public']['Tables']['events']['Row']

/** events 테이블 Insert 타입 */
export type EventInsert = Database['public']['Tables']['events']['Insert']

/** events 테이블 Update 타입 */
export type EventUpdate = Database['public']['Tables']['events']['Update']

/** event_participants 테이블 Row 타입 */
export type EventParticipant =
  Database['public']['Tables']['event_participants']['Row']

/** event_participants 테이블 Insert 타입 */
export type EventParticipantInsert =
  Database['public']['Tables']['event_participants']['Insert']

/**
 * 이벤트 상태 — DB에서는 CHECK 제약으로만 사용하며 Enum이 아니므로 TypeScript 타입으로 유지
 */
export type EventStatus = 'upcoming' | 'ongoing' | 'ended'

/**
 * 참여자 목록 포함 이벤트 — JOIN 결과용 확장 타입
 * events 테이블 Row를 베이스로 participants(참여자 배열)와 participant_count(참여자 수) 추가
 */
export interface EventWithParticipants extends Event {
  participants: EventParticipant[]
  participant_count: number
}
