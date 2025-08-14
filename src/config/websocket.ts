export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:8080/ws",
  topic: "/user/queue/notifications",
};
