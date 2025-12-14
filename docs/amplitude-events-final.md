# Amplitude 이벤트 최종 리스트

## 개요

Cheftory 앱의 Amplitude 이벤트 최종 목록입니다.
퍼널 분석과 핵심 지표 측정을 고려하여 64개 → 40개로 최적화했습니다.

---

## 이벤트 설계 원칙

### 이벤트로 유지 (분리)
- 퍼널의 시작/중간/끝 단계
- 매출과 직결되는 행동
- 별도 카운트가 필요한 핵심 전환점

### 속성으로 통합
- 동일 행동의 변형 (선택지)
- 퍼널 중간이 아닌 보조 정보
- 빈도가 높은 반복 행동

### 제거
- 세션 리플레이로 확인 가능한 것
- 분석 가치가 낮은 것
- 다른 이벤트로 유추 가능한 것

---

## 이벤트 목록 (총 40개)

### 1. 레시피 생성 (4개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 1 | `recipe_create_start` | 레시피 생성 시작 | `source`: youtube/direct |
| 2 | `recipe_create_submit` | 레시피 생성 제출 | `source`, `has_url` |
| 3 | `recipe_create_success` | 레시피 생성 완료 | `source`, `has_category`, `recipe_id` |
| 4 | `recipe_create_fail` | 레시피 생성 실패 | `source`, `error_type` |

**통합된 항목:**
- ~~`recipe_create_source_selected`~~ → `recipe_create_start`의 `source` 속성
- ~~`recipe_create_url_pasted`~~ → `recipe_create_submit`의 `has_url` 속성

---

### 2. 레시피 상세 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 5 | `recipe_detail_view` | 레시피 상세 조회 | `recipe_id` |
| 6 | `recipe_detail_tab_view` | 탭 전환 | `recipe_id`, `tab_name` |

**제거된 항목:**

- ~~`recipe_detail_cooking_clicked`~~ → `cooking_start`로 추적 가능
- ~~`recipe_detail_share_click`~~ → 코드에 공유 기능 없음

---

### 3. 쿠팡 (4개) - 매출 직결, 전체 유지

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 7 | `coupang_modal_open` | 쿠팡 모달 열림 | `recipe_id`, `ingredient_count` |
| 8 | `coupang_product_view` | 쿠팡 상품 노출 | `recipe_id`, `product_count` |
| 9 | `coupang_product_click` | 쿠팡 상품 클릭 | `recipe_id`, `ingredient_name`, `product_id`, `price`, `is_rocket` |
| 10 | `coupang_modal_close` | 쿠팡 모달 닫힘 | `recipe_id`, `products_clicked` |

---

### 4. 조리 모드 (4개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 11 | `cooking_start` | 조리 시작 | `recipe_id`, `total_steps` |
| 12 | `cooking_complete` | 조리 완료 | `recipe_id`, `duration_seconds`, `steps_viewed` |
| 13 | `cooking_exit` | 조리 중단 | `recipe_id`, `current_step`, `duration_seconds` |
| 14 | `step_navigate` | 단계 이동 | `recipe_id`, `from_step`, `to_step`, `method` |

**제거된 항목:**
- ~~`cooking_step_viewed`~~ → `step_navigate`로 충분

---

### 5. 타이머 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 15 | `timer_start` | 타이머 시작 | `recipe_id`, `step_number`, `duration_seconds` |
| 16 | `timer_complete` | 타이머 완료 | `recipe_id`, `timer_id` |

**통합된 항목:**
- ~~`timer_pause`~~ → 제거 (분석 가치 낮음)
- ~~`timer_resume`~~ → 제거 (분석 가치 낮음)
- ~~`timer_cancel`~~ → 제거 (complete 안 되면 cancel로 유추)

---

### 6. 음성 제어 (1개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 17 | `voice_command` | 음성 명령 실행 | `recipe_id`, `command_type`, `success` |

**통합된 항목:**
- ~~`voice_mic_toggle`~~ → `voice_command`의 `mic_enabled` 속성 또는 제거

---

### 7. 유튜브 비디오 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 18 | `video_play` | 비디오 재생 | `recipe_id`, `trigger` |
| 19 | `video_seek` | 비디오 구간 이동 | `recipe_id`, `from_time`, `to_time`, `trigger` |

**제거된 항목:**
- ~~`video_pause`~~ → 분석 가치 낮음, 세션 리플레이로 확인

---

### 8. 검색 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 20 | `search_submit` | 검색 실행 | `keyword`, `result_count` |
| 21 | `search_result_click` | 검색 결과 클릭 | `keyword`, `recipe_id`, `position`, `result_type` |

**통합/제거된 항목:**
- ~~`search_start`~~ → 제거 (submit으로 충분)
- ~~`search_autocomplete_clicked`~~ → `search_result_click`의 `result_type: autocomplete`
- ~~`search_no_result`~~ → `search_submit`의 `result_count: 0`

---

### 9. 홈 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 22 | `home_view` | 홈 화면 조회 | - |
| 23 | `popular_recipe_click` | 홈 레시피 클릭 | `recipe_id`, `position` |

---

### 10. 카테고리 (3개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 24 | `category_select` | 카테고리 선택 | `category_id`, `category_name` |
| 25 | `category_action` | 카테고리 관리 | `action`: create/delete, `category_name` |
| 26 | `recipe_category_change` | 레시피 카테고리 변경 | `recipe_id`, `from_category`, `to_category` |

**통합된 항목:**
- ~~`category_create`~~ → `category_action` (action: create)
- ~~`category_delete`~~ → `category_action` (action: delete)

---

### 11. 온보딩/튜토리얼 (7개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 27 | `tutorial_share_view` | 공유 튜토리얼 모달 표시 | `device_type` |
| 28 | `tutorial_share_youtube_click` | "생성하러 가기" 클릭 | - |
| 29 | `tutorial_share_direct_click` | "직접 입력하기" 클릭 | - |
| 30 | `tutorial_share_dismiss` | "다시 보지 않기" 클릭 | - |
| 31 | `tutorial_step_start` | 핸즈프리 튜토리얼 시작 | `recipe_id` |
| 32 | `tutorial_step_complete` | 핸즈프리 튜토리얼 완료 | `recipe_id` |
| 33 | `floating_tooltip_view` | 플로팅 버튼 툴팁 표시 | - |

**제거된 항목:**

- ~~`onboarding_complete`~~ → 코드에 온보딩 화면 없음
- ~~`onboarding_skip`~~ → 코드에 온보딩 화면 없음
- ~~`onboarding_started`~~ → 앱 첫 실행으로 대체
- ~~`onboarding_step_viewed`~~ → 세션 리플레이로 확인
- ~~`onboarding_video_played`~~ → 세션 리플레이로 확인
- ~~`tutorial_share_video_played`~~ → 세션 리플레이로 확인

---

### 12. 설정/계정 (3개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 34 | `withdrawal_start` | 회원 탈퇴 시작 | - |
| 35 | `withdrawal_feedback_submit` | 탈퇴 피드백 제출 | `feedback_type`, `has_custom_text` |
| 36 | `account_delete` | 계정 삭제 완료 | - |

**제거된 항목:**
- ~~`settings_view`~~ → 분석 가치 낮음
- ~~`terms_view`~~ → 분석 가치 낮음

---

### 13. 인증 - Native (3개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 37 | `login_success` | 로그인 성공 | `provider` |
| 38 | `login_fail` | 로그인 실패 | `provider`, `error_type` |
| 39 | `logout` | 로그아웃 | - |

---

### 14. 앱 라이프사이클 - Native (1개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 40 | `app_launched` | 앱 실행 | - |

**제거된 항목:**
- ~~`app_backgrounded`~~ → 세션 리플레이로 확인
- ~~`app_foregrounded`~~ → 세션 리플레이로 확인

---

## 요약

### 이벤트 수 비교

| 카테고리 | 기존 | 최종 | 변경 |
|---------|-----|-----|------|
| 레시피 생성 | 6 | 4 | -2 |
| 레시피 상세 | 4 | 2 | -2 |
| 쿠팡 | 4 | 4 | 0 |
| 조리 모드 | 5 | 4 | -1 |
| 타이머 | 5 | 2 | -3 |
| 음성 제어 | 2 | 1 | -1 |
| 비디오 | 3 | 2 | -1 |
| 검색 | 5 | 2 | -3 |
| 홈 | 2 | 2 | 0 |
| 카테고리 | 4 | 3 | -1 |
| 온보딩/튜토리얼 | 13 | 7 | -6 |
| 설정/계정 | 5 | 3 | -2 |
| 인증 | 3 | 3 | 0 |
| 앱 라이프사이클 | 3 | 1 | -2 |
| **합계** | **64** | **40** | **-24** |

### 구현 위치

| 구분 | 이벤트 수 |
|-----|---------|
| Native (React Native) | 4개 |
| WebView | 39개 |

---

## 우선순위

### 🔴 1순위 - 핵심 퍼널 (11개)

| 이벤트 | 측정 목적 |
|-------|----------|
| `recipe_create_start` | 레시피 생성 퍼널 시작 |
| `recipe_create_submit` | 레시피 생성 시도 |
| `recipe_create_success` | 레시피 생성 완료 |
| `recipe_create_fail` | 레시피 생성 실패 |
| `cooking_start` | 조리 퍼널 시작 |
| `cooking_complete` | 조리 완료 |
| `cooking_exit` | 조리 이탈 |
| `coupang_modal_open` | 쿠팡 퍼널 시작 |
| `coupang_product_click` | 매출 전환점 |
| `tutorial_share_youtube_click` | 유튜브 경로 |
| `tutorial_share_direct_click` | 직접 입력 경로 |

### 🟡 2순위 - 기능 사용율 (14개)

| 이벤트 | 측정 목적 |
|-------|----------|
| `recipe_detail_view` | 상세 조회 |
| `recipe_detail_tab_view` | 탭별 관심도 |
| `coupang_product_view` | 쿠팡 상품 노출 |
| `timer_start` | 타이머 사용율 |
| `timer_complete` | 타이머 완료율 |
| `voice_command` | 음성 기능 사용율 |
| `step_navigate` | 단계 이동 패턴 |
| `video_play` | 영상 재생 |
| `video_seek` | 영상 탐색 |
| `search_submit` | 검색 사용 |
| `search_result_click` | 검색 품질 |
| `recipe_category_change` | 카테고리 활용 |
| `tutorial_step_start` | 핸즈프리 튜토리얼 |
| `tutorial_step_complete` | 튜토리얼 완료율 |

### 🟢 3순위 - 탐색 & 보조 (18개)

나머지 이벤트들

---

## 퍼널 분석 예시

### 레시피 생성 퍼널

```
recipe_create_start (100%)
    ↓
recipe_create_submit (70%)
    ↓
recipe_create_success (60%) / recipe_create_fail (10%)
```

### 조리 퍼널

```
recipe_detail_view (100%)
    ↓
cooking_start (30%)
    ↓
cooking_complete (20%) / cooking_exit (10%)
```

### 쿠팡 전환 퍼널

```
recipe_detail_tab_view [tab=ingredients] (100%)
    ↓
coupang_modal_open (20%)
    ↓
coupang_product_view (18%)
    ↓
coupang_product_click (5%)
```

---

## 핵심 지표 측정

| 지표 | 계산 방법 |
|-----|----------|
| 인당 레시피 생성율 | `recipe_create_success` / unique users |
| 조리 시작률 | `cooking_start` / `recipe_detail_view` |
| 조리 완료율 | `cooking_complete` / `cooking_start` |
| 쿠팡 전환율 | `coupang_product_click` / `coupang_modal_open` |
| 음성 기능 사용율 | unique users with `voice_command` / total users |
| 타이머 완료율 | `timer_complete` / `timer_start` |
| 검색 품질 | `search_result_click` / `search_submit` |

---

## 다음 단계

1. [ ] 이벤트 목록 최종 검토
2. [ ] WebView 이벤트 구현
3. [ ] Native 이벤트 구현
4. [ ] Amplitude 대시보드 설정
5. [ ] 테스트 및 검증
