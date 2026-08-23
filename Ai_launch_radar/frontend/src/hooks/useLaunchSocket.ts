import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Launch } from "../types/launch";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/**
 * One socket connection for the whole app lifetime. Exposes connection
 * status (drives the header's live indicator) and hands back each
 * "launch:new" event as it arrives — the caller decides what to do
 * with it (Feed prepends it to the list).
 */
export function useLaunchSocket(onNewLaunch: (launch: Launch) => void, enabled: boolean) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const handlerRef = useRef(onNewLaunch);
  handlerRef.current = onNewLaunch;

  useEffect(() => {
    if (!enabled) return;

    const token = localStorage.getItem("radar_token");
    const socket = io(API_BASE, {
      transports: ["websocket"],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    socket.on("launch:new", (launch: Launch) => handlerRef.current(launch));

    return () => {
      socket.disconnect();
    };
  }, [enabled]);

  return { connected };
}
