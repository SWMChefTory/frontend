# Amplitude 세션 리플레이 웹뷰 이슈

## 개요

현재 앱은 네이티브(React Native)와 웹뷰(Next.js)로 구성되어 있으며, Amplitude SDK는 네이티브에서만 초기화되어 있습니다. 이로 인해 세션 리플레이가 웹뷰 내부 UI를 캡처하지 못하는 문제가 있습니다.

---

## 현재 구조

```
┌─────────────────────────────────────────────────────────────┐
│  Native App (React Native)                                  │
│  - @amplitude/analytics-react-native                       │
│  - @amplitude/plugin-session-replay-react-native           │
│  - 세션 리플레이: 네이티브 화면만 녹화 ✅                    │
└─────────────────────────────────────────────────────────────┘
          │
          │ WebView (react-native-webview)
          ↓
┌─────────────────────────────────────────────────────────────┐
│  WebView (Next.js)                                          │
│  - Amplitude SDK 없음                                       │
│  - track() → 브릿지 → Native SDK 호출                       │
│  - 세션 리플레이: 녹화 불가 ❌                               │
└─────────────────────────────────────────────────────────────┘
```

### 이벤트 추적 흐름 (현재)

```typescript
// WebView에서 이벤트 발생
track(AMPLITUDE_EVENT.RECIPE_CREATE_START_CARD, { ... });
    ↓
// 브릿지를 통해 네이티브로 전달
request(MODE.UNBLOCKING, "TRACK_AMPLITUDE", { eventName, properties });
    ↓
// 네이티브에서 Amplitude SDK 호출
trackFromWebView(eventName, { ...properties, source: "webview" });
```

**이벤트 추적**: ✅ 정상 동작
**세션 리플레이**: ❌ 웹뷰 UI 미캡처

---

## 문제점

### 세션 리플레이 제한

| 영역 | 세션 리플레이 | 이유 |
|------|-------------|------|
| 네이티브 화면 | ✅ 가능 | Native SDK에서 직접 캡처 |
| 웹뷰 내부 | ❌ 불가능 | 웹뷰는 별도 렌더링 엔진 |

### 웹뷰가 캡처되지 않는 이유

1. **별도 렌더링 엔진**: 웹뷰는 독립된 WebKit/Chromium에서 렌더링
2. **SDK 분리**: 네이티브 SDK ≠ 웹 SDK
3. **보안 샌드박스**: 웹뷰 내부 DOM에 네이티브 직접 접근 불가

---

## 해결 방안

### 방안 1: 세션 리플레이 전용 Web SDK (권장)

**개념**: 이벤트 추적은 기존 브릿지 방식 유지, 세션 리플레이만 Web SDK로 추가

```
┌─────────────────────────────────────────────────────────────┐
│  WebView (Next.js)                                          │
│                                                             │
│  [이벤트 추적] track() → 브릿지 → Native SDK (기존 유지)    │
│  [세션 리플레이] Web SDK → 웹뷰 DOM 녹화 (신규)             │
└─────────────────────────────────────────────────────────────┘
```

**장점**:
- 기존 이벤트 로직 수정 없음 (42개 track() 호출 유지)
- 이벤트 중복 발생 없음
- 웹뷰 UI 상세 녹화 가능

**단점**:
- User ID / Device ID / Session ID 동기화 필요
- 구현 복잡도 증가

### 방안 2: 완전 전환 (Web SDK만 사용)

웹뷰의 모든 이벤트를 Web SDK로 전환하고 브릿지 제거

**장점**: 깔끔한 구조
**단점**: 대규모 리팩토링 필요 (42개 위치 수정)

### 방안 3: 현재 상태 유지

세션 리플레이 없이 이벤트 기반 분석에 집중

**장점**: 추가 개발 없음
**단점**: 시각적 녹화 불가

---

## 권장 방안: 세션 리플레이 전용 Web SDK

### 구현 개요

#### 1단계: 네이티브에서 세션 정보 전달

```typescript
// frontend/src/pages/webview/WebViewScreen.tsx
import { getSessionId, getDeviceId } from '@amplitude/analytics-react-native';
import { findAmplitudeUserId } from '@/modules/shared/storage/SecureStorage';

const amplitudeConfig = {
  userId: findAmplitudeUserId(),
  deviceId: getDeviceId(),
  sessionId: getSessionId(),
};

// 웹뷰 로드 시 전달
webViewRef.current?.injectJavaScript(`
  window.AMPLITUDE_CONFIG = ${JSON.stringify(amplitudeConfig)};
  window.dispatchEvent(new Event('amplitudeConfigReady'));
`);
```

#### 2단계: 웹뷰에서 세션 리플레이 초기화

```typescript
// webview-v2/src/shared/analytics/sessionReplay.ts
import { init, setDeviceId } from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!;

export const initSessionReplay = () => {
  const config = (window as any).AMPLITUDE_CONFIG;
  if (!config) {
    console.warn('[SessionReplay] AMPLITUDE_CONFIG not found');
    return;
  }

  // 이벤트 자동 수집 비활성화 (브릿지로 전송하므로)
  init(AMPLITUDE_API_KEY, config.userId, {
    defaultTracking: false,
    deviceId: config.deviceId,
    sessionId: config.sessionId,
  });

  // 세션 리플레이 플러그인만 추가
  add(sessionReplayPlugin({ sampleRate: 1 }));

  console.log('[SessionReplay] Initialized with config:', config);
};
```

#### 3단계: 앱 진입점에서 초기화

```typescript
// webview-v2/src/pages/_app.tsx
import { useEffect } from 'react';
import { initSessionReplay } from '@/shared/analytics/sessionReplay';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const handleConfigReady = () => {
      initSessionReplay();
    };

    if ((window as any).AMPLITUDE_CONFIG) {
      initSessionReplay();
    } else {
      window.addEventListener('amplitudeConfigReady', handleConfigReady);
    }

    return () => {
      window.removeEventListener('amplitudeConfigReady', handleConfigReady);
    };
  }, []);

  return <Component {...pageProps} />;
}
```

### 세션 갱신 처리

네이티브에서 세션이 갱신되면 웹뷰에도 전달:

```typescript
// Native - 세션 변경 감지 (앱이 백그라운드에서 복귀 시)
import { setSessionId } from '@amplitude/analytics-react-native';

const handleAppStateChange = (nextAppState: AppStateStatus) => {
  if (nextAppState === 'active') {
    const newSessionId = getSessionId();
    webViewRef.current?.injectJavaScript(`
      window.updateAmplitudeSession && window.updateAmplitudeSession(${newSessionId});
    `);
  }
};
```

```typescript
// WebView - 세션 업데이트 함수
(window as any).updateAmplitudeSession = (newSessionId: number) => {
  setSessionId(newSessionId);
  console.log('[SessionReplay] Session updated:', newSessionId);
};
```

---

## 세션 동기화 검증

### 예상 결과

| 항목 | Native SDK | Web SDK |
|------|-----------|---------|
| User ID | abc-123 | abc-123 (동일) |
| Device ID | xyz-789 | xyz-789 (동일) |
| Session ID | 1234567890 | 1234567890 (동일) |
| 이벤트 기록 | ✅ | ❌ (비활성화) |
| 세션 리플레이 | 네이티브 화면 | 웹뷰 DOM |

### Amplitude 대시보드 확인 사항

- 동일 사용자로 인식 (User ID 일치)
- 이벤트와 세션 리플레이가 연결됨
- 세션 수가 중복되지 않음 (1개)

---

## 주의사항

### 이벤트 중복 방지

Web SDK에서 `defaultTracking: false` 설정 필수:

```typescript
init(API_KEY, userId, {
  defaultTracking: false,  // 자동 이벤트 비활성화
});
```

이 설정 없이 초기화하면:
- Page View 이벤트 중복
- Session Start/End 이벤트 중복
- 기타 자동 수집 이벤트 중복

### 비용 고려

세션 리플레이는 스토리지 사용량에 따라 비용 발생:
- 네이티브 리플레이 + 웹뷰 리플레이 = 스토리지 2배
- 필요시 네이티브 세션 리플레이 비활성화 고려

### API Key 보안

Web SDK는 브라우저에서 실행되어 API Key 노출:
- 프로덕션 환경에서는 허용된 도메인만 설정
- Amplitude 대시보드에서 도메인 화이트리스트 설정

---

## 구현 체크리스트

### 네이티브 (frontend)

- [ ] `getSessionId`, `getDeviceId` import 추가
- [ ] 웹뷰 로드 시 AMPLITUDE_CONFIG 전달
- [ ] 앱 상태 변경 시 세션 ID 동기화

### 웹뷰 (webview-v2)

- [ ] `@amplitude/analytics-browser` 설치
- [ ] `@amplitude/plugin-session-replay-browser` 설치
- [ ] `sessionReplay.ts` 파일 생성
- [ ] `_app.tsx`에서 초기화 로직 추가
- [ ] `updateAmplitudeSession` 전역 함수 등록
- [ ] 환경 변수에 `NEXT_PUBLIC_AMPLITUDE_API_KEY` 추가

### 검증

- [ ] 개발 환경에서 세션 리플레이 녹화 확인
- [ ] Amplitude 대시보드에서 세션 연결 확인
- [ ] 이벤트 중복 발생 여부 확인
- [ ] 세션 수 정상 집계 확인

---

## 관련 파일

| 파일 | 설명 |
|------|------|
| [frontend/src/modules/shared/analytics/amplitude.ts](../../../src/modules/shared/analytics/amplitude.ts) | Native SDK 초기화 |
| [frontend/src/modules/shared/analytics/amplitudeTracker.ts](../../../src/modules/shared/analytics/amplitudeTracker.ts) | trackFromWebView, trackNative |
| [webview-v2/src/shared/analytics/amplitude.ts](../../../../webview-v2/src/shared/analytics/amplitude.ts) | 브릿지 track() 함수 |
| [webview-v2/src/shared/analytics/amplitudeEvents.ts](../../../../webview-v2/src/shared/analytics/amplitudeEvents.ts) | 이벤트 상수 정의 |

---

## 참고 자료

- [Amplitude Session Replay for React Native](https://amplitude.com/docs/session-replay/session-replay-react-native)
- [Amplitude Session Replay for Web](https://amplitude.com/docs/session-replay/session-replay-browser)
- [Amplitude Browser SDK](https://amplitude.com/docs/sdks/analytics/browser)
