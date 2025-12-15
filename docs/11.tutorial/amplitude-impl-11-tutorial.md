# 온보딩/튜토리얼 이벤트 구현 계획

> 구현 단위 1의 일부 (11. 온보딩/튜토리얼 8개 이벤트)

---

## 개요

### 두 가지 튜토리얼 흐름

| 튜토리얼 | 위치 | 트리거 | 노출 조건 | store 파일 |
|---------|------|--------|----------|-----------|
| **공유 튜토리얼** | 홈 → 플로팅 버튼 클릭 | 레시피 생성 시작 시 | `hasSeenTutorial: false`일 때 (다시 보지 않기 전까지 반복) | `recipeCreatingViewOpenStore.ts` |
| **핸즈프리 튜토리얼** | 조리 화면 진입 시 | 첫 조리 시작 시 | `hasSeenTutorial: true`일 때 (한 번만) | `tutorialStarter.tsx` (내부 store) |

> ⚠️ **주의**: 두 튜토리얼의 `hasSeenTutorial` 변수 의미가 **반대**입니다.
>
> | store | `true` 의미 | `false` 의미 |
> |-------|------------|-------------|
> | `recipeCreatingViewOpenStore` | 본 상태 (숨김) | 안 본 상태 (표시) |
> | `tutorialStarter` 내부 store | 안 본 상태 (표시) | 본 상태 (숨김) |

---

## 이벤트 상세

### 1. 공유 튜토리얼 (4개)

#### `tutorial_share_view`
| 항목 | 내용 |
|-----|------|
| **설명** | 공유 튜토리얼 모달 표시 |
| **트리거** | `ShareTutorialModal` 컴포넌트가 열릴 때 (`isTutorialOpen: true`) |
| **속성** | 없음 |
| **파일** | `shareTutorialModal.tsx` |

#### `tutorial_share_youtube_click`
| 항목 | 내용 |
|-----|------|
| **설명** | "생성하러 가기" 버튼 클릭 |
| **트리거** | `handleOpenYouTube()` 호출 시 |
| **속성** | 없음 |
| **파일** | `shareTutorialModal.tsx:65-68` |

#### `tutorial_share_direct_click`
| 항목 | 내용 |
|-----|------|
| **설명** | "직접 입력하기" 버튼 클릭 |
| **트리거** | `handleDirectInput()` 호출 시 |
| **속성** | 없음 |
| **파일** | `shareTutorialModal.tsx:70-75` |

#### `tutorial_share_dismiss`
| 항목 | 내용 |
|-----|------|
| **설명** | "다시 보지 않기" 클릭 |
| **트리거** | `handleDontShowAgain()` 호출 시 |
| **속성** | 없음 |
| **파일** | `shareTutorialModal.tsx:77-83` |

---

### 2. 핸즈프리 튜토리얼 (4개)

#### `tutorial_handsfree_view`
| 항목 | 내용 |
|-----|------|
| **설명** | 핸즈프리 시작 모달 표시 ("음성으로 요리해볼까요?") |
| **트리거** | `TutorialStarter` 컴포넌트 렌더 시 (`hasSeenTutorial: true`) |
| **속성** | `recipe_id` |
| **파일** | `tutorialStarter.tsx:12-52` |

#### `tutorial_handsfree_skip`
| 항목 | 내용 |
|-----|------|
| **설명** | 핸즈프리 튜토리얼 건너뛰기 ("괜찮아요" 클릭) |
| **트리거** | `checkSeen()` 호출 시 (start 없이) |
| **속성** | `recipe_id` |
| **파일** | `tutorialStarter.tsx:30-34` |
| **추가 이유** | Amplitude에서 퍼널/코호트 분석 시 계산 없이 바로 사용 가능 |

#### `tutorial_handsfree_step_start`

| 항목 | 내용 |
|-----|------|
| **설명** | 핸즈프리 튜토리얼 시작 ("볼게요" 클릭) |
| **트리거** | `start()` 호출 시 |
| **속성** | `recipe_id` |
| **파일** | `tutorialStarter.tsx:37-40`, `useTutorial.ts:63-64` |

#### `tutorial_handsfree_step_end`

| 항목 | 내용 |
|-----|------|
| **설명** | 핸즈프리 튜토리얼 종료 (완료 또는 중도 이탈) |
| **트리거** | `terminate()` 호출 시 (마지막 단계 완료 후 또는 X 버튼 클릭 시) |
| **속성** | `recipe_id`, `completed_steps`, `total_steps`, `is_completed` |
| **파일** | `useTutorial.ts:77-78`, `stepsContent.tsx`, `micButton.tsx`, `timerTutorialStep.tsx` |

**속성 상세:**

| 속성 | 타입 | 설명 |
|-----|-----|------|
| `recipe_id` | string | 레시피 ID |
| `completed_steps` | number | 완료한 단계 수 (0-5) |
| `total_steps` | number | 전체 단계 수 (5) |
| `is_completed` | boolean | 모든 단계를 완료했는지 여부 |

**`completed_steps` 값 해석:**

- `0`: 첫 번째 단계(영상 틀어)에서 X 버튼으로 이탈
- `1`: 두 번째 단계(영상 멈춰) 진입 전 이탈
- `2`: 세 번째 단계(다음 단계) 진입 전 이탈
- `3`: 네 번째 단계(타이머) 진입 전 이탈
- `4`: 다섯 번째 단계(가이드) 진입 전 이탈
- `5`: 모든 단계 완료 (`is_completed: true`)

---

## 분석 가능한 인사이트

### 공유 튜토리얼

| 지표 | 계산 방법 | 의미 |
|-----|----------|------|
| **전환율** | `(youtube_click + direct_click) / view` | 튜토리얼을 보고 레시피 생성으로 이어진 비율 |
| **거부율** | `dismiss / view` | "다시 보지 않기"를 선택한 비율 |
| **유튜브 선호도** | `youtube_click / (youtube_click + direct_click)` | 유튜브 vs 직접입력 선택 비율 |

### 핸즈프리 튜토리얼

| 지표 | 계산 방법 | 의미 |
|-----|----------|------|
| **시작율** | `handsfree_step_start / handsfree_view` | 모달을 보고 튜토리얼을 시작한 비율 |
| **거부율** | `handsfree_skip / handsfree_view` | "괜찮아요"를 선택한 비율 (퍼널에서 바로 확인 가능) |
| **완료율** | `handsfree_step_end (is_completed: true) / handsfree_step_start` | 튜토리얼을 끝까지 완료한 비율 |
| **중도 이탈율** | `handsfree_step_end (is_completed: false) / handsfree_step_start` | 튜토리얼 시작 후 중간에 이탈한 비율 |
| **평균 완료 단계** | `avg(completed_steps) where is_completed: false` | 이탈 시 평균적으로 몇 단계까지 진행했는지 |
| **단계별 이탈 분포** | `completed_steps` 값별 집계 | 어느 단계에서 가장 많이 이탈하는지 |

### 비즈니스 질문 → 답변

| 질문 | 확인 방법 |
|-----|----------|
| 유저들이 레시피 생성 방법을 잘 이해하는가? | 공유 튜토리얼 전환율 |
| 어떤 레시피 생성 경로를 선호하는가? | youtube_click vs direct_click 비율 |
| 음성 기능에 대한 관심도가 높은가? | 핸즈프리 시작율 |
| 음성 기능을 거부하는 유저가 많은가? | 핸즈프리 거부율 (`handsfree_skip` 이벤트로 바로 확인) |
| 음성 튜토리얼이 너무 길거나 어려운가? | 핸즈프리 완료율 (낮으면 개선 필요) |
| 어느 단계에서 가장 많이 이탈하는가? | `completed_steps` 분포 분석 |
| 특정 단계가 문제인가? | 특정 `completed_steps` 값에 이탈이 집중되면 해당 단계 UX 개선 필요 |

---

## 구현 계획

### 파일별 수정 사항

#### 1. `shareTutorialModal.tsx`

```typescript
// 이벤트 발송 위치

// tutorial_share_view - 모달 열릴 때
useEffect(() => {
  if (isTutorialOpen) {
    track('tutorial_share_view');
  }
}, [isTutorialOpen]);

// tutorial_share_youtube_click
const handleOpenYouTube = () => {
  track('tutorial_share_youtube_click');  // 추가
  request(MODE.UNBLOCKING, UNBLOCKING_HANDLER_TYPE.OPEN_YOUTUBE);
  handleClose();
};

// tutorial_share_direct_click
const handleDirectInput = () => {
  track('tutorial_share_direct_click');  // 추가
  handleClose();
  setTimeout(() => {
    openRecipeCreatingView(videoUrl);
  }, 300);
};

// tutorial_share_dismiss
const handleDontShowAgain = () => {
  track('tutorial_share_dismiss');  // 추가
  markTutorialAsSeen();
  handleClose();
  setTimeout(() => {
    openRecipeCreatingView(videoUrl);
  }, 300);
};
```

#### 2. `tutorialStarter.tsx`

```typescript
// tutorial_handsfree_view - 모달 렌더 시
// recipe_id는 현재 조리 중인 레시피에서 가져와야 함

useEffect(() => {
  if (hasSeenTutorial) {
    track('tutorial_handsfree_view', { recipe_id });
  }
}, [hasSeenTutorial, recipe_id]);

// tutorial_handsfree_skip - "괜찮아요" 클릭
<button
  onClick={() => {
    track('tutorial_handsfree_skip', { recipe_id });  // 추가
    checkSeen();
  }}
>
  괜찮아요
</button>

// tutorial_handsfree_step_start - "볼게요" 클릭
<button
  onClick={() => {
    track('tutorial_handsfree_step_start', { recipe_id });  // 추가
    start();
    checkSeen();
  }}
>
  볼게요
</button>
```

#### 3. 튜토리얼 종료 이벤트 (`tutorial_handsfree_step_end`)

**코드 흐름 이해:**

```typescript
// useTutorial.ts의 handleNextStep 로직
handleNextStep: ({ index }) => {
  const { currentStepIndex, steps, terminate } = get();
  if (index !== currentStepIndex) return;

  if (currentStepIndex < steps.length - 1) {
    // 중간 단계: 다음 단계로 이동
    set({ currentStepIndex: currentStepIndex + 1 });
    return;
  }
  // 마지막 단계(index 4): terminate() 호출
  terminate();
},
```

**종료 시점 2가지:**

1. **X 버튼 클릭** → `terminate()` 직접 호출 (중도 이탈)
2. **마지막 단계에서 "다음에 확인할게요" 클릭** → `handleNextStep()` → 내부에서 `terminate()` 호출 (완료)

**구현 코드:**

```typescript
// ============================================
// 1. X 버튼 (중도 이탈) - 3개 파일에서 동일하게 수정
// ============================================
// 파일: stepsContent.tsx:172-176, micButton.tsx:56-60, timerTutorialStep.tsx:33-37

<Popover.Close
  onClick={() => {
    const { currentStepIndex, steps } = useTutorialStore.getState();
    track('tutorial_handsfree_step_end', {
      recipe_id,
      completed_steps: currentStepIndex,  // 현재 단계 (0-4)
      total_steps: steps.length,          // 5
      is_completed: false                 // X 버튼 = 중도 이탈
    });
    terminate();
  }}
>
  <IoMdClose className="text-gray-500" size={18} />
</Popover.Close>

// ============================================
// 2. 마지막 단계 완료 버튼 - micButton.tsx:71-82 (VoiceGuideMicStep)
// ============================================
// "다음에 확인할게요" 버튼은 마지막 단계(GUIDE, index 4)에서만 표시됨
// handleNextStep() 호출 시 내부에서 terminate()가 호출되므로
// 이벤트는 handleNextStep() 호출 전에 발송해야 함

<Popover.Close asChild className="px-3 py-1 bg-gray-200 rounded font-semibold">
  <p
    onClick={() => {
      const { steps } = useTutorialStore.getState();
      track('tutorial_handsfree_step_end', {
        recipe_id,
        completed_steps: steps.length,  // 5 (모두 완료)
        total_steps: steps.length,      // 5
        is_completed: true              // 정상 완료
      });
      handleNextStep({ index: currentStepIndex });  // 내부에서 terminate() 호출됨
    }}
  >
    다음에 확인할게요
  </p>
</Popover.Close>

// ============================================
// 3. 중간 단계 버튼 - stepsContent.tsx:191-202, timerTutorialStep.tsx:52-63
// ============================================
// "클릭해서 넘어갈게요" 버튼은 중간 단계(CONTENT, TIMER)에서 표시됨
// 다음 단계로 이동만 하고 종료되지 않으므로 이벤트 발송 불필요

<Popover.Close asChild className="px-3 py-1 bg-gray-200 rounded font-semibold">
  <p
    onClick={() => {
      handleNextStep({ index: currentStepIndex });  // 다음 단계로 이동
      // tutorial_handsfree_step_end 이벤트 발송하지 않음 (종료 아님)
    }}
  >
    클릭해서 넘어갈게요
  </p>
</Popover.Close>
```

**구현 시 주의사항:**

1. `terminate()` 내부에서 이벤트를 발송하지 않고, 호출하는 컴포넌트에서 발송
2. X 버튼 클릭 시: `is_completed: false`, `completed_steps: currentStepIndex`
3. 마지막 단계 완료 시: `is_completed: true`, `completed_steps: steps.length`
4. **"클릭해서 넘어갈게요" 버튼은 이벤트 발송 불필요** (중간 단계 이동, 종료 아님)
5. **"다음에 확인할게요" 버튼만 완료 이벤트 발송** (마지막 단계에서만 표시됨)

---

## 고려 사항

### 1. `recipe_id` 전달 방법

핸즈프리 튜토리얼 이벤트에 `recipe_id`가 필요한데, 현재 `useTutorial.ts`는 recipe 정보를 모름.

**해결 방안:**

- A) `useTutorial` store에 `recipe_id` 상태 추가
- B) 이벤트 발송을 컴포넌트 레벨에서 처리 (store 외부)
- C) `terminate()` 호출 시 `recipe_id`를 인자로 전달

**추천**: B안 - 컴포넌트에서 이벤트 발송하고, store는 상태 관리만

**구현 예시 (B안):**

```typescript
// recipe-step/ui/index.tsx 또는 상위 컴포넌트에서
// recipe_id를 props로 전달하거나 URL params에서 가져옴

// tutorialStarter.tsx에 props 추가
export function TutorialStarter({ recipeId }: { recipeId: string }) {
  // ...
}

// 또는 URL에서 가져오기
import { useParams } from 'next/navigation';
const { recipeId } = useParams();
```

### 2. 중복 이벤트 방지

`tutorial_share_view`는 모달이 여러 번 열릴 수 있으므로 매번 발송됨 (의도한 동작).

`tutorial_handsfree_view`는 한 번만 뜨므로 중복 걱정 없음.

### 3. 변수명 주의 (혼동 가능)

`tutorialStarter.tsx`의 `hasSeenTutorial` 변수명이 **의미와 반대**:

| 값 | 실제 의미 |
|---|----------|
| `hasSeenTutorial: true` | 아직 튜토리얼을 **안 본** 상태 (모달 표시) |
| `hasSeenTutorial: false` | 튜토리얼을 **본** 상태 (모달 숨김) |

**구현 시 현재 로직대로 따라가면 됨** (변수명만 혼동 주의)

### 4. 튜토리얼 단계별 버튼 구분

| 단계 | 타입 | 버튼 텍스트 | 이벤트 발송 |
|-----|-----|------------|-----------|
| 0-2 | CONTENT | "클릭해서 넘어갈게요" | ❌ 불필요 |
| 3 | TIMER | "클릭해서 넘어갈게요" | ❌ 불필요 |
| 4 | GUIDE | "다음에 확인할게요" | ✅ `tutorial_handsfree_step_end` (is_completed: true) |
| 0-4 | 모든 단계 | X 버튼 | ✅ `tutorial_handsfree_step_end` (is_completed: false) |

---

## 체크리스트

- [ ] `shareTutorialModal.tsx`에 4개 이벤트 추가
- [ ] `tutorialStarter.tsx`에 3개 이벤트 추가 (`handsfree_view`, `handsfree_skip`, `handsfree_step_start`)
- [ ] `stepsContent.tsx`, `micButton.tsx`, `timerTutorialStep.tsx`에 `tutorial_handsfree_step_end` 이벤트 추가
  - [ ] X 버튼에 `is_completed: false`로 이벤트 발송
  - [ ] 마지막 단계 완료 버튼에 `is_completed: true`로 이벤트 발송
- [ ] `recipe_id` 전달 방법 결정 및 구현
- [ ] 테스트: 각 이벤트가 올바른 시점에 발송되는지 확인
- [ ] 테스트: 중도 이탈 시 `completed_steps` 값이 정확한지 확인
