export const dynamic = 'force-dynamic'

// 이벤트 생성 페이지 — /events/new
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { EventCreateForm } from '@/components/event-create-form'

export default async function EventNewPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-6 p-4">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-2">
        <Link
          href="/events"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-foreground">이벤트 만들기</h1>
      </div>

      {/* 이벤트 생성 폼 */}
      <EventCreateForm />
    </main>
  )
}
