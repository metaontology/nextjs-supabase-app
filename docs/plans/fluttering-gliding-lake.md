# UI/UX 개선 플랜 — 한국어 전환 · 모바일 레이아웃 · 리디렉션 수정

## Context

Gather 앱의 인증 관련 페이지(로그인, 회원가입, 비밀번호 재설정 등)가 영어로 표시되고 있어 서비스 전반의 한국어 일관성이 깨진 상태입니다. 또한 로그인 성공 후 존재하지 않는 `/protected` 경로로 리디렉션되어 404 오류가 발생합니다. 홈(/) 화면도 모바일에서 여백이 과도하게 크거나 레이아웃이 최적화되지 않은 부분이 있습니다.

## 수정 범위

### 1. 영어 → 한국어 번역 (7개 파일)

#### `components/login-form.tsx`

| 기존 (영어)                                       | 변경 (한국어)                 |
| ------------------------------------------------- | ----------------------------- |
| `Login` (CardTitle)                               | `로그인`                      |
| `Enter your email below to login to your account` | `이메일로 로그인하세요`       |
| `Email` (Label)                                   | `이메일`                      |
| `Password` (Label)                                | `비밀번호`                    |
| `m@example.com` (placeholder)                     | `이메일을 입력하세요`         |
| `Forgot your password?`                           | `비밀번호를 잊으셨나요?`      |
| `Logging in...`                                   | `로그인 중...`                |
| `Login` (Button)                                  | `로그인`                      |
| `Don't have an account? Sign up`                  | `계정이 없으신가요? 회원가입` |
| `An error occurred` (catch)                       | `오류가 발생했습니다`         |
| **리디렉션 변경**: `router.push('/protected')`    | `router.push('/')`            |

#### `components/sign-up-form.tsx`

| 기존 (영어)                      | 변경 (한국어)                    |
| -------------------------------- | -------------------------------- |
| `Sign up` (CardTitle)            | `회원가입`                       |
| `Create a new account`           | `새 계정을 만드세요`             |
| `Email` (Label)                  | `이메일`                         |
| `Password` (Label)               | `비밀번호`                       |
| `Repeat Password` (Label)        | `비밀번호 확인`                  |
| `m@example.com` (placeholder)    | `이메일을 입력하세요`            |
| `Passwords do not match` (에러)  | `비밀번호가 일치하지 않습니다`   |
| `Creating an account...`         | `계정 생성 중...`                |
| `Sign up` (Button)               | `회원가입`                       |
| `Already have an account? Login` | `이미 계정이 있으신가요? 로그인` |
| `An error occurred` (catch)      | `오류가 발생했습니다`            |

#### `components/forgot-password-form.tsx`

| 기존 (영어)                                                                                 | 변경 (한국어)                                                                   |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Check Your Email` (성공 타이틀)                                                            | `이메일을 확인하세요`                                                           |
| `Password reset instructions sent`                                                          | `비밀번호 재설정 안내를 발송했습니다`                                           |
| `If you registered using your email and password, you will receive a password reset email.` | `이메일과 비밀번호로 가입하셨다면 비밀번호 재설정 이메일을 받으실 수 있습니다.` |
| `Reset Your Password` (CardTitle)                                                           | `비밀번호 재설정`                                                               |
| `Type in your email and we'll send you a link to reset your password`                       | `이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다`                       |
| `Email` (Label)                                                                             | `이메일`                                                                        |
| `m@example.com` (placeholder)                                                               | `이메일을 입력하세요`                                                           |
| `Sending...`                                                                                | `전송 중...`                                                                    |
| `Send reset email`                                                                          | `재설정 이메일 보내기`                                                          |
| `Already have an account? Login`                                                            | `이미 계정이 있으신가요? 로그인`                                                |
| `An error occurred` (catch)                                                                 | `오류가 발생했습니다`                                                           |

#### `components/update-password-form.tsx`

| 기존 (영어)                                    | 변경 (한국어)                  |
| ---------------------------------------------- | ------------------------------ |
| `Reset Your Password` (CardTitle)              | `새 비밀번호 설정`             |
| `Please enter your new password below.`        | `새 비밀번호를 입력해 주세요.` |
| `New password` (Label)                         | `새 비밀번호`                  |
| `New password` (placeholder)                   | `새 비밀번호를 입력하세요`     |
| `Saving...`                                    | `저장 중...`                   |
| `Save new password`                            | `비밀번호 저장`                |
| `An error occurred` (catch)                    | `오류가 발생했습니다`          |
| **리디렉션 변경**: `router.push('/protected')` | `router.push('/')`             |

#### `app/auth/sign-up-success/page.tsx`

| 기존 (영어)                                                                                         | 변경 (한국어)                                                                                   |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `Thank you for signing up!`                                                                         | `회원가입이 완료되었습니다!`                                                                    |
| `Check your email to confirm`                                                                       | `이메일을 확인해 주세요`                                                                        |
| `You've successfully signed up. Please check your email to confirm your account before signing in.` | `회원가입이 성공적으로 완료되었습니다. 로그인하기 전에 이메일을 확인하여 계정을 인증해 주세요.` |

#### `app/auth/error/page.tsx`

| 기존 (영어)                      | 변경 (한국어)                     |
| -------------------------------- | --------------------------------- |
| `Sorry, something went wrong.`   | `오류가 발생했습니다.`            |
| `Code error: {params.error}`     | `오류 코드: {params.error}`       |
| `An unspecified error occurred.` | `알 수 없는 오류가 발생했습니다.` |

---

### 2. 홈(/) 모바일 레이아웃 개선

**파일**: `app/page.tsx`

현재 문제: 히어로 섹션의 `py-24`(96px)가 모바일에서 과도하게 큰 상하 여백을 만들고, 서비스 배지 텍스트가 모바일에서 줄바꿈될 수 있음.

| 요소        | 현재 클래스                        | 변경 클래스                                    |
| ----------- | ---------------------------------- | ---------------------------------------------- |
| 히어로 섹션 | `px-6 py-24`                       | `px-4 py-16 sm:px-6 sm:py-24`                  |
| h1 타이틀   | `text-4xl sm:text-5xl md:text-6xl` | `text-3xl sm:text-4xl md:text-5xl lg:text-6xl` |
| 설명 문단   | `text-lg sm:text-xl`               | `text-base sm:text-lg md:text-xl`              |
| 서비스 배지 | `text-sm` (고정)                   | `text-xs sm:text-sm`                           |

---

### 3. 로그인 후 리디렉션 수정

- `components/login-form.tsx` 78번 줄: `router.push('/protected')` → `router.push('/')`
- `components/update-password-form.tsx` 37번 줄: `router.push('/protected')` → `router.push('/')`
- `app/page.tsx`는 인증된 사용자를 `/events`로 리디렉션하므로, `/`로 이동하면 자동으로 `/events`로 이동함 (기존 로직 유지)

---

## 수정 대상 파일 목록

1. `components/login-form.tsx` — 한국어 번역 + 리디렉션 변경
2. `components/sign-up-form.tsx` — 한국어 번역
3. `components/forgot-password-form.tsx` — 한국어 번역
4. `components/update-password-form.tsx` — 한국어 번역 + 리디렉션 변경
5. `app/auth/sign-up-success/page.tsx` — 한국어 번역
6. `app/auth/error/page.tsx` — 한국어 번역
7. `app/page.tsx` — 모바일 레이아웃 클래스 개선

---

## 검증 방법

1. `npm run check-all` 실행 → typecheck + lint + format + build 통과 확인
2. Playwright MCP로 다음 흐름 테스트:
   - `/auth/login` 접속 → 모든 텍스트 한국어 확인
   - `/auth/sign-up` 접속 → 모든 텍스트 한국어 확인
   - 로그인 성공 → `/` 이동 후 `/events`로 자동 리디렉션 확인
   - `/` 홈 화면 모바일 뷰 (375px) → 여백/타이틀 크기 확인
