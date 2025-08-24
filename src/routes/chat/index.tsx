import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatMessages } from '../../components/chat/ChatMessages';
import { ChatInput } from '../../components/chat/ChatInput';
import { chatAPI } from '../../api/chat';
import { ChatMessage, ChatbotInfo, ChatHistoryRequest, SendMessageRequest, OnKeyboardRequest, StopChatRequest } from '../../types/chat';
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
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotInfo, setChatbotInfo] = useState<ChatbotInfo | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0); // 연결 시도 횟수 추적
  const [isSending, setIsSending] = useState(false); // 메시지 전송 중 상태
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false); // 연결 진행 중 상태 추적

  // SSE 연결 시작
  const startSSEConnection = useCallback((chatbotId: string) => {
    try {
      // 이미 연결된 상태라면 재연결하지 않음
      if (eventSourceRef.current && isConnected) {
        console.log('🔌 이미 SSE 연결됨 - 재연결 스킵');
        return;
      }

      // 연결 진행 중이라면 스킵
      if (isConnectingRef.current) {
        console.log('🔌 SSE 연결 진행 중 - 스킵');
        return;
      }

      // 최대 연결 시도 횟수 제한 (5회)
      if (connectionAttempts >= 5) {
        console.log('❌ 최대 연결 시도 횟수 초과 - 폴백 모드로 전환');
        setError('실시간 연결에 실패했습니다. 페이지를 새로고침해주세요.'); 
        return;
      }

      // 기존 연결 정리
      if (eventSourceRef.current) {
        console.log('🔌 기존 SSE 연결 정리');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      console.log('🔌 SSE 연결 시작:', chatbotId, `(시도 ${connectionAttempts + 1}/5)`);
      setIsConnected(false); // 연결 시도 중 상태로 설정
      isConnectingRef.current = true; // 연결 진행 중 플래그 설정
      setConnectionAttempts(prev => prev + 1);
      
      const eventSource = chatAPI.createSSEConnection(chatbotId, handleSSEMessage);
      
      // 연결 타임아웃 설정 (10초)
      const connectionTimeout = setTimeout(() => {
        if (eventSource.readyState !== EventSource.OPEN) {
          console.log('⏰ SSE 연결 타임아웃 - 폴백 모드로 전환');
          setIsConnected(false);
          isConnectingRef.current = false;
          eventSource.close();
          eventSourceRef.current = null;
        }
      }, 10000);

      eventSource.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('✅ SSE 연결 성공 - onopen 이벤트 발생');
        console.log('✅ EventSource readyState:', eventSource.readyState);
        setIsConnected(true);
        isConnectingRef.current = false;
        setConnectionAttempts(0); // 성공 시 카운터 리셋
      };

      eventSource.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('❌ SSE 연결 오류:', error);
        console.error('❌ EventSource readyState:', eventSource.readyState);
        setIsConnected(false);
        isConnectingRef.current = false;
        eventSourceRef.current = null;
        
        // 재연결 시도 (최대 3회)
        if (eventSourceRef.current === null && connectionAttempts < 3) {
          console.log('🔄 SSE 재연결 시도...');
          setTimeout(() => {
            if (chatbotInfo && !isConnected && !isConnectingRef.current) {
              startSSEConnection(chatbotInfo.id);
            }
          }, 3000);
        }
      };

      // 메시지 수신 이벤트 추가 모니터링
      eventSource.addEventListener('open', () => {
        console.log('🔌 EventSource open 이벤트 발생');
      });

      eventSource.addEventListener('error', (event) => {
        console.log('🔌 EventSource error 이벤트 발생:', event);
      });

      eventSource.addEventListener('message', (event) => {
        console.log('🔌 EventSource message 이벤트 발생:', event);
        console.log('🔌 원본 이벤트 데이터:', event.data);
      });

      eventSourceRef.current = eventSource;
      
    } catch (error) {
      console.error('❌ SSE 연결 생성 실패:', error);
      setIsConnected(false);
      isConnectingRef.current = false;
      setError('실시간 연결에 실패했습니다.');
    }
  }, [chatbotInfo, connectionAttempts, isConnected]);

  // 컴포넌트 초기화 - 한 번만 실행되도록 수정
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
        setError(null);
        console.log('=== 채팅 초기화 시작 ===');

        // 1. 챗봇 정보 가져오기
        let chatbotInfo: ChatbotInfo;
        
        if (search.chatbotName && search.chatbotImage) {
          console.log('✅ URL에서 챗봇 정보 로드:', search);
          chatbotInfo = {
            id: chatbotId,
            name: search.chatbotName,
            avatar: search.chatbotImage,
            level: '초급',
            description: search.chatbotDetails || '챗봇 설명'
          };
        } else {
          try {
            const response = await chatAPI.getChatbotInfo(chatbotId);
            chatbotInfo = {
              id: response.id,
              name: response.name,
              avatar: response.avatar,
              level: response.level,
              description: response.description
            };
          } catch (error) {
            console.error('챗봇 정보 로드 실패:', error);
            throw new Error('챗봇 정보를 불러올 수 없습니다.');
          }
        }
        
        setChatbotInfo(chatbotInfo);

        // 2. 채팅 히스토리 가져오기
        try {
          const historyRequest: ChatHistoryRequest = {
            chatbot_uuid: chatbotId,
            limit: 50,
            offset: 0
          };
          
          const history = await chatAPI.getChatHistory(historyRequest);
          
          if (history.length > 0) {
            const sortedHistory = history.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            setMessages(sortedHistory);
          }
          setHistoryLoaded(true);
        } catch (error) {
          console.error('채팅 히스토리 로드 실패:', error);
          setHistoryLoaded(true);
        }

        // 3. SSE 연결 시작 (한 번만)
        console.log('🔌 초기 SSE 연결 시작');
        startSSEConnection(chatbotId);

      } catch (error) {
        console.error('채팅 초기화 실패:', error);
        setError(error instanceof Error ? error.message : '채팅 초기화에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    // 초기화는 한 번만 실행
    initializeChat();
  }, [search.chatbotId, user, navigate]); // startSSEConnection 의존성 제거

  // SSE 메시지 처리
  const handleSSEMessage = useCallback((data: any) => {
    console.log('📨 SSE 메시지 수신:', data);
    console.log('📨 메시지 타입:', data.type);
    console.log('📨 메시지 내용:', data.content);
    console.log('📨 전체 데이터:', JSON.stringify(data, null, 2));
    
    // 타이핑 이벤트 처리
    if (data.type === 'typing_start' || data.type === 'typing') {
      console.log('⌨️ 타이핑 시작 이벤트');
      setIsTyping(true);
    } else if (data.type === 'typing_stop' || data.type === 'typing_end') {
      console.log('⏹️ 타이핑 중지 이벤트');
      setIsTyping(false);
    } 
    // 사용자 메시지 처리 (SSE로 받은 사용자 메시지)
    else if ((data.type === 'user' || data.type === 'human') && 
             (data.content || data.text || data.message)) {
      
      const messageContent = data.content || data.text || data.message;
      console.log('👤 사용자 메시지 수신 (SSE):', messageContent);
      
      const newMessage: ChatMessage = {
        id: data.uuid || data.id || data.message_id || Date.now().toString(),
        type: 'user',
        content: messageContent,
        timestamp: new Date(data.timestamp || data.created_at || data.time || Date.now()),
        sender: data.sender || data.name || user?.nickname || '나',
        chatbotId: chatbotInfo?.id
      };
      
      console.log('👤 새 사용자 메시지 생성:', newMessage);
      
      setMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        console.log('👤 사용자 메시지 목록 업데이트:', updatedMessages.length);
        return updatedMessages;
      });
      
      // localStorage에 저장
      if (chatbotInfo) {
        chatAPI.saveChatHistory(chatbotInfo.id, [...messages, newMessage]);
      }
      
      // 사용자 메시지 수신 시 전송 중 상태 해제
      setIsSending(false);
      
      console.log('✅ SSE 사용자 메시지 처리 완료');
    }
    // 봇 메시지 처리 (여러 타입과 필드 지원)
    else if ((data.type === 'message' || data.type === 'bot' || data.type === 'chatbot' || data.type === 'assistant') && 
             (data.content || data.text || data.message)) {
      
      const messageContent = data.content || data.text || data.message;
      console.log('💬 봇 메시지 수신:', messageContent);
      
      const newMessage: ChatMessage = {
        id: data.uuid || data.id || data.message_id || Date.now().toString(),
        type: 'chatbot',
        content: messageContent,
        timestamp: new Date(data.timestamp || data.created_at || data.time || Date.now()),
        sender: data.sender || data.name || chatbotInfo?.name || '챗봇',
        chatbotId: chatbotInfo?.id
      };
      
      console.log('💬 새 봇 메시지 생성:', newMessage);
      
      setMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        console.log('💬 봇 메시지 목록 업데이트:', updatedMessages.length);
        return updatedMessages;
      });
      
      setIsTyping(false);
      setIsSending(false); // 봇 메시지 수신 시 전송 중 상태 해제
      
      // localStorage에 저장
      if (chatbotInfo) {
        chatAPI.saveChatHistory(chatbotInfo.id, [...messages, newMessage]);
      }
      
      console.log('✅ SSE 봇 메시지 처리 완료');
    } 
    // 기타 이벤트 처리
    else if (data.type === 'status' || data.type === 'info' || data.type === 'system') {
      console.log('ℹ️ 상태 정보:', data);
    }
    // 알 수 없는 메시지 타입
    else {
      console.log('❓ 알 수 없는 SSE 메시지 타입:', data.type);
      console.log('❓ 전체 데이터:', data);
      
      // 내용이 있는 경우 메시지로 처리 시도
      if (data.content || data.text || data.message) {
        console.log('⚠️ 알 수 없는 타입이지만 내용이 있음 - 기본 메시지로 처리');
        const messageContent = data.content || data.text || data.message;
        
        // 타입을 추측하여 메시지 생성
        let messageType: 'user' | 'chatbot' = 'chatbot';
        if (data.type === 'user' || data.type === 'human' || 
            messageContent.includes('사용자') || messageContent.includes('user')) {
          messageType = 'user';
        }
        
        const newMessage: ChatMessage = {
          id: data.uuid || data.id || data.message_id || Date.now().toString(),
          type: messageType,
          content: messageContent,
          timestamp: new Date(data.timestamp || data.created_at || data.time || Date.now()),
          sender: data.sender || data.name || (messageType === 'user' ? user?.nickname || '나' : chatbotInfo?.name || '챗봇'),
          chatbotId: chatbotInfo?.id
        };
        
        setMessages(prev => [...prev, newMessage]);
        console.log('✅ 알 수 없는 타입 메시지 처리 완료 (타입:', messageType, ')');
      }
    }
  }, [chatbotInfo, messages, user]);

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
      console.log('🧹 컴포넌트 언마운트 - SSE 연결 정리');
      
      // EventSource 정리
      if (eventSourceRef.current) {
        console.log('🔌 EventSource 연결 종료');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      
      // 타이핑 타임아웃 정리
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      
      // 연결 상태 플래그 정리
      isConnectingRef.current = false;
      
      // 백엔드에 채팅 종료 알림
      if (chatbotInfo) {
        const stopRequest: StopChatRequest = {
          chatbot_uuid: chatbotInfo.id
        };
        chatAPI.stopChat(stopRequest);
      }
      
      console.log('✅ 컴포넌트 정리 완료');
    };
  }, [chatbotInfo]);

  // SSE 연결 상태 모니터링 (디버깅용)
  useEffect(() => {
    console.log('🔍 SSE 연결 상태 변경:', isConnected);
    console.log('🔍 EventSource 상태:', eventSourceRef.current?.readyState);
    console.log('🔍 연결 시도 횟수:', connectionAttempts);
  }, [isConnected, connectionAttempts]);

  // 메시지 상태 모니터링 (디버깅용)
  useEffect(() => {
    console.log('💬 메시지 목록 변경:', messages.length);
    if (messages.length > 0) {
      console.log('💬 최신 메시지:', messages[messages.length - 1]);
    }
  }, [messages]);

  // 페이지 포커스/블러 시 연결 상태 확인 - 조건 강화
  useEffect(() => {
    const handleFocus = () => {
      // 연결이 끊어지고, EventSource가 없고, 로딩 중이 아닐 때만 재연결
      if (chatbotInfo && !isLoading && !isConnected && !eventSourceRef.current) {
        console.log('📱 페이지 포커스 - SSE 연결 시도');
        startSSEConnection(chatbotInfo.id);
      }
    };

    const handleBlur = () => {
      console.log('📱 페이지 블러');
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [chatbotInfo, isLoading, isConnected, startSSEConnection]);

  // 네트워크 상태 변화 감지 - 조건 강화
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 네트워크 온라인 - SSE 연결 확인');
      if (chatbotInfo && !isLoading && !isConnected && !eventSourceRef.current) {
        console.log('🔄 네트워크 복구 - SSE 재연결 시도');
        startSSEConnection(chatbotInfo.id);
      }
    };

    const handleOffline = () => {
      console.log('🌐 네트워크 오프라인');
      setIsConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [chatbotInfo, isLoading, isConnected, startSSEConnection]);

  // 브라우저 탭 전환 감지 - 조건 강화
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ 탭 활성화 - SSE 연결 상태 확인');
        if (chatbotInfo && !isLoading && !isConnected && !eventSourceRef.current) {
          console.log('🔄 탭 활성화 - SSE 재연결 시도');
          startSSEConnection(chatbotInfo.id);
        }
      } else {
        console.log('👁️ 탭 비활성화');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [chatbotInfo, isLoading, isConnected, startSSEConnection]);

  // 키보드 입력 이벤트 전송
  const sendTypingEvent = useCallback(async () => {
    if (!chatbotInfo) return;

    try {
      const typingRequest: OnKeyboardRequest = {
        chatbot_uuid: chatbotInfo.id
      };
      await chatAPI.sendOnKeyboardEvent(typingRequest);
    } catch (error) {
      console.warn('키보드 이벤트 전송 실패:', error);
    }
  }, [chatbotInfo]);

  // 메시지 전송 처리
  const handleSendMessage = (message: string) => {
    if (!message.trim() || !chatbotInfo || !user) return;

    console.log('=== 메시지 전송 시작 ===');
    console.log('SSE 연결 상태:', isConnected);

    // 사용자 메시지는 즉시 화면에 표시하지 않음
    // SSE로 type: 'user'인 메시지가 올 때 표시됨
    console.log('📤 메시지 전송됨 - SSE 응답 대기 중...');
    
    setIsTyping(true);
    setIsSending(true); // 전송 중 상태로 설정

    // SSE 연결이 성공적으로 되었다면 SSE로만 처리
    if (isConnected) {
      console.log('✅ SSE 연결됨 - SSE 스트림으로 응답 대기');
      
      // 하지만 사용자 메시지는 백엔드로 전송해야 함 (SSE는 단방향)
      const sendMessageAsync = async () => {
        try {
          const sendRequest: SendMessageRequest = {
            chatbot_uuid: chatbotInfo.id,
            message: message
          };

          console.log('📤 백엔드로 메시지 전송 (응답은 SSE로 대기)');
          await chatAPI.sendMessage(sendRequest);
          
          // 응답은 SSE 스트림에서 자동으로 받음
          console.log('✅ 메시지 전송 완료 - SSE 응답 대기 중...');
          
        } catch (error) {
          console.error('❌ 메시지 전송 실패:', error);
          setIsTyping(false);
          setIsSending(false); // 전송 실패 시 상태 해제
          
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

      // 비동기로 메시지 전송 실행
      sendMessageAsync();
      
    } else {
      console.log('⚠️ SSE 연결 안됨 - API로 폴백 처리');
      
      // SSE 연결이 안 된 경우에만 API로 메시지 전송
      const sendMessageAsync = async () => {
        try {
          const sendRequest: SendMessageRequest = {
            chatbot_uuid: chatbotInfo.id,
            message: message
          };

          const response = await chatAPI.sendMessage(sendRequest);
          console.log('API 응답:', response);

          // API 응답이 있으면 즉시 추가
          if (response.message) {
            const botResponse: ChatMessage = {
              id: response.session_id || (Date.now() + 1).toString(),
              type: 'chatbot',
              content: response.message,
              timestamp: new Date(response.timestamp || Date.now()),
              sender: chatbotInfo.name,
              chatbotId: chatbotInfo.id
            };
            
            const finalMessages = [...messages, botResponse];
            setMessages(finalMessages);
            
            // localStorage에 히스토리 저장
            chatAPI.saveChatHistory(chatbotInfo.id, finalMessages);
            
            setIsTyping(false);
            setIsSending(false); // 전송 완료 시 상태 해제
            console.log('봇 응답 추가 완료 (API 폴백)');
          }
        } catch (error) {
          console.error('메시지 전송 실패:', error);
          setIsTyping(false);
          setIsSending(false); // 전송 실패 시 상태 해제
          
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

      // 비동기로 메시지 전송 실행
      sendMessageAsync();
    }
  };

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 로딩 중 또는 에러 상태
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-[#fbf5ff] items-center justify-center">
        <div className="text-[#8E8EE7] text-lg">채팅을 시작하는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-[#fbf5ff] items-center justify-center">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-[#8E8EE7] text-white rounded-lg hover:bg-[#7A7AD7]"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!chatbotInfo) {
    return (
      <div className="flex flex-col h-screen bg-[#fbf5ff] items-center justify-center">
        <div className="text-red-500 text-lg">챗봇 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fbf5ff]">
      {/* 채팅 헤더 */}
      <ChatHeader 
        chatbotName={chatbotInfo.name}
        chatbotAvatar={chatbotInfo.avatar}
        isConnected={isConnected}
      />

      {/* 연결 상태 알림 */}
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-auto w-[393px] max-w-[90vw]">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm">
              실시간 연결이 끊어졌습니다. 재연결을 시도하고 있습니다...
            </span>
          </div>
        </div>
      )}

      {/* 메시지 영역 */}
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

      {/* 입력 영역 */}
      <div>
        <div className="w-[393px] max-w-[90vw] mx-auto">
          <ChatInput 
            onSendMessage={handleSendMessage}
            onTyping={sendTypingEvent}
            disabled={!isConnected || isSending}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
}