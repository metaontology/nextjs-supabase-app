---
name: write-history
description: 세션 작업을 마무리할 때 직접 실행해 완료 내역과 회고를 docs/history/에 기록
allowed-tools: Bash, Read, Write, Glob
disable-model-invocation: true
---

# write-history

현재 세션의 작업 내용을 `.claude/rules/history.md` 규칙에 따라 `docs/history/`에 문서로 저장한다.

## 워크플로우

### 1단계: 날짜/시간 및 git 컨텍스트 수집

```bash
# 파일명용 타임스탬프
date +%Y-%m-%d-%H%M

# 이번 세션 커밋 목록 (최근 6시간)
git log --oneline --since="6 hours ago"

# 변경 파일 요약
COUNT=$(git log --oneline --since="6 hours ago" | wc -l | tr -d ' ')
if [ "$COUNT" -gt "0" ]; then
  git diff HEAD~$COUNT HEAD --stat 2>/dev/null || git diff HEAD --stat
fi
```

### 2단계: 작업명 결정

git 커밋 메시지들을 분석해 이번 세션의 핵심 작업명을 **kebab-case**로 결정한다.

- 커밋이 있는 경우: 커밋 메시지의 scope 또는 description에서 추출
  - 예) `feat(examples): add forms page` → `examples-forms-page`
- 커밋이 없는 경우: 대화 맥락에서 핵심 작업을 추출
  - 예) "로그인 버그 수정" → `login-bug-fix`

### 3단계: docs/history/ 디렉토리 확인

```bash
mkdir -p docs/history
```

### 4단계: history 문서 작성 및 저장

**파일명 형식**: `YYYY-MM-DD-HHMM-작업명.md`
**저장 경로**: `docs/history/YYYY-MM-DD-HHMM-작업명.md`

아래 구조로 문서를 작성한다:

```markdown
# 작업명

## 세션 정보
- **날짜**: YYYY-MM-DD
- **작업 종료 시각**: HH:MM

## 작업 요약
(이번 세션의 핵심 내용을 1~3문장으로 요약)

## 완료된 작업
(git log 및 대화 맥락 기반으로 완료된 작업 목록)

- 작업1
- 작업2

## 주요 결정 사항
(기술적 결정, 방향 선택 등)

- **결정**: 내용 / **이유**: 이유

## 발생한 이슈 및 해결 방법

| 이슈 | 해결 방법 |
|------|----------|
| 이슈 내용 | 해결 방법 |

## 다음 작업을 위한 참고 사항

- 참고 사항1

## 회고

### 잘된 점
- 항목

### 개선할 점
- 항목

### 배운 점
- 항목
```

### 5단계: 완료 안내

문서가 생성되면 저장된 경로를 안내한다.

```
✅ history 문서가 저장되었습니다: docs/history/YYYY-MM-DD-HHMM-작업명.md
```

---

## 파일명 규칙 요약

| 항목 | 규칙 |
|------|------|
| 위치 | `docs/history/` |
| 형식 | `YYYY-MM-DD-HHMM-작업명.md` |
| 작업명 | kebab-case |
| 날짜/시간 | 필수, 24시간 형식 |
| 언어 | 한국어 |

**올바른 예시**
- `docs/history/2026-03-31-1500-examples-page-expansion.md`
- `docs/history/2026-03-31-0900-auth-bug-fix.md`

**잘못된 예시**
- `docs/history/examples.md` (날짜/시간 누락)
- `docs/history/2026-03-31-login.md` (시간 누락)
