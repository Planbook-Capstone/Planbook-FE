import { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolResultResponse } from "@/types";
import FileIcon from "@/components/ui/FileIcon";

// Handler function types
interface TrashColumnHandlers {
  onRestore: (item: ToolResultResponse) => void;
}

export const trashsColumns = (
  handlers: TrashColumnHandlers
): ColumnDef<ToolResultResponse>[] => {
  return [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => row.index + 1,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Loại tài liệu ",
      cell: ({ row }) => {
        const fileType = row.original.type === "SLIDE" ? "PPTX" : "DOCX";
        return (
          <div className="font-medium text-gray-900 font-questrial">
            <FileIcon type={fileType} size={"default"} />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Tên ",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 font-questrial">
          {row.original.description}
        </div>
      ),
    },
    // {
    //   accessorKey: "lessonIds",
    //   header: "Bài học đã chọn",
    //   cell: ({ row }) => (
    //     <div className="font-medium text-gray-900  font-questrial">
    //       {row.original.lessonIds.join(", ")}
    //     </div>
    //   ),
    // },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật lần cuối",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        return (
          <div className="font-medium text-gray-900 font-questrial">
            {formatDate(row.original.updatedAt)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlers.onRestore(row.original)}
            className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <RotateCcw className="w-4 h-4" />
            Khôi phục
          </Button>
        </div>
      ),
    },
  ];
};
