export const dynamic = 'force-dynamic'

// 내 이벤트 목록 페이지 — /events
// 주최자/참여자가 자신의 이벤트를 확인하는 메인 페이지
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">내 이벤트</h1>
      {/* TODO: Task 004 — 이벤트 목록 컴포넌트 */}
    </main>
  )
}
