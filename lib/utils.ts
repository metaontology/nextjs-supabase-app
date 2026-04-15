import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// ISO 8601 날짜 문자열을 한국어 형식으로 포맷
// timeZone: 'UTC' 고정 + hour12: false(24시간제)로 서버/클라이언트 Hydration 불일치 방지
// Node.js ICU와 브라우저 ICU의 AM/PM 표기 차이를 24시간제로 회피
export function formatEventDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(date)
}

// ISO 8601 날짜 문자열을 datetime-local input 호환 형식(YYYY-MM-DDTHH:mm)으로 변환
export function isoToDatetimeLocal(isoString: string): string {
  const date = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
