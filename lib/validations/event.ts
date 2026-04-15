import { z } from 'zod'

// 이벤트 생성/수정 공용 Zod 스키마
export const EventFormSchema = z.object({
  title: z.string().min(2, '제목은 2자 이상이어야 합니다'),
  description: z.string().optional(),
  date: z.string().min(1, '날짜를 선택해주세요'),
  location: z.string().min(2, '장소는 2자 이상이어야 합니다'),
  maxParticipants: z.number().int().min(1).max(100).optional(),
})

export type EventFormValues = z.infer<typeof EventFormSchema>
