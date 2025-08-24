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
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  // 사용자 가입일 포맷팅
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 사용자 레벨 계산 (가입일 기준)
  const calculateUserLevel = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const daysSinceJoin = Math.floor((now.getTime() - join.getTime()) / (1000 * 60 * 60 * 24));
    return Math.floor(daysSinceJoin / 7) + 1; // 7일마다 1레벨
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
        <div className="bg-gradient-to-br from-[#fbf5ff] via-[#f0e6ff] to-[#e8d9ff] text-center min-h-screen p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left">
              HOME
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Logout
            </button>
          </div>
          
          {/* MY 섹션 - 화려하게 개선 */}
          <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 w-full rounded-[25px] p-4 shadow-[0px_8px_32px_rgba(142,142,231,0.15)] border border-white/50 backdrop-blur-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#8e8ee7] font-['Pretendard'] font-bold text-lg tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                MY PROFILE
              </div>
              <button 
                onClick={() => setShowProfileModal(true)}
                className="text-[#8e8ee7] hover:text-[#6b6bd4] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/70 rounded-[20px] backdrop-blur-sm border border-white/50">
              {/* 프로필 이미지 */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user?.nickname?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* 사용자 정보 */}
              <div className="flex-1 text-left">
                <div className="font-bold text-xl text-gray-800 mb-1">
                  {user?.nickname || '사용자'}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  ID: {user?.id || 'unknown'}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {user?.createdAt ? formatJoinDate(user.createdAt) : '가입일 미정'}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Lv.{user?.createdAt ? calculateUserLevel(user.createdAt) : 1}
                  </div>
                </div>
              </div>
              
              {/* 통계 정보 */}
              <div className="text-right">
                <div className="text-2xl font-bold text-[#8e8ee7] mb-1">
                  {chatbots?.length || 0}
                </div>
                <div className="text-xs text-gray-500">챗봇</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-gradient-to-r from-white via-blue-50 to-purple-50 w-full rounded-[25px] p-4 shadow-[0px_8px_32px_rgba(142,142,231,0.15)] border border-white/50 backdrop-blur-sm mb-20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#8e8ee7] font-['Pretendard'] font-bold text-lg tracking-wide flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                MY CHATS
              </div>
              <div className="text-sm text-gray-500 bg-white/70 px-3 py-1 rounded-full border border-white/50">
                총 {chatbots?.length || 0}개
              </div>
            </div>
            
            {chatbots && chatbots.length > 0 ? (
              <div className="space-y-3">
                {chatbots.map((chatbot, index) => (
                  <div 
                    key={chatbot.uuid} 
                    className="group bg-white/80 hover:bg-white rounded-[20px] p-4 transition-all duration-300 cursor-pointer border border-white/50 hover:border-[#8e8ee7]/30 hover:shadow-[0px_8px_25px_rgba(142,142,231,0.2)] transform hover:scale-[1.02]"
                    onClick={() => handleChatbotClick(chatbot)}
                    style={{
                      animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* 챗봇 프로필 이미지 */}
                      <div className="relative">
                        <img 
                          src={getChatbotImage(chatbot)} 
                          alt={`${chatbot.name} 프로필`} 
                          className="w-14 h-14 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/Checker.png';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* 챗봇 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-800 truncate">
                            {chatbot.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {chatbot.gender === 'male' ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            ) : (
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500 capitalize">
                              {chatbot.gender === 'male' ? '남성' : '여성'}
                            </span>
                          </div>
                        </div>
                        
                        {/* 챗봇 상세 정보 */}
                        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {chatbot.details}
                        </div>
                        
                        {/* 마지막 메시지 미리보기 */}
                        {lastMessages[chatbot.uuid] && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-[#8e8ee7] rounded-full"></div>
                            <span className="font-medium">
                              {lastMessages[chatbot.uuid].type === 'user' ? '나' : chatbot.name}
                            </span>
                            <span className="text-gray-400">:</span>
                            <span className="truncate max-w-[150px]">
                              {formatMessagePreview(lastMessages[chatbot.uuid].content)}
                            </span>
                          </div>
                        )}
                        
                        {/* 해시태그 */}
                        {chatbot.hashtags && chatbot.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {chatbot.hashtags.slice(0, 3).map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="px-2 py-1 bg-gradient-to-r from-[#8e8ee7]/10 to-[#a8a8f0]/10 text-[#8e8ee7] text-xs rounded-full border border-[#8e8ee7]/20"
                              >
                                #{tag}
                              </span>
                            ))}
                            {chatbot.hashtags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                +{chatbot.hashtags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* 우측 화살표 */}
                      <div className="text-gray-400 group-hover:text-[#8e8ee7] transition-colors duration-300">
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">아직 생성된 챗봇이 없습니다</h3>
                <p className="text-sm text-gray-500 mb-6">새로운 챗봇을 만들어보세요!</p>
              </div>
            )}
            
            {/* 새 채팅 버튼 */}
            <div className="mt-6">
              <button
                onClick={handleNewChatClick}
                className="w-full bg-gradient-to-r from-[#8E8EE7] to-[#a8a8f0] text-white py-4 px-6 rounded-[16px] font-medium hover:from-[#7a7ad8] hover:to-[#9696e6] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <img src="/chat_plus.svg" alt="new chat" className="w-5 h-5" />
                </div>
                <span className="font-['Pretendard'] font-semibold text-base">새로운 챗봅 만들기</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 프로필 편집 모달 */}
          {showProfileModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-[25px] p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">프로필 편집</h3>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                    <input 
                      type="text" 
                      defaultValue={user?.nickname || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8e8ee7] focus:border-transparent"
                      placeholder="닉네임을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">사용자 ID</label>
                    <input 
                      type="text" 
                      defaultValue={user?.id || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-[#8E8EE7] to-[#a8a8f0] text-white py-2 px-4 rounded-lg hover:from-[#7a7ad8] hover:to-[#9696e6] transition-all duration-200 font-medium">
                      저장하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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

