import SocketManager from "../socketManager";

const socket = SocketManager.getInstance();

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

    return remoteStream;
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
