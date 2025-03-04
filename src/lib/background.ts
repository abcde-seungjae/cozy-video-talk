import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth/cordova";
import { generateInviteCode } from "./util/function";
import SocketManager from "./util/socketManager";
import { startRTCConnection } from "./util/webRTC";
import { doc, setDoc } from "@firebase/firestore";
import { firebaseAuth, firebaseDb } from "./util/firebaseManager";

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "loginWithGoogle") {
    chrome.identity.getAuthToken({ interactive: true }, async (accessToken) => {
      if (chrome.runtime.lastError) {
        console.error("error: " + chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError });
      } else {
        // Firebase에 사용자 정보 저장
        try {
          if (accessToken) {
            // Firebase Authentication을 사용하여 로그인
            const credential = GoogleAuthProvider.credential(null, accessToken);
            const userCredential = await signInWithCredential(
              firebaseAuth,
              credential
            );
            const user = userCredential.user;

            // Firebase에 사용자 정보 저장
            const userDoc = doc(firebaseDb, "users", user.uid);

            const userInfo = {
              email: user.email,
              nickname: user.displayName,
            };
            console.error(userInfo);

            // 사용자 존재시 업데이트, 없으면 새로 생성
            await setDoc(userDoc, userInfo);

            // 로그인 성공
            sendResponse({ success: true, userInfo: userInfo });
          }
        } catch (error) {
          console.error("Firebase error: " + error);
          sendResponse({ success: false, error: error });
        }
      }
    });
    return true;
  }
});

// Connect On/Off 상태 변경
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "connectChange") {
    chrome.storage.session.get(["userInfo"], async (result) => {
      if (result.userInfo) {
        const userInfo = result.userInfo;
        // Firebase에 연결 정보 저장
        const connectDoc = doc(firebaseDb, "connect", userInfo.uid);

        const connectInfo = {
          uid: userInfo.uid,
          isConnected: request.isConnected,
          userSocketId: request.userSocketId,
        };

        // uid 존재시 업데이트, 없으면 새로 생성
        await setDoc(connectDoc, connectInfo);

        // 로그인 성공
        sendResponse({ success: true, response: connectInfo });
      }
    });
  }
  return true;
});

export const socketConnect = () => {
  const socket = SocketManager.getInstance();
  // 고유한 초대 코드 생성
  const inviteCode = generateInviteCode(10);

  socket.connect();

  socket.emit("register-code", { code: inviteCode }, (response: unknown) => {
    console.log(response);
  });

  socket.emit("join-with-code", { code: "123456" });

  socket.on("connect-to-peer", (data: unknown) => {
    const { targetSocketId } = data as { targetSocketId: string };

    startRTCConnection(targetSocketId);
  });
};
