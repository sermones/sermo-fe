import { createFileRoute } from '@tanstack/react-router';
import '../../style/shStyle.css';

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="container sh-main-bg">
        <div className="sh-title">HOME</div>
        <div className="sh-myprofile-container">
          <div className="sh-profile-title">MY</div>
          <div className="sh-profile">
            <img src="../public/Checker.png" alt="profile" className="sh-round-image" />
            <div className="sh-profile-name">dummyName</div>
            <div className="sh-profile-imo"></div>
            <div className="sh-profile-imo">
              <div className="sh-settings-img"></div>
            </div>
          </div>
        </div>
        <div className="sh-chatsprofile-container">
          <div className="sh-profile-title">CHATS</div>
          <div className="sh-profile">
            <img src="../public/Checker.png" alt="profile" className="sh-round-image" />
            <div className="sh-wrap">
              <div className="sh-profile-name">dummyName</div>
              <div className="sh-message">last message</div>
            </div>
          </div>
          <div className="sh-profile">
            <img src="../public/Checker.png" alt="profile" className="sh-round-image" />
            <div className="sh-wrap">
              <div className="sh-profile-name">dummyName</div>
              <div className="sh-message">last message</div>
            </div>
          </div>
          <div className="sh-profile">
            <img src="../public/Checker.png" alt="profile" className="sh-round-image" />
            <div className="sh-wrap">
              <div className="sh-profile-name">dummyName</div>
              <div className="sh-message">last message</div>
            </div>
          </div>
          <div className="sh-newchat-container">
            <div className="sh-newchat-btn">테스트</div>
          </div>
        </div>
      </div>
    </div>
  );
}
