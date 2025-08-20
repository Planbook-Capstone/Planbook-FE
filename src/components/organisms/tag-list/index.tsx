import { DataTable } from "../data-table";

import { Row } from "@tanstack/react-table";
import { TagResponse } from "@/types";
import { tagColumns } from "./columns";
import { useTagService, useDeleteTagService } from "@/services/tagServices";
import { CreateMaterialTagModal } from "../create-material-tag-form";
import GeneralConfirmDialog from "@/components/ui/GeneralConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";

interface TagTableProps {
  onSelectionChange?: (selectedRows: Row<TagResponse>[]) => void;
}

export default function TagTable({ onSelectionChange }: TagTableProps) {
  const { data: tags, refetch } = useTagService();
  const deleteTagMutation = useDeleteTagService();
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<TagResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (tag: TagResponse) => {
    setEditingTag(tag);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setEditingTag(null);
  };

  const handleDelete = (tag: TagResponse) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tagToDelete) return;

    try {
      await deleteTagMutation.mutateAsync(String(tagToDelete.id));
      toast.success("Xóa loại tài liệu thành công!");
      refetch();
      setIsDeleteModalOpen(false);
      setTagToDelete(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa loại tài liệu!");
      console.error("Delete tag error:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
  };

  const columns = tagColumns({ onEdit: handleEdit, onDelete: handleDelete });

  return (
    <>
      <DataTable
        columns={columns}
        data={tags?.data || []}
        onSelectionChange={onSelectionChange}
      />

      <CreateMaterialTagModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        isEdit={true}
        initialValues={editingTag ? {
          id: String(editingTag.id),
          name: editingTag.name,
          description: editingTag.description || "",
        } : undefined}
        onSuccess={handleEditSuccess}
      />

      <GeneralConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        type="delete"
        title="Xác nhận xóa loại tài liệu"
        itemName={tagToDelete?.name}
        isLoading={deleteTagMutation.isPending}
        confirmText="Xóa"
        loadingText="Đang xóa..."
      />
    </>
  );
}
