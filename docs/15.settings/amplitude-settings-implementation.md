# 설정 페이지 Amplitude 이벤트 구현 가이드

## 개요

회원탈퇴 흐름에서의 사용자 행동을 추적하여 이탈 원인 분석 및 서비스 개선에 활용합니다.

> **구현 대상 파일**:
> - `webview-v2/src/views/settings-sections/ui/withdrawal/membershipWithdrawal.tsx` - 회원탈퇴 페이지

---

## 제거된 이벤트 (분석 가치 낮음)

| 이벤트 | 제거 이유 |
|--------|---------|
| `settings_view` | 대부분 사용자가 한 번쯤 방문 → 분석 가치 낮음 |
| `settings_link_click` | 약관 클릭해도 실제 읽지 않음 → 분석 가치 낮음 |
| `settings_logout` | Native `logout` 이벤트와 중복 (useAuthService.ts에서 이미 추적) |

> **참고**: `amplitude-events-final.md`에서 `settings_view`, `terms_view`는 명시적으로 "분석 가치 낮음"으로 제거됨

---

## 이벤트 목록 (2개)

| # | 이벤트명 | 설명 | 트리거 시점 |
|---|---------|------|------------|
| 1 | `withdrawal_start` | 회원탈퇴 페이지 진입 | 탈퇴 페이지 마운트 |
| 2 | `account_delete` | 계정 삭제 완료 | 탈퇴하기 버튼 클릭 |

---

## 이벤트 상세

### 1. `withdrawal_start`

**설명**: 회원탈퇴 페이지 진입 시 발생

**속성**: 없음 (단순 진입 이벤트)

```typescript
{
  // 속성 없음
}
```

**트리거**: `MemberShipWithdrawalPage` 컴포넌트 마운트 시

**측정 목적**:
- 탈퇴 페이지 진입 수
- 탈퇴 퍼널 시작점 (진입 → 완료 전환율)

---

### 2. `account_delete`

**설명**: 계정 삭제 완료 시 발생

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `reasons` | string[] | 선택한 탈퇴 사유 목록 |
| `feedback_count` | number | 피드백 작성 개수 |

```typescript
{
  reasons: string[];      // ["complex_to_use", "other"]
  feedback_count: number; // 1
}
```

**탈퇴 사유 값 (`reasons` 배열 요소)**:

| 키 | 값 | 한국어 |
|---|-----|-------|
| 1 | `"complex_to_use"` | 앱 사용법이 복잡해서 |
| 2 | `"lack_features"` | 필요한 기능이 부족해서 |
| 3 | `"use_other_service"` | 다른 서비스를 이용하기 위해서 |
| 4 | `"no_more_cooking"` | 요리를 하지 않게 되어서 |
| 5 | `"no_time"` | 시간이 없어서 사용하지 않아서 |
| 6 | `"use_other_app"` | 다른 요리 앱을 사용하게 되어서 |
| 7 | `"other"` | 기타 |

**트리거**: 탈퇴하기 버튼 클릭 (Native `DELETE_USER` 호출 전)

**측정 목적**:
- 탈퇴 사유 분석 → 서비스 개선 방향 도출
- 복수 선택 패턴 분석
- 피드백 작성율 → 사용자 참여도

---

## 구현 상세

### 1. 이벤트 상수 추가

**파일**: `webview-v2/src/shared/analytics/amplitudeEvents.ts`

**위치**: 파일 끝, `COUPANG_MODAL_CLOSE` 아래에 추가

```typescript
  // ─────────────────────────────────────────────────────────────
  // 설정/계정 (Settings/Account)
  // 회원탈퇴 흐름 추적
  // @see /frontend/docs/15.settings/amplitude-settings-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 회원탈퇴 페이지 진입 */
  WITHDRAWAL_START = "withdrawal_start",

  /** 계정 삭제 완료 */
  ACCOUNT_DELETE = "account_delete",
```

---

### 2. 회원탈퇴 페이지 구현

**파일**: `webview-v2/src/views/settings-sections/ui/withdrawal/membershipWithdrawal.tsx`

#### 2-1. Import 수정

**현재 코드 (line 1)**:
```typescript
import { useState } from "react";
```

**수정 후**:
```typescript
import { useState, useEffect } from "react";  // 🆕 useEffect 추가
```

**추가할 import (line 8 아래)**:
```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
```

#### 2-2. 탈퇴 사유 매핑 상수 추가

**위치**: `const DELETE_USER = "DELETE_USER";` (line 76) 아래에 추가

```typescript
const DELETE_USER = "DELETE_USER";

// 🆕 탈퇴 사유 키 → Amplitude 값 매핑
const WITHDRAWAL_REASON_MAP: { [key: string]: string } = {
  "1": "complex_to_use",
  "2": "lack_features",
  "3": "use_other_service",
  "4": "no_more_cooking",
  "5": "no_time",
  "6": "use_other_app",
  "7": "other",
};
```

#### 2-3. MemberShipWithdrawalPage 컴포넌트에 useEffect 추가

**현재 코드 (line 78-87)**:
```typescript
export default function MemberShipWithdrawalPage() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>(
    {}
  );
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({});

  const queryClient = useQueryClient();
  const lang = useLangcode();
  const messages = formatWithdrawalMessages(lang, user?.nickname || "");
```

**수정 후**:
```typescript
export default function MemberShipWithdrawalPage() {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: string }>(
    {}
  );
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string }>({});

  const queryClient = useQueryClient();
  const lang = useLangcode();
  const messages = formatWithdrawalMessages(lang, user?.nickname || "");

  // 🆕 페이지 진입 추적
  useEffect(() => {
    track(AMPLITUDE_EVENT.WITHDRAWAL_START);
  }, []);
```

#### 2-4. 탈퇴 버튼 onClick 수정

**현재 코드 (line 166-174)**:
```typescript
onClick={() => {
  const withdrawalData = Object.keys(selectedItems).map((key) => ({
    reason: selectedItems[key],
    feedback: feedbacks[key] || "",
  }));
  queryClient.clear();
  setMainAccessToken("");
  request(MODE.UNBLOCKING, DELETE_USER, withdrawalData);
}}
```

**수정 후**:
```typescript
onClick={() => {
  const selectedKeys = Object.keys(selectedItems);

  // 🆕 Amplitude 이벤트 전송
  track(AMPLITUDE_EVENT.ACCOUNT_DELETE, {
    reasons: selectedKeys.map(key => WITHDRAWAL_REASON_MAP[key]),
    feedback_count: Object.values(feedbacks).filter(f => f.trim().length > 0).length,
  });

  // 기존 탈퇴 로직
  const withdrawalData = selectedKeys.map((key) => ({
    reason: selectedItems[key],
    feedback: feedbacks[key] || "",
  }));
  queryClient.clear();
  setMainAccessToken("");
  request(MODE.UNBLOCKING, DELETE_USER, withdrawalData);
}}
```

---

## 전체 변경 요약

| 파일 | 변경 내용 |
|-----|----------|
| `amplitudeEvents.ts` | 2개 이벤트 상수 추가 (line 115 아래) |
| `membershipWithdrawal.tsx` | import 수정 (useEffect, amplitude), WITHDRAWAL_REASON_MAP 상수, useEffect 추가, 탈퇴 버튼 onClick 수정 |

---

## 분석 가능 지표

### 퍼널 분석

```text
withdrawal_start (100%)
       ↓
account_delete (탈퇴 완료율)

이탈율 = withdrawal_start - account_delete
       (탈퇴 페이지 왔지만 실제 탈퇴 안 함)
```

### 핵심 지표

| 지표 | 계산 방법 |
|-----|----------|
| 탈퇴 전환율 | `account_delete` / `withdrawal_start` |
| 주요 탈퇴 사유 | `reasons` 배열 집계 |
| 피드백 작성율 | `feedback_count > 0` 비율 |
| 평균 선택 사유 수 | `reasons.length` 평균 |

### 탈퇴 사유 분석 예시

```sql
-- 가장 많이 선택된 탈퇴 사유
SELECT
  reason,
  COUNT(*) as count
FROM account_delete, UNNEST(reasons) as reason
GROUP BY reason
ORDER BY count DESC
```

---

## 구현 체크리스트

- [ ] `amplitudeEvents.ts`에 2개 이벤트 상수 추가
- [ ] `membershipWithdrawal.tsx`에 import 추가 (`useEffect`, amplitude 관련)
- [ ] `membershipWithdrawal.tsx`에 `WITHDRAWAL_REASON_MAP` 상수 추가
- [ ] `membershipWithdrawal.tsx`에 `useEffect`로 `withdrawal_start` 추적
- [ ] `membershipWithdrawal.tsx`에 탈퇴 버튼 onClick 수정
- [ ] TypeScript 컴파일 확인
- [ ] 테스트 및 검증
- [ ] Amplitude 대시보드에서 이벤트 확인

---

## amplitude-events-final.md와의 일치

| 기존 정의 | 구현 | 일치 |
|----------|-----|------|
| `withdrawal_start` | `withdrawal_start` | ✅ |
| `withdrawal_feedback_submit` | - | ✅ 제거 (`account_delete`의 `feedback_count`로 대체) |
| `account_delete` | `account_delete` | ✅ |

> **참고**: 기존 정의서의 이벤트 이름을 그대로 사용하여 일관성 유지
