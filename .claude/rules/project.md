# 프로젝트 정보

## 기술 스택

| 항목 | 버전 / 내용 |
|------|------------|
| Next.js | 15.5.3 (App Router) |
| React | 19 |
| TypeScript | 5 (strict 모드) |
| Tailwind CSS | 3.4.x |
| UI 라이브러리 | shadcn/ui (new-york 스타일, CSS 변수 기반) |
| 패키지 매니저 | npm |
| 백엔드/DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |

## 핵심 의존성

```json
{
  "@supabase/ssr": "Supabase SSR 클라이언트 (쿠키 기반 세션)",
  "@supabase/supabase-js": "Supabase 기본 클라이언트",
  "next-themes": "다크/라이트 테마 관리",
  "lucide-react": "아이콘",
  "class-variance-authority": "컴포넌트 variant 관리",
  "clsx": "조건부 클래스 병합",
  "tailwind-merge": "Tailwind 클래스 충돌 해결"
}
```

**미설치 / 향후 추가 예정:**
- `react-hook-form`, `zod`, `@hookform/resolvers` — Task 004에서 설치
- `recharts` — Task 006에서 설치

## 디렉토리 구조

```
app/
  layout.tsx              # RootLayout + ThemeProvider
  page.tsx                # 홈/랜딩 페이지 (/)
  globals.css
  auth/
    login/page.tsx
    sign-up/page.tsx
    sign-up-success/page.tsx
    forgot-password/page.tsx
    update-password/page.tsx
    error/page.tsx
    confirm/route.ts      # 이메일 인증 콜백 (GET)
  protected/
    layout.tsx
    page.tsx              # 인증된 사용자만 접근 가능

components/
  ui/                     # shadcn/ui 프리미티브 (button, card, input 등)
  auth-button.tsx         # Server Component — 로그인 여부에 따라 버튼 분기
  login-form.tsx          # Client Component
  sign-up-form.tsx        # Client Component
  logout-button.tsx       # Client Component
  forgot-password-form.tsx
  update-password-form.tsx
  hero.tsx
  theme-switcher.tsx      # Client Component

lib/
  utils.ts                # cn() + hasEnvVars
  supabase/
    client.ts             # createBrowserClient() — Client Components 전용
    server.ts             # createServerClient() — Server Components 전용 (async)
    proxy.ts              # updateSession() — 미들웨어 세션 갱신 로직
  types/
    database.types.ts     # Supabase CLI로 자동 생성된 DB 타입

proxy.ts                  # Next.js 미들웨어 (proxy 함수 export)
supabase/
  migrations/             # SQL 마이그레이션 파일

docs/
  PRD.md
  ROADMAP.md
  ISSUES.md
  AUTH_TESTING_GUIDE.md
  guides/                 # 개발 가이드 (project-structure, styling, forms 등)
  tasks/                  # Task별 명세서 파일 (TASK-XXX.md)
```

## 라우트 구조

| 경로 | 설명 | 접근 권한 |
|------|------|----------|
| `/` | 랜딩 페이지 | 공개 |
| `/auth/login` | 로그인 | 공개 |
| `/auth/sign-up` | 회원가입 | 공개 |
| `/auth/sign-up-success` | 가입 완료 안내 | 공개 |
| `/auth/forgot-password` | 비밀번호 재설정 요청 | 공개 |
| `/auth/update-password` | 비밀번호 변경 | 인증 필요 |
| `/auth/confirm` | 이메일 인증 콜백 (Route Handler) | 공개 |
| `/auth/error` | 인증 오류 페이지 | 공개 |
| `/protected` | 인증된 사용자용 예시 페이지 | 인증 필요 |

## 미들웨어 동작 (`proxy.ts`)

- `proxy.ts` 루트 파일이 Next.js 미들웨어 역할 (`proxy` 함수 export)
- `lib/supabase/proxy.ts`의 `updateSession()`을 호출
- 세션 쿠키 갱신 + 미인증 사용자를 `/auth/login`으로 리디렉션
- `/`(루트), `/auth/*` 경로는 인증 없이 접근 가능

## 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=  # Supabase publishable key (sb_publishable_* 형식)
```

> ⚠️ `ANON_KEY`가 아닌 `PUBLISHABLE_KEY`를 사용함 (최신 Supabase 형식)

## 데이터베이스 현황

### 생성된 테이블
- `profiles` — auth.users와 1:1, 회원가입 시 트리거로 자동 생성

### RLS 정책
- `profiles`: 본인 레코드만 SELECT/UPDATE 가능, 관리자(role='admin')는 전체 조회 가능

### Supabase DB 타입 재생성
```bash
npx supabase gen types typescript --project-id <project-id> > lib/types/database.types.ts
```

## 빌드 스크립트

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드 (TypeScript + ESLint 동시 검사)
npm run start   # 프로덕션 서버
npm run lint    # ESLint 검사
```

> ⚠️ `check-all`, `typecheck`, `format`, `lint:fix` 스크립트는 존재하지 않음
