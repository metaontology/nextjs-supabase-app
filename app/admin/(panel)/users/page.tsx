export const dynamic = 'force-dynamic'

// 관리자 사용자 관리 — /admin/users
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'

import { AdminUserTable } from '@/components/admin/admin-user-table'
import { getAdminUserRows } from '@/lib/data/dummy'
import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/admin/login')

  // 사용자 테이블 행 데이터 조회 (현재 더미, Task 011에서 실제 쿼리로 교체 예정)
  const rows = getAdminUserRows()

  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">사용자 관리</h1>
      <AdminUserTable rows={rows} />
    </main>
  )
}
