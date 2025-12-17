# 요리 모드 (핸즈프리 모드) Amplitude 이벤트 설계

## 개요

요리 모드(핸즈프리 모드)에서 사용자의 행동을 추적하기 위한 Amplitude 이벤트 설계 문서입니다.

### 목적

- 요리 모드 사용 패턴 파악
- 음성 명령 vs 터치 명령 비율 분석
- 명령어 종류별 사용 빈도 분석
- 사용자 완료율 및 이탈 지점 파악

### 참고 사항

- 음성 인식 방식이 변경될 수 있음 (현재: Clova Note API, 검토 중: Siri 연동)
- 음성 인식 실패 추적은 방식 확정 후 별도 설계 예정

---

## 이벤트 목록

| 이벤트 이름 | 발생 시점 | 목적 |
|------------|----------|------|
| `cooking_mode_start` | 요리 모드 진입 | 세션 시작 추적 |
| `cooking_mode_command` | 명령 실행 시마다 | 개별 명령 패턴 분석 |
| `cooking_mode_end` | 요리 모드 종료 | 세션 집계 데이터 |

---

## 이벤트 상세

### 1. cooking_mode_start

요리 모드에 진입했을 때 발생합니다.

#### 속성

| 속성 이름 | 타입 | 필수 | 설명 | 비고 |
|----------|------|------|------|------|
| `recipe_id` | string | O | 레시피 고유 ID | |
| `total_steps` | number | O | 전체 단계 수 | |

#### 트리거 위치

- `RecipeStepPageReady` 컴포넌트 마운트 시 (useEffect)
- 파일: `webview-v2/src/views/recipe-step/ui/index.tsx`

#### 예시

```json
{
  "event": "cooking_mode_start",
  "properties": {
    "recipe_id": "abc-123",
    "total_steps": 8
  }
}
```

---

### 2. cooking_mode_command

명령이 실행될 때마다 발생합니다. 튜토리얼 중 실행된 명령도 포함됩니다.

#### 속성

| 속성 이름 | 타입 | 필수 | 설명 | 가능한 값 |
|----------|------|------|------|----------|
| `recipe_id` | string | O | 레시피 고유 ID | - |
| `command_type` | string | O | 명령 카테고리 | `navigation`, `video_control`, `timer`, `info` |
| `command_detail` | string | O | 구체적 명령 | 아래 상세 참조 |
| `trigger_method` | string | O | 트리거 방식 | `voice`, `touch` |
| `current_step` | number | O | 현재 단계 (0-indexed) | - |

#### command_type별 command_detail 값

| command_type | command_detail 가능 값 | 설명 |
|-------------|----------------------|------|
| `navigation` | `NEXT`, `PREV`, `STEP` | 단계 이동 |
| `video_control` | `VIDEO_PLAY`, `VIDEO_STOP`, `TIMESTAMP` | 영상 제어 |
| `timer` | `TIMER_SET`, `TIMER_START`, `TIMER_STOP`, `TIMER_CHECK` | 타이머 조작 |
| `info` | `INGREDIENT` | 재료 정보 조회 |

> **참고**: `EXTRA` 명령(인식 불가)은 분석 가치가 낮아 추적하지 않습니다.

#### 트리거 위치

**음성 명령 (trigger_method: "voice")**

- `onIntent` 콜백 내부에서 직접 트래킹
- 파일: `webview-v2/src/views/recipe-step/ui/index.tsx` (line 175-266)

**터치 명령 (trigger_method: "touch")**

- `StepsContent` onClick에서 직접 트래킹
- `ProgressBar` onClick에서 직접 트래킹
- 파일: `stepsContent.tsx`, `progressBar.tsx`

#### 예시

```json
{
  "event": "cooking_mode_command",
  "properties": {
    "recipe_id": "abc-123",
    "command_type": "navigation",
    "command_detail": "NEXT",
    "trigger_method": "voice",
    "current_step": 2
  }
}
```

---

### 3. cooking_mode_end

요리 모드에서 나갔을 때 발생합니다. 세션 전체의 집계 데이터를 포함합니다.

#### 속성

| 속성 이름 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `recipe_id` | string | O | 레시피 고유 ID |
| `total_steps` | number | O | 전체 단계 수 |
| `duration_seconds` | number | O | 요리 모드 체류 시간 (초) |
| `exit_step` | number | O | 이탈 시점 단계 (0-indexed) |
| `visited_steps_total` | number | O | 단계 방문 총 횟수 (중복 포함, 자동 재생 포함) |
| `visited_steps_unique` | number | O | 방문한 고유 단계 수 |
| `step_completion_rate` | number | O | 단계 완료율 (unique / total × 100) |
| `command_count` | number | O | 총 명령 실행 횟수 |
| `voice_command_count` | number | O | 음성 명령 횟수 |
| `touch_command_count` | number | O | 터치 명령 횟수 |
| `command_breakdown_navigation` | number | O | navigation 명령 횟수 (NEXT, PREV, STEP) |
| `command_breakdown_video_control` | number | O | video_control 명령 횟수 (VIDEO_PLAY, VIDEO_STOP, TIMESTAMP) |
| `command_breakdown_timer` | number | O | timer 명령 횟수 (TIMER_SET, START, STOP, CHECK) |
| `command_breakdown_info` | number | O | info 명령 횟수 (INGREDIENT) |
| `loop_toggle_count` | number | O | 반복재생 버튼 토글 횟수 |
| `timer_button_touch_count` | number | O | 타이머 버튼 터치 횟수 |
| `mic_button_touch_count` | number | O | 마이크 버튼 터치 횟수 |

> **참고**: `command_breakdown_*` 속성들은 Amplitude SDK 타입 제약으로 인해 중첩 객체 대신 평탄화된 형태로 전송됩니다.

#### 트리거 위치

- `RecipeStepPageReady` 컴포넌트 언마운트 시 (useEffect cleanup)
- 뒤로가기 버튼 클릭 시 (`router.back()`)
- 파일: `webview-v2/src/views/recipe-step/ui/index.tsx`

#### 예시

```json
{
  "event": "cooking_mode_end",
  "properties": {
    "recipe_id": "abc-123",
    "total_steps": 8,
    "duration_seconds": 1847,
    "exit_step": 7,
    "visited_steps_total": 15,
    "visited_steps_unique": 8,
    "step_completion_rate": 100,
    "command_count": 23,
    "voice_command_count": 18,
    "touch_command_count": 5,
    "command_breakdown_navigation": 12,
    "command_breakdown_video_control": 6,
    "command_breakdown_timer": 3,
    "command_breakdown_info": 1,
    "loop_toggle_count": 2,
    "timer_button_touch_count": 3,
    "mic_button_touch_count": 1
  }
}
```

---

## 주의사항: 인트로 단계

`useRecipeStepController`에서 첫 번째 단계로 "인트로" 단계가 자동 삽입됩니다.

```typescript
// useRecipeStepController.ts (line 31-37)
const introStep: RecipeStep = {
  subtitle: "인트로",
  details: [{ text: "", startTime: 0, endTime: recipe.steps[0].details[0].startTime }],
};
const stepsWithIntro = [introStep, ...recipe.steps];
```

따라서:

- **`current_step = 0`**: 인트로 단계 (영상 시작 ~ 첫 레시피 단계 전)
- **`current_step = 1`**: 첫 번째 실제 레시피 단계
- **`total_steps`**: 인트로 포함 전체 단계 수 (원래 단계 + 1)

> 분석 시 `current_step = 0`인 명령/이탈은 "아직 요리를 시작하지 않은 상태"로 해석할 수 있습니다.

---

## 설계 결정 사항

### 1. trigger_method 구분 방식

**결정: 각 위치에서 직접 트래킹**

음성과 터치의 처리 흐름이 이미 완전히 분리되어 있으므로, 공통 함수에 파라미터를 추가하는 대신 각 위치에서 직접 트래킹합니다.

- 음성: `onIntent` 콜백 내부에서 `trigger_method: "voice"`로 트래킹
- 터치: `onClick` 핸들러에서 `trigger_method: "touch"`로 트래킹

**이유:**

- 기존 코드 흐름이 이미 분리되어 있음
- 공통 함수 수정 시 모든 호출부 변경 필요
- 각 위치에서 트래킹하면 수정 범위가 명확함

### 2. 튜토리얼 중 명령 포함 여부

튜토리얼 중에도 실제로 명령이 실행되므로 `cooking_mode_command`에 포함합니다.

**이유:**

- 튜토리얼 중에도 실제 명령이 실행됨 (영상 재생, 정지, 다음 단계 등)
- 제외 시 "튜토리얼 중 이탈" 케이스의 데이터 손실

**참고:** 튜토리얼 관련 분석은 기존 `TUTORIAL_HANDSFREE_*` 이벤트와 연계하여 수행합니다.

### 3. 영상 자동 재생 시 방문 카운트 여부

**결정: 카운트 함**

영상 자동 재생에 의한 단계 변경도 "방문"으로 카운트합니다.

**이유:**

- 사용자가 해당 단계의 영상을 "경험"했음
- `visited_steps_total`과 `visited_steps_unique`로 구분 가능
- 제외 시 "영상만 보고 완주한 사용자"가 완료율 0%로 기록됨
- 실제 요리 시나리오에서 영상 자동 재생은 정상적인 사용 패턴

**구현 위치:**

`useRecipeStepController`의 `chageStepByTime` 또는 `changeStepByIndex` 호출 시 방문 기록

---

## 구현 시 주의사항

### 1. 터치로 추적할 수 없는 명령어

일부 명령어는 음성으로만 실행 가능합니다.

| command_type | 음성 | 터치 | 비고 |
|-------------|------|------|------|
| `navigation` (NEXT, PREV, STEP) | O | O | 단계 클릭으로 가능 |
| `video_control` (PLAY, STOP) | O | △ | 영상 직접 터치로 가능하나 YouTube iframe이라 추적 어려움 |
| `video_control` (TIMESTAMP) | O | X | 음성 전용 |
| `timer` | O | O | 타이머 버튼 UI 존재 |
| `info` (INGREDIENT) | O | X | 음성 전용 |

**결론:**

- `TIMESTAMP`, `INGREDIENT`는 `trigger_method`가 항상 `voice`
- YouTube iframe 내부 터치는 추적 불가 (허용)

### 2. cooking_mode_end 이벤트 누락 가능성

| 시나리오 | useEffect cleanup 실행 | 이벤트 발생 |
|---------|----------------------|------------|
| 뒤로가기 버튼 | O | O |
| 브라우저 뒤로가기 | O | O |
| 앱 강제 종료 | X | X |
| 네트워크 끊김 | O (발송 실패) | X |
| 웹뷰 크래시 | X | X |

**대응:**

- 앱 강제 종료/크래시는 불가피하므로 허용
- `cooking_mode_start` 대비 `cooking_mode_end` 비율로 누락률 모니터링
- 이벤트 누락률 = `1 - (end_count / start_count)`

### 3. command_count = 0인 경우

사용자가 요리 모드에 진입했다가 아무 명령 없이 바로 나가는 경우:

- `cooking_mode_end` 이벤트는 정상 발송
- `command_count: 0`, `voice_command_count: 0`, `touch_command_count: 0`
- 분석 시 "진입만 하고 이탈한 사용자" 세그먼트로 활용

---

## 분석 지표

### 1. 기본 지표

| 지표 | 계산 방법 | 목적 |
|-----|----------|------|
| 세션당 평균 명령 횟수 | `AVG(command_count)` | 사용 강도 파악 |
| 평균 체류 시간 | `AVG(duration_seconds)` | 요리 완료 시간 파악 |
| 평균 완료율 | `AVG(step_completion_rate)` | 레시피 완주율 |
| 음성/터치 비율 | `voice_count / total_count` | 핸즈프리 활용도 |
| 이벤트 누락률 | `1 - (end_count / start_count)` | 데이터 품질 모니터링 |

### 2. 명령 패턴 분석

| 분석 항목 | 데이터 소스 | 인사이트 |
|----------|-----------|----------|
| 가장 많이 사용하는 명령 | `command_breakdown_*` | 핵심 기능 파악 |
| 명령 유형별 음성/터치 비율 | `cooking_mode_command` | 음성 적합 명령 파악 |
| 단계별 명령 빈도 | `current_step` 분포 | 어려운 단계 파악 |

### 3. 사용자 세그먼트

| 세그먼트 | 조건 | 특징 |
|---------|------|------|
| 완주 사용자 | `step_completion_rate >= 90` | 충성 사용자 |
| 활발한 사용자 | `command_count >= 10` AND `duration_seconds >= 600` | 적극 활용 |
| 이탈 사용자 | `step_completion_rate < 50` | 개선 필요 |
| 음성 선호 | `voice_command_count / command_count >= 0.7` | 핸즈프리 주사용 |
| 터치 선호 | `touch_command_count / command_count >= 0.7` | 수동 조작 선호 |
| 진입만 한 사용자 | `command_count == 0` | 온보딩 개선 필요 |
| 인트로 이탈 | `exit_step == 0` | 요리 시작 전 이탈 |

---

## 퍼널 분석

```
recipe_detail_cooking_start (상세 페이지에서 요리 시작 클릭)
    ↓
cooking_mode_start (요리 모드 진입)
    ↓
cooking_mode_command (명령 실행 - 반복)
    ↓
cooking_mode_end (요리 모드 종료)
```

### 주요 질문

1. **진입 후 실제 사용률**: 요리 모드 진입 후 최소 1개 명령을 실행한 비율?
2. **완주율**: 전체 단계의 90% 이상 방문한 비율?
3. **평균 세션 시간**: 요리 모드에서 평균 얼마나 체류?
4. **핸즈프리 활용도**: 음성 명령 비율이 50% 이상인 사용자 비율?
5. **데이터 완결성**: start 대비 end 이벤트 비율?
6. **인트로 이탈률**: `exit_step == 0`인 사용자 비율? (요리 시작 전 이탈)

---

## 구현 체크리스트

### amplitudeEvents.ts 추가

```typescript
// 요리 모드 (Cooking Mode / Hands-free Mode)
COOKING_MODE_START = "cooking_mode_start",
COOKING_MODE_COMMAND = "cooking_mode_command",
COOKING_MODE_END = "cooking_mode_end",
```

### 신규 훅 생성: useCookingModeAnalytics

```typescript
// webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts

interface CookingModeAnalyticsState {
  sessionStartTime: number;
  visitedStepsSet: Set<number>;
  visitedStepsCount: number;
  commandCounts: {
    total: number;
    voice: number;
    touch: number;
    breakdown: {
      navigation: number;
      video_control: number;
      timer: number;
      info: number;
    };
  };
}

interface CookingModeAnalytics {
  // 시작 이벤트 발송
  trackStart: (recipeId: string, totalSteps: number) => void;

  // 명령 이벤트 발송 + 내부 카운터 증가
  trackCommand: (params: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: "voice" | "touch";
    currentStep: number;
  }) => void;

  // 단계 방문 기록 (이벤트 발송 X, 내부 상태만)
  recordStepVisit: (stepIndex: number) => void;

  // 반복재생 토글 기록 (이벤트 발송 X, 내부 카운터만)
  recordLoopToggle: () => void;

  // 타이머 버튼 터치 기록 (이벤트 발송 X, 내부 카운터만)
  recordTimerButtonTouch: () => void;

  // 마이크 버튼 터치 기록 (이벤트 발송 X, 내부 카운터만)
  recordMicButtonTouch: () => void;

  // 종료 이벤트 발송
  trackEnd: (recipeId: string, totalSteps: number, exitStep: number) => void;
}
```

### 상태 추적 필요 항목

- [ ] 세션 시작 시간 기록
- [ ] 방문한 단계 Set (unique 계산용)
- [ ] 방문 횟수 카운터 (total 계산용)
- [ ] 명령 횟수 카운터 (전체, 음성, 터치)
- [ ] 명령 유형별 카운터 (breakdown용)
- [ ] 반복재생 토글 카운터
- [ ] 타이머 버튼 터치 카운터
- [ ] 마이크 버튼 터치 카운터

### 수정 필요 파일

| 파일 | 수정 내용 |
|------|----------|
| `amplitudeEvents.ts` | 이벤트 상수 추가 |
| `index.tsx` | useCookingModeAnalytics 훅 연동, 이벤트 발송 |
| `stepsContent.tsx` | 터치 명령 트래킹 추가 |
| `progressBar.tsx` | 터치 명령 트래킹 추가 |
| `useRecipeStepController.ts` | 단계 변경 시 방문 기록 콜백 추가 |

---

## 향후 고려 사항

### 음성 인식 실패 추적 (방식 확정 후)

```typescript
// 추후 추가 예정
COOKING_MODE_VOICE_FAIL = "cooking_mode_voice_fail"
// 속성: recipe_id, fail_reason, current_step
```

### 튜토리얼 완료 여부

- 기존 `TUTORIAL_HANDSFREE_*` 이벤트와 연계 분석
- 튜토리얼 완료 사용자 vs 미완료 사용자의 요리 모드 사용 패턴 비교

### video_type 속성 추가 (백엔드 지원 시)

- 현재 Recipe API 응답에 `videoType` 필드 없음
- 백엔드에서 추가 시 `cooking_mode_start`에 포함 가능

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| [webview-v2/src/views/recipe-step/ui/index.tsx](../../../../webview-v2/src/views/recipe-step/ui/index.tsx) | 요리 모드 메인 페이지 |
| [webview-v2/src/views/recipe-step/hooks/useSimpleSpeech.ts](../../../../webview-v2/src/views/recipe-step/hooks/useSimpleSpeech.ts) | 음성 인식 훅 |
| [webview-v2/src/views/recipe-step/hooks/useTimerIntent.ts](../../../../webview-v2/src/views/recipe-step/hooks/useTimerIntent.ts) | 타이머 명령 처리 |
| [webview-v2/src/views/recipe-step/hooks/useRecipeStepController.ts](../../../../webview-v2/src/views/recipe-step/hooks/useRecipeStepController.ts) | 단계 상태 관리 |
| [webview-v2/src/views/recipe-step/hooks/useTutorial.ts](../../../../webview-v2/src/views/recipe-step/hooks/useTutorial.ts) | 튜토리얼 상태 관리 |
| [webview-v2/src/views/recipe-step/ui/stepsContent.tsx](../../../../webview-v2/src/views/recipe-step/ui/stepsContent.tsx) | 단계 목록 UI (터치 이벤트) |
| [webview-v2/src/views/recipe-step/ui/progressBar.tsx](../../../../webview-v2/src/views/recipe-step/ui/progressBar.tsx) | 프로그레스바 UI (터치 이벤트) |
| [webview-v2/src/shared/analytics/amplitudeEvents.ts](../../../../webview-v2/src/shared/analytics/amplitudeEvents.ts) | 이벤트 상수 정의 |
