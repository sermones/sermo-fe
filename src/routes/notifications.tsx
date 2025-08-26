import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  type: 'chat_message' | 'test_message';
  data?: {
    chatbot_name?: string;
    chatbot_id?: string;
    chat_message?: string;
    message?: string; // BE 테스트 메시지용
  };
}

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // IndexedDB에서 알림 데이터 불러오기
  const loadNotifications = async () => {
    try {
      console.log('🔄 알림 데이터 불러오기 시작...');
      
      const request = indexedDB.open('FCMNotifications', 1);
      
      request.onerror = (event) => {
        const target = event.target as IDBOpenDBRequest;
        console.error('IndexedDB 오류:', target.error);
        setIsLoading(false);
      };

      request.onsuccess = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        if (db && db.objectStoreNames.contains('notifications')) {
          const transaction = db.transaction(['notifications'], 'readonly');
          const store = transaction.objectStore('notifications');
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const dbNotifications = getAllRequest.result || [];
            console.log('📱 IndexedDB에서 불러온 알림:', dbNotifications);
            
            // 로컬 스토리지의 알림과 병합
            const localNotifications = localStorage.getItem('fcm_notifications');
            const local = localNotifications ? JSON.parse(localNotifications) : [];
            console.log('📱 로컬 스토리지에서 불러온 알림:', local);
            
            // 중복 제거하고 시간순 정렬
            const allNotifications = [...dbNotifications, ...local];
            const uniqueNotifications = allNotifications.filter((notification, index, self) =>
              index === self.findIndex(n => n.id === notification.id)
            );
            
            const sortedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp);
            console.log('📱 최종 알림 목록:', sortedNotifications);
            
            setNotifications(sortedNotifications);
            setIsLoading(false);
          };
        } else {
          console.log('❌ IndexedDB에 notifications 스토어가 없음');
          setIsLoading(false);
        }
      };

      request.onupgradeneeded = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        if (db && !db.objectStoreNames.contains('notifications')) {
          db.createObjectStore('notifications', { keyPath: 'id' });
          console.log('✅ IndexedDB notifications 스토어 생성 완료');
        }
      };
    } catch (error) {
      console.error('알림 불러오기 오류:', error);
      // IndexedDB 실패 시 로컬 스토리지에서만 불러오기
      const savedNotifications = localStorage.getItem('fcm_notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    
    // 실시간 업데이트를 위한 이벤트 리스너
    const handleStorageChange = () => {
      console.log('🔄 로컬 스토리지 변경 감지, 알림 목록 새로고침');
      loadNotifications();
    };

    // 로컬 스토리지 변경 감지
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트로 FCM 메시지 수신 시 알림 목록 새로고침
    const handleFCMNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 FCM 알림 수신됨, 알림 목록 새로고침 중...', customEvent.detail);
      loadNotifications();
    };

    // FCM 알림 수신 이벤트 리스너
    const handleFCMMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🔄 FCM 메시지 수신됨, 알림 목록 새로고침 중...', customEvent.detail);
      loadNotifications();
    };

    window.addEventListener('fcm-notification-received', handleFCMNotification);
    window.addEventListener('fcm-message-received', handleFCMMessage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fcm-notification-received', handleFCMNotification);
      window.removeEventListener('fcm-message-received', handleFCMMessage);
    };
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return '방금 전';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) { // 24시간
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}시간 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'chat_message' && notification.data?.chatbot_id) {
      // 채팅 화면으로 이동
      navigate({
        to: '/chat',
        search: {
          chatbotId: notification.data.chatbot_id,
          chatbotName: notification.data.chatbot_name || 'AI 어시스턴트',
          chatbotImage: '',
          chatbotDetails: ''
        }
      });
    } else if (notification.type === 'test_message') {
      // 테스트 메시지는 클릭해도 아무 동작 안함
      console.log('🧪 테스트 메시지 클릭됨:', notification);
    }
  };

  const clearAllNotifications = async () => {
    try {
      console.log('🗑️ 모든 알림 삭제 시작...');
      
      // IndexedDB에서 모든 알림 삭제
      const request = indexedDB.open('FCMNotifications', 1);
      request.onsuccess = (event) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        if (db && db.objectStoreNames.contains('notifications')) {
          const transaction = db.transaction(['notifications'], 'readwrite');
          const store = transaction.objectStore('notifications');
          const clearRequest = store.clear();
          
          clearRequest.onsuccess = () => {
            console.log('✅ IndexedDB 알림 삭제 완료');
            
            // 로컬 스토리지도 클리어
            localStorage.removeItem('fcm_notifications');
            console.log('✅ 로컬 스토리지 알림 삭제 완료');
            
            setNotifications([]);
            console.log('✅ 상태 업데이트 완료');
          };
        }
      };
    } catch (error) {
      console.error('알림 삭제 오류:', error);
    }
  };

  // 수동 새로고침 함수
  const refreshNotifications = () => {
    console.log('🔄 수동 새로고침 시작...');
    setIsLoading(true);
    loadNotifications();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">알림을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">알림</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshNotifications}
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              새로고침
            </button>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                모두 지우기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">📱</div>
            <p className="text-gray-500">아직 알림이 없습니다</p>
            <p className="text-gray-400 text-sm mt-2">BE에서 테스트 메시지를 보내면 여기에 표시됩니다</p>
            <button
              onClick={refreshNotifications}
              className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              새로고침
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                  notification.type === 'test_message' ? 'border-l-4 border-l-purple-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    {notification.type === 'test_message' && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        테스트
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(notification.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {notification.body}
                </p>
                
                {/* 테스트 메시지 추가 정보 표시 */}
                {notification.type === 'test_message' && notification.data?.message && (
                  <div className="mt-2 p-2 bg-purple-50 rounded border-l-2 border-purple-300">
                    <p className="text-xs text-purple-700 font-medium">
                      💬 {notification.data.message}
                    </p>
                  </div>
                )}
                
                {/* 채팅봇 정보 표시 */}
                {notification.data?.chatbot_name && (
                  <div className="mt-2 text-xs text-purple-600 font-medium">
                    💬 {notification.data.chatbot_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
});
