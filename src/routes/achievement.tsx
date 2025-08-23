import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Route = createFileRoute('/achievement')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ProtectedRoute>
      <div>
        <div className="bg-[#fbf5ff] text-center h-screen p-4">
          <div className="mb-4">
            <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left">
              성과
            </div>
          </div>
          
          <div className="bg-white w-full opacity-100 gap-1 rounded-[20px] p-6 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)]">
            <div className="text-[#727272] font-['Pretendard'] font-normal text-lg leading-[100%] tracking-[0%] text-center mb-4">
              성과 페이지
            </div>
            <div className="text-gray-600 text-center">
              아직 성과 데이터가 없습니다.
            </div>
          </div>
          
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
            <Navbar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
