# shrimp-continuous-mode

shrimp task manager `continuous mode` best practice 절차를 자동 생성하고 실행하는 skill.

## 사용법

```
@/home/hgjun/workspace/claude-lab/invoice-web/.claude/skills/mcp/shrimp-task-manager/shrimp-continuous-mode/SKILL.md
{start-task}
{end-task}
{agent-path}
{ref-data}
{constraint}
```

- 인자는 **줄바꿈으로 구분**, **순서 고정**
- 인자가 5개로 고정되어 있어 위치로 구분합니다
- 사용하지 않는 인자는 `""`를 입력합니다 (모든 인자가 `""` 인 경우 전체 태스크 직접 구현)

## 인자

| 인자 | 필수 | 위치 | 설명 |
|------|------|------|------|
| `start-task` | ✅ (미사용 시 `""`) | 1번째 줄 | 시작 태스크명. `""`이면 PENDING 전체를 처음부터 실행 |
| `end-task` | ✅ (미사용 시 `""`) | 2번째 줄 | 종료 태스크명. `""`이면 마지막 PENDING 태스크까지 실행 |
| `agent-path` | ✅ (미사용 시 `""`) | 3번째 줄 | 모든 태스크 구현을 위임할 subagent 절대 경로 |
| `ref-data` | ✅ (미사용 시 `""`) | 4번째 줄 | 모든 태스크 실행 시 공통으로 참고할 파일 경로 또는 glob 패턴 |
| `constraint` | ✅ (미사용 시 `""`) | 5번째 줄 | 모든 태스크 구현 시 적용할 공통 추가 제약사항 |

> 인자 순서가 고정되어 있으므로 중간 인자를 생략할 수 없습니다. 사용하지 않는 인자는 반드시 `""`로 자리를 채워주세요.
>
> 💡 타입 감지 방식은 유사한 형태의 입력이 늘어날수록 오분류 위험이 커집니다. 위치 기반 고정 인자 방식으로 입력 일관성과 예측 가능성을 높였습니다.

## When to Use

| 상황 | 방식 |
|------|------|
| 참고자료 / subagent / 추가 제약사항 모두 없음 | **이 skill 사용** ✅ |
| 참고자료 / subagent / 추가 제약사항이 있더라도 모든 태스크에 동일하게 적용 | **이 skill 사용** ✅ |
| 태스크마다 참고자료가 다름 | `shrimp-execute-task` 개별 사용 |
| 태스크 유형에 따라 subagent가 다름 | `shrimp-execute-task` 개별 사용 |
| 태스크별로 추가 제약사항이 다름 | `shrimp-execute-task` 개별 사용 |

## 예시

**① 모두 "" (전체 태스크 직접 구현):**
```
@...SKILL.md
""
""
""
""
""
```

**② start-task만 (특정 태스크부터 끝까지 직접 구현):**
```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
""
""
""
""
```

**③ start-task + end-task (범위 지정 직접 구현):**
```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
Task 005: 견적서 조회 페이지 UI 구현
""
""
""
```

**④ agent-path만 (전체 태스크 subagent 위임):**
```
@...SKILL.md
""
""
/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
""
""
```

**⑤ constraint만 (전체 태스크 직접 구현 + 추가 제약사항):**
```
@...SKILL.md
""
""
""
""
모든 소스 코드는 src/ 디렉토리 하위에 생성할 것
```

**⑥ 전체 옵션 (범위 지정 + subagent + 참고 자료 + 추가 제약사항):**
```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
Task 005: 견적서 조회 페이지 UI 구현
/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
./data/*
모든 소스 코드는 src/ 디렉토리 하위에 생성할 것
```

## 생성되는 명령 포맷

### ① 모두 ""
```
모든 태스크를 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__list_tasks
   - PENDING 상태 태스크 목록 확인

2. 각 태스크를 의존성 순서대로 반복 실행:
   a. mcp__shrimp-task-manager__execute_task
      - taskId 조회 후 실행
      - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
   b. 반환된 프롬프트 기반으로 직접 구현
   c. mcp__shrimp-task-manager__verify_task
      - 구현 완료 후 해당 태스크 완료 처리

3. 모든 PENDING 태스크 완료될 때까지 반복
```

### ③ start-task + end-task
```
Task 003: 타입 정의 및 데이터 모델 설계부터 Task 005: 견적서 조회 페이지 UI 구현까지 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task 003: 타입 정의 및 데이터 모델 설계부터 시작
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인

2. 반환된 프롬프트 기반으로 직접 구현

3. mcp__shrimp-task-manager__verify_task
   - 완료 처리 후 Task 005: 견적서 조회 페이지 UI 구현까지 반복 진행
   - Task 005: 견적서 조회 페이지 UI 구현 완료 후 중단 (이후 태스크는 실행하지 않음)
```

### ⑥ 전체 옵션
```
Task 003: 타입 정의 및 데이터 모델 설계부터 Task 005: 견적서 조회 페이지 UI 구현까지 continuous mode로 실행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task 003: 타입 정의 및 데이터 모델 설계부터 시작
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
   - 참고 자료: ./data/*

2. nextjs-app-developer subagent에 구현 위임
   - call subagent: @/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
   - Step 1에서 반환된 프롬프트 내용을 그대로 전달
   - 추가 제약사항: 모든 소스 코드는 src/ 디렉토리 하위에 생성할 것

3. mcp__shrimp-task-manager__verify_task
   - 완료 처리 후 Task 005: 견적서 조회 페이지 UI 구현까지 반복 진행
   - Task 005: 견적서 조회 페이지 UI 구현 완료 후 중단 (이후 태스크는 실행하지 않음)
```

## 동작 흐름

1. 인자 파싱
2. start-task가 있는 경우, `shrimp_data/tasks.json`에서 태스크명 확인 (불일치 시 PENDING 목록 안내 후 중단)
3. end-task가 있는 경우, `shrimp_data/tasks.json`에서 태스크명 확인 (불일치 시 PENDING 목록 안내 후 중단)
4. 명령 생성 및 출력
5. `"위 절차대로 실행하시겠습니까? (Y/N)"` 확인
6. Y → 즉시 실행 / N → 중단
