# Amplitude 이벤트 최종 리스트

## 개요

Cheftory 앱의 Amplitude 이벤트 최종 목록입니다.
퍼널 분석과 핵심 지표 측정을 고려하여 64개 → 47개로 최적화했습니다.

> **최종 업데이트**: 2024-12-16
>
> - 레시피 상세 이벤트 7개 → 6개 (video_first_interact 제거, 속성 구현에 맞게 수정)
> - 쿠팡 이벤트 4개 → 3개 (product_view 제거)
> - 조리 모드 이벤트 속성 상세화
> - 음성 명령 이벤트 속성 상세화
> - 구현 참고사항 섹션 추가

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

## 이벤트 목록 (총 46개)

### 1. 레시피 생성 (8개)

레시피 생성은 **두 가지 경로**로 나뉘며, 분석 목적이 다르므로 이벤트를 분리합니다:

- **카드 경로 (`_card`)**: 앱 내 기존 레시피 카드 클릭 → 다이얼로그 → 생성
- **URL 경로 (`_url`)**: 외부 공유 또는 플로팅 버튼 → URL 입력 모달 → 생성

#### 1-1. 카드 경로 (4개) - 앱 내 기존 레시피 선택

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 1 | `recipe_create_start_card` | 레시피 카드 클릭하여 다이얼로그 열림 | `source`, `video_type`, `category_type` |
| 2 | `recipe_create_submit_card` | 다이얼로그에서 "생성" 버튼 클릭 | `source`, `video_type` |
| 3 | `recipe_create_success_card` | 레시피 생성 성공 | `source`, `video_type`, `recipe_id`, `duration_ms` |
| 4 | `recipe_create_fail_card` | 레시피 생성 실패 | `source`, `error_type`, `duration_ms` |

**`source` 값 (카드 경로):**

| source 값 | 화면 위치 | 설명 |
|-----------|----------|------|
| `popular_normal` | 홈 > 인기 레시피 | 일반 영상 (VideoType.NORMAL) |
| `popular_shorts` | 홈 > 인기 쇼츠 | 쇼츠 영상 (VideoType.SHORTS) |
| `theme_chef` | 홈 > 셰프 추천 | 테마 섹션 - 셰프 추천 |
| `theme_trend` | 홈 > 트렌드 | 테마 섹션 - 급상승 |
| `search_trend` | 검색창 > 급상승 레시피 | 검색 화면 내 트렌드 |
| `search_result` | 검색 결과 | 검색어로 검색 후 결과 |
| `category_cuisine` | 카테고리 > 한식/중식 등 | CuisineType (KOREAN, CHINESE 등) |
| `category_recommend` | 카테고리 > 셰프/급상승 | RecommendType (CHEF, TRENDING) |

#### 1-2. URL 경로 (4개) - 직접 URL 입력

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 5 | `recipe_create_start_url` | URL 입력 모달 열림 | `entry_point`, `has_prefilled_url` |
| 6 | `recipe_create_submit_url` | 모달에서 "완료" 버튼 클릭 | `entry_point`, `has_target_category` |
| 7 | `recipe_create_success_url` | 레시피 생성 성공 | `entry_point`, `recipe_id`, `has_target_category`, `duration_ms` |
| 8 | `recipe_create_fail_url` | 레시피 생성 실패 | `entry_point`, `error_type`, `duration_ms` |

**`entry_point` 값 (URL 경로):**

| entry_point 값 | 진입 방식 | 설명 |
|----------------|----------|------|
| `external_share` | 유튜브 앱 → 공유 → Cheftory | URL이 미리 채워져 있음 |
| `floating_button` | 홈 플로팅 버튼(+) 클릭 | URL 직접 입력 필요 |

**분석 포인트:**

- 앱 제공 레시피 vs 직접 탐색 비율: `success_card` vs `success_url` 카운트 비교
- 경로별 전환율: 각각 `start → submit → success` 퍼널 분석
- 인기 레시피 발견 경로: `source` 분포 분석
- 외부 공유 기능 효과: `entry_point = 'external_share'` 추이

---

### 2. 레시피 상세 (6개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 9 | `recipe_detail_view` | 레시피 상세 페이지 진입 | `recipe_id`, `recipe_title`, `is_first_view`, `total_steps`, `total_ingredients`, `has_video` |
| 10 | `recipe_detail_exit` | 레시피 상세 페이지 이탈 (집계 이벤트) | `recipe_id`, `stay_duration`, `tab_switch_count`, `final_tab`, `reached_cooking_start` |
| 11 | `recipe_detail_tab_click` | 탭 전환 클릭 | `recipe_id`, `tab_name`, `time_since_view` |
| 12 | `recipe_detail_video_seek` | 스텝 클릭으로 영상 이동 | `recipe_id`, `step_order`, `step_title`, `video_time` |
| 13 | `recipe_detail_feature_click` | 부가기능 클릭 (타이머, 계량법) | `recipe_id`, `feature_type`, `current_tab` |
| 14 | `recipe_detail_cooking_start` | "요리시작" 버튼 클릭 | `recipe_id`, `time_to_start`, `tab_switch_count`, `ingredient_prepared_count` |

**속성 상세:**

**`recipe_detail_view`:**
- `recipe_id`: 레시피 고유 ID
- `recipe_title`: 레시피 제목
- `is_first_view`: 첫 진입 여부 (1시간 기준, sessionStorage로 관리)
- `total_steps`: 전체 스텝 수
- `total_ingredients`: 전체 재료 수
- `has_video`: 영상 존재 여부 (boolean)

**`recipe_detail_exit` (집계 이벤트):**
- `recipe_id`: 레시피 고유 ID
- `stay_duration`: 페이지 체류 시간 (초)
- `tab_switch_count`: 탭 전환 횟수
- `final_tab`: 마지막으로 본 탭 (`summary`, `recipe`, `ingredients`)
- `reached_cooking_start`: 요리시작 버튼 도달 여부 (boolean)

**`recipe_detail_tab_click`:**
- `recipe_id`: 레시피 고유 ID
- `tab_name`: 클릭한 탭 (`summary`, `recipe`, `ingredients`)
- `time_since_view`: 페이지 진입 후 경과 시간 (초)

**`recipe_detail_video_seek`:**
- `recipe_id`: 레시피 고유 ID
- `step_order`: 클릭한 스텝 순서 (1부터 시작)
- `step_title`: 스텝 제목
- `video_time`: 이동할 영상 시간 (초)

**`recipe_detail_feature_click`:**
- `recipe_id`: 레시피 고유 ID
- `feature_type`: 기능 유형 (`timer`, `measurement`)
- `current_tab`: 클릭 시점의 현재 탭

**`recipe_detail_cooking_start`:**
- `recipe_id`: 레시피 고유 ID
- `time_to_start`: 페이지 진입부터 요리 시작까지 시간 (초)
- `tab_switch_count`: 요리 시작까지 탭 전환 횟수
- `ingredient_prepared_count`: 준비 완료한 재료 개수

**`is_first_view` 판단 기준:**

| 상황 | is_first_view | 설명 |
|------|---------------|------|
| 홈/검색에서 첫 진입 | `true` | 신규 조회 |
| 요리모드 → 뒤로가기 (30분) | `false` | 1시간 이내 재진입 |
| 요리모드 → 뒤로가기 (2시간) | `true` | 1시간 초과로 신규 취급 |
| 다른 레시피 진입 | `true` | 레시피별로 별도 관리 |

**제거된 항목:**

- ~~`recipe_detail_video_first_interact`~~ → YouTube IFrame API 제약으로 구현 불가
- ~~`recipe_detail_share_click`~~ → 코드에 공유 기능 없음
- ~~`recipe_detail_ingredient_select`~~ → 세부 상호작용은 집계 이벤트로 충분
- ~~`recipe_detail_step_expand`~~ → 세부 상호작용은 집계 이벤트로 충분
- ~~영상 재생/일시정지 개별 이벤트~~ → YouTube IFrame API 제약으로 구현 불가

**구현 참고:**
- 상세 구현 가이드: `/frontend/docs/2.recipe_detail/amplitude-recipe-detail-implementation.md`
- 요약 문서: `/frontend/docs/2.recipe_detail/amplitude-recipe-detail-summary.md`
- 구현 위치: `webview-v2/src/views/recipe-detail/ui/index.tsx`

**분석 포인트:**
- 순수 페이지뷰 = `is_first_view: true` 필터링
- 평균 체류 시간 = `stay_duration` 평균
- 탭별 관심도 = `tab_name` 분포
- 최종 이탈 탭 = `final_tab` 분포
- 요리 시작 전환율 = `reached_cooking_start: true` 비율
- 스텝 활용도 = `video_seek` 발생 빈도
- 재료 준비도와 전환율 상관관계 = `ingredient_prepared_count` 분석

---

### 3. 쿠팡 (3개) - 매출 직결

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 15 | `coupang_modal_open` | 쿠팡 모달 열림 | `recipe_id`, `ingredient_count` |
| 16 | `coupang_product_click` | 쿠팡 상품 클릭 (쿠팡앱 이동) | `recipe_id`, `ingredient_name`, `product_id`, `product_name`, `price`, `is_rocket`, `position` |
| 17 | `coupang_modal_close` | 쿠팡 모달 닫힘 | `recipe_id`, `products_displayed`, `products_clicked`, `clicked_products[]`, `duration_seconds` |

**속성 상세:**

**`coupang_modal_open`:**
- `recipe_id`: 레시피 고유 ID
- `ingredient_count`: 전체 재료 수

> **참고**: `source` 속성 제거 - 현재 진입 경로가 "재료 탭 배너"로 유일함

**`coupang_product_click`:**
- `recipe_id`: 레시피 고유 ID
- `ingredient_name`: 재료명 (검색 키워드)
- `product_id`: 쿠팡 상품 ID
- `product_name`: 상품명
- `price`: 상품 가격
- `is_rocket`: 로켓배송 여부 (API에서 제공)
- `position`: 상품 목록 내 위치 (0부터 시작)

**`coupang_modal_close` (집계 이벤트):**
- `recipe_id`: 레시피 고유 ID
- `products_displayed`: 표시된 상품 수
- `products_clicked`: 클릭한 상품 수
- `clicked_products[]`: 클릭한 상품 ID 배열
- `duration_seconds`: 모달 체류 시간 (초)

**제거된 항목:**

- ~~`coupang_product_view`~~ → `coupang_modal_open`과 거의 동시 발생하여 중복
- ~~`source` 속성~~ → 진입 경로가 유일하여 불필요

**구현 참고:**
- 상세 구현 가이드: `/frontend/docs/3.coupang/amplitude-coupang-implementation.md`
- 구현 위치: `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx`

**분석 포인트:**

- 클릭 없이 이탈율 = `modal_close`에서 `products_clicked: 0`인 비율
- 인기 재료 = `product_click`의 `ingredient_name` 집계
- 평균 클릭 수 = `modal_close.products_clicked` 평균
- 로켓배송 선호율 = `product_click`의 `is_rocket: true` 비율
- 상품 로딩 실패율 = `modal_close`의 `products_displayed: 0` 비율

---

### 4. 조리 모드 (4개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 18 | `cooking_start` | 조리 시작 | `recipe_id`, `total_steps` |
| 19 | `cooking_complete` | 조리 완료 | 아래 상세 참조 |
| 20 | `cooking_exit` | 조리 중단 (완료 조건 미충족) | 아래 상세 참조 |
| 21 | `step_navigate` | 단계 이동 | `recipe_id`, `from_step`, `to_step`, `method` |

**`cooking_complete` / `cooking_exit` 공통 속성:**

| 속성 | 타입 | 설명 |
|-----|-----|------|
| `recipe_id` | string | 레시피 ID |
| `duration_seconds` | number | 총 체류 시간 |
| `total_steps` | number | 전체 단계 수 |
| `current_step` | number | 이탈/완료 시점 단계 |
| `max_step_reached` | number | 도달한 최대 단계 |
| `steps_viewed` | number[] | 조회한 단계 목록 (예: `[0, 1, 3, 4]`) |
| `unique_steps_count` | number | 중복 제외 조회 단계 수 |
| `completion_ratio` | number | `unique_steps_count / total_steps` |

**`cooking_complete` 발송 조건 (다음 중 하나 이상 충족 시):**

1. 마지막 단계(`steps.length - 1`)에 도달한 적 있음
2. 전체 단계의 50% 이상 조회함 (`completion_ratio >= 0.5`)
3. 체류시간이 3분 이상

**`cooking_exit` 발송 조건:**

- 위 완료 조건을 하나도 충족하지 못한 채 페이지 이탈

**제거된 항목:**

- ~~`cooking_step_viewed`~~ → `step_navigate`로 충분

**분석 포인트:**

- 완료율 = `cooking_complete` / `cooking_start`
- 이탈 지점 분포 = `cooking_exit.current_step` 집계
- 스킵 패턴 = `steps_viewed` 배열로 어떤 단계를 건너뛰는지 분석
- 익숙한 요리 vs 처음 요리 = `completion_ratio` 분포

---

### 5. 타이머 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 22 | `timer_start` | 타이머 시작 | `recipe_id`, `step_number`, `duration_seconds` |
| 23 | `timer_complete` | 타이머 완료 | `recipe_id`, `timer_id` |

**통합된 항목:**

- ~~`timer_pause`~~ → 제거 (분석 가치 낮음)
- ~~`timer_resume`~~ → 제거 (분석 가치 낮음)
- ~~`timer_cancel`~~ → 제거 (complete 안 되면 cancel로 유추)

---

### 6. 음성 제어 (1개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 24 | `voice_command` | 음성 명령 실행 | 아래 상세 참조 |

**`voice_command` 속성:**

| 속성 | 타입 | 설명 |
|-----|-----|------|
| `recipe_id` | string | 레시피 ID |
| `command_type` | string | 명령 유형 (아래 표 참조) |
| `raw_intent` | string | 서버에서 받은 원본 intent |
| `success` | boolean | 명령 실행 성공 여부 |
| `failure_reason` | string? | 실패 시 이유 |
| `context.current_step` | number | 명령 시점의 현재 단계 |
| `context.is_tutorial` | boolean | 튜토리얼 중인지 |
| `context.tutorial_step` | number? | 튜토리얼 단계 (튜토리얼 중일 때만) |

**`command_type` 값:**

| Intent | command_type |
|--------|-------------|
| `NEXT` | `next_step` |
| `PREV` | `prev_step` |
| `VIDEO PLAY` | `video_play` |
| `VIDEO STOP` | `video_stop` |
| `TIMESTAMP {n}` | `video_seek` |
| `STEP {n}` | `step_jump` |
| `TIMER SET/START/STOP/CHECK` | `timer_set`, `timer_start`, `timer_stop`, `timer_check` |
| `INGREDIENT {name}` | `ingredient_query` |
| `EXTRA` | `unrecognized` |

**`failure_reason` 값:**

| 값 | 설명 |
|---|------|
| `tutorial_restricted` | 튜토리얼 중 허용 안 된 명령 |
| `invalid_step` | 유효하지 않은 step 번호 |
| `unrecognized` | 인식 불가 (EXTRA) |
| `video_unavailable` | 비디오 ref 없음 |

**통합된 항목:**

- ~~`voice_mic_toggle`~~ → 제거 (마이크는 항상 활성화)

**분석 포인트:**

- 음성 기능 사용율 = unique users with `voice_command` / total users
- 명령별 사용 비율 = `command_type` 집계
- 인식 성공률 = `success: true` / 전체
- 자주 실패하는 명령 = `failure_reason` 별 집계

---

### 7. 유튜브 비디오 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 25 | `video_play` | 비디오 재생 | `recipe_id`, `trigger` |
| 26 | `video_seek` | 비디오 구간 이동 | `recipe_id`, `from_time`, `to_time`, `trigger` |

**제거된 항목:**

- ~~`video_pause`~~ → 분석 가치 낮음, 세션 리플레이로 확인

---

### 8. 검색 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 27 | `search_submit` | 검색 실행 | `keyword`, `result_count` |
| 28 | `search_result_click` | 검색 결과 클릭 | `keyword`, `recipe_id`, `position`, `result_type` |

**통합/제거된 항목:**

- ~~`search_start`~~ → 제거 (submit으로 충분)
- ~~`search_autocomplete_clicked`~~ → `search_result_click`의 `result_type: autocomplete`
- ~~`search_no_result`~~ → `search_submit`의 `result_count: 0`

---

### 9. 홈 (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 29 | `home_view` | 홈 화면 조회 | - |
| 30 | `popular_recipe_click` | 홈 레시피 클릭 | `recipe_id`, `position` |

---

### 10. 카테고리 (3개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 31 | `category_select` | 카테고리 선택 | `category_id`, `category_name` |
| 32 | `category_action` | 카테고리 관리 | `action`: create/delete, `category_name` |
| 33 | `recipe_category_change` | 레시피 카테고리 변경 | `recipe_id`, `from_category`, `to_category` |

**통합된 항목:**

- ~~`category_create`~~ → `category_action` (action: create)
- ~~`category_delete`~~ → `category_action` (action: delete)

---

### 11. 온보딩/튜토리얼 (8개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 34 | `tutorial_share_view` | 공유 튜토리얼 모달 표시 | - |
| 35 | `tutorial_share_youtube_click` | "생성하러 가기" 클릭 | - |
| 36 | `tutorial_share_direct_click` | "직접 입력하기" 클릭 | - |
| 37 | `tutorial_share_dismiss` | "다시 보지 않기" 클릭 | - |
| 38 | `tutorial_handsfree_view` | 핸즈프리 시작 모달 표시 ("음성으로 요리해볼까요?") | `recipe_id` |
| 39 | `tutorial_handsfree_skip` | 핸즈프리 튜토리얼 건너뛰기 ("괜찮아요" 클릭) | `recipe_id` |
| 40 | `tutorial_handsfree_step_start` | 핸즈프리 튜토리얼 시작 ("볼게요" 클릭) | `recipe_id` |
| 41 | `tutorial_handsfree_step_end` | 핸즈프리 튜토리얼 종료 (완료 또는 중도 이탈) | `recipe_id`, `completed_steps`, `total_steps`, `is_completed` |

**분석 포인트:**

- 공유 튜토리얼 전환율 = (`tutorial_share_youtube_click` + `tutorial_share_direct_click`) / `tutorial_share_view`
- 공유 튜토리얼 거부율 = `tutorial_share_dismiss` / `tutorial_share_view`
- 핸즈프리 튜토리얼 시작율 = `tutorial_handsfree_step_start` / `tutorial_handsfree_view`
- 핸즈프리 튜토리얼 거부율 = `tutorial_handsfree_skip` / `tutorial_handsfree_view`
- 핸즈프리 튜토리얼 완료율 = `tutorial_handsfree_step_end (is_completed: true)` / `tutorial_handsfree_step_start`
- 단계별 이탈 분포 = `tutorial_handsfree_step_end`의 `completed_steps` 값별 집계

**제거된 항목:**

- ~~`floating_tooltip_view`~~ → 튜토리얼이 아닌 UI 힌트, 분석 가치 낮음
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
| 42 | `withdrawal_start` | 회원 탈퇴 시작 | - |
| 43 | `withdrawal_feedback_submit` | 탈퇴 피드백 제출 | `feedback_type`, `has_custom_text` |
| 44 | `account_delete` | 계정 삭제 완료 | - |

**제거된 항목:**

- ~~`settings_view`~~ → 분석 가치 낮음
- ~~`terms_view`~~ → 분석 가치 낮음

---

### 13. 인증 - Native (2개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 45 | `login_success` | OAuth 인증 성공 (자동 로그인 제외) | `provider`, `is_new_user` |
| 46 | `logout` | 로그아웃 | - |

**`login_success` 발생 시점:**

- 최초 회원가입 시 (Google/Apple OAuth) → `is_new_user: true`
- 로그아웃 후 재로그인 시 → `is_new_user: false`
- Refresh token 만료 후 재로그인 시 → `is_new_user: false`

**자동 로그인은 추적하지 않는 이유:**

- `app_launched`로 DAU 추적 가능
- 토큰 갱신은 자동 처리되며, 만료 시 다시 OAuth → `login_success` 발생

**`login_fail` 제거 이유:**

- OAuth 취소/실패는 드문 케이스
- MVP에서는 성공 이벤트만 추적, 필요시 추후 추가

---

### 14. 앱 라이프사이클 - Native (1개)

| # | 이벤트명 | 설명 | 주요 속성 |
|---|---------|------|----------|
| 47 | `app_launched` | 앱 실행 | - |

**제거된 항목:**

- ~~`app_backgrounded`~~ → 세션 리플레이로 확인
- ~~`app_foregrounded`~~ → 세션 리플레이로 확인

---

## 요약

### 이벤트 수 비교

| 카테고리 | 기존 | 최종 | 변경 |
|---------|-----|-----|------|
| 레시피 생성 | 6 | 8 | +2 |
| 레시피 상세 | 4 | 6 | +2 |
| 쿠팡 | 4 | 3 | -1 |
| 조리 모드 | 5 | 4 | -1 |
| 타이머 | 5 | 2 | -3 |
| 음성 제어 | 2 | 1 | -1 |
| 비디오 | 3 | 2 | -1 |
| 검색 | 5 | 2 | -3 |
| 홈 | 2 | 2 | 0 |
| 카테고리 | 4 | 3 | -1 |
| 온보딩/튜토리얼 | 13 | 8 | -5 |
| 설정/계정 | 5 | 3 | -2 |
| 인증 | 3 | 2 | -1 |
| 앱 라이프사이클 | 3 | 1 | -2 |
| **합계** | **64** | **47** | **-17** |

### 구현 위치

| 구분 | 이벤트 수 |
|-----|---------|
| Native (React Native) | 3개 |
| WebView | 44개 |

---

## 우선순위

### 🔴 1순위 - 핵심 퍼널 (16개)

| 이벤트 | 측정 목적 |
|-------|----------|
| `recipe_create_start_card` | 카드 경로 레시피 생성 시작 |
| `recipe_create_submit_card` | 카드 경로 레시피 생성 시도 |
| `recipe_create_success_card` | 카드 경로 레시피 생성 완료 |
| `recipe_create_fail_card` | 카드 경로 레시피 생성 실패 |
| `recipe_create_start_url` | URL 경로 레시피 생성 시작 |
| `recipe_create_submit_url` | URL 경로 레시피 생성 시도 |
| `recipe_create_success_url` | URL 경로 레시피 생성 완료 |
| `recipe_create_fail_url` | URL 경로 레시피 생성 실패 |
| `recipe_detail_cooking_start` | 조리 퍼널 진입점 (상세→조리) |
| `cooking_start` | 조리 퍼널 시작 |
| `cooking_complete` | 조리 완료 |
| `cooking_exit` | 조리 이탈 |
| `coupang_modal_open` | 쿠팡 퍼널 시작 |
| `coupang_product_click` | 매출 전환점 |
| `tutorial_share_youtube_click` | 유튜브 경로 |
| `tutorial_share_direct_click` | 직접 입력 경로 |

### 🟡 2순위 - 기능 사용율 (18개)

| 이벤트 | 측정 목적 |
|-------|----------|
| `recipe_detail_view` | 상세 조회 |
| `recipe_detail_exit` | 상세 페이지 이탈 및 집계 데이터 |
| `recipe_detail_tab_click` | 탭별 관심도 |
| `recipe_detail_video_seek` | 스텝 클릭으로 영상 이동 활용도 |
| `recipe_detail_feature_click` | 부가기능 사용율 |
| `coupang_modal_close` | 쿠팡 이탈 분석 |
| `timer_start` | 타이머 사용율 |
| `timer_complete` | 타이머 완료율 |
| `voice_command` | 음성 기능 사용율 |
| `step_navigate` | 단계 이동 패턴 |
| `video_play` | 영상 재생 |
| `video_seek` | 영상 탐색 |
| `search_submit` | 검색 사용 |
| `search_result_click` | 검색 품질 |
| `tutorial_handsfree_step_start` | 핸즈프리 튜토리얼 |
| `tutorial_handsfree_step_end` | 튜토리얼 완료율/이탈 분석 |

### 🟢 3순위 - 탐색 & 보조 (13개)

나머지 이벤트들

---

## 퍼널 분석 예시

### 레시피 생성 퍼널

**카드 경로 (앱 내 레시피 선택):**

```text
recipe_create_start_card (100%)
    ↓
recipe_create_submit_card (80%)
    ↓
recipe_create_success_card (75%) / recipe_create_fail_card (5%)
```

**URL 경로 (직접 입력 / 외부 공유):**

```text
recipe_create_start_url (100%)
    ↓
recipe_create_submit_url (60%)
    ↓
recipe_create_success_url (50%) / recipe_create_fail_url (10%)
```

**경로 비교 분석:**

```text
앱 제공 레시피 사용 비율 = success_card / (success_card + success_url)
직접 탐색 레시피 비율 = success_url / (success_card + success_url)
```

### 조리 퍼널

```text
recipe_detail_view (100%)
    ↓
cooking_start (30%)
    ↓
cooking_complete (20%) / cooking_exit (10%)

* cooking_complete 조건: 마지막 단계 도달 OR 50% 이상 조회 OR 3분 이상 체류
```

### 쿠팡 전환 퍼널

```text
recipe_detail_tab_view [tab=ingredients] (100%)
    ↓
coupang_modal_open (20%)
    ↓
coupang_product_click (5%)
    ↓
coupang_modal_close [products_clicked > 0] (5%)

* 이탈 분석: modal_close에서 products_clicked=0 비율 확인
```

---

## 핵심 지표 측정

| 지표 | 계산 방법 |
|-----|----------|
| 인당 레시피 생성율 | (`recipe_create_success_card` + `recipe_create_success_url`) / unique users |
| 앱 제공 레시피 선택 비율 | `recipe_create_success_card` / 전체 success |
| 직접 탐색 레시피 비율 | `recipe_create_success_url` / 전체 success |
| 카드 경로 전환율 | `recipe_create_success_card` / `recipe_create_start_card` |
| URL 경로 전환율 | `recipe_create_success_url` / `recipe_create_start_url` |
| 조리 시작률 | `cooking_start` / `recipe_detail_view` |
| 조리 완료율 | `cooking_complete` / `cooking_start` |
| 쿠팡 전환율 | `coupang_product_click` / `coupang_modal_open` |
| 음성 기능 사용율 | unique users with `voice_command` / total users |
| 타이머 완료율 | `timer_complete` / `timer_start` |
| 검색 품질 | `search_result_click` / `search_submit` |

---

## 구현 참고사항

### 음성 명령 아키텍처

```text
┌─────────────────────────────────────────────────────────────────┐
│                        클라이언트 (WebView)                       │
├─────────────────────────────────────────────────────────────────┤
│  1. 마이크 입력 (Web Audio API)                                   │
│     ↓                                                            │
│  2. TEN VAD (Voice Activity Detection)                          │
│     - 음성 감지 시작/종료 판단                                      │
│     ↓                                                            │
│  3. WebSocket으로 음성 데이터 전송                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                          서버 (STT)                              │
├─────────────────────────────────────────────────────────────────┤
│  4. CLOVA STT로 음성 → 텍스트 변환                                │
│     ↓                                                            │
│  5. Intent 파싱                                                  │
│     ↓                                                            │
│  6. JSON 응답 반환 { status: 200, data: { intent: "NEXT" } }     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WebSocket message
┌─────────────────────────────────────────────────────────────────┐
│                        클라이언트 (WebView)                       │
├─────────────────────────────────────────────────────────────────┤
│  7. onIntent 콜백 → parseIntent() → 실제 동작 실행                │
│     ※ 이 시점에서 voice_command 이벤트 발송                        │
└─────────────────────────────────────────────────────────────────┘
```

### 주요 코드 위치

| 이벤트 카테고리 | 파일 위치 |
|---------------|----------|
| 레시피 생성 (카드) | `webview-v2/src/widgets/recipe-create-dialog/recipeCardWrapper.tsx` (인기/테마), `webview-v2/src/views/search-recipe/ui/index.tsx` (검색 트렌드), `webview-v2/src/views/search-results/ui/index.tsx` (검색 결과), `webview-v2/src/views/category-results/ui/index.tsx` (카테고리) |
| 레시피 생성 (URL) | `webview-v2/src/widgets/recipe-creating-view/recipeCreatingView.tsx` |
| 레시피 생성 (성공/실패) | `webview-v2/src/entities/user_recipe/model/useUserRecipe.ts` |
| 레시피 상세 | `webview-v2/src/views/recipe-detail/ui/index.tsx` |
| 쿠팡 | `webview-v2/src/views/recipe-detail/ui/IngredientPurchaseModal.tsx` |
| 조리 모드 | `webview-v2/src/views/recipe-step/ui/index.tsx` |
| 타이머 | `webview-v2/src/features/timer/model/useInProgressTimers.ts` |
| 음성 제어 | `webview-v2/src/views/recipe-step/ui/index.tsx` (onIntent 콜백) |
| 검색 | `webview-v2/src/views/search-recipe/index.tsx` |
| 홈 | `webview-v2/src/views/home/index.tsx` |
| 카테고리 | `webview-v2/src/entities/category/model/useCategory.ts` |
| 튜토리얼 | `webview-v2/src/widgets/recipe-creating-view/shareTutorialModal.tsx` |
| 설정/탈퇴 | `webview-v2/src/views/settings-sections/ui/withdrawal/membershipWithdrawal.tsx` |
| 인증 (Native) | `frontend/src/app/(auth)/login.tsx` |

### 구현 시 주의사항

1. **cooking_complete vs cooking_exit 분기**
   - 페이지 이탈 시점에 조건 체크 후 어느 이벤트를 발송할지 결정
   - `steps_viewed` 배열은 Set으로 관리하여 중복 제거

2. **쿠팡 이벤트 상태 관리**
   - 모달 내에서 클릭 횟수 및 클릭한 재료명 배열을 state로 관리
   - 모달 close 시 해당 정보를 이벤트에 포함

3. **음성 명령 이벤트 발송 시점**
   - `onIntent` 콜백 내에서 parseIntent 직후 발송
   - 실제 동작 실행 전에 success 여부 판단 필요

---

## 향후 고려 이벤트

현재 MVP에서는 제외하되, 추후 데이터 분석 결과에 따라 추가 검토할 이벤트들입니다.

| 이벤트 | 설명 | 추가 조건 |
|-------|------|----------|
| `measurement_overlay_open` | 계량법 가이드 열기 | 사용 빈도 높을 경우 |
| `ingredient_checkbox_toggle` | 재료 체크박스 토글 | 조리 준비 행동 분석 필요시 |
| `search_no_result_impression` | 검색 결과 없음 노출 | 검색 품질 개선 필요시 |
| `category_browse_click` | 홈 카테고리 클릭 | 탐색 패턴 분석 필요시 |
| `voice_guide_modal_view` | 음성 가이드 모달 조회 | 음성 기능 온보딩 분석 필요시 |

**추가하지 않는 이유:**

- 현재 47개 이벤트로 핵심 퍼널 분석 가능
- 추가 이벤트는 데이터 노이즈 증가 우려
- Session Replay로 확인 후 필요시 추가

---

## 다음 단계

1. [x] 이벤트 목록 최종 검토
2. [x] 코드베이스 점검 (누락 이벤트 확인)
3. [ ] WebView 이벤트 구현
4. [ ] Native 이벤트 구현
5. [ ] Amplitude 대시보드 설정
6. [ ] 테스트 및 검증
