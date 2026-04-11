# Quality Gate — Claude 준수 규칙

이 프로젝트는 2단계 Quality Gate를 운영합니다.
전체 개념 및 구축 방법은 `docs/guides/create-quality-gate_v4.md` 참조.

## 1차 Gate (자동 — Claude 개입 불필요)

커밋 시 husky pre-commit이 자동 실행합니다. Claude가 수동으로 실행할 필요 없습니다.

- TypeScript: `tsc --noEmit`
- ESLint: `eslint --fix` (자동 수정)
- Prettier: `prettier --write` (자동 수정)

## 2차 Gate (Claude 책임 — 작업 완료 전 필수)

코드 변경 완료 후, 완료를 보고하기 전에 반드시 실행:

```bash
npm run check-all
```

포함 내용: `typecheck` → `lint` → `format:check` → `build`

## check-all 실행 기준

| 변경 유형                                             | 실행         |
| ----------------------------------------------------- | ------------ |
| 코드 파일 변경 (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`) | ✅ 필수      |
| 문서/주석 (`.md`, `.json`)만 수정                     | ❌ 생략 가능 |

## 실패 시 자동 수정 흐름

```
format:check 실패 → npm run format    → check-all 재실행
lint 실패         → npm run lint:fix  → check-all 재실행
그래도 실패       → 수동 수정
```

## 사용 가능한 스크립트

```bash
npm run check-all     # 전체 검사 (typecheck + lint + format:check + build)
npm run typecheck     # TypeScript 타입 검사
npm run lint          # ESLint 검사
npm run lint:fix      # ESLint 자동 수정
npm run format        # Prettier 자동 수정
npm run format:check  # Prettier 포맷 검사
npm run build         # Next.js 빌드
```
