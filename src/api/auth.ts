import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, Chatbot, CreateChatbotRequest, CreateChatbotResponse } from '../types/auth';

// TODO: 백엔드 API 주소를 실제 주소로 변경
const API_BASE_URL = 'http://localhost:3000';

export const authAPI = {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '로그인에 실패했습니다');
    }

    return response.json();
  },

  // 회원가입
  async signup(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입에 실패했습니다');
    }

    return response.json();
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '사용자 정보 조회에 실패했습니다');
    }

    return response.json();
  },

  // 챗봇 목록 조회
  async getChatbots(token: string): Promise<Chatbot[]> {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '챗봇 목록 조회에 실패했습니다');
    }

    return response.json();
  },

  async createChatbot(token: string, chatbotData: CreateChatbotRequest): Promise<CreateChatbotResponse> {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatbotData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '챗봇 생성에 실패했습니다');
    }

    return response.json();
  },

  // 로그아웃
  async logout(): Promise<void> {
    // 백엔드에서 로그아웃 처리가 필요한 경우 여기에 구현
    // 현재는 프론트엔드에서만 토큰 제거
    return Promise.resolve();
  },

  // 이미지 조회 함수 추가
  async getImage(token: string, imageId: string): Promise<{ url: string; image: any }> {
    const response = await fetch(`${API_BASE_URL}/image/${imageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `application/json`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '이미지 조회에 실패했습니다');
    }

    return response.json();
  }
}