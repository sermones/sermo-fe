import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatMessages } from '../../components/chat/ChatMessages';
import { ChatInput } from '../../components/chat/ChatInput';
import { chatAPI } from '../../api/chat';
import { ChatMessage, ChatbotInfo, SSEMessage } from '../../types/chat';
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
  const { user, isLoading: authLoading } = useAuth(); // authLoading 추가
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotInfo, setChatbotInfo] = useState<ChatbotInfo | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSSEReady, setIsSSEReady] = useState(false); // SSE 연결 완료 상태 추가
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // 컴포넌트 초기화 (한 번만 실행)
  useEffect(() => {
    const initializeChat = async () => {
      // 인증 상태가 완전히 복원될 때까지 대기
      if (authLoading) {
        console.log('🔄 인증 상태 복원 중, 대기...');
        return;
      }

      // 토큰이 실제로 존재하는지 확인
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔄 토큰이 아직 복원되지 않음, 대기...');
        return;
      }

      const chatbotId = search.chatbotId;
      
      // 인증 상태 확인
      if (!user || !user.uuid) {
        console.log('❌ 사용자가 인증되지 않음, 로그인 페이지로 이동');
        navigate({ to: '/' });
        return;
      }
      
      if (!chatbotId) {
        console.log('❌ chatbotId가 없음, 홈으로 이동');
        navigate({ to: '/home' });
        return;
      }

      try {
        setIsLoading(true);
        console.log('=== 채팅 초기화 시작 ===');
        console.log('chatbotId:', chatbotId);
        console.log('user:', user);
        console.log('user.uuid:', user.uuid);
        console.log('인증 토큰:', token);
        console.log('토큰 길이:', token.length);
        console.log('토큰 시작 부분:', token.substring(0, 20));

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

        // 3. SSE 연결을 통한 채팅 세션 시작
        try {
          console.log('=== SSE 연결 시작 ===');
          console.log('SSE 연결 시도 전 상태:', {
            chatbotId,
            userId: user.uuid,
            token: token.substring(0, 20) + '...',
            tokenLength: token.length
          });
          
          // 폴백 세션 함수 제거 - SSE 연결 실패 시에도 계속 시도
          
          // EventSource 직접 생성 (chatAPI.startChatSSE 대신)
          console.log('🔄 EventSource 직접 생성 시도...');
          const sseUrl = `/chat/start?chatbot_uuid=${chatbotId}&token=${token}`;
          console.log('SSE URL:', sseUrl);
          
          // 백엔드 연결 상태 먼저 테스트 (폴백 없이 계속 시도)
          try {
            console.log('🔄 백엔드 연결 상태 테스트 시작...');
            const testResponse = await fetch(`/chat/start?chatbot_uuid=${chatbotId}&token=${token}`, {
              method: 'GET',
              headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache'
              }
            });
            
            console.log('백엔드 테스트 응답 상태:', testResponse.status);
            console.log('백엔드 테스트 응답 헤더:', Object.fromEntries(testResponse.headers.entries()));
            
            if (testResponse.status === 200) {
              console.log('✅ 백엔드 연결 성공, SSE 연결 시도...');
            } else {
              console.log('❌ 백엔드 연결 실패, 상태 코드:', testResponse.status);
              console.log('응답 텍스트:', await testResponse.text());
              console.log('🔄 백엔드 연결 실패했지만 계속 SSE 연결 시도...');
              // 폴백으로 넘어가지 않고 계속 시도
            }
          } catch (testError) {
            console.error('❌ 백엔드 연결 테스트 실패:', testError);
            console.log('🔄 백엔드 테스트 실패했지만 계속 SSE 연결 시도...');
            // 폴백으로 넘어가지 않고 계속 시도
          }
          
          try {
            const eventSource = new EventSource(sseUrl);
            console.log('✅ EventSource 생성 성공:', eventSource);
            console.log('EventSource 속성:', {
              readyState: eventSource.readyState,
              url: eventSource.url,
              withCredentials: eventSource.withCredentials
            });
            
            eventSourceRef.current = eventSource;
            
            // EventSource 이벤트 리스너 설정
            eventSource.addEventListener('open', (event) => {
              console.log('✅ SSE 연결 열림 이벤트 발생:', event);
              console.log('이벤트 발생 시 readyState:', eventSource.readyState);
              setIsConnected(true);
              setIsSSEReady(true);
              console.log('상태 업데이트: isConnected=true, isSSEReady=true');
            });
            
            eventSource.addEventListener('error', (error) => {
              console.error('❌ SSE 연결 오류 이벤트 발생:', error);
              console.log('오류 발생 시 readyState:', eventSource.readyState);
              console.log('오류 타입:', error.type);
              console.log('오류 상세:', error);
              setIsConnected(false);
              setIsSSEReady(false);
            });
            
            eventSource.addEventListener('message', (event) => {
              console.log('📨 SSE 메시지 이벤트 발생:', event);
              console.log('메시지 데이터:', event.data);
              try {
                const parsedData = JSON.parse(event.data);
                console.log('📨 파싱된 SSE 메시지:', parsedData);
                // handleSSEMessage 호출
                handleSSEMessage(parsedData);
              } catch (parseError) {
                console.log('📨 파싱되지 않은 SSE 메시지:', event.data);
              }
            });
            
            console.log('✅ SSE 이벤트 리스너 설정 완료');
            
          } catch (eventSourceError: any) {
            console.error('❌ EventSource 생성 실패:', eventSourceError);
            console.log('=== EventSource 생성 실패 상세 분석 ===');
            console.log('오류 타입:', eventSourceError?.constructor?.name || 'Unknown');
            console.log('오류 메시지:', eventSourceError?.message || 'No message');
            console.log('오류 스택:', eventSourceError?.stack || 'No stack');
            console.log('=== EventSource 생성 실패 분석 완료 ===');
            
            // EventSource 생성 실패 시에도 폴백하지 않고 계속 시도
            console.log('🔄 EventSource 생성 실패했지만 계속 시도...');
            // 폴백으로 넘어가지 않고 계속 시도
          }
          
          // SSE 연결 타임아웃 설정 (무한 대기로 변경)
          const connectionTimeout = setTimeout(() => {
            console.log('⏰ SSE 연결 타임아웃 (60초) - 하지만 계속 시도');
            if (eventSourceRef.current?.readyState !== EventSource.OPEN) {
              console.log('⚠️ 타임아웃 발생했지만 폴백으로 넘어가지 않고 계속 시도');
              // 타임아웃이 발생해도 폴백으로 넘어가지 않음
              // connectionCheckInterval에서 계속 재연결 시도
            }
          }, 60000); // 60초로 증가
          
          // 5초마다 SSE 연결 상태 재확인 및 재연결 시도
          const connectionCheckInterval = setInterval(() => {
            console.log('⏰ 5초마다 SSE 연결 상태 확인 및 재연결 시도');
            console.log('현재 상태:', {
              readyState: eventSourceRef.current?.readyState,
              isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
              isSSEReady: eventSourceRef.current?.readyState === EventSource.OPEN
            });
            
            if (eventSourceRef.current?.readyState === EventSource.OPEN) {
              console.log('✅ SSE 연결이 정상적으로 유지됨');
              clearTimeout(connectionTimeout); // 타임아웃 정리
              clearInterval(connectionCheckInterval); // 인터벌 정리
              setIsSSEReady(true);
              console.log('상태 업데이트: isSSEReady=true');
              console.log('🔄 백엔드 응답 테스트를 위해 메시지 전송 시도...');
            } else if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
              console.log('⚠️ SSE 연결이 닫힘, 재연결 시도...');
              clearTimeout(connectionTimeout); // 타임아웃 정리
              clearInterval(connectionCheckInterval); // 인터벌 정리
              
              // EventSource 재생성 시도
              try {
                console.log('🔄 EventSource 재생성 시도...');
                const newEventSource = new EventSource(
                  `/chat/start?chatbot_uuid=${chatbotId}&token=${token}`
                );
                
                newEventSource.addEventListener('open', () => {
                  console.log('✅ 재연결 성공!');
                  setIsConnected(true);
                  setIsSSEReady(true);
                  eventSourceRef.current = newEventSource;
                });
                
                newEventSource.addEventListener('error', (error) => {
                  console.log('❌ 재연결 실패, 하지만 계속 시도');
                  newEventSource.close();
                  // 폴백으로 넘어가지 않고 계속 시도
                });
                
                // 재연결 시도 타임아웃 (무한 대기로 변경)
                setTimeout(() => {
                  if (newEventSource.readyState !== EventSource.OPEN) {
                    console.log('⏰ 재연결 타임아웃 (30초), 하지만 계속 시도');
                    newEventSource.close();
                    // 폴백으로 넘어가지 않고 계속 시도
                  }
                }, 30000);
                
              } catch (reconnectError) {
                console.error('❌ EventSource 재생성 실패:', reconnectError);
                console.log('🔄 재생성 실패했지만 계속 시도...');
                // 폴백으로 넘어가지 않고 계속 시도
              }
            } else {
              console.log('🔄 SSE 연결 중 (readyState: CONNECTING), 계속 대기...');
              // CONNECTING 상태면 계속 대기
            }
          }, 5000); // 5초마다 실행
          
        } catch (error: any) {
          console.error('SSE 연결 실패:', error);
          console.log('=== SSE 연결 실패 상세 분석 ===');
          console.log('오류 타입:', error?.constructor?.name || 'Unknown');
          console.log('오류 메시지:', error?.message || 'No message');
          console.log('오류 스택:', error?.stack || 'No stack');
          console.log('=== SSE 연결 실패 분석 완료 ===');
          
          // SSE 실패 시에도 폴백으로 넘어가지 않고 계속 시도
          console.log('🔄 SSE 연결 실패했지만 폴백으로 넘어가지 않고 계속 시도...');
          // 폴백 세션을 시작하지 않고 계속 SSE 연결 시도
          // connectionCheckInterval에서 계속 재연결 시도
        }

      } catch (error) {
        console.error('채팅 초기화 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [search.chatbotId, user, navigate, authLoading]);

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
      console.log('=== 채팅 페이지 언마운트, 세션 정리 시작 ===');
      handleStopChat();
    };
  }, [chatbotInfo]); // chatbotInfo가 변경될 때마다 정리 함수 업데이트
   
  // SSE 연결 상태 변화 추적
  useEffect(() => {
    console.log('=== SSE 연결 상태 변화 감지 ===');
    console.log('isConnected:', isConnected);
    console.log('isSSEReady:', isSSEReady);
    console.log('eventSource readyState:', eventSourceRef.current?.readyState);
    console.log('sessionId:', sessionId);
  }, [isConnected, isSSEReady, sessionId]);
   
  // 컴포넌트 언마운트 시 모든 타이머와 인터벌 정리
  useEffect(() => {
    return () => {
      console.log('=== 컴포넌트 언마운트, 모든 타이머 정리 ===');
      // 모든 타이머와 인터벌을 정리하는 로직은 handleStopChat에서 처리됨
    };
  }, []);

  // 페이지 이동 시 세션 정리 (beforeunload 이벤트)
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('=== 페이지 이동 감지, 세션 정리 ===');
      handleStopChat();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [chatbotInfo]);

  // 인증 상태 변화 추적
  useEffect(() => {
    console.log('=== 인증 상태 변화 감지 ===');
    console.log('authLoading:', authLoading);
    console.log('user:', user);
    console.log('user?.uuid:', user?.uuid);
    console.log('localStorage token:', localStorage.getItem('token') ? '있음' : '없음');
  }, [authLoading, user]);

  // SSE 메시지 처리
  const handleSSEMessage = (data: SSEMessage) => {
    if (!chatbotInfo) return;
    
    console.log('=== SSE 메시지 처리 시작 ===');
    console.log('수신된 데이터:', data);
    console.log('현재 세션 ID:', sessionId);
    
    // 세션 ID 저장
    if (data.session_id && !sessionId) {
      setSessionId(data.session_id);
      console.log('✅ 새로운 세션 ID 설정:', data.session_id);
    }
    
    if (data.type === 'bot' && data.content) {
      // 봇 응답 메시지
      console.log('봇 응답 메시지 수신:', data.content);
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'chatbot',
        content: data.content,
        timestamp: data.timestamp,
        sender: chatbotInfo.name,
        chatbotId: chatbotInfo.id
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      // 메시지 수신 시 히스토리 저장
      const updatedMessages = [...messages, newMessage];
      chatAPI.saveChatHistory(chatbotInfo.id, updatedMessages);
      console.log('✅ 봇 응답 메시지 처리 완료');
    } else if (data.type === 'user' && data.content) {
      // 사용자 메시지 (백엔드에서 에코로 보내는 경우)
      // 화면에 표시하지 않고 로그만 출력
      console.log('사용자 메시지 에코 수신 (화면에 표시하지 않음):', data.content);
    } else if (data.type === 'bot_typing') {
      // 봇 타이핑 상태
      if (data.is_typing) {
        console.log('🔄 봇 타이핑 시작');
        setIsTyping(true);
      } else {
        console.log('⏹️ 봇 타이핑 종료');
        setIsTyping(false);
      }
    } else {
      console.log('⚠️ 알 수 없는 메시지 타입:', data.type);
    }
    
    console.log('=== SSE 메시지 처리 완료 ===');
  };

  // 채팅 세션 정리
  const handleStopChat = async () => {
    try {
      console.log('=== 채팅 세션 정리 시작 ===');
      
      // SSE 연결 종료
      if (eventSourceRef.current) {
        console.log('SSE 연결 종료 중...');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
        setIsConnected(false);
        console.log('✅ SSE 연결 종료 완료');
      }

      // 백엔드 세션 정리
      if (chatbotInfo) {
        console.log('백엔드 세션 정리 중...');
        const success = await chatAPI.stopChat(chatbotInfo.id);
        if (success) {
          console.log('✅ 백엔드 세션 정리 완료');
        } else {
          console.error('❌ 백엔드 세션 정리 실패');
        }
      }
      
      console.log('✅ 채팅 세션 정리 완료');
    } catch (error) {
      console.error('❌ 세션 정리 중 오류:', error);
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !chatbotInfo || !user) return;

            // SSE 연결 상태 확인
        if (!isSSEReady) {
          console.log('⚠️ SSE 연결이 아직 준비되지 않음, 메시지 전송 차단');
          
          // 사용자에게 연결 상태 안내 (폴백 없이 계속 시도 중임을 명시)
          const statusMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'chatbot',
            content: '실시간 연결을 설정하는 중입니다. 계속 시도하고 있습니다...',
            timestamp: new Date().toISOString(),
            sender: chatbotInfo.name,
            chatbotId: chatbotInfo.id
          };
          setMessages(prev => [...prev, statusMessage]);
          return;
        }

    console.log('=== 메시지 전송 시작 ===');
    console.log('전송할 메시지:', message);
    console.log('chatbotId:', chatbotInfo.id);
    console.log('userId:', user.uuid);
    console.log('SSE 연결 상태:', isConnected);
    console.log('SSE 준비 상태:', isSSEReady);
    console.log('EventSource 상태:', eventSourceRef.current?.readyState);
    console.log('세션 ID:', sessionId);

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
      // SSE가 실제로 연결되어 있는지 더 엄격하게 확인
      const isSSEConnected = isSSEReady && 
        eventSourceRef.current && 
        eventSourceRef.current.readyState === EventSource.OPEN &&
        sessionId; // 세션 ID가 있어야 함
      
      console.log('SSE 연결 상태 상세:', {
        isConnected,
        isSSEReady,
        hasEventSource: !!eventSourceRef.current,
        readyState: eventSourceRef.current?.readyState,
        hasSessionId: !!sessionId,
        isSSEConnected
      });
      
      if (isSSEConnected) {
        console.log('✅ SSE를 통한 메시지 전송');
        
        // 백엔드로 메시지 전송 (SSE 연결이 활성화되어 있으면 자동으로 응답을 받을 것)
        const response = await chatAPI.sendMessage({
          sessionId: sessionId,
          message,
          chatbotId: chatbotInfo.id,
          userId: user.uuid
        });
        
        if (!response.success) {
          console.error('메시지 전송 실패:', response);
          setIsTyping(false);
        }
        // SSE 연결이 활성화되어 있으면 백엔드에서 자동으로 응답을 보낼 것
      } else {
        // SSE가 연결되지 않은 경우 기존 API 방식 사용
        console.log('⚠️ SSE 연결 안됨, 기존 API 방식으로 메시지 전송');
        console.log('isConnected:', isConnected);
        console.log('isSSEReady:', isSSEReady);
        console.log('eventSourceRef.current:', eventSourceRef.current);
        console.log('readyState:', eventSourceRef.current?.readyState);
        console.log('sessionId:', sessionId);
        
        // SSE가 아직 준비되지 않은 경우 사용자에게 대기 메시지 표시
        if (!isSSEReady && eventSourceRef.current?.readyState === EventSource.CONNECTING) {
          console.log('🔄 SSE 연결 중, 잠시 대기...');
          const waitingMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'chatbot',
            content: '연결을 설정하는 중입니다. 잠시만 기다려주세요...',
            timestamp: new Date().toISOString(),
            sender: chatbotInfo.name,
            chatbotId: chatbotInfo.id
          };
          setMessages(prev => [...prev, waitingMessage]);
          setIsTyping(false);
          return;
        }
        
        const response = await chatAPI.sendMessage({
          sessionId: sessionId || 'fallback-session',
          message,
          chatbotId: chatbotInfo.id,
          userId: user.uuid
        });

        console.log('API 응답:', response);

        if (response.success && response.response) {
          // API 응답이 있으면 즉시 추가
          console.log('=== 백엔드 응답 분석 시작 ===');
          console.log('전체 응답:', response);
          console.log('응답 타입:', response.message_type);
          console.log('응답 내용:', response.response);
          console.log('세션 ID:', response.sessionId);
          console.log('타임스탬프:', response.timestamp);
          console.log('사용자 메시지와 동일한지 확인:', response.response === message);
          console.log('=== 백엔드 응답 분석 완료 ===');
          
          // 사용자 메시지 에코인지 확인 (백엔드에서 message_type으로 구분)
          if (response.message_type === 'user') {
            console.log('⚠️ 사용자 메시지 에코 감지, 완전히 무시함:', response.response);
            console.log('🔄 AI 응답을 기다리는 중... (사용자 에코는 표시하지 않음)');
            setIsTyping(true); // AI 응답을 기다리는 상태로 설정
            
            // 사용자 에코는 화면에 표시하지 않고, 타이핑 상태만 유지
            // AI 응답이 올 때까지 기다림
            
            // AI 응답 대기 타임아웃 설정 (20초)
            setTimeout(() => {
              if (isTyping) {
                console.log('⏰ AI 응답 타임아웃 (20초), 타이핑 상태 해제');
                setIsTyping(false);
                
                // 타임아웃 메시지 표시
                const timeoutMessage: ChatMessage = {
                  id: (Date.now() + 1).toString(),
                  type: 'chatbot',
                  content: 'AI 응답이 오지 않았습니다. 다시 시도해주세요.',
                  timestamp: new Date().toISOString(),
                  sender: chatbotInfo.name,
                  chatbotId: chatbotInfo.id
                };
                setMessages(prev => [...prev, timeoutMessage]);
              }
            }, 20000);
            
            return;
          }
          
          // AI 응답인 경우에만 화면에 표시
          if (response.message_type === 'bot' || !response.message_type) {
            console.log('✅ AI 응답 수신:', response.response);
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
          } else {
            console.log('⚠️ 알 수 없는 응답 타입:', response.message_type);
            setIsTyping(false);
          }
        } else {
          // 응답이 없거나 실패한 경우
          console.log('⚠️ 백엔드 응답이 없거나 실패, AI 응답을 기다리는 중...');
          setIsTyping(true);
          
          // AI 응답 대기 타임아웃 설정 (15초)
          setTimeout(() => {
            if (isTyping) {
              console.log('⏰ AI 응답 타임아웃 (15초), 타이핑 상태 해제');
              setIsTyping(false);
              
              // 타임아웃 메시지 표시
              const timeoutMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'chatbot',
                content: 'AI 응답이 오지 않았습니다. 다시 시도해주세요.',
                timestamp: new Date().toISOString(),
                sender: chatbotInfo.name,
                chatbotId: chatbotInfo.id
              };
              setMessages(prev => [...prev, timeoutMessage]);
            }
          }, 15000);
        }
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

  if (authLoading || isLoading || !chatbotInfo) {
    const token = localStorage.getItem('token');
    const isTokenReady = !!token;
    
    return (
      <div className="flex flex-col h-screen bg-[#fbf5ff] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E8EE7] mx-auto mb-4"></div>
          <div className="text-[#8E8EE7] text-lg">
            {authLoading ? '인증 상태를 확인하는 중...' : '실시간 연결을 설정하는 중...'}
          </div>
          {authLoading && (
            <div className="text-[#8E8EE7] text-sm mt-2">
              {isTokenReady ? '토큰 확인 중...' : '토큰 복원 중...'}
            </div>
          )}
          {!authLoading && isLoading && (
            <div className="text-[#8E8EE7] text-sm mt-2">
              SSE 연결을 계속 시도하고 있습니다...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#fbf5ff]">
             {/* 채팅 헤더 - 고정 */}
       <ChatHeader 
         chatbotName={chatbotInfo.name}
         chatbotAvatar={chatbotInfo.avatar}
         chatbotId={chatbotInfo.id}
         onStopChat={handleStopChat}
         isSSEReady={isSSEReady} // SSE 연결 상태 전달
         isConnected={isConnected} // SSE 연결 상태 추가
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
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isDisabled={!isSSEReady} // SSE 연결 상태에 따라 입력 비활성화
          />
        </div>
      </div>
    </div>
  );
}