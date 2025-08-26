// Service Worker에서는 ES6 import를 사용할 수 없으므로 CDN 방식 사용
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAKPIC1b4S0etNxhIOMOChzL-JQkxlp2T0",
  authDomain: "sermo-a64b0.firebaseapp.com",
  projectId: "sermo-a64b0",
  storageBucket: "sermo-a64b0.firebasestorage.app",
  messagingSenderId: "892879396693",
  appId: "1:892879396693:web:5f5642e8c3594dff5fd9dc",
  measurementId: "G-40BQ3115P6"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('🎉 FCM 백그라운드 메시지 수신 성공!');
  console.log('📱 전체 payload:', payload);
  console.log('📝 알림 제목:', payload.notification?.title);
  console.log('📄 알림 내용:', payload.notification?.body);
  console.log('🔧 데이터:', payload.data);
  console.log('⏰ 수신 시간:', new Date().toLocaleString());

  // 시스템 알림 표시
  const notificationTitle = payload.notification?.title || '새 알림';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/sermo.png',
    badge: '/sermo.png',
    tag: 'fcm-notification',
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: '열기'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  console.log('🔔 시스템 알림 표시:', notificationTitle, notificationOptions);

  // 알림 표시
  const notification = self.registration.showNotification(notificationTitle, notificationOptions);

  // 알림 클릭 이벤트 처리
  self.addEventListener('notificationclick', (event) => {
    console.log('👆 알림 클릭됨:', event.action);
    event.notification.close();

    if (event.action === 'open' || !event.action) {
      // 앱 열기
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  });

  // 알림을 로컬 스토리지에 저장 (IndexedDB 사용)
  saveNotificationToStorage(payload);
});

// IndexedDB를 사용하여 알림 저장
function saveNotificationToStorage(payload) {
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
      message: payload.data?.message // BE 테스트 메시지용
    }
  };

  // IndexedDB에 저장
  const request = indexedDB.open('FCMNotifications', 1);
  
  request.onerror = (event) => {
    console.error('IndexedDB 오류:', event.target.error);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['notifications'], 'readwrite');
    const store = transaction.objectStore('notifications');
    
    store.add(notification);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('notifications')) {
      db.createObjectStore('notifications', { keyPath: 'id' });
    }
  };
}