# Amplitude 이벤트 설계 문서

## 1. 개요

Cheftory 앱의 사용자 행동 분석을 위한 이벤트 설계 문서입니다.
각 이벤트는 비즈니스 질문에 답할 수 있도록 설계되었습니다.

### 이벤트 요약

| 카테고리 | 이벤트 수 |
|----------|----------|
| 레시피 생성 | 4개 |
| 레시피 상세 | 2개 |
| 쿠팡 | 4개 |
| 요리(조리) | 4개 |
| 타이머 | 5개 |
| 음성 명령 | 2개 |
| 영상 제어 | 3개 |
| 검색 | 3개 |
| 홈 & 탐색 | 3개 |
| 카테고리 관리 | 3개 |
| 온보딩/튜토리얼 | 7개 |
| 설정 & 계정 | 4개 |
| 인증 (Native) | 4개 |
| **총계** | **48개** |

---

## 2. 핵심 비즈니스 질문 & 측정 지표

| 질문 | 측정 지표 | 필요 이벤트 |
|------|----------|-------------|
| 레시피를 얼마나 만드는가? | 총 레시피 생성 수 | `recipe_create_success` |
| 인당 레시피 생성율은? | 생성 수 / 사용자 수 | `recipe_create_success` (사용자별 집계) |
| 요약/재료/레시피 확인율은? | 탭별 조회 비율 | `recipe_detail_tab_view` |
| 쿠팡으로 넘어가는 비율은? | 쿠팡 클릭 / 재료 탭 조회 | `coupang_modal_open`, `coupang_product_click` |
| 요리 시작 비율은? | 조리 시작 / 레시피 상세 조회 | `cooking_start` |
| 요리 중 기능 사용율은? | 타이머/음성/단계이동 사용 | `timer_*`, `voice_*`, `step_navigate` |
| 카테고리 선택율은? | 카테고리 지정 비율 | `recipe_create_success` + `has_category` |
| 유튜브 vs 앱 내 생성 비율은? | 생성 경로별 비율 | `recipe_create_success` + `source` |

---

## 3. 이벤트 상세 설계

### 3.1 레시피 생성 이벤트

#### `recipe_create_start`

레시피 생성 모달 오픈 시점

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `source` | string | 생성 진입 경로 | `youtube_share`, `direct_input`, `floating_button` |

#### `recipe_create_submit`

생성 버튼 클릭 시점

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `source` | string | 생성 경로 | `youtube_share`, `direct_input` |
| `has_category` | boolean | 카테고리 선택 여부 | `true`, `false` |
| `category_id` | string? | 선택한 카테고리 ID | `cat_123` |

#### `recipe_create_success`

레시피 생성 완료 시점

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 생성된 레시피 ID | `rec_456` |
| `source` | string | 생성 경로 | `youtube_share`, `direct_input` |
| `has_category` | boolean | 카테고리 선택 여부 | `true`, `false` |
| `category_id` | string? | 선택한 카테고리 ID | `cat_123` |

#### `recipe_create_fail`

레시피 생성 실패 시점

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `error_type` | string | 에러 유형 | `invalid_url`, `server_error`, `timeout` |
| `source` | string | 생성 경로 | `youtube_share`, `direct_input` |

---

### 3.2 레시피 상세 이벤트

#### `recipe_detail_view`

레시피 상세 페이지 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `entry_point` | string | 진입 경로 | `home`, `search`, `category`, `my_recipes` |

#### `recipe_detail_tab_view`

레시피 상세 내 탭 조회

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `tab_name` | string | 탭 이름 | `summary`, `ingredients`, `steps` |

---

### 3.3 쿠팡 이벤트

#### `coupang_modal_open`

쿠팡 재료 구매 모달 오픈

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `ingredient_count` | number | 재료 개수 | `5` |

#### `coupang_product_view`

쿠팡 상품 목록 로드 완료

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `product_count` | number | 로드된 상품 수 | `4` |

#### `coupang_product_click`

쿠팡 상품 클릭 (쿠팡 페이지로 이동)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `ingredient_name` | string | 재료명 | `양파` |
| `product_id` | number | 쿠팡 상품 ID | `12345678` |
| `price` | number | 상품 가격 | `5900` |
| `is_rocket` | boolean | 로켓배송 여부 | `true` |

#### `coupang_modal_close`

쿠팡 모달 닫기

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `products_clicked` | number | 클릭한 상품 수 | `2` |

---

### 3.4 요리(조리) 이벤트

#### `cooking_start`

핸즈프리 모드 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `total_steps` | number | 전체 단계 수 | `8` |

#### `cooking_complete`

요리 완료 (마지막 단계 도달)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `total_steps` | number | 전체 단계 수 | `8` |
| `duration_seconds` | number | 총 소요 시간 (초) | `1800` |

#### `cooking_exit`

요리 중간 이탈

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `current_step` | number | 이탈 시점 단계 | `3` |
| `total_steps` | number | 전체 단계 수 | `8` |
| `duration_seconds` | number | 체류 시간 (초) | `300` |

#### `step_navigate`

단계 이동

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `from_step` | number | 이전 단계 | `2` |
| `to_step` | number | 이동한 단계 | `3` |
| `method` | string | 이동 방법 | `touch`, `voice`, `auto` |

---

### 3.5 타이머 이벤트

#### `timer_start`

타이머 시작

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `timer_id` | string | 타이머 ID | `timer_789` |
| `timer_name` | string | 타이머 이름 | `끓이기` |
| `duration_seconds` | number | 설정 시간 (초) | `180` |

#### `timer_pause`

타이머 일시 중지

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `timer_id` | string | 타이머 ID | `timer_789` |
| `remaining_seconds` | number | 남은 시간 (초) | `120` |

#### `timer_resume`

타이머 재개

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `timer_id` | string | 타이머 ID | `timer_789` |
| `remaining_seconds` | number | 남은 시간 (초) | `120` |

#### `timer_complete`

타이머 정상 종료

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `timer_id` | string | 타이머 ID | `timer_789` |
| `recipe_id` | string | 레시피 ID | `rec_456` |

#### `timer_cancel`

타이머 취소

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `timer_id` | string | 타이머 ID | `timer_789` |
| `remaining_seconds` | number | 남은 시간 (초) | `60` |

---

### 3.6 음성 명령 이벤트

#### `voice_mic_toggle`

마이크 활성화/비활성화

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `action` | string | 동작 | `on`, `off` |

#### `voice_command_used`

음성 명령 인식 및 실행

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `command_type` | string | 명령 유형 | `next_step`, `prev_step`, `timer_start`, `timer_stop` |

---

### 3.7 영상 제어 이벤트

#### `video_play`

영상 재생

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `trigger` | string | 재생 트리거 | `touch`, `voice` |

#### `video_pause`

영상 일시정지

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `current_time` | number | 현재 재생 시간 (초) | `120` |

#### `video_seek`

영상 특정 시간으로 이동 (단계 클릭 시)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `from_time` | number | 이전 시간 (초) | `60` |
| `to_time` | number | 이동한 시간 (초) | `180` |
| `trigger` | string | 이동 트리거 | `step_click`, `voice` |

---

### 3.8 검색 이벤트

#### `search_start`

검색 페이지 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `search_submit`

검색 실행

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `keyword` | string | 검색어 | `김치찌개` |

#### `search_result_click`

검색 결과 클릭

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `keyword` | string | 검색어 | `김치찌개` |
| `recipe_id` | string | 클릭한 레시피 ID | `rec_456` |
| `position` | number | 결과 순위 | `3` |

---

### 3.9 홈 & 탐색 이벤트

#### `home_view`

홈 화면 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `popular_recipe_click`

인기 레시피 클릭

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `position` | number | 노출 순위 | `2` |
| `section` | string | 섹션 | `popular`, `shorts`, `theme` |

#### `category_select`

카테고리 선택

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `category_id` | string | 카테고리 ID | `cat_123` |
| `category_name` | string | 카테고리 이름 | `한식` |

---

### 3.10 카테고리 관리 이벤트

#### `category_create`

카테고리 생성

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `category_name` | string | 카테고리 이름 | `다이어트` |

#### `category_delete`

카테고리 삭제

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `category_id` | string | 카테고리 ID | `cat_123` |

#### `recipe_category_change`

레시피 카테고리 변경 (긴 터치로 변경)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |
| `from_category` | string? | 이전 카테고리 ID | `cat_123` |
| `to_category` | string? | 변경된 카테고리 ID | `cat_456` |

---

### 3.11 온보딩/튜토리얼 이벤트

#### `tutorial_share_view`

레시피 생성 튜토리얼 모달 표시

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `device_type` | string | 디바이스 유형 | `ios`, `android` |

#### `tutorial_share_youtube_click`

"생성하러 가기" 버튼 클릭 (YouTube 앱으로 이동)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `tutorial_share_direct_click`

"직접 입력하기" 버튼 클릭

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `tutorial_share_dismiss`

"다시 보지 않기" 버튼 클릭

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `tutorial_step_start`

핸즈프리 모드 튜토리얼 시작

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |

#### `tutorial_step_complete`

핸즈프리 모드 튜토리얼 완료

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `recipe_id` | string | 레시피 ID | `rec_456` |

#### `floating_button_tooltip_view`

플로팅 버튼 툴팁 표시 (첫 방문 시)

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

---

### 3.12 설정 & 계정 이벤트

#### `settings_view`

설정 페이지 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `terms_view`

약관 페이지 조회

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `type` | string | 약관 종류 | `privacy`, `service` |

#### `withdrawal_start`

회원탈퇴 페이지 진입

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `withdrawal_feedback_submit`

회원탈퇴 피드백 제출

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `feedback_type` | string | 피드백 유형 | `not_useful`, `too_complex`, `other` |
| `has_custom_text` | boolean | 직접 입력 여부 | `true` |

---

### 3.13 인증 이벤트 (Native)

#### `login_success`

로그인 성공

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `provider` | string | 로그인 제공자 | `google`, `apple` |

#### `login_fail`

로그인 실패

| property | type | 설명 | 예시 |
|----------|------|------|------|
| `provider` | string | 로그인 제공자 | `google`, `apple` |
| `error_type` | string | 에러 유형 | `cancelled`, `network_error` |

#### `logout`

로그아웃

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

#### `account_delete`

회원 탈퇴

| property | type | 설명 | 예시 |
|----------|------|------|------|
| - | - | - | - |

---

## 4. 구현 우선순위

### 🔴 1순위 (핵심 퍼널) - 총 11개

| 이벤트 | 측정 목적 |
|--------|----------|
| `recipe_create_start` | 레시피 생성 시작 |
| `recipe_create_submit` | 레시피 생성 시도 |
| `recipe_create_success` | 레시피 생성 완료 |
| `recipe_create_fail` | 레시피 생성 실패 |
| `cooking_start` | 요리 시작 |
| `cooking_complete` | 요리 완료 |
| `cooking_exit` | 요리 이탈 |
| `coupang_modal_open` | 쿠팡 모달 오픈 |
| `coupang_product_click` | 쿠팡 상품 클릭 (매출 추적) |
| `tutorial_share_youtube_click` | 유튜브 공유 경로 추적 |
| `tutorial_share_direct_click` | 직접 입력 경로 추적 |

### 🟡 2순위 (기능 사용율) - 총 12개

| 이벤트 | 측정 목적 |
|--------|----------|
| `recipe_detail_tab_view` | 탭별 확인율 |
| `coupang_product_view` | 쿠팡 상품 노출 |
| `timer_start` | 타이머 사용율 |
| `timer_complete` | 타이머 완료율 |
| `voice_command_used` | 음성 명령 사용율 |
| `step_navigate` | 단계 이동 패턴 |
| `video_play` | 영상 재생 |
| `video_seek` | 영상 시간 이동 |
| `recipe_category_change` | 카테고리 변경 |
| `tutorial_step_start` | 핸즈프리 튜토리얼 시작 |
| `tutorial_step_complete` | 핸즈프리 튜토리얼 완료 |
| `withdrawal_feedback_submit` | 탈퇴 피드백 |

### 🟢 3순위 (탐색 & 보조) - 총 17개

| 이벤트 | 측정 목적 |
|--------|----------|
| `recipe_detail_view` | 레시피 상세 조회 |
| `search_start` | 검색 시작 |
| `search_submit` | 검색 키워드 분석 |
| `search_result_click` | 검색 품질 |
| `popular_recipe_click` | 추천 효과 |
| `category_select` | 카테고리 사용 |
| `home_view` | 사용자 동선 |
| `coupang_modal_close` | 쿠팡 모달 닫기 |
| `video_pause` | 영상 일시정지 |
| `voice_mic_toggle` | 마이크 토글 |
| `tutorial_share_view` | 튜토리얼 모달 표시 |
| `tutorial_share_dismiss` | 튜토리얼 다시보지않기 |
| `floating_button_tooltip_view` | 플로팅 버튼 툴팁 |
| `settings_view` | 설정 페이지 |
| `terms_view` | 약관 조회 |
| `withdrawal_start` | 회원탈퇴 시작 |
| `login_success` / `login_fail` / `logout` | 인증 이벤트 |

---

## 5. 분석 예시

### 5.1 레시피 생성 퍼널

```
recipe_create_start (100%)
    ↓
recipe_create_submit (70%)
    ↓
recipe_create_success (60%)
```

**분석 포인트:**
- 시작 → 제출 이탈: URL 입력 UX 문제
- 제출 → 성공 이탈: 서버/처리 문제

### 5.2 요리 완주율

```
recipe_detail_view (100%)
    ↓
cooking_start (30%)
    ↓
cooking_complete (20%)
```

**분석 포인트:**
- 상세 → 시작 이탈: 레시피 품질 또는 UI 문제
- 시작 → 완료 이탈: 어느 단계에서 이탈하는지 `cooking_exit.current_step`으로 파악

### 5.3 유튜브 vs 직접 입력 비율

```sql
-- Amplitude에서 분석
recipe_create_success
GROUP BY source
```

---

## 6. 구현 위치 안내

### WebView (webview-v2)

| 이벤트 | 파일 위치 |
|--------|----------|
| `recipe_create_*` | `/src/widgets/recipe-creating-view/` |
| `recipe_detail_*` | `/pages/recipe/[id]/detail.tsx` |
| `cooking_*` | `/pages/recipe/[id]/step.tsx` |
| `timer_*` | `/src/features/timer/` |
| `voice_*` | `/src/views/recipe-step/` |
| `video_*` | `/src/views/recipe-detail/`, `/src/views/recipe-step/` |
| `search_*` | `/pages/search-recipe.tsx`, `/pages/search-results.tsx` |
| `home_view` | `/pages/index.tsx` |
| `category_*` | `/src/entities/category/` |
| `recipe_category_change` | `/src/views/user-recipe/ui/recipeCard.tsx` |
| `coupang_*` | `/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx` |
| `tutorial_share_*` | `/src/widgets/recipe-creating-view/shareTutorialModal.tsx` |
| `tutorial_step_*` | `/src/views/recipe-step/hooks/useTutorial.ts` |
| `floating_button_*` | `/src/views/home/ui/floatingButton.tsx` |
| `settings_view` | `/src/views/settings/ui/index.tsx` |
| `terms_view` | `/src/views/settings/ui/index.tsx` |
| `withdrawal_*` | `/src/views/settings-sections/ui/withdrawal/` |

### Native (frontend)

| 이벤트 | 파일 위치 |
|--------|----------|
| `login_*` | `/src/app/(auth)/login.tsx` |
| `logout` | `/src/modules/user/` |
| `account_delete` | `/src/modules/user/` |

---

## 7. 이벤트 전송 방법

### WebView에서 전송

```typescript
import { request, MODE } from '@/shared/client/native/client';

// 이벤트 전송
request(MODE.UNBLOCKING, 'TRACK_AMPLITUDE', {
  eventName: 'recipe_create_success',
  properties: {
    recipe_id: 'rec_456',
    source: 'youtube_share',
    has_category: true,
    category_id: 'cat_123'
  }
});
```

### Native에서 전송

```typescript
import { trackNative } from '@/src/modules/shared/analytics';

// 이벤트 전송
trackNative('login_success', {
  provider: 'google'
});
```
