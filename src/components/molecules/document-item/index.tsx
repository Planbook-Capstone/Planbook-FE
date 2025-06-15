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
    <div className="flex items-start justify-between border rounded-md px-4 py-4 bg-white relative">
      <div className="flex gap-4">
        <FileIcon type={type} size={"lg"} />
        <div className="text-sm flex flex-col gap-2">
          <p className="font-calsans text-base">{name}</p>
          <p className=" line-clamp-2 text-sm font-questrial">{description}</p>
        </div>
      </div>

      <button
        className=" hover:scale-105 cursor-pointer mt-1 absolute -right-2 -top-3 bg-white border h-6 w-6 rounded-full shadow-base"
        onClick={onRemove}
      >
        <CloseOutlined className="h-2 w-2" />
      </button>
    </div>
  );
}
