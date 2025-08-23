import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const Route = createFileRoute('/home/newChat/chooseCharacter')({
  component: ChooseCharacterPage,
});

interface Chatbot {
  id: string;
  name: string;
  gender: string;
  details: string;
  hashtags: string[];
  image_category: string;
  image_id?: string;
  image_url?: string;
}

interface ImageResponse {
  image: {
    id: string;
    file_name: string;
    file_size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    file_key: string;
  };
  message: string;
  url: string;
}

function ChooseCharacterPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchImageUrl = async (imageId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/image/${imageId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`이미지 조회 실패 (${imageId}):`, response.status);
        return null;
      }

      const data: ImageResponse = await response.json();
      return data.url;
    } catch (error) {
      console.warn(`이미지 조회 중 에러 (${imageId}):`, error);
      return null;
    }
  };

  const fetchChatbots = async () => {
    if (!token) {
      setError('인증 토큰이 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/chatbot', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`챗봇 목록 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      
      // 데이터 구조에 따라 처리
      let chatbotsData;
      if (Array.isArray(data)) {
        chatbotsData = data; // 직접 배열인 경우
      } else if (data.chatbots && Array.isArray(data.chatbots)) {
        chatbotsData = data.chatbots; // { chatbots: [...] } 형태인 경우
      } else if (data.data && Array.isArray(data.data)) {
        chatbotsData = data.data; // { data: [...] } 형태인 경우
      } else {
        chatbotsData = [];
      }
      
      // 각 챗봇의 이미지 URL을 가져오기
      const chatbotsWithImages = await Promise.all(
        chatbotsData.map(async (chatbot: Chatbot) => {
          if (chatbot.image_id) {
            const imageUrl = await fetchImageUrl(chatbot.image_id);
            return { ...chatbot, image_url: imageUrl };
          }
          return chatbot;
        })
      );

      setChatbots(chatbotsWithImages);
    } catch (error) {
      console.error('챗봇 목록 조회 중 에러:', error);
      setError(error instanceof Error ? error.message : '챗봇 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate({ to: '/home/newChat' });
  };

  const handleCharacterSelect = (chatbot: Chatbot) => {
    // 선택된 캐릭터로 채팅 시작
    navigate({ 
      to: '/chat', 
      search: { 
        chatbotId: chatbot.id,
        chatbotName: chatbot.name,
        chatbotImage: chatbot.image_url,
        chatbotDetails: chatbot.details
      } 
    });
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male': return '남성';
      case 'female': return '여성';
      default: return '선택 안함';
    }
  };

  const getDefaultImage = () => {
    return (
      <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-[#fbf5ff] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E8EE7] mx-auto mb-4"></div>
          <p className="text-gray-600">캐릭터 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbf5ff] min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-black">캐릭터 고르기</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* 소개 텍스트 */}
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            유저들이 만든 다양한 캐릭터를 경험해보세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* 캐릭터 목록 */}
        <div className="space-y-4">
          {chatbots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">아직 생성된 캐릭터가 없습니다</p>
              <p className="text-gray-400 text-sm">새로운 캐릭터를 만들어보세요!</p>
            </div>
          ) : (
            chatbots.map((chatbot) => (
              <div
                key={chatbot.id}
                onClick={() => handleCharacterSelect(chatbot)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-4">
                  {/* 프로필 이미지 */}
                  <div className="flex-shrink-0">
                    {chatbot.image_url ? (
                      <img
                        src={chatbot.image_url}
                        alt={`${chatbot.name} 프로필`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      getDefaultImage()
                    )}
                  </div>

                  {/* 캐릭터 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-black truncate">
                        {chatbot.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {getGenderText(chatbot.gender)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {chatbot.details || `${chatbot.name}와의 대화를 시작합니다.`}
                    </p>
                    
                    {/* 성격 태그들 */}
                    <div className="flex flex-wrap gap-2">
                      {chatbot.hashtags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#8E8EE7] text-white text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 새 캐릭터 만들기 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate({ to: '/home/newChat/makeCharacter' })}
            className="px-8 py-4 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 transform hover:scale-105 text-lg"
          >
            새 캐릭터 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
