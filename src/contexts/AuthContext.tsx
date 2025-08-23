import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, RegisterRequest, User, Chatbot, CreateChatbotRequest } from '../types/auth';
import { authAPI } from '../api/auth';

// 초기 상태
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
  chatbots: [],
};

// 액션 타입
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CHATBOTS'; payload: Chatbot[] }
  | { type: 'ADD_CHATBOT'; payload: Chatbot };

// 리듀서
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_CHATBOTS':
      return {
        ...state,
        chatbots: action.payload,
      };
    case 'ADD_CHATBOT':
      return {
        ...state,
        chatbots: Array.isArray(state.chatbots) ? [...state.chatbots, action.payload] : [action.payload],
      };
    default:
      return state;
  }
};

// Context 생성
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchChatbots: () => Promise<void>;
  createChatbot: (chatbotData: CreateChatbotRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log('=== 초기 인증 상태 확인 시작 ===');
      console.log('localStorage의 토큰:', localStorage.getItem('token'));
      console.log('state의 토큰:', state.token);
      
      if (state.token) {
        try {
          console.log('🔄 기존 토큰으로 사용자 정보 확인 중...');
          const user = await authAPI.getCurrentUser(state.token);
          console.log('✅ 사용자 정보 확인 성공:', user);
          
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              token: state.token,
            },
          });
          console.log('✅ 초기 인증 상태 복원 완료');
        } catch (error) {
          console.error('❌ 기존 토큰이 유효하지 않음:', error);
          // 토큰이 유효하지 않으면 로그아웃
          dispatch({ type: 'AUTH_LOGOUT' });
          localStorage.removeItem('token');
          console.log('🔄 유효하지 않은 토큰 제거 완료');
        }
      } else {
        console.log('ℹ️ 저장된 토큰이 없음');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // 토큰을 로컬 스토리지에 저장
  useEffect(() => {
    if (state.token) {
      console.log('🔄 AuthContext: 토큰을 localStorage에 저장 중...');
      localStorage.setItem('token', state.token);
      console.log('✅ AuthContext: localStorage에 토큰 저장 완료');
    } else {
      console.log('🔄 AuthContext: 토큰이 없어 localStorage에서 제거 중...');
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // 로그인
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      console.log('=== AuthContext 로그인 시작 ===');
      
      const response = await authAPI.login(credentials);
      console.log('로그인 API 응답:', response);
      
      // 토큰 검증 및 저장
      if (!response.token) {
        console.error('❌ 응답에 token이 없습니다!');
        console.error('전체 응답:', response);
        throw new Error('로그인 응답에 토큰이 포함되지 않았습니다');
      }
      
      console.log('✅ 토큰 확인됨:', response.token);
      console.log('✅ 사용자 정보:', response.user);
      
      // 토큰을 즉시 localStorage에 저장
      localStorage.setItem('token', response.token);
      console.log('✅ localStorage에 토큰 저장 완료');
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      console.log('✅ AuthContext 상태 업데이트 완료');
      await fetchChatbots();
    } catch (error) {
      console.error('❌ 로그인 실패:', error);
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : '로그인에 실패했습니다',
      });
      throw error;
    }
  };

  // 회원가입
  const signup = async (userData: RegisterRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authAPI.signup(userData);
      // 회원가입 성공 후 자동 로그인
      await login({ id: userData.id, password: userData.password });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : '회원가입에 실패했습니다',
      });
      throw error;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      if (state.token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
      localStorage.removeItem('token');
    }
  };

  // 에러 클리어
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // 챗봇 목록 가져오기
  const fetchChatbots = async () => {
    if (!state.token) return;
    
    try {
      const chatbots = await authAPI.getChatbots(state.token);
      dispatch({ type: 'SET_CHATBOTS', payload: chatbots });
    } catch (error) {
      console.error('챗봇 목록 조회 오류:', error);
    }
  };

  const createChatbot = async (chatbotData: CreateChatbotRequest) => {
    if (!state.token) return;
    try {
      const response = await authAPI.createChatbot(state.token, chatbotData);
      console.log('챗봇 생성 성공:', response);
      
      // 새로 생성된 챗봇을 목록에 추가
      const newChatbot: Chatbot = {
        uuid: response.chatbot_id,
        name: chatbotData.name,
        details: chatbotData.details,
        gender: chatbotData.gender,
        hashtags: chatbotData.hashtags,
        image_id: chatbotData.image_id,
        created_at: new Date().toISOString(),
        // 이미지 정보 추가 (실제 구현에서는 백엔드에서 반환)
        image_url: chatbotData.image_id === 'custom' ? '/custom-avatar.png' : undefined,
        ai_generated_image: chatbotData.image_id === 'ai' ? '/ai-avatar.png' : undefined,
      };
      
      // chatbots가 배열인지 확인하고 안전하게 추가
      if (Array.isArray(state.chatbots)) {
        dispatch({ type: 'ADD_CHATBOT', payload: newChatbot });
      } else {
        // chatbots가 배열이 아니면 새로 설정
        dispatch({ type: 'SET_CHATBOTS', payload: [newChatbot] });
      }
    } catch (error) {
      console.error('챗봇 생성 오류:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    fetchChatbots,
    createChatbot,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
