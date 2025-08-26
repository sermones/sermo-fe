import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/achievement')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showHeader, setShowHeader] = useState(false);
  const [showMainCard, setShowMainCard] = useState(false);
  const [showStatsGrid, setShowStatsGrid] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showMascot, setShowMascot] = useState(false);

  useEffect(() => {
    // 위에서부터 순차적으로 애니메이션 시작
    const headerTimer = setTimeout(() => setShowHeader(true), 100);
    const mainCardTimer = setTimeout(() => setShowMainCard(true), 300);
    const statsGridTimer = setTimeout(() => setShowStatsGrid(true), 500);
    const logoTimer = setTimeout(() => setShowLogo(true), 700);
    const mascotTimer = setTimeout(() => setShowMascot(true), 900);

    return () => {
      clearTimeout(headerTimer);
      clearTimeout(mainCardTimer);
      clearTimeout(statsGridTimer);
      clearTimeout(logoTimer);
      clearTimeout(mascotTimer);
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="bg-[#fbf5ff] min-h-screen pb-20">
        {/* Header */}
        <div 
          className={`text-[#8e8ee7] font-bold text-2xl p-6 text-left transition-all duration-700 ${
            showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          이번 달 학습 통계
        </div>

        {/* Main Statistics Card */}
        <div className="mx-6 mb-6">
          <div 
            className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-700 ${
              showMainCard ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div className="flex items-start justify-between">
              {/* Left Side - Golden Badge */}
              <div className="flex flex-col items-center">
                <div className="w-25 h-20 rounded-full flex items-center justify-center mb-3">
                  <img src="/goldMedal.svg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-sm mb-1">8월의 금색 뱃지</div>
                  <div className="text-2xl font-bold text-gray-800">14개 수집</div>
                </div>
              </div>

              {/* Right Side - Calendar Grid */}
              <div className="flex-1 pl-6">
                <div className="">
                  <img src="/calendar.svg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid - 2x2 */}
        <div className="mx-6">
          <div 
            className={`grid grid-cols-2 gap-4 transition-all duration-700 ${
              showStatsGrid ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            {/* Top Left - Chatting */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">⏰</span>
                </div>
                <div className="text-gray-600 text-sm">8월의 채팅</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">1,116분</div>
            </div>

            {/* Top Right - Quiz */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🎯</span>
                </div>
                <div className="text-gray-600 text-sm">8월의 퀴즈</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">412문제</div>
            </div>

            {/* Bottom Left - Search */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">🔍</span>
                </div>
                <div className="text-gray-600 text-sm">8월의 검색</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">86회</div>
            </div>

            {/* Bottom Right - Bookmark */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">📚</span>
                </div>
                <div className="text-gray-600 text-sm">8월의 북마크</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">123문장</div>
            </div>
          </div>
        </div>

        {/* YBM Logo */}
        <div 
          className={`absolute bottom-25 left-20 transition-all duration-700 ${
            showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <img src="/ybmHere.svg" />
        </div>

        {/* YBM Mascot (Placeholder) */}
        <div 
          className={`absolute bottom-20 right-13 transition-all duration-700 ${
            showMascot ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}
        >
          <img className="w-25" src="/YBMcat.svg" />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
          <Navbar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
