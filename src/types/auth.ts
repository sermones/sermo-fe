export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
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

export interface User {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
