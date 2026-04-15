// Phase 2 UI 개발용 더미 데이터 유틸리티
// TODO: Task 007 (DB 스키마 확정) 이후 실제 Supabase 쿼리로 교체 예정

import type {
  Event,
  EventParticipant,
  EventWithParticipants,
} from '@/lib/types/event'
import type { UserProfile } from '@/lib/types/user'
import type { AdminStats, EventTableRow, UserTableRow } from '@/lib/types/admin'

// ---------------------------------------------------------------------------
// 상수 데이터
// ---------------------------------------------------------------------------

/** 더미 사용자 프로필 (3명) */
export const DUMMY_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    email: 'alice@example.com',
    full_name: '김앨리스',
    // pravatar.cc — ?u= 파라미터로 이메일 기반 결정적 아바타 생성
    avatar_url: 'https://i.pravatar.cc/150?u=alice@example.com',
    bio: null,
    website: null,
    role: 'user',
    created_at: '2026-01-10T09:00:00Z',
    updated_at: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-2',
    email: 'bob@example.com',
    full_name: '이밥',
    avatar_url: 'https://i.pravatar.cc/150?u=bob@example.com',
    bio: null,
    website: null,
    role: 'user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-3',
    email: 'carol@example.com',
    full_name: '박캐롤',
    avatar_url: 'https://i.pravatar.cc/150?u=carol@example.com',
    bio: null,
    website: null,
    role: 'user',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
  },
]

/** 더미 이벤트 (4개 — upcoming 2개, ongoing, ended 각 1개) */
export const DUMMY_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: '2026 봄 팀 워크숍',
    description:
      '팀원들과 함께하는 분기별 워크숍입니다. 아이디어를 나누고 협업 방식을 개선합니다.',
    date: '2026-06-15T10:00:00Z',
    location: '서울 강남구 테헤란로 123',
    invite_code: 'SPRING26',
    // picsum.photos — seed 값으로 이벤트별 결정적 커버 이미지 생성
    cover_image_url: 'https://picsum.photos/seed/event-1/800/400',
    max_participants: 20,
    status: 'upcoming',
    created_by: 'user-1',
    created_at: '2026-04-01T09:00:00Z',
    updated_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'event-2',
    title: '4월 정기 해커톤',
    description:
      '매월 진행되는 사내 해커톤. 24시간 동안 새로운 기능을 프로토타이핑합니다.',
    date: '2026-04-14T09:00:00Z',
    location: '서울 마포구 공덕동 456',
    invite_code: 'HACK0426',
    cover_image_url: 'https://picsum.photos/seed/event-2/800/400',
    max_participants: 30,
    status: 'ongoing',
    created_by: 'user-1',
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'event-3',
    title: '3월 네트워킹 밋업',
    description:
      '다양한 직군의 멤버들이 모여 경험과 인사이트를 공유하는 네트워킹 행사입니다.',
    date: '2026-03-20T18:00:00Z',
    location: '서울 종로구 청계천로 789',
    invite_code: 'NET0326',
    cover_image_url: 'https://picsum.photos/seed/event-3/800/400',
    max_participants: 50,
    status: 'ended',
    created_by: 'user-1',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-21T09:00:00Z',
  },
  {
    id: 'event-4',
    title: '5월 독서 모임',
    description: '함께 책을 읽고 생각을 나누는 월간 독서 모임입니다.',
    date: '2026-05-25T14:00:00Z',
    location: '서울 서초구 반포대로 200',
    invite_code: 'READ0526',
    cover_image_url: 'https://picsum.photos/seed/event-4/800/400',
    max_participants: 15,
    status: 'upcoming',
    // user-2(이밥)가 주최자
    created_by: 'user-2',
    created_at: '2026-04-10T09:00:00Z',
    updated_at: '2026-04-10T09:00:00Z',
  },
]

/** 참여자 프로필 조인 타입 */
type ParticipantWithProfile = EventParticipant & {
  profile: Pick<UserProfile, 'full_name' | 'avatar_url'>
}

/** 더미 이벤트 참여자 (이벤트별 2~3명) */
export const DUMMY_PARTICIPANTS: ParticipantWithProfile[] = [
  // event-1 참여자 (2명)
  {
    id: 'part-1-1',
    event_id: 'event-1',
    user_id: 'user-1',
    joined_at: '2026-04-02T09:00:00Z',
    profile: {
      full_name: '김앨리스',
      avatar_url: 'https://i.pravatar.cc/150?u=alice@example.com',
    },
  },
  {
    id: 'part-1-2',
    event_id: 'event-1',
    user_id: 'user-2',
    joined_at: '2026-04-03T10:00:00Z',
    profile: {
      full_name: '이밥',
      avatar_url: 'https://i.pravatar.cc/150?u=bob@example.com',
    },
  },
  // event-2 참여자 (3명)
  {
    id: 'part-2-1',
    event_id: 'event-2',
    user_id: 'user-1',
    joined_at: '2026-04-05T09:00:00Z',
    profile: {
      full_name: '김앨리스',
      avatar_url: 'https://i.pravatar.cc/150?u=alice@example.com',
    },
  },
  {
    id: 'part-2-2',
    event_id: 'event-2',
    user_id: 'user-2',
    joined_at: '2026-04-06T11:00:00Z',
    profile: {
      full_name: '이밥',
      avatar_url: 'https://i.pravatar.cc/150?u=bob@example.com',
    },
  },
  {
    id: 'part-2-3',
    event_id: 'event-2',
    user_id: 'user-3',
    joined_at: '2026-04-07T14:00:00Z',
    profile: {
      full_name: '박캐롤',
      avatar_url: 'https://i.pravatar.cc/150?u=carol@example.com',
    },
  },
  // event-3 참여자 (2명)
  {
    id: 'part-3-1',
    event_id: 'event-3',
    user_id: 'user-2',
    joined_at: '2026-03-05T09:00:00Z',
    profile: {
      full_name: '이밥',
      avatar_url: 'https://i.pravatar.cc/150?u=bob@example.com',
    },
  },
  {
    id: 'part-3-2',
    event_id: 'event-3',
    user_id: 'user-3',
    joined_at: '2026-03-06T10:00:00Z',
    profile: {
      full_name: '박캐롤',
      avatar_url: 'https://i.pravatar.cc/150?u=carol@example.com',
    },
  },
  // event-4 참여자 (2명) — user-1(김앨리스)은 참여자, user-2(이밥)는 주최자이자 참여자
  {
    id: 'part-4-1',
    event_id: 'event-4',
    user_id: 'user-1',
    joined_at: '2026-04-11T10:00:00Z',
    profile: {
      full_name: '김앨리스',
      avatar_url: 'https://i.pravatar.cc/150?u=alice@example.com',
    },
  },
  {
    id: 'part-4-2',
    event_id: 'event-4',
    user_id: 'user-2',
    joined_at: '2026-04-10T09:00:00Z',
    profile: {
      full_name: '이밥',
      avatar_url: 'https://i.pravatar.cc/150?u=bob@example.com',
    },
  },
]

// ---------------------------------------------------------------------------
// 조회 함수
// ---------------------------------------------------------------------------

/** 전체 이벤트 목록 반환 */
export function getDummyEvents(): Event[] {
  return DUMMY_EVENTS
}

/**
 * ID로 이벤트 상세 조회
 * @param id - 이벤트 ID
 * @returns 참여자 목록이 포함된 이벤트, 없으면 undefined
 */
export function getDummyEventById(
  id: string,
): EventWithParticipants | undefined {
  const event = DUMMY_EVENTS.find((e) => e.id === id)
  if (!event) return undefined

  const participants = DUMMY_PARTICIPANTS.filter((p) => p.event_id === id)

  return {
    ...event,
    participants,
    participant_count: participants.length,
  }
}

/**
 * 이벤트 ID로 참여자 목록 조회
 * @param eventId - 이벤트 ID
 * @returns 해당 이벤트의 참여자 + 프로필 배열
 */
export function getDummyParticipantsByEventId(
  eventId: string,
): ParticipantWithProfile[] {
  return DUMMY_PARTICIPANTS.filter((p) => p.event_id === eventId)
}

/**
 * 특정 사용자가 주최한 이벤트들의 총 참여자 수 합산
 * @param userId - 주최자 user ID
 * @returns 총 참여자 수
 */
export function getDummyTotalParticipantCount(userId: string): number {
  const myEventIds = DUMMY_EVENTS.filter((e) => e.created_by === userId).map(
    (e) => e.id,
  )
  return DUMMY_PARTICIPANTS.filter((p) => myEventIds.includes(p.event_id))
    .length
}

/**
 * 초대 코드로 이벤트 조회
 * @param code - 초대 코드 문자열
 * @returns 참여자 목록이 포함된 이벤트, 없으면 undefined
 */
export function getDummyEventByInviteCode(
  code: string,
): EventWithParticipants | undefined {
  const event = DUMMY_EVENTS.find((e) => e.invite_code === code)
  if (!event) return undefined
  return getDummyEventById(event.id)
}

/**
 * 특정 사용자가 참여한 이벤트 목록 (직접 주최한 이벤트 제외)
 * @param userId - 조회할 사용자 ID
 * @returns 해당 사용자가 참여자로 등록된 이벤트 배열 (주최자 제외)
 */
export function getDummyParticipatedEvents(userId: string): Event[] {
  const participatedEventIds = DUMMY_PARTICIPANTS.filter(
    (p) => p.user_id === userId,
  ).map((p) => p.event_id)
  return DUMMY_EVENTS.filter(
    (e) => participatedEventIds.includes(e.id) && e.created_by !== userId,
  )
}

/**
 * 특정 이벤트에 사용자가 참여 중인지 확인
 * @param eventId - 이벤트 ID
 * @param userId - 사용자 ID
 * @returns 참여 중이면 true, 아니면 false
 */
export function isDummyParticipant(eventId: string, userId: string): boolean {
  return DUMMY_PARTICIPANTS.some(
    (p) => p.event_id === eventId && p.user_id === userId,
  )
}

// ---------------------------------------------------------------------------
// 관리자 대시보드용 집계 함수
// ---------------------------------------------------------------------------

/**
 * 관리자 대시보드 통계 요약 반환
 * - totalEvents: 전체 이벤트 수
 * - totalUsers: 전체 사용자 수
 * - activeEvents: upcoming + ongoing 이벤트 수
 * - totalParticipants: 전체 참여자 레코드 수
 * - recentEventsCount: 최근 30일 이내 생성된 이벤트 수
 */
export function getAdminStats(): AdminStats {
  const now = new Date()
  // 30일 전 기준 날짜 계산
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    totalEvents: DUMMY_EVENTS.length,
    totalUsers: DUMMY_PROFILES.length,
    activeEvents: DUMMY_EVENTS.filter(
      (e) => e.status === 'upcoming' || e.status === 'ongoing',
    ).length,
    totalParticipants: DUMMY_PARTICIPANTS.length,
    recentEventsCount: DUMMY_EVENTS.filter(
      (e) => new Date(e.created_at) >= thirtyDaysAgo,
    ).length,
  }
}

/**
 * 관리자용 이벤트 테이블 행 목록 반환
 * - 각 이벤트에 주최자 이름/이메일, 참여자 수를 포함
 */
export function getAdminEventRows(): EventTableRow[] {
  return DUMMY_EVENTS.map((e) => {
    // created_by ID로 주최자 프로필 조회
    const owner = DUMMY_PROFILES.find((u) => u.id === e.created_by)
    // 해당 이벤트의 참여자 수 집계
    const participantCount = DUMMY_PARTICIPANTS.filter(
      (p) => p.event_id === e.id,
    ).length

    return {
      id: e.id,
      title: e.title,
      ownerName: owner?.full_name ?? '알 수 없음',
      ownerEmail: owner?.email ?? '',
      date: e.date,
      location: e.location,
      participantCount,
      status: e.status,
      createdAt: e.created_at,
    }
  })
}

/**
 * 관리자용 사용자 테이블 행 목록 반환
 * - 각 사용자에 주최한 이벤트 수, 참여한 이벤트 수를 포함
 */
export function getAdminUserRows(): UserTableRow[] {
  return DUMMY_PROFILES.map((u) => {
    // 해당 사용자가 주최한 이벤트 수
    const eventCount = DUMMY_EVENTS.filter((e) => e.created_by === u.id).length
    // 해당 사용자가 참여자로 등록된 이벤트 수
    const joinedEventCount = DUMMY_PARTICIPANTS.filter(
      (p) => p.user_id === u.id,
    ).length

    return {
      id: u.id,
      email: u.email ?? '',
      fullName: u.full_name,
      avatarUrl: u.avatar_url,
      role: u.role,
      eventCount,
      joinedEventCount,
      createdAt: u.created_at,
    }
  })
}

/**
 * 관리자 대시보드 차트용 최근 6개월 더미 데이터 반환
 * - name: 월 이름 (1월~6월)
 * - events: 해당 월의 이벤트 수 (하드코딩)
 * - users: 해당 월의 신규 사용자 수 (하드코딩)
 * TODO: Task 011에서 실제 집계 쿼리로 교체 예정
 */
export function getAdminChartData(): {
  name: string
  events: number
  users: number
}[] {
  return [
    { name: '1월', events: 2, users: 5 },
    { name: '2월', events: 3, users: 8 },
    { name: '3월', events: 5, users: 12 },
    { name: '4월', events: 4, users: 9 },
    { name: '5월', events: 6, users: 15 },
    { name: '6월', events: 7, users: 18 },
  ]
}
