// API 응답 공통 타입 정의

/** 단일 API 응답 */
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

/** 페이지네이션 API 응답 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
