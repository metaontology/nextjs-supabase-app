---
name: shrimp-continuous-mode
description: shrimp task manager continuous mode best practice 절차를 생성하고 실행하는 skill. 시작 태스크명, 종료 태스크명, agent 경로, 참고 자료, 추가 제약사항을 위치 기반 5인자로 받아 continuous mode 명령을 출력 후 실행 여부를 확인한다.
argument-hint: <start-task> <end-task> <agent-path> <ref-data> <constraint>
disable-model-invocation: true
---

다음 인자를 파싱하라: $ARGUMENTS

- 줄바꿈을 기준으로 분리, 각 줄 trim
- 1번째 줄 → start_task (`""`이면 빈값)
- 2번째 줄 → end_task (`""`이면 빈값)
- 3번째 줄 → agent_path (`""`이면 빈값, 값이 있으면 파일명(확장자 제외)을 agent_name으로 추출)
- 4번째 줄 → ref_data (`""`이면 빈값)
- 5번째 줄 → constraint (`""`이면 빈값)

start_task가 빈값이 아닌 경우, `shrimp_data/tasks.json`을 읽어 start_task를 검증하라:

- start_task와 정확히 일치하는 태스크 있음 → 그대로 진행
- 정확히 일치하는 태스크 없음 → start_task를 포함하는 태스크를 부분 일치로 검색:
  - 부분 일치 태스크 1개 found → 해당 태스크명으로 start_task를 대체하고 아래 메시지 출력 후 진행:
    ```
    ✅ tasks.json에서 매칭된 태스크:
    → {매칭된 태스크명} (status: {status})
    이 태스크부터 시작합니다.
    ```
  - 부분 일치 태스크 여러 개 found → 목록 출력 후 중단:
    ```
    '{start_task}'에 매칭되는 태스크가 여러 개입니다. 태스크명을 더 구체적으로 입력해주세요:
    - Task 001: [태스크명] (status: completed)
    - Task 004: [태스크명] (status: pending)
    ```
  - 부분 일치도 없음 → PENDING 태스크 목록을 보여주며 재선택 요청 후 중단:
    ```
    tasks.json에서 '{start_task}'을 찾을 수 없습니다.
    현재 PENDING 태스크 목록:
    - Task 004: [태스크명]
    - Task 005: [태스크명]
    ...
    올바른 시작 태스크명을 입력 후 다시 실행해주세요.
    ```

end_task가 빈값이 아닌 경우, `shrimp_data/tasks.json`을 읽어 end_task를 검증하라:

- end_task와 정확히 일치하는 태스크 있음 → 그대로 진행
- 정확히 일치하는 태스크 없음 → end_task를 포함하는 태스크를 부분 일치로 검색:
  - 부분 일치 태스크 1개 found → 해당 태스크명으로 end_task를 대체하고 아래 메시지 출력 후 진행:
    ```
    ✅ tasks.json에서 매칭된 태스크:
    → {매칭된 태스크명} (status: {status})
    이 태스크에서 종료합니다.
    ```
  - 부분 일치 태스크 여러 개 found → 목록 출력 후 중단:
    ```
    '{end_task}'에 매칭되는 태스크가 여러 개입니다. 태스크명을 더 구체적으로 입력해주세요:
    - Task 005: [태스크명] (status: pending)
    - Task 006: [태스크명] (status: pending)
    ```
  - 부분 일치도 없음 → PENDING 태스크 목록을 보여주며 재선택 요청 후 중단:
    ```
    tasks.json에서 '{end_task}'을 찾을 수 없습니다.
    현재 PENDING 태스크 목록:
    - Task 004: [태스크명]
    - Task 005: [태스크명]
    ...
    올바른 종료 태스크명을 입력 후 다시 실행해주세요.
    ```

---

파싱 결과를 바탕으로 아래 형식의 명령을 생성하고 출력하라.

---

**[start_task 없는 경우] 전체 명령:**

헤더 (end_task 유무로 분기):

```
[end_task 없음] 모든 태스크를 continuous mode로 실행해줘:
[end_task 있음] {end_task}까지 continuous mode로 실행해줘:
```

Step 1 (공통):

```
1. mcp__shrimp-task-manager__list_tasks
   - PENDING 상태 태스크 목록 확인
```

Step 2 - a (공통):

```
2. 각 태스크를 의존성 순서대로 반복 실행:
   a. mcp__shrimp-task-manager__execute_task
      - taskId 조회 후 실행
      - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
      [ref_data가 있는 경우에만] - 참고 자료: {ref_data}
```

Step 2 - b (agent_path 유무로 분기):

[agent_path 있는 경우]

```
   b. {agent_name} subagent에 구현 위임
      - call subagent: @{agent_path}
      - Step a에서 반환된 프롬프트 내용을 그대로 전달
      [constraint가 있는 경우에만] - 추가 제약사항: {constraint}
```

[agent_path 없는 경우]

```
   b. 반환된 프롬프트 기반으로 직접 구현
      [constraint가 있는 경우에만] - 추가 제약사항: {constraint}
```

Step 2 - c (공통):

```
   c. mcp__shrimp-task-manager__verify_task
      - 구현 완료 후 해당 태스크 완료 처리
```

Step 3 (end_task 유무로 분기):

```
[end_task 없음] 3. 모든 PENDING 태스크 완료될 때까지 반복
[end_task 있음] 3. {end_task} 완료 후 중단 (이후 태스크는 실행하지 않음)
```

---

**[start_task 있는 경우] 전체 명령:**

헤더 (end_task 유무로 분기):

```
[end_task 없음] {start_task}부터 continuous mode로 실행해줘:
[end_task 있음] {start_task}부터 {end_task}까지 continuous mode로 실행해줘:
```

Step 1 (공통):

```
1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: {start_task}부터 시작
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준) 확인
   [ref_data가 있는 경우에만] - 참고 자료: {ref_data}
```

Step 2 (agent_path 유무로 분기):

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

Step 3 (end_task 유무로 분기):

```
[end_task 없음] 3. mcp__shrimp-task-manager__verify_task
                   - 완료 처리 후 다음 PENDING 태스크로 계속 진행
[end_task 있음] 3. mcp__shrimp-task-manager__verify_task
                   - 완료 처리 후 {end_task}까지 반복 진행
                   - {end_task} 완료 후 중단 (이후 태스크는 실행하지 않음)
```

---

출력 후 반드시 질문하라:

**"위 절차대로 실행하시겠습니까? (Y/N)"**

- Y → 위 절차를 즉시 수행
- N → 중단
