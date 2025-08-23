import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { getRandomSentences } from '../../data/sentences';
import { Sentence } from '../../types/quiz';

export const Route = createFileRoute('/practice/sentenceQuiz')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  // URL 파라미터에서 sentenceCount를 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const sentenceCount = Number(urlParams.get('sentenceCount')) || 10;
  
  const [quizSentences, setQuizSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<Sentence | null>(null);
  const [draggedWord, setDraggedWord] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState<string | null>(null);
  const [wordPositions, setWordPositions] = useState<Array<{ word: string; index: number }>>([]);
  const [draggedWords, setDraggedWords] = useState<string[]>([]);

  // 퀴즈 문장들 초기화
  useEffect(() => {
    const selectedSentences = getRandomSentences(sentenceCount);
    setQuizSentences(selectedSentences);
    if (selectedSentences.length > 0) {
      setupCurrentSentence(selectedSentences[0]);
    }
  }, [sentenceCount]);

  // 현재 문장이 바뀔 때마다 설정
  useEffect(() => {
    if (quizSentences.length > 0 && currentIndex < quizSentences.length) {
      setupCurrentSentence(quizSentences[currentIndex]);
    }
  }, [currentIndex, quizSentences]);

  // 현재 문장 설정
  const setupCurrentSentence = (sentence: Sentence) => {
    setCurrentSentence(sentence);
    // 문장을 단어별로 분리하고 랜덤하게 섞기
    const words = sentence.sentence.split(' ').filter(word => word.trim() !== '');
    const shuffledWords = words.sort(() => 0.5 - Math.random());
    setCurrentWords(shuffledWords);
    setSelectedWords([]);
    setDraggedWord(null);
    setIsDragging(false);
    setDraggedWords([]);
    
    // 단어 위치 정보 저장
    const positions = shuffledWords.map((word, index) => ({ word, index }));
    setWordPositions(positions);
  };

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, word: string, wordIndex: number) => {
    console.log('Drag start:', word, wordIndex);
    setDraggedWord(word);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', word);
    
    // 드래그한 단어를 draggedWords 배열에 추가
    setDraggedWords(prev => [...prev, word]);
    
    // 드래그한 단어의 원래 위치를 여백으로 만들기
    setCurrentWords(prev => prev.map((w, i) => i === wordIndex ? '' : w));
  };

  // 드래그 종료
  const handleDragEnd = () => {
    console.log('Drag end');
    setIsDragging(false);
    setDraggedWord(null);
  };

  // 드래그 오버 (드롭 영역 위에 있을 때)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // 드롭 처리
  const handleDrop = (e: React.DragEvent) => {
    console.log('=== DROP EVENT START ===');
    e.preventDefault();
    
    const droppedWord = e.dataTransfer.getData('text/plain');
    console.log('Dropped word:', droppedWord);
    
    if (!droppedWord) {
      console.log('No dropped word data found');
      return;
    }

    // 정답 순서 확인
    const correctOrder = currentSentence!.sentence.split(' ').filter(word => word.trim() !== '');
    const nextCorrectWord = correctOrder[selectedWords.length];
    
    console.log('Correct order:', correctOrder);
    console.log('Next correct word:', nextCorrectWord);
    console.log('Current selected words:', selectedWords);
    
    if (droppedWord === nextCorrectWord) {
      console.log('Correct answer!');
      // 정답: 단어를 선택된 목록에 추가
      setSelectedWords(prev => [...prev, droppedWord]);
      
      // 모든 단어를 맞췄는지 확인
      if (selectedWords.length + 1 === correctOrder.length) {
        console.log('All words correct!');
      }
    } else {
      console.log('Wrong answer! Expected:', nextCorrectWord, 'Got:', droppedWord);
      
      // 오답: 흔들림 애니메이션과 원래 단어 복원
      setShakeAnimation(droppedWord);
      setTimeout(() => {
        setShakeAnimation(null);
      }, 500);
      
      // 원래 단어를 원래 위치에 복원
      setCurrentWords(prev => prev.map(w => w === '' ? droppedWord : w));
      
      // "삐익!" 효과음
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuq+8+OWT');
        audio.play();
      } catch (e) {
        // 오디오 재생 실패 시 무시
      }
    }
    
    setIsDragging(false);
    setDraggedWord(null);
  };

  // 다음 문장으로 이동
  const handleNextSentence = () => {
    if (currentIndex < quizSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 모든 문장 퀴즈 완료
      navigate({ to: '/practice', search: { completedSentenceCount: sentenceCount } });
    }
  };

  // 뒤로가기
  const handleBack = () => {
    navigate({ to: '/practice' });
  };

  // 진행률 계산
  const progressPercentage = sentenceCount > 0 ? ((currentIndex + 1) / sentenceCount) * 100 : 0;

  if (quizSentences.length === 0 || !currentSentence) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8E8EE7] mx-auto"></div>
          <p className="mt-4 text-gray-600">퀴즈 준비 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-100 p-4">
      {/* 헤더 섹션 */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-[#8E8EE7] flex items-center justify-center text-white mr-4"
        >
          ←
        </button>
        <div className="flex-1">
          {/* 진행률 텍스트와 바 */}
          <div className="text-sm text-gray-600 mb-1">
            QUIZ 진행률 {currentIndex + 1} / {sentenceCount}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-[#8E8EE7] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 문장 뜻 표시 */}
      <div className="text-center mb-8">
        <p className="text-lg text-gray-800">{currentSentence.meaning}</p>
      </div>

      {/* 단어들 표시 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {currentWords.map((word, index) => (
            <div
              key={`${word}-${index}`}
              draggable={word !== ''}
              onDragStart={(e) => word !== '' ? handleDragStart(e, word, index) : undefined}
              onDragEnd={handleDragEnd}
              className={`px-3 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
                word === '' 
                  ? 'bg-gray-100 border-gray-200' 
                  : `bg-white border-gray-300 text-gray-800 cursor-move ${
                      shakeAnimation === word ? 'animate-shake' : ''
                    } ${
                      isDragging && draggedWord === word ? 'bg-purple-200 border-purple-400' : ''
                    }`
              }`}
            >
              {word || '　'}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 드롭 영역 */}
      <div className="mb-8 mt-32">
        <div 
          className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-32 transition-all duration-200"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = 'white';
          }}
          style={{ 
            backgroundColor: isDragging ? '#f3f4f6' : 'white',
            cursor: isDragging ? 'copy' : 'default'
          }}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {/* 이미 완료된 단어들 (검은색, 굵게) */}
            {selectedWords.map((word, index) => (
              <span
                key={index}
                className="font-bold text-black text-lg"
              >
                {word}
              </span>
            ))}
            
            {/* 현재 드래그 중인 단어들 (연보라색, 굵게) - 순서대로 표시 */}
            {draggedWords.map((word, index) => (
              <span
                key={`dragged-${index}`}
                className="font-bold text-[#8E8EE7] text-lg"
              >
                {word}
              </span>
            ))}
            
            {/* 안내 텍스트 - 단어가 1개 이상이면 표시하지 않음 */}
            {selectedWords.length === 0 && draggedWords.length === 0 && !isDragging && (
              <span className="text-gray-400 text-sm">
                단어를 여기에 드래그하세요
              </span>
            )}
            {isDragging && selectedWords.length === 0 && draggedWords.length === 0 && (
              <span className="text-gray-400 text-sm">
                여기에 드롭하세요!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 다음 문장 버튼 - 항상 표시 */}
      <div className="text-center mt-8">
        <button
          onClick={handleNextSentence}
          className="px-6 py-3 bg-[#8E8EE7] text-white rounded-lg hover:bg-[#7A7AD4] transition-colors"
        >
          다음 문장은?
        </button>
      </div>

      {/* 드롭 영역 (투명하게) - 제거 */}
    </div>
  );
}
