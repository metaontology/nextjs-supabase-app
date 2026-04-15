# TailwindCSS v3 → v4 업그레이드 계획

## Context

`globals.css`가 이미 shadcn/ui CLI가 생성한 v4 문법(`@theme inline`, `@custom-variant dark`, OKLCH 색상값)으로 작성되어 있으나, 실제 npm 패키지는 v3.4.x가 설치된 불일치 상태다. v4를 설치하고, 설정 파일들을 v4 방식에 맞게 정리하는 것이 목표다.

---

## 현재 상태 요약

| 항목                   | 현재 값                               | 변경 방향                   |
| ---------------------- | ------------------------------------- | --------------------------- |
| `tailwindcss`          | `^3.4.1`                              | → `^4.x latest`             |
| `autoprefixer`         | `^10.4.20`                            | → 제거 (v4 내장)            |
| `@tailwindcss/postcss` | 미설치                                | → 추가                      |
| `tailwind.config.ts`   | JS 설정 파일 존재                     | → 삭제 (CSS로 대체)         |
| `postcss.config.mjs`   | `tailwindcss + autoprefixer`          | → `@tailwindcss/postcss` 만 |
| `globals.css` 1~5줄    | `@tailwind base/components/utilities` | → `@import "tailwindcss"`   |
| `globals.css` 7~64줄   | `@layer base` HSL 값 (dead code)      | → 삭제                      |
| `tailwindcss-animate`  | JS config plugins 배열에 등록         | → `@plugin` 디렉티브로 이동 |
| `.prettierrc`          | `tailwindStylesheet` 없음             | → 추가                      |

---

## 구현 단계

### Step 1: npm 패키지 변경

```bash
# 구버전 제거
npm uninstall autoprefixer

# v4 설치 (최신 버전)
npm install -D tailwindcss@latest @tailwindcss/postcss@latest
```

- `tailwindcss-animate`는 유지 (v4에서 `@plugin` 디렉티브로 로드 가능)
- `autoprefixer`만 제거 (`@tailwindcss/postcss`에 내장됨)

### Step 2: postcss.config.mjs 수정

**대상 파일**: `postcss.config.mjs`

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

### Step 3: globals.css 재작성

**대상 파일**: `app/globals.css`

변경 규칙:

1. `@tailwind base/components/utilities` (1~5줄) → `@import "tailwindcss";` + `@plugin "tailwindcss-animate";`
2. 첫 번째 `@layer base` (7~64줄, HSL 값) → **삭제** (OKLCH `:root`에 의해 덮어씌워지는 dead code)
3. `body { letter-spacing: var(--tracking-normal); }` → 두 번째 `@layer base`의 `body` 선언에 병합
4. 나머지(`@theme inline`, `:root` OKLCH, `.dark` OKLCH) → **그대로 유지**

**최종 globals.css 구조**:

```css
@import 'tailwindcss';
@plugin 'tailwindcss-animate';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* 기존 내용 그대로 유지 */
  --font-sans: Geist, sans-serif;
  /* ... */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--tracking-normal); /* ← 첫 번째 @layer base에서 이동 */
  }
}

:root {
  /* OKLCH 값 그대로 유지 */
}

.dark {
  /* OKLCH 값 그대로 유지 */
}
```

### Step 4: tailwind.config.ts 삭제

- `tailwind.config.ts` 파일 삭제
- 모든 설정은 이미 `globals.css`에 존재:
  - `darkMode: ['class']` → `@custom-variant dark` 디렉티브
  - `theme.extend.colors` → `@theme inline`의 `--color-*` 변수들
  - `theme.extend.borderRadius` → `@theme inline`의 `--radius-*` 변수들
  - `plugins: [tailwindcssAnimate]` → `@plugin "tailwindcss-animate"`
  - `content` 경로 → v4에서 자동 감지

### Step 5: .prettierrc 업데이트

`prettier-plugin-tailwindcss` v4 사용 시 `tailwindStylesheet` 옵션 필요:

```json
{
  "semi": false,
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./app/globals.css"
}
```

### Step 6: 빌드 캐시 클리어 + 검증

```bash
rm -rf .next
npm run check-all
```

---

## 수정 대상 파일

| 파일                 | 변경 유형                            |
| -------------------- | ------------------------------------ |
| `package.json`       | `npm install/uninstall` 로 자동 변경 |
| `postcss.config.mjs` | 수정                                 |
| `app/globals.css`    | 수정 (상단 5줄 교체 + 7~64줄 제거)   |
| `tailwind.config.ts` | 삭제                                 |
| `.prettierrc`        | 수정 (옵션 1줄 추가)                 |

---

## 검증 방법

1. `npm run check-all` 통과 확인 (typecheck → lint → format:check → build)
2. Playwright MCP로 `http://localhost:3000` 접속 — 라이트/다크 모드 시각 확인
3. 브라우저 콘솔 CSS 에러 없음 확인
