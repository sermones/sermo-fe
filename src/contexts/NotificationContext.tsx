import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { app } from '../firebase';
import NotificationToast from '../components/NotificationToast';

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

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  // 로컬 스토리지에서 알림 불러오기
  useEffect(() => {
    const savedNotifications = localStorage.getItem('fcm_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // 알림을 로컬 스토리지에 저장
  const saveNotificationsToStorage = (newNotifications: Notification[]) => {
    localStorage.setItem('fcm_notifications', JSON.stringify(newNotifications));
  };

  // 알림 추가
  const addNotification = (notification: Notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || `notification_${Date.now()}`,
      timestamp: notification.timestamp || Date.now()
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveNotificationsToStorage(updated);
      return updated;
    });

    // 토스트 알림 표시
    setActiveToast(newNotification);
  };

  // 알림 제거
  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  // 모든 알림 제거
  const clearNotifications = () => {
    setNotifications([]);
    saveNotificationsToStorage([]);
  };

  // FCM 포그라운드 메시지 수신 처리
  useEffect(() => {
    console.log('🔄 FCM 초기화 시작...');
    
    // firebase.js에서 자동으로 설정된 리스너 사용
    const handleFCMMessage = (event: CustomEvent) => {
      const payload = event.detail.payload;
      console.log('🎉 FCM 메시지 이벤트 수신 성공!');
      console.log('📱 전체 payload:', payload);
      console.log('📝 알림 제목:', payload.notification?.title);
      console.log('📄 알림 내용:', payload.notification?.body);
      console.log('🔧 데이터:', payload.data);
      console.log('⏰ 수신 시간:', new Date().toLocaleString());
      
      const notification: Notification = {
        id: `fcm_${Date.now()}`,
        title: payload.notification?.title || '새 알림',
        body: payload.notification?.body || '',
        timestamp: Date.now(),
        type: payload.data?.type === 'chat_message' ? 'chat_message' : 'test_message',
        data: {
          chatbot_name: payload.data?.chatbot_name,
          chatbot_id: payload.data?.chatbot_id,
          chat_message: payload.data?.chat_message,
          message: payload.data?.message // BE 테스트 메시지용
        }
      };

      console.log('💾 저장할 알림 객체:', notification);
      addNotification(notification);
      
      // notifications.tsx에 실시간 업데이트 이벤트 전송
      window.dispatchEvent(new CustomEvent('fcm-notification-received', {
        detail: { notification }
      }));
    };

    // FCM 메시지 수신 이벤트 리스너 등록
    window.addEventListener('fcm-message-received', handleFCMMessage as EventListener);
    
    console.log('✅ FCM 메시지 이벤트 리스너 등록 성공');
    
    return () => {
      console.log('🔄 FCM 메시지 이벤트 리스너 해제');
      window.removeEventListener('fcm-message-received', handleFCMMessage as EventListener);
    };
  }, []);

  // 토스트 알림 닫기
  const handleToastClose = () => {
    setActiveToast(null);
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* 커스텀 토스트 알림 */}
      {activeToast && (
        <NotificationToast
          title={activeToast.title}
          body={activeToast.body}
          type={activeToast.type}
          data={activeToast.data}
          onClose={handleToastClose}
          duration={5000}
        />
      )}
    </NotificationContext.Provider>
  );
};
