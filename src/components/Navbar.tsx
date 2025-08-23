import React, { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleTabClick = (item: NavItem) => {
    setActiveTab(item.id);
    setActiveIndex(navItems.findIndex(nav => nav.id === item.id));
    //navigate({ to: item.path });
  };

  return (
    <div className="px-4 py-2">
      <nav className="relative">
        <div className="bg-gray-100 rounded-3xl border border-[#8E8EE7] shadow-lg relative overflow-hidden">
          {/* 애니메이션 슬라이더 */}
          <div
            className="absolute top-0 left-0 w-1/4 h-full bg-[#8E8EE7] rounded-3xl transition-all duration-300 ease-out"
            style={{
              transform: `translateX(${activeIndex * 100}%)`
            }}
          />
          <div className="flex items-center w-full relative z-10">
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`relative flex flex-col items-center justify-center flex-1 h-17 rounded-3xl transition-all duration-300 cursor-pointer ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  activeTab === item.id
                    ? 'brightness-0 invert scale-110'
                    : 'scale-100'
                }`}>
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};
