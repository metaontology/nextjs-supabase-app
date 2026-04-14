# Gather 프로젝트 규칙 초기화 가이드

> **대상**: `nextjs-supabase-app` 베이스에서 Gather 프로젝트를 새로 시작하는 Claude Code
>
> **실행 시점**: PRD 및 ROADMAP 작업 시작 **전** 반드시 수행

---

## 배경 (Background)

Gather는 5~30명 소규모 이벤트 관리 플랫폼 MVP로, `nextjs-supabase-app` 스타터킷을 기반으로 합니다.

| 항목      | 내용                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| 베이스    | `nextjs-supabase-app` (Next.js 16 + Supabase SSR 스타터킷)                                 |
| 기술 스택 | Next.js 16.2.x (App Router), React 19, TypeScript 5, Tailwind CSS 3.4, shadcn/ui, Supabase |
| 특이사항  | Next.js 16은 `cacheComponents` 실험적 기능 포함 → Supabase와 충돌 이슈 존재                |

이 문서는 Phase 1 구현 과정에서 발견된 이슈를 기록하고, 재현 시 동일한 시행착오 없이 시작할 수 있도록 Claude Code가 수행해야 할 사전 설정 작업을 정의합니다.

---

## Phase 1에서 발견된 이슈

### 이슈: `cacheComponents: true` + Supabase → localhost:3000 무한 로딩

**증상**

`npm run dev` 후 브라우저에서 `localhost:3000` 접속 시 무한 로딩 (타임아웃). 서버 로그에는 `○ Compiling / ...` 이후 멈춤.

**원인**

Next.js 16의 `cacheComponents: true`(기본값)는 모든 Server Component를 기본 캐시 대상으로 분석합니다. `async` 페이지에서 `createClient()`를 직접 호출하면 내부적으로 `cookies()`(next/headers)를 사용하는데, Turbopack이 이 동적 함수를 정적 분석하려다 컴파일 루프에 빠집니다.

```
page.tsx 컴파일 시작
  → async Server Component 감지 → 캐시 분석 시작
  → createClient() → cookies() 발견
  → "요청마다 달라지는 값인데 캐시 가능?" → 분석 hang ← 여기서 멈춤
```

**스타터킷 원본이 괜찮았던 이유**: 원본 `app/page.tsx`는 sync 함수였고 Supabase를 직접 호출하지 않아 컴파일 분석이 단순했기 때문입니다.

**해결**

1. `next.config.ts`: `cacheComponents: false` (Next.js 14/15 방식 유지)
2. Supabase 호출 page.tsx 상단: `export const dynamic = 'force-dynamic'` 추가

---

## 실행 순서

```
[1단계] 프로젝트 초기화 직후
  └─ Task A: next.config.ts 수정
  └─ Task C: coding-standards.md 추가
  └─ Task D: project.md 추가

[shrimp 초기화] ← 이 문서를 컨텍스트로 주입하여 실행
  └─ mcp__shrimp-task-manager__init_project_rules
     @docs/guides/add-gather-project-rules.md
     @docs/ROADMAP.md
     → shrimp-rules.md 생성 시 아래 Task B 규칙이 자동 반영됨
```

> **왜 `@파일` 주입이 필요한가**
>
> `init_project_rules`는 코드베이스를 분석해 `shrimp-rules.md`를 새로 생성합니다.
> `@docs/guides/add-gather-project-rules.md`를 컨텍스트로 주입하면
> Claude가 이 문서를 읽은 상태로 shrimp-rules.md를 작성하므로,
> Task B의 규칙(cacheComponents, force-dynamic)이 생성 시점에 자동으로 포함됩니다.
> 별도의 2단계 작업이 필요 없습니다.

---

## 1단계: 프로젝트 초기화 직후 수행

### Task A: `next.config.ts` 수정

**파일**: `next.config.ts`

`cacheComponents` 값을 `false`로 변경합니다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // cacheComponents: true는 cookies() 기반 Supabase 클라이언트 호출 시
  // Turbopack 컴파일 무한 hang 발생 → false 유지 필수
  cacheComponents: false,
}

export default nextConfig
```

---

### Task C: `.claude/rules/coding-standards.md` 추가

**파일**: `.claude/rules/coding-standards.md`

**"⚠️ 중요 Gotcha" 섹션**에 아래 항목을 추가합니다:

```markdown
7. **Next.js 16 `cacheComponents` + Supabase 충돌**
   - `cacheComponents: true` 상태에서 `async` page가 `createClient()` 직접 호출 시
     Turbopack 컴파일 무한 hang → `localhost:3000` 타임아웃 발생
   - `next.config.ts`는 항상 `cacheComponents: false` 유지
   - Supabase 호출 page.tsx 상단에 `export const dynamic = 'force-dynamic'` 필수
```

---

### Task D: `.claude/rules/project.md` 추가

**파일**: `.claude/rules/project.md`

**빌드 스크립트** 섹션 아래에 추가합니다:

```markdown
## next.config.ts 주의사항

`cacheComponents: false` 를 반드시 유지한다.
`true`로 변경 시 Supabase `createClient()` 호출 페이지에서 Turbopack 컴파일 hang 발생.
```

---

## shrimp 초기화: Task B 규칙을 자동 반영하는 init 실행 방법

아래 명령으로 `init_project_rules`를 실행합니다.
이 문서와 ROADMAP을 컨텍스트로 주입하면 shrimp-rules.md 생성 시 Task B 내용이 자동 포함됩니다:

```
mcp__shrimp-task-manager__init_project_rules
@docs/guides/add-gather-project-rules.md
@docs/ROADMAP.md
```

생성된 `shrimp-rules.md`에 아래 내용이 포함되었는지 확인합니다:

**확인 항목 (Task B)**

- [ ] "Prohibited Actions" 섹션에 `cacheComponents: true` 금지 규칙 포함
- [ ] `export const dynamic = 'force-dynamic'` 누락 금지 규칙 포함
- [ ] Next.js 16 + Supabase 필수 패턴 섹션 포함

포함되지 않았다면 아래 내용을 수동으로 추가합니다:

```markdown
<!-- shrimp-rules.md → Prohibited Actions 섹션에 추가 -->

- ❌ `next.config.ts`의 `cacheComponents: true` 설정 (Supabase 무한 로딩 발생)
- ❌ Supabase `createClient()` 를 호출하는 page.tsx에서 `export const dynamic = 'force-dynamic'` 누락

<!-- shrimp-rules.md → Code Standards 섹션에 추가 -->

### Next.js 16 + Supabase 필수 패턴

Supabase `createClient()`는 내부적으로 `cookies()`(next/headers)를 사용한다.
`cacheComponents: true` 환경에서 이를 직접 호출하는 async 페이지는 컴파일 hang을 유발한다.
모든 Supabase 호출 page.tsx 상단에 반드시 선언하라: `export const dynamic = 'force-dynamic'`
```

---

## 검증

각 단계 완료 후:

```bash
npm run typecheck   # 타입 오류 없음 확인
npm run format      # 포맷 자동 수정
```

---

_이 가이드는 2026-04-14 Phase 1 구현 과정에서 작성되었습니다._
