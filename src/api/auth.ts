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

  // 이미지 업로드 함수 추가
  async uploadImage(token: string, imageFile: File): Promise<{ 
    image: {
      id: string;
      file_name: string;
      file_size: number;
      mime_type: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    message: string;
  }> {
    if (!token) {
      throw new Error('토큰이 없습니다. 다시 로그인해주세요.');
    }

    const formData = new FormData();
    formData.append('file', imageFile); // 'image' 대신 'file'로 변경 (API 문서에 따름)

    console.log('이미지 업로드 요청:', {
      url: `${API_BASE_URL}/image/upload`,
      token: token.substring(0, 20) + '...', // 토큰 일부만 로그
      fileName: imageFile.name,
      fileSize: imageFile.size,
      formDataKeys: Array.from(formData.keys()) // FormData에 포함된 키들 확인
    });

    const response = await fetch(`${API_BASE_URL}/image/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // FormData를 사용하므로 Content-Type은 자동으로 설정됨
      },
      body: formData,
    });

    console.log('이미지 업로드 응답:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
      console.error('이미지 업로드 실패 응답:', errorData);
      throw new Error(errorData.message || `이미지 업로드에 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    console.log('이미지 업로드 성공:', result);
    return result;
  },

  // 이미지 조회 함수
  async getImage(token: string, imageId: string): Promise<{ 
    url: string;
    image: {
      id: string;
      file_name: string;
      file_size: number;
      mime_type: string;
      created_at: string;
      updated_at: string;
      user_id: string;
    };
    message: string;
  }> {
    if (!token) {
      throw new Error('토큰이 없습니다. 다시 로그인해주세요.');
    }

    console.log(`이미지 조회 요청: ${API_BASE_URL}/image/${imageId}`);

    const response = await fetch(`${API_BASE_URL}/image/${imageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `application/json`,
      },
    });

    console.log(`이미지 조회 응답:`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류' }));
      console.error('이미지 조회 실패 응답:', errorData);
      throw new Error(errorData.message || `이미지 조회에 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    console.log('이미지 조회 성공:', result);
    return result;
  }
}