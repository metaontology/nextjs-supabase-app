export const dynamic = 'force-dynamic'

// 관리자 통계 분석 — /admin/stats
// TODO: Task 006 — Recharts 차트 컴포넌트 (Task 006에서 설치 예정)
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground">통계 분석</h1>
      {/* TODO: Task 006 — Recharts 차트 컴포넌트 */}
    </main>
  )
}
