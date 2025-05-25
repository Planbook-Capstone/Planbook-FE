import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center text-xs font-medium px-3 py-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-600",
        success: "bg-green-100 text-green-700",
        warning: "bg-yellow-100 text-yellow-800",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
        neutral: "bg-zinc-100 text-zinc-700",
        outline: "border border-gray-300 text-gray-700 bg-transparent",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded-md",
        sm: "rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      rounded: "full",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  text: string;
}

export default function Tag({
  text,
  className,
  variant,
  size,
  rounded,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(tagVariants({ variant, size, rounded, className }))}
      {...props}
    >
      {text}
    </span>
  );
}
