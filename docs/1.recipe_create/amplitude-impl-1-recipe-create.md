# 레시피 생성 이벤트 구현 계획

> 구현 단위 1 (1. 레시피 생성 8개 이벤트)

---

## 개요

레시피 생성은 **두 가지 경로**로 나뉘며, 분석 목적이 다르므로 이벤트를 분리합니다:

- **카드 경로 (`_card`)**: 앱 내 기존 레시피 카드 클릭 → 다이얼로그 → 생성
- **URL 경로 (`_url`)**: 외부 공유 또는 플로팅 버튼 → URL 입력 모달 → 생성

---

## 레시피 생성 경로 분석

### 카드 경로 (6가지 source)

| source 값 | 화면 위치 | 파일 | 컴포넌트 |
|-----------|----------|------|----------|
| `popular_normal` | 홈 > 인기 레시피 | `popularRecipes.tsx` | `RecipeCardWrapper` |
| `popular_shorts` | 홈 > 인기 쇼츠 | `popularShortsRecipes.tsx` | `RecipeCardWrapper` |
| `search_trend` | 검색 페이지 > 급상승 레시피 | `search-recipe/ui/index.tsx` | `TrendRecipeCardWrapper` |
| `search_result` | 검색 결과 페이지 | `search-results/ui/index.tsx` | `RecipeSearchedCardReady` |
| `category_cuisine` | 카테고리 > 한식/중식 등 | `category-results/ui/index.tsx` | `CuisineRecipeCardReady` |
| `category_recommend` | 카테고리 > 셰프/급상승 | `category-results/ui/index.tsx` | `RecommendRecipeCardReady` |

> **참고**: `theme_chef`, `theme_trend`는 타입 정의에는 있으나 현재 홈 화면에 테마 레시피 섹션이 구현되지 않아 사용되지 않습니다.

### URL 경로 (2가지 entry_point)

| entry_point 값 | 진입 방식 | 파일 | 특징 |
|----------------|----------|------|------|
| `external_share` | 유튜브 앱 → 공유 → Cheftory | `_app.tsx` → `recipeCreatingView.tsx` | URL 미리 채워짐 |
| `floating_button` | 홈 플로팅 버튼(+) 클릭 | `floatingButton.tsx` → `recipeCreatingView.tsx` | URL 직접 입력 |

---

## 이벤트 상세

### 카드 경로 이벤트 (4개)

#### 1. `recipe_create_start_card`

| 항목 | 내용 |
|-----|------|
| **설명** | 레시피 카드 클릭하여 다이얼로그 열림 |
| **트리거** | `setIsOpen(true)` 호출 시 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `source` | string | ✅ | 생성 경로 (6가지) | `popular_normal`, `popular_shorts`, `search_trend`, `search_result`, `category_cuisine`, `category_recommend` |
| `video_type` | string | ✅ | 영상 타입 | `SHORTS`, `NORMAL` |
| `category_type` | string | - | 카테고리 타입 (category 경로만) | `KOREAN`, `TRENDING` 등 |
| `recipe_id` | string | - | 레시피 ID | `uuid` |

---

#### 2. `recipe_create_submit_card`

| 항목 | 내용 |
|-----|------|
| **설명** | 다이얼로그에서 "생성" 버튼 클릭 |
| **트리거** | 다이얼로그 내 "생성" 버튼 onClick |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `source` | string | ✅ | 생성 경로 (6가지) | `popular_normal`, `popular_shorts`, `search_trend`, `search_result`, `category_cuisine`, `category_recommend` |
| `video_type` | string | ✅ | 영상 타입 | `SHORTS`, `NORMAL` |

---

#### 3. `recipe_create_success_card`

| 항목 | 내용 |
|-----|------|
| **설명** | 레시피 생성 성공 |
| **트리거** | `useMutation`의 `onSuccess` 콜백 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `source` | string | ✅ | 생성 경로 (6가지) | `popular_normal`, `popular_shorts`, `search_trend`, `search_result`, `category_cuisine`, `category_recommend` |
| `video_type` | string | ✅ | 영상 타입 | `SHORTS`, `NORMAL` |
| `recipe_id` | string | ✅ | 생성된 레시피 ID | `uuid` |

---

#### 4. `recipe_create_fail_card`

| 항목 | 내용 |
|-----|------|
| **설명** | 레시피 생성 실패 |
| **트리거** | `useMutation`의 `onError` 콜백 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `source` | string | ✅ | 생성 경로 (6가지) | `popular_normal`, `popular_shorts`, `search_trend`, `search_result`, `category_cuisine`, `category_recommend` |
| `error_type` | string | ✅ | 에러 유형 | `network`, `server`, `unknown` |
| `error_message` | string | - | 에러 메시지 | `Request failed` |

---

### URL 경로 이벤트 (4개)

#### 5. `recipe_create_start_url`

| 항목 | 내용 |
|-----|------|
| **설명** | URL 입력 모달 열림 |
| **트리거** | `recipeCreatingView`의 `isOpen`이 `true`로 변경될 때 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `entry_point` | string | ✅ | 진입 경로 | `external_share`, `floating_button` |
| `has_prefilled_url` | boolean | ✅ | URL 미리 채워짐 여부 | `true`, `false` |

---

#### 6. `recipe_create_submit_url`

| 항목 | 내용 |
|-----|------|
| **설명** | 모달에서 "완료" 버튼 클릭 |
| **트리거** | `handleSubmit` 함수 호출 시 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `entry_point` | string | ✅ | 진입 경로 | `external_share`, `floating_button` |
| `has_target_category` | boolean | ✅ | 카테고리 지정 여부 | `true`, `false` |
| `target_category_id` | string | - | 대상 카테고리 ID | `uuid` |

---

#### 7. `recipe_create_success_url`

| 항목 | 내용 |
|-----|------|
| **설명** | 레시피 생성 성공 |
| **트리거** | `useMutation`의 `onSuccess` 콜백 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `entry_point` | string | ✅ | 진입 경로 | `external_share`, `floating_button` |
| `recipe_id` | string | ✅ | 생성된 레시피 ID | `uuid` |
| `has_target_category` | boolean | ✅ | 카테고리 지정 여부 | `true`, `false` |

---

#### 8. `recipe_create_fail_url`

| 항목 | 내용 |
|-----|------|
| **설명** | 레시피 생성 실패 |
| **트리거** | `useMutation`의 `onError` 콜백 |

| 속성 | 타입 | 필수 | 설명 | 예시 |
|-----|------|-----|------|------|
| `entry_point` | string | ✅ | 진입 경로 | `external_share`, `floating_button` |
| `error_type` | string | ✅ | 에러 유형 | `network`, `server`, `unknown` |
| `error_message` | string | - | 에러 메시지 | `Request failed` |

---

## 구현 계획

### 수정 파일 목록

| 파일 | 수정 내용 |
|-----|----------|
| `amplitudeEvents.ts` | 8개 이벤트 상수 추가 |
| `recipeCardWrapper.tsx` | source prop 추가, start/submit 이벤트 (popular, theme) |
| `search-recipe/ui/index.tsx` | `TrendRecipeCardWrapper`에 start/submit 이벤트 (search_trend) |
| `search-results/ui/index.tsx` | start/submit 이벤트 (search_result) |
| `category-results/ui/index.tsx` | categoryType prop 추가, start/submit 이벤트 (category) |
| `recipeCreatingView.tsx` | entry_point 추적, start/submit 이벤트 (URL 경로) |
| `recipeCreatingViewOpenStore.ts` | entry_point 상태 추가 |
| `useUserRecipe.ts` | success/fail 이벤트 (카드/URL 분기 처리) |

---

### 1. `amplitudeEvents.ts` - 이벤트 상수 추가

```typescript
export const enum AMPLITUDE_EVENT {
  // ... 기존 이벤트들

  // ─────────────────────────────────────────────────────────────
  // 레시피 생성 - 카드 경로 (앱 내 기존 레시피 선택)
  // ─────────────────────────────────────────────────────────────

  /** 레시피 카드 클릭하여 다이얼로그 열림 */
  RECIPE_CREATE_START_CARD = "recipe_create_start_card",

  /** 다이얼로그에서 "생성" 버튼 클릭 */
  RECIPE_CREATE_SUBMIT_CARD = "recipe_create_submit_card",

  /** 카드 경로 레시피 생성 성공 */
  RECIPE_CREATE_SUCCESS_CARD = "recipe_create_success_card",

  /** 카드 경로 레시피 생성 실패 */
  RECIPE_CREATE_FAIL_CARD = "recipe_create_fail_card",

  // ─────────────────────────────────────────────────────────────
  // 레시피 생성 - URL 경로 (직접 입력 / 외부 공유)
  // ─────────────────────────────────────────────────────────────

  /** URL 입력 모달 열림 */
  RECIPE_CREATE_START_URL = "recipe_create_start_url",

  /** 모달에서 "완료" 버튼 클릭 */
  RECIPE_CREATE_SUBMIT_URL = "recipe_create_submit_url",

  /** URL 경로 레시피 생성 성공 */
  RECIPE_CREATE_SUCCESS_URL = "recipe_create_success_url",

  /** URL 경로 레시피 생성 실패 */
  RECIPE_CREATE_FAIL_URL = "recipe_create_fail_url",
}
```

---

### 2. `recipeCardWrapper.tsx` - 카드 경로 (popular, theme)

**수정 사항:**

- `source` prop 추가
- `start`, `submit` 이벤트 추가

```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

// Props에 source 추가
export function RecipeCardWrapper({
  recipe,
  trigger,
  source,  // 추가: 'popular_normal' | 'popular_shorts' | 'theme_chef' | 'theme_trend'
}: {
  recipe: PopularRecipe | ThemeRecipe;
  trigger: React.ReactNode;
  source: string;
}) {
  // ... 기존 코드

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => {
          if (!recipe.isViewed) {
            // recipe_create_start_card 이벤트
            track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
              source,
              video_type: recipe.videoType,
              recipe_id: recipe.recipeId,
            });
            setIsOpen(true);
            return;
          }
          // ... 기존 로직
        }}
      >
        {trigger}
      </div>
      <DialogContent>
        {/* ... */}
        <Button
          onClick={() => {
            if (!recipe.isViewed) {
              // recipe_create_submit_card 이벤트
              track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
                source,
                video_type: recipe.videoType,
              });

              create({
                youtubeUrl: recipe.videoUrl,
                targetCategoryId: null,
                recipeId: recipe.recipeId,
                videoType: recipe.videoType,
                recipeTitle: recipe.recipeTitle,
                // 내부 추적용
                _source: source,
                _creationMethod: 'card',
              });
            }
          }}
        >
          생성
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

**부모 컴포넌트 수정:**

```typescript
// popularRecipes.tsx
<RecipeCardWrapper recipe={recipe} trigger={...} source="popular_normal" />

// popularShortsRecipes.tsx
<RecipeCardWrapper recipe={recipe} trigger={...} source="popular_shorts" />

// themeRecipeSection.tsx - ChefRecommendRecipeCardSectionReady
<RecipeCardWrapper recipe={recipe} trigger={...} source="theme_chef" />

// themeRecipeSection.tsx - TrendRecipeCardSectionReady
<RecipeCardWrapper recipe={recipe} trigger={...} source="theme_trend" />
```

---

### 3. `search-recipe/ui/index.tsx` - TrendRecipeCardWrapper

**수정 사항:**

- `start`, `submit` 이벤트 추가
- `_source`, `_creationMethod` 전달

```typescript
const TrendRecipeCardWrapper = ({ recipe }: { recipe: ThemeRecipe }) => {
  const { create } = useCreateRecipe();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    if (!recipe.isViewed) {
      // recipe_create_start_card 이벤트
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
        source: 'search_trend',
        video_type: recipe.videoType,
        recipe_id: recipe.recipeId,
      });
      setIsOpen(true);
    } else {
      router.push(`/recipe/${recipe.recipeId}/detail`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* ... */}
      <Button
        onClick={async () => {
          // recipe_create_submit_card 이벤트
          track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
            source: 'search_trend',
            video_type: recipe.videoType,
          });

          await create({
            youtubeUrl: recipe.videoUrl,
            recipeId: recipe.recipeId,
            videoType: recipe.videoType,
            recipeTitle: recipe.recipeTitle,
            _source: 'search_trend',
            _creationMethod: 'card',
          });
          router.push(`/recipe/${recipe.recipeId}/detail`);
          setIsOpen(false);
        }}
      >
        생성
      </Button>
    </Dialog>
  );
};
```

---

### 4. `search-results/ui/index.tsx` - 검색 결과

**수정 사항:**

- `start`, `submit` 이벤트 추가

```typescript
// RecipeSearchedCardReady 컴포넌트

const handleCardClick = async () => {
  if (!searchResults.isViewed) {
    // recipe_create_start_card 이벤트
    track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
      source: 'search_result',
      video_type: searchResults.videoInfo.videoType || 'NORMAL',
      recipe_id: searchResults.recipeId,
    });
    setIsOpen(true);
  } else {
    router.replace(`/recipe/${searchResults.recipeId}/detail`);
  }
};

// 생성 버튼
<Button
  onClick={async () => {
    // recipe_create_submit_card 이벤트
    track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
      source: 'search_result',
      video_type: searchResults.videoInfo.videoType || 'NORMAL',
    });

    await create({
      youtubeUrl: `https://www.youtube.com/watch?v=${searchResults.videoInfo.videoId}`,
      _source: 'search_result',
      _creationMethod: 'card',
    });
    router.replace(`/recipe/${searchResults.recipeId}/detail`);
    setIsOpen(false);
  }}
>
  생성
</Button>
```

---

### 5. `category-results/ui/index.tsx` - 카테고리 결과

**수정 사항:**

- `categoryType` prop 추가
- `start`, `submit` 이벤트 추가

```typescript
// CuisineRecipeCardReady
const CuisineRecipeCardReady = ({
  recipe,
  categoryType,  // 추가
}: {
  recipe: CuisineRecipe;
  categoryType: CuisineType;
}) => {
  const handleCardClick = () => {
    // recipe_create_start_card 이벤트
    track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
      source: 'category_cuisine',
      video_type: recipe.videoInfo.videoType || 'NORMAL',
      category_type: categoryType,
      recipe_id: recipe.recipeId,
    });
    setIsOpen(true);
  };

  // 생성 버튼
  <Button
    onClick={async () => {
      // recipe_create_submit_card 이벤트
      track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_CARD, {
        source: 'category_cuisine',
        video_type: recipe.videoInfo.videoType || 'NORMAL',
      });

      await create({
        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        _source: 'category_cuisine',
        _creationMethod: 'card',
      });
      // ...
    }}
  >
    생성
  </Button>
};

// RecommendRecipeCardReady도 동일하게 수정 (source: 'category_recommend')
```

**부모 컴포넌트에서 categoryType 전달:**

```typescript
// CuisineCategoryContent
{recipes.map((recipe) => (
  <CuisineRecipeCardReady
    key={recipe.recipeId}
    recipe={recipe}
    categoryType={cuisineType}
  />
))}

// RecommendCategoryContent
{recipes.map((recipe) => (
  <RecommendRecipeCardReady
    key={recipe.recipeId}
    recipe={recipe}
    categoryType={recommendType}
  />
))}
```

---

### 6. `recipeCreatingViewOpenStore.ts` - entry_point 상태 추가

```typescript
interface RecipeCreatingViewOpenStore {
  isOpen: boolean;
  videoUrl: string;
  entryPoint: 'external_share' | 'floating_button' | null;  // 추가
  // ... 기존 필드들

  open: (videoUrl: string, entryPoint?: 'external_share' | 'floating_button') => void;
  // ...
}

export const useRecipeCreatingViewOpenStore = create<RecipeCreatingViewOpenStore>()(
  persist(
    (set, get) => ({
      // ...
      entryPoint: null,

      open: (videoUrl, entryPoint) => {
        // 딥링크로 videoUrl이 있으면 external_share
        if (videoUrl && videoUrl.trim().length > 0) {
          set({ isOpen: true, videoUrl, entryPoint: entryPoint || 'external_share' });
          return;
        }

        const { hasSeenTutorial } = get();
        if (!hasSeenTutorial) {
          set({ isTutorialOpen: true, videoUrl, entryPoint: entryPoint || 'floating_button' });
        } else {
          set({ isOpen: true, videoUrl, entryPoint: entryPoint || 'floating_button' });
        }
      },
      // ...
    }),
    // ...
  )
);
```

**호출부 수정:**

```typescript
// _app.tsx - 외부 공유
open(info.videoUrl, 'external_share');

// floatingButton.tsx - 플로팅 버튼
open("", 'floating_button');

// shareTutorialModal.tsx
openRecipeCreatingView(videoUrl);  // entryPoint는 이미 store에 저장됨
```

---

### 7. `recipeCreatingView.tsx` - URL 경로

```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

export function RecipeCreatingView() {
  const {
    isOpen,
    videoUrl: url,
    entryPoint,  // 추가
    setIsOpen,
    setUrl,
    close,
  } = useRecipeCreatingViewOpenStore();

  // start 이벤트
  useEffect(() => {
    if (isOpen && entryPoint) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_START_URL, {
        entry_point: entryPoint,
        has_prefilled_url: url.trim().length > 0,
      });
    }
  }, [isOpen, entryPoint]);

  const handleSubmit = async () => {
    if (isSubmittable()) {
      // recipe_create_submit_url 이벤트
      track(AMPLITUDE_EVENT.RECIPE_CREATE_SUBMIT_URL, {
        entry_point: entryPoint,
        has_target_category: !!selectedCategoryId,
        target_category_id: selectedCategoryId || undefined,
      });

      create({
        youtubeUrl: url,
        targetCategoryId: selectedCategoryId,
        _entryPoint: entryPoint,
        _creationMethod: 'url',
        _hasTargetCategory: !!selectedCategoryId,
      });
      setHasEverTyped(false);
      close();
    }
  };

  // ...
}
```

---

### 8. `useUserRecipe.ts` - 성공/실패 이벤트

```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";

// 타입 정의 확장
interface CreateRecipeParams {
  youtubeUrl: string;
  targetCategoryId?: string | null;
  recipeId?: string;
  videoType?: VideoType;
  recipeTitle?: string;
  // 내부 추적용
  _source?: string;
  _entryPoint?: string;
  _creationMethod?: 'card' | 'url';
  _hasTargetCategory?: boolean;
}

export function useCreateRecipe() {
  const { mutate, ... } = useMutation({
    mutationFn: async (params: CreateRecipeParams) => {
      // ... 기존 로직
    },

    onSuccess: (data, variables) => {
      if (variables._creationMethod === 'card') {
        // 카드 경로 성공
        track(AMPLITUDE_EVENT.RECIPE_CREATE_SUCCESS_CARD, {
          source: variables._source,
          video_type: variables.videoType || 'NORMAL',
          recipe_id: data.recipeId,
        });
      } else {
        // URL 경로 성공
        track(AMPLITUDE_EVENT.RECIPE_CREATE_SUCCESS_URL, {
          entry_point: variables._entryPoint,
          recipe_id: data.recipeId,
          has_target_category: variables._hasTargetCategory || false,
        });
      }

      // ... 기존 invalidate 로직
    },

    onError: (error, variables, ctx) => {
      const errorType = getErrorType(error);

      if (variables._creationMethod === 'card') {
        // 카드 경로 실패
        track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_CARD, {
          source: variables._source,
          error_type: errorType,
          error_message: error.message,
        });
      } else {
        // URL 경로 실패
        track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_URL, {
          entry_point: variables._entryPoint,
          error_type: errorType,
          error_message: error.message,
        });
      }

      // ... 기존 에러 처리 로직
    },
  });
}

// 헬퍼 함수
function getErrorType(error: Error): string {
  const message = error.message.toLowerCase();
  if (message.includes('network') || message.includes('fetch')) return 'network';
  if (message.includes('timeout')) return 'timeout';
  return 'server';
}
```

---

## 분석 가능한 인사이트

### 경로 비교 분석

| 질문 | 확인 방법 |
|-----|----------|
| 앱 제공 레시피 vs 직접 탐색 비율? | `success_card` vs `success_url` 카운트 |
| 어느 경로 전환율이 높은가? | 각각 `start → success` 퍼널 |
| 외부 공유 기능 효과? | `entry_point = 'external_share'` 추이 |

### Source별 분석 (카드 경로 6가지)

| 질문 | 확인 방법 |
|-----|----------|
| 가장 많이 사용되는 source는? | `source` 분포 분석 |
| 홈 vs 검색 vs 카테고리 성과 비교? | `popular_*` vs `search_*` vs `category_*` 집계 |
| 인기 레시피 일반 vs 쇼츠 선호도? | `popular_normal` vs `popular_shorts` 비교 |
| 검색 급상승 vs 검색 결과 전환율? | `search_trend` vs `search_result` 전환율 |
| 음식 카테고리 vs 추천 카테고리 성과? | `category_cuisine` vs `category_recommend` 비교 |

### 세부 분석

| 질문 | 확인 방법 |
|-----|----------|
| 쇼츠 vs 일반 영상 선호도? | `video_type` 분포 |
| 카테고리별 인기 레시피? | `category_type` 분포 (category source에서만) |
| 주요 에러 유형? | `error_type` 분포 |
| Source별 실패율 비교? | `fail_card` 이벤트의 `source`별 집계 |

---

## 체크리스트

### 코드 수정

**기본 설정:**
- [ ] `amplitudeEvents.ts` - 8개 이벤트 상수 추가
- [ ] `useUserRecipe.ts` - success/fail 이벤트 (카드/URL 분기)

**카드 경로 구현 (6가지):**
- [ ] `recipeCardWrapper.tsx` - source prop 추가, start/submit 이벤트
- [ ] `popularRecipes.tsx` - source="popular_normal" 전달
- [ ] `popularShortsRecipes.tsx` - source="popular_shorts" 전달
- [ ] `search-recipe/ui/index.tsx` - source="search_trend" 이벤트 추가
- [ ] `search-results/ui/index.tsx` - source="search_result" 이벤트 추가
- [ ] `category-results/ui/index.tsx` - source="category_cuisine", "category_recommend" 이벤트 추가

**URL 경로 구현 (2가지):**
- [ ] `recipeCreatingViewOpenStore.ts` - entryPoint 상태 추가
- [ ] `_app.tsx` - open() 호출 시 entryPoint="external_share" 전달
- [ ] `floatingButton.tsx` - open() 호출 시 entryPoint="floating_button" 전달
- [ ] `recipeCreatingView.tsx` - start/submit 이벤트 추가

**미구현 (향후 추가 시):**
- [ ] `themeRecipeSection.tsx` - source="theme_chef", "theme_trend" 전달 (테마 레시피 섹션 구현 필요)

### 테스트

**카드 경로 (6가지):**
- [ ] 인기 레시피 경로 (popular_normal)
- [ ] 인기 쇼츠 경로 (popular_shorts)
- [ ] 검색 급상승 경로 (search_trend)
- [ ] 검색 결과 경로 (search_result)
- [ ] 카테고리 음식 경로 (category_cuisine)
- [ ] 카테고리 추천 경로 (category_recommend)

**URL 경로 (2가지):**
- [ ] 외부 공유 경로 (external_share)
- [ ] 플로팅 버튼 경로 (floating_button)

**공통:**
- [ ] 성공/실패 이벤트가 올바른 이벤트명으로 발송되는지 확인
- [ ] video_type이 정확하게 전달되는지 확인 (NORMAL/SHORTS)

