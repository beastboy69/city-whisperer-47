import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(token?: string) {
  socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", {
    auth: token ? { token } : undefined,
  });
  return socket;
}

export function getSocket() {
  return socket;
}


