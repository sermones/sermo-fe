// PWA 관련 유틸리티 함수들

export const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker 등록 성공:', registration);
      
      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // 새 버전 available
                console.log('새 버전이 사용 가능합니다');
                showUpdateAvailable();
              } else {
                // 첫 설치
                console.log('Service Worker가 처음 설치되었습니다');
              }
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
      throw error;
    }
  } else {
    throw new Error('Service Worker를 지원하지 않는 브라우저입니다');
  }
};

export const showUpdateAvailable = () => {
  if (confirm('새 버전이 사용 가능합니다. 업데이트하시겠습니까?')) {
    window.location.reload();
  }
};

export const checkPWAInstallability = () => {
  const checks = {
    isHTTPS: location.protocol === 'https:' || location.hostname === 'localhost',
    hasServiceWorker: 'serviceWorker' in navigator,
    hasManifest: document.querySelector('link[rel="manifest"]') !== null,
    hasIcons: true, // 아이콘은 매니페스트에서 확인
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
  };
  
  const installable = checks.isHTTPS && checks.hasServiceWorker && checks.hasManifest;
  
  return {
    ...checks,
    installable,
    issues: Object.entries(checks)
      .filter(([key, value]) => key !== 'isStandalone' && !value)
      .map(([key]) => key)
  };
};

export const triggerInstallPrompt = async (deferredPrompt: any) => {
  if (!deferredPrompt) {
    throw new Error('설치 프롬프트를 사용할 수 없습니다');
  }

  try {
    // 설치 프롬프트 표시
    deferredPrompt.prompt();
    
    // 사용자 선택 대기
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`설치 프롬프트 결과: ${outcome}`);
    
    return {
      success: outcome === 'accepted',
      outcome
    };
  } catch (error) {
    console.error('설치 프롬프트 오류:', error);
    throw error;
  }
};
