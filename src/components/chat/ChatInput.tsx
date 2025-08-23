import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('폼 제출됨:', message);
    sendMessage();
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log('메시지 전송:', message);
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter 키 (컴퓨터) 또는 Return 키 (모바일) 눌렀을 때 메시지 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter 키 눌림:', message);
      sendMessage();
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        {/* 둥근 입력 필드 - 검색 아이콘 포함 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="채팅 입력"
            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent text-gray-700 placeholder-gray-500 shadow-sm"
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
          disabled={!message.trim()}
          className="p-3 bg-[#8E8EE7] text-white rounded-full hover:bg-[#7A7AD7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};
