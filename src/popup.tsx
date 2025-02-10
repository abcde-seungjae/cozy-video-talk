import React from "react";
import { createRoot } from "react-dom/client";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore/lite";

import GoogleBtn from "./assets/image/google_btn.svg";

const Popup: React.FC = () => {
  // firebase config 불러오기
  // const firebaseConfig = {
  //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  //   authDomain: import.meta.env.VITE_FIREBAE_AUTH_DOMAIN,
  //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
  //   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  // };

  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const db = getFirestore(app);
  //const analytics = getAnalytics(app);

  const google_login_click = () => {
    // background.js로 로그인 요청
    chrome.runtime.sendMessage(
      { action: "loginWithGoogle" },
      function (response) {
        // 로그인 후 처리할 로직 (access_token 등)
        console.log("Logged in successfully!", response);
      }
    );
  };

  return (
    <div className="w-80 p-4">
      <h1 className="mb-2 text-xl font-bold">Cozy Video Talk</h1>
      <button onClick={google_login_click} className="cursor-pointer">
        <img src={GoogleBtn} />
      </button>
    </div>
  );
};

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(<Popup />);
