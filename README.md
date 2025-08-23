# Sermo

Sermo를 위한 Progressive Web App (PWA)입니다.

## 🚀 PWA 기능

- **오프라인 지원**: 인터넷 연결이 없어도 앱을 사용할 수 있습니다
- **홈 화면 설치**: 모바일 기기의 홈 화면에 앱을 추가할 수 있습니다
- **네이티브 앱 경험**: 브라우저 없이 독립적으로 실행됩니다
- **자동 업데이트**: 새로운 버전이 자동으로 설치됩니다

## 💬 채팅 기능

- **SSE 통신**: Server-Sent Events를 통한 실시간 채팅
- **세션 관리**: 채팅방 입장/퇴장 시 자동 세션 정리
- **챗봇 연동**: 백엔드 API와 연동된 챗봇 시스템
- **실시간 응답**: 타이핑 인디케이터와 실시간 메시지 수신

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

## ⚙️ 환경 설정

### API 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# API 설정
VITE_API_BASE_URL=http://localhost:3000

# 개발 환경 설정
VITE_NODE_ENV=development
```

### 백엔드 연동
- `sermo-be` 서버가 실행 중이어야 합니다
- 기본 포트: 3000
- 인증 토큰 기반 API 통신

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
- **API**: Fetch API + SSE (Server-Sent Events)

## 📁 프로젝트 구조

```
src/
├── components/          # PWA 설치 프롬프트 등 컴포넌트
│   └── chat/          # 채팅 관련 컴포넌트
│       ├── ChatHeader.tsx    # 채팅 헤더 (뒤로가기, 세션 정리)
│       ├── ChatInput.tsx     # 메시지 입력
│       └── ChatMessages.tsx  # 메시지 표시
├── api/               # API 통신
│   └── chat.ts       # 채팅 API (SSE, 세션 관리)
├── hooks/             # PWA 상태 관리 훅
├── routes/            # 라우팅 설정
│   └── chat/         # 채팅 페이지
├── types/             # 타입 정의
│   └── chat.ts       # 채팅 관련 타입 (SSE, 세션)
└── global.css         # 전역 스타일

public/
├── manifest.json      # PWA 매니페스트
├── sw.js             # Service Worker
└── icons/            # PWA 아이콘들
```

## 🌐 PWA 테스트

PWA 기능을 테스트하려면:

1. `npm run build:pwa`로 빌드
2. `npm run preview:pwa`로 미리보기
3. Chrome DevTools → Application → Manifest에서 PWA 상태 확인
4. Lighthouse에서 PWA 점수 확인

## �� 라이선스

MIT License
