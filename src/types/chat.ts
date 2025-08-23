// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'chatbot';
  content: string;
  timestamp: Date | string;
  sender: string;
  chatbotId?: string;
}

// 실제 백엔드 SSE 메시지 타입
export interface SSEMessage {
  type: 'user' | 'bot' | 'bot_typing';
  content?: string;
  is_typing?: boolean;
  timestamp: string;
  session_id: string;
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
  response?: string;
  sessionId?: string;
  message_type?: 'user' | 'bot' | 'system'; // 백엔드 응답 타입 추가
  timestamp?: string;
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

// 세션 정리 요청
export interface StopChatRequest {
  chatbot_uuid: string;
}

// 세션 정리 응답
export interface StopChatResponse {
  message: string;
  success: boolean;
}
