import { Order } from "@/types";
import { DataTable } from "../data-table";
import { ordersColumns } from "./columns";
import { Row } from "@tanstack/react-table";

interface OrderTableProps {
  orders: Order[];
  onSelectionChange?: (selectedRows: Row<Order>[]) => void;
  onViewDetail: (order: Order) => void;
  // onToggleUserStatus?: (order: Order) => void;
  mode?: "admin" | "user";
}

export default function OrderTable({
  orders,
  onSelectionChange,
  onViewDetail,
  mode,
}: // onToggleUserStatus,
OrderTableProps) {
  const columns = ordersColumns({
    onViewDetail,
    mode,
    // onToggleUserStatus,
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={orders}
        onSelectionChange={onSelectionChange}
      />
    </>
  );
}
