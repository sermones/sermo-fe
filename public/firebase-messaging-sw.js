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

// 백그라운드에서 푸시 메시지를 받았을 때 실행될 핸들러
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  // 사용자에게 보여줄 알림을 설정합니다.
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico", // public 폴더에 있는 아이콘 경로로 변경 가능
  };

  // 알림을 실제로 표시합니다.
  self.registration.showNotification(notificationTitle, notificationOptions);
});