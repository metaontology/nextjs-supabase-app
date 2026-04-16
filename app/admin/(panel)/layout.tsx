// 관리자 패널 레이아웃 — 사이드바 + 콘텐츠 영역 2단 구조
// (panel) route group: /admin, /admin/events, /admin/users, /admin/stats에 적용
// /admin/login은 이 레이아웃 밖에 위치하여 사이드바 없이 렌더링됨
import { redirect } from 'next/navigation'

import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { createClient } from '@/lib/supabase/server'

interface AdminPanelLayoutProps {
  children: React.ReactNode
}

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  // 미인증 → 관리자 로그인 페이지
  if (!user) {
    redirect('/admin/login')
  }

  // profiles 테이블에서 role 확인 (get_my_role() 함수로 재귀 방지)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .single()

  // 일반 사용자 → 홈으로 리디렉션
  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    // max-w-[430px] 모바일 제한을 무효화하고 전체 화면 활용
    <div className="fixed inset-0 z-50 flex bg-background">
      {/* 좌측 관리자 사이드바 */}
      <AdminSidebar />

      {/* 우측 메인 콘텐츠 영역 — 스크롤 가능 */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
