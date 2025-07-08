export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatBoxConfig {
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "secondary" | "outline" | "ghost";
  title?: string;
  placeholder?: string;
  showBadge?: boolean;
  showMinimize?: boolean;
  disabled?: boolean;
}
