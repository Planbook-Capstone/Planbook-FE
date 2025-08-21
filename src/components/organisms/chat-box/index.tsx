"use client";

import * as React from "react";
import ChatToggle from "@/components/molecules/chat-toggle";
import ChatWindow, { Message } from "@/components/molecules/chat-window";
import ChatSettings, {
  ChatPosition,
} from "@/components/molecules/chat-settings";
import { cn } from "@/lib/utils";

export interface ChatBoxProps {
  className?: string;
  position?: ChatPosition;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline" | "ghost";
  title?: string;
  placeholder?: string;
  showBadge?: boolean;
  showSettings?: boolean;
  initialMessages?: Message[];
  disabled?: boolean;
}

const positionToWindowClasses: Record<ChatPosition, string> = {
  "bottom-left": "bottom-20 left-4",
  "bottom-right": "bottom-20 right-4",
  "top-left": "top-20 left-4",
  "top-right": "top-20 right-4",
};

const positionToSettingsClasses: Record<ChatPosition, string> = {
  "bottom-left": "bottom-4 left-16",
  "bottom-right": "bottom-4 right-16",
  "top-left": "top-16 left-4",
  "top-right": "top-16 right-4",
};

export default function ChatBox({
  className,
  position: initialPosition = "bottom-left",
  size = "md",
  variant = "default",
  title = "Trò chuyện với AI",
  placeholder = "Nhập tin nhắn...",
  showBadge = true,
  showSettings = true,
  initialMessages = [],
  disabled = false,
}: ChatBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<ChatPosition>(initialPosition);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showSettingsPanel, setShowSettingsPanel] = React.useState(false);

  // Load position from localStorage on mount
  React.useEffect(() => {
    const savedPosition = localStorage.getItem(
      "chatbox-position"
    ) as ChatPosition;
    if (
      savedPosition &&
      ["bottom-left", "bottom-right", "top-left", "top-right"].includes(
        savedPosition
      )
    ) {
      setPosition(savedPosition);
    }
  }, []);

  // Save position to localStorage when changed
  const handlePositionChange = (newPosition: ChatPosition) => {
    setPosition(newPosition);
    localStorage.setItem("chatbox-position", newPosition);
  };

  // Handle opening/closing chat
  const handleToggle = () => {
    console.log("Toggle clicked - Current isOpen:", isOpen);
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    console.log("New isOpen state:", newOpenState);

    // Clear unread count when opening
    if (newOpenState) {
      setUnreadCount(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle sending messages - chỉ dùng RAG API thông qua ChatWindow
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // ChatWindow sẽ tự động gọi RAG API và thêm bot response
    // Không cần xử lý gì thêm ở đây
  };

  // Add welcome message on first open
  React.useEffect(() => {
    if (isOpen && messages.length === 0 && initialMessages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Xin chào! Tôi là trợ lý AI của PlanBook. Tôi có thể giúp bạn tạo giáo án, trả lời câu hỏi về giáo dục, và hỗ trợ các công việc khác. Bạn cần hỗ trợ gì?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, initialMessages.length]);

  // Debug render condition
  // console.log("Render check - isOpen:", isOpen);

  return (
    <div className={cn("relative", className)} >
      {/* Chat Toggle Button with Settings on Hover */}
      <div
        className="relative"
        onMouseEnter={() => setShowSettingsPanel(true)}
        onMouseLeave={() => setShowSettingsPanel(false)}
      >
        <ChatToggle
          isOpen={isOpen}
          onToggle={handleToggle}
          size={size}
          variant={variant}
          position={position}
          showBadge={showBadge}
          badgeCount={unreadCount}
          disabled={disabled}
        />

        {/* Settings Panel on Hover */}
        {showSettings && (
          <div
            className={cn("fixed z-50", positionToSettingsClasses[position])}
            onMouseEnter={() => setShowSettingsPanel(true)}
            onMouseLeave={() => setShowSettingsPanel(false)}
          >
            <ChatSettings
              position={position}
              onPositionChange={handlePositionChange}
              isVisible={showSettingsPanel}
            />
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-40 transition-all duration-300 ease-out transform",
            "opacity-100 translate-y-0 scale-100",
            positionToWindowClasses[position]
          )}
          style={{
            animation: "slideInUp 0.3s ease-out",
          }}
        >
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onClose={handleClose}
            title={title}
            placeholder={placeholder}
            showMinimize={false}
            onAddMessage={(message) =>
              setMessages((prev) => [...prev, message])
            }
          />
        </div>
      )}
    </div>
  );
}

export type { Message } from "@/components/molecules/chat-window";
