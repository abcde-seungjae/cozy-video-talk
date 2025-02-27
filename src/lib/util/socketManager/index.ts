import io, { Socket } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager;

  private socket: Socket;

  private constructor() {
    this.socket = io(import.meta.env.VITE_SIGNALING_SERVER_URL as string);
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }

    return SocketManager.instance;
  }

  // 소켓 연결
  public connect(): void {
    this.socket.connect();
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  // 소켓 아이디 반환
  public getSocketId(): string {
    return this.socket?.id || "";
  }

  public on(event: string, callback: (data: unknown) => void) {
    this.socket.on(event, callback);
  }

  public emit(event: string, ...args: unknown[]) {
    this.socket.emit(event, ...args);
  }
}

export default SocketManager;
