import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme-switcher'

// cacheComponents 환경에서 쿠키 기반 auth 호출은 동적 렌더링 필수
export const dynamic = 'force-dynamic'

// 랜딩 페이지 — 인증된 사용자는 /events로 리디렉션, 미인증 사용자에게 서비스 소개 표시
export default async function Home() {
  // 인증 상태 확인 — 로그인된 사용자는 이벤트 목록으로 이동
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims) {
    redirect('/events')
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* 상단 네비게이션 바 */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-xl font-bold tracking-tight">Gather</span>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link
            href="/auth/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            로그인
          </Link>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {/* 서비스 배지 */}
        <span className="mb-6 inline-block rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          5~30명 소규모 이벤트 관리 플랫폼
        </span>

        {/* 메인 타이틀 */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          소규모 이벤트를
          <br />
          <span className="text-primary">간편하게 관리하세요</span>
        </h1>

        {/* 서비스 설명 */}
        <p className="mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl">
          Gather는 팀 모임, 스터디, 소모임 등 소규모 이벤트를 손쉽게 기획하고
          참여자를 관리할 수 있는 플랫폼입니다.
        </p>

        {/* CTA 버튼 그룹 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
          <Button asChild size="lg" className="px-8">
            <Link href="/auth/sign-up">시작하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link href="/auth/login">로그인</Link>
          </Button>
        </div>
      </section>

      {/* 하단 푸터 */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Gather. All rights reserved.
      </footer>
    </main>
  )
}
