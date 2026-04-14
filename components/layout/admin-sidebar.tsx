// 관리자 사이드바 컴포넌트 — 데스크톱 전용 좌측 네비게이션 (Server Component)
// 활성 탭 강조는 AdminSidebarNav (Client Component)에서 처리
import { AdminSidebarNav } from '@/components/layout/admin-sidebar-nav'

export function AdminSidebar() {
  return (
    // 사이드바 컨테이너 — 고정 너비, 전체 높이
    <aside className="w-64 shrink-0 border-r border-border bg-background">
      {/* 사이드바 헤더 */}
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">관리자 패널</h2>
      </div>

      {/* 네비게이션 링크 목록 — navItems는 Client Component 내부에서 선언 */}
      <nav className="px-3 py-4">
        <AdminSidebarNav />
      </nav>
    </aside>
  )
}
