import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F4F1] to-[#F8F4F1] flex items-center justify-center p-4 iphone16-container">
      {/* 배경 장식 요소들 */}
      <div className="relative w-full max-w-sm z-10">
        {/* 로고 및 제목 */}
        <div className="w-50 h-50 mx-auto">
          <img src="/sermo.png" alt="sermo" />
          <p className="text-gray-600 text-sm text-center mt-2">AI와 함께하는 일상의 대화</p>
        </div>

        {/* 폼 전환 애니메이션 */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ease-in-out ${
              isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute inset-0'
            }`}
          >
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out ${
              !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/60">
            PWA로 설치하여 더 나은 경험을 즐겨보세요
          </p>
        </div>
      </div>
    </div>
  );
};
