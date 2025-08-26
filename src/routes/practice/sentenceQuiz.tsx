import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { sentences } from '../../data/sentences';

interface Sentence {
  sentence: string;
  meaning: string;
}

export const Route = createFileRoute('/practice/sentenceQuiz')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const sentenceCount = parseInt(new URLSearchParams(window.location.search).get('sentenceCount') || '10');
  
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [correctOrder, setCorrectOrder] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (currentSentenceIndex < sentenceCount) {
      const currentSentence = sentences[currentSentenceIndex];
      const words = currentSentence.sentence.split(' ');
      setCurrentWords(words);
      setCorrectOrder(words);
      setSelectedWords([]);
    } else {
      setIsCompleted(true);
    }
  }, [currentSentenceIndex, sentenceCount]);

  const handleWordClick = (word: string, index: number) => {
    if (word === '') return; // 이미 선택된 단어는 클릭 불가
    
    // 단어를 선택된 순서대로 추가
    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);
    
    // 현재 단어를 빈 문자열로 변경 (선택된 것 표시)
    const newCurrentWords = [...currentWords];
    newCurrentWords[index] = '';
    setCurrentWords(newCurrentWords);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < sentenceCount - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      // 모든 문장 완료
      navigate({ to: '/practice' });
    }
  };

  const handleBack = () => {
    navigate({ to: '/practice' });
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#8E8EE7] mb-4">퀴즈 완료!</h1>
          <p className="text-lg text-gray-600 mb-6">{sentenceCount}개의 문장을 모두 완성했습니다!</p>
          <button
            onClick={() => navigate({ to: '/practice' })}
            className="bg-[#8E8EE7] text-white px-6 py-3 rounded-lg hover:bg-[#7A7AD8] transition-colors"
          >
            연습 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];
  const progressPercentage = ((currentSentenceIndex + 1) / sentenceCount) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="text-[#8E8EE7] hover:text-[#7A7AD8] transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-[#8E8EE7]">문장 퀴즈</h1>
        <div className="w-8"></div>
      </div>

      {/* Progress Section */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-lg font-medium text-gray-700">
            QUIZ 진행률 ({currentSentenceIndex + 1}/{sentenceCount})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-[#8E8EE7] h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current Sentence Meaning */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">문장의 뜻</h2>
        <p className="text-lg font-bold text-[#8E8EE7]">"{currentSentence.meaning}"</p>
      </div>

      {/* Word Selection Area */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">단어를 순서대로 클릭하세요</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {currentWords.map((word, index) => (
            <div
              key={index}
              onClick={() => handleWordClick(word, index)}
              className={`px-3 py-1 rounded-lg border-2 transition-all whitespace-nowrap cursor-pointer ${
                word === '' 
                  ? 'bg-gray-100 border-gray-200' 
                  : 'bg-white border-[#8E8EE7] hover:bg-purple-50 hover:border-purple-400'
              }`}
            >
              <span className={`font-medium ${
                word === '' ? 'text-gray-400' : 'text-gray-800'
              }`}>
                {word === '' ? '✓' : word}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Words Display */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">선택된 단어들</h3>
        <div className="min-h-20 bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-wrap items-center justify-center">
          {selectedWords.length === 0 ? (
            <span className="text-gray-500 text-lg">여기에 단어를 클릭하세요!</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <span
                  key={index}
                  className="font-bold text-[#8E8EE7] text-lg animate-in fade-in-0 zoom-in-95 duration-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <div className="text-center">
        <button
          onClick={handleNextSentence}
          disabled={selectedWords.length !== correctOrder.length}
          className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all ${
            selectedWords.length === correctOrder.length
              ? 'bg-[#8E8EE7] text-white hover:bg-[#7A7AD8] shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음 문장은?
        </button>
      </div>
    </div>
  );
}
