import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean; // SSE 연결 상태에 따른 입력 비활성화
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isDisabled = false, 
}) => {
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
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isDisabled ? "연결을 기다리는 중..." : "메시지를 입력하세요..."}
          disabled={isDisabled}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent ${
            isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={isDisabled || !message.trim()}
          className={`px-4 py-2 bg-[#8E8EE7] text-white rounded-full hover:bg-[#7A7AD7] focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:ring-offset-2 transition-colors ${
            isDisabled || !message.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          전송
        </button>
      </div>
    </div>
  );
};
