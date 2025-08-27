import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import FileIcon from "@/components/ui/FileIcon";

export type LibraryItem = {
  id: number;
  name: string;
  description?: string;
  subject?: string; // For QUIZ type
  type?: string; // SLIDE, EXAM, LESSON_PLAN, etc.
  updatedAt: string;
  createdAt?: string;
  onItemClick?: () => void;
  onRemoveClick?: () => void;
  itemType?: string; // "QUIZ" or other
};

export const libraryColumns: ColumnDef<LibraryItem>[] = [
  {
    accessorKey: "name",
    header: "Tên tài liệu",
    cell: ({ row }) => {
      const item = row.original;
      const fileType =
        item.itemType === "QUIZ"
          ? "DOCX"
          : item.type === "SLIDE"
          ? "PPTX"
          : "DOCX";

      return (
        <div
          className="flex items-center gap-3 cursor-pointer hover:text-blue-600"
          onClick={item.onItemClick}
        >
          <FileIcon type={fileType} size="default" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-500 truncate">
              {item.itemType === "QUIZ"
                ? item.subject || item.description
                : item.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => {
      const item = row.original;
      const fileType =
        item.itemType === "QUIZ"
          ? "DOCX"
          : item.type === "SLIDE"
          ? "PPTX"
          : "DOCX";

      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {fileType}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => {
      const item = row.original;
      const date = new Date(item.updatedAt || item.createdAt || "");

      return (
        <span className="text-sm text-gray-500">
          {date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              item.onRemoveClick?.();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
