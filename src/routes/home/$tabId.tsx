import { createFileRoute, useParams, Navigate } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import '../../style/shStyle.css';

export const Route = createFileRoute('/home/$tabId')({
  component: TabComponent,
});

function TabComponent() {
  const { tabId } = useParams({ from: '/home/$tabId' });

  // 홈 페이지 렌더링 (index 또는 빈 문자열)
  if (tabId === 'index' || tabId === '') {
    return <HomePage />;
  }

  // newChat은 별도 라우트로 처리
  if (tabId === 'newChat') {
    return <Navigate to="/home/newChat" />;
  }

  // 연습 페이지 렌더링
  if (tabId === 'practice') {
    return <PracticePage />;
  }

  // 퀘스트 페이지 렌더링
  if (tabId === 'quests') {
    return <QuestsPage />;
  }

  // 성과 페이지 렌더링
  if (tabId === 'achievement') {
    return <AchievementPage />;
  }

  // 잘못된 경로일 경우 홈으로 리다이렉트
  return <HomePage />;
}

// 홈 페이지 컴포넌트
function HomePage() {
  const { user, logout, chatbots, fetchChatbots } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatbots();
  }, [fetchChatbots]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleNewChatClick = () => {
    navigate({ to: '/home/newChat' });
  };

  const getChatbotImage = (chatbot: any) => {
    if (chatbot.image_url) {
      return chatbot.image_url;
    } else if (chatbot.image_id) {
      return '/Checker.png';
    } else if (chatbot.image_category === 'ai' && chatbot.ai_generated_image) {
      return chatbot.ai_generated_image;
    } else {
      return '/Checker.png';
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="bg-[#fbf5ff] text-center h-screen p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left">
              HOME
            </div>
            <button
              onClick={handleLogout}
              className="bg-[#8E8EE7] text-white px-4 py-2 rounded-lg hover:bg-[#7A7AD8] transition-colors text-sm font-medium"
            >
              로그아웃
            </button>
          </div>
          
          <div className="bg-white w-full h-[111px] opacity-100 gap-1 rounded-[20px] p-3 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)]">
            <div className="text-[#727272] w-[21px] h-[17px] opacity-100 font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%] text-left align-middle">
              MY
            </div>
            <div className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
              <img src="/Checker.png" alt="profile" className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px]" />
              <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle flex-1 text-center">
                {user?.nickname || '사용자'}
              </div>
              <div className="w-6 h-6"></div>
            </div>
          </div>
          
          <div className="mt-4 bg-white w-full opacity-100 gap-1 rounded-[20px] p-3 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)] mb-20">
            <div className="text-[#727272] w-[21px] h-[17px] opacity-100 font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%] text-left align-middle">
              CHATS
            </div>
            
            {chatbots && chatbots.length > 0 ? (
              chatbots.map((chatbot, index) => (
                <div 
                  key={chatbot.uuid} 
                  className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px] hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  <img 
                    src={getChatbotImage(chatbot)} 
                    alt={`${chatbot.name} 프로필`} 
                    className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px] object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/Checker.png';
                    }}
                  />
                  <div className="text-left flex-1 h-[47px] gap-1 opacity-100 ml-3">
                    <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle w-full h-6 opacity-100 gap-1">
                      {chatbot.name}
                    </div>
                    <div className="w-full h-[19px] gap-2 opacity-100">
                      {chatbot.details}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-[66px] text-gray-500 text-sm">
                아직 생성된 챗봇이 없습니다
              </div>
            )}
            
            <div className="mt-5">
              <button
                onClick={handleNewChatClick}
                className="mx-auto bg-[#f5f5f5] px-6 py-2 rounded-[6px] border-1 border-[#8E8EE7] hover:bg-[#e8e8e8] transition-colors flex items-center justify-center gap-2"
              >
                <img src="/chat_plus.svg" alt="new chat" className="w-5 h-5" />
                <span className="text-[#8E8EE7] font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%]">새 채팅</span>
              </button>
            </div>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `
        }} />
      </div>
    </ProtectedRoute>
  );
}

// 연습 페이지 컴포넌트
function PracticePage() {
  return (
    <ProtectedRoute>
      <div>
        <div className="container sh-main-bg">
          <div className="sh-title">PRACTICE</div>
          <div className="sh-myprofile-container">
            <div className="sh-profile-title">QUIZ</div>
            <button className="sh-profile" onClick={() => console.log('단어 퀴즈 클릭')}>
              <img src="/word-games.png" alt="word quiz" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">단어 퀴즈</div>
              </div>
            </button>
            <button className="sh-profile" onClick={() => console.log('문장 퀴즈 클릭')}>
              <img src="/feedback-reaction.png" alt="sentence quiz" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">문장 퀴즈</div>
              </div>
            </button>
            <button className="sh-profile" onClick={() => console.log('틀린 문제 모아 보기 클릭')}>
              <img src="/service.png" alt="incorrect problems" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">틀린 문제 모아 보기</div>
              </div>
            </button>
          </div>
          <div className="sh-chatsprofile-container">
            <div className="sh-profile-title">RECORDS</div>
            <button className="sh-profile" onClick={() => console.log('학습 리포트 클릭')}>
              <img src="/books.png" alt="learning report" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">나의 학습 리포트</div>
              </div>
            </button>
            <button className="sh-profile" onClick={() => console.log('북마크 클릭')}>
              <img src="/backlog.png" alt="bookmarks" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">나의 북마크</div>
              </div>
            </button>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// 퀘스트 페이지 컴포넌트
function QuestsPage() {
  const dailyQuests = [
    {
      id: 'bookmark-sentences',
      title: '문장 3개 북마크하기',
      icon: '/quest-bookmark.png',
      completed: false
    },
    {
      id: 'review-incorrect',
      title: '틀린 문제 복습',
      icon: '/quest-review.png',
      completed: false
    },
    {
      id: 'chat-5min',
      title: '5분 채팅',
      icon: '/quest-chat.png',
      completed: false
    }
  ];

  const streaks = {
    message: '축하해요! 연속 출석 14일을 달성했어요!',
    days: 14
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="container sh-main-bg">
          <div className="sh-title">QUESTS</div>
          
          <div className="sh-myprofile-container">
            <div className="sh-profile-title">DAILY QUESTS</div>
            {dailyQuests.map((quest) => (
              <button 
                key={quest.id} 
                className="sh-profile" 
                onClick={() => console.log(`${quest.title} 클릭`)}
              >
                <img src="/Frame 11.png" alt={quest.title} className="sh-round-image-rounded" />
                <div className="sh-wrap">
                  <div className="sh-profile-name">{quest.title}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="sh-chatsprofile-container">
            <div className="sh-profile-title">STREAKS</div>
            <div className="sh-profile">
              <div className="sh-wrap">
                <div className="sh-streaks-message">{streaks.message}</div>
              </div>
            </div>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// 성과 페이지 컴포넌트
function AchievementPage() {
  return (
    <ProtectedRoute>
      <div>
        <div className="bg-[#fbf5ff] text-center h-screen p-4">
          <div className="mb-4">
            <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left">
              성과
            </div>
          </div>
          
          <div className="bg-white w-full opacity-100 gap-1 rounded-[20px] p-6 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)]">
            <div className="text-[#727272] font-['Pretendard'] font-normal text-lg leading-[100%] tracking-[0%] text-center mb-4">
              성과 페이지
            </div>
            <div className="text-gray-600 text-center">
              아직 성과 데이터가 없습니다.
            </div>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


