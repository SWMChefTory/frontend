# 요리 모드 Amplitude 이벤트 구현 요약

## 구현 개요

| 항목 | 내용 |
|-----|------|
| 구현일 | 2024-12-17 |
| 이벤트 수 | 3개 |
| 변경 파일 | 5개 |
| TypeScript 컴파일 | ✅ 통과 |

---

## 구현된 이벤트 목록

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 1 | `cooking_mode_start` | 요리 모드 진입 | `recipe_id`, `total_steps`, `total_details` |
| 2 | `cooking_mode_command` | 명령 실행 (음성/터치) | `command_type`, `trigger_method`, `current_step`, `current_detail` |
| 3 | `cooking_mode_end` | 요리 모드 종료 (세션 집계) | `duration_seconds`, `step_completion_rate`, `detail_completion_rate`, 명령 통계 |

---

## 이벤트 상세

### 1. `cooking_mode_start`

**트리거 시점**: 요리 모드 페이지 진입 시 (1회)

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `recipe_id` | string | 레시피 고유 ID |
| `total_steps` | number | 전체 단계 수 (인트로 포함) |
| `total_details` | number | 전체 세부 항목 수 (인트로 포함) |

---

### 2. `cooking_mode_command`

**트리거 시점**: 사용자가 명령을 실행할 때마다

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `recipe_id` | string | 레시피 고유 ID |
| `command_type` | string | 명령 카테고리 |
| `command_detail` | string | 구체적 명령 |
| `trigger_method` | string | 트리거 방식 (`voice` 또는 `touch`) |
| `current_step` | number | 현재 단계 (0-indexed) |
| `current_detail` | number | 현재 세부 항목 (Step 내 0-indexed) |

**command_type별 command_detail 값**:

| command_type | command_detail | 설명 |
|--------------|----------------|------|
| `navigation` | `NEXT`, `PREV`, `STEP` | 단계 이동 |
| `video_control` | `VIDEO_PLAY`, `VIDEO_STOP`, `TIMESTAMP` | 영상 제어 |
| `timer` | `TIMER_SET`, `TIMER_START`, `TIMER_STOP`, `TIMER_CHECK` | 타이머 조작 |
| `info` | `INGREDIENT` | 재료 정보 조회 |

**trigger_method별 트리거 위치**:

| trigger_method | 트리거 위치 |
|----------------|------------|
| `voice` | 음성 명령 인식 후 실행 시 |
| `touch` | 단계 목록/프로그레스바 터치 시 |

---

### 3. `cooking_mode_end`

**트리거 시점**: 요리 모드에서 나갈 때 (페이지 언마운트)

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `recipe_id` | string | 레시피 고유 ID |
| `duration_seconds` | number | 체류 시간 (초) |
| **Step 관련** | | |
| `total_steps` | number | 전체 단계 수 |
| `visited_steps_unique` | number | 방문한 고유 단계 수 |
| `step_completion_rate` | number | 단계 완료율 (%) |
| **Detail 관련** | | |
| `total_details` | number | 전체 세부 항목 수 |
| `visited_details_total` | number | 세부 항목 방문 총 횟수 (중복 포함) |
| `visited_details_unique` | number | 방문한 고유 세부 항목 수 |
| `detail_completion_rate` | number | 세부 항목 완료율 (%) |
| **Command 관련** | | |
| `command_count` | number | 총 명령 실행 횟수 |
| `voice_command_count` | number | 음성 명령 횟수 |
| `touch_command_count` | number | 터치 명령 횟수 |
| `command_breakdown_navigation` | number | navigation 명령 횟수 |
| `command_breakdown_video_control` | number | video_control 명령 횟수 |
| `command_breakdown_timer` | number | timer 명령 횟수 |
| `command_breakdown_info` | number | info 명령 횟수 |
| **기타** | | |
| `loop_toggle_count` | number | 반복재생 버튼 토글 횟수 |
| `timer_button_touch_count` | number | 타이머 버튼 터치 횟수 |
| `mic_button_touch_count` | number | 마이크 버튼 터치 횟수 |

---

## 이벤트 흐름도

```
요리 모드 진입
       │
       ▼
cooking_mode_start (1회)
       │
       ▼
┌──────────────────────────────────────┐
│  요리 모드 사용 중                     │
│  ├─ 음성 명령 ──► cooking_mode_command │
│  ├─ 터치 이동 ──► cooking_mode_command │
│  ├─ 반복재생 버튼 ──► (내부 카운트만)   │
│  ├─ 타이머 버튼 ──► (내부 카운트만)     │
│  └─ 마이크 버튼 ──► (내부 카운트만)     │
└──────────────────────────────────────┘
       │
       ▼
cooking_mode_end (세션 집계 포함)
```

---

## 주의사항: Step vs Detail 구조

### Step과 Detail의 관계

- **Step**: 대분류 단계 (예: "인트로", "재료 준비", "볶기")
- **Detail**: Step 내 세부 항목 (예: "양파를 썰어주세요", "마늘을 다져주세요")

```
Step 0 (인트로): Detail 0 (인트로 영상)
Step 1 (재료 준비):
  ├── Detail 0: "양파를 썰어주세요"
  ├── Detail 1: "마늘을 다져주세요"
  └── Detail 2: "고기를 손질해주세요"
Step 2 (볶기):
  ├── Detail 0: "팬에 기름을 두르세요"
  └── Detail 1: "양파를 먼저 볶아주세요"
```

### 인트로 단계

- **`current_step = 0`**: 인트로 단계 (영상 시작 ~ 첫 레시피 단계 전)
- **`current_step = 1`**: 첫 번째 실제 레시피 단계
- **`total_steps`**: 인트로 포함 전체 단계 수
- **`total_details`**: 인트로 Detail 포함 전체 세부 항목 수

> 분석 시 `current_step = 0`은 "아직 요리를 시작하지 않은 상태"로 해석

### current_detail 해석

- `current_detail`은 **Step 내 상대적 인덱스** (0-indexed)
- `current_step`과 함께 해석해야 정확한 위치 파악 가능

> 예시: `current_step=1, current_detail=2` = "Step 1의 세 번째 세부 항목"

### recipe-detail vs recipe-step 데이터 차이

| 페이지 | 이벤트 | 인트로 포함 | 예시 (서버 Step 2개, 각 Detail 2개) |
|-------|--------|-----------|-----------------------------------|
| recipe-detail | `RECIPE_DETAIL_VIEW` | ❌ | `total_steps=2`, `total_details=4` |
| recipe-step | `COOKING_MODE_*` | ✅ | `total_steps=3`, `total_details=5` |

> **분석 시 주의**: 같은 레시피라도 페이지에 따라 값이 다를 수 있음

---

## 분석 가능 지표

### 퍼널 분석

```
cooking_mode_start (100%)
       │
       ▼
cooking_mode_command (실제 사용자)
       │
       ▼
cooking_mode_end
  └─ step_completion_rate >= 90% (완주 사용자)
```

### 핵심 지표

| 지표 | 계산 방법 | 목적 |
|-----|----------|------|
| 세션당 평균 명령 횟수 | `AVG(command_count)` | 사용 강도 파악 |
| 평균 체류 시간 | `AVG(duration_seconds)` | 요리 완료 시간 파악 |
| 평균 Step 완료율 | `AVG(step_completion_rate)` | 대분류 단계 완주율 |
| 평균 Detail 완료율 | `AVG(detail_completion_rate)` | 세부 항목 완주율 (정밀) |
| 핸즈프리 활용도 | `voice_command_count / command_count` | 음성 명령 사용 비율 |
| 이벤트 완결성 | `cooking_mode_end / cooking_mode_start` | 데이터 품질 |
| 반복재생 사용률 | `loop_toggle_count > 0` 비율 | 기능 활용도 |
| 타이머 버튼 사용률 | `timer_button_touch_count > 0` 비율 | 타이머 기능 관심도 |
| 마이크 버튼 사용률 | `mic_button_touch_count > 0` 비율 | 음성 기능 관심도 |

### 명령 패턴 분석

| 분석 항목 | 데이터 소스 | 인사이트 |
|----------|-----------|----------|
| 가장 많이 사용하는 명령 | `command_breakdown_*` | 핵심 기능 파악 |
| 명령 유형별 음성/터치 비율 | `cooking_mode_command` | 음성 적합 명령 파악 |
| 단계별 명령 빈도 | `current_step` 분포 | 어려운 단계 파악 |
| 세부 항목별 명령 빈도 | `current_step` + `current_detail` 조합 | 정밀한 어려운 지점 파악 |

### 사용자 세그먼트

| 세그먼트 | 조건 | 특징 |
|---------|------|------|
| 완주 사용자 (Step) | `step_completion_rate >= 90` | 대분류 완주 |
| 완주 사용자 (Detail) | `detail_completion_rate >= 90` | 세부 항목까지 완주 |
| 활발한 사용자 | `command_count >= 10` AND `duration_seconds >= 600` | 적극 활용 |
| 이탈 사용자 (Step) | `step_completion_rate < 50` | 대분류 절반 미만 |
| 이탈 사용자 (Detail) | `detail_completion_rate < 50` | 세부 항목 절반 미만 |
| 음성 선호 | `voice_command_count / command_count >= 0.7` | 핸즈프리 주사용 |
| 터치 선호 | `touch_command_count / command_count >= 0.7` | 수동 조작 선호 |
| 진입만 한 사용자 | `command_count == 0` | 온보딩 개선 필요 |
| 반복재생 활용 | `loop_toggle_count >= 1` | 구간 반복 기능 사용자 |
| 타이머 관심 | `timer_button_touch_count >= 1` | 타이머 UI 탐색 사용자 |
| 음성 가이드 관심 | `mic_button_touch_count >= 1` | 음성 가이드 UI 탐색 사용자 |

---

## 주요 분석 질문

1. **진입 후 실제 사용률**: 요리 모드 진입 후 최소 1개 명령을 실행한 비율?
2. **Step 완주율**: 전체 단계의 90% 이상 방문한 비율? (`step_completion_rate >= 90`)
3. **Detail 완주율**: 전체 세부 항목의 90% 이상 방문한 비율? (`detail_completion_rate >= 90`)
4. **평균 세션 시간**: 요리 모드에서 평균 얼마나 체류?
5. **핸즈프리 활용도**: 음성 명령 비율이 50% 이상인 사용자 비율?
6. **데이터 완결성**: start 대비 end 이벤트 비율?
7. **반복재생 사용률**: `loop_toggle_count >= 1`인 사용자 비율?
8. **타이머 버튼 사용률**: `timer_button_touch_count >= 1`인 사용자 비율?
9. **마이크 버튼 사용률**: `mic_button_touch_count >= 1`인 사용자 비율?

---

## 기존 이벤트와의 관계

| 시나리오 | 발생 이벤트 |
|---------|-----------|
| 레시피 상세에서 요리 시작 클릭 | `recipe_detail_cooking_start` |
| 요리 모드 진입 | `cooking_mode_start` |
| 요리 중 명령 실행 | `cooking_mode_command` (반복) |
| 요리 모드 종료 | `cooking_mode_end` |
| 튜토리얼 진행 | `TUTORIAL_HANDSFREE_*` (별도 이벤트) |

---

## 문서 참조

- 상세 설계: [amplitude-cooking-mode-events.md](./amplitude-cooking-mode-events.md)
- 구현 계획: [amplitude-cooking-mode-implementation-plan.md](./amplitude-cooking-mode-implementation-plan.md)
- 이벤트 상수: `webview-v2/src/shared/analytics/amplitudeEvents.ts`
