# shrimp-plan-task

shrimp task manager `plan_task` best practice 절차를 자동 생성하고 실행하는 skill.

## 사용법

```
@/home/hgjun/workspace/claude-lab/invoice-web/.claude/skills/mcp/shrimp-task-manager/shrimp-plan-task/SKILL.md
{description}
{requirements}
{existing_tasks}
{improve}
{dependencies}
{agent-path}
```

- 인자는 **줄바꿈으로 구분**, **순서 고정**
- 인자가 6개로 고정되어 있어 위치로 구분합니다
- `description`만 실질적 필수이며, 나머지 5개는 사용하지 않는 경우 `""`를 입력합니다

## 인자

| 인자             | 필수                | 위치     | 설명                                                                               |
| ---------------- | ------------------- | -------- | ---------------------------------------------------------------------------------- |
| `description`    | ✅ 실질 필수        | 1번째 줄 | plan_task의 description 파라미터                                                   |
| `requirements`   | ✅ 실질 필수        | 2번째 줄 | ROADMAP.md 등 요구사항 문서 절대 경로                                              |
| `existing_tasks` | ✅ (미사용 시 `""`) | 3번째 줄 | `true` / `false` / `""` (기본: false)                                              |
| `improve`        | ✅ (미사용 시 `""`) | 4번째 줄 | `개선` 또는 `improve` 입력 시 활성화. 자동으로 existingTasksReference: true        |
| `dependencies`   | ✅ (미사용 시 `""`) | 5번째 줄 | 의존 태스크 목록 (예: `Task 001, Task 002`). 자동으로 existingTasksReference: true |
| `agent-path`     | ✅ (미사용 시 `""`) | 6번째 줄 | 태스크 설계를 위임할 subagent 절대 경로                                            |

> 인자 순서가 고정되어 있으므로 중간 인자를 생략할 수 없습니다. 사용하지 않는 인자는 반드시 `""`로 자리를 채워주세요.
>
> ⚠️ `description` 또는 `requirements`가 `""`이면 실행을 중단하고 재입력을 요청합니다.
>
> 💡 타입 감지 방식은 유사한 형태의 입력이 늘어날수록 오분류 위험이 커집니다. 위치 기반 고정 인자 방식으로 입력 일관성과 예측 가능성을 높였습니다.

> **existingTasksReference 자동 결정**: `improve` 활성화 또는 `dependencies` 존재 시 자동으로 `true`로 설정됩니다.

## 예시

**① description만 (신규 plan, 직접 설계):**

```
@...SKILL.md
Phase 2: UI/UX 완성 (더미 데이터 활용)
""
""
""
""
""
```

**② description + requirements + true (기존 tasks 참조, 직접 설계):**

```
@...SKILL.md
Phase 2: UI/UX 완성 (더미 데이터 활용)
/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
true
""
""
""
```

**③ description + requirements + 개선 + dependencies (재계획):**

```
@...SKILL.md
Phase 2: UI/UX 완성 (더미 데이터 활용)
/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
""
개선
Task 001, Task 002, Task 003
""
```

**④ description + requirements + agent-path (subagent 위임):**

```
@...SKILL.md
Phase 2: UI/UX 완성 (더미 데이터 활용)
/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
""
""
""
/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
```

## 생성되는 명령 포맷

### ① description만

```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__plan_task
   - description: Phase 2: UI/UX 완성 (더미 데이터 활용)
   - existingTasksReference: false

2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
   - 코드베이스 탐색 후 각 태스크 명세 작성

3. mcp__shrimp-task-manager__split_tasks
   - 설계한 태스크 목록을 tasks.json에 저장
```

### ③ description + requirements + 개선 + dependencies

```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__plan_task
   - description: Phase 2: UI/UX 완성 (더미 데이터 활용)
   - requirements: @/home/hgjun/workspace/claude-lab/invoice-web/docs/ROADMAP.md
   - existingTasksReference: true
   - 이전 plan 개선해줘
   - 의존성 TASK 참조: Task 001, Task 002, Task 003

2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
   - 코드베이스 탐색 후 각 태스크 명세 작성

3. mcp__shrimp-task-manager__split_tasks
   - 설계한 태스크 목록을 tasks.json에 저장
```

## 동작 흐름

1. 인자 파싱 후 3-step 명령 생성 및 출력
2. `"위 절차대로 실행하시겠습니까? (Y/N)"` 확인
3. Y → 즉시 실행 / N → 중단

## execute-task와 비교

|         | shrimp-execute-task | shrimp-plan-task      |
| ------- | ------------------- | --------------------- |
| 목적    | 태스크 1개 실행     | 태스크 묶음 계획 수립 |
| 인자 수 | 4개                 | 6개                   |
| Step 3  | `verify_task`       | `split_tasks`         |
