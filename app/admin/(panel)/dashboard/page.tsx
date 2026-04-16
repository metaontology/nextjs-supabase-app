export const dynamic = 'force-dynamic'

// 관리자 대시보드 메인 페이지 — /admin
// TODO: Task 008 — 관리자 권한(role='admin') 체크 추가 예정
import { redirect } from 'next/navigation'

import { AdminStatsCards } from '@/components/admin/admin-stats-cards'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAdminEventRows, getAdminStats } from '@/lib/data/dummy'
import { createClient } from '@/lib/supabase/server'
import type { EventStatus } from '@/lib/types/event'
import { formatEventDate } from '@/lib/utils'

/** 이벤트 상태별 Badge variant 매핑 */
function getStatusBadgeVariant(
  status: EventStatus,
): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'upcoming':
      return 'default'
    case 'ongoing':
      return 'secondary'
    case 'ended':
      return 'outline'
  }
}

/** 이벤트 상태 한국어 레이블 */
function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'upcoming':
      return '예정'
    case 'ongoing':
      return '진행중'
    case 'ended':
      return '종료'
  }
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/admin/login')

  // 통계 데이터와 최근 이벤트 목록을 병렬로 조회
  const [stats, eventRows] = await Promise.all([
    Promise.resolve(getAdminStats()),
    Promise.resolve(getAdminEventRows()),
  ])

  // 최근 5개 이벤트만 표시 (createdAt 기준 내림차순)
  const recentEvents = [...eventRows]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      {/* 페이지 제목 */}
      <h1 className="text-2xl font-bold text-foreground">관리자 대시보드</h1>

      {/* 통계 카드 4개 */}
      <AdminStatsCards stats={stats} />

      {/* 최근 이벤트 미니 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            최근 이벤트
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-6 py-3 font-medium text-muted-foreground">
                  제목
                </th>
                <th className="px-6 py-3 font-medium text-muted-foreground">
                  상태
                </th>
                <th className="px-6 py-3 font-medium text-muted-foreground">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr
                  key={event.id}
                  className="border-b transition-colors last:border-0 hover:bg-muted/50"
                >
                  <td className="px-6 py-3 font-medium text-foreground">
                    {event.title}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={getStatusBadgeVariant(event.status)}>
                      {getStatusLabel(event.status)}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {formatEventDate(event.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
