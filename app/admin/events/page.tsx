export const dynamic = 'force-dynamic'

// 관리자 이벤트 관리 — /admin/events
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">이벤트 관리</h1>
      {/* TODO: Task 006 — 이벤트 관리 테이블 컴포넌트 */}
    </main>
  )
}
