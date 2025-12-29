# Changelog

모든 주요 변경사항은 이 파일에 기록됩니다.

포맷은 [Keep a Changelog](https://keepachangelog.com/ko/1.0.0/)를 따르며,
이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 준수합니다.

---

## [Unreleased]

### 추가 예정
- 준비 중인 기능들

### 수정 예정
- 알려진 버그들

---

## [1.0.11] - 2025-12-29

### 추가

- **앱 이름 지역화**: 기기 시스템 언어에 따라 앱 이름이 자동으로 변경
  - 영어 설정 시: "Cheftory"
  - 한국어 설정 시: "쉐프토리"
  - iOS/Android 양쪽 플랫폼 모두 지원
- **Amplitude 네이티브 통합**: 앱 분석을 위한 Amplitude SDK를 네이티브 레벨에서 통합하여 더 정확한 사용자 행동 추적 가능
- **지역 감지 기능**: 서버로부터 IP 정보를 받아 국내/해외 사용자를 자동 판단
  - 해외 사용자를 위한 영문 로고 및 번역 지원
  - 지역별 맞춤 콘텐츠 제공

### 수정

- **공유하기 배경 투명화 버그 수정**: iOS Share Extension 및 Android Share Activity에서 배경이 투명하게 표시되지 않던 문제 해결

### 배포 정보

- **iOS**: v1.0.11 (빌드 4) - App Store 심사 완료 및 배포됨
- **Android**: v1.0.11 (versionCode 43) - Google Play 심사 완료 및 배포됨

---

## [1.0.10] - 2025-01-XX

### 추가
- 초기 출시 버전
- Apple Sign In 및 Google Sign In 인증 지원
- WebView 기반 레시피 뷰어
- 타이머 기능 및 푸시 알림
- 유튜브 영상 공유 기능 (iOS Share Extension, Android Share Target)

---

## Release Notes (앱 스토어/플레이 스토어용)

### v1.0.11

**🌍 글로벌 지원 강화**
- 해외 사용자를 위한 자동 지역 감지 및 영문 지원
- 사용자 위치에 맞는 맞춤형 콘텐츠 제공

**📊 개선사항**
- 앱 성능 분석 시스템 개선
- 공유하기 화면 버그 수정

---

## Technical Details (개발팀용)

### v1.0.11 - 상세 변경사항

#### Frontend (React Native/Expo)
- **Amplitude Integration**:
  - Package: `@amplitude/analytics-react-native: ^1.5.16`
  - 익명 사용자 → 로그인 사용자 전환 추적
  - Device ID 기반 사용자 식별

- **Region Detection**:
  - IP 기반 국가 판단 (서버 API 연동)
  - `expo-localization` 활용한 로케일 감지
  - 국내/해외 분기 처리 로직 구현

- **Internationalization**:
  - 해외 사용자용 영문 로고 추가
  - 주요 UI 문구 번역 (한국어/영어)

#### iOS Native
- **Share Extension 투명화 수정**:
  - `ShareViewController.swift`: 배경 투명도 설정
  - `ShareExtensionView.swift`: SwiftUI Color.clear 적용
  - Presentation container 투명화 처리

#### Android Native
- **Share Activity 투명화 수정**:
  - `withShareActivity.js`: 레이아웃 배경 투명도 수정
  - FrameLayout 투명 배경 적용 (`#80000000`)

---

## [이전 버전들]

이전 버전 히스토리는 Git 태그를 참고하세요.
