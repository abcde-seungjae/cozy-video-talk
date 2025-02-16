import React, { useEffect, useState } from "react";
import Sign from "./sub/sign";
import Connect from "./sub/connect";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore/lite";

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

  const [IsAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get(["isAuthenticated"], (result) => {
      if (result.isAuthenticated) {
        setIsAuthenticated(true);
      }
    });
  }, []);

  return (
    <div className="w-80 p-4">
      <h1 className="mb-2 text-xl font-bold">Cozy Video Talk</h1>
      {IsAuthenticated ? <Sign /> : <Connect />}
    </div>
  );
};

export default Popup;
