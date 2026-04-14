// 전역 UI 상태 관련 타입 정의

/** 비동기 작업의 로딩 상태 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/** Toast 알림 스타일 variant */
export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

/** Toast 알림 메시지 */
export interface ToastMessage {
  /** 고유 식별자 — 생성 시 crypto.randomUUID() 사용 권장 */
  id: string
  /** 표시할 메시지 내용 */
  message: string
  /** Toast 스타일 variant */
  variant: ToastVariant
  /** 자동 닫힘 시간 (밀리초, 선택) */
  duration?: number
}

/** 모달 열림/닫힘 상태 */
export interface ModalState {
  /** 모달 열림 여부 */
  isOpen: boolean
  /** 모달 제목 (선택) */
  title?: string
  /** 모달 설명 (선택) */
  description?: string
}
