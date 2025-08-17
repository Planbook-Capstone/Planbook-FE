import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { BookTypeResponse } from "@/types";
import { translateStatus } from "@/utils/translateEnum";
import { Badge } from "@/components/ui/badge";

export const bookTypeColumns: ColumnDef<BookTypeResponse>[] = [
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
    accessorKey: "icon",
    header: "Icon",
    cell: ({ row }) => {
      const iconBase64 = row.original.icon;

      return iconBase64 ? (
        <div className="w-9 h-9">
          <img
            src={iconBase64}
            alt="SVG icon"
            className="object-contain w-full h-full"
          />
        </div>
      ) : (
        <span className="text-muted-foreground italic">Không có</span>
      );
    },
  },

  {
    accessorKey: "name",
    header: "Tên chức năng",
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
      <div className="max-w-[300px]">
        <span className="block font-medium whitespace-normal break-words line-clamp-2">
          {row.original.description}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "tokenCostPerQuery",
    header: "Số lượng token",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.tokenCostPerQuery}</span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Độ ưu tiên",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.priority}</span>
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div className="text-muted-foreground truncate">
        {row.original.createdAt}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.updatedAt}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusText = translateStatus(status || "");

      // Mapping status to variant or custom class
      const getStatusVariant = (status: string | null | undefined) => {
        switch (status) {
          case "ACTIVE":
            return "success";
          case "INACTIVE":
            return "warning";
          default:
            return "outline";
        }
      };

      return <Badge variant={getStatusVariant(status)}>{statusText}</Badge>;
    },
  },
];
