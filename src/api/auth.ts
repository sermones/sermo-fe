import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, Chatbot, CreateChatbotRequest, CreateChatbotResponse } from '../types/auth';

// TODO: 백엔드 API 주소를 실제 주소로 변경
const API_BASE_URL = 'http://localhost:3000';

export const authAPI = {
  // 로그인
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('=== 로그인 API 호출 ===');
      console.log('요청 데이터:', credentials);
      console.log('API URL:', `${API_BASE_URL}/auth/login`);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('응답 상태:', response.status);
      console.log('응답 헤더:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('로그인 실패 응답:', errorData);
        throw new Error(errorData.message || '로그인에 실패했습니다');
      }

      const responseData = await response.json();
      console.log('로그인 성공 응답:', responseData);
      
      // 토큰이 응답에 없는 경우를 대비한 로깅
      if (!responseData.token) {
        console.warn('⚠️ 응답에 token 필드가 없습니다!');
        console.warn('전체 응답:', responseData);
      }
      
      return responseData;
    } catch (error) {
      console.error('로그인 API 호출 실패:', error);
      throw error;
    }
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
  }
}