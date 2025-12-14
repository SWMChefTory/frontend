# Amplitude 이벤트 리스트

## 개요

Cheftory 앱의 Amplitude 이벤트 목록입니다.
Native/WebView 구분 → 카테고리별 그룹핑 → 빠진 이벤트 점검 순서로 정리했습니다.

---

## 1. Native vs WebView 분류

### Native 이벤트 (6개)

React Native에서 직접 추적하는 이벤트

| # | 이벤트명 | 설명 |
|---|---------|------|
| 1 | `app_launched` | 앱 실행 |
| 2 | `app_backgrounded` | 앱 백그라운드 전환 |
| 3 | `app_foregrounded` | 앱 포그라운드 복귀 |
| 4 | `login_success` | 로그인 성공 |
| 5 | `login_fail` | 로그인 실패 |
| 6 | `logout` | 로그아웃 |

### WebView 이벤트 (58개)

WebView → Native Bridge → Amplitude 경로로 전송하는 이벤트

| # | 이벤트명 | 설명 |
|---|---------|------|
| 1 | `recipe_create_start` | 레시피 생성 시작 |
| 2 | `recipe_create_source_selected` | 입력 방식 선택 (youtube/direct) |
| 3 | `recipe_create_url_pasted` | URL 붙여넣기 |
| 4 | `recipe_create_submit` | 레시피 생성 제출 |
| 5 | `recipe_create_success` | 레시피 생성 완료 |
| 6 | `recipe_create_fail` | 레시피 생성 실패 |
| 7 | `recipe_detail_view` | 레시피 상세 조회 |
| 8 | `recipe_detail_tab_view` | 탭 전환 (요약/재료/조리순서) |
| 9 | `recipe_detail_cooking_clicked` | 조리 시작 버튼 클릭 |
| 10 | `recipe_detail_share_clicked` | 공유 버튼 클릭 |
| 11 | `coupang_modal_open` | 쿠팡 모달 열림 |
| 12 | `coupang_product_view` | 쿠팡 상품 노출 |
| 13 | `coupang_product_click` | 쿠팡 상품 클릭 |
| 14 | `coupang_modal_close` | 쿠팡 모달 닫힘 |
| 15 | `cooking_start` | 조리 시작 |
| 16 | `cooking_step_viewed` | 특정 단계 조회 |
| 17 | `cooking_complete` | 조리 완료 |
| 18 | `cooking_exit` | 조리 중단/나가기 |
| 19 | `step_navigate` | 조리 단계 이동 |
| 20 | `timer_start` | 타이머 시작 |
| 21 | `timer_pause` | 타이머 일시정지 |
| 22 | `timer_resume` | 타이머 재개 |
| 23 | `timer_complete` | 타이머 완료 |
| 24 | `timer_cancel` | 타이머 취소 |
| 25 | `voice_mic_toggle` | 음성 인식 활성화/비활성화 |
| 26 | `voice_command_used` | 음성 명령 실행 |
| 27 | `video_play` | 비디오 재생 |
| 28 | `video_pause` | 비디오 일시정지 |
| 29 | `video_seek` | 비디오 구간 이동 |
| 30 | `search_start` | 검색창 포커스 |
| 31 | `search_submit` | 검색 실행 |
| 32 | `search_autocomplete_clicked` | 자동완성 선택 |
| 33 | `search_result_click` | 검색 결과 클릭 |
| 34 | `search_no_result` | 검색 결과 없음 |
| 35 | `home_view` | 홈 화면 조회 |
| 36 | `popular_recipe_click` | 홈 레시피 클릭 |
| 37 | `category_select` | 카테고리 선택 |
| 38 | `category_create` | 카테고리 생성 |
| 39 | `category_delete` | 카테고리 삭제 |
| 40 | `recipe_category_change` | 레시피 카테고리 변경 |
| 41 | `tutorial_share_view` | 공유 튜토리얼 모달 표시 |
| 42 | `tutorial_share_youtube_click` | "생성하러 가기" 버튼 클릭 |
| 43 | `tutorial_share_direct_click` | "직접 입력하기" 버튼 클릭 |
| 44 | `tutorial_share_dismiss` | "다시 보지 않기" 클릭 |
| 45 | `tutorial_share_video_played` | 공유 튜토리얼 비디오 재생 |
| 46 | `tutorial_step_start` | 핸즈프리 튜토리얼 시작 |
| 47 | `tutorial_step_complete` | 핸즈프리 튜토리얼 완료 |
| 48 | `onboarding_started` | 온보딩 시작 |
| 49 | `onboarding_step_viewed` | 온보딩 단계 조회 |
| 50 | `onboarding_video_played` | 온보딩 비디오 재생 |
| 51 | `onboarding_completed` | 온보딩 완료 |
| 52 | `onboarding_skipped` | 온보딩 건너뛰기 |
| 53 | `floating_button_tooltip_view` | 플로팅 버튼 툴팁 표시 |
| 54 | `settings_view` | 설정 화면 열림 |
| 55 | `terms_view` | 약관 페이지 조회 |
| 56 | `withdrawal_start` | 회원 탈퇴 시작 |
| 57 | `withdrawal_feedback_submit` | 회원 탈퇴 피드백 제출 |
| 58 | `account_delete` | 계정 삭제 완료 |

---

## 2. 카테고리별 그룹핑

### 앱 라이프사이클 (Native) - 3개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `app_launched` | 앱 실행 | `_layout.tsx` |
| `app_backgrounded` | 앱 백그라운드 전환 | `_layout.tsx` |
| `app_foregrounded` | 앱 포그라운드 복귀 | `_layout.tsx` |

### 인증 (Native) - 3개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `login_success` | 로그인 성공 | `login.tsx` |
| `login_fail` | 로그인 실패 | `login.tsx` |
| `logout` | 로그아웃 | `userStore` |

### 레시피 생성 (WebView) - 6개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `recipe_create_start` | 레시피 생성 시작 | `recipe-creating-view/` |
| `recipe_create_source_selected` | 입력 방식 선택 | `recipe-creating-view/` |
| `recipe_create_url_pasted` | URL 붙여넣기 | `recipe-creating-view/` |
| `recipe_create_submit` | 레시피 생성 제출 | `recipe-creating-view/` |
| `recipe_create_success` | 레시피 생성 완료 | `recipe-creating-view/` |
| `recipe_create_fail` | 레시피 생성 실패 | `recipe-creating-view/` |

### 레시피 상세 (WebView) - 4개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `recipe_detail_view` | 레시피 상세 조회 | `recipe/[id]/detail.tsx` |
| `recipe_detail_tab_view` | 탭 전환 | `recipe/[id]/detail.tsx` |
| `recipe_detail_cooking_clicked` | 조리 시작 버튼 클릭 | `recipe/[id]/detail.tsx` |
| `recipe_detail_share_clicked` | 공유 버튼 클릭 | `recipe/[id]/detail.tsx` |

### 쿠팡 구매 (WebView) - 4개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `coupang_modal_open` | 쿠팡 모달 열림 | `IngredientPurchaseModal.tsx` |
| `coupang_product_view` | 쿠팡 상품 노출 | `IngredientPurchaseModal.tsx` |
| `coupang_product_click` | 쿠팡 상품 클릭 | `IngredientPurchaseModal.tsx` |
| `coupang_modal_close` | 쿠팡 모달 닫힘 | `IngredientPurchaseModal.tsx` |

### 조리 모드 (WebView) - 5개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `cooking_start` | 조리 시작 | `recipe/[id]/step.tsx` |
| `cooking_step_viewed` | 특정 단계 조회 | `recipe/[id]/step.tsx` |
| `cooking_complete` | 조리 완료 | `recipe/[id]/step.tsx` |
| `cooking_exit` | 조리 중단/나가기 | `recipe/[id]/step.tsx` |
| `step_navigate` | 조리 단계 이동 | `recipe/[id]/step.tsx` |

### 타이머 (WebView) - 5개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `timer_start` | 타이머 시작 | `features/timer/` |
| `timer_pause` | 타이머 일시정지 | `features/timer/` |
| `timer_resume` | 타이머 재개 | `features/timer/` |
| `timer_complete` | 타이머 완료 | `features/timer/` |
| `timer_cancel` | 타이머 취소 | `features/timer/` |

### 음성 제어 (WebView) - 2개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `voice_mic_toggle` | 마이크 활성화/비활성화 | `recipe-step/` |
| `voice_command_used` | 음성 명령 실행 | `recipe-step/` |

### 유튜브 비디오 (WebView) - 3개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `video_play` | 비디오 재생 | `recipe-detail/`, `recipe-step/` |
| `video_pause` | 비디오 일시정지 | `recipe-detail/`, `recipe-step/` |
| `video_seek` | 비디오 구간 이동 | `recipe-detail/`, `recipe-step/` |

### 검색 (WebView) - 5개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `search_start` | 검색창 포커스 | `search-recipe.tsx` |
| `search_submit` | 검색 실행 | `search-recipe.tsx` |
| `search_autocomplete_clicked` | 자동완성 선택 | `search-recipe.tsx` |
| `search_result_click` | 검색 결과 클릭 | `search-results.tsx` |
| `search_no_result` | 검색 결과 없음 | `search-results.tsx` |

### 홈 (WebView) - 2개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `home_view` | 홈 화면 조회 | `index.tsx` |
| `popular_recipe_click` | 홈 레시피 클릭 | `index.tsx` |

### 카테고리 (WebView) - 4개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `category_select` | 카테고리 선택 | `entities/category/` |
| `category_create` | 카테고리 생성 | `entities/category/` |
| `category_delete` | 카테고리 삭제 | `entities/category/` |
| `recipe_category_change` | 레시피 카테고리 변경 | `recipeCard.tsx` |

### 온보딩/튜토리얼 (WebView) - 10개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `tutorial_share_view` | 공유 튜토리얼 모달 표시 | `shareTutorialModal.tsx` |
| `tutorial_share_youtube_click` | "생성하러 가기" 버튼 | `shareTutorialModal.tsx` |
| `tutorial_share_direct_click` | "직접 입력하기" 버튼 | `shareTutorialModal.tsx` |
| `tutorial_share_dismiss` | "다시 보지 않기" | `shareTutorialModal.tsx` |
| `tutorial_share_video_played` | 튜토리얼 비디오 재생 | `shareTutorialModal.tsx` |
| `tutorial_step_start` | 핸즈프리 튜토리얼 시작 | `useTutorial.ts` |
| `tutorial_step_complete` | 핸즈프리 튜토리얼 완료 | `useTutorial.ts` |
| `onboarding_started` | 온보딩 시작 | 온보딩 화면 |
| `onboarding_step_viewed` | 온보딩 단계 조회 | 온보딩 화면 |
| `onboarding_video_played` | 온보딩 비디오 재생 | 온보딩 화면 |
| `onboarding_completed` | 온보딩 완료 | 온보딩 화면 |
| `onboarding_skipped` | 온보딩 건너뛰기 | 온보딩 화면 |
| `floating_button_tooltip_view` | 플로팅 버튼 툴팁 | `floatingButton.tsx` |

### 설정/계정 (WebView) - 5개

| 이벤트명 | 설명 | 구현 위치 |
|---------|------|----------|
| `settings_view` | 설정 화면 열림 | `settings/ui/index.tsx` |
| `terms_view` | 약관 페이지 조회 | `settings/ui/index.tsx` |
| `withdrawal_start` | 회원 탈퇴 시작 | `withdrawal/` |
| `withdrawal_feedback_submit` | 탈퇴 피드백 제출 | `withdrawal/` |
| `account_delete` | 계정 삭제 완료 | `withdrawal/` |

---

## 3. 이벤트 요약

| 구분 | 카테고리 | 개수 |
|-----|---------|-----|
| Native | 앱 라이프사이클 | 3개 |
| Native | 인증 | 3개 |
| WebView | 레시피 생성 | 6개 |
| WebView | 레시피 상세 | 4개 |
| WebView | 쿠팡 구매 | 4개 |
| WebView | 조리 모드 | 5개 |
| WebView | 타이머 | 5개 |
| WebView | 음성 제어 | 2개 |
| WebView | 유튜브 비디오 | 3개 |
| WebView | 검색 | 5개 |
| WebView | 홈 | 2개 |
| WebView | 카테고리 | 4개 |
| WebView | 온보딩/튜토리얼 | 13개 |
| WebView | 설정/계정 | 5개 |
| **합계** | | **64개** |

---

## 4. 추가된 이벤트 (기존 대비)

기존 48개 대비 16개 추가

| 카테고리 | 추가 이벤트 | 추가 이유 |
|---------|------------|----------|
| 레시피 생성 | `recipe_create_source_selected` | 입력 방식 분석 |
| 레시피 생성 | `recipe_create_url_pasted` | URL 입력 추적 |
| 레시피 상세 | `recipe_detail_cooking_clicked` | 조리 전환율 측정 |
| 레시피 상세 | `recipe_detail_share_clicked` | 공유 기능 사용률 |
| 조리 모드 | `cooking_step_viewed` | 단계별 체류 시간 |
| 검색 | `search_start` | 검색 시작점 |
| 검색 | `search_autocomplete_clicked` | 자동완성 효과 |
| 검색 | `search_no_result` | 검색 실패 분석 |
| 온보딩 | `onboarding_started` | 온보딩 시작점 |
| 온보딩 | `onboarding_step_viewed` | 온보딩 단계별 이탈 |
| 온보딩 | `onboarding_video_played` | 비디오 시청률 |
| 온보딩 | `onboarding_completed` | 온보딩 완료율 |
| 온보딩 | `onboarding_skipped` | 온보딩 건너뛰기율 |
| 튜토리얼 | `tutorial_share_video_played` | 튜토리얼 효과 |
| 설정 | `account_delete` | 계정 삭제 완료 추적 |
| 앱 | `app_backgrounded` | 앱 사용 패턴 |
| 앱 | `app_foregrounded` | 앱 재진입 패턴 |

---

## 5. 다음 단계

1. [ ] 각 이벤트별 properties 상세 정의
2. [ ] 우선순위 결정 (1순위/2순위/3순위)
3. [ ] 구현 일정 계획
4. [ ] 코드 구현
