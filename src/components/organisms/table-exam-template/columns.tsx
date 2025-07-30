import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Copy, Eye, Plus } from "lucide-react";
import { ExamTemplate } from "@/components/molecules/exam-template-card";

// Handler function types
interface ExamTemplateColumnHandlers {
  onViewDetail: (examTemplate: ExamTemplate) => void;
  onEdit?: (examTemplate: ExamTemplate) => void;
  onDelete?: (examTemplate: ExamTemplate) => void;
  onDuplicate?: (examTemplate: ExamTemplate) => void;
  onCreateInstance?: (examTemplate: ExamTemplate) => void;
}

export const examTemplateColumns = (
  handlers: ExamTemplateColumnHandlers
): ColumnDef<ExamTemplate>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Tên mẫu kiểm tra",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Môn học",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900 font-questrial">
        {row.original.subject}
      </div>
    ),
  },
  {
    accessorKey: "durationMinutes",
    header: "Thời gian",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900  font-questrial">
        {row.original.durationMinutes + " phút"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
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
          {formatDate(row.original.createdAt)}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const examTemplate = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* View Detail Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlers.onViewDetail(examTemplate)}
            className="p-2 hover:bg-blue-50 hover:text-blue-600"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Edit Button */}
          {handlers.onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlers.onEdit!(examTemplate)}
              className="p-2 hover:bg-green-50 hover:text-green-600 border-green-300"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}

          {/* Create Instance Button */}
          {handlers.onCreateInstance && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlers.onCreateInstance!(examTemplate)}
              className="p-2 hover:bg-purple-50 hover:text-purple-600 border-purple-300"
              title="Tạo phiếm kiểm tra"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}

          {/* Duplicate Button */}
          {handlers.onDuplicate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlers.onDuplicate!(examTemplate)}
              className="p-2 hover:bg-blue-50 hover:text-blue-600 border-blue-300"
              title="Nhân bản"
            >
              <Copy className="w-4 h-4" />
            </Button>
          )}

          {/* Delete Button */}
          {handlers.onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlers.onDelete!(examTemplate)}
              className="p-2 hover:bg-red-50 hover:text-red-600 border-red-300"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
