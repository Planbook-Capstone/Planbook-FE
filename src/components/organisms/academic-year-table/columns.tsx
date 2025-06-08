import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";

export type AcademicYear = {
  id: number;
  start_date: string;
  end_date: string;
  year_label: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export const yearColumns: ColumnDef<AcademicYear>[] = [
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
    accessorKey: "start_date",
    header: "Năm bắt đầu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium ">{row.original.start_date}</span>
      </div>
    ),
  },
  {
    accessorKey: "end_date",
    header: "Năm kết thúc",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.end_date}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Năm học",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.year_label}</span>
      </div>
    ),
  },

  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    cell: ({ row }) => <span>{row.original.updated_at}</span>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.status}</span>
      </div>
    ),
  },
];
