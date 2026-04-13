# 구글 로그인 기능 추가 계획

## Context

현재 프로젝트는 이메일/비밀번호 인증만 지원합니다. 소셜 로그인 중 구글을 추가하여 사용자 가입/로그인 편의성을 높입니다.

**전제 조건**: Supabase Dashboard의 Authentication > Providers > Google이 이미 활성화되어 있음.

---

## 변경 파일 목록

| 파일                          | 변경 유형                                 |
| ----------------------------- | ----------------------------------------- |
| `app/auth/callback/route.ts`  | **신규 생성** — OAuth PKCE 코드 교환 처리 |
| `components/login-form.tsx`   | **수정** — 구글 로그인 버튼 추가          |
| `components/sign-up-form.tsx` | **수정** — 구글 로그인 버튼 추가          |

---

## Step 1: OAuth 콜백 라우트 생성

**파일**: `app/auth/callback/route.ts`

Supabase OAuth는 PKCE 플로우를 사용합니다.  
구글 인증 완료 후 `?code=xxx` 파라미터와 함께 이 라우트로 돌아오면,  
`exchangeCodeForSession(code)`으로 세션 쿠키를 발급합니다.

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
```

**참고**: 미들웨어(`lib/supabase/proxy.ts`)에서 `/auth/*` 경로는 이미 공개 경로로 처리되므로 추가 수정 불필요.

---

## Step 2: login-form.tsx 수정

**파일**: `components/login-form.tsx`

### 추가 내용

1. **`handleGoogleLogin` 함수** — `signInWithOAuth` 호출

```typescript
const handleGoogleLogin = async () => {
  setIsLoading(true)
  const supabase = createClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  // 리다이렉트가 발생하므로 setIsLoading(false) 불필요
}
```

2. **구분선 + 구글 버튼** — 기존 Login 버튼 아래에 추가

```tsx
{
  /* 구분선 */
}
;<div className="relative">
  <div className="absolute inset-0 flex items-center">
    <span className="w-full border-t" />
  </div>
  <div className="relative flex justify-center text-xs uppercase">
    <span className="bg-background px-2 text-muted-foreground">또는</span>
  </div>
</div>

{
  /* 구글 로그인 버튼 */
}
;<Button
  type="button"
  variant="outline"
  className="w-full"
  onClick={handleGoogleLogin}
  disabled={isLoading}
>
  <GoogleIcon />
  Google로 로그인
</Button>
```

3. **GoogleIcon** — lucide-react에 구글 아이콘이 없으므로 인라인 SVG 사용

```tsx
function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
```

---

## Step 3: sign-up-form.tsx 수정

**파일**: `components/sign-up-form.tsx`

login-form.tsx와 동일한 패턴으로 적용:

- `handleGoogleLogin` 함수 추가
- Sign up 버튼 아래에 구분선 + 구글 버튼 추가
- `GoogleIcon` 컴포넌트 추가

---

## 최종 UI 구조

```
┌─────────────────────────────┐
│  Email: [_______________]   │
│  Password: [_____________]  │
│                             │
│  [      Login / Sign up   ] │
│  ────────── 또는 ──────────  │
│  [G  Google로 로그인       ] │
│                             │
│  계정이 없으신가요? 회원가입  │
└─────────────────────────────┘
```

---

## 검증

### 코드 품질

```bash
npm run check-all
```

### Playwright MCP E2E 테스트

1. `/auth/login` 페이지 접속 → 구글 버튼 표시 확인
2. 구글 버튼 클릭 → accounts.google.com으로 리다이렉트 확인
3. (구글 로그인 완료 후) `/auth/callback?code=xxx` → `/protected` 리다이렉트 확인
4. 로그인 상태에서 `/protected` 페이지 정상 접근 확인
5. `/auth/sign-up` 페이지에도 구글 버튼 표시 확인
