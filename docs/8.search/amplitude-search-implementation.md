# 검색 Amplitude 이벤트 구현 가이드

## 개요

검색 기능에서의 사용자 행동을 추적하여 검색 품질 개선 및 사용자 경험 최적화에 활용합니다.

> **구현 대상 파일**:
> - `webview-v2/src/views/search-recipe/index.tsx` - 검색 페이지 (검색 실행)
> - `webview-v2/src/views/search-recipe/ui/index.tsx` - 검색 오버레이 (최근/인기 검색어)
> - `webview-v2/src/views/search-results/index.tsx` - 검색 결과 페이지
> - `webview-v2/src/views/search-results/ui/index.tsx` - 검색 결과 UI (결과 조회, 클릭)

---

## 이벤트 목록 (3개)

| # | 이벤트명 | 설명 | 트리거 시점 |
|---|---------|------|------------|
| 1 | `search_executed` | 검색 실행 | Enter 키 또는 자동완성/최근/인기 검색어 선택 시 |
| 2 | `search_results_view` | 검색 결과 조회 | 검색 결과 페이지 진입 및 데이터 로드 완료 시 |
| 3 | `search_result_click` | 검색 결과 클릭 | 검색 결과에서 레시피 카드 클릭 시 |

---

## 이벤트 상세

### 1. `search_executed`

**설명**: 사용자가 검색을 실행했을 때 발생

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 |
| `search_method` | string | 검색 방식: `direct`, `autocomplete`, `recent`, `popular` |

```typescript
{
  keyword: string;           // "김치찌개"
  search_method: "direct" | "autocomplete" | "recent" | "popular";
}
```

**검색 방식 설명**:

| search_method 값 | 설명 | 트리거 위치 |
|------------------|------|------------|
| `direct` | Enter 키로 직접 검색 | `SearchBar.handleEnterKey()` |
| `autocomplete` | 자동완성 항목 선택 | `AutoCompleteKeywordItem` 클릭 |
| `recent` | 최근 검색어 선택 | 최근 검색어 칩 클릭 |
| `popular` | 인기 검색어 선택 | 인기 검색어 항목 클릭 |

**측정 목적**:

- 검색어 패턴 분석 → 콘텐츠 전략 수립
- 검색 방식별 사용 비율 → 자동완성/인기검색어 효과 측정

---

### 2. `search_results_view`

**설명**: 검색 결과 페이지에서 결과가 로드되었을 때 발생

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 |
| `results_count` | number | 검색 결과 수 (총 개수) |
| `has_results` | boolean | 결과 존재 여부 |

```typescript
{
  keyword: string;           // "김치찌개"
  results_count: number;     // 25
  has_results: boolean;      // true
}
```

**트리거**: `SearchResultsContent` 컴포넌트에서 `useFetchRecipesSearched` 데이터 로드 후

**측정 목적**:
- 검색 완료율 (`search_results_view` / `search_executed`)
- 검색 결과 없음 비율 (`has_results = false`)
- 평균 검색 결과 수

---

### 3. `search_result_click`

**설명**: 검색 결과에서 레시피 카드를 클릭했을 때 발생

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 |
| `recipe_id` | string | 클릭한 레시피 ID |
| `position` | number | 클릭 위치 (1부터 시작) |
| `is_registered` | boolean | 등록된 레시피 여부 (isViewed) |

```typescript
{
  keyword: string;           // "김치찌개"
  recipe_id: string;         // "recipe_123"
  position: number;          // 3
  is_registered: boolean;    // false
}
```

**트리거**: `RecipeSearchedCardReady.handleCardClick()`

**측정 목적**:
- 검색 CTR (`search_result_click` / `search_results_view`)
- 클릭 위치 분포 → 랭킹 품질 평가
- 미등록 레시피 클릭 비율

---

## 구현 상세

### 1. 이벤트 상수 추가

**파일**: `webview-v2/src/shared/analytics/amplitudeEvents.ts`

**위치**: 파일 끝, `ACCOUNT_DELETE` 아래에 추가

```typescript
  // ─────────────────────────────────────────────────────────────
  // 검색 (Search)
  // 검색 행동 및 결과 상호작용 추적
  // @see /frontend/docs/8.search/amplitude-search-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 검색 실행 */
  SEARCH_EXECUTED = "search_executed",

  /** 검색 결과 조회 */
  SEARCH_RESULTS_VIEW = "search_results_view",

  /** 검색 결과 클릭 */
  SEARCH_RESULT_CLICK = "search_result_click",
```

---

### 2. 검색 실행 이벤트 구현

#### 2-1. 검색 페이지 (직접 검색, 자동완성)

**파일**: `webview-v2/src/views/search-recipe/index.tsx`

**현재 import (line 3)**:
```typescript
import { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
```

**추가할 import**:
```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
```

**SearchBar 컴포넌트 수정 (handleEnterKey 함수, line 129-136)**:

현재 코드:
```typescript
const handleEnterKey = useCallback(() => {
  if (keyboardInput.trim()) {
    onSearchExecute();
    inputRef.current?.blur();
    setIsFocused(false);
    onSearchSelect(keyboardInput.trim());
  }
}, [keyboardInput, onSearchExecute, onSearchSelect]);
```

수정 후:
```typescript
const handleEnterKey = useCallback(() => {
  if (keyboardInput.trim()) {
    // 🆕 검색 실행 이벤트 (직접 입력)
    track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
      keyword: keyboardInput.trim(),
      search_method: "direct",
    });

    onSearchExecute();
    inputRef.current?.blur();
    setIsFocused(false);
    onSearchSelect(keyboardInput.trim());
  }
}, [keyboardInput, onSearchExecute, onSearchSelect]);
```

**AutoCompleteKeywordItem 컴포넌트 수정 (line 267-296)**:

현재 코드:
```typescript
const AutoCompleteKeywordItem = memo(({
  keyword,
  text,
  onClick,
}: {
  keyword: string;
  text: string;
  onClick?: (keyword: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onClick?.(text);
  }, [onClick, text]);
```

수정 후:
```typescript
const AutoCompleteKeywordItem = memo(({
  keyword,
  text,
  onClick,
}: {
  keyword: string;
  text: string;
  onClick?: (keyword: string) => void;
}) => {
  const handleClick = useCallback(() => {
    // 🆕 검색 실행 이벤트 (자동완성 선택)
    track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
      keyword: text,
      search_method: "autocomplete",
    });

    onClick?.(text);
  }, [onClick, text]);
```

#### 2-2. 검색 오버레이 (최근/인기 검색어)

**파일**: `webview-v2/src/views/search-recipe/ui/index.tsx`

**이미 import 됨 (line 27-28)**:
```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
```

**최근 검색어 클릭 수정 (line 162-167)**:

현재 코드:
```typescript
{searchHistories.histories.map((search, index) => (
  <div
    key={index}
    className="shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 cursor-pointer"
    onClick={() => onSearchSelect?.(search)}
  >
```

수정 후:
```typescript
{searchHistories.histories.map((search, index) => (
  <div
    key={index}
    className="shrink-0 snap-start flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 cursor-pointer"
    onClick={() => {
      // 🆕 검색 실행 이벤트 (최근 검색어)
      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
        keyword: search,
        search_method: "recent",
      });
      onSearchSelect?.(search);
    }}
  >
```

**인기 검색어 클릭 수정 - 펼친 상태 (line 221-226)**:

현재 코드:
```typescript
{autoCompleteData.autocompletes.map((item, index) => (
  <div
    key={index}
    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
    onClick={() => onSearchSelect?.(item.autocomplete)}
  >
```

수정 후:
```typescript
{autoCompleteData.autocompletes.map((item, index) => (
  <div
    key={index}
    className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-orange-50 hover:border-orange-200 border border-transparent cursor-pointer transition-all duration-200 group"
    onClick={() => {
      // 🆕 검색 실행 이벤트 (인기 검색어)
      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
        keyword: item.autocomplete,
        search_method: "popular",
      });
      onSearchSelect?.(item.autocomplete);
    }}
  >
```

**인기 검색어 클릭 수정 - 접힌 상태 (line 259-265)**:

현재 코드:
```typescript
{autoCompleteData.autocompletes.map((item, index) => (
  <div
    key={index}
    className="flex items-center gap-2.5 px-3 absolute w-full h-[60px] cursor-pointer hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-200 group rounded-lg"
    style={{ top: `${index * 60}px` }}
    onClick={() => onSearchSelect?.(item.autocomplete)}
  >
```

수정 후:
```typescript
{autoCompleteData.autocompletes.map((item, index) => (
  <div
    key={index}
    className="flex items-center gap-2.5 px-3 absolute w-full h-[60px] cursor-pointer hover:bg-orange-50 hover:border-orange-200 border border-transparent transition-all duration-200 group rounded-lg"
    style={{ top: `${index * 60}px` }}
    onClick={() => {
      // 🆕 검색 실행 이벤트 (인기 검색어)
      track(AMPLITUDE_EVENT.SEARCH_EXECUTED, {
        keyword: item.autocomplete,
        search_method: "popular",
      });
      onSearchSelect?.(item.autocomplete);
    }}
  >
```

---

### 3. 검색 결과 조회 이벤트 구현

**파일**: `webview-v2/src/views/search-results/ui/index.tsx`

**이미 import 됨 (line 22-23)**:
```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
```

**SearchResultsContent 컴포넌트에 useEffect 추가 (line 102-137 사이)**:

현재 코드:
```typescript
export function SearchResultsContent({ keyword }: { keyword: string }) {
  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useFetchRecipesSearched({ query: keyword });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 1. 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatSearchResultMessages(lang);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    // ...
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);
```

수정 후:
```typescript
export function SearchResultsContent({ keyword }: { keyword: string }) {
  const {
    data: searchResults,
    totalElements,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useFetchRecipesSearched({ query: keyword });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);  // 🆕 중복 방지용 ref

  // 1. 언어 설정 가져오기
  const lang = useLangcode();
  const messages = formatSearchResultMessages(lang);

  // 🆕 검색 결과 조회 이벤트
  useEffect(() => {
    // 키워드가 있고, 아직 추적하지 않았을 때만 실행
    if (keyword && !hasTrackedView.current) {
      hasTrackedView.current = true;
      track(AMPLITUDE_EVENT.SEARCH_RESULTS_VIEW, {
        keyword,
        results_count: totalElements,
        has_results: searchResults.length > 0,
      });
    }
  }, [keyword, totalElements, searchResults.length]);

  // 🆕 키워드 변경 시 추적 상태 리셋
  useEffect(() => {
    hasTrackedView.current = false;
  }, [keyword]);

  useEffect(() => {
    const loadMore = loadMoreRef.current;
    // ...
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);
```

---

### 4. 검색 결과 클릭 이벤트 구현

**파일**: `webview-v2/src/views/search-results/ui/index.tsx`

**RecipeSearchedCardReady 컴포넌트 수정**:

Props에 `keyword`와 `position` 추가가 필요합니다.

**현재 코드 (line 172-177)**:
```typescript
{searchResults.map((recipe) => (
  <RecipeSearchedCardReady
    key={recipe.recipeId}
    searchResults={recipe}
  />
))}
```

수정 후:
```typescript
{searchResults.map((recipe, index) => (
  <RecipeSearchedCardReady
    key={recipe.recipeId}
    searchResults={recipe}
    keyword={keyword}       // 🆕
    position={index + 1}    // 🆕 1-based index
  />
))}
```

**RecipeSearchedCardReady 컴포넌트 Props 수정 (line 191-199)**:

현재 코드:
```typescript
const RecipeSearchedCardReady = ({
  searchResults,
}: {
  searchResults: Recipe;
}) => {
```

수정 후:
```typescript
const RecipeSearchedCardReady = ({
  searchResults,
  keyword,      // 🆕
  position,     // 🆕
}: {
  searchResults: Recipe;
  keyword: string;      // 🆕
  position: number;     // 🆕
}) => {
```

**handleCardClick 함수 수정 (line 205-216)**:

현재 코드:
```typescript
const handleCardClick = async () => {
  if (!searchResults.isViewed) {
    track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
      source: "search_result",
      video_type: searchResults.videoInfo.videoType || "NORMAL",
      recipe_id: searchResults.recipeId,
    });
    setIsOpen(true);
  } else {
    router.replace(`/recipe/${searchResults.recipeId}/detail`);
  }
};
```

수정 후:
```typescript
const handleCardClick = async () => {
  // 🆕 검색 결과 클릭 이벤트 (항상 발생)
  track(AMPLITUDE_EVENT.SEARCH_RESULT_CLICK, {
    keyword,
    recipe_id: searchResults.recipeId,
    position,
    is_registered: searchResults.isViewed,
  });

  if (!searchResults.isViewed) {
    track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, {
      source: "search_result",
      video_type: searchResults.videoInfo.videoType || "NORMAL",
      recipe_id: searchResults.recipeId,
    });
    setIsOpen(true);
  } else {
    router.replace(`/recipe/${searchResults.recipeId}/detail`);
  }
};
```

---

## 전체 변경 요약

| 파일 | 변경 내용 |
|-----|----------|
| `amplitudeEvents.ts` | 3개 이벤트 상수 추가 |
| `search-recipe/index.tsx` | import 추가, `handleEnterKey`에 direct 이벤트, `AutoCompleteKeywordItem`에 autocomplete 이벤트 |
| `search-recipe/ui/index.tsx` | 최근검색어 recent 이벤트, 인기검색어 popular 이벤트 (펼침/접힘 상태 둘 다) |
| `search-results/ui/index.tsx` | `hasTrackedView` ref 추가, useEffect로 results_view 이벤트, Props 확장, `handleCardClick`에 result_click 이벤트 |

---

## 분석 가능 지표

### 퍼널 분석

```text
search_executed (100%)
       ↓
search_results_view (95%)  ← 5% 이탈 (네트워크 오류 등)
       ↓
search_result_click (40%)  ← CTR 40%
       ↓
recipe_detail_view (기존 이벤트)
```

### 핵심 지표

| 지표 | 계산 방법 |
|-----|----------|
| 검색 완료율 | `search_results_view` / `search_executed` |
| 검색 CTR | `search_result_click` / `search_results_view` |
| 검색 결과 없음 비율 | `has_results = false` / `search_results_view` |
| 자동완성 사용률 | `search_method = "autocomplete"` / `search_executed` |
| 인기검색어 사용률 | `search_method = "popular"` / `search_executed` |
| 평균 클릭 위치 | `AVG(position)` from `search_result_click` |

### 검색 방식 분석 예시

```sql
-- 검색 방식별 CTR 비교
WITH searches AS (
  SELECT keyword, search_method
  FROM search_executed
),
clicks AS (
  SELECT keyword
  FROM search_result_click
)
SELECT
  s.search_method,
  COUNT(DISTINCT s.keyword) as search_count,
  COUNT(DISTINCT c.keyword) as click_count,
  COUNT(DISTINCT c.keyword) * 100.0 / COUNT(DISTINCT s.keyword) as ctr
FROM searches s
LEFT JOIN clicks c ON s.keyword = c.keyword
GROUP BY s.search_method
ORDER BY ctr DESC
```

---

## 구현 체크리스트

- [ ] `amplitudeEvents.ts`에 3개 이벤트 상수 추가
- [ ] `search-recipe/index.tsx`에 import 추가
- [ ] `search-recipe/index.tsx`의 `handleEnterKey`에 direct 이벤트 추가
- [ ] `search-recipe/index.tsx`의 `AutoCompleteKeywordItem`에 autocomplete 이벤트 추가
- [ ] `search-recipe/ui/index.tsx`의 최근검색어에 recent 이벤트 추가
- [ ] `search-recipe/ui/index.tsx`의 인기검색어 (펼침)에 popular 이벤트 추가
- [ ] `search-recipe/ui/index.tsx`의 인기검색어 (접힘)에 popular 이벤트 추가
- [ ] `search-results/ui/index.tsx`에 `hasTrackedView` ref 추가
- [ ] `search-results/ui/index.tsx`에 results_view useEffect 추가
- [ ] `search-results/ui/index.tsx`의 map에 keyword, position props 전달
- [ ] `search-results/ui/index.tsx`의 `RecipeSearchedCardReady` Props 확장
- [ ] `search-results/ui/index.tsx`의 `handleCardClick`에 result_click 이벤트 추가
- [ ] TypeScript 컴파일 확인
- [ ] 테스트 및 검증
- [ ] Amplitude 대시보드에서 이벤트 확인

---

## 기존 이벤트와의 관계

| 기존 이벤트 | 관계 | 설명 |
|------------|------|------|
| `RECIPE_CREATE_START_CARD` | 병행 | 미등록 레시피 클릭 시 둘 다 발생 |
| `RECIPE_CREATE_SUBMIT_CARD` | 독립 | 레시피 생성 확정 시 발생 (변경 없음) |

> **참고**: `search_result_click`은 모든 카드 클릭에서 발생하고, `RECIPE_CREATE_START_CARD`는 미등록 레시피 클릭에서만 발생합니다.
