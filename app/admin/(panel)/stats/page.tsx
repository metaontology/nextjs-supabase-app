export const dynamic = 'force-dynamic'

// 관리자 통계 분석 — /admin/stats
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'

import { AdminCharts } from '@/components/admin/admin-charts'
import { AdminStatsCards } from '@/components/admin/admin-stats-cards'
import { createClient } from '@/lib/supabase/server'
import { getAdminChartData, getAdminStats } from '@/lib/data/dummy'

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/admin/login')

  // 통계 요약 및 차트 데이터 조회
  const stats = getAdminStats()
  const chartData = getAdminChartData()

  return (
    <main className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">통계 분석</h1>

      {/* 상단 통계 요약 카드 */}
      <AdminStatsCards stats={stats} />

      {/* 차트 영역 */}
      <AdminCharts chartData={chartData} />
    </main>
  )
}
