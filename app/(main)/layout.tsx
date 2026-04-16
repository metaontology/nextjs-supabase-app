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
    <div className="min-h-screen w-full pb-16">
      {children}
      {/* 하단 고정 모바일 내비게이션 — usePathname 사용으로 Suspense 래핑 필수 */}
      {/* TODO: Task 008 이후 실제 사용자 역할 기반으로 showCreateTab 동적 처리 예정 */}
      <Suspense fallback={null}>
        <MobileNav showCreateTab={true} />
      </Suspense>
    </div>
  )
}
