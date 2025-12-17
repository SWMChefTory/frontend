# Settings/Account Amplitude 이벤트 요약

## 개요

설정 및 계정 관리 섹션의 Amplitude 이벤트 요약 문서입니다.
회원탈퇴 플로우에서 사용자 이탈 패턴과 탈퇴 사유를 분석하기 위한 이벤트를 추적합니다.

**구현 위치**: `webview-v2/src/views/settings-sections/ui/withdrawal/membershipWithdrawal.tsx`

---

## 이벤트 목록

| 이벤트명 | 설명 | 트리거 시점 |
|---------|------|------------|
| `withdrawal_start` | 회원탈퇴 페이지 진입 | 탈퇴 페이지 컴포넌트 마운트 시 |
| `account_delete` | 계정 삭제 완료 | "탈퇴하기" 버튼 클릭 시 |

---

## 이벤트 상세

### 1. withdrawal_start

**설명**: 사용자가 회원탈퇴 페이지에 진입했을 때 발생

**트리거 시점**:
- 설정 페이지에서 "회원탈퇴" 버튼 클릭 후 탈퇴 페이지 렌더링 시
- `useEffect` 훅을 통해 컴포넌트 마운트 시점에 1회 발생

**속성**: 없음

**구현 코드**:
```typescript
useEffect(() => {
  track(AMPLITUDE_EVENT.WITHDRAWAL_START);
}, []);
```

---

### 2. account_delete

**설명**: 사용자가 탈퇴 사유를 선택하고 계정 삭제를 완료했을 때 발생

**트리거 시점**:
- "탈퇴하기" 버튼 클릭 시 (최소 1개 이상의 탈퇴 사유 선택 필수)

**속성**:

| 속성명 | 타입 | 설명 | 예시 |
|-------|------|------|------|
| `reasons` | `string[]` | 선택한 탈퇴 사유 목록 (복수 선택 가능) | `["complex_to_use", "lack_features"]` |
| `feedback_count` | `number` | 작성한 피드백 개수 (빈 문자열 제외) | `2` |

**탈퇴 사유 값 매핑**:

| UI 키 | Amplitude 값 | 한국어 | 영어 |
|-------|-------------|--------|------|
| `1` | `complex_to_use` | 앱 사용법이 복잡해서 | Too complex to use |
| `2` | `lack_features` | 필요한 기능이 부족해서 | Lack of necessary features |
| `3` | `use_other_service` | 다른 서비스를 이용하기 위해서 | Using another service |
| `4` | `no_more_cooking` | 요리를 하지 않게 되어서 | No longer cooking |
| `5` | `no_time` | 시간이 없어서 사용하지 않아서 | Not using due to lack of time |
| `6` | `use_other_app` | 다른 요리 앱을 사용하게 되어서 | Using another cooking app |
| `7` | `other` | 기타 | Other |

**구현 코드**:
```typescript
track(AMPLITUDE_EVENT.ACCOUNT_DELETE, {
  reasons: selectedKeys.map((key) => WITHDRAWAL_REASON_MAP[key]),
  feedback_count: Object.values(feedbacks).filter(
    (f) => f.trim().length > 0
  ).length,
});
```

---

## 분석 활용 가이드

### 1. 퍼널 분석 (Funnel Analysis)

**탈퇴 전환율 분석**:
```
withdrawal_start → account_delete
```

- **측정 지표**: 탈퇴 페이지 진입 대비 실제 탈퇴 완료 비율
- **인사이트**: 탈퇴 페이지까지 왔지만 이탈한 사용자 비율 파악
- **활용**: 탈퇴 방지 UI/UX 개선 효과 측정

### 2. 탈퇴 사유 분석

**주요 탈퇴 사유 파악**:
- `reasons` 속성을 통해 가장 빈번한 탈퇴 사유 집계
- 복수 선택 패턴 분석으로 복합적인 이탈 원인 파악

**사유별 세분화 분석**:
| 사유 | 분석 방향 | 개선 액션 |
|-----|----------|----------|
| `complex_to_use` | 온보딩/UX 개선 필요 | 튜토리얼 강화, UI 단순화 |
| `lack_features` | 기능 요구사항 분석 | 피드백 기반 기능 로드맵 |
| `use_other_service` / `use_other_app` | 경쟁사 분석 필요 | 차별화 포인트 강화 |
| `no_more_cooking` / `no_time` | 리텐션 전략 필요 | 간편 요리, 알림 최적화 |
| `other` | 피드백 텍스트 분석 | 질적 분석 수행 |

### 3. 피드백 분석

**피드백 작성률**:
- `feedback_count > 0`인 비율 측정
- 상세 피드백을 남기는 사용자 특성 분석

**활용**:
- 피드백 작성 사용자의 탈퇴 사유 패턴과 비작성 사용자 비교
- 피드백 텍스트는 별도 서버 로그에서 질적 분석

### 4. 코호트 분석

**탈퇴 사용자 특성 분석**:
- 탈퇴 직전 활동 패턴 (레시피 생성 수, 마지막 요리 시점 등)
- 가입 후 탈퇴까지 기간 (Day 1, Week 1, Month 1 등)
- 사용 기능별 탈퇴율 차이

---

## 제외된 이벤트

다음 이벤트들은 분석 가치가 낮거나 중복으로 판단되어 구현에서 제외되었습니다:

| 이벤트 | 제외 사유 |
|-------|----------|
| `settings_view` | 설정 페이지 진입만으로는 분석 가치 낮음 |
| `settings_link_click` | 약관/개인정보방침 클릭은 법적 의무 조회로 분석 가치 낮음 |
| `settings_logout` | Native에서 이미 `logout` 이벤트 추적 중 (중복) |

---

## 참고 문서

- [구현 계획서](./amplitude-settings-implementation.md)
- [이벤트 상수 정의](../../../webview-v2/src/shared/analytics/amplitudeEvents.ts)
- [전체 이벤트 정의서](../amplitude-events-final.md)
