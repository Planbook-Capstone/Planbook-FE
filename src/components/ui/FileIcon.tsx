import Image from "next/image";
import { FILE_ICONS, type FileType } from "@/constants/fileIcons";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export interface FileIconProps {
  type: string;
  className?: string;
}

const fileIconVariants = cva("", {
  variants: {
    size: {
      default: "w-6",
      sm: "w-12",
      lg: "w-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export default function FileIcon({
  type,
  size,
  className,
  ...props
}: VariantProps<typeof fileIconVariants> & FileIconProps) {
  const upperType = type.toUpperCase() as FileType;
  const iconPath = FILE_ICONS[upperType] || "";

  return (
    <Image
      src={iconPath}
      alt={type}
      className={cn(fileIconVariants({ size, className }))}
      width={24}
      height={24}
      {...props}
    />
  );
}
