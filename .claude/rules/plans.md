# Plans 디렉토리 규칙

## 📍 위치
- **Location**: `./docs/plans/`
- **Language**: Korean

## 🎯 목적
프로젝트 계획, 로드맵, 아키텍처 설계 등 사전 계획 문서 저장

## 📋 파일 명명 규칙

**형식**: `YYYY-MM-DD-HHMM-계획제목.md`

- 날짜와 시간은 필수 (24시간 형식)
- 계획 제목은 kebab-case 사용
- 예: `2026-03-24-1430-base-image-redesign.md`

## ✅ 올바른 예시
- ✅ `./docs/plans/2026-03-24-1430-base-image-redesign.md`
- ✅ `./docs/plans/2026-03-24-0900-multi-container-setup.md`
- ✅ `./docs/plans/2026-03-20-1600-ai-env-upgrade.md`

## ❌ 잘못된 예시
- ❌ `./plan.md` (루트 금지)
- ❌ `./docs/phase-1.md` (plans 폴더 누락)
- ❌ `./plans/setup.md` (docs 폴더 누락)
- ❌ `./docs/plans/phase-1-setup.md` (날짜/시간 누락)
- ❌ `./docs/plans/2026-03-24-base-image.md` (시간 누락)

## 📋 포함 내용
- 프로젝트 목표 및 범위
- 단계별 구현 계획
- 기술 스택 선정 이유
- 아키텍처 설계
- 타임라인 및 마일스톤
