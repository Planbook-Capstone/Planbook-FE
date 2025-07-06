"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketData<T = any> {
  data: T;
  timestamp: number;
}

interface UseSimpleWebSocketProps {
  url: string;
  topic: string;
  enabled?: boolean;
}

interface UseSimpleWebSocketReturn<T = any> {
  data: T | null;
  isConnected: boolean;
  error: string | null;
  sendMessage: (destination: string, message: any) => void;
  reconnect: () => void;
}

/**
 * Hook đơn giản để kết nối WebSocket và lấy dữ liệu realtime từ Spring Boot
 */
export const useSimpleWebSocket = <T = any>({
  url,
  topic,
  enabled = true,
}: UseSimpleWebSocketProps): UseSimpleWebSocketReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<Client | null>(null);

  // Kết nối WebSocket
  const connect = useCallback(() => {
    if (!enabled || clientRef.current?.connected) {
      return;
    }

    try {
      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${url}?token=${localStorage.getItem("token")}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.log("WebSocket:", str),

        onConnect: () => {
          console.log("✅ WebSocket connected to:", url);
          setIsConnected(true);
          setError(null);

          // Subscribe to topic
          client.subscribe(topic, (message: IMessage) => {
            try {
              console.log(message);
              const parsedData = JSON.parse(message.body);
              console.log("📨 Received data:", parsedData);
              setData(parsedData);
            } catch (err) {
              console.error("❌ Error parsing message:", err);
              setError("Error parsing received data");
            }
          });
        },

        onDisconnect: () => {
          console.log("❌ WebSocket disconnected");
          setIsConnected(false);
        },

        onStompError: (frame) => {
          console.error("❌ STOMP Error:", frame);
          setError(
            `Connection error: ${frame.headers.message || "Unknown error"}`
          );
          setIsConnected(false);
        },

        onWebSocketError: (event) => {
          console.error("❌ WebSocket Error:", event);
          setError("WebSocket connection failed");
          setIsConnected(false);
        },
      });

      clientRef.current = client;
      client.activate();
    } catch (err) {
      console.error("❌ Failed to create WebSocket connection:", err);
      setError("Failed to initialize WebSocket");
    }
  }, [url, topic, enabled]);

  // Ngắt kết nối
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setIsConnected(false);
    setData(null);
    setError(null);
  }, []);

  // Gửi message
  const sendMessage = useCallback((destination: string, message: any) => {
    if (!clientRef.current?.connected) {
      console.warn("⚠️ WebSocket not connected. Cannot send message.");
      return;
    }

    try {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
      });
      console.log("📤 Message sent to:", destination, message);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      setError("Failed to send message");
    }
  }, []);

  // Reconnect function
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  }, [disconnect, connect]);

  // Auto connect/disconnect
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    sendMessage,
    reconnect,
  };
};

/**
 * Hook để lấy danh sách dữ liệu realtime (cho trường hợp nhận array data)
 */
export const useSimpleWebSocketList = <T = any>({
  url,
  topic,
  enabled = true,
}: UseSimpleWebSocketProps) => {
  const [dataList, setDataList] = useState<T[]>([]);
  const [lastUpdate, setLastUpdate] = useState<{
    action: "CREATE" | "UPDATE" | "DELETE";
    item: T;
    timestamp: number;
  } | null>(null);

  const { isConnected, error, sendMessage, reconnect } = useSimpleWebSocket<{
    action: "CREATE" | "UPDATE" | "DELETE" | "INIT";
    data: T | T[];
    id?: string;
  }>({
    url,
    topic,
    enabled,
  });

  const webSocketResult = useSimpleWebSocket<{
    action: "CREATE" | "UPDATE" | "DELETE" | "INIT";
    data: T | T[];
    id?: string;
  }>({
    url,
    topic,
    enabled,
  });

  // Xử lý data updates
  useEffect(() => {
    if (!webSocketResult.data) return;

    const { action, data, id } = webSocketResult.data;
    const timestamp = Date.now();

    switch (action) {
      case "INIT":
        // Khởi tạo danh sách
        if (Array.isArray(data)) {
          setDataList(data);
        }
        break;

      case "CREATE":
        // Thêm item mới
        if (!Array.isArray(data)) {
          setDataList((prev) => [...prev, data]);
          setLastUpdate({ action, item: data, timestamp });
        }
        break;

      case "UPDATE":
        // Cập nhật item
        if (!Array.isArray(data)) {
          setDataList((prev) =>
            prev.map((item) =>
              (item as any).id === (data as any).id ? data : item
            )
          );
          setLastUpdate({ action, item: data, timestamp });
        }
        break;

      case "DELETE":
        // Xóa item
        if (id) {
          setDataList((prev) => prev.filter((item) => (item as any).id !== id));
          setLastUpdate({ action, item: { id } as T, timestamp });
        }
        break;
    }
  }, [webSocketResult.data]);

  return {
    dataList,
    lastUpdate,
    isConnected: webSocketResult.isConnected,
    error: webSocketResult.error,
    sendMessage,
    reconnect,
  };
};
