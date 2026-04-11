---
name: shrimp-plan-task
description: shrimp task manager plan_task best practice 절차를 생성하고 실행하는 skill. description, requirements 경로, existingTasksReference 여부, 개선 플래그, 의존성, subagent를 위치 기반 6인자로 받아 3-step 명령을 출력 후 실행 여부를 확인한다.
argument-hint: <description> <requirements> <existing_tasks> <improve> <dependencies> <agent-path>
disable-model-invocation: true
---

다음 인자를 파싱하라: $ARGUMENTS

- 줄바꿈을 기준으로 분리, 각 줄 trim
- 1번째 줄 → description
- 2번째 줄 → requirements (`""`이면 빈값)
- 3번째 줄 → existing_tasks (`""`이면 false, `true`이면 true, `false`이면 false)
- 4번째 줄 → improve (`""`이면 비활성, `개선` 또는 `improve`이면 활성화 + existing_tasks 자동 true)
- 5번째 줄 → dependencies (`""`이면 빈값, 값이 있으면 existing_tasks 자동 true)
- 6번째 줄 → agent_path (`""`이면 빈값, 값이 있으면 파일명(확장자 제외)을 agent_name으로 추출)

파싱 후 실질 필수 인자를 검증하라:

- description이 빈값(`""`)이면 → **"description은 필수 인자입니다. 입력 후 다시 실행해주세요."** 출력 후 즉시 중단
- requirements가 빈값(`""`)이면 → **"requirements는 필수 인자입니다. ROADMAP.md 등 요구사항 문서 경로를 입력 후 다시 실행해주세요."** 출력 후 즉시 중단

existing_tasks 최종 결정:
- improve 활성화 OR dependencies 존재 → true (자동)
- 명시적 `true` 입력 → true
- 나머지(`""` 또는 `false`) → false

---

파싱 결과를 바탕으로 아래 형식의 명령을 생성하고 출력하라.

**전체 명령 헤더** (항상 포함):
```
mcp__shrimp-task-manager__plan_task 를 다음 절차대로 수행해줘:
```

**Step 1** (공통):
```
1. mcp__shrimp-task-manager__plan_task
   - description: {description}
   [requirements가 있는 경우에만] - requirements: @{requirements}
   - existingTasksReference: {existing_tasks}
   [improve가 활성화된 경우에만] - 이전 plan 개선해줘
   [dependencies가 있는 경우에만] - 의존성 TASK 참조: {dependencies}
```

**Step 2** (agent_path 유무로 분기):

[agent_path 있는 경우]
```
2. {agent_name} subagent에 태스크 설계 위임
   - call subagent: @{agent_path}
   - Step 1에서 반환된 프롬프트 내용을 그대로 전달
```

[agent_path 없는 경우]
```
2. 반환된 프롬프트 기반으로 태스크 분석 및 설계
   - 코드베이스 탐색 후 각 태스크 명세 작성
```

**Step 3** (공통):
```
3. mcp__shrimp-task-manager__split_tasks
   - 설계한 태스크 목록을 tasks.json에 저장
```

---

출력 후 반드시 질문하라:

**"위 절차대로 실행하시겠습니까? (Y/N)"**

- Y → 위 절차를 즉시 수행
- N → 중단
