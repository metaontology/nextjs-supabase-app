# 🌐 런타임 동적 오류 관리

여기선 핵심 방법 중 하나인 Playwright MCP를 활용한 런타임 검증을 설명합니다.

## Playwright MCP 개요

🛡️ Quality Gate가 커밋/push 시점의 정적 오류를 차단한다면,
Playwright MCP는 구현 직후 실제 브라우저에서 동작 오류를 검증합니다.

> 클로드가 구현 후 스스로 브라우저를 열어 검증 — 사람이 확인하지 않아도 동작 보장

## Playwright MCP 설정

CDP(Chrome DevTools Protocol) 연결 기반으로 실제 브라우저를 제어합니다.

설정 방법 및 브라우저 제어 패턴

```
rules/playwright.md
```

→ `프로젝트폴더/.claude/rules/playwright.md` 로 복사. ⚠️ 환경에 맞게 수정 필요!

## 검증 규칙 정착

클로드 rule 로 만들어서 클로드가 언제 Playwright 검증을 실행해야 하는지 인식하게 한다.

언제 실행할지, 무엇을 검증할지, 통과 기준은 무엇인지

```
rules/runtime-checklist.md
```

→ `프로젝트폴더/.claude/rules/runtime-checklist.md` 로 복사

`프로젝트폴더/.claude/CLAUDE.md` (2곳 수정)

- 규칙 모듈 목록에 runtime-checklist.md 링크 추가
- 중요 원칙 7번 내용 추가

```
### 💻 코드 작성
- [`project.md`](./rules/project.md) - 기술 스택, 디렉토리 구조, 의존성
- [`coding-standards.md`](./rules/coding-standards.md) - 코딩 컨벤션, 패턴, 주의사항
- [`git-commit.md`](./rules/git-commit.md) - Conventional Commits 커밋 메시지 규칙
- [`quality-gate.md`](./rules/quality-gate.md) - Quality Gate 준수 규칙 (1차 자동/2차 Claude 책임)
- [`runtime-checklist.md`](./rules/runtime-checklist.md) - 런타임 동적 오류 검증 (Playwright MCP 실행 시점)

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
