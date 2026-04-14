# Development Guidelines — Gather

## Project Overview

- **Product**: Gather — 5~30명 소규모 이벤트 관리 플랫폼 MVP
- **Stack**: Next.js 15.5.3 (App Router) · React 19 · TypeScript 5 strict · Tailwind CSS 3.4 · shadcn/ui (new-york) · Supabase
- **Package manager**: npm
- **Roadmap**: `docs/ROADMAP.md`

---

## Project Architecture

```
app/                        # Next.js App Router
  layout.tsx                # RootLayout + ThemeProvider
  page.tsx                  # 랜딩 페이지 (/)
  globals.css
  auth/
    login/page.tsx
    sign-up/page.tsx
    sign-up-success/page.tsx
    forgot-password/page.tsx
    update-password/page.tsx
    error/page.tsx
    confirm/route.ts        # 이메일 인증 콜백
    callback/route.ts       # OAuth 콜백
  protected/
    layout.tsx
    page.tsx

components/
  ui/                       # shadcn/ui 프리미티브 (수정 금지)
  auth-button.tsx           # Server Component
  login-form.tsx            # Client Component
  sign-up-form.tsx          # Client Component
  logout-button.tsx         # Client Component
  forgot-password-form.tsx  # Client Component
  update-password-form.tsx  # Client Component
  hero.tsx                  # Server Component
  theme-switcher.tsx        # Client Component

lib/
  utils.ts                  # cn() 유틸리티
  supabase/
    client.ts               # createClient() — Client Components 전용
    server.ts               # createClient() async — Server Components 전용
    proxy.ts                # updateSession() — 미들웨어 세션 갱신
  types/
    database.types.ts       # Supabase CLI 자동 생성 타입

proxy.ts                    # Next.js 미들웨어 (middleware.ts 아님)
supabase/
  migrations/               # SQL 마이그레이션 파일

docs/
  ROADMAP.md                # 메인 로드맵
  guides/                   # 개발 가이드 문서
  tasks/                    # Task 명세서 (TASK-XXX.md)
  plans/                    # 계획 문서
  history/                  # 세션 히스토리
```

---

## Critical File Rules

### Middleware

- **미들웨어 파일은 `proxy.ts` (루트)**. `middleware.ts` 파일은 존재하지 않으며 생성하지 말 것.
- 미들웨어 변경 시 `proxy.ts`만 수정하라.
- 공개 경로 추가 시 `lib/supabase/proxy.ts`의 `updateSession()` 함수 내 조건문을 수정하라.

### Supabase 클라이언트

- **Server Component**: `import { createClient } from '@/lib/supabase/server'` → `const supabase = await createClient()` (await 필수)
- **Client Component**: `import { createClient } from '@/lib/supabase/client'` → `const supabase = createClient()` (동기)
- **전역 변수에 클라이언트 저장 금지** — 항상 함수/컴포넌트 내부에서 생성하라.

```typescript
// ❌ 금지
const supabase = createClient() // 모듈 최상위

// ✅ 필수
export async function getData() {
  const supabase = await createClient()
}
```

### 환경 변수

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 사용 ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 사용 금지 ❌

---

## Code Standards

### Import

- `@/` 경로 별칭만 사용하라. `../../` 상대 경로 금지.

```typescript
import { cn } from '@/lib/utils' // ✅
import { createClient } from '@/lib/supabase/server' // ✅
import { cn } from '../../lib/utils' // ❌
```

### Component Export

- **named export** 사용. default export 지양.

```typescript
export function MyComponent() { ... }    // ✅
export default function MyComponent() { ... } // ❌
```

### Server vs Client Components

| 컴포넌트 유형    | 조건                                            | 선언                       |
| ---------------- | ----------------------------------------------- | -------------------------- |
| Server Component | 기본값, Supabase 데이터 페칭, 정적 UI           | 선언 없음                  |
| Client Component | useState/useEffect, 이벤트 핸들러, 브라우저 API | 파일 최상단 `"use client"` |

- Server Component에서 함수 props (onClick 등) 전달 불가 → Client Component로 전환하라.
- Server Component에서 인증 확인: `supabase.auth.getClaims()` 사용 (`getUser()` 지양).

### Styling

- `cn()` 유틸리티로 조건부 클래스 처리하라.
- **시맨틱 색상 변수 사용** (`bg-background`, `text-foreground`, `border-border`). 하드코딩 금지.

```typescript
// ✅
<div className="bg-background text-foreground">
// ❌
<div className="bg-white text-black">
```

### Next.js 15 비동기 API

- `params`와 `searchParams`는 Promise다. 반드시 await하라.

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params // await 필수
}
```

### Database Types

```typescript
import type { Database } from '@/lib/types/database.types'
type Profile = Database['public']['Tables']['profiles']['Row']
```

---

## Authentication Patterns

### Server Component 인증 확인

```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims) redirect('/auth/login')
}
```

### 관리자 권한 확인

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', data.claims.sub)
  .single()
if (profile?.role !== 'admin') {
  await supabase.auth.signOut()
  redirect('/auth/login')
}
```

---

## Quality Gate Workflow

코드 변경(`.ts`, `.tsx`, `.js`, `.jsx`, `.css`) 완료 후 반드시 실행:

```bash
npm run check-all
# typecheck → lint → format:check → build 순서 실행
```

### 실패 시 자동 수정 순서

1. `format:check` 실패 → `npm run format` → `check-all` 재실행
2. `lint` 실패 → `npm run lint:fix` → `check-all` 재실행
3. 그래도 실패 → 수동 수정

### 사용 가능 스크립트

```bash
npm run check-all      # 전체 검사 (필수)
npm run typecheck      # TypeScript 타입 검사
npm run lint           # ESLint 검사
npm run lint:fix       # ESLint 자동 수정
npm run format         # Prettier 자동 수정
npm run format:check   # Prettier 포맷 검사
npm run build          # Next.js 빌드
npm run dev            # 개발 서버 (localhost:3000)
```

---

## Runtime Testing (Playwright MCP)

아래 변경 시 Playwright MCP로 반드시 E2E 테스트를 수행하라:

| 변경 유형               | 검증 대상                |
| ----------------------- | ------------------------ |
| Supabase 쿼리 추가/변경 | 데이터 CRUD 동작         |
| 인증 플로우 변경        | 로그인/로그아웃/리디렉션 |
| 새 Route Handler 추가   | API 응답 정상 여부       |
| 미들웨어 수정           | 보호 라우트 접근 제어    |
| 새 페이지/핵심 UI 구현  | 사용자 플로우 전체       |

**CDP 엔드포인트**: `http://172.17.0.1:19222`

Playwright MCP 탭 선택 규칙:

1. `browser_tabs list`로 탭 목록 확인
2. title이 `Omnibox Popup`인 탭 제외
3. 남은 탭 중 `(current)` 마커 탭 선택, 없으면 마지막 탭 선택
4. `browser_tabs select` → `browser_navigate`

---

## Document File Rules

| 문서 유형     | 위치              | 파일명 형식                   |
| ------------- | ----------------- | ----------------------------- |
| 계획 문서     | `docs/plans/`     | `YYYY-MM-DD-HHMM-계획제목.md` |
| 개발 가이드   | `docs/guides/`    | `kebab-case.md`               |
| Task 명세서   | `docs/tasks/`     | `TASK-XXX.md`                 |
| 세션 히스토리 | `docs/history/`   | `YYYY-MM-DD-HHMM-작업명.md`   |
| 로드맵        | `docs/ROADMAP.md` | 고정                          |

**금지**: 프로젝트 루트에 `.md` 파일 생성 (`README.md`, `ROADMAP.md` 등 관용 파일 제외). `docs/` 루트 직접 작성 금지.

---

## Git Commit Rules

형식: `<emoji> <type>[optional scope]: <description>`

| 이모지 | type     | 용도            |
| ------ | -------- | --------------- |
| ✨     | feat     | 새 기능         |
| 🐛     | fix      | 버그 수정       |
| ♻️     | refactor | 리팩토링        |
| 💄     | style    | 스타일/포맷     |
| 📝     | docs     | 문서            |
| 🔧     | chore    | 설정/도구       |
| 🧑‍💻     | dx       | 개발자 경험     |
| 🎉     | init     | 프로젝트 초기화 |
| 🚀     | deploy   | 배포            |

- scope: 영문 소문자 (auth, api, ui, db, deps)
- description: 영문 소문자 명령형 (add, fix, remove)

---

## Database — Current State

### 테이블

- `profiles` — `auth.users`와 1:1, 회원가입 트리거로 자동 생성

### RLS 정책

- `profiles`: 본인 레코드만 SELECT/UPDATE 가능
- `profiles`: role='admin'이면 전체 조회 가능

### 마이그레이션 파일 위치

- `supabase/migrations/` 디렉토리에 SQL 파일 추가
- Supabase MCP로 마이그레이션 적용

### 타입 재생성

```bash
npx supabase gen types typescript --project-id <project-id> > lib/types/database.types.ts
```

---

## Prohibited Actions

- ❌ `../../` 상대 경로 import 사용
- ❌ Supabase 클라이언트 전역 변수 저장
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수 사용
- ❌ Server Component에서 이벤트 핸들러(onClick 등) props 전달
- ❌ `middleware.ts` 파일 생성 (미들웨어는 `proxy.ts` 사용)
- ❌ `updateSession()` 반환 `supabaseResponse`의 쿠키 직접 수정
- ❌ default export 사용 (shadcn/ui 컴포넌트 제외)
- ❌ Tailwind 색상 하드코딩 (`bg-white`, `text-black` 등)
- ❌ `docs/` 루트에 직접 `.md` 파일 작성
- ❌ 프로젝트 루트에 `.md` 파일 작성 (관용 파일 제외)
- ❌ `react-hook-form`, `zod` import (Task 004 전까지 미설치)
- ❌ `recharts` import (Task 006 전까지 미설치)
- ❌ `npm run check-all` 실행 없이 작업 완료 보고

---

## AI Decision Guide

### 새 컴포넌트 추가 시

1. 훅/이벤트 필요 여부 판단 → 필요하면 Client Component
2. `components/ui/`는 shadcn/ui 전용 → 비즈니스 컴포넌트는 `components/` 직하위에 추가
3. named export로 작성

### 새 라우트 추가 시

1. 인증 필요 라우트 → `lib/supabase/proxy.ts` 공개 경로 목록 확인
2. Route Handler → `app/[경로]/route.ts` 생성
3. Page → `app/[경로]/page.tsx` 생성

### Supabase 데이터 페칭 위치 판단

- 페이지 진입 시 데이터 필요 → Server Component에서 `await createClient()`
- 사용자 인터랙션 후 데이터 필요 → Client Component에서 `createClient()`

### 신규 의존성 설치 시

- 로드맵에 설치 예정 단계 확인 후 해당 Task 단계에서만 설치
- 설치 후 `npm run build`로 빌드 확인 필수
