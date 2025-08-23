import React from 'react';
import { useNavigate } from '@tanstack/react-router';

interface ChatHeaderProps {
  chatbotName: string;
  chatbotAvatar?: string;
  chatbotId: string;
  onStopChat: () => void;
  isSSEReady?: boolean; // SSE 연결 상태 추가
  isConnected?: boolean; // SSE 연결 상태 추가
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatbotName,
  chatbotAvatar,
  chatbotId,
  onStopChat,
  isSSEReady,
  isConnected
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    // 채팅 세션 정리
    onStopChat();
    // 홈으로 이동
    navigate({ to: '/home' });
  };

  return (
    <>
      {/* 고정 헤더 - 너비를 393px로 제한 */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white border-b border-gray-200 w-[393px] max-w-[90vw]">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 뒤로가기 버튼 */}
            <button
              onClick={handleBackClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
                         {/* 챗봇 이름 - 중앙 정렬 */}
             <div className="flex-1 text-center min-w-0">
               <h2 className="font-semibold text-gray-900 text-lg truncate">
                 {chatbotName}
               </h2>
               {/* SSE 연결 상태 표시 */}
               <div className="flex items-center justify-center space-x-2 mt-1">
                 <div className={`w-2 h-2 rounded-full ${isSSEReady ? (isConnected ? 'bg-green-500' : 'bg-blue-500') : 'bg-yellow-500'}`}></div>
                 <span className={`text-xs ${isSSEReady ? (isConnected ? 'text-green-600' : 'text-blue-600') : 'text-yellow-600'}`}>
                   {isSSEReady 
                     ? (isConnected ? '실시간 연결됨' : '일반 연결됨') 
                     : '연결 중...'}
                 </span>
               </div>
             </div>

            {/* 설정 버튼 */}
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 헤더 아래 여백 */}
      <div className="h-20"></div>
    </>
  );
};
