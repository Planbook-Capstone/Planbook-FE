import { DataTable } from "../data-table";

import { Row } from "@tanstack/react-table";
import { TagResponse } from "@/types";
import { tagColumns } from "./columns";
import { useTagService } from "@/services/tagServices";
import { CreateMaterialTagModal } from "../create-material-tag-form";
import { useState } from "react";

interface TagTableProps {
  onSelectionChange?: (selectedRows: Row<TagResponse>[]) => void;
}

export default function TagTable({ onSelectionChange }: TagTableProps) {
  const { data: tags, refetch } = useTagService();
  const [editingTag, setEditingTag] = useState<TagResponse | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (tag: TagResponse) => {
    setEditingTag(tag);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
    setIsEditModalOpen(false);
    setEditingTag(null);
  };

  const columns = tagColumns({ onEdit: handleEdit });

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
    </>
  );
}
