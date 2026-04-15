'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import type { UserTableRow } from '@/lib/types/admin'
import type { UserRole } from '@/lib/types/user'

/** 역할 필터 옵션 — 'all'은 전체 표시 */
type RoleFilter = UserRole | 'all'

/** 역할에 따른 Badge variant 매핑 */
const ROLE_BADGE_VARIANT: Record<UserRole, 'default' | 'secondary'> = {
  admin: 'default',
  user: 'secondary',
}

/** 역할 한국어 레이블 */
const ROLE_LABEL: Record<UserRole, string> = {
  admin: '관리자',
  user: '일반',
}

interface AdminUserTableProps {
  rows: UserTableRow[]
}

/** 관리자용 사용자 목록 테이블 — 검색 및 역할 필터 포함 */
export function AdminUserTable({ rows }: AdminUserTableProps) {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')
  // 역할 필터 상태 ('all' = 전체)
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  // 검색어 + 역할 필터 적용
  const filteredRows = rows.filter((row) => {
    // 검색어 필터: 이메일 또는 이름에 포함 여부 (대소문자 무시)
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      query === '' ||
      row.email.toLowerCase().includes(query) ||
      (row.fullName?.toLowerCase().includes(query) ?? false)

    // 역할 필터: 'all'이면 전부 통과
    const matchesRole = roleFilter === 'all' || row.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="flex flex-col gap-4">
      {/* 툴바 — 검색 + 역할 필터 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="이메일 또는 이름 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as RoleFilter)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="역할 전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="user">일반</SelectItem>
            <SelectItem value="admin">관리자</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 사용자 테이블 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">사용자</th>
              <th className="px-4 py-3 font-medium">이메일</th>
              <th className="px-4 py-3 font-medium">역할</th>
              <th className="px-4 py-3 text-center font-medium">주최 이벤트</th>
              <th className="px-4 py-3 text-center font-medium">참여 이벤트</th>
              <th className="px-4 py-3 font-medium">가입일</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  조건에 맞는 사용자가 없습니다.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                // 이름 첫 글자 추출 (fallback 이니셜용)
                const initials =
                  row.fullName?.charAt(0) ?? row.email.charAt(0).toUpperCase()

                return (
                  <tr
                    key={row.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-muted/30"
                  >
                    {/* 아바타 + 이름 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="default">
                          <AvatarImage
                            src={row.avatarUrl ?? undefined}
                            alt={row.fullName ?? row.email}
                          />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {row.fullName ?? '—'}
                        </span>
                      </div>
                    </td>
                    {/* 이메일 */}
                    <td className="px-4 py-3 text-foreground">{row.email}</td>
                    {/* 역할 Badge */}
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_BADGE_VARIANT[row.role]}>
                        {ROLE_LABEL[row.role]}
                      </Badge>
                    </td>
                    {/* 주최한 이벤트 수 */}
                    <td className="px-4 py-3 text-center text-foreground">
                      {row.eventCount}
                    </td>
                    {/* 참여한 이벤트 수 */}
                    <td className="px-4 py-3 text-center text-foreground">
                      {row.joinedEventCount}
                    </td>
                    {/* 가입일 */}
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      {formatEventDate(row.createdAt)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 결과 수 */}
      <p className="text-xs text-muted-foreground">
        총 {filteredRows.length}명
        {filteredRows.length !== rows.length && ` (전체 ${rows.length}명 중)`}
      </p>
    </div>
  )
}
