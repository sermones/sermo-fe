import { createFileRoute } from "@tanstack/react-router";
import { usePWA } from "../hooks/usePWA";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { 
    isInstalled, 
    isStandalone, 
    isOnline, 
    canInstall, 
    triggerInstall, 
    getManualInstallInstructions 
  } = usePWA();
  const [showInstallInfo, setShowInstallInfo] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle');

  const handleInstallClick = async () => {
    if (!canInstall) {
      showManualInstallGuide();
      return;
    }

    try {
      setInstallStatus('installing');
      const result = await triggerInstall();
      
      if (result.success) {
        setInstallStatus('success');
        setShowInstallInfo(true);
        setTimeout(() => setShowInstallInfo(false), 5000);
      } else {
        setInstallStatus('error');
        showManualInstallGuide();
      }
    } catch (error) {
      console.error('설치 오류:', error);
      setInstallStatus('error');
      showManualInstallGuide();
    }
  };

  const showManualInstallGuide = () => {
    setShowInstallInfo(true);
    setTimeout(() => setShowInstallInfo(false), 8000);
  };

  const getInstallButtonText = () => {
    switch (installStatus) {
      case 'installing':
        return '⏳ 설치 중...';
      case 'success':
        return '✅ 설치 완료!';
      case 'error':
        return '❌ 설치 실패';
      default:
        return '📱 홈 화면에 추가';
    }
  };

  const getInstallButtonClass = () => {
    const baseClass = "inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all shadow-lg transform hover:scale-105";
    
    switch (installStatus) {
      case 'installing':
        return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600 cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-green-500 text-white hover:bg-green-600`;
      case 'error':
        return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Junction Asia 2025
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Progressive Web App으로 더 나은 경험을 제공합니다
          </p>
          
          {/* PWA 설치 버튼 */}
          {!isInstalled && (
            <div className="mb-8">
              <button
                onClick={handleInstallClick}
                disabled={installStatus === 'installing'}
                className={getInstallButtonClass()}
              >
                {getInstallButtonText()}
              </button>
              
              {showInstallInfo && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    {installStatus === 'success' 
                      ? '🎉 PWA가 성공적으로 설치되었습니다! 홈 화면에서 앱을 찾아보세요.' 
                      : installStatus === 'error'
                      ? '💡 수동 설치가 필요합니다. 아래 방법을 따라해주세요.'
                      : '💡 설치 프롬프트가 표시되었습니다!'
                    }
                  </p>
                  
                  {installStatus === 'error' && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800 text-sm font-medium">
                        {getManualInstallInstructions().instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {isInstalled && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ PWA가 이미 설치되어 있습니다!
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📊 PWA 상태
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">
                {isOnline ? '🌐 온라인' : '📴 오프라인'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {isInstalled ? '📱 설치됨' : '❌ 설치되지 않음'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isStandalone ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {isStandalone ? '🚀 독립 실행 모드' : '🌐 브라우저 모드'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${canInstall ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {canInstall ? '✅ 설치 가능' : '❌ 설치 불가'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🚀 PWA 기능
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">📴 오프라인 지원</h3>
                <p className="text-gray-600 text-sm">
                  인터넷 연결이 없어도 앱을 사용할 수 있습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">📱 홈 화면 설치</h3>
                <p className="text-gray-600 text-sm">
                  모바일 기기의 홈 화면에 앱을 추가할 수 있습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">🚀 네이티브 앱 경험</h3>
                <p className="text-gray-600 text-sm">
                  브라우저 없이 독립적으로 실행됩니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">⚡ 빠른 로딩</h3>
                <p className="text-gray-600 text-sm">
                  캐싱을 통해 더 빠르게 로드됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
