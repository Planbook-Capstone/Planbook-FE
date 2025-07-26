"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateMaterialForm from "@/components/organisms/create-material-form";
import { MaterialFormData } from "@/schemas/material.schema";

interface CreateMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: MaterialFormData) => void;
}

export default function CreateMaterialModal({
  open,
  onClose,
  onSubmit,
}: CreateMaterialModalProps) {
  const handleSubmit = (data: MaterialFormData) => {
    onSubmit?.(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Tạo Material Mới
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <CreateMaterialForm onClose={onClose} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
