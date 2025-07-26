"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/FormField";
import { Switch } from "@/components/ui/Switch";
import { X, Plus } from "lucide-react";
import {
  SlideTemplate,
  SlideTemplateFormData,
  SlideTemplateResponse,
} from "@/types";

interface SlideTemplateModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: SlideTemplateResponse | null;
}

function SlideTemplateModal({
  open,
  onClose,
  mode,
  initialData,
}: SlideTemplateModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SlideTemplateFormData>({
    name: "",
    description: "",
    status: "ACTIVE",
    imageBlocks: {},
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description || "",
          status: initialData.status,
          imageBlocks: { ...initialData.imageBlocks },
        });
      } else {
        setFormData({
          name: "",
          description: "",
          status: "ACTIVE",
          imageBlocks: {},
        });
      }
      setFormErrors({});
      setNewTag("");
    }
  }, [open, mode, initialData]);

  // Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Tên template là bắt buộc";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const handleFormSubmit = () => {
    if (!validateForm()) return;

    if (mode === "create") {
      // Navigate to create page with form data
      const templateDataParam = encodeURIComponent(JSON.stringify(formData));
      router.push(
        `/slide-template-editor/create?templateData=${templateDataParam}`
      );
    } else if (mode === "edit" && initialData) {
      // Navigate to edit page
      router.push(`/slide-template-editor/edit/${initialData.id}`);
    }

    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-calsans">
            {mode === "create"
              ? "Tạo Template mới"
              : "Chỉnh sửa thông tin Template"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Tên Template"
              htmlFor="name"
              error={formErrors.name}
            >
              <Input
                id="name"
                value={formData.name}
                onChange={(e: any) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên template"
              />
            </FormField>

            <FormField
              label="Mô tả"
              htmlFor="description"
              className="md:col-span-2"
            >
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả template (tùy chọn)"
                rows={3}
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Trạng thái" htmlFor="isPublic">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={formData.status === "ACTIVE"}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    {formData.status ? "Hoạt động" : "Vô hiệu hoá"}
                  </label>
                </div>
              </FormField>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleFormSubmit}>
              {mode === "create" ? "Tiếp tục thiết kế" : "Chỉnh sửa slide"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SlideTemplateModal;
