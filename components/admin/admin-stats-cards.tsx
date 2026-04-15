// 관리자 대시보드 통계 카드 컴포넌트 (Server Component)
// 총 이벤트, 총 사용자, 활성 이벤트, 총 참여자 4가지 지표를 카드 그리드로 표시

import { Calendar, CalendarCheck, UserCheck, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminStats } from '@/lib/types/admin'

interface AdminStatsCardsProps {
  stats: AdminStats
}

/** 통계 카드 항목 정의 */
interface StatCard {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards: StatCard[] = [
    {
      label: '총 이벤트',
      value: stats.totalEvents,
      icon: Calendar,
    },
    {
      label: '총 사용자',
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: '활성 이벤트',
      value: stats.activeEvents,
      icon: CalendarCheck,
    },
    {
      label: '총 참여자',
      value: stats.totalParticipants,
      icon: UserCheck,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {card.value.toLocaleString('ko-KR')}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
