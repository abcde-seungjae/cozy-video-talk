import {
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth/cordova";
import { doc, setDoc } from "firebase/firestore/lite";
import { firebase_auth, firebase_db } from "./firebase";
import io from "socket.io-client";

// 전역 소켓 객체 생성
const socket = io(import.meta.env.VITE_SIGNALING_SERVER_URL as string);

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
              firebase_auth,
              credential
            );
            const user = userCredential.user;

            // 고유한 초대 코드 생성
            const inviteCode = generateInviteCode(10);

            // Firebase에 사용자 정보 저장
            const userDoc = doc(firebase_db, "users", user.uid);

            const userInfo = {
              uid: user.uid,
              nickname: user.displayName,
              inviteCode,
            };

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

// Connect On/Off 상태 변경
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "connectChange") {
    chrome.storage.session.get(["userInfo"], async (result) => {
      if (result.userInfo) {
        const userInfo = result.userInfo;
        // Firebase에 연결 정보 저장
        const connectDoc = doc(firebase_db, "connect", userInfo.uid);

        const connectInfo = {
          uid: userInfo.uid,
          isConnected: request.isConnected,
          ip: request.ip,
          port: request.port,
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

// 시그널링 서버 연결
export const connectSignalServer = () => {
  return new Promise<string>((resolve, reject) => {
    // 시그널링 서버에 연결 후 소켓 ID 받기
    socket.on("connect", () => {
      const userSocketId = socket.id || "";
      resolve(userSocketId); // 소켓 ID를 반환
    });

    // 연결 실패 시 reject 처리
    socket.on("connect_error", (error) => {
      reject("Socket Connection failed: " + error);
    });
  });
};

// RTC 연결 시작
export const startRTCConnection = (targetSocketId: string) => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:turn.xirsys.com:3478?transport=udp",
        username: import.meta.env.VITE_XIRSYS_USERNAME as string,
        credential: import.meta.env.VITE_XIRSYS_CREDENTIAL as string,
      },
      {
        urls: "turn:turn.xirsys.com:3478?transport=tcp",
        username: import.meta.env.VITE_XIRSYS_USERNAME as string,
        credential: import.meta.env.VITE_XIRSYS_CREDENTIAL as string,
      },
    ],
  });

  // 상대방의 소켓 ID를 통해 Offer 전송
  peerConnection
    .createOffer()
    .then((offer) => {
      return peerConnection.setLocalDescription(offer);
    })
    .then(() => {
      // 소켓을 통해 상대방에게 Offer 전송
      socket.emit("offer", peerConnection.localDescription, targetSocketId);
    });

  // ICE Candidate 처리
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate, targetSocketId);
    }
  };

  peerConnection.ontrack = (event) => {
    const remoteStream = event.streams[0];
    // remoteStream을 통해 상대방 비디오 출력 처리
  };

  // 로컬 미디어 스트림 처리
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((localStream) => {
      localStream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, localStream));
    });
};
