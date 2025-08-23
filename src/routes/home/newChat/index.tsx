import { createFileRoute } from '@tanstack/react-router';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/home/newChat/')({
  component: NewChatPage,
});

function NewChatPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/home' });
  };

  const handleChooseCharacter = () => {
    navigate({ to: '/home/newChat/chooseCharacter' });
  };

  const handleCreateCharacter = () => {
    navigate({ to: '/home/newChat/makeCharacter' });
  };

  return (
    <div className="bg-[#fbf5ff] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-900">새 채팅</h2>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-8 text-center">
          어떻게 채팅 상대를 생성하실 건가요?
        </h3>

        {/* Options */}
        <div className="space-y-4">
          {/* 캐릭터 고르기 */}
          <button
            onClick={handleChooseCharacter}
            className="w-full bg-white rounded-xl p-6 text-left shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">캐릭터 고르기</h4>
            <p className="text-sm text-gray-600">
              유저들이 만든 다양한 캐릭터를 경험해보세요
            </p>
          </button>

          {/* 캐릭터 만들기 */}
          <button
            onClick={handleCreateCharacter}
            className="w-full bg-white rounded-xl p-6 text-left shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-2">캐릭터 만들기</h4>
            <p className="text-sm text-gray-600">
              나만의 캐릭터를 새롭게 만드세요
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
