import { createFileRoute } from '@tanstack/react-router'
import '../../style/shStyle.css';
import { Navbar } from '../../components/Navbar';

export const Route = createFileRoute('/home/practice')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="container sh-main-bg">
        <div className="sh-title">PRACTICE</div>
        <div className="sh-myprofile-container">
          <div className="sh-profile-title">QUIZ</div>
                     <button className="sh-profile" onClick={() => console.log('단어 퀴즈 클릭')}>
             <img src="/word-games.png" alt="word quiz" className="sh-round-image" />
             <div className="sh-wrap">
               <div className="sh-profile-name">단어 퀴즈</div>
             </div>
           </button>
                     <button className="sh-profile" onClick={() => console.log('문장 퀴즈 클릭')}>
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
                     <button className="sh-profile" onClick={() => console.log('학습 리포트 클릭')}>
             <img src="/books.png" alt="learning report" className="sh-round-image" />
             <div className="sh-wrap">
               <div className="sh-profile-name">나의 학습 리포트</div>
             </div>
           </button>
                     <button className="sh-profile" onClick={() => console.log('북마크 클릭')}>
             <img src="/backlog.png" alt="bookmarks" className="sh-round-image" />
             <div className="sh-wrap">
               <div className="sh-profile-name">나의 북마크</div>
             </div>
           </button>
        </div>
        
        {/* Navigation Bar */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[390px] max-w-[90vw] z-40">
          <Navbar />
        </div>
      </div>
    </div>
  )
}
