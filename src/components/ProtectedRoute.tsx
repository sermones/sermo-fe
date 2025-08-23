import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthPage } from './AuthPage';
import { useNavigate } from '@tanstack/react-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <AuthPage /> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // 인증된 사용자가 로그인 페이지에 접근하면 home으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({ to: '/home' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
