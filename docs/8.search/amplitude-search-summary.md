# 검색 Amplitude 이벤트 구현 요약

## 구현 개요

| 항목 | 내용 |
|-----|------|
| 구현일 | 2025-12-17 |
| 이벤트 수 | 3개 |
| 변경 파일 | 4개 |
| TypeScript 컴파일 | ✅ 통과 |

---

## 구현된 이벤트 목록

| # | 이벤트명 | 설명 | 속성 |
|---|---------|------|------|
| 1 | `search_executed` | 검색 실행 | `keyword`, `search_method` |
| 2 | `search_results_view` | 검색 결과 조회 | `keyword`, `result_count` |
| 3 | `search_result_click` | 검색 결과 클릭 | `keyword`, `position`, `recipe_id`, `is_registered`, `video_type` |

---

## 이벤트 상세

### 1. `search_executed`

**트리거 시점**: 사용자가 검색을 실행할 때

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 (예: "김치찌개") |
| `search_method` | string | 검색 방식 |

**search_method 값 설명**:

| search_method | 설명 | 트리거 위치 |
|---------------|------|------------|
| `direct` | Enter 키로 직접 검색 | 검색창에서 Enter 입력 |
| `autocomplete` | 자동완성 항목 선택 | 자동완성 드롭다운 항목 클릭 |
| `recent` | 최근 검색어 선택 | 최근 검색어 칩 클릭 |
| `popular` | 인기 검색어 선택 | 인기 검색어 항목 클릭 |

---

### 2. `search_results_view`

**트리거 시점**: 검색 결과 페이지에서 데이터 로드 완료 시 (1회만)

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 |
| `result_count` | number | 총 검색 결과 수 |

**중복 방지**: `useRef(hasTrackedView)`로 동일 검색어에 대해 1회만 이벤트 발생

---

### 3. `search_result_click`

**트리거 시점**: 검색 결과에서 레시피 카드 클릭 시

**속성**:

| 속성 | 타입 | 설명 |
|-----|------|------|
| `keyword` | string | 검색어 |
| `position` | number | 클릭 위치 (1-based) |
| `recipe_id` | string | 레시피 ID |
| `is_registered` | boolean | 이미 등록된 레시피 여부 |
| `video_type` | string | "NORMAL" 또는 "SHORTS" |

---

## 이벤트 흐름도

```
검색 페이지
  ├─ 검색창
  │   ├─ Enter 키 입력 ──────────► search_executed (direct)
  │   └─ 자동완성 클릭 ──────────► search_executed (autocomplete)
  └─ 검색 오버레이
      ├─ 최근검색어 클릭 ────────► search_executed (recent)
      └─ 인기검색어 클릭 ────────► search_executed (popular)
                │
                ▼
검색 결과 페이지
  ├─ 데이터 로드 완료 ──────────► search_results_view (1회)
  └─ 레시피 카드 클릭
      ├─ 모든 카드 ───────────────► search_result_click
      └─ 미등록 레시피 ───────────► RECIPE_CREATE_START_CARD (추가)
```

---

## 분석 가능 지표

### 퍼널 분석

```
search_executed (100%)
       │
       ▼
search_results_view (~95%)  ← 검색 완료율
       │
       ▼
search_result_click (~40%)  ← 검색 CTR
```

### 핵심 지표

| 지표 | 계산 방법 |
|-----|----------|
| 검색 완료율 | `search_results_view` / `search_executed` × 100 |
| 검색 CTR | `search_result_click` / `search_results_view` × 100 |
| 자동완성 사용률 | `search_method="autocomplete"` / 전체 `search_executed` × 100 |
| 인기검색어 사용률 | `search_method="popular"` / 전체 `search_executed` × 100 |
| 평균 클릭 위치 | `AVG(position)` from `search_result_click` |
| 미등록 레시피 클릭률 | `is_registered=false` / 전체 `search_result_click` × 100 |

---

## 기존 이벤트와의 관계

| 시나리오 | 발생 이벤트 |
|---------|-----------|
| 검색 실행 | `search_executed` |
| 검색 결과 로드 | `search_results_view` |
| 등록된 레시피 클릭 | `search_result_click` → `recipe_detail_view` |
| 미등록 레시피 클릭 | `search_result_click` → `RECIPE_CREATE_START_CARD` |
| 레시피 생성 확정 | `RECIPE_CREATE_SUBMIT_CARD` |

> **주의**: `search_result_click`은 모든 카드 클릭에서 발생하고, `RECIPE_CREATE_START_CARD`는 미등록 레시피 클릭에서만 추가로 발생합니다.

---

## 문서 참조

- 구현 계획: [amplitude-search-implementation.md](./amplitude-search-implementation.md)
- 이벤트 상수: `webview-v2/src/shared/analytics/amplitudeEvents.ts`
- Amplitude 유틸리티: `webview-v2/src/shared/analytics/amplitude.ts`
