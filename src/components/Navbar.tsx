import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: '홈',
      path: '/home',
      icon: (
        <img src="/nav_1.svg" alt="home" className="w-8 h-8" />
      ),
    },
    {
      id: 'practice',
      label: '연습',
      path: '/home/practice',
      icon: (
        <img src="/nav_2.svg" alt="practice" className="w-8 h-8" />
      ),
    },
    {
      id: 'quests',
      label: '퀘스트',
      path: '/home/quests',
      icon: (
        <img src="/nav_3.svg" alt="quests" className="w-8 h-8" />
      ),
    },
    {
      id: 'achievement',
      label: '성과',
      path: '/home',
      icon: (
        <img src="/nav_4.svg" alt="achievement" className="w-8 h-8" />
      ),
    },
  ];

  const handleTabClick = (item: NavItem) => {
    setActiveTab(item.id);
    navigate({ to: item.path });
  };

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
