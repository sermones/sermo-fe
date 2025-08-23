import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/quests/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [showStampAnimation, setShowStampAnimation] = useState(false);
  const [showRewardScreen, setShowRewardScreen] = useState(false);

  useEffect(() => {
    // 페이지 진입 시 0.5초 후 도장 애니메이션 시작
    const stampTimer = setTimeout(() => {
      setShowStampAnimation(true);
    }, 500);

    // 도장 찍힌 후 1초 뒤 보상 화면 표시
    const rewardTimer = setTimeout(() => {
      setShowRewardScreen(true);
    }, 1500);

    return () => {
      clearTimeout(stampTimer);
      clearTimeout(rewardTimer);
    };
  }, []);

  const quests = [
    {
      id: 'bookmark',
      title: '북마크의 화신',
      description: '채팅 중 인상적인 문장을 발견한다면, 북마크를 해보세요',
      progress: '0/2',
      icon: '📚',
      completed: false
    },
    {
      id: 'timeattack',
      title: '타임어택!',
      description: '단어 퀴즈 20문제를 1분 안에 해결하세요',
      progress: '1/2',
      icon: '⏱️',
      completed: false
    },
    {
      id: 'chatterbox',
      title: '출석의 대가',
      description: '하루 1회 출석하기',
      progress: '완료!',
      icon: '💬',
      completed: true
    },
    {
      id: 'sherlock',
      title: '셜록의 애장품',
      description: '채팅 중 돋보기를 사용해 새 단어를 배워보세요',
      progress: '0/2',
      icon: '🔍',
      completed: false
    }
  ];

  return (
    <ProtectedRoute>
      <div className="bg-[#fbf5ff] min-h-screen pb-20">
        {/* Header */}
        <div className="text-[#8e8ee7] font-bold text-2xl p-6 text-left">
          QUESTS
        </div>

        {/* Quest Cards Grid */}
        <div className="px-4 w-full">
          <div className="grid grid-cols-2 gap-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`relative rounded-2xl p-3 shadow-lg transition-all duration-500 ${
                  quest.id === 'chatterbox' && showStampAnimation
                    ? 'bg-[#8E8EE7]/30' // 반투명 연보라
                    : 'bg-white'
                }`}
              >
                {/* Quest Icon */}
                <div className="text-3xl mb-3">{quest.icon}</div>
                
                {/* Quest Title */}
                <h3 className={`font-bold text-lg mb-2 ${
                  quest.id === 'chatterbox' && showStampAnimation ? 'text-gray-400' : 'text-black'
                }`}>
                  {quest.title}
                </h3>
                
                {/* Quest Description */}
                <p className={`text-sm mb-3 ${
                  quest.id === 'chatterbox' && showStampAnimation ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {quest.description}
                </p>
                
                {/* Progress */}
                <div className={`text-sm mb-2 ${
                  quest.id === 'chatterbox' && showStampAnimation ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {quest.progress}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      quest.id === 'timeattack' ? 'bg-[#8e8ee7] w-1/2' : 'bg-transparent'
                    }`}
                  ></div>
                </div>

                {/* Stamp Overlay for Chatterbox */}
                {quest.id === 'chatterbox' && showStampAnimation && (
                  <div className="absolute bottom-2 right-2">
                    <div 
                      className="transform scale-150 animate-pulse"
                      style={{
                        animation: 'stampAppear 0.5s ease-out forwards'
                      }}
                    >
                      <img 
                        className="w-16 h-16 object-contain opacity-100" 
                        src="/coating.svg" 
                        alt="SUPER CAT HERO 도장"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Treasure Chest */}
        <div className="flex justify-center mt-4">
          <img className="w-30 h-30" src="/closedBox.svg" />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
          <Navbar />
        </div>

        {/* Custom Animation CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes stampAppear {
              0% {
                transform: scale(2);
                opacity: 0;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
            
            @keyframes fadeIn {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes backgroundGlow {
              0% {
                background: radial-gradient(circle at center, rgba(142, 142, 231, 0.1) 0%, rgba(251, 245, 255, 0.8) 100%);
              }
              100% {
                background: radial-gradient(circle at center, rgba(142, 142, 231, 0.3) 0%, rgba(251, 245, 255, 1) 100%);
              }
            }
          `
        }} />

        {/* Reward Screen Overlay */}
        {showRewardScreen && (
          <div 
            className="fixed inset-0 z-50 bg-gradient-to-br from-purple-100/90 to-purple-50/90 backdrop-blur-sm flex flex-col items-center justify-center"
            style={{
              animation: 'backgroundGlow 1s ease-out forwards'
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => setShowRewardScreen(false)}
              className="absolute top-6 left-6 text-[#8E8EE7] hover:text-[#7A7AD8] transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Congratulatory Message */}
            <div 
              className="text-[#8E8EE7] font-bold text-3xl mb-8 text-center"
              style={{
                animation: 'fadeIn 0.8s ease-out forwards'
              }}
            >
              또 해내셨군요!
            </div>

            {/* Golden Medal */}
            <div 
              className="mb-8"
              style={{
                animation: 'fadeIn 0.8s ease-out 0.2s both'
              }}
            >
              <img 
                src="/goldMedal.svg" 
                alt="Golden Medal" 
                className="w-32 h-32 object-contain"
              />
            </div>

            {/* Open Treasure Chest */}
            <div 
              style={{
                animation: 'fadeIn 0.8s ease-out 0.4s both'
              }}
            >
              <div className="w-40 h-40 rounded-2xl flex items-center justify-center">
                <img 
                  src="/opendBox.svg" 
                  alt="Open Treasure Chest" 
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


