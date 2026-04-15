export const dynamic = 'force-dynamic'

// 이벤트 수정 페이지 — /events/:id/edit
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getDummyEventById } from '@/lib/data/dummy'
import { isoToDatetimeLocal } from '@/lib/utils'
import { EventEditForm } from '@/components/event-edit-form'

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  // 더미 데이터에서 이벤트 조회 — 없으면 404 처리
  const event = getDummyEventById(id)
  if (!event) notFound()

  // EventEditForm에 전달할 기본값 구성
  const defaultValues = {
    title: event.title,
    description: event.description ?? undefined,
    date: isoToDatetimeLocal(event.date),
    location: event.location,
    maxParticipants: event.max_participants ?? undefined,
  }

  return (
    <main className="flex flex-col gap-6 p-4">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-2">
        <Link
          href={'/events/' + id}
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-foreground">이벤트 수정</h1>
      </div>

      {/* 이벤트 수정 폼 */}
      <EventEditForm defaultValues={defaultValues} eventId={id} />
    </main>
  )
}
