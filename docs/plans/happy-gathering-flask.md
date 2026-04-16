# 로그아웃 기능 추가 계획

## Context

현재 사용자는 `/profile` 페이지 하단에서만 로그아웃할 수 있고, 관리자는 로그아웃 방법이 전혀 없다. 두 UI 모두 접근성이 낮으므로 각 레이아웃에 로그아웃 버튼을 추가한다.

---

## 구현 계획

### 1. 기존 `LogoutButton` 재사용

**파일**: `components/logout-button.tsx`

현재 구현이 단순하고 잘 동작함. 그대로 재사용.

- `supabase.auth.signOut()` 호출 후 `/auth/login` 리디렉션

---

### 2. 관리자 사이드바에 로그아웃 추가

**수정 파일**: `components/layout/admin-sidebar.tsx`

사이드바 하단 고정 영역에 구분선 + 로그아웃 버튼 배치.
`LogoutButton`은 Client Component이므로 Server Component인 `AdminSidebar`에서 바로 import 가능.

```
┌─────────────────┐
│  관리자 패널     │
├─────────────────┤
│  대시보드        │
│  이벤트 관리     │
│  사용자 관리     │
│  통계           │
├─────────────────┤  ← justify-between으로 하단 고정
│  🚪 로그아웃    │
└─────────────────┘
```

구조:

```tsx
<aside className="flex w-64 shrink-0 flex-col border-r">
  <div>헤더</div>
  <nav className="flex-1">네비게이션</nav>
  <div className="border-t p-3">
    <LogoutButton /> {/* 전체 너비 버튼 */}
  </div>
</aside>
```

`LogoutButton`은 관리자 로그아웃 후 `/auth/login`이 아닌 `/admin/login`으로 보내야 함.
→ `LogoutButton`에 `redirectTo?: string` prop 추가.

---

### 3. 모바일 프로필 페이지 로그아웃 개선

**수정 파일**: `app/(main)/profile/page.tsx`

현재 하단에 이미 `<LogoutButton />`이 있음. 별도 추가 불필요.
단, 관리자 `redirectTo` prop 추가로 인한 타입 변경만 반영.

---

## 수정 파일 목록

| 파일                                  | 변경 내용                                               |
| ------------------------------------- | ------------------------------------------------------- |
| `components/logout-button.tsx`        | `redirectTo?: string` prop 추가 (기본값: `/auth/login`) |
| `components/layout/admin-sidebar.tsx` | flex-col 구조 + 하단 로그아웃 버튼 추가                 |

---

## 검증 방법

1. 관리자 `/admin/dashboard` 접속 → 사이드바 하단 로그아웃 버튼 확인
2. 로그아웃 클릭 → `/admin/login`으로 리디렉션 확인
3. 일반 사용자 `/profile` 페이지 → 로그아웃 버튼 정상 동작 (`/auth/login` 리디렉션) 확인
4. `npm run check-all` 통과
