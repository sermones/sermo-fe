import React, { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => [
    {
      id: 'home',
      label: '홈',
      path: '/home',
      icon: (
        <img src="/nav_1.svg" alt="home" className="w-8 h-8" />
      ),
    },
    {
      id: 'chat',
      label: '채팅',
      path: '/chat',
      icon: (
        <img src="/nav_2.svg" alt="chat" className="w-8 h-8" />
      ),
    },
    {
      id: 'practice',
      label: '연습',
      path: '/home/practice',
      icon: (
        <img src="/nav_3.svg" alt="practice" className="w-8 h-8" />
      ),
    },
    {
      id: 'quests',
      label: '퀘스트',
      path: '/home/quests',
      icon: (
        <img src="/nav_4.svg" alt="quests" className="w-8 h-8" />
      ),
    },
  ], []);

  // 현재 경로에 따라 activeTab 직접 계산
  const activeTab = useMemo(() => {
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.id : 'home';
  }, [location.pathname, navItems]);

  const handleTabClick = useCallback((item: NavItem) => {
    navigate({ to: item.path });
  }, [navigate]);

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-50">
      <div className="bg-gray-100 rounded-3xl border border-[#8E8EE7] shadow-lg">
        <div className="flex items-center w-full">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`relative flex flex-col items-center justify-center flex-1 h-17 rounded-3xl transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-[#8E8EE7] text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className={`${activeTab === item.id ? 'brightness-0 invert' : ''}`}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
