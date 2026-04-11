# Preliminary: 개발 오류

클로드 코드를 사용한 AI Native Nextjs 개발 시 오류를 줄이는 핵심 방법은 3가지 입니다.

## AI Native 개발의 특성

Claude가 생성하는 코드는 빠르지만, 다음과 같은 오류를 포함할 수 있습니다:

- 타입은 맞지만 Next.js Server/Client 컴포넌트 경계를 위반하는 코드
- 최신 버전에서 변경된 API를 구버전 방식으로 사용 (예: Next.js 15 async params)
- 린트·포맷 규칙을 따르지 않는 코드 스타일
- 개별 파일은 정상이지만 빌드 시점에 실패하는 구성

⚠️ 사람이 매번 검토하지 않으면 이 오류들이 커밋마다 축적되어 나중에 큰 비용으로 돌아옵니다.
세 가지 방법으로 각 레이어의 오류를 자동으로 차단합니다.

1 🛡️ 정적 오류 관리 (Quality Gate)
2 🌐 런타임 동적 오류 관리 (Playwright MCP)
3 📚 명확한 기술스택 정의 (Context7 MCP)

세 방법이 서로 다른 레이어의 오류를 잡습니다.

|                   | 목표        | 대상                | 시점         | 방식                |
| ----------------- | ----------- | ------------------- | ------------ | ------------------- |
| 🛡️ Quality Gate   | 코드 품질   | 타입·린트·빌드 오류 | 커밋/push 전 | 자동 차단           |
| 🌐 Playwright MCP | 동작 검증   | UI·API·인증 플로우  | 구현 후      | 브라우저 직접 조작  |
| 📚 Context7 MCP   | 지식 정확성 | 잘못된 API 사용     | 코드 작성 전 | 최신 공식 문서 참조 |

클로드 코드 환경에서 특히 효과적인 이유:

- 🛡️ Quality Gate: 클로드가 코드를 생성할 때 발생하기 쉬운 타입 오류, Next.js 컨벤션 위반을 자동 차단
- 🌐 Playwright MCP: 클로드가 구현 후 스스로 브라우저를 열어 검증 — 사람이 확인하지 않아도 동작 보장
- 📚 Context7 MCP: Claude의 훈련 데이터 한계를 보완 — 최신 Next.js/라이브러리 API를 실시간으로 참조해 잘못된 API 사용 차단

```
📚 Context7 MCP (지식) — 최신 API 문서 참조
  ↓
코드 작성
  ↓
🛡️ Quality Gate (정적) — 타입·린트·빌드 오류 차단
  ↓
🌐 Playwright MCP (동적) — 실제 브라우저 동작 검증
  ↓
커밋/배포
```

---

# 🛡️ Quality Gate

여기선 핵심 방법중 하나인 Quality Gate 구축을 설명합니다.

## Quality Gate 구축

> Quality Gate
> 코드가 기준을 통과해야만 다음 단계(커밋 → push → 배포)로 진행 가능하도록 막는 관문

### Local Quality Gate

배포 전에 발생할 오류를 커밋/push 시점으로 앞당겨 잡는 로컬 품질 게이트 구성

```
코드 품질 자동화        도구로 품질 검사를 자동 수행
Shift Left             오류를 배포 직전이 아닌 개발 초기(로컬)에서 잡는 전략
로컬 CI                 CI 서버에서 돌리던 검사를 개발자 PC에서 먼저 실행
```

를 위해 Developer Toolchain (개발자 작업 환경의 도구 체계 전체) 구축 할 것

### Gate 구성

|               | 1차 Gate<br>커밋 시 자동 실행<br>(pre-commit) | 2차 Gate<br>push 시 수동 실행<br>(check-all) |
| ------------- | --------------------------------------------- | -------------------------------------------- |
| ESLint        | `--fix` (자동 수정)                           | `npm run lint` (검사만)                      |
| Prettier      | `--write` (자동 수정)                         | `format:check` (검사만)                      |
| TypeScript    | tsc --noEmit                                  | tsc --noEmit                                 |
| Next.js build | ❌                                            | `npm run build` ✅                           |
| 비교          | 빠름, 자동 수정 포함                          | 1차 Gate + Next.js 빌드                      |

## 개발 도구 설정

Developer Toolchain (개발자 작업 환경의 도구 체계 전체) 구축 위한

개발 도구 설정을 과정별로 진행 할 것

### 1 Toolchain 구축

도구 설치 및 관련 파일 생성한다.
(클로드에 위임해서 작업)

#### 1단계: 프롬프트 작성

무엇을 설치/설정할지 정의

```
<role>
웹 애플리케이션 개발 도구 설정 전문가.
Next.js + TypeScript + ESLint 9.x 환경의 코드 품질 자동화 설정을 담당합니다.
</role>


<task>
코드 품질 자동화 개발 도구를 설정해주세요.
커밋 시점에 타입 오류·린트 오류·포맷 불일치가 있으면 자동으로 차단되는 환경을 구성합니다.
</task>

<requirements>
<tool name="prettier">
  - prettier + prettier-plugin-tailwindcss 설치
  - .prettierrc 생성 (semi: false, singleQuote: true, plugins: ["prettier-plugin-tailwindcss"] 포함)
  - .prettierignore 생성
  - eslint-config-prettier 반드시 설치하여 ESLint 규칙 충돌 방지
</tool>

<tool name="eslint_integration">
  - 기존 eslint.config.mjs를 읽고 분석한 뒤 수정
  - ESLint 9 flat config 방식으로 prettier 통합
  - 기존 next/core-web-vitals, next/typescript 규칙 유지
</tool>

<tool name="husky">
  - husky + lint-staged 설치
  - pre-commit 훅 실행 순서:
      1. npm run typecheck (tsc --noEmit) ← .husky/pre-commit에 직접 추가
      2. lint-staged 실행
  - prepare 스크립트 추가
</tool>

<tool name="lint_staged">
  - *.{js,jsx,ts,tsx}: eslint --fix → prettier --write
  - *.{json,css,md}: prettier --write
</tool>

<tool name="scripts">
  - typecheck: tsc --noEmit
  - lint:fix: eslint . --fix
  - format: prettier --write .
  - format:check: prettier --check .
  - check-all: npm run typecheck && npm run lint && npm run format:check && npm run build
</tool>
</requirements>

<constraints>
- ESLint 9 flat config 방식(eslint.config.mjs)만 사용 — .eslintrc 형식 절대 생성 금지
- eslint.config.mjs는 삭제 후 재생성 금지, 반드시 기존 파일 내용을 읽은 뒤 수정
- next/core-web-vitals, next/typescript 규칙은 제거하지 말고 유지
- eslint-config-prettier는 eslintConfig 배열의 마지막 항목으로 추가 (규칙 우선순위)
- 패키지 매니저는 npm만 사용 (yarn, pnpm 명령 금지)
- tsconfig.json의 "strict": true 유지 — typecheck 스크립트는 이 설정을 활용
- husky v9 이상은 husky add 명령이 없음 — .husky/pre-commit 파일을 직접 생성
- 기존 scripts(dev, build, start, lint)는 유지하고 새 스크립트를 추가만 할 것
</constraints>

<current_state>
  현재 프로젝트 설정:

  package.json scripts:
    "dev": "next dev"
    "build": "next build"
    "start": "next start"
    "lint": "eslint ."

  devDependencies (관련 항목):
    "eslint": "^9"
    "eslint-config-next": "15.3.1"
    "typescript": "^5"
    → prettier, husky, lint-staged 미설치

  eslint.config.mjs:
    FlatCompat으로 "next/core-web-vitals", "next/typescript" 확장 중
    prettier 통합 없음

  tsconfig.json:
    "strict": true, "noEmit": true 설정됨
</current_state>

<process>
  1. 분석: 위 current_state와 실제 파일을 재확인하여 충돌 가능성 파악
  2. 계획 제시: 설치할 패키지 목록과 변경될 파일 목록을 먼저 보여줄 것
  3. 실행: prettier → eslint 통합 → husky/lint-staged → scripts 순서로 진행
  4. 검증: npm run lint, npm run typecheck, npm run format:check 실행 후
           빈 커밋 시도로 pre-commit 훅 동작 확인
</process>
```

> ⚠️ 프로젝트 생성 시점에 아래 항목을 최신 버전 기준으로 업데이트할 것
>
> - `<current_state>` — 실제 package.json 의존성 버전 및 eslint.config.mjs 설정 반영
> - `<constraints>` — 버전별 주의사항 (예: husky 메이저 버전에 따른 초기화 방식 변경)

#### 2단계: 프롬프트 수행

1단계 프롬프트 실행해서 클로드가 실제 도구 설치·파일 생성

### 2 Toolchain 정착

클로드 rule 로 만들어서 클로드가 Quality Gate를 규칙으로 인식하고 매 작업마다 적용시킨다.

1차, 2차 Gate 내용을 `.claude/rules/quality-gate.md` 문서로 작성

```
요약
- 1차 Gate: husky pre-commit 자동 실행 (Claude 개입 불필요)
- 2차 Gate: 코드 변경 후 check-all 실행 (Claude 책임)
- 실패 시 자동 수정 흐름 (format → lint:fix → 수동 수정) 포함
```

`.claude/CLAUDE.md` (2곳 수정)

- 규칙 모듈 목록에 quality-gate.md 링크 추가
- 중요 원칙 6번: check-all 실행 필수로 업데이트

---

# 🌐 런타임 동적 오류 관리

여기선 핵심 방법 중 하나인 Playwright MCP를 활용한 런타임 검증을 설명합니다.

## Playwright MCP 개요

🛡️ Quality Gate가 커밋/push 시점의 정적 오류를 차단한다면,
Playwright MCP는 구현 직후 실제 브라우저에서 동작 오류를 검증합니다.

> 클로드가 구현 후 스스로 브라우저를 열어 검증 — 사람이 확인하지 않아도 동작 보장

## Playwright MCP 설정

CDP(Chrome DevTools Protocol) 연결 기반으로 실제 브라우저를 제어합니다.

설정 방법 및 브라우저 제어 패턴 → `.claude/rules/playwright.md` 참조

## 검증 규칙 정착

클로드 rule 로 만들어서 클로드가 언제 Playwright 검증을 실행해야 하는지 인식하게 한다.

언제 실행할지, 무엇을 검증할지, 통과 기준은 무엇인지
→ `.claude/rules/runtime-checklist.md` 문서로 작성

---

# 📚 명확한 기술스택 정의

여기선 핵심 방법 중 하나인 Context7 MCP를 통한 기술스택 정의를 설명합니다.

📚 Context7 MCP는 프로젝트 초기 MCP 설정 시 함께 구성합니다. 별도 가이드라인 없이 사용 가능하므로 이 문서에서는 다루지 않습니다.
