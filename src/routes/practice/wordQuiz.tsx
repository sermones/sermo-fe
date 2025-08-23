import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getRandomWords, words } from '../../data/words';
import { Word } from '../../types/quiz';

export const Route = createFileRoute('/practice/wordQuiz')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  // URL 파라미터에서 wordCount를 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const wordCount = Number(urlParams.get('wordCount')) || 10;
  
  const [quizWords, setQuizWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChoices, setCurrentChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');

  // 퀴즈 단어들 초기화
  useEffect(() => {
    const selectedWords = getRandomWords(wordCount);
    setQuizWords(selectedWords);
    generateChoices(selectedWords[0]);
  }, [wordCount]);

  // 현재 단어가 바뀔 때마다 선택지 생성
  useEffect(() => {
    if (quizWords.length > 0 && currentIndex < quizWords.length) {
      generateChoices(quizWords[currentIndex]);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [currentIndex, quizWords]);

  // 선택지 생성 함수
  const generateChoices = (currentWord: Word) => {
    const correctMeaning = currentWord.meaning;
    setCorrectAnswer(correctMeaning);
    
    // 나머지 단어들에서 3개를 무작위로 선택
    const otherWords = words.filter(word => word.id !== currentWord.id);
    const randomWords = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
    const wrongChoices = randomWords.map(word => word.meaning);
    
    // 정답과 오답을 섞어서 4개 선택지 생성
    const allChoices = [correctMeaning, ...wrongChoices];
    const shuffledChoices = allChoices.sort(() => 0.5 - Math.random());
    
    setCurrentChoices(shuffledChoices);
  };

  // 답안 선택 처리
  const handleAnswerSelect = (selectedMeaning: string) => {
    if (isAnswered) return; // 이미 답한 경우 무시
    
    setSelectedAnswer(selectedMeaning);
    setIsAnswered(true);
  };

  // 다음 퀴즈로 이동
  const handleNextQuiz = () => {
    if (currentIndex < quizWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 모든 퀴즈 완료
      navigate({ to: '/practice', search: { completedWordCount: wordCount } });
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate({ to: '/practice' });
  };

  // 진행률 계산
  const progressPercentage = wordCount > 0 ? ((currentIndex + 1) / wordCount) * 100 : 0;
  if (quizWords.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">퀴즈 준비 중...</p>
        </div>
      </div>
    );
  }

  const currentWord = quizWords[currentIndex];

  return (
    <div className="min-h-screen bg-purple-100 p-4">
      {/* 헤더 섹션 */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 mr-4"
        >
          ←
        </button>
        <div className="flex-1">
          {/* 진행률 텍스트와 바 */}
          <div className="text-sm text-gray-600 mb-1">
            QUIZ 진행률 {currentIndex + 1} / {wordCount}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-[#8E8EE7] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 단어 표시 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{currentWord.word}</h1>
      </div>

      {/* 선택지 */}
      <div className="space-y-3 mb-8">
        {currentChoices.map((choice, index) => {
          let buttonClass = "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ";
          
          if (isAnswered) {
            if (choice === correctAnswer) {
              // 정답인 경우
              buttonClass += "bg-[#8E8EE7] border-[#8E8EE7] border text-white";
            } else if (choice === selectedAnswer && choice !== correctAnswer) {
              // 오답인 경우
              buttonClass += "bg-gray-500 border-gray-500 border text-white";
            } else {
              // 선택되지 않은 오답
              buttonClass += "bg-white text-gray-600 border-gray-300";
            }
          } else {
            // 답하지 않은 상태
            buttonClass += "bg-white text-gray-600 border-gray-300 hover:bg-gray-50";
          }

          return (
            <button
              key={index}
              className={buttonClass}
              onClick={() => handleAnswerSelect(choice)}
              disabled={isAnswered}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* 다음 퀴즈 버튼 */}
      {isAnswered && (
        <div className="text-right">
          <button
            onClick={handleNextQuiz}
            className="bg-[#8E8EE7] text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            다음 퀴즈 풀기
          </button>
        </div>
      )}
    </div>
  );
}
