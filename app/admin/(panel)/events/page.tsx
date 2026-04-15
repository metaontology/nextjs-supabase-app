export const dynamic = 'force-dynamic'

// 관리자 이벤트 관리 — /admin/events
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'

import { AdminEventTable } from '@/components/admin/admin-event-table'
import { getAdminEventRows } from '@/lib/data/dummy'
import { createClient } from '@/lib/supabase/server'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/admin/login')

  // 더미 데이터에서 이벤트 테이블 행 조회
  // TODO: Task 011 — 실제 Supabase 쿼리로 교체 예정
  const rows = getAdminEventRows()

  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">이벤트 관리</h1>
      <AdminEventTable rows={rows} />
    </main>
  )
}
