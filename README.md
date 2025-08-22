# Sermo

Sermo를 위한 Progressive Web App (PWA)입니다.

## 🚀 PWA 기능

- **오프라인 지원**: 인터넷 연결이 없어도 앱을 사용할 수 있습니다
- **홈 화면 설치**: 모바일 기기의 홈 화면에 앱을 추가할 수 있습니다
- **네이티브 앱 경험**: 브라우저 없이 독립적으로 실행됩니다
- **자동 업데이트**: 새로운 버전이 자동으로 설치됩니다

## 🛠️ 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# PWA 빌드
npm run build:pwa

# PWA 미리보기
npm run preview:pwa
```

## 📱 PWA 설치 방법

### Chrome/Edge (데스크톱)
1. 브라우저에서 앱을 열기
2. 주소창 옆의 설치 아이콘 클릭
3. "설치" 버튼 클릭

### Chrome/Edge (모바일)
1. 브라우저에서 앱을 열기
2. 메뉴 → "홈 화면에 추가" 선택
3. "추가" 버튼 클릭

### Safari (iOS)
1. Safari에서 앱을 열기
2. 공유 버튼 → "홈 화면에 추가" 선택
3. "추가" 버튼 클릭

## 🔧 기술 스택

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin
- **Styling**: Tailwind CSS
- **Router**: TanStack Router

## 📁 프로젝트 구조

```
src/
├── components/          # PWA 설치 프롬프트 등 컴포넌트
├── hooks/              # PWA 상태 관리 훅
├── routes/             # 라우팅 설정
└── global.css          # 전역 스타일

public/
├── manifest.json       # PWA 매니페스트
├── sw.js              # Service Worker
└── icons/             # PWA 아이콘들
```

## 🌐 PWA 테스트

PWA 기능을 테스트하려면:

1. `npm run build:pwa`로 빌드
2. `npm run preview:pwa`로 미리보기
3. Chrome DevTools → Application → Manifest에서 PWA 상태 확인
4. Lighthouse에서 PWA 점수 확인

## 📄 라이선스

MIT License
