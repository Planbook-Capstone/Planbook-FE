import { DataTable } from "@/components/organisms/data-table";
import { SubscriptionResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { subscriptionColumns } from "./column";

interface SubscriptionTableProps {
  onSelectionChange?: (selectedRows: Row<SubscriptionResponse>[]) => void;
}

const mockData: SubscriptionResponse[] = [
  {
    id: 1,
    name: "Gói cơ bản",
    duration_months: 12,
    price: 500000,
    status: "ACTIVE",
    currency: "VND",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T12:00:00Z",
  },
  {
    id: 2,
    name: "Gói nâng cao",
    duration_months: 24,
    price: 900000,
    status: "TRIAL",
    currency: "VND",
    created_at: "2023-03-01T00:00:00Z",
    updated_at: "2024-05-20T10:00:00Z",
  },
];

export default function SubscriptionTable({
  onSelectionChange,
}: SubscriptionTableProps) {
  return (
    <DataTable
      columns={subscriptionColumns}
      data={mockData}
      onSelectionChange={onSelectionChange}
    />
  );
}
