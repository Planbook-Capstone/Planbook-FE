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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/FormField";
import {
  SlideTemplate,
  SlideTemplateFormData,
  TEMPLATE_CATEGORIES,
} from "@/types/slide-template";
import { Switch } from "@/components/ui/Switch";
import { X, Plus } from "lucide-react";

interface SlideTemplateModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: SlideTemplate | null;
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
    category: "education",
    isPublic: true,
    tags: [],
    slides: [],
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
          category: initialData.category,
          isPublic: initialData.isPublic,
          tags: [...initialData.tags],
          slides: [...initialData.slides],
        });
      } else {
        setFormData({
          name: "",
          description: "",
          category: "education",
          isPublic: true,
          tags: [],
          slides: [],
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

    if (!formData.category) {
      errors.category = "Danh mục là bắt buộc";
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

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nhập tên template"
              />
            </FormField>

            <FormField
              label="Danh mục"
              htmlFor="category"
              error={formErrors.category}
            >
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormField label="Tags" htmlFor="tags">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tag và nhấn Enter"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      variant="outline"
                      size="sm"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-blue-600"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Trạng thái" htmlFor="isPublic">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    {formData.isPublic ? "Công khai" : "Riêng tư"}
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
