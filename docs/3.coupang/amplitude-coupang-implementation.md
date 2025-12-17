# 쿠팡 모달 Amplitude 이벤트 구현 가이드

## 목차

1. [개요](#개요)
2. [이벤트 목록](#이벤트-목록)
3. [이벤트별 상세 정의](#이벤트별-상세-정의)
4. [구현 방법](#구현-방법)
5. [분석 가능 지표](#분석-가능-지표)

---

## 개요

### 목적

쿠팡 파트너스 모달에서 사용자가 어떻게 상품을 탐색하고, 클릭하여 구매로 이어지는지 추적합니다.
매출과 직결되는 핵심 퍼널이므로 정확한 데이터 수집이 중요합니다.

### 핵심 측정 목표

1. **모달 진입률**: 재료 탭에서 쿠팡 배너를 클릭하는 비율
2. **상품 클릭률**: 모달 진입 후 실제 상품을 클릭하는 비율
3. **클릭 패턴**: 어떤 재료/상품이 많이 클릭되는지, 평균 클릭 수

### 이벤트 설계 원칙

- **매출 전환 추적**: 쿠팡 앱으로 이동하는 클릭을 정확히 추적
- **이탈 분석**: 클릭 없이 이탈하는 비율과 패턴 파악
- **집계 데이터**: 모달 닫힘 시 세션 전체 행동을 요약

### 현재 모달 구조

```text
RecipeDetailPageReady (index.tsx)
└── IngredientPurchaseModal (IngredientPurchaseModal.tsx)
    ├── Backdrop (fixed, z-index: 1000) ← 클릭 시 닫힘
    └── Modal (fixed, z-index: 1001)
        ├── X 버튼 ← 클릭 시 닫힘
        └── 상품 목록
            └── <a> 태그 ← 클릭 시 쿠팡 이동
```

**진입 경로**: 재료 탭의 "재료 구매 배너" 클릭 (`index.tsx:801`)
- 현재 유일한 진입 경로이므로 `source` 속성 불필요

**모달 닫힘 시나리오**:
| 시나리오 | 추적 가능 여부 | 설명 |
|---------|---------------|------|
| Backdrop 클릭 | ✅ 가능 | `handleClose` 호출 |
| X 버튼 클릭 | ✅ 가능 | `handleClose` 호출 |
| 다른 탭 클릭 | N/A | 모달이 화면을 가려서 탭 클릭 불가 |
| 뒤로가기 | ✅ 가능 | `useEffect` cleanup에서 처리 |
| 상품 클릭 후 이탈 | ✅ 가능 | `useEffect` cleanup에서 처리 |

---

## 이벤트 목록

총 **3개 이벤트**로 쿠팡 모달 사용자 여정을 추적합니다.

| 순번 | 이벤트 이름 | 설명 | 우선순위 |
|------|------------|------|---------|
| 1 | `coupang_modal_open` | 모달 열림 | 🔴 High |
| 2 | `coupang_product_click` | 상품 클릭 (쿠팡앱 이동) | 🔴 High |
| 3 | `coupang_modal_close` | 모달 닫힘 (집계 이벤트) | 🟡 Medium |

---

## 이벤트별 상세 정의

### 1️⃣ `coupang_modal_open` - 모달 열림

**발생 시점**: 쿠팡 모달이 열릴 때 (재료 구매 배너 클릭)

**속성**:
```typescript
{
  recipe_id: string;        // 레시피 ID
  ingredient_count: number; // 전체 재료 수
}
```

> **참고**: `source` 속성 제거
> - 현재 진입 경로가 "재료 탭 배너"로 유일함
> - 향후 다른 진입 경로 추가 시 속성 추가 검토

**측정 목적**:
- 쿠팡 모달 진입률 = `coupang_modal_open` / `recipe_detail_view`
- 재료 수에 따른 진입률 상관관계

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

---

### 2️⃣ `coupang_product_click` - 상품 클릭

**발생 시점**: 상품 카드 클릭 시 (쿠팡 앱/웹으로 이동 직전)

**속성**:
```typescript
{
  recipe_id: string;        // 레시피 ID
  ingredient_name: string;  // 재료명 (검색 키워드)
  product_id: string;       // 쿠팡 상품 ID
  product_name: string;     // 상품명
  price: number;            // 상품 가격
  is_rocket: boolean;       // 로켓배송 여부
  position: number;         // 상품 목록 내 위치 (0부터 시작)
}
```

**데이터 소스 (API 응답에서 제공)**:
```typescript
// CoupangProduct 인터페이스 (API 응답)
interface CoupangProduct {
  productId: number;      // → product_id
  productName: string;    // → product_name
  productPrice: number;   // → price
  isRocket: boolean;      // → is_rocket ✅ API에서 제공
  // ...
}
```

**측정 목적**:
- 상품 클릭률 = `coupang_product_click` / `coupang_modal_open`
- 인기 재료 = `ingredient_name` 집계
- 로켓배송 선호도 = `is_rocket: true` 비율
- 가격 vs 클릭 상관관계

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

---

### 3️⃣ `coupang_modal_close` - 모달 닫힘

**발생 시점**:
- Backdrop 클릭
- X 버튼 클릭
- 뒤로가기 (브라우저/앱)
- 상품 클릭 후 페이지 이탈
- 컴포넌트 언마운트

**속성**:
```typescript
{
  recipe_id: string;           // 레시피 ID
  products_displayed: number;  // 표시된 상품 수
  products_clicked: number;    // 클릭한 상품 수
  clicked_products: string[];  // 클릭한 상품 ID 배열
  duration_seconds: number;    // 모달 체류 시간 (초)
}
```

**측정 목적**:
- 클릭 없이 이탈률 = `products_clicked: 0`인 비율
- 평균 클릭 수 = `products_clicked` 평균
- 평균 체류 시간 = `duration_seconds` 평균
- 상품 로딩 실패율 = `products_displayed: 0`인 비율

**구현 위치**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

---

## 구현 방법

### 1. 이벤트 상수 추가

**파일**: `webview-v2/src/shared/analytics/amplitudeEvents.ts`

```typescript
export const enum AMPLITUDE_EVENT {
  // ... 기존 이벤트들 ...

  // ─────────────────────────────────────────────────────────────
  // 쿠팡 (Coupang)
  // 쿠팡 파트너스 모달에서의 사용자 행동 추적
  // @see /frontend/docs/3.coupang/amplitude-coupang-implementation.md
  // ─────────────────────────────────────────────────────────────

  /** 쿠팡 모달 열림 */
  COUPANG_MODAL_OPEN = "coupang_modal_open",

  /** 쿠팡 상품 클릭 (쿠팡앱 이동) */
  COUPANG_PRODUCT_CLICK = "coupang_product_click",

  /** 쿠팡 모달 닫힘 (집계 이벤트) */
  COUPANG_MODAL_CLOSE = "coupang_modal_close",
}
```

---

### 2. IngredientPurchaseModal Props 확장

**파일**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

**현재 Props**:
```typescript
interface IngredientPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
}
```

**확장된 Props**:
```typescript
interface IngredientPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredients: Ingredient[];
  recipeId: string;  // 🆕 추가
}
```

---

### 3. 추적용 상태 및 이벤트 로직 추가

**파일**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

#### Import 문 수정

**현재 코드 (line 2)**:
```typescript
import { useEffect, useState } from "react";
```

**수정 후**:
```typescript
import { useEffect, useRef, useState } from "react";  // 🆕 useRef 추가
```

**추가할 import**:
```typescript
import { track } from "@/src/shared/analytics/amplitude";
import { AMPLITUDE_EVENT } from "@/src/shared/analytics/amplitudeEvents";
```

#### 컴포넌트 구현

```typescript
export const IngredientPurchaseModal = ({
  open,
  onOpenChange,
  ingredients,
  recipeId,  // 🆕
}: IngredientPurchaseModalProps) => {
  const [products, setProducts] = useState<IngredientProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // 🆕 Amplitude 추적용 ref
  const modalOpenTime = useRef<number>(0);
  const clickedProducts = useRef<string[]>([]);
  const hasTrackedClose = useRef<boolean>(false);  // 중복 방지
  const productsDisplayedRef = useRef<number>(0);  // 🆕 클로저 이슈 해결용

  // 🆕 products 변경 시 ref 동기화 (클로저 이슈 해결)
  useEffect(() => {
    productsDisplayedRef.current = products.length;
  }, [products]);

  // 🆕 모달 닫힘 추적 함수
  const trackModalClose = () => {
    if (hasTrackedClose.current) return;  // 이미 추적했으면 무시
    hasTrackedClose.current = true;

    track(AMPLITUDE_EVENT.COUPANG_MODAL_CLOSE, {
      recipe_id: recipeId,
      products_displayed: productsDisplayedRef.current,  // 🆕 ref 사용 (클로저 이슈 해결)
      products_clicked: clickedProducts.current.length,
      clicked_products: clickedProducts.current,
      duration_seconds: Math.round((Date.now() - modalOpenTime.current) / 1000),
    });
  };

  // 🆕 모달 열림/닫힘 시 이벤트 처리
  useEffect(() => {
    if (open) {
      // 모달 열림: 초기화 및 open 이벤트
      modalOpenTime.current = Date.now();
      clickedProducts.current = [];
      hasTrackedClose.current = false;
      productsDisplayedRef.current = 0;  // 🆕 초기화

      track(AMPLITUDE_EVENT.COUPANG_MODAL_OPEN, {
        recipe_id: recipeId,
        ingredient_count: ingredients.length,
      });
    }

    // cleanup: 뒤로가기, 상품 클릭 후 이탈 등 모든 경우 처리
    return () => {
      if (open && !hasTrackedClose.current) {
        trackModalClose();
      }
    };
  }, [open, recipeId, ingredients.length]);

  // 🆕 상품 클릭 핸들러
  const handleProductClick = (product: IngredientProduct, index: number) => {
    clickedProducts.current.push(product.id);

    track(AMPLITUDE_EVENT.COUPANG_PRODUCT_CLICK, {
      recipe_id: recipeId,
      ingredient_name: product.name,
      product_id: product.id,
      product_name: product.description,
      price: product.price,
      is_rocket: product.isRocket ?? false,
      position: index,
    });
  };

  // 🆕 모달 닫힘 핸들러 (Backdrop, X 버튼용)
  const handleClose = () => {
    trackModalClose();
    onOpenChange(false);
  };

  // ... 기존 useEffect (API 호출) 유지 ...
```

---

### 4. 렌더링 부분 수정

**파일**: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

```typescript
return (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 bg-black/60 z-[1000] animate-in fade-in duration-200"
      onClick={handleClose}  // 🆕 수정
    />

    {/* Modal */}
    <div className="fixed inset-x-0 bottom-0 z-[1001] animate-in slide-in-from-bottom duration-300">
      <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative px-5 pt-6 pb-4 border-b border-gray-100">
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={handleClose}  // 🆕 수정
          >
            {/* X 아이콘 */}
          </button>
          {/* ... */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* ... loading, empty state ... */}

          {/* 상품 목록 */}
          <div className="space-y-3">
            {products.map((product, index) => (
              <a
                key={product.id}
                href={product.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="..."
                onClick={() => handleProductClick(product, index)}  // 🆕 추가
              >
                {/* ... 기존 내용 ... */}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);
```

---

### 5. 부모 컴포넌트에서 recipeId 전달

**파일**: `webview-v2/src/views/recipe-detail/ui/index.tsx`

```typescript
{/* Purchase Modal */}
<IngredientPurchaseModal
  open={purchaseModalOpen}
  onOpenChange={setPurchaseModalOpen}
  ingredients={ingredients}
  recipeId={id}  // 🆕 추가
/>
```

---

## 전체 변경 요약

| 파일 | 변경 내용 |
|-----|----------|
| `amplitudeEvents.ts` | 3개 이벤트 상수 추가 |
| `IngredientPurchaseModal.tsx` | import 수정 (`useRef` 추가), Props에 `recipeId` 추가, 추적용 ref 4개, useEffect 2개 추가, 핸들러 2개 |
| `index.tsx` | `IngredientPurchaseModal`에 `recipeId` prop 전달 |

### 클로저 이슈 해결 설명

**문제**: `trackModalClose` 함수가 useEffect cleanup에서 호출될 때, `products.length`가 stale closure로 인해 초기값(0)을 참조할 수 있음

**해결**: `productsDisplayedRef`를 추가하여 `products` 변경 시마다 ref를 동기화하고, `trackModalClose`에서는 ref 값을 사용

```text
products 변경 → useEffect → productsDisplayedRef.current 업데이트
                                      ↓
trackModalClose() 호출 시 → productsDisplayedRef.current 참조 (항상 최신값)
```

---

## 분석 가능 지표

### 퍼널 분석

```text
recipe_detail_view [tab=ingredients] (100%)
    ↓
coupang_modal_open (X%)
    ↓
coupang_product_click (Y%)
    ↓
coupang_modal_close [products_clicked > 0] (Y%)

* 이탈 분석: modal_close에서 products_clicked=0 비율 확인
```

### 주요 지표

| 지표 | 계산 방법 |
|-----|----------|
| 모달 진입률 | `coupang_modal_open` / `recipe_detail_view` |
| 상품 클릭률 | `coupang_product_click` 발생한 세션 / `coupang_modal_open` |
| 평균 클릭 수 | `modal_close.products_clicked` 평균 |
| 클릭 없이 이탈률 | `modal_close.products_clicked = 0` 비율 |
| 평균 체류 시간 | `modal_close.duration_seconds` 평균 |
| 로켓배송 선호율 | `product_click.is_rocket = true` 비율 |
| 인기 재료 TOP 10 | `product_click.ingredient_name` 집계 |

### 세그먼트 분석

**고전환 세그먼트**:
- 여러 상품 클릭 (`products_clicked >= 2`)
- 긴 체류 시간 (`duration_seconds > 30`)

**저전환 세그먼트**:
- 클릭 없이 이탈 (`products_clicked = 0`)
- 상품 로딩 실패 (`products_displayed = 0`)

---

## 구현 체크리스트

- [x] `amplitudeEvents.ts`에 3개 이벤트 상수 추가
- [x] `IngredientPurchaseModal.tsx` import 수정 (`useRef` 추가, amplitude 관련 import 추가)
- [x] `IngredientPurchaseModal.tsx` Props에 `recipeId` 추가
- [x] `IngredientPurchaseModal.tsx`에 추적용 ref 4개 추가 (`modalOpenTime`, `clickedProducts`, `hasTrackedClose`, `productsDisplayedRef`)
- [x] `products` 변경 시 `productsDisplayedRef` 동기화 useEffect 추가
- [x] `trackModalClose` 함수 구현 (중복 방지 + ref 사용)
- [x] `coupang_modal_open` 이벤트 구현 (useEffect에서)
- [x] `coupang_modal_close` 이벤트 구현 (useEffect cleanup + handleClose)
- [x] `coupang_product_click` 이벤트 구현 (상품 클릭 핸들러)
- [x] `index.tsx`에서 `recipeId` prop 전달
- [ ] 테스트 및 검증
- [ ] Amplitude 대시보드에서 이벤트 확인
