"use client";

import * as React from "react";
import { ChatButton } from "@/components/ui/chat-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import TypingIndicator from "@/components/ui/typing-indicator";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
  onMinimize?: () => void;
  className?: string;
  placeholder?: string;
  title?: string;
  isLoading?: boolean;
  showMinimize?: boolean;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  onClose,
  onMinimize,
  className,
  placeholder = "Nhập tin nhắn...",
  title = "Trò chuyện với AI",
  isLoading = false,
  showMinimize = true,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col",
        "w-80 h-96",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-calsans text-sm font-medium text-gray-900">
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {showMinimize && onMinimize && (
            <ChatButton
              variant="ghost"
              size="sm"
              iconType="minimize"
              onClick={onMinimize}
              className="h-6 w-6"
            />
          )}
          <ChatButton
            variant="ghost"
            size="sm"
            iconType="close"
            onClick={onClose}
            className="h-6 w-6"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm font-questrial mt-8">
            Chào bạn! Tôi có thể giúp gì cho bạn?
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-3 py-2 rounded-lg text-sm font-questrial",
                  message.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                )}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg rounded-bl-sm text-sm">
              <TypingIndicator variant="text" text="" size="sm" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 text-sm font-questrial"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputValue.trim() || isLoading}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
