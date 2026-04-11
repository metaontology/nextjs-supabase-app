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

> **⚡ Next.js build를 1차 Gate에서 제외한 이유**
> `next build`는 실행에 30~60초 소요됩니다. 매 커밋마다 실행하면 개발 흐름이 방해됩니다.
> 빠른 검사는 pre-commit, 빌드 검증은 push 전 check-all로 분리하는 것이 실용적입니다.

> **🔧 TypeScript를 lint-staged가 아닌 .husky/pre-commit에 직접 넣은 이유**
> `tsc --noEmit`은 스테이징된 개별 파일이 아니라 프로젝트 전체를 검사합니다.
> lint-staged에 넣어도 결국 전체 프로젝트를 보므로 효과가 동일합니다.
> pre-commit 파일에 직접 명시하는 것이 더 명시적이고 안전합니다.

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

1차, 2차 Gate 내용 작성 문서

```
rules/quality-gate.md
```

을 `프로젝트폴더/.claude/rules/quality-gate.md` 문서로 복사 후 클로드 코드로 현재 상황에 맞게 개선할 것

```
요약
- 1차 Gate: husky pre-commit 자동 실행 (Claude 개입 불필요)
- 2차 Gate: 코드 변경 후 check-all 실행 (Claude 책임)
- 실패 시 자동 수정 흐름 (format → lint:fix → 수동 수정) 포함
```

`프로젝트폴더/.claude/CLAUDE.md` (2곳 수정)

- 규칙 모듈 목록에 quality-gate.md 링크 추가
- 중요 원칙 6번: check-all 실행 필수로 업데이트

```
### 💻 코드 작성
- [`project.md`](./rules/project.md) - 기술 스택, 디렉토리 구조, 의존성
- [`coding-standards.md`](./rules/coding-standards.md) - 코딩 컨벤션, 패턴, 주의사항
- [`git-commit.md`](./rules/git-commit.md) - Conventional Commits 커밋 메시지 규칙
- [`quality-gate.md`](./rules/quality-gate.md) - Quality Gate 준수 규칙 (1차 자동/2차 Claude 책임)

...

## ⚠️ 중요 원칙

1. 모든 문서는 한국어로 작성
2. 파일 위치 규칙 엄수
3. Server/Client 컴포넌트 구분 준수
4. `@/` 경로 별칭 사용 (상대 경로 금지)
5. 신규 파일 작성 전 `project.md`와 `coding-standards.md` 참조
6. 코드 변경 후 작업 완료 전 `check-all` 실행 필수 → `quality-gate.md` 참조
7. UI·API·인증 플로우 변경 시 Playwright MCP로 E2E 테스트 수행 필수 → `runtime-checklist.md` 참조
```

클로드 위한 context 추가

```
docs/guides/ai-native-error-management.md
```

파일을 프로젝트폴더/docs/guides/ai-native-error-management.md 로 복사
