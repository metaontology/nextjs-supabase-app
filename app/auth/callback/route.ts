import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

// Google OAuth 등 소셜 로그인의 PKCE 코드 교환 처리
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/protected'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=OAuth 인증에 실패했습니다`,
  )
}
