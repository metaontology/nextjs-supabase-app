// Gather 플랫폼 타입 정의 인덱스
// - event.ts     : 이벤트, 참여자 도메인 타입 (임시 — Task 007에서 DB 타입으로 교체)
// - user.ts      : 사용자, 프로필 타입 (임시 — Task 007에서 DB 타입으로 교체)
// - api.ts       : API 응답 공통 타입
// - component.ts : UI 컴포넌트 Props 타입 (NavItem 등)
// - form.ts      : 폼 데이터 및 오류 타입
// - ui.ts        : 전역 UI 상태 타입 (Toast, Modal, LoadingState)
// - admin.ts     : 관리자 대시보드 전용 타입 (임시 — Task 011에서 Supabase 쿼리로 교체)
export * from './event'
export * from './user'
export * from './api'
export * from './component'
export * from './form'
export * from './ui'
export * from './admin'
