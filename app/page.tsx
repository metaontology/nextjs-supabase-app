import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme-switcher'

// cacheComponents 환경에서 쿠키 기반 auth 호출은 동적 렌더링 필수
export const dynamic = 'force-dynamic'

// 랜딩 페이지 — 인증 여부에 따라 CTA 버튼 분기
export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isLoggedIn = !!data?.claims

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* 상단 네비게이션 바 */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-xl font-bold tracking-tight">Gather</span>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {!isLoggedIn && (
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              로그인
            </Link>
          )}
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 sm:py-24">
        {/* 서비스 배지 */}
        <span className="mb-6 inline-block rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground sm:text-sm">
          5~30명 소규모 이벤트 관리 플랫폼
        </span>

        {/* 메인 타이틀 */}
        <h1 className="mb-6 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          소규모 이벤트를
          <br />
          <span className="text-primary">간편하게 관리하세요</span>
        </h1>

        {/* 서비스 설명 */}
        <p className="mb-10 text-sm text-muted-foreground sm:text-base">
          Gather는 팀 모임, 스터디, 소모임 등 소규모 이벤트를 손쉽게 기획하고
          참여자를 관리할 수 있는 플랫폼입니다.
        </p>

        {/* CTA 버튼 그룹 — 로그인 여부에 따라 분기 */}
        {isLoggedIn ? (
          <Button asChild size="lg" className="px-8">
            <Link href="/events">내 이벤트 보기</Link>
          </Button>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
            <Button asChild size="lg" className="px-8">
              <Link href="/auth/sign-up">시작하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/auth/login">로그인</Link>
            </Button>
          </div>
        )}
      </section>

      {/* 하단 푸터 */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Gather. All rights reserved.
      </footer>
    </main>
  )
}
