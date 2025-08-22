import { createFileRoute } from "@tanstack/react-router";
import { UserProfile } from "../components/UserProfile";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 iphone16-container">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Sermo</h1>
              </div>
              <UserProfile />
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <div className="p-4">
          <div className="mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Sermo
              </h1>
              <p className="text-base text-gray-600 mb-6">
                AI와 함께하는 일상의 대화
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🚀 시작하기
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">💬 AI 대화</h3>
                    <p className="text-gray-600 text-xs">
                      AI와 자연스러운 대화를 나누어보세요
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">📱 모바일 최적화</h3>
                    <p className="text-gray-600 text-xs">
                      iPhone 16에 최적화된 모바일 경험
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-800">🔒 안전한 인증</h3>
                    <p className="text-gray-600 text-xs">
                      보안이 강화된 사용자 인증 시스템
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
