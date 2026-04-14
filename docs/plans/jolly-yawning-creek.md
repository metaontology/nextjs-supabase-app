# 플랜: add-gather-project-rules.md 생성

## Context

`nextjs-supabase-app` 베이스에서 Gather 프로젝트를 재현할 때, PRD/ROADMAP 작업 시작 전에
AI 에이전트가 반드시 적용해야 할 프로젝트 규칙들을 사전에 설정하기 위한 가이드 문서.

Phase 1 구현 과정에서 발견된 이슈(cacheComponents hang 등)를 포함하여
다음번에는 같은 문제 없이 시작할 수 있도록 한다.

---

## 생성할 파일

**경로**: `docs/guides/add-gather-project-rules.md`

---

## 문서 내용 구조

### 1. 배경 (Background)

- Gather 프로젝트 개요 (5~30명 소규모 이벤트 관리 플랫폼)
- 베이스: `nextjs-supabase-app` 스타터킷 (Next.js 16 + Supabase)
- 이 문서의 목적: 재현 시 동일한 시행착오를 반복하지 않도록 규칙 선적용

### 2. Phase 1에서 발견된 이슈 (Known Issues)

**이슈 1: `cacheComponents: true` + Supabase 무한 로딩**

- 증상: `async` 페이지에서 `createClient()` 직접 호출 시 Turbopack 컴파일 hang → localhost:3000 타임아웃
- 원인: Next.js 16 Cache Components가 `cookies()` 기반 동적 함수를 정적 분석하려다 루프
- 해결: `cacheComponents: false` + `export const dynamic = 'force-dynamic'`

### 3. Claude Code가 수행할 작업 목록 (Tasks)

**Task A: `next.config.ts` 수정**

```ts
// cacheComponents: false 로 변경
const nextConfig: NextConfig = {
  cacheComponents: false,
}
```

**Task B: `shrimp-rules.md` 추가**

- "Prohibited Actions" 섹션에 추가:
  - `cacheComponents: true` 사용 금지
- "Code Standards" 또는 새 섹션에 추가:
  - Supabase `createClient()` 호출하는 모든 page.tsx에 `export const dynamic = 'force-dynamic'` 필수

**Task C: `.claude/rules/coding-standards.md` 추가**

- "⚠️ 중요 Gotcha" 섹션에 추가:
  - Next.js 16 `cacheComponents: true` + `createClient()` 조합 금지
  - `async` page에서 Supabase 호출 시 `export const dynamic = 'force-dynamic'` 필수

**Task D: `.claude/rules/project.md` 추가**

- 빌드 스크립트 또는 주의사항 섹션에 추가:
  - `next.config.ts`의 `cacheComponents: false` 유지 이유 명시

---

## 검증

문서 생성 후 `npm run format:check` 로 포맷 확인.

```

```
