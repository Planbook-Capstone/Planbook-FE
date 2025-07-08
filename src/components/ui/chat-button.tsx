"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChatIcon } from "./chat-icon";

const chatButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-800 text-white hover:bg-neutral-600 hover:cursor-pointer",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        ghost: "hover:bg-gray-100 text-gray-600",
      },
      size: {
        sm: "h-10 w-10",
        md: "h-12 w-12",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ChatButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chatButtonVariants> {
  iconType?: "message" | "close" | "minimize";
  iconSize?: "sm" | "md" | "lg";
}

const ChatButton = React.forwardRef<HTMLButtonElement, ChatButtonProps>(
  (
    {
      className,
      variant,
      size,
      iconType = "message",
      iconSize,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Auto-adjust icon size based on button size if not specified
    const finalIconSize =
      iconSize || (size === "sm" ? "sm" : size === "lg" ? "lg" : "md");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log("ChatButton clicked!");
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <button
        className={cn(chatButtonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children || (
          <ChatIcon
            type={iconType}
            size={finalIconSize}
            variant={
              variant === "outline" || variant === "ghost"
                ? "outline"
                : "default"
            }
          />
        )}
      </button>
    );
  }
);

ChatButton.displayName = "ChatButton";

export { ChatButton, chatButtonVariants };
