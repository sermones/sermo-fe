import { createFileRoute } from '@tanstack/react-router'
import '../../style/shStyle.css';

export const Route = createFileRoute('/home/quests')({
  component: RouteComponent,
})

function RouteComponent() {
  const dailyQuests = [
    {
      id: 'bookmark-sentences',
      title: '문장 3개 북마크하기',
      icon: '/quest-bookmark.png', // 이미지 경로는 비워둠
      completed: false
    },
    {
      id: 'review-incorrect',
      title: '틀린 문제 복습',
      icon: '/quest-review.png', // 이미지 경로는 비워둠
      completed: false
    },
    {
      id: 'chat-5min',
      title: '5분 채팅',
      icon: '/quest-chat.png', // 이미지 경로는 비워둠
      completed: false
    }
  ]

  const streaks = {
    message: '축하해요! 연속 출석 14일을 달성했어요!',
    days: 14
  }

  return (
    <div>
      <div className="container sh-main-bg">
        <div className="sh-title">QUESTS</div>
        
        {/* DAILY QUESTS 섹션 */}
        <div className="sh-myprofile-container">
          <div className="sh-profile-title">DAILY QUESTS</div>
          {dailyQuests.map((quest) => (
            <button 
              key={quest.id} 
              className="sh-profile" 
              onClick={() => console.log(`${quest.title} 클릭`)}
            >
              <img src="/Frame 11.png" alt={quest.title} className="sh-round-image-rounded" />
              <div className="sh-wrap">
                <div className="sh-profile-name">{quest.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* STREAKS 섹션 */}
        <div className="sh-chatsprofile-container">
          <div className="sh-profile-title">STREAKS</div>
          <div className="sh-profile">
            <div className="sh-wrap">
              <div className="sh-streaks-message">{streaks.message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
