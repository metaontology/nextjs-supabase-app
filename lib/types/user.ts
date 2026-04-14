// 사용자 관련 타입 정의
// TODO: Task 007 (DB 스키마 확정) 이후 database.types.ts 기반 실제 타입으로 교체 예정

/** 사용자 권한 */
export type UserRole = 'user' | 'admin'

/** 사용자 프로필 (profiles 테이블 기반) */
export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  website: string | null
  role: UserRole
  created_at: string
  updated_at: string
}
