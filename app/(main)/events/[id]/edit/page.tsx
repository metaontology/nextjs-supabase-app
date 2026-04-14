export const dynamic = 'force-dynamic'

// 이벤트 수정 페이지 — /events/:id/edit
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function EventEditPage({
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
      <h1 className="text-2xl font-bold text-foreground">이벤트 수정</h1>
      <p className="text-sm text-muted-foreground">ID: {id}</p>
      {/* TODO: Task 004 — EventEditForm Client Component */}
    </main>
  )
}
