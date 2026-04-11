---
name: shrimp-execute-task
description: shrimp task manager execute_task best practice 절차를 생성하고 실행하는 skill. task명, agent 경로, 참고 자료, 추가 제약사항을 위치 기반 4인자로 받아 3-step 명령을 출력 후 실행 여부를 확인한다.
argument-hint: <task-name> <agent-path> <ref-data> <constraint>
disable-model-invocation: true
---

다음 인자를 파싱하라: $ARGUMENTS

- 줄바꿈을 기준으로 분리, 각 줄 trim
- 1번째 줄 → task_name
- 2번째 줄 → agent_path (`""`이면 빈값, 값이 있으면 파일명(확장자 제외)을 agent_name으로 추출)
- 3번째 줄 → ref_data (`""`이면 빈값)
- 4번째 줄 → constraint (`""`이면 빈값)

파싱 후 실질 필수 인자를 검증하라:

- task_name이 빈값(`""`)이면 → **"task-name은 필수 인자입니다. 입력 후 다시 실행해주세요."** 출력 후 즉시 중단

`shrimp_data/tasks.json`을 읽어 task_name을 검증하라:

- task_name과 정확히 일치하는 태스크 있음 → 그대로 진행
- 정확히 일치하는 태스크 없음 → task_name을 포함하는 태스크를 부분 일치로 검색:
  - 부분 일치 태스크 1개 found → 해당 태스크명으로 task_name을 대체하고 아래 메시지 출력 후 진행:
    ```
    ✅ tasks.json에서 매칭된 태스크:
    → {매칭된 태스크명} (status: {status})
    이 태스크로 진행합니다.
    ```
  - 부분 일치 태스크 여러 개 found → 목록 출력 후 중단:
    ```
    '{task_name}'에 매칭되는 태스크가 여러 개입니다. 태스크명을 더 구체적으로 입력해주세요:
    - Task 001: [태스크명] (status: completed)
    - Task 004: [태스크명] (status: pending)
    ```
  - 부분 일치도 없음 → PENDING 태스크 목록을 보여주며 재선택 요청 후 중단:
    ```
    tasks.json에서 '{task_name}'을 찾을 수 없습니다.
    현재 PENDING 태스크 목록:
    - Task 004: [태스크명]
    - Task 005: [태스크명]
    ...
    올바른 태스크명을 입력 후 다시 실행해주세요.
    ```

---

파싱 결과를 바탕으로 아래 형식의 명령을 생성하고 출력하라.

**전체 명령 헤더** (항상 포함):

```
mcp__shrimp-task-manager__execute_task 를 다음 절차대로 수행해줘:
```

**Step 1** (공통):

```
1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: {task_name}
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준)를 확인
   [ref_data가 있는 경우에만] - 참고 자료: {ref_data}
```

**Step 2** (agent_path 유무로 분기):

[agent_path 있는 경우]

```
2. {agent_name} subagent에 구현 위임
   - call subagent: @{agent_path}
   - Step 1에서 반환된 프롬프트 내용을 그대로 전달
   [constraint가 있는 경우에만] - 추가 제약사항: {constraint}
```

[agent_path 없는 경우]

```
2. 반환된 프롬프트 기반으로 직접 구현
   [constraint가 있는 경우에만] - 추가 제약사항: {constraint}
```

**Step 3** (공통):

```
3. mcp__shrimp-task-manager__verify_task
   - 구현 완료 후 {task_name} 완료 처리
```

---

출력 후 반드시 질문하라:

**"위 절차대로 실행하시겠습니까? (Y/N)"**

- Y → 위 절차를 즉시 수행
- N → 중단
