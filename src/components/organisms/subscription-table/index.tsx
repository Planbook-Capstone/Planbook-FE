"use client"
import { DataTable } from "@/components/organisms/data-table";
import { SubscriptionResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { subscriptionColumns } from "./column";
import { useSubscriptionsService } from "@/services/subscriptionServices";

interface SubscriptionTableProps {
  onSelectionChange?: (selectedRows: Row<SubscriptionResponse>[]) => void;
}

export default function SubscriptionTable({
  onSelectionChange,
}: SubscriptionTableProps) {
  const { data: subscriptions } = useSubscriptionsService();

  return (
    <DataTable
      columns={subscriptionColumns}
      data={subscriptions?.data || []}
      onSelectionChange={onSelectionChange}
    />
  );
}
