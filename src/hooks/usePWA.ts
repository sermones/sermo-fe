import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // PWA가 설치되어 있는지 확인
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setIsStandalone(true);
        return;
      }
      if ((window.navigator as any).standalone) {
        setIsInstalled(true);
        setIsStandalone(true);
        return;
      }
    };

    // beforeinstallprompt 이벤트 리스너
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    // 설치 완료 이벤트 리스너
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    // 온라인/오프라인 상태 확인
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkIfInstalled();
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    window.addEventListener('appinstalled', appInstalledHandler);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA 설치 트리거 함수
  const triggerInstall = async () => {
    if (!deferredPrompt) {
      throw new Error('설치 프롬프트를 사용할 수 없습니다');
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA 설치가 수락되었습니다');
        return { success: true, outcome: 'accepted' };
      } else {
        console.log('PWA 설치가 거부되었습니다');
        return { success: false, outcome: 'dismissed' };
      }
    } catch (error) {
      console.error('PWA 설치 오류:', error);
      throw error;
    } finally {
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  // 수동 설치 안내 함수
  const getManualInstallInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (/Android/i.test(userAgent)) {
      return {
        platform: 'Android',
        instructions: 'Chrome 메뉴 → "홈 화면에 추가" 선택',
        icon: '📱'
      };
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return {
        platform: 'iOS',
        instructions: 'Safari 공유 버튼 → "홈 화면에 추가" 선택',
        icon: '🍎'
      };
    } else if (/Chrome/i.test(userAgent)) {
      return {
        platform: 'Chrome',
        instructions: '주소창 옆 설치 아이콘 클릭 → "설치" 선택',
        icon: '🌐'
      };
    } else {
      return {
        platform: '기타 브라우저',
        instructions: '브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치" 선택',
        icon: '🔧'
      };
    }
  };

  return {
    isInstalled,
    isStandalone,
    isOnline,
    canInstall,
    deferredPrompt,
    triggerInstall,
    getManualInstallInstructions
  };
};
