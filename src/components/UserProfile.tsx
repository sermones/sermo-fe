import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* 사용자 아바타 버튼 */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.nickname.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-gray-700 font-medium hidden sm:block">{user.nickname}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            showDropdown ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <>
          {/* 백드롭 */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          {/* 메뉴 */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            {/* 사용자 정보 */}
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.nickname}</p>
            </div>

            {/* 메뉴 항목들 */}
            <button
              onClick={() => {
                setShowDropdown(false);
                // 프로필 편집 페이지로 이동
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              프로필 편집
            </button>

            <button
              onClick={() => {
                setShowDropdown(false);
                // 설정 페이지로 이동
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              설정
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? '로그아웃 중...' : '로그아웃'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
