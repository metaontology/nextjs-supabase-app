# Quality Gate Toolchain 구축 실행

## Context

current*state 검증 완료 — 프롬프트 그대로 submit 가능.
02*방법1_Quality_Gate.md의 프롬프트 코드 블록을 Claude에 submit하면 됨.

## 실행할 프롬프트 위치

external*docs/onboarding/개발*오류*관리/02*방법1_Quality_Gate.md
→ "1단계: 프롬프트 작성" 섹션의 코드 블록 내용

## 이미 완료된 것 (프롬프트와 충돌 없음)

- .claude/rules/quality-gate.md 존재
- .claude/rules/runtime-checklist.md 존재
- CLAUDE.md 업데이트 완료

## 프롬프트 실행 후 생성/수정될 것

- prettier 설치 (.prettierrc, .prettierignore)
- eslint.config.mjs 수정 (prettier 통합)
- husky + .husky/pre-commit
- lint-staged 설정
- package.json scripts 추가
