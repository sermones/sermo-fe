import { useState, useEffect } from 'react';

export const PWADiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const runDiagnostics = async () => {
      const results: any = {};

      // Service Worker 확인
      results.serviceWorker = 'serviceWorker' in navigator;
      if (results.serviceWorker) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          results.swRegistered = !!registration;
          results.swActive = !!registration?.active;
        } catch (error) {
          results.swRegistered = false;
          results.swActive = false;
        }
      }

      // 매니페스트 확인
      try {
        const response = await fetch('/manifest.json');
        results.manifestAccessible = response.ok;
        if (response.ok) {
          const manifest = await response.json();
          results.manifestValid = !!(manifest.name && manifest.start_url && manifest.icons);
          results.manifestData = manifest;
        }
      } catch (error) {
        results.manifestAccessible = false;
        results.manifestValid = false;
      }

      // 아이콘 확인
      results.iconChecks = {};
      const iconSizes = ['192x192', '512x512'];
      for (const size of iconSizes) {
        try {
          const response = await fetch(`/icon-${size}.png`);
          results.iconChecks[size] = response.ok;
        } catch (error) {
          results.iconChecks[size] = false;
        }
      }

      // HTTPS 확인
      results.isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';

      // 설치 가능 상태 확인
      results.canInstall = 'BeforeInstallPromptEvent' in window || 'onbeforeinstallprompt' in window;

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">🔧 PWA 진단</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        >
          {showDetails ? '숨기기' : '상세보기'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(diagnostics.isHTTPS)}</span>
          <span className={getStatusColor(diagnostics.isHTTPS)}>
            HTTPS/Localhost 환경
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(diagnostics.serviceWorker)}</span>
          <span className={getStatusColor(diagnostics.serviceWorker)}>
            Service Worker 지원
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(diagnostics.swRegistered)}</span>
          <span className={getStatusColor(diagnostics.swRegistered)}>
            Service Worker 등록됨
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(diagnostics.manifestAccessible)}</span>
          <span className={getStatusColor(diagnostics.manifestAccessible)}>
            매니페스트 접근 가능
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span>{getStatusIcon(diagnostics.manifestValid)}</span>
          <span className={getStatusColor(diagnostics.manifestValid)}>
            매니페스트 유효함
          </span>
        </div>

        {diagnostics.iconChecks && Object.entries(diagnostics.iconChecks).map(([size, status]: [string, any]) => (
          <div key={size} className="flex items-center space-x-2">
            <span>{getStatusIcon(status)}</span>
            <span className={getStatusColor(status)}>
              아이콘 {size} 접근 가능
            </span>
          </div>
        ))}
      </div>

      {showDetails && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium mb-2">상세 정보:</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(diagnostics, null, 2)}
          </pre>
        </div>
      )}

      {!diagnostics.isHTTPS && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">
            ⚠️ PWA 설치를 위해서는 HTTPS 환경이 필요합니다. 프로덕션 환경에서 테스트해주세요.
          </p>
        </div>
      )}
    </div>
  );
};
