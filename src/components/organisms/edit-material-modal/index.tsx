"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditMaterialForm from "@/components/organisms/edit-material-form";
import { EditMaterialFormData } from "@/schemas/material.schema";

interface EditMaterialModalProps {
  open: boolean;
  onClose: () => void;
  materialId: string;
  onSubmit?: (data: EditMaterialFormData) => Promise<void> | void;
}

function EditMaterialModal({
  open,
  onClose,
  materialId,
  onSubmit,
}: EditMaterialModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa học liệu</DialogTitle>
        </DialogHeader>
        <EditMaterialForm
          materialId={materialId}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

export default EditMaterialModal;
