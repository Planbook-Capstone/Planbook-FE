import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";

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
          {row.original?.code}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "lessonIds",
    header: "Bài học đã chọn",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-[240px]">
        {row.original?.lessonIds}
      </div>
    ),
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
