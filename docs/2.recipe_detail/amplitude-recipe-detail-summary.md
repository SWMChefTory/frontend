# 레시피 상세 페이지 Amplitude 이벤트 추적 문서

## 개요

레시피 상세 페이지에서 사용자가 어떻게 레시피를 탐색하고, 영상을 시청하며, 요리를 시작하는지 추적합니다. 총 6개의 이벤트로 페이지 진입부터 요리 시작까지의 전체 사용자 여정을 추적합니다.

---

## 이벤트 목록

| 이벤트 이름 | 설명 | 발생 시점 | 우선순위 |
|------------|------|----------|---------|
| `recipe_detail_view` | 페이지 진입 | 페이지 컴포넌트 마운트 시 | 🔴 High |
| `recipe_detail_exit` | 페이지 이탈 | 페이지 컴포넌트 언마운트 시 | 🔴 High |
| `recipe_detail_tab_click` | 탭 클릭 | 요약/레시피/재료 탭 클릭 시 | 🔴 High |
| `recipe_detail_video_seek` | 스텝으로 영상 이동 | 레시피 탭에서 스텝 세부 항목 클릭 시 | 🟡 Medium |
| `recipe_detail_feature_click` | 부가 기능 클릭 | 타이머 또는 계량법 버튼 클릭 시 | 🟢 Low |
| `recipe_detail_cooking_start` | 요리 시작 | "요리 시작" 버튼 클릭 시 | 🔴 High |

---

## 이벤트 속성 (Attributes)

### 1. View 이벤트 (`recipe_detail_view`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `recipe_title` | string | 레시피 제목 | `"김치찌개 만들기"` |
| `is_first_view` | boolean | 첫 진입 여부 (1시간 기준) | `true`, `false` |
| `total_steps` | number | 전체 스텝 수 | `5` |
| `total_ingredients` | number | 전체 재료 수 | `8` |
| `has_video` | boolean | 영상 존재 여부 | `true`, `false` |

**`is_first_view` 판단 기준:**

| 상황 | is_first_view | 설명 |
|------|---------------|------|
| 홈/검색에서 첫 진입 | `true` | 신규 조회 |
| 요리모드 → 뒤로가기 (30분) | `false` | 1시간 이내 재진입 |
| 요리모드 → 뒤로가기 (2시간) | `true` | 1시간 초과로 신규 취급 |
| 다른 레시피 진입 | `true` | 레시피별로 별도 관리 |

### 2. Exit 이벤트 (`recipe_detail_exit`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `stay_duration` | number | 페이지 체류 시간 (초) | `45` |
| `tab_switch_count` | number | 탭 전환 횟수 | `3` |
| `final_tab` | string | 마지막으로 본 탭 | `"summary"`, `"recipe"`, `"ingredients"` |
| `reached_cooking_start` | boolean | 요리 시작까지 도달했는지 | `true`, `false` |

### 3. Tab Click 이벤트 (`recipe_detail_tab_click`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `tab_name` | string | 클릭한 탭 이름 | `"summary"`, `"recipe"`, `"ingredients"` |
| `time_since_view` | number | 페이지 진입 후 경과 시간 (초) | `12` |

### 4. Video Seek 이벤트 (`recipe_detail_video_seek`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `step_order` | number | 클릭한 스텝 순서 | `2` |
| `step_title` | string | 스텝 제목 | `"재료 손질하기"` |
| `video_time` | number | 이동한 영상 시간 (초) | `125` |

### 5. Feature Click 이벤트 (`recipe_detail_feature_click`)

| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `feature_type` | string | 클릭한 기능 타입 | `"timer"`, `"measurement"` |
| `current_tab` | string | 클릭 시점의 현재 탭 | `"summary"`, `"recipe"`, `"ingredients"` |

### 6. Cooking Start 이벤트 (`recipe_detail_cooking_start`)

| 속성 이름 | 타입 | 설명 | 예시 값 |
|----------|------|------|--------|
| `recipe_id` | string | 레시피 고유 ID | `"abc-123-def"` |
| `time_to_start` | number | 페이지 진입부터 요리 시작까지 시간 (초) | `90` |
| `tab_switch_count` | number | 요리 시작까지 탭 전환 횟수 | `2` |
| `ingredient_prepared_count` | number | 준비 완료한 재료 개수 | `5` |

---

## 분석 가능한 데이터 및 지표

### 1. 전환율 (Conversion Rates)

#### 메인 퍼널
```
View → Cooking Start
100%    X%
```

**측정 가능 지표:**
- **조회-요리시작 전환율** = (Cooking Start 수 / View 수) × 100
- **순수 조회 전환율** = (Cooking Start 수 / View(is_first_view=true) 수) × 100

### 2. 참여도 지표 (Engagement Metrics)

**체류 시간 분석:**
- 평균 체류 시간 (`stay_duration` 평균)
- 체류 시간 분포 (0-30초, 30-60초, 1-3분, 3분 이상)
- 요리 시작한 사용자 vs 이탈 사용자의 체류 시간 비교

**탭 활용 분석:**
- 평균 탭 전환 횟수 (`tab_switch_count` 평균)
- 탭별 클릭 비율 (`tab_name` 분포)
- 최종 이탈 탭 분포 (`final_tab` 분포)

### 3. 사용자 행동 인사이트

#### 탭 선호도 분석
| 분석 항목 | 활용 데이터 |
|----------|------------|
| 가장 많이 클릭되는 탭 | `tab_name` 분포 |
| 탭 클릭 시점 패턴 | `time_since_view` 평균 |
| 이탈 직전 탭 | `final_tab` 분포 |

#### 영상 연동 기능 활용도
| 분석 항목 | 활용 데이터 |
|----------|------------|
| 스텝-영상 연동 사용률 | Video Seek 이벤트 발생 비율 |
| 많이 참조되는 스텝 | `step_order` 분포 |
| 영상 탐색 시간대 | `video_time` 분포 |

#### 부가 기능 활용도
| 분석 항목 | 활용 데이터 |
|----------|------------|
| 타이머 vs 계량법 선호도 | `feature_type` 분포 |
| 기능 클릭 시점 탭 | `current_tab` 분포 |

### 4. 요리 시작 분석

**전환 패턴 분석:**
- 요리 시작까지 평균 소요 시간 (`time_to_start` 평균)
- 재료 준비 정도와 전환율 상관관계 (`ingredient_prepared_count`)
- 탭 전환 횟수와 전환율 상관관계 (`tab_switch_count`)

**최적 전환 조건 파악:**
- 높은 전환율을 보이는 체류 시간 구간
- 최적의 탭 탐색 패턴

### 5. 세그먼트 분석

**고전환 세그먼트:**
- 평균 이상 체류 + 요리 시작
- 다수 탭 탐색 + 요리 시작
- 재료 체크 완료 + 요리 시작

**저전환 세그먼트:**
- 짧은 체류 + 이탈
- 단일 탭만 조회 + 이탈
- 요약 탭에서 이탈 (레시피/재료 미확인)

### 6. 시계열 분석

**트렌드 추적:**
- 일별/주별 레시피 상세 조회 수
- 시간대별 요리 시작 패턴
- 요일별 전환율 변화

---

## 활용 시나리오

### 제품 최적화

| 인사이트 | 개선 액션 |
|----------|----------|
| 요약 탭 이탈률 높음 | 요약 탭 콘텐츠 강화, CTA 추가 |
| 재료 탭 체류 시간 김 | 재료 준비 체크리스트 UX 개선 |
| 스텝-영상 연동 사용률 낮음 | 기능 가시성 개선, 온보딩 추가 |
| 타이머 기능 사용률 낮음 | 버튼 위치/디자인 개선 |

### 콘텐츠 전략

| 인사이트 | 콘텐츠 액션 |
|----------|------------|
| 특정 스텝 조회 집중 | 해당 스텝 영상 퀄리티 강화 |
| 재료 준비 완료율 낮음 | 대체 재료 정보 추가 |
| 계량법 사용률 높음 | 계량 가이드 콘텐츠 강화 |

### 마케팅 인사이트

| 인사이트 | 마케팅 액션 |
|----------|------------|
| 조회-요리시작 전환율 | 앱 스토어 메시지에 전환율 활용 |
| 평균 체류 시간 | 사용자 참여도 마케팅 지표로 활용 |
| 인기 레시피 패턴 | 콘텐츠 추천 알고리즘 개선 |

---

## 주요 구현 사항

### is_first_view 로직
- **목적**: 순수 신규 조회와 재진입(요리모드 뒤로가기 등) 구분
- **구현**: sessionStorage에 레시피별 마지막 조회 시간 저장, 1시간 기준 판단
- **활용**: 순수 페이지뷰 = `is_first_view: true` 필터링

### 콜백 Props 패턴
- **목적**: RecipeBottomSheet 내 사용자 인터랙션을 부모 컴포넌트에서 추적
- **구현**: onTabClick, onStepClick, onMeasurementClick, onCookingStart 콜백
- **장점**: Amplitude 추적 로직을 페이지 레벨에서 중앙 관리

### 타이머 버튼 이벤트 버블링
- **목적**: TimerBottomSheet 내부 구조 변경 없이 클릭 추적
- **구현**: wrapper div로 클릭 이벤트 캡처 (이벤트 버블링 활용)
- **효과**: 바텀시트 열림 + Amplitude 이벤트 발생 동시 처리

---

## 데이터 수집 범위

### 전체 커버리지
- ✅ **페이지 진입/이탈**: View, Exit 이벤트
- ✅ **탭 탐색**: Tab Click 이벤트
- ✅ **영상 연동**: Video Seek 이벤트
- ✅ **부가 기능**: Feature Click 이벤트 (타이머, 계량법)
- ✅ **최종 전환**: Cooking Start 이벤트

### 사용자 여정 추적
```
View → Tab Click(s) → Video Seek(s) → Feature Click(s) → Cooking Start
  ↓         ↓              ↓               ↓                 ↓
진입     탭 탐색      영상 시청       기능 활용         요리 시작
                                                         ↓
                                                       Exit
                                                      (이탈)
```

모든 단계가 적절한 속성과 함께 기록되며, Exit 이벤트에서 전체 세션 요약이 수집됩니다.
