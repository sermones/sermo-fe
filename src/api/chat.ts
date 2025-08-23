import { 
  StartChatRequest, 
  StartChatResponse, 
  SendMessageRequest, 
  SendMessageResponse,
  ChatSession,
  ChatMessage 
} from '../types/chat';

const API_BASE_URL = 'http://localhost:3000';

export const chatAPI = {
  // 채팅 세션 시작
  async startChat(request: StartChatRequest): Promise<StartChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('채팅 시작 실패:', error);
      throw new Error('채팅을 시작할 수 없습니다.');
    }
  },

  // 메시지 전송
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      throw new Error('메시지를 전송할 수 없습니다.');
    }
  },

  // 채팅 기록 조회
  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history?sessionId=${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('채팅 기록 조회 실패:', error);
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
