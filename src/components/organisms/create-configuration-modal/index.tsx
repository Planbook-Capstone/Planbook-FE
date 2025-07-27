"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ConfigurationFormData } from "@/schemas/configuration.schema";
import CreateConfigurationForm from "../create-configuration-form";

interface CreateConfigurationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ConfigurationFormData) => void;
}

export default function CreateConfigurationModal({
  open,
  onClose,
  onSubmit,
}: CreateConfigurationModalProps) {
  const handleSubmit = (data: ConfigurationFormData) => {
    onSubmit?.(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Tạo Hướng dẫn Mới
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <CreateConfigurationForm onClose={onClose} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
