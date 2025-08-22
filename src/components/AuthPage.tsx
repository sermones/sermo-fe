import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4 iphone16-container">
      {/* 배경 장식 요소들 */}
      <div className="relative w-full max-w-sm z-10">
        {/* 로고 및 제목 */}
        <div className="w-50 h-50 mx-auto">
          <img src="/sermo.png" alt="sermo" />
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
      </div>
    </div>
  );
};
