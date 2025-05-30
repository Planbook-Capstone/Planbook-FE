import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";

export type HistoryItem = {
  id: number;
  title: string;
  description: string;
  updatedAt: string;
  sources: string;
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
    accessorKey: "title",
    header: "Tên",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium truncate max-w-[150px]">
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate max-w-[240px]">
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => <span>{row.original.updatedAt}</span>,
  },
  {
    accessorKey: "sources",
    header: "Nguồn",
    cell: ({ row }) => <span>{row.original.sources}</span>,
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
