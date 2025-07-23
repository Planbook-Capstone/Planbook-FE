"use client";

import { Button } from "@/components/ui/Button";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import SubscriptionTable from "@/components/organisms/subscription-table";
import { SubscriptionResponse } from "@/types";
import { Input } from "@/components/ui/input";
import CreateSubscriptionModal from "@/components/organisms/create-subscription-modal";
import EditSubscriptionModal from "@/components/organisms/edit-subscription-modal";
import { useDeleteSubscriptionService } from "@/services/subscriptionServices";
import { toast } from "sonner";

function SubscriptionManagementPage() {
  const [selected, setSelected] = useState<Row<SubscriptionResponse>[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionResponse | null>(null);
  const { mutate, isPending } = useDeleteSubscriptionService();

  const handleEditClick = () => {
    if (selected.length === 1) {
      setSelectedSubscription(selected[0].original);
      setEditModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (selected.length === 1) {
      setSelectedSubscription(selected[0].original);
      mutate(String(selected[0].original.id), {
        onSuccess: () => {
          toast.success("Xóa gói thành công");
          setSelected([]);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      });
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
              Xoá
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
