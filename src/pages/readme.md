# Pages Layer
가장 중요한 규칙은 특정 페이지에서만 사용되는 컴포넌트의 경우에는 slice내부에만 구현하세요. 

## 🎯 목적
페이지는 사용자가 직접 접근할 수 있는 라우트 단위의 화면을 담당합니다. 비즈니스 로직과 UI 구성을 연결하여 완전한 사용자 경험을 제공합니다.

## 📦 포함되는 것
- **라우트별 페이지 컴포넌트**: 각 URL에 대응하는 메인 화면
- **페이지 레벨 상태 관리**: 해당 페이지에서만 사용되는 로컬 상태
- **페이지 레벨 비즈니스 로직**: 페이지 특화된 데이터 처리 로직
- **섹션과 요소의 조합**: widgets, features, entities를 조합한 완성된 UI
- **페이지에서만 사용되는 요소** : 재사용할 필요 없는 widgets, features 

## ❌ 포함되지 않는 것
- **재사용 가능한 컴포넌트**: widgets, features, entities에서 구현
- **전역 상태**: app layer의 store에서 관리
- **공통 유틸리티**: shared layer에서 제공
- **비즈니스 엔티티**: entities layer에서 정의

## 🔗 의존성 규칙
```
pages는 다음 계층들을 import할 수 있습니다:
✅ widgets - 복합 UI 블록
✅ features - 사용자 상호작용 기능
✅ entities - 비즈니스 엔티티
✅ shared - 공통 유틸리티

❌ app - 상위 계층이므로 import 불가
❌ 다른 pages - 페이지 간 직접 의존성 금지
```

## 세부사항
섹션 간의 배치는 style로 자정하지 말고,
지정된 컴포넌트(SectionSpacing)를 사용하세요.

common 폴더에 있는 모듈은 pages내부에서만 사용하도록 하세요.
