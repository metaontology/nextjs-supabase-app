export const dynamic = 'force-dynamic'

// 이벤트 생성 페이지 — /events/new
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function EventNewPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">이벤트 만들기</h1>
      {/* TODO: Task 004 — EventCreateForm Client Component */}
    </main>
  )
}
