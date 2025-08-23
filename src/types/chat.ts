// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'chatbot';
  content: string;
  timestamp: Date;
  sender: string;
  chatbotId?: string;
}

// 채팅 시작 요청
export interface StartChatRequest {
  chatbotId: string;
  userId: string;
}

// 채팅 시작 응답
export interface StartChatResponse {
  sessionId: string;
  message: string;
  success: boolean;
}

// 메시지 전송 요청
export interface SendMessageRequest {
  sessionId: string;
  message: string;
  chatbotId: string;
  userId: string;
}

// 메시지 전송 응답
export interface SendMessageResponse {
  success: boolean;
  message: string;
  response?: string;
}

// 채팅 세션 정보
export interface ChatSession {
  id: string;
  chatbotId: string;
  userId: string;
  createdAt: Date;
  lastMessageAt: Date;
}

// 챗봇 정보
export interface ChatbotInfo {
  id: string;
  name: string;
  avatar: string;
  level: string;
  description: string;
}
