import { createFileRoute } from "@tanstack/react-router";
import { usePWA } from "../hooks/usePWA";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isInstalled, isStandalone, isOnline, canInstall } = usePWA();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Junction Asia 2025
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            PWA 상태
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">
                {isOnline ? '온라인' : '오프라인'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isInstalled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {isInstalled ? '설치됨' : '설치되지 않음'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isStandalone ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {isStandalone ? '독립 실행 모드' : '브라우저 모드'}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${canInstall ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className="text-gray-700">
                {canInstall ? '설치 가능' : '설치 불가'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            PWA 기능
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">오프라인 지원</h3>
                <p className="text-gray-600 text-sm">
                  인터넷 연결이 없어도 앱을 사용할 수 있습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">홈 화면 설치</h3>
                <p className="text-gray-600 text-sm">
                  모바일 기기의 홈 화면에 앱을 추가할 수 있습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-gray-800">네이티브 앱 경험</h3>
                <p className="text-gray-600 text-sm">
                  브라우저 없이 독립적으로 실행됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
