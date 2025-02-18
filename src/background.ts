import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth/cordova";
import { doc, getFirestore, setDoc } from "firebase/firestore/lite";

// firebase config 불러오기
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBAE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "loginWithGoogle") {
    chrome.identity.getAuthToken(
      {
        interactive: true,
      },
      async (accessToken) => {
        if (chrome.runtime.lastError) {
          console.error("error: " + chrome.runtime.lastError);
          sendResponse({ success: false, error: chrome.runtime.lastError });
        } else {
          // Firebase에 사용자 정보 저장
          try {
            if (accessToken) {
              console.log("Access Token:", accessToken);

              // Firebase Authentication을 사용하여 로그인
              const credential = GoogleAuthProvider.credential(
                null,
                accessToken
              );
              const userCredential = await signInWithCredential(
                auth,
                credential
              );
              const user = userCredential.user;

              // 고유한 초대 코드 생성
              const inviteCode = generateInviteCode(10);

              // Firebase에 사용자 정보 저장
              const userDoc = doc(db, "users", user.uid);

              const connectInfo = {
                uid: user.uid,
                nickname: user.displayName,
                inviteCode,
              };

              // 사용자 존재시 업데이트, 없으면 새로 생성
              await setDoc(userDoc, connectInfo);

              // 로그인 성공
              sendResponse({ success: true, response: connectInfo });
            }
          } catch (error) {
            console.error("Firebase error: " + error);
            sendResponse({ success: false, error: error });
          }
        }
      }
    );
    return true;
  }
});

const generateInviteCode = (length: number) => {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
