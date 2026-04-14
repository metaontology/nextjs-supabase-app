export const dynamic = 'force-dynamic'

// 초대 링크 참여 페이지 — /invite/:code
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect(`/auth/login?next=/invite/${code}`)

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">이벤트 초대</h1>
      <p className="text-sm text-muted-foreground">초대 코드: {code}</p>
      {/* TODO: Task 005 — 이벤트 정보 미리보기 및 참여 확인 버튼 */}
    </main>
  )
}
