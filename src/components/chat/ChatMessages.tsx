import React from 'react';
import { ChatMessage } from '../../types/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isTyping: boolean;
  chatbotName: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping, chatbotName }) => {
  // 연속된 메시지를 그룹화
  const groupMessages = (messages: ChatMessage[]) => {
    const groups: ChatMessage[][] = [];
    let currentGroup: ChatMessage[] = [];
    let currentSender: string | null = null;

    messages.forEach((message) => {
      if (message.sender !== currentSender) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [message];
        currentSender = message.sender;
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const messageGroups = groupMessages(messages);

  // 첫 번째 메시지의 날짜를 한국어로 포맷
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 첫 번째 메시지가 있는 경우에만 날짜 표시
  const firstMessageDate = messages.length > 0 ? messages[0].timestamp : null;

  return (
    <div className="space-y-4">
      {/* 날짜 구분선 - 첫 번째 메시지가 있을 때만 표시 */}
      {firstMessageDate && (
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
            {formatDate(firstMessageDate)}
          </span>
        </div>
      )}

      {messageGroups.map((group, groupIndex) => {
        const isChatbot = group[0].type === 'chatbot';
        
        return (
          <div key={groupIndex} className={`flex ${isChatbot ? 'justify-start' : 'justify-end'}`}>
            {isChatbot ? (
              // 챗봇 메시지: 프로필과 메시지를 분리해서 배치
              <div className="flex w-full">
                {/* 프로필 사진 - 왼쪽에 홀로 */}
                <div className="flex flex-col items-center mr-3 flex-shrink-0">
                  <div className="w-8 h-8 bg-[#8E8EE7] rounded-full mb-1"></div>
                </div>
                
                {/* 이름과 메시지 - 오른쪽에 배치 */}
                <div className="flex-1">
                  {/* 이름 - 프로필 상단에 맞춰 위치 */}
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">{group[0].sender}</span>
                  </div>
                  
                  {/* 메시지들 - 이름과 같은 왼쪽 정렬선 */}
                  <div className="space-y-2">
                    {group.map((message) => (
                      <div
                        key={message.id}
                        className="bg-white border border-gray-200 rounded-2xl px-4 py-3 max-w-full break-words shadow-sm"
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // 사용자 메시지: 오른쪽 정렬
              <div className="flex flex-col max-w-[80%]">
                <div className="flex flex-col items-end">
                  {group.map((message) => (
                    <div
                      key={message.id}
                      className="mb-2 last:mb-0 bg-[#8E8EE7] text-white rounded-2xl px-4 py-3 max-w-full break-words shadow-sm"
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {/* 타이핑 인디케이터 */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex w-full">
            {/* 프로필 사진 - 왼쪽에 홀로 */}
            <div className="flex flex-col items-center mr-3 flex-shrink-0">
              <div className="w-8 h-8 bg-[#8E8EE7] rounded-full mb-1"></div>
            </div>
            
            {/* 이름과 타이핑 - 오른쪽에 배치 */}
            <div className="flex-1">
              {/* 이름 - 프로필 상단에 맞춰 위치 */}
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700">{chatbotName}</span>
              </div>
              
              {/* 타이핑 애니메이션 */}
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
