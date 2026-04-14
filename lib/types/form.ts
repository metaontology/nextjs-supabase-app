// 이벤트 폼 관련 타입 정의
// react-hook-form 미설치 상태 (Task 004 이전)이므로 순수 데이터 타입으로 유지

/** 이벤트 생성 폼 데이터 */
export interface EventCreateFormData {
  /** 이벤트 제목 */
  title: string
  /** 이벤트 설명 (선택) */
  description?: string
  /** 이벤트 날짜 (ISO 8601 형식) */
  date: string
  /** 이벤트 장소 */
  location: string
  /** 최대 참여 인원 (선택) */
  maxParticipants?: number
  /** 커버 이미지 파일 (선택) */
  coverImage?: File
}

/**
 * 이벤트 수정 폼 데이터 — 커버 이미지를 제외한 모든 필드 선택적
 * @warning Partial 적용으로 빈 객체 {}가 타입 레벨에서 유효함.
 *          Task 004에서 zod 스키마 도입 후 런타임 검증으로 보완 예정.
 */
export type EventEditFormData = Partial<
  Omit<EventCreateFormData, 'coverImage'>
> & {
  /** 커버 이미지 파일 (선택) */
  coverImage?: File
}

/** 단일 폼 필드 오류 */
export interface FormFieldError {
  /** 오류가 발생한 필드명 */
  field: string
  /** 오류 메시지 */
  message: string
}

/** EventCreateFormData 필드별 오류 메시지 맵 */
export type FormErrors = Partial<Record<keyof EventCreateFormData, string>>
