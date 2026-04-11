# History 디렉토리 규칙

## 📍 위치

- **Location**: `./docs/history/`
- **Language**: Korean

## 🎯 목적

완료된 세션들의 영구 기록 및 프로젝트 진행 이력 관리

## 📋 파일 명명 규칙

**형식**: `YYYY-MM-DD-HHMM-작업명.md`

- 날짜와 시간은 필수 (24시간 형식)
- 작업명은 kebab-case 사용
- 예: `2026-03-24-1430-base-image-redesign.md`

## ✅ 올바른 예시

- ✅ `./docs/history/2024-03-17-1430-login-feature.md`
- ✅ `./docs/history/2024-03-17-0900-morning-planning.md`
- ✅ `./docs/history/2024-03-16-1600-bug-fixes.md`

## ❌ 잘못된 예시

- ❌ `./history.md` (루트 금지)
- ❌ `./docs/2024-03-17.md` (history 폴더 누락)
- ❌ `./docs/history/login-feature.md` (날짜/시간 누락)
- ❌ `./docs/history/2024-03-17-login.md` (시간 누락)

## 📋 규칙

1. **아카이브 특성**: 읽기 전용, 영구 보관, 시간순 자동 정렬
2. **Memory에서 이동**: 세션 종료 시 memory에서 history로 이동

## 📝 포함 내용

- 세션 정보 (날짜, 작업 시간)
- 작업 요약 및 완료된 작업
- 주요 결정 사항
- 발생한 이슈 및 해결 방법
- 다음 작업을 위한 참고 사항
- 회고 (잘된 점, 개선할 점, 배운 점)
