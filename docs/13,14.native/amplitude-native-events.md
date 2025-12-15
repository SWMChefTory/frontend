# Amplitude Native 이벤트 명세

## 개요

React Native (frontend)에서 직접 발송하는 Amplitude 이벤트 명세입니다.
WebView 이벤트와 별도로 Native에서만 추적 가능한 3개 이벤트를 정의합니다.

> **최종 업데이트**: 2024-12-14

---

## 이벤트 목록 (3개)

| # | 이벤트명 | 설명 | 구현 위치 |
|---|---------|------|----------|
| 1 | `app_launched` | 앱 실행 | `app/_layout.tsx` |
| 2 | `login_success` | OAuth 인증 성공 | `useAuthService.ts` |
| 3 | `logout` | 로그아웃 | `useAuthService.ts` |

---

## 인증 흐름 개요

```
┌─────────────────────────────────────────────────────────────┐
│                     앱 인증 흐름                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [최초 실행 / 재로그인 필요 시]                                │
│      │                                                      │
│      ▼                                                      │
│  Google/Apple OAuth ──▶ 회원가입/로그인 API ──▶ 토큰 저장     │
│      │                                                      │
│      ▼                                                      │
│  login_success 이벤트 발송                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [이후 앱 실행] (대부분의 경우)                                │
│      │                                                      │
│      ▼                                                      │
│  app_launched ──▶ 저장된 토큰으로 자동 로그인                  │
│      │                                                      │
│      ▼                                                      │
│  (별도 이벤트 없음 - app_launched로 DAU 추적)                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [로그아웃]                                                  │
│      │                                                      │
│      ▼                                                      │
│  WebView 설정 ──▶ LOGOUT 메시지 ──▶ Native logout()          │
│      │                                                      │
│      ▼                                                      │
│  logout 이벤트 발송                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 이벤트 상세

### 1. `app_launched`

앱이 실행될 때 발송됩니다.

#### 속성

없음 (Amplitude가 기기/OS/앱 버전 자동 수집)

#### 구현 위치

- `frontend/src/app/_layout.tsx`

#### 발송 시점

- 앱 시작 시 `useEffect`에서 `initAmplitude()` 직후

#### 비고

- 이미 구현되어 있음
- `{ test: true }` 속성 제거 필요

---

### 2. `login_success`

OAuth 인증이 성공했을 때 발송됩니다 (자동 로그인 제외).

#### 속성

| 속성 | 타입 | 필수 | 설명 | 값 |
|-----|-----|-----|------|-----|
| `provider` | string | O | OAuth 제공자 | `google`, `apple` |
| `is_new_user` | boolean | O | 신규 가입 여부 | `true`: 회원가입, `false`: 로그인 |

#### 구현 위치

- `frontend/src/modules/user/business/service/useAuthService.ts`
  - `useLoginViewModel.onSuccess(data, variables)` → `is_new_user: false`, `provider: variables.provider.toLowerCase()`
  - `useSignupViewModel.onSuccess(data, variables)` → `is_new_user: true`, `provider: variables.provider.toLowerCase()`

> **참고**: `OauthProvider` enum 값이 대문자(`GOOGLE`, `APPLE`)이므로 `.toLowerCase()`로 소문자 변환 필요

#### 발송 시점

- 서버 로그인/회원가입 API 성공 응답 후

#### 발생 케이스

| 케이스 | is_new_user | 빈도 |
|-------|-------------|------|
| 최초 회원가입 | `true` | 사용자당 1회 |
| 로그아웃 후 재로그인 | `false` | 드묾 |
| Refresh token 만료 후 재로그인 | `false` | 드묾 |

#### 자동 로그인을 추적하지 않는 이유

- `app_launched`로 DAU 추적 가능
- 토큰 갱신은 자동 처리됨 (TokenRefreshManager)
- Refresh token 만료 시 → OAuth 재인증 → `login_success` 발생

#### 구현 예시

```typescript
// useLoginViewModel - 기존 회원 로그인
onSuccess: (data, variables) => {
  console.log("login success", data);
  setUser(data.user);
  storeAuthToken(data.access_token, data.refresh_token);
  // Amplitude 이벤트 추가
  trackNative('login_success', {
    provider: variables.provider.toLowerCase(), // 'GOOGLE' → 'google'
    is_new_user: false
  });
},

// useSignupViewModel - 신규 회원가입
onSuccess: async (data, variables) => {
  await storeAuthToken(data.access_token, data.refresh_token);
  setUser(User.create({...}));
  // Amplitude 이벤트 추가
  trackNative('login_success', {
    provider: variables.provider.toLowerCase(), // 'APPLE' → 'apple'
    is_new_user: true
  });
},
```

#### 분석 포인트

- Google vs Apple 비율
- 신규 가입 vs 재로그인 비율
- 일별/주별 신규 가입자 추이

---

### 3. `logout`

로그아웃이 완료되었을 때 발송됩니다.

#### 속성

없음

#### 구현 위치

- `frontend/src/modules/user/business/service/useAuthService.ts`
  - `useLogoutViewModel.onSuccess` → 성공 시 발송
  - `useLogoutViewModel.onError` → 에러 시에도 발송 (로컬 토큰 삭제되므로)

#### 발송 시점

- 로그아웃 API 호출 성공 후
- 로그아웃 API 호출 실패 시에도 발송 (로컬 토큰은 삭제됨)

#### 에러 시에도 발송하는 이유

- 서버 API 실패해도 로컬 토큰은 삭제됨
- 사용자 입장에서는 "로그아웃됨" 상태
- 분석 목적: "로그아웃한 사용자 수" (서버 성공 여부 무관)

#### 트리거 흐름

```
WebView 설정 화면
    │
    ▼
LOGOUT 메시지 전송 (useHandleMessage.ts:180-182)
    │
    ▼
Native logout() 호출 (useLogoutViewModel)
    │
    ▼
logout 이벤트 발송 ← 여기서 추적
```

#### 구현 예시

```typescript
// useLogoutViewModel
onSuccess: () => {
  trackNative('logout');  // 추가
  removeAuthToken();
  removeUser();
},
onError: (error) => {
  trackNative('logout');  // 추가 (에러 시에도 로컬 로그아웃됨)
  removeAuthToken();
  removeUser();
},
```

#### 비고

- WebView에서 트리거되지만, 실제 로그아웃 처리는 Native에서 진행
- 따라서 Native에서 이벤트 추적 가능
- `onSuccess`와 `onError` 둘 다에 이벤트 추가 (둘 다 로컬 로그아웃 처리됨)

---

## 제거된 이벤트

### `login_fail`

OAuth 인증 실패 시 발송하려던 이벤트입니다.

#### 제거 이유

- OAuth 취소/실패는 드문 케이스
- MVP에서는 성공 이벤트만 추적
- 필요시 추후 추가 가능

#### 향후 추가 시 속성 (참고용)

| 속성 | 타입 | 설명 |
|-----|-----|------|
| `provider` | string | `google`, `apple` |
| `error_type` | string | `oauth_cancelled`, `token_missing`, `server_error` 등 |

---

## 구현 파일 목록

| 파일 | 작업 내용 |
|-----|----------|
| `modules/shared/analytics/amplitudeEvents.ts` | (선택) enum에 3개 이벤트 상수 추가 |
| `app/_layout.tsx` | `{ test: true }` 속성 제거 |
| `modules/user/business/service/useAuthService.ts` | `login_success`, `logout` 추가 + `trackNative` import |

---

## 구현 순서

1. `_layout.tsx` - 테스트 속성 제거
2. `useAuthService.ts`
   - `trackNative` import 추가
   - `useLoginViewModel.onSuccess(data, variables)` - `login_success` 이벤트 추가
   - `useSignupViewModel.onSuccess(data, variables)` - `login_success` 이벤트 추가
   - `useLogoutViewModel.onSuccess` - `logout` 이벤트 추가
   - `useLogoutViewModel.onError` - `logout` 이벤트 추가
3. (선택) `amplitudeEvents.ts` - enum 정의 (타입 안전성 필요시)

---

## 핵심 지표

| 지표 | 계산 방법 |
|-----|----------|
| 신규 가입 비율 | `login_success [is_new_user=true]` / `login_success` |
| Provider 선호도 | `login_success` by `provider` |
| DAU | `app_launched` unique users by day |
| 로그아웃 비율 | `logout` / `app_launched` |

---

## 향후 고려사항

- **User ID 연동**: 서버 User ID를 Amplitude `setUserId()`로 설정 (서버 담당자와 협의 필요)
- **login_fail 추가**: OAuth 실패 추적이 필요해지면 추가
- **app_version**: 앱 버전별 분석 필요시 속성 추가
