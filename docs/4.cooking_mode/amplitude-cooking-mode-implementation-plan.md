# 요리 모드 Amplitude 이벤트 구현 계획서

## 개요

본 문서는 `amplitude-cooking-mode-events.md` 설계서를 기반으로 실제 구현을 위한 상세 계획을 정리합니다.

### 참고 문서

- [이벤트 설계서](./amplitude-cooking-mode-events.md)

### 구현 범위

| 이벤트 | 설명 |
|--------|------|
| `cooking_mode_start` | 요리 모드 진입 시 |
| `cooking_mode_command` | 명령 실행 시마다 |
| `cooking_mode_end` | 요리 모드 종료 시 |

### 주의사항: 인트로 단계

`useRecipeStepController`에서 steps 배열 맨 앞에 "인트로" 단계가 자동 추가됩니다.

```typescript
// useRecipeStepController.ts (31-37줄)
return [
  {
    id: INTRO,
    stepOrder: -1,
    subtitle: "인트로",
    details: [{ start: 0, text: "인트로" }],
  },
  ..._steps,
]
```

**영향**:
- `currentStep = 0`은 인트로 단계
- 실제 요리 1단계는 `currentStep = 1`
- `total_steps`에 인트로가 포함됨

---

## Phase 1: 사전 준비

### 1.1 이벤트 상수 추가

**파일**: `webview-v2/src/shared/analytics/amplitudeEvents.ts`

**위치**: 기존 `TUTORIAL_HANDSFREE_*` 이벤트 아래 (약 44줄 이후)

```typescript
// ─────────────────────────────────────────────────────────────
// 요리 모드 (Cooking Mode / Hands-free Mode)
// 요리 모드에서의 사용자 행동 추적 (음성/터치 명령, 세션 분석)
// @see /frontend/docs/4.cooking_mode/amplitude-cooking-mode-events.md
// ─────────────────────────────────────────────────────────────

/** 요리 모드 진입 */
COOKING_MODE_START = "cooking_mode_start",

/** 요리 모드 명령 실행 (음성/터치) */
COOKING_MODE_COMMAND = "cooking_mode_command",

/** 요리 모드 종료 (세션 집계) */
COOKING_MODE_END = "cooking_mode_end",
```

---

## Phase 2: Analytics 훅 생성

### 2.1 훅 파일 생성

**파일**: `webview-v2/src/views/recipe-step/hooks/useCookingModeAnalytics.ts`

**설계 원칙**:

- `useRef`로 상태 관리 (리렌더링 방지)
- 기존 `recipe-detail/ui/index.tsx`의 패턴 참고
- 단일 훅에서 모든 analytics 로직 캡슐화

### 2.2 타입 정의

```typescript
// ─────────────────────────────────────────────────────────────
// 타입 정의
// ─────────────────────────────────────────────────────────────

/** 명령 카테고리 */
export type CommandType =
  | "navigation"
  | "video_control"
  | "timer"
  | "info";

/** 트리거 방식 */
export type TriggerMethod = "voice" | "touch";

/** 명령 유형별 카운터 */
interface CommandBreakdown {
  navigation: number;
  video_control: number;
  timer: number;
  info: number;
}

/** 내부 상태 (useRef로 관리) */
interface AnalyticsState {
  sessionStartTime: number;
  visitedStepsSet: Set<number>;
  visitedStepsCount: number;
  voiceCommandCount: number;
  touchCommandCount: number;
  commandBreakdown: CommandBreakdown;
}

/** 훅 반환 타입 */
export interface CookingModeAnalytics {
  /** 세션 시작 (start 이벤트 발송) */
  trackStart: (params: {
    recipeId: string;
    totalSteps: number;
  }) => void;

  /** 명령 실행 (command 이벤트 발송 + 내부 카운터 증가) */
  trackCommand: (params: {
    recipeId: string;
    commandType: CommandType;
    commandDetail: string;
    triggerMethod: TriggerMethod;
    currentStep: number;
  }) => void;

  /** 단계 방문 기록 (이벤트 발송 X, 내부 상태만) */
  recordStepVisit: (stepIndex: number) => void;

  /** 세션 종료 (end 이벤트 발송) */
  trackEnd: (params: {
    recipeId: string;
    totalSteps: number;
    exitStep: number;
  }) => void;
}
```

### 2.3 훅 구현 코드

```typescript
import { useRef, useCallback } from "react";
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export function useCookingModeAnalytics(): CookingModeAnalytics {
  // useRef로 상태 관리 (리렌더링 방지)
  const stateRef = useRef<AnalyticsState>({
    sessionStartTime: 0,
    visitedStepsSet: new Set(),
    visitedStepsCount: 0,
    voiceCommandCount: 0,
    touchCommandCount: 0,
    commandBreakdown: {
      navigation: 0,
      video_control: 0,
      timer: 0,
      info: 0,
    },
  });

  // 상태 초기화 함수
  const resetState = useCallback(() => {
    stateRef.current = {
      sessionStartTime: Date.now(),
      visitedStepsSet: new Set(),
      visitedStepsCount: 0,
      voiceCommandCount: 0,
      touchCommandCount: 0,
      commandBreakdown: {
        navigation: 0,
        video_control: 0,
        timer: 0,
        info: 0,
      },
    };
  }, []);

  const trackStart = useCallback(
    ({
      recipeId,
      totalSteps,
    }: {
      recipeId: string;
      totalSteps: number;
    }) => {
      // 상태 초기화
      resetState();

      // 이벤트 발송
      track(AMPLITUDE_EVENT.COOKING_MODE_START, {
        recipe_id: recipeId,
        total_steps: totalSteps,
      });
    },
    [resetState]
  );

  const trackCommand = useCallback(
    ({
      recipeId,
      commandType,
      commandDetail,
      triggerMethod,
      currentStep,
    }: {
      recipeId: string;
      commandType: CommandType;
      commandDetail: string;
      triggerMethod: TriggerMethod;
      currentStep: number;
    }) => {
      const state = stateRef.current;

      // 내부 카운터 증가
      if (triggerMethod === "voice") {
        state.voiceCommandCount++;
      } else {
        state.touchCommandCount++;
      }
      state.commandBreakdown[commandType]++;

      // 이벤트 발송
      track(AMPLITUDE_EVENT.COOKING_MODE_COMMAND, {
        recipe_id: recipeId,
        command_type: commandType,
        command_detail: commandDetail,
        trigger_method: triggerMethod,
        current_step: currentStep,
      });
    },
    []
  );

  const recordStepVisit = useCallback((stepIndex: number) => {
    const state = stateRef.current;
    state.visitedStepsSet.add(stepIndex);
    state.visitedStepsCount++;
  }, []);

  const trackEnd = useCallback(
    ({
      recipeId,
      totalSteps,
      exitStep,
    }: {
      recipeId: string;
      totalSteps: number;
      exitStep: number;
    }) => {
      const state = stateRef.current;
      const durationSeconds = Math.round(
        (Date.now() - state.sessionStartTime) / 1000
      );
      const uniqueSteps = state.visitedStepsSet.size;
      const completionRate =
        totalSteps > 0 ? Math.round((uniqueSteps / totalSteps) * 100) : 0;

      // 참고: command_breakdown은 Amplitude SDK 타입 제약으로 평탄화하여 전송
      track(AMPLITUDE_EVENT.COOKING_MODE_END, {
        recipe_id: recipeId,
        total_steps: totalSteps,
        duration_seconds: durationSeconds,
        exit_step: exitStep,
        visited_steps_total: state.visitedStepsCount,
        visited_steps_unique: uniqueSteps,
        step_completion_rate: completionRate,
        command_count:
          state.voiceCommandCount + state.touchCommandCount,
        voice_command_count: state.voiceCommandCount,
        touch_command_count: state.touchCommandCount,
        command_breakdown_navigation: state.commandBreakdown.navigation,
        command_breakdown_video_control: state.commandBreakdown.video_control,
        command_breakdown_timer: state.commandBreakdown.timer,
        command_breakdown_info: state.commandBreakdown.info,
      });
    },
    []
  );

  return {
    trackStart,
    trackCommand,
    recordStepVisit,
    trackEnd,
  };
}
```

---

## Phase 3: 메인 페이지 연동

### 3.1 훅 연동 위치

**파일**: `webview-v2/src/views/recipe-step/ui/index.tsx`

### 3.2 수정 내용

#### 3.2.1 import 추가 (약 37줄 이후)

```typescript
import {
  useCookingModeAnalytics,
  CommandType,
} from "../hooks/useCookingModeAnalytics";
```

#### 3.2.2 훅 초기화 (RecipeStepPageReady 컴포넌트 내, 약 74줄 이후)

```typescript
function RecipeStepPageReady({ id }: { id: string }) {
  const { data: recipe } = useFetchRecipe(id);
  const router = useRouter();
  const orientation = useOrientation();

  // === 추가: Analytics 훅 ===
  const analytics = useCookingModeAnalytics();

  // ...기존 코드...
```

#### 3.2.3 cooking_mode_start/end 이벤트 (마운트/언마운트 시)

**위치**: 기존 useEffect 아래 (약 90줄 이후)

```typescript
// === 추가: currentIndex를 ref로 추적 (cleanup에서 사용) ===
const currentIndexRef = useRef(currentIndex);

useEffect(() => {
  currentIndexRef.current = currentIndex;
}, [currentIndex]);

// === 추가: 중복 방지 ref ===
const hasTrackedStartRef = useRef(false);

// === 추가: cooking_mode_start/end 이벤트 ===
useEffect(() => {
  if (hasTrackedStartRef.current) return;
  hasTrackedStartRef.current = true;

  // 컴포넌트 마운트 시 start 이벤트
  analytics.trackStart({
    recipeId: id,
    totalSteps: steps.length,
  });

  // 컴포넌트 언마운트 시 end 이벤트
  return () => {
    analytics.trackEnd({
      recipeId: id,
      totalSteps: steps.length,
      exitStep: currentIndexRef.current,
    });
  };
}, []);
```

#### 3.2.4 단계 방문 기록 (useEffect로 currentIndex 변경 감지)

**위치**: 위 useEffect 아래

```typescript
// === 추가: 단계 방문 기록 (currentIndex 변경 시) ===
const prevStepRef = useRef(currentIndex);

useEffect(() => {
  if (prevStepRef.current !== currentIndex) {
    analytics.recordStepVisit(currentIndex);
    prevStepRef.current = currentIndex;
  }
}, [currentIndex]);
```

**장점**:
- `useRecipeStepController` 훅 수정 불필요
- 음성/터치/자동재생 모든 경우 커버
- 단계가 실제로 변경된 시점에만 기록

#### 3.2.5 음성 명령 트래킹 (onIntent 내부)

**위치**: `onIntent` 콜백 내부, 각 명령 처리 후 (약 175-266줄)

**변경 전/후 비교 (NEXT 명령 예시)**:

```typescript
// 변경 전
if (parsedIntent === "NEXT") {
  if (isInTutorial && currentTutorialStep != 2) {
    return;
  }
  handleChangeStepWithVideoTime({
    stepIndex: currentIndex + 1,
    stepDetailIndex: 0,
  });
  if (isInTutorial && currentTutorialStep == 2) {
    handleTutorialNextStep({ index: 2 });
  }
  return;
}

// 변경 후
if (parsedIntent === "NEXT") {
  if (isInTutorial && currentTutorialStep != 2) {
    return;
  }
  handleChangeStepWithVideoTime({
    stepIndex: currentIndex + 1,
    stepDetailIndex: 0,
  });
  // === 추가: 명령 트래킹 ===
  analytics.trackCommand({
    recipeId: id,
    commandType: "navigation",
    commandDetail: "NEXT",
    triggerMethod: "voice",
    currentStep: currentIndex,
  });
  if (isInTutorial && currentTutorialStep == 2) {
    handleTutorialNextStep({ index: 2 });
  }
  return;
}
```

**전체 음성 명령 트래킹 추가 목록**:

| Intent | commandType | commandDetail | 위치 (약 줄) |
|--------|-------------|---------------|-------------|
| `NEXT` | `navigation` | `NEXT` | 178-189 |
| `PREV` | `navigation` | `PREV` | 211-217 |
| `STEP {n}` | `navigation` | `STEP` | 223-230 |
| `VIDEO PLAY` | `video_control` | `VIDEO_PLAY` | 191-199 |
| `VIDEO STOP` | `video_control` | `VIDEO_STOP` | 201-210 |
| `TIMESTAMP {n}` | `video_control` | `TIMESTAMP` | 218-222 |
| `TIMER *` | `timer` | `TIMER_SET/START/STOP/CHECK` | 231-242 |
| `INGREDIENT *` | `info` | `INGREDIENT` | 243-265 |

**참고**: `EXTRA` (인식 불가 명령)는 트래킹하지 않음. 현재 코드에서 아무 동작도 하지 않으며, 분석 가치가 낮음.

**TIMER 명령 상세 처리**:

```typescript
if (parsedIntent.startsWith("TIMER")) {
  if (isInTutorial && currentTutorialStep != 3) {
    return;
  }

  // === 추가: TIMER 세부 타입 파싱 ===
  const timerParts = parsedIntent.split(/\s+/);
  const timerAction = timerParts[1] || "SET"; // SET, START, STOP, CHECK
  const commandDetail = `TIMER_${timerAction}`;

  handleTimerIntent(parsedIntent, (error: string) => {
    timerErrorPopoverRef.current?.showErrorMessage(error);
  });

  // === 추가: 명령 트래킹 ===
  analytics.trackCommand({
    recipeId: id,
    commandType: "timer",
    commandDetail: commandDetail,
    triggerMethod: "voice",
    currentStep: currentIndex,
  });

  if (isInTutorial && currentTutorialStep == 3) {
    handleTutorialNextStep({ index: 3 });
  }
  return;
}
```

---

## Phase 4: 터치 이벤트 연동

### 4.1 StepsContent 수정

**파일**: `webview-v2/src/views/recipe-step/ui/stepsContent.tsx`

#### 4.1.1 Props 확장 및 래핑 핸들러 추가

```typescript
import { useCallback } from "react";  // 추가

export function StepsContent({
  currentStepIndex,
  currentDetailStepIndex,
  onChangeStep,
  steps,
  isLandscape,
  recipeId,
  onTouchCommand,  // === 추가 ===
}: {
  currentStepIndex: number;
  currentDetailStepIndex: number;
  onChangeStep: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  steps: RecipeStep[];
  isLandscape: boolean;
  recipeId: string;
  onTouchCommand?: (params: {  // === 추가 ===
    commandType: "navigation";
    commandDetail: "STEP";
    currentStep: number;
  }) => void;
}) {
  // === 추가: 래핑된 핸들러 (StepsContent 레벨에서 처리) ===
  const handleStepChange = useCallback(
    ({ stepIndex, stepDetailIndex }: { stepIndex: number; stepDetailIndex: number }) => {
      onChangeStep({ stepIndex, stepDetailIndex });
      onTouchCommand?.({
        commandType: "navigation",
        commandDetail: "STEP",
        currentStep: currentStepIndex,
      });
    },
    [onChangeStep, onTouchCommand, currentStepIndex]
  );

  useEffect(() => {
    scrollToStep(currentStepIndex, currentDetailStepIndex);
  }, [currentStepIndex, currentDetailStepIndex]);

  return (
    <>
      <div className="flex-1 w-full text-white h-full overflow-scroll">
        <div className="flex flex-col h-full">
          {steps.map((step, i) => {
            return (
              <Step
                i={i}
                isLandscape={isLandscape}
                isSelected={i == currentStepIndex}
                isLastChild={steps.length - 1 === i}
                currentdetailStepIndex={currentDetailStepIndex}
                step={step}
                onChangeStep={handleStepChange}  // === 수정: 래핑된 핸들러 전달 ===
                key={i}
                recipeId={recipeId}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
```

**참고**: `Detail` 컴포넌트의 onClick은 그대로 유지. `handleStepChange`가 `StepsContent` 레벨에서 트래킹을 처리하므로 하위 컴포넌트 수정 불필요.

### 4.2 ProgressBar 수정

**파일**: `webview-v2/src/views/recipe-step/ui/progressBar.tsx`

#### 4.2.1 Props 확장

```typescript
export function ProgressBar({
  steps,
  currentStepIndex,
  currentDetailStepIndex,
  onClick,
  isLandscape,
  onTouchCommand,  // === 추가 ===
}: {
  steps: RecipeStep[];
  currentStepIndex: number;
  currentDetailStepIndex: number;
  onClick: ({
    stepIndex,
    stepDetailIndex,
  }: {
    stepIndex: number;
    stepDetailIndex: number;
  }) => void;
  isLandscape: boolean;
  onTouchCommand?: (params: {  // === 추가 ===
    commandType: "navigation";
    commandDetail: "STEP";
    currentStep: number;
  }) => void;
}) {
```

#### 4.2.2 Step 컴포넌트로 전달하는 onClick 수정

**위치**: ProgressBar 내부 (약 43-53줄)

```typescript
{Array.from({ length: steps.length }).map((_, stepIndex) => {
  return (
    <Step
      onClick={({ stepDetailIndex }: { stepDetailIndex: number }) => {
        onClick({ stepIndex, stepDetailIndex });
        // === 추가: 터치 명령 트래킹 ===
        onTouchCommand?.({
          commandType: "navigation",
          commandDetail: "STEP",
          currentStep: currentStepIndex,
        });
      }}
      detailCount={steps[stepIndex].details.length}
      key={stepIndex}
    />
  );
})}
```

### 4.3 index.tsx에서 Props 전달

**위치**: `RecipeStepPageReady` 컴포넌트 내 JSX (약 320-340줄)

```typescript
<ProgressBar
  steps={steps}
  currentDetailStepIndex={currentDetailIndex}
  currentStepIndex={currentIndex}
  isLandscape={orientation !== "portrait"}
  onClick={handleChangeStepWithVideoTime}
  // === 추가 ===
  onTouchCommand={({ commandType, commandDetail, currentStep }) => {
    analytics.trackCommand({
      recipeId: id,
      commandType,
      commandDetail,
      triggerMethod: "touch",
      currentStep,
    });
  }}
/>

// ...

<StepsContent
  currentDetailStepIndex={currentDetailIndex}
  currentStepIndex={currentIndex}
  onChangeStep={handleChangeStepWithVideoTime}
  steps={steps}
  isLandscape={orientation !== "portrait"}
  recipeId={id}
  // === 추가 ===
  onTouchCommand={({ commandType, commandDetail, currentStep }) => {
    analytics.trackCommand({
      recipeId: id,
      commandType,
      commandDetail,
      triggerMethod: "touch",
      currentStep,
    });
  }}
/>
```

---

## Phase 5: 엣지 케이스 처리

### 5.1 useEffect cleanup에서의 상태 접근

**문제**: `useEffect` cleanup에서 `currentIndex`가 마지막 값을 참조하지 못할 수 있음

**해결**: Phase 3.2.3에서 `currentIndexRef`로 이미 처리됨

### 5.2 steps.length가 0인 경우

**문제**: 레시피 데이터 로딩 전에 이벤트 발송 시 잘못된 값 전송

**해결**: `RecipeStepPageReady`는 이미 데이터 로딩 완료 후 렌더링되므로 문제없음 (Suspense 패턴)

### 5.3 중복 이벤트 방지

**문제**: StrictMode에서 useEffect가 두 번 실행될 수 있음

**해결**: Phase 3.2.3에서 `hasTrackedStartRef`로 이미 처리됨

---

## 구현 순서 체크리스트

### Phase 1: 사전 준비
- [ ] `amplitudeEvents.ts`에 이벤트 상수 3개 추가

### Phase 2: Analytics 훅 생성
- [ ] `useCookingModeAnalytics.ts` 파일 생성
- [ ] 타입 정의 작성
- [ ] 훅 구현 코드 작성
- [ ] 내보내기 (export) 확인

### Phase 3: 메인 페이지 연동
- [ ] `index.tsx`에 import 추가
- [ ] `useCookingModeAnalytics` 훅 초기화
- [ ] `currentIndexRef`, `hasTrackedStartRef`, `prevStepRef` 추가
- [ ] `cooking_mode_start/end` useEffect 추가
- [ ] 단계 방문 기록 useEffect 추가
- [ ] `onIntent` 내 각 명령에 `trackCommand` 추가 (7개 위치, EXTRA 제외)

### Phase 4: 터치 이벤트 연동
- [ ] `stepsContent.tsx` Props 확장 및 `handleStepChange` 래핑 함수 추가
- [ ] `progressBar.tsx` Props 확장 및 onClick 수정
- [ ] `index.tsx`에서 `onTouchCommand` props 전달

### Phase 5: 테스트
- [ ] 요리 모드 진입 시 `cooking_mode_start` 이벤트 확인
- [ ] 음성 명령 시 `cooking_mode_command` (trigger_method: voice) 확인
- [ ] 터치 명령 시 `cooking_mode_command` (trigger_method: touch) 확인
- [ ] 요리 모드 종료 시 `cooking_mode_end` 이벤트 확인
- [ ] `command_breakdown` 집계 정확성 확인
- [ ] `visited_steps_*` 집계 정확성 확인

---

## 파일 수정 요약

| 파일 | 수정 내용 | 추가 줄 수 (예상) |
|------|----------|-----------------|
| `amplitudeEvents.ts` | 이벤트 상수 3개 추가 | ~15줄 |
| `useCookingModeAnalytics.ts` | 새 파일 생성 | ~130줄 |
| `index.tsx` | 훅 연동, 음성 트래킹 | ~70줄 |
| `stepsContent.tsx` | Props 확장, handleStepChange 래핑 | ~20줄 |
| `progressBar.tsx` | Props 확장, onClick 수정 | ~15줄 |

**총 예상 추가 코드**: ~250줄

---

## 관련 파일 경로

```
webview-v2/src/
├── shared/analytics/
│   ├── amplitude.ts              # track 함수 (수정 없음)
│   └── amplitudeEvents.ts        # 이벤트 상수 추가
└── views/recipe-step/
    ├── hooks/
    │   ├── useCookingModeAnalytics.ts  # 새 파일
    │   ├── useRecipeStepController.ts  # 수정 없음
    │   └── useTutorial.ts              # 수정 없음
    └── ui/
        ├── index.tsx             # 메인 연동
        ├── stepsContent.tsx      # 터치 이벤트
        └── progressBar.tsx       # 터치 이벤트
```
