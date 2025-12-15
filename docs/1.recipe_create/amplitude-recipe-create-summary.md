# 레시피 생성 Amplitude 이벤트 추적 문서

## 개요

레시피 생성 과정에서 사용자 행동을 추적하기 위한 Amplitude 이벤트 시스템입니다. 두 가지 생성 경로(카드 경로, URL 경로)에 대해 각각 4개씩 총 8개의 이벤트를 추적합니다.

---

## 이벤트 목록

### 카드 경로 (Card Path) - 앱 내 기존 레시피 선택

| 이벤트 이름 | 설명 | 발생 시점 |
|------------|------|----------|
| `recipe_create_start_card` | 레시피 카드 클릭 | 사용자가 레시피 카드를 클릭하여 생성 다이얼로그가 열릴 때 |
| `recipe_create_submit_card` | 생성 버튼 클릭 | 다이얼로그에서 "생성" 버튼을 클릭할 때 |
| `recipe_create_success_card` | 카드 경로 생성 성공 | 레시피 생성이 성공적으로 완료될 때 |
| `recipe_create_fail_card` | 카드 경로 생성 실패 | 레시피 생성이 실패할 때 |

### URL 경로 (URL Path) - 직접 입력 / 외부 공유

| 이벤트 이름 | 설명 | 발생 시점 |
|------------|------|----------|
| `recipe_create_start_url` | URL 입력 모달 열림 | URL 입력 모달이 열릴 때 (세션당 1회) |
| `recipe_create_submit_url` | 완료 버튼 클릭 | 모달에서 "완료" 버튼을 클릭할 때 |
| `recipe_create_success_url` | URL 경로 생성 성공 | 레시피 생성이 성공적으로 완료될 때 |
| `recipe_create_fail_url` | URL 경로 생성 실패 | 레시피 생성이 실패할 때 |

---

## 이벤트 속성 (Attributes)

### 카드 경로 공통 속성

#### Start 이벤트 (`recipe_create_start_card`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `source` | string | 레시피 카드가 표시된 위치 | `popular_normal`, `popular_shorts`, `theme_chef`, `theme_trend`, `search_normal`, `search_shorts`, `cuisine_*`, `recommend_*` |
| `video_type` | string | 비디오 타입 | `NORMAL`, `SHORTS` |
| `recipe_id` | string | 레시피 고유 ID | UUID 형식 |
| `category_type` | string (optional) | 카테고리 타입 | `KOREAN`, `SNACK`, `CHINESE`, `JAPANESE`, `WESTERN`, `DESSERT`, `HEALTHY`, `SIMPLE`, `CHEF`, `TRENDING` |

#### Submit 이벤트 (`recipe_create_submit_card`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `source` | string | 레시피 카드가 표시된 위치 | 동일 |
| `video_type` | string | 비디오 타입 | `NORMAL`, `SHORTS` |
| `category_type` | string (optional) | 카테고리 타입 | 동일 |

#### Success 이벤트 (`recipe_create_success_card`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `source` | string | 레시피 카드가 표시된 위치 | 동일 |
| `video_type` | string | 비디오 타입 | `NORMAL`, `SHORTS` |
| `recipe_id` | string | 레시피 고유 ID | UUID 형식 |
| `recipe_title` | string | 레시피 제목 | 사용자 정의 텍스트 |
| `duration_seconds` | number | 생성 소요 시간 (초) | 양수 |

#### Fail 이벤트 (`recipe_create_fail_card`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `source` | string | 레시피 카드가 표시된 위치 | 동일 |
| `video_type` | string | 비디오 타입 | `NORMAL`, `SHORTS` |
| `recipe_id` | string | 레시피 고유 ID | UUID 형식 |
| `error_type` | string | 오류 타입 | `network`, `server`, `unknown` |
| `error_message` | string | 오류 메시지 | 에러 상세 내용 |
| `duration_seconds` | number | 실패까지 소요 시간 (초) | 양수 |

### URL 경로 공통 속성

#### Start 이벤트 (`recipe_create_start_url`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `entry_point` | string | 진입 경로 | `external_share`, `floating_button` |
| `has_prefilled_url` | boolean | URL 미리 채워짐 여부 | `true`, `false` |

#### Submit 이벤트 (`recipe_create_submit_url`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `entry_point` | string | 진입 경로 | `external_share`, `floating_button` |
| `has_target_category` | boolean | 목표 카테고리 선택 여부 | `true`, `false` |
| `target_category_id` | string (optional) | 선택한 카테고리 ID | 카테고리 UUID |

#### Success 이벤트 (`recipe_create_success_url`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `entry_point` | string | 진입 경로 | `external_share`, `floating_button` |
| `recipe_id` | string | 레시피 고유 ID | UUID 형식 |
| `recipe_title` | string | 레시피 제목 | 사용자 정의 텍스트 |
| `duration_seconds` | number | 생성 소요 시간 (초) | 양수 |
| `has_target_category` | boolean | 목표 카테고리 선택 여부 | `true`, `false` |

#### Fail 이벤트 (`recipe_create_fail_url`)
| 속성 이름 | 타입 | 설명 | 가능한 값 |
|----------|------|------|----------|
| `entry_point` | string | 진입 경로 | `external_share`, `floating_button` |
| `error_type` | string | 오류 타입 | `network`, `server`, `unknown` |
| `error_message` | string | 오류 메시지 | 에러 상세 내용 |
| `duration_seconds` | number | 실패까지 소요 시간 (초) | 양수 |
| `has_target_category` | boolean | 목표 카테고리 선택 여부 | `true`, `false` |

---

## Source 값 상세

### 카드 경로 Source 종류 (8가지)

| Source 값 | 설명 | 위치 |
|----------|------|------|
| `popular_normal` | 인기 레시피 - 일반 영상 | 홈 화면 인기 레시피 섹션 |
| `popular_shorts` | 인기 레시피 - 쇼츠 영상 | 홈 화면 인기 레시피 섹션 |
| `theme_chef` | 테마 레시피 - 쉐프 추천 | 홈 화면 테마 섹션 |
| `theme_trend` | 테마 레시피 - 트렌드 | 홈 화면 테마 섹션 |
| `search_normal` | 검색 결과 - 일반 영상 | 검색 결과 페이지 |
| `search_shorts` | 검색 결과 - 쇼츠 영상 | 검색 결과 페이지 |
| `cuisine_{type}` | 음식 카테고리 결과 | 카테고리 필터 결과 페이지 |
| `recommend_{type}` | 추천 카테고리 결과 | 카테고리 필터 결과 페이지 |

### Category Type 값 (10가지)

#### 음식 카테고리 (CuisineType - 8가지)
- `KOREAN` - 한식
- `SNACK` - 분식
- `CHINESE` - 중식
- `JAPANESE` - 일식
- `WESTERN` - 양식
- `DESSERT` - 디저트
- `HEALTHY` - 건강식
- `SIMPLE` - 간편식

#### 추천 타입 (RecommendType - 2가지)
- `CHEF` - 쉐프 추천
- `TRENDING` - 급상승

---

## 분석 가능한 데이터 및 지표

### 1. 전환율 (Conversion Rates)

#### 카드 경로 전환 퍼널
```
Start → Submit → Success
100%    X%       Y%
```

**측정 가능 지표:**
- **클릭-제출 전환율** = (Submit 수 / Start 수) × 100
- **제출-성공 전환율** = (Success 수 / Submit 수) × 100
- **전체 전환율** = (Success 수 / Start 수) × 100
- **실패율** = (Fail 수 / Submit 수) × 100

#### URL 경로 전환 퍼널
```
Start → Submit → Success
100%    X%       Y%
```

**측정 가능 지표:**
- **모달-제출 전환율** = (Submit 수 / Start 수) × 100
- **제출-성공 전환율** = (Success 수 / Submit 수) × 100
- **전체 전환율** = (Success 수 / Start 수) × 100
- **실패율** = (Fail 수 / Submit 수) × 100

### 2. 성과 지표 (Performance Metrics)

**평균 생성 시간:**
- 카드 경로 평균 `duration_seconds` (Success)
- URL 경로 평균 `duration_seconds` (Success)
- Source별 평균 생성 시간
- Entry point별 평균 생성 시간

**실패 분석:**
- `error_type`별 실패 분포
- 평균 실패 시간 (`duration_seconds` in Fail events)
- Source/Entry point별 실패율

### 3. 사용자 행동 인사이트

#### Source 분석 (카드 경로)
- **가장 많이 사용되는 Source** 식별
- Source별 전환율 비교
- `popular_normal` vs `popular_shorts` 성과 비교
- `theme_chef` vs `theme_trend` 성과 비교
- 검색(`search_*`) vs 홈 화면 성과 비교

#### Entry Point 분석 (URL 경로)
- **External Share vs Floating Button** 성과 비교
- Entry point별 전환율
- `has_prefilled_url`별 전환율 차이

#### Video Type 분석
- **Normal vs Shorts** 선호도 및 성과
- Video type별 전환율 및 성공률
- Video type별 평균 생성 시간

#### Category Type 분석
- **음식 카테고리별 인기도** (8가지 CuisineType)
- 추천 타입별 성과 (`CHEF` vs `TRENDING`)
- 카테고리별 전환율 및 성공률

### 4. 기능 활용도

**목표 카테고리 선택 기능 (URL 경로):**
- `has_target_category = true` 비율
- 카테고리 선택 시 vs 미선택 시 성공률 비교
- 선택된 카테고리 분포 (`target_category_id`)

**외부 공유 기능:**
- `entry_point = external_share` 비율
- `has_prefilled_url = true` 비율
- 외부 공유를 통한 신규 유입 및 전환

### 5. 세그먼트 분석

**고성과 세그먼트:**
- 가장 높은 전환율을 보이는 Source
- 가장 빠른 생성 시간을 보이는 Entry Point
- 가장 낮은 실패율을 보이는 Video Type

**저성과 세그먼트:**
- 높은 이탈률을 보이는 Source
- 긴 생성 시간을 보이는 경로
- 높은 실패율을 보이는 Error Type

### 6. 시계열 분석

**트렌드 추적:**
- 일별/주별/월별 레시피 생성 수
- 카드 경로 vs URL 경로 사용 비율 변화
- Source별 인기도 변화 추이
- Category Type별 계절성 패턴

**코호트 분석:**
- 신규 유저 vs 기존 유저의 생성 경로 선호도
- 시간대별 생성 패턴
- 요일별 Source 선호도

---

## 활용 시나리오

### 제품 최적화
1. **낮은 전환율 Source 개선**: 전환율이 낮은 화면/섹션의 UI/UX 개선
2. **실패율 감소**: `error_type` 분석을 통한 기술적 문제 해결
3. **생성 시간 단축**: 긴 `duration_seconds`를 보이는 경로 최적화

### 마케팅 인사이트
1. **인기 카테고리 파악**: `category_type` 데이터로 콘텐츠 전략 수립
2. **외부 공유 효과 측정**: `external_share` entry point 성과 분석
3. **Video Type 선호도**: Shorts vs Normal 콘텐츠 전략

### 기능 우선순위
1. **고사용 경로 강화**: 높은 사용률을 보이는 Source 개선
2. **저사용 기능 개선/제거**: `has_target_category = false` 비율이 높으면 기능 개선 고려
3. **신규 기능 개발**: 데이터 기반 의사결정

---

## 주요 개선 사항

### 중복 이벤트 방지
- **문제**: URL 입력 모달에서 `start_url` 이벤트가 키 입력마다 중복 발생
- **해결**: `useRef` 플래그를 사용하여 모달 세션당 1회만 발생하도록 개선
- **효과**: 정확한 퍼널 분석 가능

### Category Type 추가
- **목적**: 카테고리별 세분화된 분석
- **범위**: 8가지 음식 카테고리 + 2가지 추천 타입
- **활용**: 카테고리별 성과 비교 및 콘텐츠 전략 수립

### Source 세분화
- **총 8가지 Source**: 홈 화면, 검색, 카테고리별 구분
- **Video Type 구분**: Normal과 Shorts 별도 추적
- **활용**: 화면별/콘텐츠 타입별 성과 분석

---

## 데이터 수집 범위

### 전체 커버리지
- ✅ **카드 경로**: 8개 Source × 2개 Video Type = 16가지 조합
- ✅ **URL 경로**: 2개 Entry Point
- ✅ **카테고리**: 10가지 Category Type (선택적)
- ✅ **성공/실패**: 모든 경로에서 결과 추적
- ✅ **소요 시간**: 모든 성공/실패 케이스에서 측정

### 누락 없는 추적
모든 레시피 생성 시도는 다음 중 하나의 경로로 추적됩니다:
1. **카드 경로**: Start → Submit → (Success | Fail)
2. **URL 경로**: Start → Submit → (Success | Fail)

각 경로는 독립적이며, 모든 단계가 적절한 속성과 함께 기록됩니다.
