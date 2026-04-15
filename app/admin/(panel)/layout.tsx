// 관리자 패널 레이아웃 — 사이드바 + 콘텐츠 영역 2단 구조
// (panel) route group: /admin, /admin/events, /admin/users, /admin/stats에 적용
// /admin/login은 이 레이아웃 밖에 위치하여 사이드바 없이 렌더링됨
import { AdminSidebar } from '@/components/layout/admin-sidebar'

interface AdminPanelLayoutProps {
  children: React.ReactNode
}

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  return (
    // 전체 화면 높이를 차지하는 수평 플렉스 컨테이너
    <div className="flex min-h-screen">
      {/* 좌측 관리자 사이드바 */}
      <AdminSidebar />

      {/* 우측 메인 콘텐츠 영역 */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
