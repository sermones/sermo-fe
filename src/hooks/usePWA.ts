import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // PWA가 설치되어 있는지 확인
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setIsStandalone(true);
      } else if ((window.navigator as any).standalone) {
        // iOS Safari
        setIsInstalled(true);
        setIsStandalone(true);
      }
    };

    // 온라인/오프라인 상태 확인
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    checkIfInstalled();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isInstalled,
    isStandalone,
    isOnline,
    canInstall: !isInstalled && 'serviceWorker' in navigator,
  };
};
