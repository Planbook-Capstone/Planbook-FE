import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";
import { getToolActionName } from "@/constants";
import LessonNamesCell from "./LessonNamesCell";

export type HistoryItem = {
  id: number;
  code: string;
  description: string;
  updatedAt: string;
  sources: string;
  lessonIds: string;
  tokenUsed: number;
};

export const historyColumns: ColumnDef<HistoryItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "code",
    header: "Chức năng sử dụng",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium truncate max-w-[150px]">
          {getToolActionName(row.original.code)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lessonIds",
    header: "Bài học đã chọn",
    cell: ({ row }) => {
      // Parse lessonIds if it's a string
      let lessonIds: string[] | number[] = [];
      const originalLessonIds = row.original?.lessonIds;

      if (typeof originalLessonIds === 'string') {
        try {
          // Try to parse as JSON array
          const parsed = JSON.parse(originalLessonIds);
          lessonIds = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // If parsing fails, treat as comma-separated string
          lessonIds = originalLessonIds.split(',').map(id => id.trim()).filter(Boolean);
        }
      } else if (Array.isArray(originalLessonIds)) {
        lessonIds = originalLessonIds;
      }

      return (
        <div className="max-w-[240px]">
          <LessonNamesCell lessonIds={lessonIds} />
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật lần cuối",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.updatedAt).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // để dùng định dạng 24h thay vì AM/PM
        })}
      </span> 
    ),
  },
  {
    accessorKey: "tokenUsed",
    header: "Token đã sử dụng",
    cell: ({ row }) => <span>{row.original.tokenUsed}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex justify-end">
        <MoreVertical className="w-4 h-4 text-muted-foreground" />
      </div>
    ),
  },
];
