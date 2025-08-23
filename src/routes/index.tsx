import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthPage } from "../components/AuthPage";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: AuthRouteComponent,
  beforeLoad: async ({ context }) => {
    // 서버 사이드에서 토큰 확인 (선택사항)
    const token = localStorage.getItem('token');
    if (token) {
      throw redirect({
        to: '/home',
      });
    }
  },
});

function AuthRouteComponent() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (token && !isLoading) {
      // 클라이언트 사이드에서 토큰이 있으면 /home으로 리다이렉트
      window.location.href = '/home';
    }
  }, [token, isLoading]);

  // 로딩 중이거나 토큰이 있으면 로딩 표시
  if (isLoading || token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 토큰이 없으면 AuthPage 표시
  return <AuthPage />;
}
