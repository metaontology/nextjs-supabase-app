'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatEventDate } from '@/lib/utils'
import type { EventStatus, EventTableRow } from '@/lib/types'

/** 상태 필터 옵션 — 'all'은 전체 표시 */
type StatusFilter = EventStatus | 'all'

/** 이벤트 상태에 따른 Badge variant 매핑 */
const STATUS_BADGE_VARIANT: Record<
  EventStatus,
  'default' | 'secondary' | 'outline'
> = {
  upcoming: 'default',
  ongoing: 'secondary',
  ended: 'outline',
}

/** 이벤트 상태 한국어 레이블 */
const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: '예정',
  ongoing: '진행중',
  ended: '종료',
}

interface AdminEventTableProps {
  rows: EventTableRow[]
}

/** 관리자용 이벤트 목록 테이블 — 검색 및 상태 필터 포함 */
export function AdminEventTable({ rows }: AdminEventTableProps) {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')
  // 상태 필터 상태 ('all' = 전체)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // 검색어 + 상태 필터 적용
  const filteredRows = rows.filter((row) => {
    // 검색어 필터: 제목 또는 주최자 이름에 포함 여부 (대소문자 무시)
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      query === '' ||
      row.title.toLowerCase().includes(query) ||
      row.ownerName.toLowerCase().includes(query)

    // 상태 필터: 'all'이면 전부 통과
    const matchesStatus = statusFilter === 'all' || row.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-4">
      {/* 툴바 — 검색 + 상태 필터 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="이벤트 제목 또는 주최자 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="상태 전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="upcoming">예정</SelectItem>
            <SelectItem value="ongoing">진행중</SelectItem>
            <SelectItem value="ended">종료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 이벤트 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">제목</th>
              <th className="px-4 py-3 font-medium">주최자</th>
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">장소</th>
              <th className="px-4 py-3 text-center font-medium">참여자</th>
              <th className="px-4 py-3 font-medium">상태</th>
              <th className="px-4 py-3 font-medium">생성일</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  조건에 맞는 이벤트가 없습니다.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                >
                  {/* 제목 */}
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.title}
                  </td>
                  {/* 주최자 — 이름 + 이메일 */}
                  <td className="px-4 py-3">
                    <div className="text-foreground">{row.ownerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {row.ownerEmail}
                    </div>
                  </td>
                  {/* 날짜 */}
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">
                    {formatEventDate(row.date)}
                  </td>
                  {/* 장소 */}
                  <td className="px-4 py-3 text-foreground">{row.location}</td>
                  {/* 참여자 수 */}
                  <td className="px-4 py-3 text-center text-foreground">
                    {row.participantCount}
                  </td>
                  {/* 상태 Badge */}
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE_VARIANT[row.status]}>
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </td>
                  {/* 생성일 */}
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">
                    {formatEventDate(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 결과 수 */}
      <p className="text-xs text-muted-foreground">
        총 {filteredRows.length}개 이벤트
        {filteredRows.length !== rows.length && ` (전체 ${rows.length}개 중)`}
      </p>
    </div>
  )
}
