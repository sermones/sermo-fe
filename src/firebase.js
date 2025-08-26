// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// FCM(푸시 알림)을 사용하기 위해 getMessaging을 추가합니다.
import { getMessaging, getToken } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);

// 다른 파일(예: App.js)에서 messaging 객체를 가져다 쓸 수 있도록 export 합니다.
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

// getAnalytics는 FCM 구현에 필수는 아니므로 주석 처리하거나 삭제해도 괜찮습니다.
// import { getAnalytics } from "firebase/analytics";
// const analytics = getAnalytics(app);