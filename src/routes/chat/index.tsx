import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatMessages } from '../../components/chat/ChatMessages';
import { ChatInput } from '../../components/chat/ChatInput';
import { chatAPI } from '../../api/chat';
import { ChatMessage, ChatbotInfo } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';

export const Route = createFileRoute('/chat/')({
  component: ChatPageComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      chatbotId: (search.chatbotId as string) || undefined,
      chatbotName: (search.chatbotName as string) || undefined,
      chatbotImage: (search.chatbotImage as string) || undefined,
      chatbotDetails: (search.chatbotDetails as string) || undefined,
    }
  },
});

function ChatPageComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/chat/' });
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotInfo, setChatbotInfo] = useState<ChatbotInfo | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 컴포넌트 초기화 (한 번만 실행)
  useEffect(() => {
    const initializeChat = async () => {
      const chatbotId = search.chatbotId;
      
      if (!chatbotId || !user) {
        if (!chatbotId) {
          navigate({ to: '/home' });
        }
        return;
      }

      try {
        setIsLoading(true);
        console.log('=== 채팅 초기화 시작 ===');
        console.log('chatbotId:', chatbotId);
        console.log('user:', user);

        // 1. 챗봇 정보 가져오기 (URL에서 전달받은 정보 우선 사용)
        let chatbotInfo: ChatbotInfo;
        
        // URL에서 전달받은 챗봇 정보가 있으면 우선 사용
        if (search.chatbotName && search.chatbotImage) {
          console.log('✅ URL에서 챗봇 정보 로드:', search);
          chatbotInfo = {
            id: chatbotId,
            name: search.chatbotName,
            avatar: search.chatbotImage,
            level: '초급', // 기본값
            description: search.chatbotDetails || '챗봇 설명'
          };
        } else {
          // URL에 정보가 없으면 API에서 가져오기
          try {
            const response = await chatAPI.getChatbotInfo(chatbotId);
            console.log('챗봇 정보 API 응답:', response);
            
            chatbotInfo = {
              id: response.uuid || response.id || chatbotId,
              name: response.name || '알 수 없는 챗봇',
              avatar: response.image_url || response.avatar || '/Checker.png',
              level: response.level || '초급',
              description: response.description || '챗봇 설명'
            };
          } catch (error) {
            console.error('챗봇 정보 로드 실패:', error);
            chatbotInfo = {
              id: chatbotId,
              name: '알렉산더',
              avatar: '/Checker.png',
              level: '초급',
              description: '챗봇 설명'
            };
          }
        }
        
        setChatbotInfo(chatbotInfo);

        // 2. 채팅 히스토리 가져오기
        try {
          console.log('=== 채팅 히스토리 로딩 시작 ===');
          const history = await chatAPI.getChatHistory(chatbotId, 50, 0);
          console.log('API에서 받은 히스토리:', history);
          
          if (history.length > 0) {
            console.log('히스토리 있음, 메시지 설정 중...');
            const sortedHistory = history.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            console.log('정렬된 히스토리:', sortedHistory);
            setMessages(sortedHistory);
            setHistoryLoaded(true);
            console.log('메시지 상태 업데이트 완료');
          } else {
            console.log('히스토리 없음');
            setHistoryLoaded(true);
          }
        } catch (error) {
          console.error('채팅 히스토리 로드 실패:', error);
          setHistoryLoaded(true);
        }

        // 3. 채팅 세션 시작
        try {
          const startResponse = await chatAPI.startChat({
            chatbotId: chatbotInfo.id,
            userId: user.uuid
          });

          if (startResponse.success) {
            setSessionId(startResponse.sessionId);
            console.log('채팅 세션 시작됨:', startResponse.sessionId);
          }
        } catch (error) {
          console.error('채팅 세션 시작 실패:', error);
        }

      } catch (error) {
        console.error('채팅 초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [search.chatbotId, user, navigate]);

  // 히스토리가 없을 때 환영 메시지 추가
  useEffect(() => {
    if (!chatbotInfo || !historyLoaded || messages.length > 0) return;

    console.log('히스토리 없음, 환영 메시지 추가');
         const welcomeMessage: ChatMessage = {
       id: Date.now().toString(),
       type: 'chatbot',
       content: `Hi! I'm ${chatbotInfo.name}. Welcome to SERMO 🎉`,
       timestamp: new Date().toISOString(),
       sender: chatbotInfo.name,
       chatbotId: chatbotInfo.id
     };
    setMessages([welcomeMessage]);
  }, [chatbotInfo, historyLoaded, messages.length]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (sessionId) {
        chatAPI.stopChat(sessionId);
      }
    };
  }, [sessionId]);

  // SSE 메시지 처리
  const handleSSEMessage = (data: any) => {
    if (!chatbotInfo) return;
    
         if (data.type === 'chatbot' && data.content) {
       const newMessage: ChatMessage = {
         id: Date.now().toString(),
         type: 'chatbot',
         content: data.content,
         timestamp: new Date().toISOString(),
         sender: chatbotInfo.name,
         chatbotId: chatbotInfo.id
       };
       setMessages(prev => [...prev, newMessage]);
       setIsTyping(false);
     }
  };

  // 메시지 전송 처리
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !chatbotInfo || !user) return;

    console.log('=== 메시지 전송 시작 ===');
    console.log('전송할 메시지:', message);
    console.log('sessionId:', sessionId);
    console.log('chatbotId:', chatbotInfo.id);
    console.log('userId:', user.uuid);

            // 사용자 메시지 추가
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'user',
          content: message,
          timestamp: new Date().toISOString(),
          sender: user.nickname || '나',
          chatbotId: chatbotInfo.id
        };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // localStorage에 사용자 메시지 저장
    chatAPI.saveChatHistory(chatbotInfo.id, updatedMessages);
    
    setIsTyping(true);

    try {
      // 실제 API로 메시지 전송
      console.log('API 호출 시작...');
      const response = await chatAPI.sendMessage({
        sessionId,
        message,
        chatbotId: chatbotInfo.id,
        userId: user.uuid
      });

      console.log('API 응답:', response);

      if (response.success && response.response) {
        // API 응답이 있으면 즉시 추가
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'chatbot',
          content: response.response,
          timestamp: new Date().toISOString(),
          sender: chatbotInfo.name,
          chatbotId: chatbotInfo.id
        };
        
        const updatedMessages = [...messages, userMessage, botResponse];
        setMessages(updatedMessages);
        
        // localStorage에 히스토리 저장
        chatAPI.saveChatHistory(chatbotInfo.id, updatedMessages);
        
        setIsTyping(false);
        console.log('봇 응답 추가 완료');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setIsTyping(false);
      
      // 에러 메시지 표시
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'chatbot',
        content: '죄송합니다. 메시지 전송에 실패했습니다. 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
        sender: chatbotInfo.name,
        chatbotId: chatbotInfo.id
      };
      setMessages(prev => [...prev, errorMessage]);
      console.log('에러 메시지 추가 완료');
    }
  };

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading || !chatbotInfo) {
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
       />

      {/* 메시지 영역 - 헤더 아래부터 시작, 393px 너비 제한 */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-[393px] max-w-[90vw] mx-auto px-4 py-2">
                     <ChatMessages 
             messages={messages}
             isTyping={isTyping}
             chatbotName={chatbotInfo.name}
             chatbotAvatar={chatbotInfo.avatar}
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