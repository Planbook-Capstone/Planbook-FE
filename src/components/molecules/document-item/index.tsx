"use client";
import FileIcon from "@/components/ui/FileIcon";
import { CloseOutlined } from "@ant-design/icons";
import type { FileType } from "@/constants/fileIcons";

interface Props {
  type: string;
  name: string;
  description: string;
  onRemove?: () => void;
}

export default function DocumentItem({
  type,
  name,
  description,
  onRemove,
}: Props) {
  return (
    <div className="flex items-start justify-between border rounded-md px-3 py-2 bg-white shadow-sm">
      <div className="flex gap-2">
        <FileIcon type={type} />
        <div className="text-sm">
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
        </div>
      </div>
      {onRemove && (
        <button
          className="text-gray-400 hover:text-red-500 mt-1"
          onClick={onRemove}
        >
          <CloseOutlined />
        </button>
      )}
    </div>
  );
}
