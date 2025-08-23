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
      if (state.token) {
        try {
          const user = await authAPI.getCurrentUser(state.token);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              token: state.token,
            },
          });
        } catch (error) {
          // 토큰이 유효하지 않으면 로그아웃
          dispatch({ type: 'AUTH_LOGOUT' });
          localStorage.removeItem('token');
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // 토큰을 로컬 스토리지에 저장
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
    }
  }, [state.token]);

  // 로그인
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
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
      console.log('챗봇 목록 조회 시작');
      const chatbots = await authAPI.getChatbots(state.token);
      console.log('챗봇 목록 조회 성공:', chatbots);
      
      // 각 챗봇의 이미지 URL을 가져와서 업데이트
      const chatbotsWithImages = await Promise.all(
        chatbots.map(async (chatbot) => {
          if (chatbot.image_id) {
            try {
              console.log(`이미지 ${chatbot.image_id} 조회 시작`);
              const imageResponse = await authAPI.getImage(state.token!, chatbot.image_id);
              console.log(`이미지 ${chatbot.image_id} 조회 성공:`, imageResponse);
              
              return {
                ...chatbot,
                image_url: imageResponse.url
              };
            } catch (error) {
              console.error(`이미지 ${chatbot.image_id} 조회 실패:`, error);
              return chatbot;
            }
          }
          return chatbot;
        })
      );
      
      dispatch({ type: 'SET_CHATBOTS', payload: chatbotsWithImages });
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
        image_category: chatbotData.image_category,
        image_id: chatbotData.image_id, // 실제 이미지 ID
        created_at: new Date().toISOString(),
        // 이미지 URL은 나중에 실제 URL을 가져옴
        image_url: undefined,
        ai_generated_image: chatbotData.image_category === 'ai' ? '/ai-avatar.png' : undefined,
      };
      
      console.log('새로 생성된 챗봇:', {
        name: newChatbot.name,
        image_category: newChatbot.image_category,
        image_id: newChatbot.image_id,
        image_url: newChatbot.image_url
      });
    
      // chatbots가 배열인지 확인하고 안전하게 추가
      if (Array.isArray(state.chatbots)) {
        console.log('기존 chatbots 배열에 추가:', state.chatbots.length);
        dispatch({ type: 'ADD_CHATBOT', payload: newChatbot });
      } else {
        console.log('chatbots가 배열이 아님, 새로 설정');
        dispatch({ type: 'SET_CHATBOTS', payload: [newChatbot] });
      }
      
      // 새로 생성된 챗봇의 이미지 URL도 즉시 가져오기
      if (newChatbot.image_category === 'custom' && newChatbot.image_id) {
        try {
          console.log(`새로 생성된 챗봇 이미지 ${newChatbot.image_id} 조회 시작`);
          const imageResponse = await authAPI.getImage(state.token!, newChatbot.image_id);
          console.log(`새로 생성된 챗봇 이미지 조회 성공:`, imageResponse);
          
          // 이미지 URL이 포함된 완성된 챗봇 데이터로 업데이트
          const updatedChatbot = {
            ...newChatbot,
            image_url: imageResponse.url
          };
          
          // 기존 챗봇을 업데이트된 챗봇으로 교체
          if (Array.isArray(state.chatbots)) {
            const updatedChatbots = state.chatbots.map(chatbot => 
              chatbot.uuid === newChatbot.uuid ? updatedChatbot : chatbot
            );
            dispatch({ type: 'SET_CHATBOTS', payload: updatedChatbots });
          } else {
            dispatch({ type: 'SET_CHATBOTS', payload: [updatedChatbot] });
          }
          
          console.log('챗봇 이미지 URL 업데이트 완료:', updatedChatbot);
        } catch (error) {
          console.error(`새로 생성된 챗봇 이미지 ${newChatbot.image_id} 조회 실패:`, error);
          // 이미지 조회 실패 시에도 챗봇은 그대로 유지
        }
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
