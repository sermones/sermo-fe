import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatMessages } from '../../components/chat/ChatMessages';
import { ChatInput } from '../../components/chat/ChatInput';
import { chatAPI } from '../../api/chat';
import { ChatMessage, ChatbotInfo } from '../../types/chat';

export const Route = createFileRoute('/chat/')({
  component: ChatPageComponent,
});

function ChatPageComponent() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 테스트용 챗봇 정보 (나중에 URL 파라미터나 상태로 받아올 예정)
  const chatbotInfo: ChatbotInfo = { 
    id: 'wawung',
    name: '와웅이', 
    avatar: '/Checker.png', 
    level: '초급',
    description: '영어 학습을 도와주는 친근한 챗봇'
  };

  // 테스트용 사용자 ID (나중에 실제 인증 시스템과 연동)
  const testUserId = 'test-user-123';

  // 채팅 세션 시작
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // 채팅 세션 시작
        const startResponse = await chatAPI.startChat({
          chatbotId: chatbotInfo.id,
          userId: testUserId
        });

        if (startResponse.success) {
          setSessionId(startResponse.sessionId);
          
          // 초기 메시지 추가
          const initialMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'chatbot',
            content: startResponse.message || 'Hi! I\'m 와웅이. Welcome to SERMO 🎉',
            timestamp: new Date(),
            sender: chatbotInfo.name,
            chatbotId: chatbotInfo.id
          };

          setMessages([initialMessage]);

          // SSE 연결 생성 (실시간 응답)
          const eventSource = chatAPI.createSSEConnection(startResponse.sessionId, handleSSEMessage);
          if (eventSource) {
            eventSourceRef.current = eventSource;
          }
        }
      } catch (error) {
        console.error('채팅 초기화 실패:', error);
        // 에러 시 기본 메시지로 폴백
        const fallbackMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'chatbot',
          content: 'Hi! I\'m 와웅이. Welcome to SERMO 🎉\n\n(테스트 모드: 백엔드 API가 준비되지 않았습니다. 메시지를 보내보세요!)',
          timestamp: new Date(),
          sender: chatbotInfo.name,
          chatbotId: chatbotInfo.id
        };
        setMessages([fallbackMessage]);
        console.log('폴백 메시지로 초기화:', fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (sessionId) {
        chatAPI.stopChat(sessionId);
      }
    };
  }, [chatbotInfo.id, testUserId]);

  // SSE 메시지 처리
  const handleSSEMessage = (data: any) => {
    if (data.type === 'chatbot' && data.content) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'chatbot',
        content: data.content,
        timestamp: new Date(),
        sender: chatbotInfo.name,
        chatbotId: chatbotInfo.id
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) {
      console.log('메시지가 비어있음');
      return;
    }

    console.log('메시지 전송 시작:', message);

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      sender: '나',
      chatbotId: chatbotInfo.id
    };

    console.log('사용자 메시지 추가:', userMessage);
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      console.log('업데이트된 메시지 목록:', newMessages);
      return newMessages;
    });
    setIsTyping(true);

    // sessionId가 없거나 API가 준비되지 않은 경우 폴백 응답
    if (!sessionId) {
      console.log('세션 ID가 없음, 폴백 응답 생성');
      setTimeout(() => {
        const fallbackResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'chatbot',
          content: `테스트 모드: "${message}"에 대한 응답입니다. (백엔드 API가 준비되지 않았습니다)`,
          timestamp: new Date(),
          sender: chatbotInfo.name,
          chatbotId: chatbotInfo.id
        };
        console.log('폴백 응답 메시지 추가:', fallbackResponse);
        setMessages(prev => [...prev, fallbackResponse]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      console.log('API 호출 시작...');
      // 실제 API로 메시지 전송
      const response = await chatAPI.sendMessage({
        sessionId,
        message,
        chatbotId: chatbotInfo.id,
        userId: testUserId
      });

      console.log('API 응답:', response);

      if (response.success && response.response) {
        // API 응답이 있으면 즉시 추가
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'chatbot',
          content: response.response,
          timestamp: new Date(),
          sender: chatbotInfo.name,
          chatbotId: chatbotInfo.id
        };
        console.log('봇 응답 메시지 추가:', botResponse);
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      } else {
        // SSE로 응답을 기다림 (이미 isTyping = true)
        console.log('SSE로 응답 대기 중...');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setIsTyping(false);
      
      // 에러 메시지 표시
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'chatbot',
        content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
        sender: chatbotInfo.name,
        chatbotId: chatbotInfo.id
      };
      console.log('에러 메시지 추가:', errorMessage);
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 페이지 언마운트 시 읽음 상태 업데이트를 위한 이벤트 발생
  useEffect(() => {
    return () => {
      window.dispatchEvent(new Event('focus'));
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[#fbf5ff] items-center justify-center">
        <div className="text-[#8E8EE7] text-lg">채팅을 시작하는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fbf5ff]">
      {/* 채팅 헤더 - 고정 */}
      <ChatHeader 
        chatbotName={chatbotInfo.name}
        chatbotAvatar={chatbotInfo.avatar}
        level={chatbotInfo.level}
      />

      {/* 메시지 영역 - 헤더 아래부터 시작, 393px 너비 제한 */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-[393px] max-w-[90vw] mx-auto px-4 py-2">
          <ChatMessages 
            messages={messages}
            isTyping={isTyping}
            chatbotName={chatbotInfo.name}
          />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 - 하단 고정, 393px 너비 제한, 투명 배경, 테두리 없음 */}
      <div>
        <div className="w-[393px] max-w-[90vw] mx-auto">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
