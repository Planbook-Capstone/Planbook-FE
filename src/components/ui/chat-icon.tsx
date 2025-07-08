"use client";

import * as React from "react";
import { MessageCircle, X, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";

const chatIconVariants = cva(
  "inline-flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        default: "text-white",
        outline: "text-gray-600",
        ghost: "text-gray-500 hover:text-gray-700",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ChatIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatIconVariants> {
  type?: "message" | "close" | "minimize";
}

const ChatIcon = React.forwardRef<HTMLDivElement, ChatIconProps>(
  ({ className, variant, size, type = "message", ...props }, ref) => {
    const IconComponent = {
      message: MessageCircle,
      close: X,
      minimize: Minus,
    }[type];

    return (
      <div
        className={cn(chatIconVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {type === "message" ? (
          <Image
            src="/images/logo/logoLight.svg"
            alt="Chat Icon"
            width={24}
            height={24}
          />
        ) : (
          <IconComponent className="w-full h-full" />
        )}
      </div>
    );
  }
);

ChatIcon.displayName = "ChatIcon";

export { ChatIcon, chatIconVariants };
