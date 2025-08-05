"use client";
import FileIcon from "@/components/ui/FileIcon";
import { CloseOutlined } from "@ant-design/icons";
import type { FileType } from "@/constants/fileIcons";

interface Props {
  type: string;
  name: string;
  description: string;
  lastModifiedTime?: string;
  onRemove?: () => void;
  onClick?: () => void;
}

export default function DocumentItem({
  type,
  name,
  description,
  lastModifiedTime,
  onRemove,
  onClick,
}: Props) {
  return (
    <div
      className="flex items-start justify-between border rounded-md px-4 py-4 bg-white relative cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <FileIcon type={type} size={"lg"} />
        <div className="text-sm flex flex-col gap-2">
          <p className="font-calsans text-base line-clamp-1">{name}</p>
          <p className=" line-clamp-1 text-sm font-questrial">{description}</p>
          <p className="text-xs font-questrial">{lastModifiedTime}</p>
        </div>
      </div>

      <button
        className=" hover:scale-105 cursor-pointer mt-1 absolute -right-2 -top-3 bg-white border h-6 w-6 rounded-full shadow-base"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering parent onClick
          onRemove?.();
        }}
      >
        <CloseOutlined className="h-2 w-2" />
      </button>
    </div>
  );
}
