"use client";
import BookTypeTable from "@/components/organisms/booktype-list";
import { CreateBookTypeModal } from "@/components/organisms/create-booktype-form";
import { Button } from "@/components/ui/Button";
import { BookTypeResponse } from "@/types";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateBookTypeStatus } from "@/services/bookTypeServices";

function BookTypePage() {
  const [selected, setSelected] = useState<Row<BookTypeResponse>[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const updateStatusMutation = useUpdateBookTypeStatus();

  const handleDelete = () => {
    if (selected.length === 0) return;

    const bookType = selected[0].original;
    const newStatus = bookType.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    updateStatusMutation.mutate(
      {
        id: String(bookType.id),
        field: "status",
        queryParams: { newStatus },
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "ACTIVE" ? "Khôi phục thành công" : "Xóa thành công"
          );
          setSelected([]); // Clear selection after action
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  };

  const handleEdit = () => {
    if (selected.length > 1) {
      toast.error("Vui lòng chỉ chọn 1 loại chức năng");
    } else if (selected.length === 1) {
      setEditModalOpen(true);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-calsans text-base">Danh sách chức năng</h1>
        {editModalOpen ? null : selected.length > 0 ? (
          <div className="flex gap-1.5 items-center">
            <p className="text-sm text-muted-foreground pr-2.5">
              Đã chọn {selected.length}
            </p>
            <Button onClick={handleDelete}>
              {selected[0].original.status === "ACTIVE" ? "Xóa" : "Khôi phục"}
            </Button>
            <Button onClick={handleEdit} variant={"outline"}>
              Chỉnh sửa
            </Button>
          </div>
        ) : (
          <CreateBookTypeModal />
        )}
      </div>
      <BookTypeTable
        onSelectionChange={(rows) => {
          setSelected(rows);
        }}
      />

      {/* Edit Modal */}
      {editModalOpen && selected.length === 1 && (
        <CreateBookTypeModal
          open={editModalOpen}
          onOpenChange={(open) => {
            setEditModalOpen(open);
            if (!open) {
              setSelected([]); // Clear selection when modal closes
              setEditModalOpen(false); // Ensure edit modal state is reset
            }
          }}
          onSuccess={() => {
            // Clear selection immediately when edit is successful
            setSelected([]);
            setEditModalOpen(false);
          }}
          isEdit={true}
          initialValues={{
            id: String(selected[0].original.id),
            name: selected[0].original.name || "",
            description: selected[0].original.description || "",
            tokenCostPerQuery: selected[0].original.tokenCostPerQuery || 0,
            priority: selected[0].original.priority || 0,
            icon: selected[0].original.icon || undefined,
            href: selected[0].original?.href || "",
            code: selected[0].original?.code || "",
          }}
        />
      )}
    </div>
  );
}

export default BookTypePage;
