import React, { useState, useCallback, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => Promise<void>;
  disabled?: boolean;
  isSending?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false,
  isSending = false
}) => {
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    console.log('폼 제출됨:', message);
    sendMessage();
  };

  const sendMessage = () => {
    if (message.trim() && !disabled) {
      console.log('메시지 전송:', message);
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    // Enter 키 (컴퓨터) 또는 Return 키 (모바일) 눌렀을 때 메시지 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter 키 눌림:', message);
      sendMessage();
    }
  };

  // 키보드 입력 시 타이핑 이벤트 전송
  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // 타이핑 이벤트 전송 (디바운싱)
    if (onTyping && newMessage.length > 0) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          await onTyping();
        } catch (error) {
          console.warn('타이핑 이벤트 전송 실패:', error);
        }
      }, 500); // 500ms 디바운싱
    }
  }, [onTyping]);

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* 둥근 입력 필드 - 검색 아이콘 포함 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "연결 중..." : isSending ? "전송 중..." : "채팅 입력"}
            disabled={disabled || isSending}
            className={`w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent text-gray-700 placeholder-gray-500 shadow-sm ${
              disabled || isSending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          
          {/* 검색 아이콘 - 입력 필드 내부 오른쪽 */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 전송 버튼 - 보라색 종이비행기 */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className="p-3 bg-[#8E8EE7] text-white rounded-full hover:bg-[#7A7AD7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
        >
          {isSending ? (
            // 전송 중일 때 로딩 스피너
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            // 일반 전송 아이콘
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};
