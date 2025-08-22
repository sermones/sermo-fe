import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showManualInstall, setShowManualInstall] = useState(false);

  useEffect(() => {
    // PWA가 이미 설치되어 있는지 확인
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsPWAInstalled(true);
        return;
      }
      if ((window.navigator as any).standalone) {
        setIsPWAInstalled(true);
        return;
      }
      
      // 설치되지 않은 경우, 몇 초 후 자동으로 프롬프트 표시
      setTimeout(() => {
        if (!isPWAInstalled && 'serviceWorker' in navigator) {
          setShowInstallPrompt(true);
        }
      }, 3000); // 3초 후 표시
    };

    // beforeinstallprompt 이벤트 리스너
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // 설치 완료 이벤트 리스너
    const installedHandler = () => {
      setIsPWAInstalled(true);
      setShowInstallPrompt(false);
      setShowManualInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    // 초기 설치 상태 확인
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, [isPWAInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // 브라우저 설치 프롬프트 표시
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('사용자가 PWA 설치를 수락했습니다');
          setIsPWAInstalled(true);
        } else {
          console.log('사용자가 PWA 설치를 거부했습니다');
          // 거부된 경우 수동 설치 안내 표시
          setShowManualInstall(true);
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('설치 프롬프트 오류:', error);
        setShowManualInstall(true);
      }
    } else {
      // deferredPrompt가 없는 경우 수동 설치 안내
      setShowManualInstall(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowManualInstall(false);
  };

  const handleManualInstall = () => {
    // 브라우저별 수동 설치 방법 안내
    const userAgent = navigator.userAgent;
    let installInstructions = '';
    
    if (/Android/i.test(userAgent)) {
      installInstructions = 'Chrome 메뉴 → "홈 화면에 추가" 선택';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      installInstructions = 'Safari 공유 버튼 → "홈 화면에 추가" 선택';
    } else if (/Chrome/i.test(userAgent)) {
      installInstructions = '주소창 옆 설치 아이콘 클릭 → "설치" 선택';
    } else {
      installInstructions = '브라우저 메뉴에서 "홈 화면에 추가" 또는 "앱 설치" 선택';
    }
    
    alert(`📱 수동 설치 방법:\n\n${installInstructions}`);
  };

  // 이미 설치된 경우 표시하지 않음
  if (isPWAInstalled) return null;

  return (
    <>
      {/* 자동 설치 프롬프트 */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 max-w-[365px] mx-auto bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 animate-bounce">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">📱 앱 설치</h3>
              <p className="text-xs text-gray-600">
                홈 화면에 추가하여 더 빠르게 접근하세요
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDismiss}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
              >
                나중에
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
              >
                설치하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수동 설치 안내 */}
      {showManualInstall && (
        <div className="fixed bottom-4 left-4 right-4 max-w-[365px] mx-auto bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-yellow-800">🔧 수동 설치</h3>
              <p className="text-xs text-yellow-700">
                브라우저에서 직접 설치해주세요
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDismiss}
                className="px-2 py-1 text-xs text-yellow-600 hover:text-yellow-800"
              >
                닫기
              </button>
              <button
                onClick={handleManualInstall}
                className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-md hover:bg-yellow-700 transition-colors"
              >
                설치 방법 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
