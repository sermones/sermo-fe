import { 
  ChatMessageResponse,
  ChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
  ChatHistoryRequest,
  OnKeyboardRequest,
  StopChatRequest,
  ChatMessage,
  ChatbotInfo
} from '../types/chat';

const API_BASE_URL = 'http://localhost:3000';

export const chatAPI = {
  // JWT 토큰 가져오기
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  },

  // 인증 헤더 생성
  getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 로그인이 필요합니다.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  },

  // 챗봇 정보 가져오기
  async getChatbotInfo(chatbotId: string): Promise<ChatbotInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/${chatbotId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`챗봇 정보 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        id: data.uuid,
        name: data.name,
        avatar: data.image_id ? `${API_BASE_URL}/image/${data.image_id}` : '/Checker.png',
        level: '초급', // 기본값
        description: data.details || '챗봇 설명'
      };
    } catch (error) {
      console.error('챗봇 정보 조회 실패:', error);
      throw error;
    }
  },

  // SSE 연결로 채팅 시작
  createSSEConnection(chatbotUuid: string, onMessage: (data: any) => void): EventSource {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // 쿼리 파라미터로 토큰 전달 (백엔드 미들웨어 지원)
    const eventSource = new EventSource(
      `${API_BASE_URL}/chat/start?chatbot_uuid=${chatbotUuid}&token=${token}`
    );

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
  },

  // 메시지 전송
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`메시지 전송 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw error;
    }
  },

  // 키보드 입력 이벤트 전송
  async sendOnKeyboardEvent(request: OnKeyboardRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/onkeyboard`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.warn('키보드 이벤트 전송 실패:', response.status);
      }
    } catch (error) {
      console.warn('키보드 이벤트 전송 실패:', error);
    }
  },

  // 채팅 히스토리 조회
  async getChatHistory(request: ChatHistoryRequest): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`히스토리 조회 실패: ${response.status}`);
      }

      const data: ChatHistoryResponse = await response.json();
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      return data.messages.map((msg: ChatMessageResponse) => ({
        id: msg.uuid,
        type: msg.message_type === 'user' ? 'user' : 'chatbot',
        content: msg.content,
        timestamp: new Date(msg.created_at),
        sender: msg.message_type === 'user' ? '나' : '챗봇',
        chatbotId: request.chatbot_uuid
      }));
    } catch (error) {
      console.error('채팅 히스토리 조회 실패:', error);
      throw error;
    }
  },

  // 채팅 세션 종료
  async stopChat(request: StopChatRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/stop`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.warn('채팅 세션 종료 실패:', response.status);
      }
    } catch (error) {
      console.warn('채팅 세션 종료 실패:', error);
    }
  },

  // 기존 호환성을 위한 메서드들 (점진적 제거 예정)
  async startChat(request: any): Promise<any> {
    console.warn('startChat은 더 이상 사용되지 않습니다. createSSEConnection을 사용하세요.');
    return { success: true, sessionId: 'deprecated', message: 'deprecated' };
  },

  async sendLegacyMessage(request: any): Promise<any> {
    console.warn('sendLegacyMessage는 더 이상 사용되지 않습니다. sendMessage를 사용하세요.');
    return { success: true, response: 'deprecated', sessionId: 'deprecated' };
  },

  // localStorage 관련 메서드들 (폴백용)
  getLocalStorageHistory(chatbotId: string): ChatMessage[] {
    try {
      const storageKey = `chat_history_${chatbotId}`;
      const storedHistory = localStorage.getItem(storageKey);
      
      if (storedHistory) {
        return JSON.parse(storedHistory);
      }
      return [];
    } catch (error) {
      console.error('localStorage 히스토리 로드 실패:', error);
      return [];
    }
  },

  saveChatHistory(chatbotId: string, messages: ChatMessage[]): void {
    try {
      const storageKey = `chat_history_${chatbotId}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (error) {
      console.error('채팅 히스토리 저장 실패:', error);
    }
  }
};
