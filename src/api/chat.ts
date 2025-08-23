import { 
  StartChatRequest, 
  StartChatResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  ChatMessage 
} from '../types/chat';

const API_BASE_URL = 'http://localhost:3000';

// 임시 테스트용 사용자 UUID (실제로는 백엔드에서 토큰으로 추출)
const TEMP_USER_UUID = 'test-user-123';
const TEMP_SESSION_ID = 'test-session-456';

export const chatAPI = {
  // 챗봇 정보 가져오기 (실제 API 호출)
  async getChatbotInfo(chatbotId: string): Promise<any> {
    try {
      console.log('=== getChatbotInfo API 호출 ===');
      console.log('chatbotId:', chatbotId);

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chatbot/${chatbotId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 임시로 테스트용 사용자 UUID를 헤더에 포함
          'X-User-UUID': TEMP_USER_UUID,
        },
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
  // 채팅 세션 시작 (실제 API 호출)
  async startChat(request: StartChatRequest): Promise<StartChatResponse> {
    try {
      console.log('=== startChat API 호출 ===');
      console.log('요청 데이터:', request);

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/start?chatbot_uuid=${request.chatbotId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 임시로 테스트용 사용자 UUID를 헤더에 포함
          'X-User-UUID': request.userId || TEMP_USER_UUID,
        },
      });

      console.log('응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        
        // API 실패 시 임시 세션으로 폴백
        console.log('⚠️ API 실패, 임시 세션 사용');
        const fallbackResponse: StartChatResponse = {
          success: true,
          sessionId: TEMP_SESSION_ID,
          message: '테스트 세션이 시작되었습니다.'
        };
        return fallbackResponse;
      }

      // SSE 응답이므로 실제 JSON 응답이 아닐 수 있음
      console.log('✅ 실제 API에서 세션 시작됨 (SSE 연결)');
      const fallbackResponse: StartChatResponse = {
        success: true,
        sessionId: TEMP_SESSION_ID,
        message: '실제 세션이 시작되었습니다.'
      };
      return fallbackResponse;
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      
      // 에러 시 임시 세션으로 폴백
      console.log('⚠️ 에러 발생, 임시 세션 사용');
      const fallbackResponse: StartChatResponse = {
        success: true,
        sessionId: TEMP_SESSION_ID,
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

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 임시로 테스트용 사용자 UUID를 헤더에 포함
          'X-User-UUID': request.userId || TEMP_USER_UUID,
        },
        body: JSON.stringify({
          chatbot_uuid: request.chatbotId,
          message: request.message
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
        response: responseData.message || '메시지가 전송되었습니다.',
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
      sessionId: TEMP_SESSION_ID
    };
  },

  // 채팅 기록 조회 (실제 API 호출)
  async getChatHistory(chatbotId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      console.log('getChatHistory 호출:', { chatbotId, limit, offset });

      // 실제 백엔드 API 호출
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 임시로 테스트용 사용자 UUID를 헤더에 포함
          'X-User-UUID': TEMP_USER_UUID,
        },
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
      
      // 에러 시 localStorage에서 히스토리 가져오기
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

  // 채팅 세션 종료
  async stopChat(sessionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      return response.ok;
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
