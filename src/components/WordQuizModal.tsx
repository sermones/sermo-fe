import React, { useState } from 'react';

interface WordQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (wordCount: number) => void;
}

export const WordQuizModal: React.FC<WordQuizModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
}) => {
  const [wordCount, setWordCount] = useState(10);

  const handleMinus = () => {
    if (wordCount > 1) {
      setWordCount(wordCount - 1);
    }
  };

  const handlePlus = () => {
    if (wordCount < 100) {
      setWordCount(wordCount + 1);
    }
  };

  const handleStartQuiz = () => {
    onStartQuiz(wordCount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 max-w-[90vw] mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-600">QUIZ TIME!</h2>
          <button
            onClick={onClose}
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
            {wordCount}개
          </span>
          <button
            onClick={handlePlus}
            className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
          >
            +
          </button>
        </div>
        
        <button
          onClick={handleStartQuiz}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          퀴즈 시작
        </button>
      </div>
    </div>
  );
};
