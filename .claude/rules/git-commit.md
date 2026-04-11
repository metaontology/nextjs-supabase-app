# Git Commit 규칙 (Conventional Commits)

## 포맷

```
<emoji> <type>[optional scope]: <description>
```

## 규칙

- 이모지 + type 조합 권장
- scope: 영문 소문자 (예: `auth`, `api`, `ui`, `db`, `deps`)
- description: 영문 소문자 명령형 (예: `add`, `fix`, `remove`)

## 프로젝트 추가 type (표준 외)

| 이모지 | Type     | 설명            |
| ------ | -------- | --------------- |
| 🎉     | `init`   | 프로젝트 초기화 |
| 🚀     | `deploy` | 배포            |
