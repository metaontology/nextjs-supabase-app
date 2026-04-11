# 파일 구조 규칙

## ⚠️ 중요 규칙

### 🚫 금지 사항

- ❌ `./docs/` 루트에 직접 `.md` 파일 작성
- ❌ 프로젝트 루트에 `.md` 파일 작성 (대문자 관용 메타 파일 제외 — `README.md`, `ROADMAP.md` 등)
- ❌ 규칙에 명시되지 않은 위치에 문서 작성

### ✅ 허용 사항

- ✅ `./docs/plans/` - 계획 문서
- ✅ `./docs/guides/` - 개발 가이드 (이미 존재하는 디렉토리, 신규 가이드 추가 시 사용)
- ✅ `./docs/tasks/` - Task별 명세서 파일 (TASK-XXX.md)
- ✅ `./docs/history/` - 완료된 세션 기록
- ✅ `./docs/roadmaps/` - 이전 버전 로드맵 보관

## 📋 파일 명명 규칙

### 일반 문서

- kebab-case 사용: `feature-implementation.md`
- 날짜 포함 시: `2024-03-17-feature-name.md`

### docs/plans/ 문서

- 형식: `YYYY-MM-DD-HHMM-계획제목.md` (날짜와 시간 필수)
- 예: `2026-03-24-1430-base-image-redesign.md`

### docs/history/ 문서

- 형식: `YYYY-MM-DD-HHMM-작업명.md` (날짜와 시간 필수)
- 예: `2026-03-24-1430-login-feature.md`

### 소스 코드

- 프로젝트 컨벤션 준수 (camelCase, snake_case 등)
- 기능별 디렉토리 구조 유지

## 🔍 예시

### ✅ 올바른 구조

```
./docs/plans/2026-03-24-1430-event-crud-design.md
./docs/guides/realtime-subscriptions.md
./docs/tasks/TASK-009.md
./docs/history/2026-04-11-1430-auth-implementation.md
./app/protected/page.tsx
./components/login-form.tsx
```

### ❌ 잘못된 구조

```
./plan.md                                   # 루트 금지
./docs/login.md                             # docs 루트 금지
./memory.md                                 # 루트 금지
./docs/plans/phase-1-setup.md              # 날짜/시간 누락
./docs/plans/2026-03-24-base-image.md      # 시간 누락
./docs/history/2024-03-17.md               # 시간 누락
./docs/history/login-feature.md            # 날짜/시간 누락
```
