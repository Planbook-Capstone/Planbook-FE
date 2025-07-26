"use client";

import { Button } from "@/components/ui/Button";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import SubscriptionTable from "@/components/organisms/subscription-table";
import { SubscriptionResponse } from "@/types";
import { Input } from "@/components/ui/input";
import CreateSubscriptionModal from "@/components/organisms/create-subscription-modal";
import EditSubscriptionModal from "@/components/organisms/edit-subscription-modal";
import { useUpdateSubscriptionStatus } from "@/services/subscriptionServices";
import { toast } from "sonner";

function SubscriptionManagementPage() {
  const [selected, setSelected] = useState<Row<SubscriptionResponse>[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionResponse | null>(null);
  const { mutate, isPending } = useUpdateSubscriptionStatus();

  const handleEditClick = () => {
    if (selected.length === 1) {
      setSelectedSubscription(selected[0].original);
      setEditModalOpen(true);
    }
  };

  const handleDelete = () => {
    const newStatus =
      selected[0]?.original?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (selected.length === 1) {
      setSelectedSubscription(selected[0].original);
      mutate(
        {
          id: String(selected[0]?.original?.id),
          field: "status",
          queryParams: { newStatus }, // ✅ dùng biến động },
        },
        {
          onSuccess: () => {
            toast.success(
              newStatus === "INACTIVE"
                ? "Xóa gói thành công"
                : "Khôi phục gói thành công"
            );
            setSelected([]);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
          },
        }
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center gap-2.5">
        <Input placeholder="Tìm kiếm" className="max-w-sm" />
        {selected.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button
              variant={"outline"}
              onClick={handleEditClick}
              disabled={selected.length !== 1}
            >
              Chỉnh sửa
            </Button>
            <Button
              onClick={handleDelete}
              disabled={selected.length !== 1 || isPending}
            >
              {selected.length === 1 && selected[0]?.original?.status === "ACTIVE"
                ? "Xoá"
                : "Khôi phục"}
            </Button>
          </div>
        ) : (
          <CreateSubscriptionModal />
        )}
      </div>

      <SubscriptionTable
        onSelectionChange={(rows) => {
          setSelected(rows);
        }}
      />

      <EditSubscriptionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subscription={selectedSubscription}
      />
    </div>
  );
}

export default SubscriptionManagementPage;
