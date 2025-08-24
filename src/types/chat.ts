// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  type: 'user' | 'chatbot';
  content: string;
  timestamp: Date | string;
  sender: string;
  chatbotId?: string;
}

// 백엔드 API 응답 타입들
export interface ChatMessageResponse {
  uuid: string;
  content: string;
  created_at: string;
  message_type: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessageResponse[];
  total: number;
}

export interface SendMessageRequest {
  chatbot_uuid: string;
  message: string;
}

export interface SendMessageResponse {
  message: string;
  message_type: string;
  session_id: string;
  timestamp: string;
}

export interface ChatHistoryRequest {
  chatbot_uuid: string;
  limit: number;
  offset: number;
}

export interface OnKeyboardRequest {
  chatbot_uuid: string;
}

export interface StopChatRequest {
  chatbot_uuid: string;
}

// 채팅 시작 요청 (기존 호환성 유지)
export interface StartChatRequest {
  chatbotId: string;
  userId: string;
}

// 채팅 시작 응답 (기존 호환성 유지)
export interface StartChatResponse {
  sessionId: string;
  message: string;
  success: boolean;
}

// 메시지 전송 요청 (기존 호환성 유지)
export interface LegacySendMessageRequest {
  sessionId: string;
  message: string;
  chatbotId: string;
  userId: string;
}

// 메시지 전송 응답 (기존 호환성 유지)
export interface LegacySendMessageResponse {
  success: boolean;
  message?: string;
  response?: string;
  sessionId?: string;
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

// SSE 이벤트 타입
export interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
}

// 채팅 상태
export interface ChatState {
  isConnected: boolean;
  isTyping: boolean;
  sessionId: string | null;
  lastMessageAt: Date | null;
}
