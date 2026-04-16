// 관리자 사이드바 컴포넌트 — 데스크톱 전용 좌측 네비게이션 (Server Component)
// 활성 탭 강조는 AdminSidebarNav (Client Component)에서 처리
import Link from 'next/link'
import { Home } from 'lucide-react'

import { LogoutButton } from '@/components/logout-button'
import { AdminSidebarNav } from '@/components/layout/admin-sidebar-nav'

export function AdminSidebar() {
  return (
    // 사이드바 컨테이너 — 고정 너비, 전체 높이, 세로 플렉스
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-background">
      {/* 사이드바 헤더 */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">관리자 패널</h2>
        {/* 홈으로 이동 버튼 */}
        <Link
          href="/"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="홈으로 이동"
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>

      {/* 네비게이션 링크 목록 — navItems는 Client Component 내부에서 선언 */}
      <nav className="flex-1 px-3 py-4">
        <AdminSidebarNav />
      </nav>

      {/* 하단 로그아웃 버튼 */}
      <div className="border-t border-border p-3">
        <LogoutButton redirectTo="/admin/login" className="w-full" />
      </div>
    </aside>
  )
}
