# 작업 완료 체크리스트

## 🚦 코드 변경 시 필수 실행

코드 파일(`.ts`, `.tsx`, `.js`, `.jsx`, `.css`)을 변경한 작업 완료 전
반드시 아래 순서로 실행한다.

### 1단계: Lint 검사 (항상 필수)

```bash
npm run lint
```

실패 시 처리:
- ESLint 오류 → 직접 수동 수정 (`lint:fix` 스크립트 없음)
- TypeScript 타입 오류 → `npm run build`가 타입 체크 포함

### 2단계: 빌드 확인 (아래 변경이 포함될 때만)

```bash
npm run build
```

빌드 검사가 필요한 변경:
- 신규 파일/컴포넌트/페이지 추가
- 라우트 구조 변경 (`app/` 디렉토리)
- 의존성 추가/제거 (`package.json`)
- `next.config.ts` 수정
- `proxy.ts` 수정 (미들웨어)
- `lib/supabase/` 파일 수정

빌드 검사가 불필요한 변경:
- 기존 컴포넌트 내 로직만 수정 (타입 오류 없는 경우)
- 문서/주석/설정 파일(`.md`, `.json`)만 수정
- 스타일 클래스명 변경

### 3단계: API/비즈니스 로직 변경 시 Playwright MCP 테스트

```
- Supabase 쿼리 추가/변경
- 인증 플로우 변경
- 새 Route Handler 추가
- 미들웨어 수정
```

ROADMAP.md의 테스트 체크리스트 시나리오를 Playwright MCP로 직접 실행하여 검증.

## ✅ 체크리스트 통과 기준

- `lint`: 에러 0개 (warning은 허용)
- `build`: 빌드 성공 (타입 오류 포함 에러 없이 완료)
- Playwright 테스트: 시나리오 정상 통과

세 조건을 모두 만족한 뒤 사용자에게 완료를 보고한다.

## 📝 사용 가능한 스크립트 목록

```bash
npm run dev    # 개발 서버 (localhost:3000)
npm run build  # 프로덕션 빌드 + TypeScript 타입 체크
npm run start  # 프로덕션 서버
npm run lint   # ESLint 검사
```

> ⚠️ `check-all`, `typecheck`, `format`, `format:check`, `lint:fix` 는 존재하지 않음
