import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import '../../style/shStyle.css';

export const Route = createFileRoute('/practice/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [isWordQuizModalOpen, setIsWordQuizModalOpen] = useState(false);
  const [selectedWordCount, setSelectedWordCount] = useState(10);
  const [isSentenceQuizModalOpen, setIsSentenceQuizModalOpen] = useState(false);
  const [selectedSentenceCount, setSelectedSentenceCount] = useState(10);
  const [isIncorrectProblemsModalOpen, setIsIncorrectProblemsModalOpen] = useState(false);
  const [selectedIncorrectProblemsCount, setSelectedIncorrectProblemsCount] = useState(10);
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

  const handleIncorrectProblemsClick = () => {
    setIsIncorrectProblemsModalOpen(true);
  };

  const handleCloseIncorrectProblemsModal = () => {
    setIsIncorrectProblemsModalOpen(false);
    setSelectedIncorrectProblemsCount(10); // 기본값으로 리셋
  };

  const handleStartQuiz = (wordCount: number) => {
    navigate({ to: '/practice/wordQuiz', search: { wordCount } });
  };

  const handleStartSentenceQuiz = (sentenceCount: number) => {
    navigate({ to: '/practice/sentenceQuiz', search: { sentenceCount } });
  };

  const handleStartIncorrectProblemsQuiz = () => {
    // 틀린 문제 모아보기는 wordQuiz와 동일하게 진행하되, 별도 모달 없이 바로 practice로 돌아감
    navigate({ to: '/practice/wordQuiz', search: { wordCount: selectedIncorrectProblemsCount, isIncorrectProblems: true } });
  };

  const handleStartMyWord = () => {
    navigate({ to: '/practice/myWord'});
  };

  const handleStartMySentence = () => {
    navigate({ to: '/practice/mySentence' });
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

  const handleIncorrectProblemsMinus = () => {
    if (selectedIncorrectProblemsCount > 1) {
      setSelectedIncorrectProblemsCount(selectedIncorrectProblemsCount - 1);
    }
  };

  const handleIncorrectProblemsPlus = () => {
    if (selectedIncorrectProblemsCount < 100) {
      setSelectedIncorrectProblemsCount(selectedIncorrectProblemsCount + 1);
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
            <button className="sh-profile" onClick={handleIncorrectProblemsClick}>
              <img src="/service.png" alt="incorrect problems" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">틀린 문제 모아 보기</div>
              </div>
            </button>
          </div>
          <div className="sh-chatsprofile-container">
            <div className="sh-profile-title">RECORDS</div>
            <button className="sh-profile" onClick={handleStartMyWord}>
              <img src="/books.svg" alt="learning report" className="sh-round-image" />
              <div className="sh-wrap">
                <div className="sh-profile-name">나의 단어장</div>
              </div>
            </button>
            <button className="sh-profile" onClick={handleStartMySentence}>
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
                <span className="mx-6 text-lg text-[#8E8EE7] font-medium">
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
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#8E8EE7]">QUIZ TIME!</h2>
                <button
                  onClick={() => setIsSentenceQuizModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 mb-2">몇 개의 문장 퀴즈를 풀까요?</p>
              <p className="text-gray-500 text-sm mb-6">한 번에 100개까지 퀴즈 볼 수 있어요</p>
              
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={handleSentenceMinus}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="mx-6 text-xl font-semibold text-[#8E8EE7]">
                  {selectedSentenceCount}개
                </span>
                <button
                  onClick={handleSentencePlus}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleStartSentenceQuiz(selectedSentenceCount)}
                className="w-full bg-[#8E8EE7] text-white py-3 rounded-lg font-medium hover:bg-[#7A7AD4] transition-colors"
              >
                퀴즈 시작
              </button>
            </div>
          </div>
        )}

        {/* 틀린 문제 모아보기 모달 */}
        {isIncorrectProblemsModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#8E8EE7]">QUIZ TIME!</h2>
                <button
                  onClick={handleCloseIncorrectProblemsModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-700 mb-2">몇 개의 오답 풀이를 할까요?</p>
              <p className="text-gray-500 text-sm mb-4">많이 틀린 문제를 집중 복습하세요</p>
              <p className="text-gray-500 text-sm mb-6">한 번에 100개까지 퀴즈 볼 수 있어요</p>
              
              <div className="flex items-center justify-center mb-6">
                <button
                  onClick={handleIncorrectProblemsMinus}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="mx-6 text-xl font-semibold text-[#8E8EE7]">
                  {selectedIncorrectProblemsCount}개
                </span>
                <button
                  onClick={handleIncorrectProblemsPlus}
                  className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => handleStartIncorrectProblemsQuiz()}
                className="w-full bg-[#8E8EE7] text-white py-3 rounded-lg font-medium hover:bg-[#7A7AD4] transition-colors"
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
              
              <div className="flex justify-center mb-6">
                <img src="/waong.svg" alt="waong" className="w-24 h-24" />
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


