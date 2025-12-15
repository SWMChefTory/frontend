# Amplitude 구현 - 주의사항 해결 방안

> 1단계, 3단계 구현 시 발견된 주의사항에 대한 상세 분석 및 해결 방안

---

## 목차

1. [1단계 주의사항: openRecipeCreatingView entryPoint 유지](#1단계-주의사항-openrecipecreatingview-entrypoint-유지)
2. [3단계 주의사항: onError videoType 체크 로직](#3단계-주의사항-onerror-videotype-체크-로직)

---

## 1단계 주의사항: openRecipeCreatingView entryPoint 유지

### 문제 상황

`recipeCreatingViewOpenStore.ts`에 두 가지 열기 함수가 존재:

| 함수 | 용도 | 현재 동작 |
|------|------|----------|
| `open(videoUrl)` | 튜토리얼 체크 후 열기 | entryPoint 저장 예정 |
| `openRecipeCreatingView(videoUrl)` | 튜토리얼 스킵하고 바로 열기 | entryPoint 저장 안됨 |

### 현재 코드 흐름

```
사용자 플로팅 버튼 클릭
    │
    ▼
floatingButton.tsx: open("", "floating_button")
    │
    ▼
recipeCreatingViewOpenStore.ts: open()
    │
    ├── videoUrl 있음 → isOpen: true, entryPoint 저장
    │
    └── videoUrl 없음 + 튜토리얼 안봄
            │
            ▼
        isTutorialOpen: true, entryPoint 저장
            │
            ▼
        shareTutorialModal.tsx 표시
            │
            ├── "직접 입력하기" 클릭 → openRecipeCreatingView(videoUrl)
            │                              │
            │                              ▼
            │                         isOpen: true (entryPoint 유지 필요!)
            │
            └── "다시 보지 않기" 클릭 → openRecipeCreatingView(videoUrl)
```

### 문제점

```typescript
// 현재 코드 (line 57-59)
openRecipeCreatingView: (videoUrl = "") => {
  set({ isOpen: true, videoUrl });  // entryPoint가 덮어씌워지지 않음 (유지됨)
},
```

**분석 결과**: Zustand의 `set()`은 부분 업데이트이므로, `entryPoint`를 명시하지 않으면 **기존 값이 유지됩니다**.

### 해결 방안

**방안 A: 현재 동작 유지 (권장)**

`openRecipeCreatingView`에서 `entryPoint`를 건드리지 않으면 `open()`에서 저장한 값이 그대로 유지됩니다.

```typescript
// 변경 불필요 - 기존 코드 유지
openRecipeCreatingView: (videoUrl = "") => {
  set({ isOpen: true, videoUrl });  // entryPoint는 자동으로 유지됨
},
```

**방안 B: 명시적 유지 (안전성 강화)**

명시적으로 기존 `entryPoint`를 유지하도록 작성:

```typescript
openRecipeCreatingView: (videoUrl = "") => {
  const { entryPoint } = get();  // 기존 값 가져오기
  set({ isOpen: true, videoUrl, entryPoint });  // 명시적 유지
},
```

### 권장 결정

**방안 A 채택** - Zustand의 부분 업데이트 특성상 변경 불필요

단, `open()` 함수에서 `entryPoint`를 저장할 때 **튜토리얼 경로도 포함**해야 함:

```typescript
open: (videoUrl, entryPoint) => {
  if (videoUrl && videoUrl.trim().length > 0) {
    set({ isOpen: true, videoUrl, entryPoint: entryPoint || 'external_share' });
    return;
  }

  const { hasSeenTutorial } = get();
  if (!hasSeenTutorial) {
    // 튜토리얼 열 때도 entryPoint 저장 (나중에 openRecipeCreatingView에서 유지됨)
    set({ isTutorialOpen: true, videoUrl, entryPoint: entryPoint || 'floating_button' });
  } else {
    set({ isOpen: true, videoUrl, entryPoint: entryPoint || 'floating_button' });
  }
},
```

### 테스트 시나리오

| 시나리오 | 예상 entryPoint |
|---------|----------------|
| 플로팅 버튼 → 튜토리얼 → 직접 입력 | `floating_button` |
| 플로팅 버튼 → 튜토리얼 → 다시 보지 않기 | `floating_button` |
| 플로팅 버튼 → (튜토리얼 봄) → 바로 모달 | `floating_button` |
| 딥링크 (videoUrl 있음) | `external_share` |
| 빈 카드 클릭 → 튜토리얼 → 직접 입력 | `floating_button` |

---

## 3단계 주의사항: onError videoType 체크 로직

### 문제 상황

현재 `useUserRecipe.ts`의 `onError` 콜백:

```typescript
// line 275-293
onError: (error, _vars, ctx) => {
  handleOpenToast({
    toastInfo: {
      status: RecipeCreateToastStatus.FAILED,
      errorMessage: `url 주소 : ${_vars.youtubeUrl} 레시피 생성에 실패했어요`,
    },
  });

  // 문제 부분
  if (!_vars.videoType) {
    console.log("videoType is not found");
    throw new Error("videoType is required");  // URL 경로에서 항상 에러!
  }

  if (ctx?.prevList) {
    rollbackIsViewed(queryClient, { prevList: ctx.prevList }, _vars.videoType);
  }
},
```

### 현재 create() 호출 패턴 분석

| 파일 | 경로 | videoType 전달 | rollback 필요 |
|------|------|---------------|--------------|
| `recipeCardWrapper.tsx` | 카드 (popular, theme) | ✅ 전달함 | ✅ 필요 |
| `recipeCreatingView.tsx` | URL | ❌ 전달 안함 | ❌ 불필요 |
| `search-results/ui/index.tsx` | 카드 (search_result) | ❌ 전달 안함 | ❌ 불필요 |
| `search-recipe/ui/index.tsx` | 카드 (search_trend) | ❌ 전달 안함 | ❌ 불필요 |
| `category-results/ui/index.tsx` | 카드 (category) | ❌ 전달 안함 | ❌ 불필요 |

### 왜 일부만 videoType을 전달하는가?

**`recipeCardWrapper.tsx`만 videoType 전달하는 이유:**

```typescript
// recipeCardWrapper.tsx (line 68-74)
create({
  youtubeUrl: recipe.videoUrl,
  targetCategoryId: null,
  recipeId: recipe.recipeId,      // 기존 레시피 ID
  videoType: recipe.videoType,    // Optimistic Update용
  recipeTitle: recipe.recipeTitle,
});
```

- `recipeId`가 있으면 → `onMutate`에서 `patchIsViewedOptimistically()` 실행
- 실패 시 → `onError`에서 `rollbackIsViewed()` 필요
- 따라서 `videoType` 필수

**다른 컴포넌트들이 videoType 전달하지 않는 이유:**

```typescript
// search-results, search-recipe, category-results
create({ youtubeUrl: `https://www.youtube.com/watch?v=${videoId}` });
```

- `recipeId` 전달 안함 → Optimistic Update 없음
- 실패해도 rollback 불필요
- `videoType` 불필요

### 현재 코드의 문제점

```typescript
// onError
if (!_vars.videoType) {
  throw new Error("videoType is required");  // 항상 에러 발생!
}
```

**현재 동작 분석**:

```typescript
// onError (line 275-293)
onError: (error, _vars, ctx) => {
  handleOpenToast({ ... });  // 1. 토스트 표시

  if (!_vars.videoType) {
    console.log("videoType is not found");
    throw new Error("videoType is required");  // 2. 여기서 throw!
  }

  if (ctx?.prevList) {  // 3. throw 때문에 여기까지 도달 못함
    rollbackIsViewed(...);
  }
},
```

**왜 앱이 죽지 않는가?**

```typescript
// line 263
throwOnError: false,  // 에러가 외부로 전파되지 않음
```

`throwOnError: false` 설정으로 인해 `onError` 내부에서 throw해도 앱이 죽지 않고 콘솔에만 로그가 남습니다.

**하지만 문제점**:

- URL 경로 실패 시 `throw` 이후 코드가 실행되지 않음
- Amplitude 이벤트 추가 시 이벤트가 전송되지 않는 문제 발생
- 코드 의도와 실제 동작이 불일치

### 해결 방안

**방안 A: 현재 로직 유지 + throw 제거 (권장)**

```typescript
onError: (error, _vars, ctx) => {
  // 토스트 표시
  handleOpenToast({
    toastInfo: {
      status: RecipeCreateToastStatus.FAILED,
      errorMessage: `url 주소 : ${_vars.youtubeUrl} 레시피 생성에 실패했어요`,
    },
  });

  // rollback (카드 경로 + Optimistic Update 있을 때만)
  if (ctx?.prevList && _vars.videoType) {
    rollbackIsViewed(queryClient, { prevList: ctx.prevList }, _vars.videoType);
  }

  // Amplitude 이벤트 (추가될 부분)
  if (_vars._creationMethod) {
    const duration = _vars._startTime ? Date.now() - _vars._startTime : 0;

    if (_vars._creationMethod === 'card') {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_CARD, {
        source: _vars._source,
        error_type: getErrorType(error),
        error_message: error.message,
        duration_ms: duration,
      });
    } else {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_URL, {
        entry_point: _vars._entryPoint,
        error_type: getErrorType(error),
        error_message: error.message,
        duration_ms: duration,
      });
    }
  }
},
```

**변경 사항:**
1. `throw new Error("videoType is required")` 제거
2. rollback 조건을 `ctx?.prevList && _vars.videoType`으로 변경
3. Amplitude 이벤트는 `_creationMethod`로 분기

**방안 B: _creationMethod로 완전 분기**

```typescript
onError: (error, _vars, ctx) => {
  handleOpenToast({ ... });

  // 카드 경로: rollback 필요
  if (_vars._creationMethod === 'card') {
    if (ctx?.prevList && _vars.videoType) {
      rollbackIsViewed(queryClient, { prevList: ctx.prevList }, _vars.videoType);
    }

    if (_vars._startTime) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_CARD, { ... });
    }
  }
  // URL 경로: rollback 불필요
  else if (_vars._creationMethod === 'url') {
    if (_vars._startTime) {
      track(AMPLITUDE_EVENT.RECIPE_CREATE_FAIL_URL, { ... });
    }
  }
  // 기존 호출 (Amplitude 미적용): 아무것도 안함
},
```

### 권장 결정

**방안 A 채택** - 기존 로직 최소 변경

핵심 변경:
1. `throw new Error` 제거
2. rollback 조건에 `_vars.videoType` 체크 추가
3. Amplitude 이벤트는 `_creationMethod` 존재 여부로 분기

### 하위 호환성

| 호출 패턴 | _creationMethod | 동작 |
|----------|-----------------|------|
| 기존 코드 (Amplitude 미적용) | `undefined` | 토스트만 표시, 이벤트 없음 |
| 카드 경로 (Amplitude 적용) | `'card'` | 토스트 + rollback + 이벤트 |
| URL 경로 (Amplitude 적용) | `'url'` | 토스트 + 이벤트 |

---

## 구현 체크리스트

### 1단계: entryPoint 상태 관리 ✅ 완료

- [x] `recipeCreatingViewOpenStore.ts`
  - [x] `EntryPoint` 타입 export 추가
  - [x] interface에 `entryPoint: EntryPoint` 상태 추가
  - [x] `open()` 함수 시그니처: `(videoUrl: string, entryPoint?: EntryPoint) => void`
  - [x] `open()` 함수 내부에서 entryPoint 저장 (튜토리얼 경로 포함)
  - [x] `close()` 함수에서 `entryPoint: null` 초기화
  - [x] `openRecipeCreatingView()`는 변경 불필요 (Zustand 부분 업데이트로 자동 유지)

- [x] `floatingButton.tsx`
  - [x] `open("")` → `open("", "floating_button")`

- [x] `_app.tsx`
  - [x] line 86: `open(info.videoUrl)` → `open(info.videoUrl, "external_share")`
  - [x] line 113: `open(info.videoUrl)` → `open(info.videoUrl, "external_share")`

- [x] `userRecipeCard.tsx`
  - [x] `open("")` → `open("", "floating_button")`

### 2단계: category-results isViewed 체크 ✅ 완료

- [x] `category-results/ui/index.tsx`
  - [x] `CuisineRecipeCardReady`: isViewed 체크 추가 (본 레시피 → 상세 페이지, 안 본 레시피 → 다이얼로그)
  - [x] `RecommendRecipeCardReady`: 동일하게 isViewed 체크 추가

### 3단계: useUserRecipe 확장 ✅ 완료 (기반 작업)

- [x] `useUserRecipe.ts`
  - [x] 파라미터 타입에 추적용 필드 추가 (`_startTime`, `_source`, `_entryPoint`, `_creationMethod`, `_hasTargetCategory`)
  - [x] `onError`에서 `throw new Error("videoType is required")` 제거
  - [x] `onError` rollback 조건을 `ctx?.prevList && _vars.videoType`으로 변경
  - [ ] `onSuccess`에 Amplitude 이벤트 분기 추가 → **4단계에서 구현**
  - [ ] `onError`에 Amplitude 이벤트 분기 추가 → **4단계에서 구현**
  - [ ] `getErrorType()` 헬퍼 함수 추가 → **4단계에서 구현**

---

## 구현 완료 요약

### 변경된 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `recipeCreatingViewOpenStore.ts` | `EntryPoint` 타입, `entryPoint` 상태, `open()` 시그니처 확장, `close()` 초기화 |
| `floatingButton.tsx` | `open("", "floating_button")` |
| `userRecipeCard.tsx` | `open("", "floating_button")` |
| `_app.tsx` | `open(info.videoUrl, "external_share")` (2곳) |
| `category-results/ui/index.tsx` | `CuisineRecipeCardReady`, `RecommendRecipeCardReady`에 isViewed 체크 추가 |
| `useUserRecipe.ts` | 추적용 타입 추가, onError throw 제거 및 조건 변경 |

### TypeScript 타입 체크
- ✅ 통과 (`npx tsc --noEmit` 에러 없음)

### 다음 단계
- **4단계**: Amplitude 이벤트 구현 (onSuccess, onError에 이벤트 전송 로직 추가)

---

## 테스트 계획

### 1단계 테스트

| 테스트 케이스 | 검증 항목 |
|-------------|----------|
| 플로팅 버튼 클릭 (튜토리얼 안봄) | 튜토리얼 표시, entryPoint='floating_button' 저장 |
| 튜토리얼에서 "직접 입력" 클릭 | 모달 열림, entryPoint='floating_button' 유지 |
| 플로팅 버튼 클릭 (튜토리얼 봄) | 바로 모달 열림, entryPoint='floating_button' |
| 딥링크 진입 | 모달 열림, entryPoint='external_share' |
| 빈 카드 클릭 | 튜토리얼/모달 열림, entryPoint='floating_button' |

### 2단계 테스트

| 테스트 케이스 | 검증 항목 |
|-------------|----------|
| 카테고리 페이지에서 안 본 레시피 클릭 | 생성 다이얼로그 표시 |
| 카테고리 페이지에서 본 레시피 클릭 | 상세 페이지로 이동 |

### 3단계 테스트

| 테스트 케이스 | 검증 항목 |
|-------------|----------|
| 카드 경로 성공 | 토스트 + 캐시 무효화 + (이벤트 전송 - 4단계) |
| 카드 경로 실패 (videoType 있음) | 토스트 + rollback + (이벤트 전송) |
| URL 경로 성공 | 토스트 + 캐시 무효화 + (이벤트 전송) |
| URL 경로 실패 | 토스트만 (rollback 없음) + (이벤트 전송) |
| 기존 코드 호출 (Amplitude 미적용) | 기존 동작 유지 |
