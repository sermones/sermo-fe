import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/practice/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isWordQuizModalOpen, setIsWordQuizModalOpen] = useState(false);
  const [selectedWordCount, setSelectedWordCount] = useState(10);
  const [isSentenceQuizModalOpen, setIsSentenceQuizModalOpen] = useState(false);
  const [selectedSentenceCount, setSelectedSentenceCount] = useState(10);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [completedWordCount, setCompletedWordCount] = useState(0);

  // URL 파라미터에서 completedWordCount 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const completedCount = urlParams.get('completedWordCount');
    
    if (completedCount) {
      setCompletedWordCount(Number(completedCount));
      setIsCompletionModalOpen(true);
      // URL 파라미터 제거
      window.history.replaceState({}, '', '/practice');
    }
  }, []);

  const handleWordQuizClick = () => {
    setIsWordQuizModalOpen(true);
  };

  const handleSentenceQuizClick = () => {
    setIsSentenceQuizModalOpen(true);
  };

  const handleStartQuiz = (wordCount: number) => {
    navigate({ to: '/practice/wordQuiz', search: { wordCount } });
  };

  const handleStartSentenceQuiz = (sentenceCount: number) => {
    navigate({ to: '/practice/sentenceQuiz', search: { sentenceCount } });
  };

  const handleMinus = () => {
    if (selectedWordCount > 1) {
      setSelectedWordCount(selectedWordCount - 1);
    }
  };

  const handlePlus = () => {
    if (selectedWordCount < 100) {
      setSelectedWordCount(selectedWordCount + 1);
    }
  };

  const handleSentenceMinus = () => {
    if (selectedSentenceCount > 1) {
      setSelectedSentenceCount(selectedSentenceCount - 1);
    }
  };

  const handleSentencePlus = () => {
    if (selectedSentenceCount < 100) {
      setSelectedSentenceCount(selectedSentenceCount + 1);
    }
  };

  const handleCloseCompletionModal = () => {
    setIsCompletionModalOpen(false);
  };

  console.log('Practice 페이지 렌더링됨');
  return (
    <ProtectedRoute>
      <div>
        <div className="container sh-main-bg">
          <div className="sh-title">PRACTICE</div>
          <div className="sh-myprofile-container">
            <div className="sh-profile-title">QUIZ</div>
            <button className="sh-profile" onClick={handleWordQuizClick}>
              <img src="/word-games.png" alt="word quiz" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">단어 퀴즈</div>
              </div>
            </button>
            <button className="sh-profile" onClick={handleSentenceQuizClick}>
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
            <button className="sh-profile" onClick={() => console.log('북마크 클릭')}>
              <img src="/records_1.svg" alt="bookmarks" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">학습 통계</div>
              </div>
            </button>
            <button className="sh-profile" onClick={() => console.log('학습 리포트 클릭')}>
              <img src="/books.svg" alt="learning report" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">나의 단어장</div>
              </div>
            </button>
            <button className="sh-profile" onClick={() => console.log('북마크 클릭')}>
              <img src="/backlog.png" alt="bookmarks" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">나의 문장집</div>
              </div>
            </button>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>

        {/* 단어 퀴즈 모달 */}
        {isWordQuizModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 max-w-[90vw] mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#8E8EE7]">QUIZ TIME!</h2>
                <button
                  onClick={() => setIsWordQuizModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-2">몇 개의 단어로 퀴즈를 볼까요?</p>
                <p className="text-gray-600 text-sm">한 번에 100개까지 퀴즈 볼 수 있어요</p>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={handleMinus}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  -
                </button>
                <span className="mx-6 text-lg font-medium">
                  {selectedWordCount}개
                </span>
                <button
                  onClick={handlePlus}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleStartQuiz(selectedWordCount)}
                className="w-full bg-[#8E8EE7] text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                퀴즈 시작
              </button>
            </div>
          </div>
        )}

        {/* 문장 퀴즈 모달 */}
        {isSentenceQuizModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 max-w-[90vw] mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#8E8EE7]">QUIZ TIME!</h2>
                <button
                  onClick={() => setIsSentenceQuizModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-700 mb-2">몇 개의 문장으로 퀴즈를 볼까요?</p>
                <p className="text-gray-600 text-sm">한 번에 100개까지 퀴즈 볼 수 있어요</p>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={handleSentenceMinus}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  -
                </button>
                <span className="mx-6 text-lg font-medium">
                  {selectedSentenceCount}개
                </span>
                <button
                  onClick={handleSentencePlus}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleStartSentenceQuiz(selectedSentenceCount)}
                className="w-full bg-[#8E8EE7] text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                퀴즈 시작
              </button>
            </div>
          </div>
        )}

        {/* 퀴즈 완료 모달 */}
        {isCompletionModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 max-w-[90vw] mx-4 text-left">
              <h2 className="text-2xl font-bold text-[#8E8EE7] mb-4">EXCELLENT</h2>
              
              <p className="text-lg font-bold text-gray-800">
                {completedWordCount}개 단어를 전부 외우다니
              </p>
              <p className="text-xl font-bold text-gray-800 mb-6">
                정말 대단해요!
              </p>
              
              {/* 임시 이미지 (나중에 수정 가능) */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto bg-purple-200 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-2xl">🎉</span>
                </div>
              </div>
              
              <button
                onClick={handleCloseCompletionModal}
                className="w-full bg-[#8E8EE7] text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


