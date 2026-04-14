// 관리자 대시보드용 타입 정의
// Task 006: 더미 데이터로 먼저 사용
// TODO: Task 011에서 실제 Supabase 쿼리 기반 데이터로 교체 예정
// ⚠️ camelCase 필드명(ownerName, createdAt 등)은 Supabase 자동 생성 snake_case와 다름.
//    Task 007 DB 타입 교체 시 변환 레이어(transform) 또는 DB 별칭(alias) 처리 필요.

import type { EventStatus } from '@/lib/types/event'
import type { UserRole } from '@/lib/types/user'

/**
 * 관리자 대시보드 통계 요약
 * TODO: Task 011에서 실제 Supabase 집계 쿼리로 교체 예정 (현재 더미 데이터)
 */
export interface AdminStats {
  /** 전체 이벤트 수 */
  totalEvents: number
  /** 전체 사용자 수 */
  totalUsers: number
  /** 활성 이벤트 수 (upcoming + ongoing) */
  activeEvents: number
  /** 전체 참여자 수 */
  totalParticipants: number
  /** 최근 이벤트 수 (최근 30일 기준) */
  recentEventsCount: number
}

/** 이벤트 테이블 행 (관리자용) */
export interface EventTableRow {
  /** 이벤트 고유 ID */
  id: string
  /** 이벤트 제목 */
  title: string
  /** 이벤트 주최자 이름 */
  ownerName: string
  /** 이벤트 주최자 이메일 */
  ownerEmail: string
  /** 이벤트 날짜 (ISO 문자열) */
  date: string
  /** 이벤트 장소 */
  location: string
  /** 현재 참여자 수 */
  participantCount: number
  /** 이벤트 상태 */
  status: EventStatus
  /** 이벤트 생성 시각 (ISO 문자열) */
  createdAt: string
}

/** 사용자 테이블 행 (관리자용) */
export interface UserTableRow {
  /** 사용자 고유 ID */
  id: string
  /** 사용자 이메일 */
  email: string
  /** 사용자 전체 이름 */
  fullName: string | null
  /** 프로필 이미지 URL */
  avatarUrl: string | null
  /** 사용자 권한 */
  role: UserRole
  /** 주최한 이벤트 수 */
  eventCount: number
  /** 참여한 이벤트 수 */
  joinedEventCount: number
  /** 가입 시각 (ISO 문자열) */
  createdAt: string
}

/** 관리자 테이블 공통 필터 */
export interface AdminTableFilters {
  /** 검색어 (제목, 이름, 이메일 등) */
  search?: string
  /** 현재 페이지 번호 (1 시작) */
  page: number
  /** 페이지당 항목 수 */
  pageSize: number
  /** 정렬 기준 컬럼 */
  sortBy?: string
  /** 정렬 방향 */
  sortOrder?: 'asc' | 'desc'
}

/** 이벤트 테이블 필터 */
export interface EventTableFilters extends AdminTableFilters {
  /** 이벤트 상태 필터 */
  status?: EventStatus
  /** 이벤트 테이블 정렬 기준 컬럼 */
  sortBy?: keyof EventTableRow
}

/** 사용자 테이블 필터 */
export interface UserTableFilters extends AdminTableFilters {
  /** 사용자 권한 필터 */
  role?: UserRole
  /** 사용자 테이블 정렬 기준 컬럼 */
  sortBy?: keyof UserTableRow
}
