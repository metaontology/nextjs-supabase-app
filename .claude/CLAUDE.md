# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Claude Code 프로젝트 규칙

**프로젝트**: Gather — 5~30명 소규모 이벤트 관리 플랫폼 MVP
이 프로젝트는 모듈형 규칙 시스템을 사용합니다.

## 🚀 개발 명령어

```bash
npm run dev     # 개발 서버 시작 (localhost:3000)
npm run build   # 프로덕션 빌드 (새 파일/라우트/의존성 추가 시 필수)
npm run lint    # ESLint 검사
npm run start   # 프로덕션 서버 시작
```

## 📚 규칙 모듈

각 규칙은 `.claude/rules/` 디렉토리에 분리되어 있습니다:

### 🌐 커뮤니케이션

- [`language.md`](./rules/language.md) - 언어 및 커뮤니케이션 규칙

### 📂 파일 & 문서

- [`file-structure.md`](./rules/file-structure.md) - 파일 구조 규칙
- [`plans.md`](./rules/plans.md) - Plans 디렉토리 규칙
- [`dev-docs.md`](./rules/dev-docs.md) - Dev Docs 규칙
- [`memory.md`](./rules/memory.md) - Memory 디렉토리 규칙
- [`history.md`](./rules/history.md) - History 디렉토리 규칙
- [`roadmap.md`](./rules/roadmap.md) - Roadmap 파일 경로 및 포맷 규칙

### 💻 코드 작성

- [`project.md`](./rules/project.md) - 기술 스택, 디렉토리 구조, 의존성
- [`coding-standards.md`](./rules/coding-standards.md) - 코딩 컨벤션, 패턴, 주의사항
- [`git-commit.md`](./rules/git-commit.md) - Conventional Commits 커밋 메시지 규칙
- [`quality-gate.md`](./rules/quality-gate.md) - Quality Gate 준수 규칙 (1차 자동/2차 Claude 책임)
- [`runtime-checklist.md`](./rules/runtime-checklist.md) - 런타임 동적 오류 검증 (Playwright MCP 실행 시점)

### 🛠️ 도구 & 환경

- [`playwright.md`](./rules/playwright.md) - Playwright MCP 브라우저 제어 패턴 (CDP, 활성 탭 열기)

## ⚠️ 중요 원칙

1. 모든 문서는 한국어로 작성
2. 파일 위치 규칙 엄수
3. Server/Client 컴포넌트 구분 준수
4. `@/` 경로 별칭 사용 (상대 경로 금지)
5. 신규 파일 작성 전 `project.md`와 `coding-standards.md` 참조
6. 코드 변경 후 작업 완료 전 `check-all` 실행 필수 → `quality-gate.md` 참조
7. UI·API·인증 플로우 변경 시 Playwright MCP로 E2E 테스트 수행 필수 → `runtime-checklist.md` 참조

## 🚫 금지 사항

- ❌ `./docs/` 루트에 직접 문서 작성
- ❌ 프로젝트 루트에 `.md` 파일 작성 (대문자 관용 메타 파일 제외 — `README.md`, `ROADMAP.md` 등)
- ❌ Server Component에서 함수 props 전달
- ❌ 상대 경로 import (`../../`) 사용
- ❌ Supabase 클라이언트를 전역 변수에 저장 (Fluid compute 환경 호환 필수)

---

_마지막 업데이트: 2026-04-11_
