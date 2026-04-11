# Dev Docs 디렉토리 규칙

## 📍 위치
- **개발 가이드**: `./docs/guides/`
- **Task 명세서**: `./docs/tasks/`
- **Language**: Korean

## 🎯 목적
- `guides/`: 개발 패턴, 라이브러리 사용법, 아키텍처 가이드 등 참조 문서
- `tasks/`: Task별 구현 명세서 (TASK-XXX.md 형식)

## ✅ 올바른 예시
- ✅ `./docs/guides/supabase-realtime.md`
- ✅ `./docs/guides/storage-upload.md`
- ✅ `./docs/tasks/TASK-009.md`
- ✅ `./docs/tasks/TASK-010.md`

## ❌ 잘못된 예시
- ❌ `./login.md` (루트 금지)
- ❌ `./docs/login.md` (docs 루트 금지)
- ❌ `./docs/dev/api.md` (dev 폴더 미사용)

## 📋 Task 파일 구조 (docs/tasks/TASK-XXX.md)

```markdown
# Task XXX: [작업명]

## 개요
- **목표**: [작업의 핵심 목표]
- **관련 기능**: [F001, F002 등]
- **의존성**: [이전에 완료되어야 할 Task]

## 구현 사항
- [ ] 세부 구현 항목 1

## 수락 기준
- 기준 1: [측정 가능한 완료 조건]

## 테스트 체크리스트 (API/비즈니스 로직 작업 시 필수)
- [ ] Playwright MCP 테스트 시나리오

## 관련 파일
- /app/[경로]/page.tsx
```
