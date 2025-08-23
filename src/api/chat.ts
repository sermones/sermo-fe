import { 
  StartChatRequest, 
  StartChatResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  ChatMessage,
  SSEMessage,
  StopChatRequest,
  StopChatResponse
} from '../types/chat';

// 환경에 따른 API URL 설정
// 개발 환경에서는 Vite 프록시를 통해 호출 (CORS 문제 해결)
const API_BASE_URL = import.meta.env.DEV 
  ? ''  // 상대 경로 사용 (Vite 프록시가 처리)
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

console.log('API_BASE_URL:', API_BASE_URL);
console.log('개발 환경:', import.meta.env.DEV);

// 인증 토큰 가져오기
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// 인증 헤더 생성
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const chatAPI = {
  // 챗봇 정보 가져오기 (실제 API 호출)
  async getChatbotInfo(chatbotId: string): Promise<any> {
    try {
      console.log('=== getChatbotInfo API 호출 ===');
      console.log('chatbotId:', chatbotId);

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chatbot/${chatbotId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        // CORS 문제 방지를 위해 credentials 옵션 제거
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        
        // API 실패 시 임시 데이터로 폴백
        console.log('⚠️ API 실패, 임시 데이터 사용');
        const fallbackInfo = {
          uuid: chatbotId,
          name: chatbotId.includes('alexander') ? '알렉산더' : '테스트 챗봇',
          image_url: '/Checker.png',
          level: '초급',
          details: '테스트용 챗봇입니다.'
        };
        return fallbackInfo;
      }

      const responseData = await response.json();
      console.log('✅ 실제 API에서 챗봇 정보 로드:', responseData);
      return responseData;
    } catch (error) {
      console.error('챗봇 정보 조회 실패:', error);
      
      // 에러 시 임시 데이터로 폴백
      console.log('⚠️ 에러 발생, 임시 데이터 사용');
      const fallbackInfo = {
        uuid: chatbotId,
        name: chatbotId.includes('alexander') ? '알렉산더' : '테스트 챗봇',
        image_url: '/Checker.png',
        level: '초급',
        details: '테스트용 챗봇입니다.'
      };
      return fallbackInfo;
    }
  },

  // SSE 연결을 통한 채팅 세션 시작
  async startChatSSE(chatbotId: string, onMessage: (data: SSEMessage) => void): Promise<EventSource> {
    try {
      console.log('=== startChatSSE API 호출 ===');
      console.log('chatbotId:', chatbotId);

      // 인증 토큰 가져오기
      const token = getAuthToken();
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      console.log('토큰 확인됨:', token.substring(0, 20) + '...');

      // SSE 연결 생성 (쿼리 파라미터로 토큰 전달)
      // 백엔드에서 JWT 토큰을 쿼리 파라미터로 받아서 인증 처리
      const sseUrl = `${API_BASE_URL}/chat/start?chatbot_uuid=${chatbotId}&token=${token}`;
      console.log('SSE URL:', sseUrl);
      
      // CORS 문제 해결을 위해 withCredentials 제거
      const eventSource = new EventSource(sseUrl);

      console.log('EventSource 생성됨, readyState:', eventSource.readyState);

      // 메시지 수신 처리
      eventSource.onmessage = (event) => {
        try {
          console.log('SSE 원시 메시지:', event.data);
          const data: SSEMessage = JSON.parse(event.data);
          console.log('SSE 메시지 파싱 완료:', data);
          onMessage(data);
        } catch (error) {
          console.error('SSE 데이터 파싱 실패:', error);
          console.error('파싱 실패한 데이터:', event.data);
        }
      };

      // 연결 오류 처리
      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        console.error('EventSource readyState:', eventSource.readyState);
        eventSource.close();
      };

      // 연결 열림 처리
      eventSource.onopen = () => {
        console.log('✅ SSE 연결 열림 이벤트 발생');
        console.log('EventSource readyState:', eventSource.readyState);
      };

      // 추가 이벤트 리스너
      eventSource.addEventListener('open', () => {
        console.log('✅ SSE open 이벤트 리스너');
      });

      eventSource.addEventListener('error', (event) => {
        console.error('❌ SSE error 이벤트 리스너:', event);
      });

      return eventSource;
    } catch (error) {
      console.error('SSE 연결 생성 실패:', error);
      throw error;
    }
  },

  // 채팅 세션 시작 (실제 API 호출)
  async startChat(request: StartChatRequest): Promise<StartChatResponse> {
    try {
      console.log('=== startChat API 호출 ===');
      console.log('요청 데이터:', request);

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/start?chatbot_uuid=${request.chatbotId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        
        // API 실패 시 임시 세션으로 폴백
        console.log('⚠️ API 실패, 임시 세션 사용');
        const fallbackResponse: StartChatResponse = {
          success: true,
          sessionId: 'temp-session-' + Date.now(),
          message: '테스트 세션이 시작되었습니다.'
        };
        return fallbackResponse;
      }

      // SSE 응답이므로 실제 JSON 응답이 아닐 수 있음
      console.log('✅ 실제 API에서 세션 시작됨 (SSE 연결)');
      const fallbackResponse: StartChatResponse = {
        success: true,
        sessionId: 'sse-session-' + Date.now(),
        message: '실제 세션이 시작되었습니다.'
      };
      return fallbackResponse;
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      
      // 에러 시 임시 세션으로 폴백
      console.log('⚠️ 에러 발생, 임시 세션 사용');
      const fallbackResponse: StartChatResponse = {
        success: true,
        sessionId: 'error-session-' + Date.now(),
        message: '테스트 세션이 시작되었습니다.'
      };
      return fallbackResponse;
    }
  },

  // 메시지 전송 (실제 API 호출)
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      console.log('=== sendMessage API 호출 ===');
      console.log('요청 데이터:', request);

      // 세션 ID가 없거나 빈 문자열인 경우 처리
      if (!request.sessionId || request.sessionId === '') {
        console.log('⚠️ 세션 ID가 없음, 폴백 응답 생성');
        return this.generateFallbackResponse(request.message);
      }

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chatbot_uuid: request.chatbotId,
          message: request.message
          // session_id는 백엔드에서 자동으로 처리하도록 제거
        }),
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        
        // API 실패 시 임시 응답으로 폴백
        console.log('⚠️ API 실패, 임시 응답 사용');
        const fallbackResponse = this.generateFallbackResponse(request.message);
        return fallbackResponse;
      }

      const responseData = await response.json();
      console.log('✅ 실제 API에서 응답 받음:', responseData);
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const apiResponse: SendMessageResponse = {
        success: true,
        response: responseData.message || responseData.content || '메시지가 전송되었습니다.',
        sessionId: responseData.session_id || request.sessionId
      };
      
      return apiResponse;
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      
      // 에러 시 임시 응답으로 폴백
      console.log('⚠️ 에러 발생, 임시 응답 사용');
      const fallbackResponse = this.generateFallbackResponse(request.message);
      return fallbackResponse;
    }
  },

  // 폴백 응답 생성 (API 실패 시 사용)
  generateFallbackResponse(message: string): SendMessageResponse {
    const mockResponses = [
      '안녕하세요! 무엇을 도와드릴까요?',
      '흥미로운 질문이네요. 더 자세히 설명해주세요.',
      '그렇군요. 제가 이해한 것이 맞나요?',
      '좋은 아이디어입니다!',
      '음... 그건 좀 복잡하네요. 다른 방법을 생각해보겠습니다.',
      '정말 재미있는 대화였습니다!',
      '더 궁금한 것이 있으시면 언제든 말씀해주세요.'
    ];

    // 랜덤하게 응답 선택
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    // 사용자 메시지에 따른 간단한 응답 생성
    let botResponse = randomResponse;
    if (message.includes('안녕') || message.includes('hi') || message.includes('hello')) {
      botResponse = '안녕하세요! 반갑습니다! 😊';
    } else if (message.includes('감사') || message.includes('thank')) {
      botResponse = '천만에요! 더 도움이 필요하시면 언제든 말씀해주세요!';
    } else if (message.includes('테스트') || message.includes('test')) {
      botResponse = '테스트 메시지가 잘 전송되었습니다! 🎉';
    }

    return {
      success: true,
      response: botResponse,
      sessionId: 'fallback-session-' + Date.now()
    };
  },

  // 채팅 기록 조회 (실제 API 호출)
  async getChatHistory(chatbotId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      console.log('getChatHistory 호출:', { chatbotId, limit, offset });

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chatbot_uuid: chatbotId,
          limit: limit,
          offset: offset
        }),
      });

      console.log('API 응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        
        // API 실패 시 localStorage에서 히스토리 가져오기
        console.log('⚠️ API 실패, localStorage에서 히스토리 로드');
        return this.getLocalStorageHistory(chatbotId);
      }

      const data = await response.json();
      console.log('✅ 실제 API에서 히스토리 로드:', data);
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const convertedMessages = data.messages.map((msg: any) => ({
        id: msg.uuid,
        type: msg.message_type === 'user' ? 'user' : 'chatbot',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        sender: msg.message_type === 'user' ? '나' : '챗봇',
        chatbotId: chatbotId
      }));
      
      console.log('변환된 메시지:', convertedMessages);
      return convertedMessages;
    } catch (error) {
      console.error('채팅 기록 조회 실패:', error);
      
      // 에러 시 localStorage에서 히스토리 로드
      console.log('⚠️ 에러 발생, localStorage에서 히스토리 로드');
      return this.getLocalStorageHistory(chatbotId);
    }
  },

  // localStorage에서 히스토리 가져오기 (폴백용)
  getLocalStorageHistory(chatbotId: string): ChatMessage[] {
    try {
      const storageKey = `chat_history_${chatbotId}`;
      const storedHistory = localStorage.getItem(storageKey);
      
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        console.log('✅ localStorage에서 히스토리 로드:', parsedHistory);
        return parsedHistory;
      }

      console.log('ℹ️ 저장된 히스토리 없음');
      return [];
    } catch (error) {
      console.error('localStorage 히스토리 로드 실패:', error);
      return [];
    }
  },

  // 채팅 세션 종료 (백엔드 API 사용)
  async stopChat(chatbotId: string): Promise<boolean> {
    try {
      console.log('=== stopChat API 호출 ===');
      console.log('chatbotId:', chatbotId);

      const request: StopChatRequest = {
        chatbot_uuid: chatbotId
      };

      const response = await fetch(`${API_BASE_URL}/chat/stop`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('세션 종료 API 오류:', errorText);
        return false;
      }

      const result: StopChatResponse = await response.json();
      console.log('✅ 세션 종료 성공:', result);
      return result.success;
    } catch (error) {
      console.error('채팅 종료 실패:', error);
      return false;
    }
  },

  // 채팅 히스토리 저장 (임시 테스트용)
  saveChatHistory(chatbotId: string, messages: ChatMessage[]): void {
    try {
      const storageKey = `chat_history_${chatbotId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
      console.log('✅ 채팅 히스토리 저장 완료:', storageKey, messages.length);
    } catch (error) {
      console.error('채팅 히스토리 저장 실패:', error);
    }
  },

  // SSE 연결로 실시간 응답 받기 (선택적)
  createSSEConnection(sessionId: string, onMessage: (data: any) => void): EventSource | null {
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/chat/stream?sessionId=${sessionId}`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('SSE 데이터 파싱 실패:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        eventSource.close();
      };

      return eventSource;
    } catch (error) {
      console.error('SSE 연결 생성 실패:', error);
      return null;
    }
  }
};
