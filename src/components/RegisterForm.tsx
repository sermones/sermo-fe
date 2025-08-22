import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register, error, clearError, isLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (formData.name.trim().length < 2) {
      errors.name = '이름은 2자 이상이어야 합니다';
    }

    if (formData.password.length < 6) {
      errors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      // 회원가입 성공 후 자동 로그인되어 홈으로 리다이렉트
      navigate({ to: '/' });
    } catch (error) {
      // 에러는 이미 context에서 처리됨
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // 실시간 유효성 검사
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: '',
      });
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600 text-sm">새로운 계정을 만들어보세요</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-xs">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all duration-200 bg-white/80 ${
                  validationErrors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="홍길동"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all duration-200 bg-white/80"
                placeholder="your@email.com"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all duration-200 bg-white/80 ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] transition-all duration-200 bg-white/80 ${
                  validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#4A90E2] to-[#0055A7] hover:from-[#0055A7] hover:to-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                회원가입 중...
              </div>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-[#4A90E2] hover:text-[#0055A7] transition-colors"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
