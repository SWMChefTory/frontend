# 쿠팡 모달 Amplitude 이벤트 추적 문서

## 개요

쿠팡 파트너스 모달에서 사용자가 어떻게 상품을 탐색하고, 클릭하여 구매로 이어지는지 추적합니다. 매출과 직결되는 핵심 퍼널이므로 정확한 데이터 수집이 중요합니다. 총 3개의 이벤트로 모달 진입부터 이탈까지의 전체 사용자 여정을 추적합니다.

---

## 이벤트 목록

| 이벤트 이름 | 설명 | 발생 시점 | 우선순위 |
|------------|------|----------|---------|
| `coupang_modal_open` | 모달 열림 | 재료 구매 배너 클릭 시 | 🔴 High |
| `coupang_product_click` | 상품 클릭 | 상품 카드 클릭 시 (쿠팡앱 이동 직전) | 🔴 High |
| `coupang_modal_close` | 모달 닫힘 | 모달 종료 시 (집계 이벤트) | 🟡 Medium |

---

## 이벤트 속성 (Attributes)

### 1. Modal Open 이벤트 (`coupang_modal_open`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `ingredient_count` | number | 전체 재료 수 | `8` |

**진입 경로**:

현재 유일한 진입 경로는 "재료 탭의 재료 구매 배너" 클릭입니다.

> 향후 다른 진입 경로 추가 시 `source` 속성 추가 검토

### 2. Product Click 이벤트 (`coupang_product_click`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `ingredient_name` | string | 재료명 (검색 키워드) | `"양파"` |
| `product_id` | string | 쿠팡 상품 ID | `"123456789"` |
| `product_name` | string | 상품명 | `"국내산 양파 1kg"` |
| `price` | number | 상품 가격 | `5900` |
| `is_rocket` | boolean | 로켓배송 여부 | `true`, `false` |
| `position` | number | 상품 목록 내 위치 (0-indexed) | `0` |

### 3. Modal Close 이벤트 (`coupang_modal_close`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `products_displayed` | number | 표시된 상품 수 | `12` |
| `products_clicked` | number | 클릭한 상품 수 | `2` |
| `clicked_products` | string[] | 클릭한 상품 ID 배열 | `["123", "456"]` |
| `duration_seconds` | number | 모달 체류 시간 (초) | `45` |

**모달 닫힘 시나리오**:

| 시나리오 | 추적 가능 여부 | 설명 |
|---------|---------------|------|
| Backdrop 클릭 | ✅ 가능 | 모달 외부 영역 클릭 |
| X 버튼 클릭 | ✅ 가능 | 닫기 버튼 클릭 |
| 뒤로가기 | ✅ 가능 | 브라우저/앱 뒤로가기 |
| 상품 클릭 후 이탈 | ✅ 가능 | 쿠팡앱으로 이동 |

---

## 분석 가능한 데이터 및 지표

### 1. 전환율 (Conversion Rates)

#### 메인 퍼널

```text
recipe_detail_view [tab=ingredients] (100%)
         ↓
  coupang_modal_open (X%)
         ↓
 coupang_product_click (Y%)
         ↓
  coupang_modal_close
```

**측정 가능 지표**:

- **모달 진입률** = `coupang_modal_open` / `recipe_detail_view`
- **상품 클릭률** = `coupang_product_click` 발생 세션 / `coupang_modal_open`
- **클릭 없이 이탈률** = `products_clicked: 0`인 비율

### 2. 참여도 지표 (Engagement Metrics)

**체류 시간 분석**:

- 평균 체류 시간 (`duration_seconds` 평균)
- 체류 시간 분포 (0-15초, 15-30초, 30초-1분, 1분 이상)
- 상품 클릭한 사용자 vs 이탈 사용자의 체류 시간 비교

**클릭 패턴 분석**:

- 평균 클릭 수 (`products_clicked` 평균)
- 다중 클릭 비율 (`products_clicked >= 2` 비율)
- 상품 위치별 클릭 분포 (`position` 분석)

### 3. 사용자 행동 인사이트

#### 재료/상품 선호도 분석

| 분석 항목 | 활용 데이터 |
|----------|------------|
| 인기 재료 TOP 10 | `ingredient_name` 집계 |
| 로켓배송 선호율 | `is_rocket: true` 비율 |
| 가격대별 클릭률 | `price` 구간별 분포 |
| 상품 위치별 클릭률 | `position` 분포 |

#### 이탈 패턴 분석

| 분석 항목 | 활용 데이터 |
|----------|------------|
| 클릭 없이 이탈률 | `products_clicked: 0` 비율 |
| 상품 로딩 실패율 | `products_displayed: 0` 비율 |
| 빠른 이탈 (0-5초) | `duration_seconds < 5` 비율 |

### 4. 세그먼트 분석

**고전환 세그먼트**:

- 여러 상품 클릭 (`products_clicked >= 2`)
- 긴 체류 시간 (`duration_seconds > 30`)
- 로켓배송 상품 클릭

**저전환 세그먼트**:

- 클릭 없이 이탈 (`products_clicked = 0`)
- 빠른 이탈 (`duration_seconds < 5`)
- 상품 로딩 실패 (`products_displayed = 0`)

---

## 활용 시나리오

### 매출 최적화

| 인사이트 | 개선 액션 |
|----------|----------|
| 클릭 없이 이탈률 높음 | 상품 추천 알고리즘 개선, UI 개선 |
| 특정 재료 클릭률 높음 | 해당 재료 상품 노출 강화 |
| 로켓배송 선호도 높음 | 로켓배송 상품 상단 노출 |
| 저가 상품 선호 | 가격순 정렬 옵션 추가 |

### 제품 최적화

| 인사이트 | 개선 액션 |
|----------|----------|
| 상품 로딩 실패율 높음 | API 안정성 개선, 폴백 UI 추가 |
| 평균 체류 시간 짧음 | 상품 정보 가시성 개선 |
| 첫 번째 상품만 클릭 | 스크롤 유도 UI 추가 |

### 콘텐츠 전략

| 인사이트 | 콘텐츠 액션 |
|----------|------------|
| 인기 재료 분석 | 해당 재료 레시피 콘텐츠 강화 |
| 가격대별 선호도 | 가격대에 맞는 상품 큐레이션 |

---

## 주요 지표 요약

| 지표 | 계산 방법 | 목적 |
|-----|----------|------|
| 모달 진입률 | `coupang_modal_open` / `recipe_detail_view` | 배너 효과 측정 |
| 상품 클릭률 | `product_click` 발생 세션 / `modal_open` | 전환 효율 측정 |
| 평균 클릭 수 | `AVG(products_clicked)` | 사용자 참여도 |
| 클릭 없이 이탈률 | `products_clicked = 0` 비율 | 이탈 원인 파악 |
| 평균 체류 시간 | `AVG(duration_seconds)` | 사용자 관심도 |
| 로켓배송 선호율 | `is_rocket = true` 비율 | 배송 선호도 |
| 상품 로딩 실패율 | `products_displayed = 0` 비율 | 기술 품질 |

---

## 주요 분석 질문

1. **모달 진입률**: 재료 탭에서 쿠팡 배너를 클릭하는 비율은?
2. **상품 클릭률**: 모달 진입 후 실제 상품을 클릭하는 비율은?
3. **클릭 없이 이탈률**: 상품을 보고도 클릭하지 않는 비율은?
4. **평균 클릭 수**: 사용자당 평균 몇 개의 상품을 클릭하는가?
5. **인기 재료**: 가장 많이 클릭되는 재료는 무엇인가?
6. **로켓배송 선호도**: 로켓배송 상품의 클릭 비율은?
7. **가격 vs 클릭**: 가격대별 클릭률 상관관계는?
8. **상품 위치 효과**: 상단 상품이 더 많이 클릭되는가?
9. **평균 체류 시간**: 사용자가 모달에서 평균 얼마나 머무는가?
10. **상품 로딩 실패율**: API 오류로 상품이 표시되지 않는 비율은?

---

## 기존 이벤트와의 관계

| 시나리오 | 발생 이벤트 |
|---------|-----------|
| 레시피 상세 진입 | `recipe_detail_view` |
| 재료 탭 클릭 | `recipe_detail_tab_click` (tab=ingredients) |
| 재료 구매 배너 클릭 | `coupang_modal_open` |
| 상품 클릭 | `coupang_product_click` (반복 가능) |
| 모달 닫힘 | `coupang_modal_close` |
| 레시피 상세 이탈 | `recipe_detail_exit` |

---

## 사용자 여정 추적

```text
recipe_detail_view
        ↓
recipe_detail_tab_click [tab=ingredients]
        ↓
coupang_modal_open
        ↓
coupang_product_click (0회 이상)
        ↓
coupang_modal_close
        ↓
recipe_detail_exit
```

모든 단계가 적절한 속성과 함께 기록되며, `coupang_modal_close` 이벤트에서 전체 모달 세션 요약이 수집됩니다.

---

## 문서 참조

- 상세 구현: [amplitude-coupang-implementation.md](./amplitude-coupang-implementation.md)
- 이벤트 상수: `webview-v2/src/shared/analytics/amplitudeEvents.ts`
