"use client";

import React, { useState } from "react";
import {
  useSimpleWebSocket,
  useSimpleWebSocketList,
} from "@/hooks/useSimpleWebSocket";

// Component test cho single data
const SingleDataTest: React.FC = () => {
  const [wsUrl, setWsUrl] = useState("http://localhost:8085/websocket");
  const [topic, setTopic] = useState("/topic/test");
  const [enabled, setEnabled] = useState(false);

  const { data, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocket({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  const [messageDestination, setMessageDestination] = useState("/app/test");
  const [messageContent, setMessageContent] = useState("");

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      sendMessage(messageDestination, {
        message: messageContent,
        timestamp: new Date().toISOString(),
      });
      setMessageContent("");
    }
  };

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        🔗 Kết nối WebSocket đơn giản
      </h2>

      {/* Cấu hình kết nối */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            WebSocket URL:
          </label>
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="http://localhost:8080/ws"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Topic để subscribe:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="/topic/test"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-4 py-2 rounded font-medium ${
              enabled
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {enabled ? "Ngắt kết nối" : "Kết nối"}
          </button>

          {enabled && (
            <button
              onClick={reconnect}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kết nối lại
            </button>
          )}
        </div>
      </div>

      {/* Trạng thái kết nối */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="font-medium">
            {isConnected ? "✅ Đã kết nối" : "❌ Chưa kết nối"}
          </span>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            ❌ Lỗi: {error}
          </div>
        )}
      </div>

      {/* Gửi message */}
      {isConnected && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-3">📤 Gửi message</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={messageDestination}
              onChange={(e) => setMessageDestination(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Destination (e.g., /app/test)"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-2 border rounded"
                placeholder="Nội dung message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hiển thị dữ liệu nhận được */}
      <div>
        <h3 className="font-medium mb-3">📨 Dữ liệu nhận được:</h3>
        {data ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
            <div className="text-xs text-gray-500 mt-2">
              Nhận lúc: {new Date().toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border rounded text-gray-500">
            Chưa có dữ liệu...
          </div>
        )}
      </div>
    </div>
  );
};

// Component test cho list data
const ListDataTest: React.FC = () => {
  const [wsUrl, setWsUrl] = useState("http://localhost:8080/ws");
  const [topic, setTopic] = useState("/topic/data-list");
  const [enabled, setEnabled] = useState(false);

  const { dataList, lastUpdate, isConnected, error, sendMessage, reconnect } =
    useSimpleWebSocketList({
      url: wsUrl,
      topic: topic,
      enabled: enabled,
    });

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        📋 Danh sách dữ liệu realtime
      </h2>

      {/* Cấu hình kết nối */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            WebSocket URL:
          </label>
          <input
            type="text"
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="http://localhost:8080/ws"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Topic cho danh sách:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="/topic/data-list"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setEnabled(!enabled)}
            className={`px-4 py-2 rounded font-medium ${
              enabled
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {enabled ? "Ngắt kết nối" : "Kết nối"}
          </button>

          {enabled && (
            <button
              onClick={reconnect}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kết nối lại
            </button>
          )}
        </div>
      </div>

      {/* Trạng thái kết nối */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="font-medium">
            {isConnected ? "✅ Đã kết nối" : "❌ Chưa kết nối"}
          </span>
          <span className="text-sm text-gray-500">
            ({dataList.length} items)
          </span>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            ❌ Lỗi: {error}
          </div>
        )}
      </div>

      {/* Last update info */}
      {lastUpdate && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm">
            <strong>Cập nhật cuối:</strong> {lastUpdate.action} lúc{" "}
            {new Date(lastUpdate.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Hiển thị danh sách */}
      <div>
        <h3 className="font-medium mb-3">📋 Danh sách dữ liệu:</h3>
        {dataList.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {dataList.map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 border rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border rounded text-gray-500">
            Danh sách trống...
          </div>
        )}
      </div>
    </div>
  );
};

// Main component
const SimpleWebSocketTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"single" | "list">("single");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        🚀 Test WebSocket với Spring Boot
      </h1>

      {/* Tab navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "single"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Dữ liệu đơn
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "list"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Danh sách dữ liệu
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "single" && <SingleDataTest />}
      {activeTab === "list" && <ListDataTest />}

      {/* Hướng dẫn */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-medium mb-2">💡 Hướng dẫn:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Đảm bảo Spring Boot server đang chạy trên port 8080</li>
          <li>
            • Cấu hình STOMP endpoint tại <code>/ws</code>
          </li>
          <li>
            • Topic để test: <code>/topic/test</code> hoặc{" "}
            <code>/topic/data-list</code>
          </li>
          <li>
            • Destination để gửi: <code>/app/test</code>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleWebSocketTest;
