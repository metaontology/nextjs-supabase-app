export const dynamic = 'force-dynamic'

// 프로필 페이지 — /profile
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')

  return (
    <main className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-foreground">프로필</h1>
      {/* TODO: Task 004/005 — 프로필 정보 표시 및 수정 폼 */}
    </main>
  )
}
