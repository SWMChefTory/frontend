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
- ✅ **구현 단순성**: Exit 이벤트에 영상 데이터 집계로 복잡도 최소화
- ✅ **의미 있는 지표**: 재생/일시정지 횟수보다 실제 시청 시간에 집중

---

## 이벤트 목록

총 **7개 이벤트**로 레시피 상세 페이지 사용자 여정을 추적합니다.

| 순번 | 이벤트 이름 | 설명 | 우선순위 |
|------|------------|------|---------|
| 1 | `recipe_detail_view` | 페이지 진입 | 🔴 High |
| 2 | `recipe_detail_exit` | 페이지 이탈 (영상 데이터 포함) | 🔴 High |
| 3 | `recipe_detail_tab_click` | 탭 클릭 | 🔴 High |
| 4 | `recipe_detail_video_first_interact` | 영상 최초 조작 | 🟡 Medium |
| 5 | `recipe_detail_video_seek` | 스텝으로 영상 이동 | 🟡 Medium |
| 6 | `recipe_detail_feature_click` | 부가 기능 클릭 | 🟢 Low |
| 7 | `recipe_detail_cooking_start` | 요리 시작 | 🔴 High |

---

## 이벤트별 상세 정의

### 1️⃣ `recipe_detail_view` - 페이지 진입

**발생 시점**: 페이지 컴포넌트 마운트 시 (useEffect)

**속성**:
```typescript
{
  recipe_id: string;              // 레시피 ID
  recipe_title: string;           // 레시피 제목
  entry_source?: string;          // 진입 경로 (referrer URL)
  total_steps: number;            // 전체 스텝 수
  total_ingredients: number;      // 전체 재료 수
  has_video: boolean;             // 영상 존재 여부
  video_duration?: number;        // 영상 길이 (초)
}
```

**측정 목적**:
- 레시피별 조회 수
- 진입 경로 분석 (홈/검색/카테고리)
- 레시피 규모별 인기도

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

---

### 2️⃣ `recipe_detail_exit` - 페이지 이탈 ⭐

**발생 시점**: 페이지 언마운트 시 (useEffect cleanup)

**속성**:
```typescript
{
  recipe_id: string;
  view_duration: number;          // 페이지 체류 시간 (초)
  tabs_visited: string[];         // 방문한 탭 목록 ["summary", "recipe"]
  tab_click_count: number;        // 총 탭 클릭 횟수

  // ⭐ 영상 관련
  video_played: boolean;          // 영상을 1회 이상 재생했는지
  video_watch_time: number;       // 실제 시청한 시간 (초)

  // 기타
  reached_cooking_start: boolean; // 요리 시작까지 도달했는지
}
```

**측정 목적**:
- 페이지 체류 시간 분석
- 영상 vs 텍스트 레시피 선호도
- 영상 시청 시간 측정
- 이탈 지점 분석

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**중요 사항**:
- 영상 재생/일시정지 횟수는 추적하지 않음 (복잡도 증가, 분석 가치 낮음)
- `video_watch_time`만으로 충분한 인사이트 확보 가능

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

### 4️⃣ `recipe_detail_video_first_interact` - 영상 최초 조작 ⭐

**발생 시점**: 사용자가 YouTube 플레이어를 **처음으로 직접 조작**할 때 (페이지당 최대 1회)

**속성**:
```typescript
{
  recipe_id: string;
  first_action: "play" | "pause" | "seek";  // 최초 조작 유형
  time_to_interact: number;      // 페이지 진입부터 최초 조작까지 시간 (초)
  video_time: number;             // 조작 시점의 영상 시간 (초)
}
```

**발생 조건** (OR 조건 중 하나):
1. ✅ YouTube 플레이어의 **재생 버튼**을 직접 클릭
2. ✅ YouTube 플레이어의 **일시정지 버튼**을 직접 클릭
3. ✅ YouTube 플레이어의 **진행바**를 직접 드래그/클릭

**발생하지 않는 경우**:
- ❌ 스텝 클릭으로 인한 프로그래밍적 재생 (우리 코드가 `player.playVideo()` 호출)
- ❌ 스텝 클릭으로 인한 시간 이동 (우리 코드가 `player.seekTo()` 호출)

**측정 목적**:
- 영상 콘텐츠 자체에 대한 관심도
- 최초 조작까지 걸리는 시간
- 재생으로 시작하는지 탐색으로 시작하는지

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx` (StickyVideo 컴포넌트)

**핵심 구분점**:
- **사용자가 YouTube UI를 직접 터치/클릭** → `video_first_interact` 발생
- **우리 코드가 YouTube API를 호출** → `video_seek` 발생

---

### 5️⃣ `recipe_detail_video_seek` - 스텝으로 영상 이동

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

### 6️⃣ `recipe_detail_feature_click` - 부가 기능 클릭

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

### 7️⃣ `recipe_detail_cooking_start` - 요리 시작

**발생 시점**: "요리 시작" 버튼 클릭 시 (`/recipe/{id}/step` 페이지로 이동)

**속성**:
```typescript
{
  recipe_id: string;
  time_to_start: number;          // 페이지 진입부터 요리 시작까지 시간 (초)
  tabs_visited: string[];         // 방문한 탭 목록
  tab_visit_count: number;        // 탭 클릭 총 횟수
  video_watched: boolean;         // 영상을 봤는지
}
```

**측정 목적**:
- **최종 전환율** (가장 중요)
- 요리 시작까지 걸리는 시간
- 어떤 준비를 한 사용자가 요리를 시작하는지

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/index.tsx` (RecipeBottomSheet - "요리 시작" 버튼)

---

## 구현 방법

### 페이지 레벨 State 관리

```typescript
// RecipeDetailPageReady 컴포넌트
const RecipeDetailPageReady = ({ id }: { id: string }) => {
  const { data } = useFetchRecipe(id);

  // 페이지 진입 시간
  const pageStartTime = useRef(Date.now());

  // 탭 관련
  const tabsVisited = useRef<Set<string>>(new Set(["summary"])); // 기본 탭
  const tabClickCount = useRef(0);
  const currentTab = useRef("summary");

  // 영상 관련
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const videoPlayed = useRef(false);
  const videoWatchTime = useRef(0);
  const lastVideoTime = useRef(0);
  const isPlayingRef = useRef(false);
  const playStartTime = useRef<number | null>(null);

  // 스텝 클릭 플래그 (video_first_interact와 구분)
  const isSeekingByStep = useRef(false);

  // 요리 시작 여부
  const reachedCookingStart = useRef(false);

  // ...
};
```

### 1. View 이벤트 (페이지 진입)

```typescript
useEffect(() => {
  // 페이지 진입 시 view 이벤트
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIEW, {
    recipe_id: id,
    recipe_title: data?.videoInfo?.videoTitle || "",
    entry_source: document.referrer || undefined,
    total_steps: steps.length,
    total_ingredients: ingredients.length,
    has_video: !!videoInfo?.id,
    video_duration: videoInfo?.duration || undefined,
  });
}, []);
```

### 2. Exit 이벤트 (페이지 이탈)

```typescript
useEffect(() => {
  return () => {
    // 페이지 이탈 시 exit 이벤트
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_EXIT, {
      recipe_id: id,
      view_duration: (Date.now() - pageStartTime.current) / 1000,
      tabs_visited: Array.from(tabsVisited.current),
      tab_click_count: tabClickCount.current,
      video_played: videoPlayed.current,
      video_watch_time: videoWatchTime.current,
      reached_cooking_start: reachedCookingStart.current,
    });
  };
}, []);
```

### 3. 영상 시청 시간 추적

```typescript
// YouTube Player 이벤트 핸들러
const handleVideoStateChange = (event: YT.PlayerEvent) => {
  const player = event.target;
  const currentTime = player.getCurrentTime();
  const state = event.data;

  // 재생 시작
  if (state === YT.PlayerState.PLAYING) {
    isPlayingRef.current = true;
    playStartTime.current = Date.now();
    videoPlayed.current = true;
  }

  // 일시정지 또는 종료
  if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
    if (isPlayingRef.current && playStartTime.current) {
      const watchDuration = (Date.now() - playStartTime.current) / 1000;
      videoWatchTime.current += watchDuration;
      isPlayingRef.current = false;
      playStartTime.current = null;
    }
  }

  lastVideoTime.current = currentTime;
};
```

### 4. Video First Interact 이벤트

```typescript
const handleVideoFirstInteract = (action: "play" | "pause" | "seek", videoTime: number) => {
  if (!hasUserInteracted && !isSeekingByStep.current) {
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_FIRST_INTERACT, {
      recipe_id: id,
      first_action: action,
      time_to_interact: (Date.now() - pageStartTime.current) / 1000,
      video_time: videoTime,
    });
    setHasUserInteracted(true);
  }
};

// YouTube Player 이벤트
<ReactYouTube
  onPlay={(event) => {
    handleVideoFirstInteract("play", event.target.getCurrentTime());
    handleVideoStateChange(event);
  }}
  onPause={(event) => {
    handleVideoFirstInteract("pause", event.target.getCurrentTime());
    handleVideoStateChange(event);
  }}
  onStateChange={(event) => {
    // 진행바 드래그 감지
    const currentTime = event.target.getCurrentTime();
    const timeDiff = Math.abs(currentTime - lastVideoTime.current);

    if (timeDiff > 1 && !isSeekingByStep.current) {
      handleVideoFirstInteract("seek", currentTime);
    }

    handleVideoStateChange(event);
  }}
/>
```

### 5. Tab Click 이벤트

```typescript
const handleTabClick = (tabName: "summary" | "recipe" | "ingredients") => {
  tabsVisited.current.add(tabName);
  tabClickCount.current++;
  currentTab.current = tabName;

  track(AMPLITUDE_EVENT.RECIPE_DETAIL_TAB_CLICK, {
    recipe_id: id,
    tab_name: tabName,
    time_since_view: (Date.now() - pageStartTime.current) / 1000,
  });
};

// RecipeBottomSheet에서 탭 클릭 시
<button onClick={() => handleTabClick("recipe")}>
  레시피
</button>
```

### 6. Video Seek 이벤트 (스텝 클릭)

```typescript
const handleStepClick = (sec: number, stepOrder: number, stepTitle: string) => {
  // 스텝 클릭 플래그 설정
  isSeekingByStep.current = true;

  track(AMPLITUDE_EVENT.RECIPE_DETAIL_VIDEO_SEEK, {
    recipe_id: id,
    step_order: stepOrder,
    step_title: stepTitle,
    video_time: sec,
  });

  // 영상 이동
  const player = playerRef.current;
  if (player) {
    player.seekTo(sec - 1.5, true);
    player.playVideo();
  }

  // 0.5초 후 플래그 해제
  setTimeout(() => {
    isSeekingByStep.current = false;
  }, 500);
};
```

### 7. Feature Click 이벤트

```typescript
// 타이머 버튼
const handleTimerClick = () => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
    recipe_id: id,
    feature_type: "timer",
    current_tab: currentTab.current,
  });
};

// 계량법 버튼
const handleMeasurementClick = () => {
  track(AMPLITUDE_EVENT.RECIPE_DETAIL_FEATURE_CLICK, {
    recipe_id: id,
    feature_type: "measurement",
    current_tab: currentTab.current,
  });
};
```

### 8. Cooking Start 이벤트

```typescript
const handleCookingStart = () => {
  reachedCookingStart.current = true;

  track(AMPLITUDE_EVENT.RECIPE_DETAIL_COOKING_START, {
    recipe_id: id,
    time_to_start: (Date.now() - pageStartTime.current) / 1000,
    tabs_visited: Array.from(tabsVisited.current),
    tab_visit_count: tabClickCount.current,
    video_watched: videoPlayed.current,
  });

  router.push(`/recipe/${id}/step`);
};
```

---

## 분석 가능 지표

### 1. 기본 지표

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **페이지 조회 수** | `recipe_detail_view` 카운트 | 레시피별 인기도 |
| **평균 체류 시간** | `recipe_detail_exit.view_duration` 평균 | 콘텐츠 품질 |
| **요리 시작 전환율** | (cooking_start / view) × 100 | 최종 목표 달성률 |
| **즉시 이탈률** | (exit.view_duration < 10초) / view × 100 | 초기 이탈 |

### 2. 탭 참여도

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **탭 클릭률** | (tab_click / view) × 100 | 사용자 참여도 |
| **평균 탭 클릭 수** | `exit.tab_click_count` 평균 | 적극적 탐색 정도 |
| **탭별 방문률** | 각 탭 포함된 `tabs_visited` 비율 | 정보 선호도 |

### 3. 영상 관련 지표

| 지표 | 계산 방식 | 의미 |
|------|----------|------|
| **영상 재생률** | (exit.video_played = true) / view × 100 | 영상 활용도 |
| **평균 시청 시간** | `exit.video_watch_time` 평균 | 실제 시청량 |
| **최초 조작 시간** | `video_first_interact.time_to_interact` 평균 | 영상 관심도 |
| **영상 이동 기능 사용률** | (video_seek 발생) / view × 100 | 기능 활용도 |

### 4. 사용자 유형 분류

```typescript
// 영상 중심 사용자
video_first_interact 있음 && video_seek 없음
→ 비율: 25%

// 기능 활용 사용자
video_first_interact 없음 && video_seek 있음
→ 비율: 15%

// 파워유저
video_first_interact 있음 && video_seek 있음
→ 비율: 20%

// 텍스트만 사용자
둘 다 없음
→ 비율: 40%
```

### 5. 전환 퍼널

```
100% - 페이지 진입 (view)
  ↓
 65% - 탭 클릭 (tab_click)
  ↓
 45% - 영상 재생 (video_played = true)
  ↓
 30% - 요리 시작 (cooking_start)
```

---

## 활용 시나리오

### 시나리오 1: 영상 vs 텍스트 선호도

**질문**: 사용자들이 영상을 보고 요리하는가, 텍스트만 보는가?

**분석**:
```
영상 재생률: 45%
평균 시청 시간: 52초
영상 시청자 요리 시작률: 38%
비시청자 요리 시작률: 24%
```

**인사이트**:
- 영상 시청자가 전환율 14%p 높음
- 영상이 요리 시작 의사결정에 긍정적 영향
- 영상 품질 개선 시 전환율 향상 기대

---

### 시나리오 2: 최초 영상 조작 패턴

**질문**: 사용자들이 영상을 어떻게 시작하는가?

**분석**:
```
first_action 분포:
- "play" (재생): 70%
- "seek" (탐색): 25%
- "pause" (일시정지): 5%

평균 time_to_interact: 18초
```

**인사이트**:
- 대부분(70%)은 처음부터 재생
- 25%는 필요한 부분을 찾아봄 (능동적)
- 페이지 진입 후 18초 만에 영상에 관심

---

### 시나리오 3: 스텝-영상 연동 효과

**질문**: 스텝 클릭으로 영상 이동하는 기능이 유용한가?

**분석**:
```
기능 사용률: 18%
기능 사용자 평균 시청 시간: 78초
기능 미사용자 평균 시청 시간: 38초
기능 사용자 요리 시작률: 42%
기능 미사용자 요리 시작률: 28%
```

**인사이트**:
- 기능 사용자가 2배 더 오래 시청
- 전환율도 14%p 높음
- 하지만 사용률 18%로 낮음
- **개선 방향**: 기능 발견성(Discoverability) 개선 필요

---

### 시나리오 4: 탐색 패턴별 전환율

**질문**: 어떤 탐색 패턴이 요리 시작률이 높은가?

**분석**:
```
패턴 A: 순차적 탐색 (요약 → 레시피 → 재료)
- 비율: 35%
- 요리 시작률: 45%

패턴 B: 레시피만 (레시피 탭만)
- 비율: 25%
- 요리 시작률: 38%

패턴 C: 재료 확인형 (재료 → 요약)
- 비율: 20%
- 요리 시작률: 32%

패턴 D: 빠른 스캔 (탭 클릭 < 2)
- 비율: 20%
- 요리 시작률: 15%
```

**인사이트**:
- 순차적으로 충분히 탐색한 사용자가 전환율 가장 높음
- 빠르게 훑어본 사용자는 전환율 낮음
- **개선 방향**: 탭 전환 유도 UX 개선

---

## 구현 체크리스트

### Phase 1: 기본 추적 (High Priority)
- [ ] `recipe_detail_view` - 페이지 진입
- [ ] `recipe_detail_exit` - 페이지 이탈 (영상 시청 시간 포함)
- [ ] `recipe_detail_cooking_start` - 요리 시작

### Phase 2: 참여도 추적 (High Priority)
- [ ] `recipe_detail_tab_click` - 탭 클릭
- [ ] 영상 시청 시간 계산 로직 구현

### Phase 3: 영상 인터랙션 (Medium Priority)
- [ ] `recipe_detail_video_first_interact` - 영상 최초 조작
- [ ] `recipe_detail_video_seek` - 스텝으로 영상 이동
- [ ] 스텝 클릭 플래그 (`isSeekingByStep`) 구현

### Phase 4: 부가 기능 (Low Priority)
- [ ] `recipe_detail_feature_click` - 타이머/계량법 클릭

### 검증
- [ ] 모든 이벤트가 올바른 시점에 발생하는지 확인
- [ ] 속성 값이 정확히 전달되는지 확인
- [ ] 중복 이벤트가 발생하지 않는지 확인 (특히 `video_first_interact`)
- [ ] Exit 시 영상 시청 시간이 정확히 계산되는지 확인

---

## 주의사항

### 1. 영상 시청 시간 계산

- ✅ **올바른 방법**: 재생 시작 시간을 기록하고, 일시정지/종료 시 경과 시간 계산
- ❌ **잘못된 방법**: getCurrentTime()을 사용하면 부정확 (사용자가 건너뛸 수 있음)

### 2. Video First Interact vs Video Seek 구분

- `video_first_interact`: 사용자가 YouTube UI를 **직접** 조작
- `video_seek`: 우리 코드가 스텝 클릭으로 **프로그래밍적** 이동
- `isSeekingByStep` 플래그로 명확히 구분 필요

### 3. Exit 이벤트 발송 시점

- 페이지 언마운트 시 `useEffect cleanup`에서 발송
- 이 시점에 모든 집계 데이터 (탭 방문, 영상 시청 등) 포함

### 4. 영상 재생 중 페이지 이탈

- 페이지 이탈 시 재생 중이었다면 마지막 재생 시간까지 포함
- `useEffect cleanup`에서 `isPlayingRef`를 확인하여 처리

```typescript
useEffect(() => {
  return () => {
    // 재생 중이었다면 마지막 시청 시간 추가
    if (isPlayingRef.current && playStartTime.current) {
      const lastWatch = (Date.now() - playStartTime.current) / 1000;
      videoWatchTime.current += lastWatch;
    }

    // Exit 이벤트 발송
    track(AMPLITUDE_EVENT.RECIPE_DETAIL_EXIT, {
      // ...
    });
  };
}, []);
```

---

## 다음 단계

1. [ ] 이벤트 상수 추가 (`amplitudeEvents.ts`)
2. [ ] 페이지 레벨 state 구현
3. [ ] 각 이벤트별 추적 로직 구현
4. [ ] 테스트 및 검증
5. [ ] Amplitude 대시보드에서 이벤트 확인
6. [ ] 초기 데이터 수집 후 지표 분석
