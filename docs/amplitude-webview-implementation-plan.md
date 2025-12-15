# Amplitude WebView 구현 단위

> `amplitude-events-final.md` 기준 WebView 이벤트 35개를 5개 구현 단위로 분류

---

## 구현 단위 1: 레시피 생성 + 온보딩/튜토리얼 (11개)

### 1. 레시피 생성 (4개)
- `recipe_create_start`
- `recipe_create_submit`
- `recipe_create_success`
- `recipe_create_fail`

### 11. 온보딩/튜토리얼 (8개)
- `tutorial_share_view`
- `tutorial_share_youtube_click`
- `tutorial_share_direct_click`
- `tutorial_share_dismiss`
- `tutorial_handsfree_view`
- `tutorial_handsfree_skip`
- `tutorial_step_start`
- `tutorial_step_end`

---

## 구현 단위 2: 레시피 상세 + 쿠팡 (5개)

### 2. 레시피 상세 (2개)
- `recipe_detail_view`
- `recipe_detail_tab_view`

### 3. 쿠팡 (3개)
- `coupang_modal_open`
- `coupang_product_click`
- `coupang_modal_close`

---

## 구현 단위 3: 홈 + 검색 + 카테고리 (7개)

### 9. 홈 (2개)
- `home_view`
- `popular_recipe_click`

### 8. 검색 (2개)
- `search_submit`
- `search_result_click`

### 10. 카테고리 (3개)
- `category_select`
- `category_action`
- `recipe_category_change`

---

## 구현 단위 4: 설정/계정 (3개)

### 12. 설정/계정 (3개)
- `withdrawal_start`
- `withdrawal_feedback_submit`
- `account_delete`

---

## 구현 단위 5: 조리 화면 (9개)

### 4. 조리 모드 (4개)
- `cooking_start`
- `cooking_complete`
- `cooking_exit`
- `step_navigate`

### 5. 타이머 (2개)
- `timer_start`
- `timer_complete`

### 6. 음성 제어 (1개)
- `voice_command`

### 7. 유튜브 비디오 (2개)
- `video_play`
- `video_seek`

---

## 요약

| 구현 단위 | 카테고리 | 이벤트 수 |
|----------|---------|----------|
| 1 | 레시피 생성 + 온보딩/튜토리얼 | 12개 |
| 2 | 레시피 상세 + 쿠팡 | 5개 |
| 3 | 홈 + 검색 + 카테고리 | 7개 |
| 4 | 설정/계정 | 3개 |
| 5 | 조리 화면 | 9개 |
| **합계** | | **36개** |
