// 모바일 메인 레이아웃 — 하단 고정 MobileNav를 포함하는 래퍼 레이아웃
// pb-16은 MobileNav 높이(h-16)만큼 콘텐츠가 가려지지 않도록 확보

import { Suspense } from 'react'
import { MobileNav } from '@/components/layout/mobile-nav'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    // 모바일 최대 너비(430px) 제한 + 가운데 정렬 + 하단 내비 높이 패딩 확보
    <div className="mx-auto min-h-screen w-full max-w-[430px] pb-16">
      {children}
      {/* 하단 고정 모바일 내비게이션 — usePathname 사용으로 Suspense 래핑 필수 */}
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </div>
  )
}
