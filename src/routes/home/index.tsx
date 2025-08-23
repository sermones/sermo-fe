import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logout, chatbots, fetchChatbots } = useAuth();
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 챗봇 목록 가져오기
  useEffect(() => {
    fetchChatbots();
  }, [fetchChatbots]);

  const handleLogout = async () => {
    try {
      await logout();
      // 로그아웃 후 AuthPage로 리다이렉트 (ProtectedRoute가 자동으로 처리)
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const handleNewChatClick = () => {
    navigate({ to: '/home/newChat' });
  };

  // 챗봇 이미지를 반환하는 함수
  const getChatbotImage = (chatbot: any) => {
    if (chatbot.image_id === 'custom' && chatbot.image_url) {
      return chatbot.image_url; // 직접 등록한 이미지가 있는 경우
    } else if (chatbot.image_id === 'ai' && chatbot.ai_generated_image) {
      return chatbot.ai_generated_image; // AI 생성 이미지가 있는 경우
    } else {
      return '/Checker.png'; // 기본 이미지
    }
  };

  return (
    <ProtectedRoute>
      <div>
        <div className="bg-[#fbf5ff] text-center h-screen p-4">
          {/* Header with Logout Button */}
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
          
          {/* MY Profile Container */}
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
          
          {/* CHATS Container */}
          <div className="mt-4 bg-white w-full opacity-100 gap-1 rounded-[20px] p-3 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)] mb-20">
            <div className="text-[#727272] w-[21px] h-[17px] opacity-100 font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%] text-left align-middle">
              CHATS
            </div>
            
            {/* Chat Items - 실제 챗봇 데이터 사용 */}
            {chatbots && chatbots.length > 0 ? (
              chatbots.map((chatbot) => (
                <div key={chatbot.uuid} className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
                  <img 
                    src={getChatbotImage(chatbot)} 
                    alt={`${chatbot.name} 프로필`} 
                    className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px] object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
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
              // 챗봇이 없을 때 기본 메시지
              <div className="flex justify-center items-center h-[66px] text-gray-500 text-sm">
                아직 생성된 챗봇이 없습니다
              </div>
            )}
            
            {/* New Chat Button */}
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
          
          {/* Navigation Bar - iPhone 16 너비에 맞게 하단 고정 */}
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
