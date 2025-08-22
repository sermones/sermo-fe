import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 및 제목 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white text-2xl font-bold">J</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Junction Asia 2025</h1>
          <p className="text-gray-600">Progressive Web App</p>
        </div>

        {/* 폼 전환 애니메이션 */}
        <div className="relative">
          <div
            className={`transition-all duration-300 ease-in-out ${
              isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          </div>

          <div
            className={`transition-all duration-300 ease-in-out ${
              !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            PWA로 설치하여 더 나은 경험을 즐겨보세요
          </p>
        </div>
      </div>
    </div>
  );
};
