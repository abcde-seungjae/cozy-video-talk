import { doc, setDoc } from "firebase/firestore";
import { socketConnect } from "../../background";
import SocketManager from "../../util/socketManager";
import { firebaseDb } from "../../util/firebaseManager";

const socket = SocketManager.getInstance();

// 연결 버튼 클릭 이벤트
export const onConnectChange = () => {
  chrome.storage.session.get(["isConnected", "userInfo"], async (result) => {
    const isConnected = result.isConnected;
    const userInfo = result.userInfo;

    try {
      // isConnected 상태 변경
      chrome.storage.session.set({ isConnected: !isConnected });

      // Firebase에 연결결 정보 저장
      const connectDoc = doc(firebaseDb, "connect", userInfo.uid);

      const connectInfo = {
        action: "connectChange",
        isConnected: !isConnected,
      };

      // 사용자 존재시 업데이트, 없으면 새로 생성
      await setDoc(connectDoc, connectInfo);

      if (!isConnected) {
        socketConnect();
      } else {
        socket.disconnect();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to change connection state:", error.message);
      } else {
        console.error("Failed to change connection state:", error);
      }
    }
  });
};
