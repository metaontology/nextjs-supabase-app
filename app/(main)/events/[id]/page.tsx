export const dynamic = 'force-dynamic'

// 이벤트 상세 페이지 — /events/:id
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">이벤트 상세</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>
      {/* TODO: Task 004/005 — 이벤트 상세 및 참여자 목록 컴포넌트 */}
    </main>
  )
}
