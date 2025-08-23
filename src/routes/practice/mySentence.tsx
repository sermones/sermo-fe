import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { sentences } from '../../data/sentences';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export const Route = createFileRoute('/practice/mySentence')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [showMeanings, setShowMeanings] = useState(true);

  const handleBack = () => {
    navigate({ to: '/practice' });
  };

  const toggleMeanings = () => {
    setShowMeanings(!showMeanings);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-purple-100">
        {/* 상단 고정 영역 */}
        <div className="sticky top-0 bg-purple-100 z-10 border-b border-gray-200">
          {/* 뒤로가기 버튼 */}
          <div className="flex items-center p-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-[#8E8EE7] flex items-center justify-center text-white mr-4"
            >
              ←
            </button>
            
            {/* 뜻 보기/가리기 토글 버튼 */}
            <div className="flex-1 flex justify-center">
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={toggleMeanings}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    showMeanings
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  뜻 보기
                </button>
                <button
                  onClick={toggleMeanings}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !showMeanings
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  뜻 가리기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 단어 목록 (스크롤 가능) */}
        <div className="m-5 p-5 bg-white rounded-lg">
            <h1 className="text-2xl font-light text-gray-400 tracking-wider uppercase text-center">
              MY SENTENCE
            </h1>
            <div className="space-y-0">
              {sentences.map((sentence, index) => (
                <div key={sentence.id} className="py-4 border-b border-gray-100 last:border-b-0">
                  <div className="">
                    <span className="text-lg font-bold text-black">
                      {sentence.sentence}
                    </span>
                    <p></p>
                    <span 
                      className={`text-lg text-gray-600 transition-all ${
                        showMeanings ? 'opacity-100' : 'opacity-0 text-white'
                      }`}
                    >
                      {sentence.meaning}
                    </span>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
