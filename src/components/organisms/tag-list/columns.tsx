import { ColumnDef } from "@tanstack/react-table";

import { TagResponse } from "@/types";

import { Button } from "@/components/ui/Button";
import { Edit } from "lucide-react";

interface TagColumnHandlers {
  onEdit: (tag: TagResponse) => void;
}

export const tagColumns = (
  handlers: TagColumnHandlers
): ColumnDef<TagResponse>[] => [
  {
    id: "index",
    header: "STT",
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Tên loại",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => row.original.description,
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const tag = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlers.onEdit(tag)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
