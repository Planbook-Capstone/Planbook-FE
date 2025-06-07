import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical } from "lucide-react";

export type Book = {
  id: number;
  gradeId: string;
  subjectId: string;
  name: string;
  description: string;
  // updated_at: Date;
};

export const bookColumns: ColumnDef<Book>[] = [
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
    accessorKey: "gradeId",
    header: "Khối",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium ">{row.original.gradeId}</span>
      </div>
    ),
  },
  {
    accessorKey: "subjectId",
    header: "Môn học",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.subjectId}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên sách",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate ">
        {row.original.description}
      </div>
    ),
  },
  // {
  //   accessorKey: "updated_at",
  //   header: "Ngày cập nhật",
  //   cell: ({ row }) => <span>{row.original.updated_at}</span>,
  // },
 
  
];
