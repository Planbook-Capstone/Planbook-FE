import { DataTable } from "@/components/organisms/data-table";
import { SubscriptionResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { subscriptionColumns } from "./column";
import { useSubscriptionsService } from "@/services/subscriptionServices";

interface SubscriptionTableProps {
  onSelectionChange?: (selectedRows: Row<SubscriptionResponse>[]) => void;
}

const mockData: SubscriptionResponse[] = [
  {
    id: "14205042-7494-48e6-8983-dab7328676a1",
    name: "Gói cơ bản",
    tokenAmount: 100,
    price: 99000,
    description: "Dành cho giáo viên muốn trải nghiệm sức mạnh AI mà không cần cam kết",
    highlight: false,
    features: ["Tạo bài giảng AI", "Hỗ trợ 24/7", "100 token/tháng"],
    status: "ACTIVE",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T12:00:00Z",
  },
  {
    id: "24205042-7494-48e6-8983-dab7328676a2",
    name: "Gói nâng cao",
    tokenAmount: 500,
    price: 299000,
    description: "Gói nâng cao với nhiều tính năng hơn cho giáo viên chuyên nghiệp",
    highlight: true,
    features: ["Tạo bài giảng AI", "Hỗ trợ 24/7", "500 token/tháng", "Xuất file Word", "Tạo đề thi"],
    status: "INACTIVE",
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-05-20T10:00:00Z",
  },
];

export default function SubscriptionTable({
  onSelectionChange,
}: SubscriptionTableProps) {
  const { data: subscriptions } = useSubscriptionsService();

  return (
    <DataTable
      columns={subscriptionColumns}
      data={subscriptions?.data || mockData}
      onSelectionChange={onSelectionChange}
    />
  );
}
