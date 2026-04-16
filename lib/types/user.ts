// 사용자 도메인 타입 — database.types.ts 기반 type alias
import type { Database } from './database.types'

/** profiles 테이블 Row 타입 */
export type UserProfile = Database['public']['Tables']['profiles']['Row']

/**
 * 사용자 권한 — DB의 role 컬럼 값에 매핑
 * profiles 테이블의 role 컬럼은 string 타입이지만 애플리케이션에서는 이 값만 사용
 */
export type UserRole = 'user' | 'admin'
