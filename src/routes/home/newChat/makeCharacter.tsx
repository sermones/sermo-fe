import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authAPI } from '../../../api/auth';

export const Route = createFileRoute('/home/newChat/makeCharacter')({
  component: MakeCharacterPage,
});

function MakeCharacterPage() {
  const navigate = useNavigate();
  const { createChatbot, token } = useAuth();
  const [characterName, setCharacterName] = useState('');
  const [characterGender, setCharacterGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenderSection, setShowGenderSection] = useState(false);
  const [showPersonalitySection, setShowPersonalitySection] = useState(false);
  const [showDescriptionSection, setShowDescriptionSection] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(false);
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [customPersonality, setCustomPersonality] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');
  const [appearanceDescription, setAppearanceDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aIGeneratedImageUrl, setAIGeneratedImageUrl] = useState<string | null>(null);
  const [aIGeneratedImageId, setAIGeneratedImageId] = useState<string | null>(null);
  const [showCharacterInfo, setShowCharacterInfo] = useState(false);
  const [createdCharacter, setCreatedCharacter] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 기본 성격 태그들
  const defaultPersonalities = [
    '외향적', '쿨한', '똑똑한', '의리있는', '유머러스한', 
    '쾌활한', '내향적', '감성적', '직설적', '이성적'
  ];

  // 이름이 입력되었을 때 성별 섹션 애니메이션 실행
  useEffect(() => {
    if (characterName.trim()) {
      setShowGenderSection(true);
    } else {
      setShowGenderSection(false);
      setShowPersonalitySection(false);
      setShowDescriptionSection(false);
      setShowProfileSection(false);
    }
  }, [characterName]);

  // 성별이 선택되었을 때 성격 섹션 애니메이션 실행
  useEffect(() => {
    if (characterGender) {
      setShowPersonalitySection(true);
    } else {
      setShowPersonalitySection(false);
      setShowDescriptionSection(false);
      setShowProfileSection(false);
    }
  }, [characterGender]);

  const handleBack = () => {
    navigate({ to: '/home/newChat' });
  };

  const handlePersonalityClick = (personality: string) => {
    setSelectedPersonalities(prev => {
      if (prev.includes(personality)) {
        return prev.filter(p => p !== personality);
      } else {
        return [...prev, personality];
      }
    });
  };

  const handleAddCustomPersonality = () => {
    if (customPersonality.trim()) {
      setSelectedPersonalities(prev => [...prev, customPersonality.trim()]);
      setCustomPersonality('');
      setShowCustomModal(false);
    }
  };

  const handlePersonalityConfirm = () => {
    if (selectedPersonalities.length > 0) {
      setShowDescriptionSection(true);
    }
  };

  const handleAIGeneration = () => {
    setShowAIModal(true);
  };

  const handleDirectUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAISubmit = async () => {
    if (!token) {
      setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }
    
    if (appearanceDescription.trim()) {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('AI 이미지 생성 시작:', appearanceDescription);
        
        // 1. AI 이미지 생성 API 호출
        const response = await authAPI.generateAIImage(token, appearanceDescription.trim());
        
        // 2. 생성된 이미지 ID로 이미지 정보 가져오기
        const imageResponse = await authAPI.getImage(token, response.image_ids[0]);
        
        // 3. AI 생성된 이미지 정보를 상태에 저장
        setAIGeneratedImageId(response.image_ids[0]);
        setAIGeneratedImageUrl(imageResponse.url);
        
        console.log('AI 이미지 생성 성공:', {
          imageId: response.image_ids[0],
          imageUrl: imageResponse.url
        });
        
        // 4. AI 이미지 생성 성공 후 바로 챗봇 생성
        console.log('AI 이미지 생성 성공, 챗봇 생성 시작');
        
        // 챗봇 생성 요청 데이터
        const chatbotData = {
          name: characterName.trim(),
          details: additionalDescription.trim() || `${characterName.trim()}와의 대화를 시작합니다.`,
          gender: characterGender || 'unknown',
          hashtags: selectedPersonalities.length > 0 ? selectedPersonalities : ['친구', '대화'],
          image_category: 'ai',
          image_id: response.image_ids[0],
        };
        
        console.log('AI 챗봇 생성 요청 데이터:', chatbotData);
        
        // 챗봇 생성
        await createChatbot(chatbotData);
        
        // 생성된 캐릭터 정보 설정 (AI 이미지 사용)
        setCreatedCharacter({
          name: characterName.trim(),
          gender: characterGender || 'unknown',
          hashtags: selectedPersonalities.length > 0 ? selectedPersonalities : ['친구', '대화'],
          details: additionalDescription.trim(),
          image_category: 'ai',
          image_id: response.image_ids[0],
          imagePreview: imageResponse.url // AI 생성된 이미지 URL 사용
        });
        
        // 5. 모달 닫고 캐릭터 정보 창 표시
        setShowAIModal(false);
        setAppearanceDescription('');
        setShowCharacterInfo(true);
        
        // 6. 2초 후 홈 화면으로 자동 이동
        setTimeout(() => {
          navigate({ to: '/home' });
        }, 2000);
        
      } catch (error) {
        console.error('AI 이미지 생성 실패:', error);
        
        // 실패 시 알림 후 다시 입력 창 표시
        const errorMessage = error instanceof Error ? error.message : 'AI 이미지 생성에 실패했습니다';
        alert(`AI 이미지 생성에 실패했습니다.\n\n${errorMessage}\n\n다시 시도해주세요.`);
        
        // 모달은 그대로 유지하여 사용자가 다시 입력할 수 있도록 함
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    if (!characterName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      }

      let imageId: string | undefined;
      let imageCategory: string = 'default';
      
      // 이미지가 선택된 경우 먼저 업로드
      if (selectedImage) {
        try {
          console.log('이미지 업로드 시작:', selectedImage.name);
          console.log('사용할 토큰:', token ? token.substring(0, 20) + '...' : '토큰 없음');
          
          const uploadResponse = await authAPI.uploadImage(token, selectedImage);
          imageId = uploadResponse.image.id; // 서버에서 반환된 image.id 저장
          imageCategory = 'custom';
          console.log('이미지 업로드 성공, ID:', imageId);
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          
          // 에러 메시지에 더 자세한 정보 포함
          let errorMessage = '이미지 업로드에 실패했습니다.';
          if (error instanceof Error) {
            errorMessage += ` (${error.message})`;
          }
          
          // 이미지 업로드 실패 시 사용자에게 알림
          const continueWithoutImage = window.confirm(
            `${errorMessage}\n\n이미지 없이 챗봇을 생성하시겠습니까?`
          );
          
          if (continueWithoutImage) {
            console.log('이미지 없이 챗봇 생성 진행');
            imageId = undefined;
            imageCategory = 'default';
          } else {
            setError(errorMessage);
            return;
          }
        }
      } else if (aIGeneratedImageId && aIGeneratedImageUrl) {
        // AI 생성된 이미지가 있는 경우
        imageId = aIGeneratedImageId;
        imageCategory = 'ai';
        console.log('AI 생성된 이미지 사용:', { imageId, imageUrl: aIGeneratedImageUrl });
      }

      // 챗봇 생성 요청 데이터
      const chatbotData = {
        name: characterName.trim(),
        details: additionalDescription.trim() || `${characterName.trim()}와의 대화를 시작합니다.`,
        gender: characterGender || 'unknown',
        hashtags: selectedPersonalities.length > 0 ? selectedPersonalities : ['친구', '대화'],
        image_category: imageCategory,
        image_id: imageId,
      };
      
      console.log('챗봇 생성 요청 데이터:', chatbotData);
      console.log('토큰:', token);
      
      await createChatbot(chatbotData);
      
      // 생성된 캐릭터 정보 설정
      setCreatedCharacter({
        name: characterName.trim(),
        gender: characterGender || 'unknown',
        hashtags: selectedPersonalities.length > 0 ? selectedPersonalities : ['친구', '대화'],
        details: additionalDescription.trim(),
        image_category: imageCategory,
        image_id: imageId,
        imagePreview: selectedImage ? imagePreview : (aIGeneratedImageUrl || undefined)
      });
      setShowCharacterInfo(true);
      
      // 2초 후 홈 화면으로 자동 이동
      setTimeout(() => {
        navigate({ to: '/home' });
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : '챗봇 생성에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fbf5ff] min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-black">캐릭터 만들기</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* 이름 입력 섹션 */}
        <div className="space-y-4">
          <label className="block text-black font-bold text-base">
            이름
          </label>
          
          <div className="flex gap-3">
            {/* 입력 필드 */}
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="성이름"
              className="flex-1 px-4 py-3 border border-[#8E8EE7] rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent"
              disabled={isLoading}
            />
            
            {/* 이름 확인 버튼 */}
            <button
              onClick={() => {
                if (characterName.trim()) {
                  // 이름 데이터 업데이트 완료
                  console.log('이름 입력 완료:', characterName.trim());
                  // 추가 작업이 필요한 경우 여기에 추가
                }
              }}
              disabled={!characterName.trim() || isLoading}
              className="px-6 py-3 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              확인
            </button>
          </div>
        </div>

        {/* 성별 선택 섹션 - 애니메이션으로 나타남 */}
        <div className={`space-y-4 mt-6 transition-all duration-500 ease-out ${
          showGenderSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <label className="block text-black font-bold text-base">
            성별 (선택사항)
          </label>
          
          <div className="relative">
            <select
              value={characterGender}
              onChange={(e) => setCharacterGender(e.target.value)}
              className="w-full px-4 py-3 border border-[#8E8EE7] rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent appearance-none"
              disabled={isLoading}
            >
              <option value="">채팅 상대의 성별을 선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="unknown">선택 안함</option>
            </select>
            
            {/* 커스텀 드롭다운 화살표 */}
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 성격 선택 섹션 - 애니메이션으로 나타남 */}
        <div className={`space-y-4 mt-6 transition-all duration-500 ease-out ${
          showPersonalitySection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <label className="block text-black font-bold text-base">
            성격
          </label>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              채팅 상대가 어떤 성격을 가지길 바라나요?<br />
              원하는 대로 모두 선택해 주세요.
            </p>
            
            {/* 성격 태그들 */}
            <div className="flex flex-wrap gap-2">
              {/* 선택된 성격들을 앞으로 배치 */}
              {selectedPersonalities.map((personality, index) => (
                <button
                  key={`selected-${personality}`}
                  onClick={() => handlePersonalityClick(personality)}
                  className="px-4 py-2 bg-[#8E8EE7] text-white rounded-full border border-[#8E8EE7] transition-all duration-300 hover:bg-[#7A7AD8] transform hover:scale-105"
                  style={{
                    order: index,
                    animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                  }}
                >
                  {personality}
                </button>
              ))}
              
              {/* 선택되지 않은 기본 성격들 */}
              {defaultPersonalities
                .filter(personality => !selectedPersonalities.includes(personality))
                .map((personality, index) => (
                  <button
                    key={`default-${personality}`}
                    onClick={() => handlePersonalityClick(personality)}
                    className="px-4 py-2 bg-[#f5f5f5] text-gray-600 rounded-full border border-[#8E8EE7] transition-all duration-300 hover:bg-gray-200 transform hover:scale-105"
                    style={{
                      order: selectedPersonalities.length + index
                    }}
                  >
                    {personality}
                  </button>
                ))}
              
              {/* 커스텀 성격 추가 버튼 - 가장 마지막에 배치 */}
              <button
                onClick={() => setShowCustomModal(true)}
                className="w-10 h-10 bg-[#f5f5f5] text-[#8E8EE7] rounded-full border-2 border-dashed border-[#8E8EE7] flex items-center justify-center hover:bg-[#8E8EE7] hover:text-white transition-all duration-300 transform hover:scale-105"
                style={{
                  order: selectedPersonalities.length + defaultPersonalities.filter(p => !selectedPersonalities.includes(p)).length
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* 성격 확인 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePersonalityConfirm}
                disabled={selectedPersonalities.length === 0}
                className="px-6 py-3 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                성격 확인
              </button>
            </div>
          </div>
        </div>

        {/* 추가 설명 섹션 - 애니메이션으로 나타남 */}
        <div className={`space-y-4 mt-6 transition-all duration-500 ease-out ${
          showDescriptionSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <label className="block text-black font-bold text-base">
            추가 설명
          </label>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              채팅 상대에 대해 더 커스텀하고 싶은 것이 있나요?
            </p>
            
            <textarea
              value={additionalDescription}
              onChange={(e) => setAdditionalDescription(e.target.value)}
              placeholder="상대의 성격, 상대와의 관계 등을 자유롭게 입력하세요"
              className="w-full h-32 px-4 py-3 border border-[#8E8EE7] rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent resize-none"
              disabled={isLoading}
            />

            {/* 추가 설명 확인 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (additionalDescription.trim()) {
                    // 추가 설명 데이터 저장
                    console.log('추가 설명 저장:', additionalDescription);
                    // 프로필 섹션 표시
                    setShowProfileSection(true);
                  }
                }}
                disabled={!additionalDescription.trim() || isLoading}
                className="px-6 py-3 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                확인
              </button>
            </div>
          </div>
        </div>

        {/* 프로필 사진 등록 섹션 - 애니메이션으로 나타남 */}
        <div className={`space-y-4 mt-6 transition-all duration-500 ease-out ${
          showProfileSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <label className="block text-black font-bold text-base">
            프로필 사진 등록
          </label>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              {/* AI로 생성 버튼 */}
              <button 
                onClick={handleAIGeneration}
                disabled={!additionalDescription.trim() || isLoading}
                className="flex-1 px-4 py-3 bg-white text-gray-600 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                AI로 생성
              </button>
              
              {/* 직접 등록 버튼 */}
              <button 
                onClick={handleDirectUpload}
                className="flex-1 px-4 py-3 bg-[#8E8EE7] text-white rounded-xl border border-[#8E8EE7] hover:bg-[#7A7AD8] transition-all duration-300"
              >
                직접 등록
              </button>
            </div>

            {/* 파일 업로드 input (숨김) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* 선택된 이미지 미리보기 */}
            {imagePreview && (
              <div className="mt-4 mx-auto w-32 h-32 mb-10">
                <p className="text-sm text-center text-gray-600 mb-2">선택된 이미지:</p>
                <img 
                  src={imagePreview} 
                  alt="프로필 미리보기" 
                  className="w-32 h-32 object-cover rounded-xl border border-[#8E8EE7]"
                />
              </div>
            )}

            {/* 직접 등록 시에만 최종 생성 버튼 표시 */}
            {imagePreview && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="px-8 py-4 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      캐릭터 생성 중...
                    </div>
                  ) : (
                    '캐릭터 생성하기'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 커스텀 성격 입력 모달 */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 mx-4">
            <h3 className="text-lg font-bold text-black mb-4">새로운 성격을 입력하세요</h3>
            
            <input
              type="text"
              value={customPersonality}
              onChange={(e) => setCustomPersonality(e.target.value)}
              placeholder="새로운 성격을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-[#8E8EE7] mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setCustomPersonality('');
                }}
                className="flex-1 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddCustomPersonality}
                disabled={!customPersonality.trim()}
                className="flex-1 px-4 py-2 bg-[#8E8EE7] text-white font-medium rounded-lg hover:bg-[#7A7AD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI 이미지 생성 모달 */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4">
            <h3 className="text-lg font-bold text-black mb-4">AI 이미지 생성</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              AI에게 캐릭터의 외형 정보를 알려주세요
            </p>
            
            <textarea
              value={appearanceDescription}
              onChange={(e) => setAppearanceDescription(e.target.value)}
              placeholder="자유롭게 입력하세요"
              className="w-full h-32 px-4 py-3 border border-[#8E8EE7] rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E8EE7] focus:border-transparent resize-none mb-4"
              autoFocus
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAppearanceDescription('');
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleAISubmit}
                disabled={!appearanceDescription.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-[#8E8EE7] text-white font-medium rounded-lg hover:bg-[#7A7AD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    생성 중...
                  </>
                ) : (
                  '생성'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 캐릭터 생성 완료 정보 창 */}
      {showCharacterInfo && createdCharacter && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 mx-4">
            {/* NEW CHARACTER 라벨 */}
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm uppercase tracking-wide">NEW CHARACTER</span>
            </div>
            
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-4">
              {createdCharacter.imagePreview ? (
                <img 
                  src={createdCharacter.imagePreview} 
                  alt="프로필" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#8E8EE7]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* 이름 */}
            <div className="text-center mb-4">
              <h3 className="text-black font-bold text-lg">{createdCharacter.name}</h3>
            </div>
            
            {/* 성격 태그들 */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {createdCharacter.hashtags.slice(0, 3).map((tag: string, index: number) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#8E8EE7] text-white text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* 추가 설명 (있는 경우에만 표시) */}
            {createdCharacter.details && createdCharacter.details.trim() && (
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {createdCharacter.details}
                </p>
              </div>
            )}
            
            {/* 성공 메시지 */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                ✅ 챗봇이 성공적으로 생성되었습니다!
              </p>
            </div>
            
            {/* 자동 이동 안내 */}
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 text-center">
                ⏰ 2초 후 홈 화면으로 자동 이동됩니다
              </p>
            </div>
            
            {/* 채팅 시작 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowCharacterInfo(false);
                  setCreatedCharacter(null);
                  navigate({ to: '/home' });
                }}
                className="w-full px-8 py-4 bg-[#8E8EE7] text-white rounded-xl font-medium hover:bg-[#7A7AD8] transition-all duration-300 transform hover:scale-105 text-lg"
              >
                지금 채팅 시작
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 애니메이션 CSS를 위한 스타일 태그 */}
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
  );
}
