import { doc, setDoc, getDoc } from "firebase/firestore";
import { firebase_db } from "../firebase";
import { connectSignalServer, startRTCConnection } from "../background";

// 연결 버튼 클릭 이벤트
export const onConnectChange = () => {
  chrome.storage.session.get(["isConnected", "userInfo"], async (result) => {
    const isConnected = result.isConnected;
    const userInfo = result.userInfo;

    try {
      // isConnected 상태 변경
      chrome.storage.session.set({ isConnected: !isConnected });

      // Firebase에 연결결 정보 저장
      const connectDoc = doc(firebase_db, "connect", userInfo.inviteCode);

      const userSocketId = await connectSignalServer(); // 시그널링 서버 연결

      const connectInfo = {
        action: "connectChange",
        userSocketId: userSocketId,
        isConnected: !isConnected,
      };

      // 사용자 존재시 업데이트, 없으면 새로 생성
      await setDoc(connectDoc, connectInfo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to change connection state:", error.message);
      } else {
        console.error("Failed to change connection state:", error);
      }
    }
  });
};

export const getConnectionData = (inviteCode: string) => {
  const connectDoc = doc(firebase_db, "connect", inviteCode);

  getDoc(connectDoc)
    .then((doc) => {
      const data = doc.data();
      if (data) {
        const socketId = data.userSocketId;
        startRTCConnection(socketId); // 소켓 ID를 사용해 연결 시작
      } else {
        console.error("No data found in document");
      }
    })
    .catch((error) => {
      console.error("Error getting document:", error);
    });
};
