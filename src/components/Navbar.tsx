import React, { useMemo } from 'react';
// 1. useNavigate와 useLocation 훅을 import 합니다.
import { useNavigate, useLocation } from '@tanstack/react-router';

// NavItem 인터페이스 정의
interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  // 2. 라우터의 현재 위치 정보를 가져옵니다.
  const location = useLocation();
  const currentPath = location.pathname;

  // 네비게이션 아이템 목록
  const navItems = useMemo(() => [
    {
      id: 'home',
      label: '홈',
      path: '/home',
      icon: <img src="/nav_1.svg" alt="home" className="w-8 h-8" />,
    },
    {
      id: 'practice',
      label: '연습',
      path: '/practice',
      icon: <img src="/nav_2.svg" alt="practice" className="w-8 h-8" />,
    },
    {
      id: 'quests',
      label: '퀘스트',
      path: '/quests',
      icon: <img src="/nav_3.svg" alt="quests" className="w-8 h-8" />,
    },
    {
      id: 'achievement',
      label: '성과',
      path: '/achievement',
      icon: <img src="/nav_4.svg" alt="achievement" className="w-8 h-8" />,
    },
  ], []);

  // 3. 현재 경로(URL)를 기준으로 활성화된 탭의 인덱스와 ID를 계산합니다.
  // 이로써 컴포넌트의 상태가 항상 URL과 동기화됩니다.
  const activeIndex = Math.max(0, navItems.findIndex(item => currentPath.startsWith(item.path)));
  const activeId = navItems[activeIndex].id;
  
  // 4. 클릭 핸들러는 URL을 변경하는 역할만 수행합니다.
  const handleTabClick = (item: NavItem) => {
    navigate({ to: item.path });
  };

  return (
    <div className="px-4 py-2">
      <nav className="relative">
        <div className="bg-gray-100 rounded-3xl border border-[#8E8EE7] shadow-lg relative overflow-hidden">
          {/* 애니메이션 슬라이더 - 부드러운 이동 효과 */}
          <div
            className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-b from-[#8E8EE7] to-[#7A7AD8] rounded-3xl transition-all duration-500 ease-out shadow-lg"
            style={{
              transform: `translateX(${activeIndex * 100}%)`,
              boxShadow: '0 4px 20px rgba(142, 142, 231, 0.4)'
            }}
          />
          <div className="flex items-center w-full relative z-10">
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTabClick(item)}
                // 5. 텍스트 색상 변경에 부드러운 전환 효과를 줍니다.
                className={`relative flex flex-col items-center justify-center flex-1 h-17 rounded-3xl transition-all duration-300 cursor-pointer group ${
                  activeId === item.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {/* 6. 아이콘의 색상 필터와 크기 변경에 부드러운 전환 효과를 추가합니다. */}
                <div className={`transition-all duration-300 ${
                  activeId === item.id
                    ? 'brightness-0 invert scale-110' // 활성: 흰색으로, 1.1배 확대
                    : 'scale-100 group-hover:scale-105' // 비활성: 원래 크기, 호버 시 확대
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium transition-all duration-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};