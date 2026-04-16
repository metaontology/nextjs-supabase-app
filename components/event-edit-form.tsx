'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { EventFormSchema, type EventFormValues } from '@/lib/validations/event'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EventEditFormProps {
  /** 수정할 이벤트의 기존 값 */
  defaultValues: EventFormValues
  /** 수정 대상 이벤트 ID */
  eventId: string
}

// 이벤트 수정 폼 컴포넌트
export function EventEditForm({ defaultValues, eventId }: EventEditFormProps) {
  const router = useRouter()

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues,
  })

  const { isSubmitting } = form.formState

  // 폼 제출 핸들러
  async function onSubmit(data: EventFormValues) {
    console.log(data)
    toast.success('이벤트가 수정되었습니다')
    router.push('/events/' + eventId)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 제목 필드 */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 제목을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 설명 필드 (선택) */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명 (선택)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="이벤트 설명을 입력하세요"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 날짜/시간 필드 */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>날짜 및 시간</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 장소 필드 */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>장소</FormLabel>
              <FormControl>
                <Input placeholder="이벤트 장소를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 최대 참가자 수 필드 (선택) */}
        <FormField
          control={form.control}
          name="maxParticipants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>최대 참가자 수 (선택)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1 ~ 100"
                  min={1}
                  max={100}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    // 빈 문자열이면 undefined, 숫자면 number로 변환
                    const val = e.target.value
                    field.onChange(val === '' ? undefined : Number(val))
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? '수정 중...' : '수정 완료'}
        </Button>
      </form>
    </Form>
  )
}
