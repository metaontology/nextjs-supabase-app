'use client'

// 관리자 대시보드 차트 컴포넌트 (Client Component)
// Recharts는 브라우저 DOM에 의존하므로 반드시 'use client' 필요
// BarChart: 월별 이벤트 생성 수 / LineChart: 월별 사용자 증가 / PieChart: 이벤트 상태별 분포

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminChartsProps {
  chartData: { name: string; events: number; users: number }[]
}

/** PieChart 고정 더미 데이터 — 이벤트 상태별 분포 */
const PIE_DATA = [
  { name: '예정', value: 2 },
  { name: '진행중', value: 1 },
  { name: '종료', value: 1 },
]

/** PieChart 셀 색상 (hex — Recharts는 CSS 변수 미지원) */
const PIE_COLORS = ['#3b82f6', '#f59e0b', '#6b7280']

/** BarChart / LineChart 공통 색상 */
const CHART_COLORS = {
  events: '#3b82f6',
  users: '#10b981',
}

export function AdminCharts({ chartData }: AdminChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* 차트 1: 월별 이벤트 생성 수 (BarChart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            월별 이벤트 생성 수
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Bar
                dataKey="events"
                name="이벤트 수"
                fill={CHART_COLORS.events}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 차트 2: 월별 사용자 증가 (LineChart) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            월별 사용자 증가
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                name="사용자 수"
                stroke={CHART_COLORS.users}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_COLORS.users }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 차트 3: 이벤트 상태별 분포 (PieChart) — 고정 더미 데이터 */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            이벤트 상태별 분포
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={true}
              >
                {PIE_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                }}
                formatter={(value) => [`${value}개`, '이벤트 수']}
              />
              <Legend
                iconType="circle"
                iconSize={10}
                formatter={(value) => (
                  <span style={{ fontSize: '12px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
