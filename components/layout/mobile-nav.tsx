'use client'

// 하단 고정 모바일 내비게이션 바 컴포넌트
// usePathname으로 현재 경로를 감지해 활성 탭을 표시

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Calendar,
  Home,
  LayoutDashboard,
  LogOut,
  Plus,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { NavItem } from '@/lib/types'

// 탭 목록: 홈, 내 이벤트, 새 이벤트, 프로필
const navItems: NavItem[] = [
  {
    href: '/',
    label: '홈',
    icon: Home,
  },
  {
    href: '/events',
    label: '내 이벤트',
    icon: Calendar,
  },
  {
    href: '/events/new',
    label: '새 이벤트',
    icon: Plus,
  },
  {
    href: '/profile',
    label: '프로필',
    icon: User,
  },
]

interface MobileNavProps {
  /** 이벤트 생성 탭 표시 여부 — false면 참여자 전용 네비게이션(3개 탭) */
  showCreateTab?: boolean
  /** 관리자 여부 — true면 관리자 패널 탭 표시 */
  isAdmin?: boolean
}

export function MobileNav({
  showCreateTab = true,
  isAdmin = false,
}: MobileNavProps) {
  // showCreateTab이 false면 '새 이벤트' 탭 제외 (참여자 전용 네비게이션)
  const items = showCreateTab
    ? navItems
    : navItems.filter((item) => item.href !== '/events/new')

  // 현재 경로 감지
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    // 하단 고정 내비게이션 바
    <nav
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-border bg-background"
      aria-label="모바일 내비게이션"
    >
      <ul className="flex h-16 items-center justify-around">
        {items.map(({ href, label, icon: Icon }) => {
          // 현재 경로와 탭 경로 일치 여부 확인
          // - '/'는 정확 일치만 (하위 경로가 없음)
          // - 나머지는 정확 일치 OR 하위 경로 포함 (예: /events/123 → '내 이벤트' 탭 활성)
          // - 단, 다른 탭의 정확한 경로에 해당하면 해당 탭만 활성화 (예: /events/new → '새 이벤트' 탭만 활성)
          const isActive = (() => {
            if (pathname === href) return true
            if (href === '/') return false
            const isOtherTabExact = items.some(
              (item) => item.href !== href && pathname === item.href,
            )
            if (isOtherTabExact) return false
            return pathname.startsWith(`${href}/`)
          })()

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  // 공통 스타일: 세로 중앙 정렬 + 클릭 영역 확보
                  'flex flex-col items-center justify-center gap-1 py-2 transition-colors',
                  // 활성 탭: 진한 텍스트 색상
                  isActive
                    ? 'text-foreground'
                    : // 비활성 탭: 흐린 텍스트 색상
                      'text-muted-foreground hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* 아이콘 — 활성 탭은 채워진(filled) 느낌을 위해 strokeWidth 강화 */}
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.75}
                  aria-hidden="true"
                />
                {/* 탭 레이블 */}
                <span className="text-xs leading-none font-medium">
                  {label}
                </span>
              </Link>
            </li>
          )
        })}

        {/* 관리자 패널 탭 — 관리자만 표시 */}
        {isAdmin && (
          <li className="flex-1">
            <Link
              href="/admin/dashboard"
              className="flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard
                size={22}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="text-xs leading-none font-medium">관리자</span>
            </Link>
          </li>
        )}

        {/* 로그아웃 탭 */}
        <li className="flex-1">
          <button
            onClick={handleLogout}
            className="flex w-full flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut size={22} strokeWidth={1.75} aria-hidden="true" />
            <span className="text-xs leading-none font-medium">로그아웃</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
