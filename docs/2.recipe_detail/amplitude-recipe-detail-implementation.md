# 레시피 상세 페이지 Amplitude 이벤트 구현 가이드

## 📋 목차

1. [개요](#개요)
2. [이벤트 목록](#이벤트-목록)
3. [이벤트별 상세 정의](#이벤트별-상세-정의)
4. [구현 방법](#구현-방법)
5. [분석 가능 지표](#분석-가능-지표)
6. [활용 시나리오](#활용-시나리오)

---

## 개요

### 목적

레시피 상세 페이지에서 사용자가 어떻게 레시피를 탐색하고, 영상을 시청하며, 요리를 시작하는지 추적합니다.

### 핵심 측정 목표

1. **페이지 참여도**: 사용자가 얼마나 적극적으로 레시피를 탐색하는가?
2. **영상 vs 텍스트**: 영상을 선호하는가, 텍스트 레시피를 선호하는가?
3. **최종 전환**: 레시피 조회 → 요리 시작까지 전환율

### 이벤트 설계 원칙

- ✅ **핵심 행동만 추적**: 불필요한 세부사항 제거
- ✅ **구현 가능성 우선**: YouTube API 제약사항을 고려한 현실적 추적
- ✅ **신뢰할 수 있는 데이터**: 부정확한 데이터보다 정확한 핵심 지표에 집중

---

## 이벤트 목록

총 **6개 이벤트**로 레시피 상세 페이지 사용자 여정을 추적합니다.

| 순번 | 이벤트 이름 | 설명 | 우선순위 |
|------|------------|------|---------|
| 1 | `recipe_detail_view` | 페이지 진입 | 🔴 High |
| 2 | `recipe_detail_exit` | 페이지 이탈 | 🔴 High |
| 3 | `recipe_detail_tab_click` | 탭 클릭 | 🔴 High |
| 4 | `recipe_detail_video_seek` | 스텝으로 영상 이동 | 🟡 Medium |
| 5 | `recipe_detail_feature_click` | 부가 기능 클릭 | 🟢 Low |
| 6 | `recipe_detail_cooking_start` | 요리 시작 | 🔴 High |

---

## 이벤트별 상세 정의

### 1️⃣ `recipe_detail_view` - 페이지 진입

**발생 시점**: 페이지 컴포넌트 마운트 시 (useEffect)

**속성**:
```typescript
{
  recipe_id: string;              // 레시피 ID
  recipe_title: string;           // 레시피 제목
  is_first_view: boolean;         // 첫 진입 여부 (1시간 내 재진입 시 false)
  total_steps: number;            // 전체 스텝 수
  total_ingredients: number;      // 전체 재료 수
  has_video: boolean;             // 영상 존재 여부
}
```

**측정 목적**:
- 레시피별 조회 수
- 순수 신규 조회 vs 재진입(요리모드 뒤로가기 등) 구분
- 레시피 규모별 인기도

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**`is_first_view` 속성 설명**:

앱 웹뷰 환경에서 요리모드 → 뒤로가기 시 컴포넌트가 리마운트되어 view 이벤트가 중복 발생합니다.
이를 구분하기 위해 sessionStorage에 마지막 조회 시간을 저장하고, 1시간 이내 재진입 시 `false`로 표시합니다.

| 상황 | is_first_view | 설명 |
|------|---------------|------|
| 홈/검색에서 첫 진입 | `true` | 신규 조회 |
| 요리모드 → 뒤로가기 (30분) | `false` | 1시간 이내 재진입 |
| 요리모드 → 뒤로가기 (2시간) | `true` | 1시간 초과로 신규 취급 |
| 다른 레시피 진입 | `true` | 레시피별로 별도 관리 |

**분석 시 활용**:

- 순수 페이지뷰 = `is_first_view: true` 필터링
- 전체 페이지뷰 (재진입 포함) = 필터 없이 집계

---

### 2️⃣ `recipe_detail_exit` - 페이지 이탈

**발생 시점**: 페이지 언마운트 시 (useEffect cleanup)

**속성**:
```typescript
{
  recipe_id: string;
  stay_duration: number;          // 페이지 체류 시간 (초)
  tab_switch_count: number;       // 탭 전환 횟수
  final_tab: string;              // 마지막 본 탭 ("summary" | "recipe" | "ingredients")
  reached_cooking_start: boolean; // 요리 시작까지 도달했는지
}
```

**측정 목적**:
- 페이지 체류 시간 분석
- 탭 전환 빈도 측정
- 이탈 지점 분석 (어느 탭에서 이탈하는지)
- 요리 시작 전환율 계산

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**중요 사항**:
- ⚠️ **영상 시청 데이터 제외**: YouTube IFrame Player API의 한계로 인해 사용자의 직접 조작과 프로그래밍적 조작을 구분할 수 없어 정확한 측정 불가능
- ✅ **영상 탐색은 별도 추적**: `recipe_detail_video_seek` 이벤트로 사용자의 능동적 스텝 탐색 추적

---

### 3️⃣ `recipe_detail_tab_click` - 탭 클릭

**발생 시점**: 요약/레시피/재료 탭 클릭 시

**속성**:
```typescript
{
  recipe_id: string;
  tab_name: "summary" | "recipe" | "ingredients";
  time_since_view: number;        // 페이지 진입 후 경과 시간 (초)
}
```

**측정 목적**:
- 탭별 클릭률 (어떤 정보를 선호하는지)
- 탭 전환 패턴 분석

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx` (RecipeBottomSheet 컴포넌트)

**주의사항**:
- 페이지 진입 시 기본 표시되는 "요약" 탭은 이벤트 발생하지 않음 (클릭만 추적)

---

### 4️⃣ `recipe_detail_video_seek` - 스텝으로 영상 이동

**발생 시점**: 레시피 탭에서 스텝 세부 항목 클릭 시

**속성**:
```typescript
{
  recipe_id: string;
  step_order: number;             // 클릭한 스텝 순서 (0부터)
  step_title: string;             // 스텝 제목
  video_time: number;             // 이동한 영상 시간 (초)
}
```

**측정 목적**:
- 스텝-영상 연동 기능 활용도
- 많이 참조되는 스텝 구간

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx` (RecipeBottomSheet - 스텝 detail 클릭)

---

### 5️⃣ `recipe_detail_feature_click` - 부가 기능 클릭

**발생 시점**: 타이머 또는 계량법 버튼 클릭 시

**속성**:
```typescript
{
  recipe_id: string;
  feature_type: "timer" | "measurement";
  current_tab: "summary" | "recipe" | "ingredients";
}
```

**측정 목적**:
- 부가 기능 사용률
- 타이머 vs 계량법 선호도

**구현 위치**:
- 타이머: `webview-v2/src/views/recipe-detail/ui/timerButton.tsx`
- 계량법: `webview-v2/src/views/recipe-detail/ui/index.tsx` (RecipeBottomSheet - 계량법 버튼)

---

### 6️⃣ `recipe_detail_cooking_start` - 요리 시작

**발생 시점**: "요리 시작" 버튼 클릭 시 (`/recipe/{id}/step` 페이지로 이동)

**속성**:
```typescript
{
  recipe_id: string;
  time_to_start: number;          // 페이지 진입부터 요리 시작까지 시간 (초)
  tab_switch_count: number;       // 탭 전환 횟수
  ingredient_prepared_count: number; // 준비 완료한 재료 개수
}
```

**측정 목적**:
- **최종 전환율** (가장 중요)
- 요리 시작까지 걸리는 시간
- 재료 준비 정도와 전환율의 상관관계

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx` (RecipeBottomSheet - "요리 시작" 버튼)

---

## 구현 방법

### 컴포넌트 구조 및 데이터 흐름

현재 레시피 상세 페이지는 다음과 같은 구조입니다:

```
RecipeDetailPageReady (부모)
├── Header
│   └── TimerButton (타이머 버튼)
├── StickyVideo (영상 플레이어)
└── RecipeBottomSheet (자식)
    ├── 탭 버튼 (요약/레시피/재료)
    ├── 스텝 목록 (레시피 탭)
    ├── 계량법 버튼 (재료 탭)
    └── 요리 시작 버튼
```

**핵심 이슈**: Amplitude 추적에 필요한 state/ref는 `RecipeDetailPageReady`에 있어야 하지만,
실제 사용자 인터랙션은 `RecipeBottomSheet`에서 발생합니다. 이를 해결하기 위해 **콜백 props 패턴**을 사용합니다.

---

### RecipeBottomSheet Props 인터페이스 확장

기존 props에 Amplitude 추적용 콜백을 추가합니다:

```typescript
// RecipeBottomSheet props 타입
type RecipeBottomSheetProps = {
  // 기존 props
  steps: RecipeStep[];
  ingredients: Ingredient[];
  onTimeClick: (time: number) => void;
  handleRouteToStep: () => void;
  recipe_summary: RecipeMeta;
  tags?: RecipeTag[];
  briefings?: RecipeBriefing[];
  collapsedTopPx: number;
  expandedTopPx: number;

  // 🆕 Amplitude 추적용 콜백 props
  onTabClick?: (tabName: "summary" | "recipe" | "ingredients") => void;
  onStepClick?: (stepOrder: number, stepTitle: string, videoTime: number) => void;
  onMeasurementClick?: () => void;
  onCookingStart?: (selectedIngredientCount: number) => void;
};
```

---

### 페이지 레벨 State 관리 (RecipeDetailPageReady)

```typescript
// webview-v2/src/views/recipe-detail/ui/index.tsx

export const RecipeDetailPageReady = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);
  const router = useRouter();

  // 기존 데이터 추출
  const videoInfo = data?.videoInfo ?? {};
  const ingredients = data?.ingredients ?? [];
  const steps = data?.steps ?? [];

  // 🆕 Amplitude 추적용 refs
  const pageStartTime = useRef(Date.now());
  const tabSwitchCount = useRef(0);
  const currentTab = useRef<"summary" | "recipe" | "ingredients">("summary");
  const reachedCookingStart = useRef(false);

  // YouTube 플레이어 ref (기존)
  const playerRef = useRef<YT.Player | null>(null);

  // ... 기존 코드 ...
};
```

---

### 1. View 이벤트 (페이지 진입)

**구현 위치**: `RecipeDetailPageReady` 컴포넌트 내부

```typescript
useEffect(() => {
  // is_first_view 판단 로직 (1시간 기준)
  const key = `recipe_${id}_last_view`;
  const lastView = sessionStorage.getItem(key);

  let isFirstView = true;

  if (lastView) {
    const elapsed = Date.now() - Number(lastView);
    const ONE_HOUR = 60 * 60 * 1000;
    isFirstView = elapsed > ONE_HOUR;
  }

  // timestamp 갱신
  sessionStorage.setItem(key, Date.now().toString());

  // 페이지 진입 이벤트
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
    recipe_id: id,
    recipe_title: videoInfo?.videoTitle || "",
    is_first_view: isFirstView,
    total_steps: steps.length,
    total_ingredients: ingredients.length,
    has_video: !!videoInfo?.id,
  });
}, []);
```

**참고**: `video_duration` 속성은 현재 데이터에 해당 필드가 없으므로 제외합니다.

---

### 2. Exit 이벤트 (페이지 이탈)

**구현 위치**: `RecipeDetailPageReady` 컴포넌트 내부

```typescript
useEffect(() => {
  return () => {
    // 페이지 이탈 시 exit 이벤트
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_EXIT, {
      recipe_id: id,
      stay_duration: Math.round((Date.now() - pageStartTime.current) / 1000),
      tab_switch_count: tabSwitchCount.current,
      final_tab: currentTab.current,
      reached_cooking_start: reachedCookingStart.current,
    });
  };
}, []);
```

---

### 3. Tab Click 이벤트

**구현 위치**: 핸들러는 `RecipeDetailPageReady`에서 정의, `RecipeBottomSheet`에 콜백으로 전달

**부모 컴포넌트 (RecipeDetailPageReady)**:
```typescript
const handleTabClick = (tabName: "summary" | "recipe" | "ingredients") => {
  // 다른 탭으로 전환할 때만 카운트
  if (currentTab.current !== tabName) {
    tabSwitchCount.current++;
  }
  currentTab.current = tabName;

  track(AMPLITUDE_EVENT.RECIPE_DETAIL_TAB_CLICK, {
    recipe_id: id,
    tab_name: tabName,
    time_since_view: Math.round((Date.now() - pageStartTime.current) / 1000),
  });
};

// RecipeBottomSheet에 전달
<RecipeBottomSheet
  // ... 기존 props
  onTabClick={handleTabClick}
/>
```

**자식 컴포넌트 (RecipeBottomSheet)**:
```typescript
// 탭 버튼 onClick 수정
<button
  onClick={() => {
    setActiveTab(tab);
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    if (tab === "recipe") {
      setExpanded(new Set(steps.map((_, idx) => idx)));
    }
    // 🆕 Amplitude 추적 콜백 호출
    onTabClick?.(tab);
  }}
>
  {messages.tabs[tab]}
</button>
```

---

### 4. Video Seek 이벤트 (스텝 클릭)

**구현 위치**: 핸들러는 `RecipeDetailPageReady`에서 정의, `RecipeBottomSheet`에 콜백으로 전달

**부모 컴포넌트 (RecipeDetailPageReady)**:
```typescript
const handleStepClick = (stepOrder: number, stepTitle: string, videoTime: number) => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
    recipe_id: id,
    step_order: stepOrder,
    step_title: stepTitle,
    video_time: videoTime,
  });
};

// 기존 handleTimeClick과 함께 전달
<RecipeBottomSheet
  // ... 기존 props
  onTimeClick={handleTimeClick}
  onStepClick={handleStepClick}
/>
```

**자식 컴포넌트 (RecipeBottomSheet)**:
```typescript
// 스텝 detail 버튼 onClick 수정
{step.details.map((d, di) => (
  <button
    key={di}
    onClick={() => {
      onTimeClick(d.start);
      setTopPx(minCollapseTop);
      // 🆕 Amplitude 추적 콜백 호출
      onStepClick?.(idx, step.subtitle, d.start);
    }}
  >
    {/* ... */}
  </button>
))}
```

**참고**: `step_order`는 스텝의 인덱스(idx)를 사용합니다 (0부터 시작).

---

### 5. Feature Click 이벤트

#### 5-1. 타이머 버튼

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/timerButton.tsx`

> **⚠️ 중요**: 상세페이지의 `TimerButton`은 `recipe-detail/ui/timerButton.tsx`에 있고,
> 요리모드의 `TimerButton`은 `features/timer/ui/timerButton.tsx`에 있습니다.
> **서로 다른 컴포넌트**이므로 상세페이지 전용 컴포넌트만 수정하면 됩니다.

**현재 구조 분석**:

```text
TimerButton (recipe-detail/ui/timerButton.tsx)
└── TimerBottomSheet (widgets/timer/timerBottomSheet.tsx)
    └── <div onClick={handleOpenTemporarily}>  ← 실제 클릭 처리
        └── {trigger} = TimerButtonDefault
```

`TimerBottomSheet` 내부에서 trigger를 감싸는 div가 클릭을 처리합니다.
따라서 `TimerButton`에서 wrapper div로 클릭을 캡처해야 합니다.

```typescript
// webview-v2/src/views/recipe-detail/ui/timerButton.tsx

export const TimerButton = ({
  recipeId,
  recipeName,
  onTimerClick,  // 🆕 추가
}: {
  recipeId: string;
  recipeName: string;
  onTimerClick?: () => void;  // 🆕 추가
}) => {
  const timers = useTimers(recipeId, recipeName);
  const timerActveCount = Array.from(
    timers.entries().filter(([_, timer]) => timer.state === TimerState.ACTIVE)
  ).length;

  return (
    // 🆕 wrapper div로 클릭 캡처 (이벤트 버블링 활용)
    <div onClick={() => onTimerClick?.()}>
      <TimerBottomSheet
        trigger={
          <TimerButtonDefault waitingCount={timerActveCount} />
        }
        recipeId={recipeId}
        recipeName={recipeName}
      />
    </div>
  );
};

// TimerButtonDefault는 수정 불필요 (기존 유지)
const TimerButtonDefault = ({
  waitingCount = 0,
}: {
  waitingCount?: number;
}) => {
  return (
    <HeaderIconButtonTemplate
      icon={/* ... */}
      onClick={() => {}}  // 기존 유지 (실제 클릭은 TimerBottomSheet에서 처리)
    />
  );
};
```

**부모 컴포넌트 (RecipeDetailPageReady)**:

```typescript
const handleTimerClick = () => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
    recipe_id: id,
    feature_type: "timer",
    current_tab: currentTab.current,
  });
};

// Header에서 TimerButton에 전달
<TimerButton
  recipeId={id}
  recipeName={videoInfo?.videoTitle}
  onTimerClick={handleTimerClick}  // 🆕 추가
/>
```

**동작 원리**:

1. 사용자가 타이머 아이콘 클릭
2. 이벤트 버블링으로 wrapper div의 `onClick` 실행 → `onTimerClick()` → Amplitude 이벤트 발생
3. 이벤트가 계속 전파되어 `TimerBottomSheet` 내부 div의 `onClick`도 실행 → 바텀시트 열림

**중복 방지**:

| 상황 | 이벤트 발생 |
|------|------------|
| 상세페이지 타이머 버튼 클릭 | ✅ 1회만 발생 |
| 요리모드 타이머 | ❌ 다른 컴포넌트 사용 (영향 없음) |
| 바텀시트 내부 조작 | ❌ wrapper 클릭이 아니므로 발생 안 함 |

#### 5-2. 계량법 버튼

**구현 위치**: 핸들러는 `RecipeDetailPageReady`에서 정의, `RecipeBottomSheet`에 콜백으로 전달

**부모 컴포넌트 (RecipeDetailPageReady)**:
```typescript
const handleMeasurementClick = () => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
    recipe_id: id,
    feature_type: "measurement",
    current_tab: currentTab.current,
  });
};

<RecipeBottomSheet
  // ... 기존 props
  onMeasurementClick={handleMeasurementClick}
/>
```

**자식 컴포넌트 (RecipeBottomSheet)**:
```typescript
// 계량법 버튼 onClick 수정
<button
  onClick={() => {
    setMeasurementOpen(true);
    // 🆕 Amplitude 추적 콜백 호출
    onMeasurementClick?.();
  }}
>
  <span>{messages.ingredients.measure}</span>
</button>
```

---

### 6. Cooking Start 이벤트

**구현 위치**: 핸들러는 `RecipeDetailPageReady`에서 정의, `RecipeBottomSheet`에 콜백으로 전달

**부모 컴포넌트 (RecipeDetailPageReady)**:
```typescript
const handleCookingStart = (selectedIngredientCount: number) => {
  reachedCookingStart.current = true;

  track(AMPLITUDE_EVENT.RECIPE_DETAIL_COOKING_START, {
    recipe_id: id,
    time_to_start: Math.round((Date.now() - pageStartTime.current) / 1000),
    tab_switch_count: tabSwitchCount.current,
    ingredient_prepared_count: selectedIngredientCount,
  });

  router.push(`/recipe/${id}/step`);
};

// 기존 handleRouteToStep 대신 사용
<RecipeBottomSheet
  // ... 기존 props
  // handleRouteToStep={() => router.push(`/recipe/${id}/step`)}  // 제거
  onCookingStart={handleCookingStart}  // 🆕 추가
/>
```

**자식 컴포넌트 (RecipeBottomSheet)**:
```typescript
// "요리 시작" 버튼 onClick 수정
<button
  onClick={() => {
    // 🆕 selected.size를 포함하여 콜백 호출
    onCookingStart?.(selected.size);
  }}
>
  {messages.ingredients.start}
</button>
```

**참고**: `handleRouteToStep` prop은 `onCookingStart`로 대체됩니다.
`onCookingStart` 핸들러 내부에서 `router.push()`를 호출합니다.

---

## 분석 가능 지표

### 1. 기본 지표

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **페이지 조회 수** | `recipe_detail_view` 카운트 | 레시피별 인기도 |
| **평균 체류 시간** | `recipe_detail_exit.stay_duration` 평균 | 콘텐츠 품질 |
| **요리 시작 전환율** | (cooking_start / view) × 100 | 최종 목표 달성률 |
| **즉시 이탈률** | (exit.stay_duration < 10초) / view × 100 | 초기 이탈 |

### 2. 탭 참여도

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **탭 전환율** | (tab_click 발생 / view) × 100 | 사용자 참여도 |
| **평균 탭 전환 수** | `exit.tab_switch_count` 평균 | 적극적 탐색 정도 |
| **탭별 클릭률** | 각 탭의 `tab_click` 발생 비율 | 정보 선호도 |
| **이탈 탭 분포** | `exit.final_tab` 분포 | 어느 탭에서 이탈하는지 |

### 3. 영상 탐색 지표

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **스텝 탐색 사용률** | (video_seek 발생) / view × 100 | 스텝-영상 연동 기능 활용도 |
| **평균 스텝 탐색 횟수** | 사용자당 `video_seek` 발생 평균 | 영상 활용 적극성 |
| **많이 탐색된 스텝** | `video_seek.step_order` 분포 | 사용자 관심 구간 |

### 4. 재료 준비와 전환율

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **재료 준비율** | `cooking_start.ingredient_prepared_count` / 전체 재료 수 | 준비 완료 정도 |
| **준비율별 전환율** | 준비율 구간별 요리 시작률 | 준비 정도와 전환율 상관관계 |

### 5. 전환 퍼널

```
100% - 페이지 진입 (view)
  ↓
 65% - 탭 클릭 (tab_click)
  ↓
 30% - 요리 시작 (cooking_start)
```

> **참고**: 영상 재생 단계는 YouTube API 제약으로 정확한 측정이 불가하여 퍼널에서 제외되었습니다.
> 대신 `recipe_detail_video_seek` 이벤트로 스텝-영상 연동 기능 활용도를 측정합니다.

---

## 활용 시나리오

### 시나리오 1: 스텝-영상 연동 효과

**질문**: 스텝 클릭으로 영상 이동하는 기능이 유용한가?

**분석**:
```
기능 사용률: 18%
기능 사용자 요리 시작률: 42%
기능 미사용자 요리 시작률: 28%
```

**인사이트**:
- 기능 사용자가 전환율 14%p 높음
- 하지만 사용률 18%로 낮음
- **개선 방향**: 기능 발견성(Discoverability) 개선 필요

---

### 시나리오 2: 탐색 패턴별 전환율

**질문**: 어떤 탐색 패턴이 요리 시작률이 높은가?

**분석**:
```
탭 전환 0회 (기본 탭만 봄)
- 비율: 45%
- 요리 시작률: 15%

탭 전환 1-2회 (일부 탐색)
- 비율: 35%
- 요리 시작률: 32%

탭 전환 3회 이상 (적극적 탐색)
- 비율: 20%
- 요리 시작률: 48%
```

**인사이트**:
- 적극적으로 탐색한 사용자가 전환율 가장 높음 (48%)
- 기본 탭만 본 사용자는 전환율 매우 낮음 (15%)
- **개선 방향**: 탭 전환 유도 UX 개선, 온보딩 추가

---

## 구현 체크리스트

### Phase 1: 기본 추적 (High Priority)
- [ ] `recipe_detail_view` - 페이지 진입
- [ ] `recipe_detail_exit` - 페이지 이탈
- [ ] `recipe_detail_cooking_start` - 요리 시작

### Phase 2: 참여도 추적 (High Priority)
- [ ] `recipe_detail_tab_click` - 탭 클릭
- [ ] 탭 전환 카운트 로직 구현

### Phase 3: 영상 탐색 (Medium Priority)
- [ ] `recipe_detail_video_seek` - 스텝으로 영상 이동

### Phase 4: 부가 기능 (Low Priority)
- [ ] `recipe_detail_feature_click` - 타이머/계량법 클릭

### 검증
- [ ] 모든 이벤트가 올바른 시점에 발생하는지 확인
- [ ] 속성 값이 정확히 전달되는지 확인
- [ ] Exit 이벤트가 페이지 이탈 시 정확히 발생하는지 확인
- [ ] 탭 전환 카운트가 정확히 계산되는지 확인

---

## 주의사항

### 1. 영상 데이터 추적 제외 이유

⚠️ **YouTube IFrame Player API의 근본적 한계**:
- YouTube Player의 `onStateChange` 이벤트는 상태 변화만 알려주며, **누가 상태를 변경했는지 구분 불가능**
- 사용자의 직접 클릭과 프로그래밍적 API 호출(`player.playVideo()`, `player.seekTo()`)을 구분할 수 없음
- 현재 구현에서 스텝 클릭 시 자동으로 `seekTo()` + `playVideo()`를 호출하므로 정확한 측정 불가능
- **부정확한 데이터는 잘못된 분석으로 이어지므로 완전 제외**

### 2. Video Seek 이벤트의 의미

- `recipe_detail_video_seek`: 사용자가 **능동적으로** 스텝을 클릭하여 영상을 탐색
- 이 이벤트만으로도 충분한 인사이트:
  - 스텝-영상 연동 기능 활용도
  - 많이 참조되는 스텝 구간
  - 영상 탐색 사용자 vs 텍스트만 사용자 구분

### 3. Exit 이벤트 발송 시점

- 페이지 언마운트 시 `useEffect cleanup`에서 발송
- 이 시점에 모든 집계 데이터 (탭 전환, 최종 탭, 체류 시간) 포함

### 4. 탭 전환 카운트

- 탭 전환은 **다른 탭으로 이동할 때만** 카운트
- 같은 탭을 여러 번 클릭해도 카운트하지 않음
- `currentTab.current !== tabName` 체크로 구현

---

## 다음 단계

1. [ ] 이벤트 상수 추가 (`amplitudeEvents.ts`)
2. [ ] 페이지 레벨 state 구현
3. [ ] 각 이벤트별 추적 로직 구현
4. [ ] 테스트 및 검증
5. [ ] Amplitude 대시보드에서 이벤트 확인
6. [ ] 초기 데이터 수집 후 지표 분석
