---
name: write-plan
description: 논의된 계획을 docs/plans/ 규정에 맞는 파일로 저장할 때 직접 실행. 제목 지정 가능 (/write-plan 제목)
allowed-tools: Bash, Read, Write, Glob
disable-model-invocation: true
---

# write-plan

현재 대화에서 논의된 계획을 `.claude/rules/plans.md` 규칙에 따라 `docs/plans/`에 문서로 저장한다.

## 현재 docs/plans/ 파일 목록 (소스 파악용)

!`ls -t docs/plans/ 2>/dev/null | head -10 || echo "(없음)"`

## 워크플로우

### 1단계: 날짜/시간 수집

```bash
date +%Y-%m-%d-%H%M
```

### 2단계: 계획 제목 결정

- `$ARGUMENTS`가 있으면 kebab-case로 변환해 사용
  - 예) `/write-plan 인증 리팩토링` → `auth-refactoring`
- 없으면 대화 맥락에서 계획의 핵심 주제를 kebab-case로 추출
  - 예) "로그인 페이지 구현 계획 논의" → `login-page-implementation`

### 3단계: 소스 파악

위 파일 목록에서 **가장 최근의 random-named 파일**이 있으면 `Read` 도구로 읽어 내용을 참고한다.

> random-named 파일 판별: 날짜 형식(`YYYY-MM-DD-HHMM-`)으로 시작하지 않는 파일
> 예) `snoopy-kindling-turtle.md`, `reactive-sauteeing-shannon.md` 등

소스 없으면 대화 맥락만 사용한다.

### 4단계: docs/plans/ 디렉토리 확인

```bash
mkdir -p docs/plans
```

### 5단계: plan 문서 작성 및 저장

**파일명 형식**: `YYYY-MM-DD-HHMM-계획제목.md`
**저장 경로**: `docs/plans/YYYY-MM-DD-HHMM-계획제목.md`

아래 구조로 문서를 작성한다 (plans.md 규정 준수):

```markdown
# 계획 제목

## 프로젝트 목표 및 범위
(무엇을 왜 만드는지, 범위와 제약사항)

## 단계별 구현 계획

1. 단계 1
2. 단계 2

## 기술 스택 선정 이유
(채택한 기술과 선정 근거 — 해당 시)

## 아키텍처 설계
(구조, 컴포넌트 관계, 디렉토리 구조 등 — 해당 시)

## 타임라인 및 마일스톤
(주요 시점과 기대 결과물 — 해당 시)
```

**작성 기준**:
- random-named 파일의 내용이 있으면 → 해당 내용을 위 구조로 재편성
- 없으면 → 대화 맥락에서 계획을 재구성

### 6단계: 완료 안내

```
✅ plan 문서가 저장되었습니다: docs/plans/YYYY-MM-DD-HHMM-계획제목.md
```

---

## 파일명 규칙 요약

| 항목 | 규칙 |
|------|------|
| 위치 | `docs/plans/` |
| 형식 | `YYYY-MM-DD-HHMM-계획제목.md` |
| 계획 제목 | kebab-case |
| 날짜/시간 | 필수, 24시간 형식 |
| 언어 | 한국어 |

**올바른 예시**
- `docs/plans/2026-03-31-1500-auth-refactoring.md`
- `docs/plans/2026-03-31-0900-dashboard-redesign.md`

**잘못된 예시**
- `docs/plans/auth.md` (날짜/시간 누락)
- `docs/plans/2026-03-31-login.md` (시간 누락)
