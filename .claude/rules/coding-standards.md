# 코딩 컨벤션 및 패턴

## Server vs Client 컴포넌트

### 기본 원칙
- **Server Component (기본)**: layout, page, 정적 UI, Supabase 데이터 페칭
- **Client Component (`"use client"`)**: 훅 사용, 이벤트 핸들러, 브라우저 API, 폼 상태

### 파일별 분류

| 파일 | Server/Client |
|------|--------------|
| `app/**/layout.tsx` | Server |
| `app/**/page.tsx` | Server (기본) |
| `components/auth-button.tsx` | Server (getClaims로 인증 상태 확인) |
| `components/login-form.tsx` | Client (폼 상태) |
| `components/sign-up-form.tsx` | Client (폼 상태) |
| `components/logout-button.tsx` | Client (signOut 호출) |
| `components/theme-switcher.tsx` | Client (useTheme) |

---

## Supabase 클라이언트 사용 패턴

### Client Component에서 사용
```typescript
// lib/supabase/client.ts의 createBrowserClient 기반
import { createClient } from "@/lib/supabase/client"

"use client"
export function LoginForm() {
  const handleLogin = async () => {
    const supabase = createClient()  // 함수 내부에서 생성
    const { error } = await supabase.auth.signInWithPassword({ email, password })
  }
}
```

### Server Component에서 사용
```typescript
// lib/supabase/server.ts의 createServerClient 기반 (async)
import { createClient } from "@/lib/supabase/server"

export async function UserDashboard() {
  const supabase = await createClient()  // await 필수
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.sub)
    .single()

  return <div>{profile?.full_name}</div>
}
```

### ⚠️ 중요: Supabase 클라이언트 전역 저장 금지
```typescript
// ❌ 금지 — Fluid compute 환경에서 세션 오류 발생
const supabase = createClient()  // 모듈 최상위에 선언

// ✅ 올바른 방법 — 항상 함수/컴포넌트 내부에서 생성
export async function getData() {
  const supabase = await createClient()  // 함수 내부
}
```

---

## 인증 체크 패턴

### Server Component에서 인증 확인
```typescript
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  return <div>Hello, {data.claims.email}</div>
}
```

### 관리자 권한 체크
```typescript
// profiles 테이블의 role 컬럼 확인
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", data.claims.sub)
  .single()

if (profile?.role !== "admin") {
  await supabase.auth.signOut()
  redirect("/auth/login")
}
```

---

## Import 패턴

항상 `@/` 경로 별칭 사용. 상대 경로(`../../`) 금지.

```typescript
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"   // Client 전용
import { createClient } from "@/lib/supabase/server"   // Server 전용
import type { Database } from "@/lib/types/database.types"
import { Button } from "@/components/ui/button"
```

---

## 컴포넌트 작성 패턴

```typescript
interface ComponentProps {
  title: string
  description?: string
  className?: string
}

// named export 사용 (default export 지양)
export function ComponentName({ title, description, className }: ComponentProps) {
  return (
    <div className={cn("base-class", className)}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  )
}
```

---

## 스타일링 패턴

`cn()` 유틸리티로 조건부 클래스 처리:

```typescript
className={cn(
  "base-class other-base",
  isActive && "active-class",
  variant === "primary" && "primary-class",
  className  // 외부 className 항상 마지막
)}
```

시맨틱 색상 변수 사용 (하드코딩 금지):

```typescript
// ✅ 올바른 방법
<div className="bg-background text-foreground border-border">
  <p className="text-muted-foreground">보조 텍스트</p>
</div>

// ❌ 금지
<div className="bg-white text-black border-gray-200">
```

---

## Next.js 15 비동기 API 처리

```typescript
// ✅ Next.js 15에서 params/searchParams는 Promise
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params        // await 필수
  const query = await searchParams   // await 필수
}
```

---

## 폼 패턴 (react-hook-form 미설치 전)

현재 프로젝트는 `react-hook-form`이 없으므로 네이티브 폼 또는 기본 state 사용:

```typescript
"use client"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: ...,
        password: ...,
      })
      if (error) throw error
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }
}
```

react-hook-form 설치 후에는 `docs/guides/forms-react-hook-form.md` 참조.

---

## Supabase 데이터 타입 사용

```typescript
import type { Database } from "@/lib/types/database.types"

// 테이블 행 타입
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

// INSERT 타입
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]

// UPDATE 타입
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"]
```

---

## ⚠️ 중요 Gotcha (반드시 숙지)

1. **Supabase 환경 변수명**
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 사용 (✅)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 사용 금지 (❌ — 이 프로젝트는 새 형식 사용)

2. **미들웨어 파일 위치**
   - `proxy.ts` (루트)가 Next.js 미들웨어 역할 (`proxy` 함수 export)
   - `middleware.ts` 파일은 없음 — `proxy.ts` 수정으로 미들웨어 변경

3. **createServerClient는 async**
   - `await createClient()` 필수
   - `createClient()` (동기) 사용 시 런타임 오류

4. **getClaims() vs getUser()**
   - 미들웨어에서 세션 갱신 후 `getClaims()` 사용 권장
   - `getUser()`는 매 요청마다 Supabase 서버에 네트워크 요청 발생

5. **Server Component에서 함수 props 전달 불가**
   - `onClick` 등 이벤트 핸들러가 필요하면 Client Component로 전환

6. **미들웨어 응답 객체 수정 금지**
   - `updateSession()`이 반환한 `supabaseResponse` 객체의 쿠키를 직접 변경하지 말 것
   - 세션이 조기 종료될 수 있음

---

## 새로운 인증 보호 라우트 추가

```typescript
// lib/supabase/proxy.ts의 updateSession() 함수에서 공개 경로 추가
if (
  request.nextUrl.pathname !== "/" &&
  !user &&
  !request.nextUrl.pathname.startsWith("/login") &&
  !request.nextUrl.pathname.startsWith("/auth") &&
  !request.nextUrl.pathname.startsWith("/새공개경로")  // 추가
) {
  // 미인증 → 로그인 리디렉션
}
```
