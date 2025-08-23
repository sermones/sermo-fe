import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { chatAPI } from '../../api/chat';
import { ChatMessage } from '../../types/chat';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logout, chatbots, fetchChatbots } = useAuth();
  const navigate = useNavigate();
  const [lastMessages, setLastMessages] = useState<Record<string, ChatMessage>>({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // 컴포넌트 마운트 시 챗봇 목록 가져오기
  useEffect(() => {
    fetchChatbots();
  }, [fetchChatbots]);

  // 챗봇 목록이 변경될 때마다 마지막 메시지 가져오기
  useEffect(() => {
    if (chatbots && chatbots.length > 0) {
      fetchLastMessages();
    }
  }, [chatbots]);

  // 각 챗봇의 마지막 메시지 가져오기
  const fetchLastMessages = async () => {
    if (!user) return;
    
    setIsLoadingMessages(true);
    try {
             const messagePromises = chatbots.map(async (chatbot) => {
         try {
           // 가장 최근 메시지를 가져오기 위해 limit을 늘리고 마지막 메시지 선택
           const history = await chatAPI.getChatHistory(chatbot.uuid, 50, 0);
           if (history.length > 0) {
             // 가장 최근 메시지 (마지막 인덱스)를 선택
             const lastMessage = history[history.length - 1];
             return { [chatbot.uuid]: lastMessage };
           }
         } catch (error) {
           console.log(`챗봇 ${chatbot.name}의 메시지 로드 실패:`, error);
         }
         return null;
       });

      const results = await Promise.all(messagePromises);
      const newLastMessages: Record<string, ChatMessage> = {};
      
      results.forEach((result) => {
        if (result) {
          Object.assign(newLastMessages, result);
        }
      });
      
      setLastMessages(newLastMessages);
    } catch (error) {
      console.error('마지막 메시지 로드 실패:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

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


  // 챗봇 클릭 시 채팅 페이지로 이동 (전체 챗봇 정보 전달)
  const handleChatbotClick = (chatbot: any) => {
    console.log('챗봇 클릭됨:', chatbot);
    navigate({ 
      to: '/chat', 
      search: { 
        chatbotId: chatbot.uuid,
        chatbotName: chatbot.name,
        chatbotImage: getChatbotImage(chatbot),
        chatbotDetails: chatbot.details
      } 
    });
  };

  // 챗봇 이미지를 반환하는 함수

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

  // 메시지 미리보기 포맷팅 함수 - 컨테이너 너비 고려
  const formatMessagePreview = (message: string) => {
    // 컨테이너 너비를 고려한 최대 길이 (프로필 이미지 50px + 마진 12px + 패딩 고려)
    const maxLength = 25; // "알렉산더: 음... 그건 좀 복잡하네요. 다른 방법을 생각해보겠습니다" -> "알렉산더: 음... 그건 좀 복잡하네요. 다른 방법을 생각..."
    
    if (message.length <= maxLength) {
      return message;
    }
    
    // 정확히 maxLength에서 자르고 '...' 추가
    return message.substring(0, maxLength) + '...';
  };



  return (
    <ProtectedRoute>
      <div>
        <div className="bg-[#fbf5ff] text-center h-screen p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left">
              HOME
            </div>
            <button
              onClick={handleLogout}
              className="bg-pink-300 text-white px-4 py-2 rounded-lg hover:bg-pink-400 transition-colors text-sm font-medium shadow-sm"
            >
              Logout
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
                  onClick={() => handleChatbotClick(chatbot)}
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
                                     <div className="text-left flex-1 min-h-[47px] gap-1 opacity-100 ml-3">
                     <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle w-full h-6 opacity-100 gap-1">
                       {chatbot.name}
                     </div>
                    
                     {/* 마지막 메시지 미리보기 */}
                     {lastMessages[chatbot.uuid] && (
                       <div className="w-full mt-1 opacity-100">
                         <div className="text-gray-500 text-xs overflow-hidden">
                           {lastMessages[chatbot.uuid].type === 'user' ? '나: ' : `${chatbot.name}: `}
                           {formatMessagePreview(lastMessages[chatbot.uuid].content)}
                         </div>
                       </div>
                     )}
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

