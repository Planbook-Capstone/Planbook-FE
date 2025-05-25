"use client";
import { Button } from "@/components/ui/Button";
import FileIcon from "@/components/ui/FileIcon";
import { DeleteOutlined } from "@ant-design/icons";

interface ResultItemProps {
  type: string;
  name: string;
  onDelete?: () => void;
}

export default function ResultItem({ type, name, onDelete }: ResultItemProps) {
  return (
    <div className="flex justify-between items-center bg-white border rounded-md p-3 shadow-sm">
      <div className="flex gap-2 items-center">
        <FileIcon type={type} />
        <div className="text-sm font-medium">{name}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-gray-400 hover:text-red-500"
      >
        <DeleteOutlined />
      </Button>
    </div>
  );
}
