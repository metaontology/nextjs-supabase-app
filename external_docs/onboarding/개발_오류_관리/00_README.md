클로드 코드로 nextjs 프로젝트 할 때 오류 크게 줄이는 3 방법 있다.

1 🛡️ 정적 오류 관리 (Quality Gate)
2 🌐 런타임 동적 오류 관리 (Playwright MCP)
3 📚 명확한 기술스택 정의 (Context7 MCP)

이 중 1 구축하고 -> 클로드 rule 생성
2는 클로드 rule 생성 할 것

프로젝트에 복사해야 할 것들

```
.claude/rules/
  quality-gate.md           # 1 🛡️ 정적 오류 관리 (Quality Gate)
  runtime-checklist.md      # 2 🌐 런타임 동적 오류 관리 (Playwright MCP) → 03 참조
  playwright.md             # 2 🌐 Playwright MCP 브라우저 제어 규칙      → 03 참조
 (project.md                # 3 📚 context 7 사용해 기술스택 내용 작성)

docs/guides/
  ai-native-error-management.md
```

> 💡 복사한 파일은 작성 시점 기준입니다.
> 파일 복사 후 클로드 코드에 "현재 프로젝트 환경에 맞게 검토해줘"라고 요청하면 자동으로 최신화할 수 있습니다.
