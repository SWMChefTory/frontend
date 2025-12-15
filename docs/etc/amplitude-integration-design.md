# Amplitude React Native 통합 설계 문서

## 1. 개요

Cheftory 앱에 Amplitude Analytics를 통합하기 위한 설계 문서입니다.
WebView(Next.js)에서 발생하는 이벤트를 React Native를 경유하여 Amplitude로 전송하는 Native Bridge 방식을 사용합니다.

### 사용자 식별 방식

- **UUID 기반 식별**: 앱 최초 실행 시 UUID를 생성하여 SecureStore에 저장
- 로그인 여부와 무관하게 동일 UUID 유지
- 앱 삭제 전까지 영구 보존
- 추후 서버에 user_id가 추가되면 연결 가능

### UUID 저장 및 유지 방식

```
SecureStore 저장 위치:
- iOS: Keychain Services (암호화된 시스템 저장소)
- Android: EncryptedSharedPreferences

UUID 유지 규칙:
- 앱 종료 후 재실행 → 기존 UUID 사용
- 로그아웃 후 재로그인 → 기존 UUID 사용
- 다른 계정으로 로그인 → 기존 UUID 사용 (동일 기기)
- 앱 업데이트 → 기존 UUID 사용
- 앱 삭제 후 재설치 → 새 UUID 생성
```

---

## 2. 설치 패키지

```bash
# frontend 폴더에서 실행
npm install @amplitude/analytics-react-native @react-native-async-storage/async-storage @amplitude/plugin-session-replay-react-native uuid

# 타입 정의 (개발 의존성)
npm install --save-dev @types/uuid

# iOS pod 설치
cd ios && pod install
```

| 패키지 | 용도 |
|--------|------|
| `@amplitude/analytics-react-native` | 핵심 SDK |
| `@react-native-async-storage/async-storage` | SDK 필수 의존성 |
| `@amplitude/plugin-session-replay-react-native` | 세션 리플레이 (선택) |
| `uuid` | 고유 사용자 ID 생성 |

---

## 3. 수정이 필요한 파일 목록

### 3.1 신규 생성 파일

| 파일 경로 | 역할 |
|-----------|------|
| `src/modules/shared/analytics/amplitude.ts` | Amplitude 초기화 및 UUID 관리 |
| `src/modules/shared/analytics/amplitudeTracker.ts` | 이벤트 추적 함수 |
| `src/modules/shared/analytics/amplitudeEvents.ts` | 이벤트 타입 정의 (enum) |
| `src/modules/shared/analytics/index.ts` | 통합 export |

### 3.2 수정 필요 파일

| 파일 경로 | 수정 내용 |
|-----------|-----------|
| `src/app/_layout.tsx` | Amplitude 초기화 호출 추가 |
| `src/modules/shared/storage/SecureStorage.tsx` | UUID 저장/조회 함수 추가 |
| `src/pages/webview/message/useHandleMessage.ts` | TRACK_AMPLITUDE 핸들러 추가 |

---

## 4. 상세 설계

### 4.1 신규 파일 구조

```
frontend/src/modules/shared/analytics/
├── amplitude.ts           # 초기화 + UUID 관리
├── amplitudeTracker.ts    # track 래퍼
├── amplitudeEvents.ts     # 이벤트 enum 정의
└── index.ts               # 통합 export
```

---

### 4.2 SecureStorage.tsx - UUID 저장 함수 추가

**추가할 내용**:

```typescript
const AMPLITUDE_USER_ID_KEY = "amplitude_user_id";

export const findAmplitudeUserId = (): string | null => {
  return SecureStore.getItem(AMPLITUDE_USER_ID_KEY);
};

export const storeAmplitudeUserId = async (userId: string) => {
  await SecureStore.setItemAsync(AMPLITUDE_USER_ID_KEY, userId);
};
```

---

### 4.3 amplitude.ts - 초기화 모듈

**역할**: UUID 생성/조회, Amplitude SDK 초기화, Session Replay 설정

```typescript
import { init, add } from '@amplitude/analytics-react-native';
import { SessionReplayPlugin } from '@amplitude/plugin-session-replay-react-native';
import { v4 as uuidv4 } from 'uuid';
import {
  findAmplitudeUserId,
  storeAmplitudeUserId,
} from '../storage/SecureStorage';

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY!;

// UUID 조회 또는 생성 (있으면 재사용, 없으면 생성)
const getOrCreateUserId = async (): Promise<string> => {
  let userId = findAmplitudeUserId();

  if (!userId) {
    userId = uuidv4();
    await storeAmplitudeUserId(userId);
  }

  return userId;
};

// Amplitude 초기화
export const initAmplitude = async () => {
  const userId = await getOrCreateUserId();

  await init(AMPLITUDE_API_KEY, userId).promise;
  await add(new SessionReplayPlugin({ sampleRate: 1 })).promise;
};
```

**UUID 생성 로직 설명**:
1. `findAmplitudeUserId()`로 SecureStore에서 기존 UUID 조회
2. 없으면 `uuidv4()`로 새 UUID 생성 후 저장
3. 있으면 기존 UUID 그대로 반환
4. → 앱 삭제 전까지 동일 UUID 유지

---

### 4.4 amplitudeTracker.ts - 추적 함수

**역할**: WebView/Native에서 호출하는 이벤트 추적 래퍼

```typescript
import { track } from '@amplitude/analytics-react-native';
import { Platform } from 'react-native';

// WebView에서 호출되는 이벤트 추적
export const trackFromWebView = (
  eventName: string,
  properties?: Record<string, any>
) => {
  track(eventName, {
    ...properties,
    source: 'webview',
    platform: Platform.OS,
  });
};

// Native에서 직접 호출하는 이벤트 추적
export const trackNative = (
  eventName: string,
  properties?: Record<string, any>
) => {
  track(eventName, {
    ...properties,
    source: 'native',
    platform: Platform.OS,
  });
};
```

---

### 4.5 amplitudeEvents.ts - 이벤트 타입

**역할**: 타입 안전성을 위한 이벤트 enum (나중에 필요할 때 추가)

```typescript
// 이벤트 이름 enum - 필요할 때 추가
export enum AmplitudeEvent {
  // 레시피 관련
  RECIPE_CREATE = 'recipe_create',
  RECIPE_VIEW = 'recipe_view',

  // 조리 관련
  COOKING_START = 'cooking_start',
  COOKING_END = 'cooking_end',

  // 필요할 때 계속 추가...
}
```

---

### 4.6 index.ts - 통합 export

```typescript
export { initAmplitude } from './amplitude';
export { trackFromWebView, trackNative } from './amplitudeTracker';
export { AmplitudeEvent } from './amplitudeEvents';
```

---

## 5. 기존 파일 수정 상세

### 5.1 src/app/_layout.tsx

**수정 위치**: RootLayout 컴포넌트 내 useEffect 추가

```typescript
import { initAmplitude } from '@/src/modules/shared/analytics';

export default function RootLayout() {
  // 기존 훅들...

  // Amplitude 초기화 추가
  useEffect(() => {
    initAmplitude();
  }, []);

  // 기존 return...
}
```

---

### 5.2 src/pages/webview/message/useHandleMessage.ts

**수정 위치 1**: payloadType enum에 추가

```typescript
enum payloadType {
  // 기존 타입들...
  TRACK_AMPLITUDE = "TRACK_AMPLITUDE",  // 추가
}
```

**수정 위치 2**: import 추가

```typescript
import { trackFromWebView } from '@/src/modules/shared/analytics';
```

**수정 위치 3**: UNBLOCKING switch문 내부에 case 추가

```typescript
case payloadType.TRACK_AMPLITUDE: {
  const { eventName, properties } = req.payload;
  trackFromWebView(eventName, properties);
  break;
}
```

---

## 6. 데이터 흐름

```
┌─────────────────────────────────────────────────────────────┐
│  앱 최초 실행                                                │
├─────────────────────────────────────────────────────────────┤
│  1. SecureStore에서 amplitude_user_id 확인                  │
│  2. 없으면 → UUID 생성 → 저장                               │
│     있으면 → 기존 UUID 사용                                  │
│  3. Amplitude 초기화 (userId: UUID)                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  WebView에서 이벤트 발생                                     │
├─────────────────────────────────────────────────────────────┤
│  request(MODE.UNBLOCKING, 'TRACK_AMPLITUDE', {              │
│    eventName: 'recipe_create',                              │
│    properties: { recipe_id: '123', source: 'youtube_direct' }│
│  })                                                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  React Native (useHandleMessage.ts)                         │
├─────────────────────────────────────────────────────────────┤
│  case TRACK_AMPLITUDE:                                       │
│    trackFromWebView(eventName, properties)                  │
│    → 플랫폼 정보 추가 (iOS/Android)                          │
│    → track() 호출                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Amplitude 서버                                              │
├─────────────────────────────────────────────────────────────┤
│  user_id: "a1b2c3d4-e5f6-..." (UUID)                        │
│  device_id: (자동 생성)                                      │
│  event: "recipe_create"                                      │
│  properties: { recipe_id, source, platform }                │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. 이벤트 추가 방법 (나중에)

WebView에서 새로운 이벤트를 추적하고 싶을 때:

### Step 1: (선택) enum에 이벤트 추가

```typescript
// frontend/src/modules/shared/analytics/amplitudeEvents.ts
export enum AmplitudeEvent {
  // 기존...
  VOICE_COMMAND_USED = 'voice_command_used',  // 추가
}
```

### Step 2: WebView에서 호출

```typescript
// webview-v2 어딘가에서
request(MODE.UNBLOCKING, 'TRACK_AMPLITUDE', {
  eventName: 'voice_command_used',
  properties: {
    command: 'next_step',
    recipe_id: '123'
  }
});
```

enum은 타입 안전성을 위한 것이며, 문자열로 바로 전송해도 동작합니다.

---

## 8. 환경 변수

`.env` 파일에 추가:

```env
EXPO_PUBLIC_AMPLITUDE_API_KEY=your_amplitude_api_key_here
```

---

## 9. UUID vs 서버 user_id

### 현재 (UUID 방식)

| 분석 가능 | 예시 |
|-----------|------|
| ✅ 사용자별 레시피 생성 수 | UUID "a1b2c3d4..."가 레시피 5개 생성 |
| ✅ 사용자별 조리 완료율 | UUID "a1b2c3d4..."의 조리 완료 3/5 |
| ✅ 평균 사용 패턴 | 평균 사용자당 레시피 2.3개 |
| ✅ 이벤트에 포함된 모든 정보 | recipe_id, recipe_title 등 |

### 추후 서버 연동 시 추가 가능

서버 API에서 user_id를 반환하면:

```typescript
// amplitude.ts에 추가
import { setUserId, Identify, identify } from '@amplitude/analytics-react-native';

export const linkServerUserId = (serverUserId: number) => {
  setUserId(serverUserId.toString());

  const identifyObj = new Identify();
  identifyObj.set('server_user_id', serverUserId);
  identify(identifyObj);
};
```

---

## 10. 구현 순서

1. **패키지 설치**

   ```bash
   npm install @amplitude/analytics-react-native @react-native-async-storage/async-storage @amplitude/plugin-session-replay-react-native uuid
   npm install --save-dev @types/uuid
   cd ios && pod install
   ```

2. **SecureStorage.tsx 수정**
   - UUID 저장/조회 함수 추가

3. **analytics 모듈 생성**
   - amplitude.ts
   - amplitudeTracker.ts
   - amplitudeEvents.ts
   - index.ts

4. **_layout.tsx 수정**
   - initAmplitude() 호출 추가

5. **useHandleMessage.ts 수정**
   - TRACK_AMPLITUDE 핸들러 추가

6. **환경 변수 설정**
   - .env에 API 키 추가

7. **테스트**
   - Development Build에서 이벤트 전송 확인

---

## 11. 주의사항

1. **Expo Go 미지원**: Development Build 또는 EAS Build 필요
2. **API Key 보안**: 환경 변수로 관리, 절대 하드코딩 금지
3. **UUID 특성**: 앱 삭제 시 새 UUID 생성됨 (새 사용자로 인식)
4. **Session Replay sampleRate**: 1 = 100% 녹화, 0.5 = 50% 녹화, 필요에 따라 조정

---

## 12. 참고 자료

- [Amplitude React Native SDK 공식 문서](https://amplitude.com/docs/sdks/analytics/react-native/react-native-sdk)
- [Amplitude 사용자 식별 가이드](https://amplitude.com/docs/get-started/identify-users)
- [Session Replay React Native Plugin](https://amplitude.com/docs/session-replay/session-replay-react-native-sdk-plugin)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/)
