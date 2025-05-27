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
    <div className="flex justify-between items-center bg-white rounded-md p-3">
      <div className="flex gap-2 items-center">
        <FileIcon type={type} />
        <div className="text-sm font-medium">{name}</div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className=" hover:scale-105 border rounded-sm shadow-base"
      >
        <DeleteOutlined />
      </Button>
    </div>
  );
}
