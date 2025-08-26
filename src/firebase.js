// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKPIC1b4S0etNxhIOMOChzL-JQkxlp2T0",
  authDomain: "sermo-a64b0.firebaseapp.com",
  projectId: "sermo-a64b0",
  storageBucket: "sermo-a64b0.appspot.com",
  messagingSenderId: "892879396693",
  appId: "1:892879396693:web:5f5642e8c3594dff5fd9dc",
  measurementId: "G-40BQ3115P6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Get messaging instance
export const messaging = getMessaging(app);

// VAPID 키
export const vapidKey = "BDGl0TAFTuLYD6Mzy-QtCo8xTr2itqHmZKsF9D8sg7CchzVBJUHNp2WJVFaucSrjiIPNGM5sLNOXT20iCXg8l7Q";

// FCM 토큰 발급 함수
export const getFCMToken = async () => {
  try {
    console.log('🔄 FCM 토큰 발급 시작...');
    console.log('📱 messaging 객체:', messaging);
    console.log('🔑 vapidKey:', vapidKey);
    
    const token = await getToken(messaging, { vapidKey });
    console.log('📱 getToken 결과:', token);
    
    if (token) {
      console.log('✅ FCM 토큰 발급 성공:', token);
      return token;
    } else {
      console.log('❌ FCM 토큰 발급 실패: 토큰이 null');
      return null;
    }
  } catch (error) {
    console.error('❌ FCM 토큰 발급 중 에러:', error);
    console.error('❌ 에러 상세 정보:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return null;
  }
};

// FCM 메시지 리스너 설정 함수
export const setupFCMListener = () => {
  try {
    console.log('🔄 FCM 메시지 리스너 설정 시작...');
    
    // 포그라운드 메시지 수신 리스너
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🎉 FCM 포그라운드 메시지 수신 성공!');
      console.log('📱 전체 payload:', payload);
      console.log('📝 알림 제목:', payload.notification?.title);
      console.log('📄 알림 내용:', payload.notification?.body);
      console.log('🔧 데이터:', payload.data);
      console.log('⏰ 수신 시간:', new Date().toLocaleString());
      
      // 알림 객체 생성
      const notification = {
        id: `fcm_${Date.now()}`,
        title: payload.notification?.title || '새 알림',
        body: payload.notification?.body || '',
        timestamp: Date.now(),
        type: payload.data?.type === 'chat_message' ? 'chat_message' : 'test_message',
        data: {
          chatbot_name: payload.data?.chatbot_name,
          chatbot_id: payload.data?.chatbot_id,
          chat_message: payload.data?.chat_message,
          message: payload.data?.message
        }
      };

      console.log('💾 저장할 알림 객체:', notification);

      // IndexedDB에 알림 저장
      saveNotificationToIndexedDB(notification);
      
      // 로컬 스토리지에도 저장
      saveNotificationToLocalStorage(notification);
      
      // NotificationContext에 이벤트 전송
      window.dispatchEvent(new CustomEvent('fcm-message-received', {
        detail: { payload, notification }
      }));
      
      // 수동으로 시스템 알림 표시
      if (payload.notification && Notification.permission === 'granted') {
        const systemNotification = new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/sermo.png',
          badge: '/sermo.png',
          tag: 'fcm-notification',
          data: payload.data || {}
        });
        
        console.log('🔔 시스템 알림 표시 완료');
        
        // 알림 클릭 이벤트
        systemNotification.onclick = () => {
          console.log('👆 FCM 알림 클릭됨');
          window.focus();
          systemNotification.close();
        };
      }
    });
    
    console.log('✅ FCM 메시지 리스너 설정 완료');
    return unsubscribe;
  } catch (error) {
    console.error('❌ FCM 메시지 리스너 설정 실패:', error);
    return null;
  }
};

// IndexedDB에 알림 저장하는 함수
const saveNotificationToIndexedDB = (notification) => {
  try {
    console.log('💾 IndexedDB에 알림 저장 시작...');
    
    const request = indexedDB.open('FCMNotifications', 1);
    
    request.onerror = (event) => {
      console.error('❌ IndexedDB 열기 실패:', event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      if (db && db.objectStoreNames.contains('notifications')) {
        const transaction = db.transaction(['notifications'], 'readwrite');
        const store = transaction.objectStore('notifications');
        
        const addRequest = store.add(notification);
        
        addRequest.onsuccess = () => {
          console.log('✅ IndexedDB에 알림 저장 성공:', notification.id);
        };
        
        addRequest.onerror = (event) => {
          console.error('❌ IndexedDB 알림 저장 실패:', event.target.error);
        };
      } else {
        console.log('❌ IndexedDB에 notifications 스토어가 없음');
      }
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id' });
        console.log('✅ IndexedDB notifications 스토어 생성 완료');
      }
    };
  } catch (error) {
    console.error('❌ IndexedDB 저장 중 에러:', error);
  }
};

// 로컬 스토리지에 알림 저장하는 함수
const saveNotificationToLocalStorage = (notification) => {
  try {
    console.log('💾 로컬 스토리지에 알림 저장 시작...');
    
    const existingNotifications = localStorage.getItem('fcm_notifications');
    const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
    
    // 새 알림을 맨 앞에 추가
    notifications.unshift(notification);
    
    // 최대 100개까지만 유지
    if (notifications.length > 100) {
      notifications.splice(100);
    }
    
    localStorage.setItem('fcm_notifications', JSON.stringify(notifications));
    console.log('✅ 로컬 스토리지에 알림 저장 성공:', notification.id);
    console.log('📊 총 알림 개수:', notifications.length);
  } catch (error) {
    console.error('❌ 로컬 스토리지 저장 중 에러:', error);
  }
};

// 브라우저 콘솔에서 테스트할 수 있도록 전역 객체로 노출
if (typeof window !== 'undefined') {
  // Firebase 객체들을 window에 노출
  window.firebase = {
    app: app,
    messaging: messaging,
    getMessaging: getMessaging,
    getToken: getFCMToken,
    onMessage: onMessage,
    setupFCMListener: setupFCMListener
  };
  
  // 개별 객체들도 노출
  window.app = app;
  window.messaging = messaging;
  window.setupFCMListener = setupFCMListener;
  
  // 자동으로 FCM 리스너 설정
  const unsubscribe = setupFCMListener();
  if (unsubscribe) {
    window.fcmUnsubscribe = unsubscribe;
    console.log('✅ 자동 FCM 리스너 설정 완료');
  }
  
  console.log('✅ Firebase 객체를 window에 노출 완료');
  console.log('window.firebase:', window.firebase);
  console.log('window.messaging:', window.messaging);
  console.log('window.setupFCMListener:', typeof window.setupFCMListener);
}