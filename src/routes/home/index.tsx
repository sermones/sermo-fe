import { createFileRoute } from '@tanstack/react-router';
import { Navbar } from '../../components/Navbar';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="bg-[#fbf5ff] text-center h-screen p-4">
        <div className="text-[#8e8ee7] font-['Pretendard'] font-extrabold text-2xl leading-9 tracking-0 text-left align-middle p-2">
          HOME
        </div>
        
        {/* MY Profile Container */}
        <div className="bg-white w-full h-[111px] opacity-100 gap-1 rounded-[20px] p-3 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)]">
          <div className="text-[#727272] w-[21px] h-[17px] opacity-100 font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%] text-left align-middle">
            MY
          </div>
          <div className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
            <img src="/Checker.png" alt="profile" className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px]" />
            <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle flex-1 text-center">
              dummyName
            </div>
            <div className="w-6 h-6"></div>
          </div>
        </div>
        
        {/* CHATS Container */}
        <div className="mt-4 bg-white w-full opacity-100 gap-1 rounded-[20px] p-3 shadow-[0px_3px_4px_0px_rgba(0,0,0,0.1)] mb-20">
          <div className="text-[#727272] w-[21px] h-[17px] opacity-100 font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%] text-left align-middle">
            CHATS
          </div>
          
          {/* Chat Item 1 */}
          <div className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
            <img src="/Checker.png" alt="profile" className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px]" />
            <div className="text-left flex-1 h-[47px] gap-1 opacity-100 ml-3">
              <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle w-full h-6 opacity-100 gap-1">
                dummyName
              </div>
              <div className="w-full h-[19px] gap-2 opacity-100">
                last message
              </div>
            </div>
          </div>
          
          {/* Chat Item 2 */}
          <div className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
            <img src="/Checker.png" alt="profile" className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px]" />
            <div className="text-left flex-1 h-[47px] gap-1 opacity-100 ml-3">
              <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle w-full h-6 opacity-100 gap-1">
                dummyName
              </div>
              <div className="w-full h-[19px] gap-2 opacity-100">
                last message
              </div>
            </div>
          </div>
          
          {/* Chat Item 3 */}
          <div className="mt-2 flex justify-between items-center w-full h-[66px] opacity-100 pt-2 pr-1 pb-2 gap-2.5 rounded-[20px]">
            <img src="/Checker.png" alt="profile" className="w-[50px] h-[50px] transform rotate-0 opacity-100 rounded-[48px]" />
            <div className="text-left flex-1 h-[47px] gap-1 opacity-100 ml-3">
              <div className="font-bold font-style-Bold text-xl leading-[100%] tracking-[0%] text-left align-middle w-full h-6 opacity-100 gap-1">
                dummyName
              </div>
              <div className="w-full h-[19px] gap-2 opacity-100">
                last message
              </div>
            </div>
          </div>
          
          {/* New Chat Button */}
          <div className="mt-5">
            <button className="mx-auto bg-[#f5f5f5] px-6 py-2 rounded-[6px] border-2 border-dotted border-[#8E8EE7] hover:bg-[#e8e8e8] transition-colors flex items-center justify-center gap-2">
              <img src="/chat_plus.svg" alt="new chat" className="w-5 h-5" />
              <span className="text-[#8E8EE7] font-['Pretendard'] font-normal text-sm leading-[100%] tracking-[0%]">새 채팅</span>
            </button>
          </div>
        </div>
        
        {/* Navigation Bar - iPhone 16 너비에 맞게 하단 고정 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
          <Navbar />
        </div>
      </div>
    </div>
  );
}
