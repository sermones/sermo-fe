import React, { useState, useEffect } from 'react';

interface NotificationToastProps {
  title: string;
  body: string;
  type?: 'chat_message' | 'test_message';
  data?: {
    chatbot_name?: string;
    chatbot_id?: string;
    message?: string; // BE 테스트 메시지용
  };
  onClose: () => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  title,
  body,
  type = 'chat_message',
  data,
  onClose,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 완료 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className="bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg shadow-lg border border-purple-300 max-w-sm w-80">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-purple-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-200 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">{title}</span>
            {type === 'test_message' && (
              <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                테스트
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-purple-200 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <p className="text-white text-sm leading-relaxed mb-2">{body}</p>
          
          {data?.chatbot_name && (
            <div className="flex items-center space-x-2">
              <span className="text-purple-200 text-xs">💬</span>
              <span className="text-purple-200 text-xs font-medium">
                {data.chatbot_name}
              </span>
            </div>
          )}
          
          {/* 테스트 메시지 추가 정보 표시 */}
          {type === 'test_message' && data?.message && (
            <div className="mt-2 p-2 bg-purple-100 rounded border-l-2 border-purple-300">
              <p className="text-xs text-purple-700 font-medium">
                💬 {data.message}
              </p>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-purple-300 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-purple-200 transition-all duration-300 ease-linear"
            style={{
              width: `${((duration - (Date.now() - Date.now())) / duration) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
