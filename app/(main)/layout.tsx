// 모바일 메인 레이아웃 — 하단 고정 MobileNav를 포함하는 래퍼 레이아웃
// pb-16은 MobileNav 높이(h-16)만큼 콘텐츠가 가려지지 않도록 확보

import { Suspense } from 'react'

import { MobileNav } from '@/components/layout/mobile-nav'
import { createClient } from '@/lib/supabase/server'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  // 관리자 여부 확인 — 실패해도 레이아웃은 정상 렌더링
  let isAdmin = false
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getClaims()
    const userId = data?.claims?.sub
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      isAdmin = profile?.role === 'admin'
    }
  } catch {
    // 미인증 또는 네트워크 오류 시 isAdmin = false 유지
  }

  return (
    // 모바일 최대 너비(430px) 제한 + 가운데 정렬 + 하단 내비 높이 패딩 확보
    <div className="min-h-screen w-full pb-16">
      {children}
      {/* 하단 고정 모바일 내비게이션 — usePathname 사용으로 Suspense 래핑 필수 */}
      <Suspense fallback={null}>
        <MobileNav showCreateTab={true} isAdmin={isAdmin} />
      </Suspense>
    </div>
  )
}
