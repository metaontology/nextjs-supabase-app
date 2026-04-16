'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface LogoutButtonProps {
  redirectTo?: string
  className?: string
}

export function LogoutButton({
  redirectTo = '/auth/login',
  className,
}: LogoutButtonProps) {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(redirectTo)
  }

  return (
    <Button onClick={logout} className={className}>
      로그아웃
    </Button>
  )
}
