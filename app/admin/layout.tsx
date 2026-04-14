// 관리자 영역 레이아웃 — 사이드바 + 콘텐츠 영역 2단 구조
import { AdminSidebar } from '@/components/layout/admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
