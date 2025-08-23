export interface LoginRequest {
  id: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  id: string;
  nickname: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// 사용자 타입
export interface User {
  id: string;
  nickname: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
}

// 챗봇 타입
export interface Chatbot {
  uuid: string;
  name: string;
  details: string;
  gender: string;
  hashtags: string[];
  image_id: string;
  created_at: string;
}

// 인증 상태 타입
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  chatbots: Chatbot[];
}
