'use client'

// 관리자 사이드바 내비게이션 — 현재 경로 기반 활성 탭 강조
// navItems를 내부에서 직접 정의하는 이유:
// LucideIcon(함수)은 Server Component에서 Client Component로 props 직렬화 불가.
// MobileNav와 동일한 패턴으로 navItems를 Client Component 안에서 선언한다.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/lib/types'

// 관리자 네비게이션 링크 목록
const navItems: NavItem[] = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/events', label: '이벤트 관리', icon: Calendar },
  { href: '/admin/users', label: '사용자 관리', icon: Users },
  { href: '/admin/stats', label: '통계', icon: BarChart3 },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        // /admin은 정확 일치만, 나머지는 하위 경로도 포함
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(`${item.href}/`)

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? // 활성 탭: 배경 강조 + 굵은 텍스트
                    'bg-accent font-medium text-accent-foreground'
                  : // 비활성 탭: 기본 텍스트 + 호버 효과
                    'text-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              {/* 아이콘 */}
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {/* 링크 레이블 */}
              <span>{item.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
