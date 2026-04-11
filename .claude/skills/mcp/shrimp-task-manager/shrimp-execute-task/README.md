# shrimp-execute-task

shrimp task manager `execute_task` best practice 절차를 자동 생성하고 실행하는 skill.

## 사용법

```
@/home/hgjun/workspace/claude-lab/invoice-web/.claude/skills/mcp/shrimp-task-manager/shrimp-execute-task/SKILL.md
{task-name}
{agent-path}
{ref-data}
{constraint}
```

- 인자는 **줄바꿈으로 구분**, **순서 고정**
- 인자가 4개로 고정되어 있어 위치로 구분합니다
- `task-name`만 실질적 필수이며, 나머지 3개는 사용하지 않는 경우 `""`를 입력합니다

## 인자

| 인자         | 필수                | 위치     | 설명                                    |
| ------------ | ------------------- | -------- | --------------------------------------- |
| `task-name`  | ✅ 실질 필수        | 1번째 줄 | tasks.json에 등록된 태스크명            |
| `agent-path` | ✅ (미사용 시 `""`) | 2번째 줄 | 구현을 위임할 subagent 절대 경로        |
| `ref-data`   | ✅ (미사용 시 `""`) | 3번째 줄 | 구현 시 참고할 파일 경로 또는 glob 패턴 |
| `constraint` | ✅ (미사용 시 `""`) | 4번째 줄 | 구현 시 적용할 추가 제약사항            |

> 인자 순서가 고정되어 있으므로 중간 인자를 생략할 수 없습니다. 사용하지 않는 인자는 반드시 `""`로 자리를 채워주세요.
>
> ⚠️ `task-name`이 `""`이면 실행을 중단하고 재입력을 요청합니다.
>
> 💡 타입 감지 방식은 유사한 형태의 입력이 늘어날수록 오분류 위험이 커집니다. 위치 기반 고정 인자 방식으로 입력 일관성과 예측 가능성을 높였습니다.

## 예시

**① task-name만 (직접 구현):**

```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
""
""
""
```

**② task-name + ref-data (직접 구현 + 참고 자료):**

```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
""
./data/*
""
```

**③ task-name + agent-path (subagent 위임):**

```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
""
""
```

**④ task-name + constraint (직접 구현 + 추가 제약사항):**

```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
""
""
모든 소스 코드는 src/ 디렉토리 하위에 생성할 것
```

**⑤ 전체 옵션 (subagent + 참고 자료 + 추가 제약사항):**

```
@...SKILL.md
Task 003: 타입 정의 및 데이터 모델 설계
/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
./data/*
모든 소스 코드는 src/ 디렉토리 하위에 생성할 것
```

## 생성되는 명령 포맷

### ① task-name만

```
mcp__shrimp-task-manager__execute_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task 003: 타입 정의 및 데이터 모델 설계
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준)를 확인

2. 반환된 프롬프트 기반으로 직접 구현

3. mcp__shrimp-task-manager__verify_task
   - 구현 완료 후 Task 003: 타입 정의 및 데이터 모델 설계 완료 처리
```

### ⑤ 전체 옵션

```
mcp__shrimp-task-manager__execute_task 를 다음 절차대로 수행해줘:

1. mcp__shrimp-task-manager__execute_task
   - tasks.json:: Task 003: 타입 정의 및 데이터 모델 설계
   - taskId 조회 후 실행
   - 반환된 프롬프트(태스크 설명, 구현 가이드, 관련 파일, 검증 기준)를 확인
   - 참고 자료: ./data/*

2. nextjs-app-developer subagent에 구현 위임
   - call subagent: @/home/hgjun/workspace/claude-lab/_snippet/.claude/agents/dev/nextjs-app-developer.md
   - Step 1에서 반환된 프롬프트 내용을 그대로 전달
   - 추가 제약사항: 모든 소스 코드는 src/ 디렉토리 하위에 생성할 것

3. mcp__shrimp-task-manager__verify_task
   - 구현 완료 후 Task 003: 타입 정의 및 데이터 모델 설계 완료 처리
```

## 동작 흐름

1. 인자 파싱
2. 필수 인자 검증 (task-name이 `""` → 즉시 중단)
3. `shrimp_data/tasks.json`에서 태스크명 확인 (불일치 시 PENDING 목록 안내 후 중단)
4. 명령 생성 및 출력
5. `"위 절차대로 실행하시겠습니까? (Y/N)"` 확인
6. Y → 즉시 실행 / N → 중단
