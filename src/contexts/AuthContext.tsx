import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, RegisterRequest, User } from '../types/auth';
import { authAPI } from '../api/auth';

// 초기 상태
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// 액션 타입
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

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
        accessToken: action.payload.accessToken,
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
        accessToken: null,
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (state.accessToken) {
        try {
          const user = await authAPI.getCurrentUser(state.accessToken);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user,
              accessToken: state.accessToken,
            },
          });
        } catch (error) {
          // 토큰이 유효하지 않으면 로그아웃
          dispatch({ type: 'AUTH_LOGOUT' });
          localStorage.removeItem('accessToken');
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // 토큰을 로컬 스토리지에 저장
  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem('accessToken', state.accessToken);
    }
  }, [state.accessToken]);

  // 로그인
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          accessToken: response.accessToken,
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
      if (state.accessToken) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
      localStorage.removeItem('accessToken');
    }
  };

  // 에러 클리어
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    clearError,
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
