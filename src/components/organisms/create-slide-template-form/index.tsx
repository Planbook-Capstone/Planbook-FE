"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Type, Plus, Palette } from "lucide-react";

// Validation schema
const slideTemplateSchema = z.object({
  name: z.string().min(1, "Tên template là bắt buộc"),
  description: z.string().optional(),
});

type SlideTemplateFormData = z.infer<typeof slideTemplateSchema>;

interface CreateSlideTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tempData: { name: string; description?: string }) => void;
}

export default function CreateSlideTemplateForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateSlideTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SlideTemplateFormData>({
    resolver: zodResolver(slideTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: SlideTemplateFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare temp data (chỉ có name và description)
      const tempData = {
        name: data.name,
        description: data.description,
      };

      toast.success("Chuyển đến slide editor để thiết kế...");
      reset();
      onOpenChange(false);

      // Pass temp data to redirect to slide editor
      onSuccess?.(tempData);
    } catch (error: any) {
      console.error("Error processing template data:", error);
      toast.error("Có lỗi xảy ra khi xử lý dữ liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-calsans text-xl">
            Tạo Template Mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-calsans text-lg text-gray-900">
              Thông tin cơ bản
            </h3>

            {/* Template Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên Template <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Nhập tên template"
                    className="font-questrial"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Mô tả</label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Nhập mô tả template"
                    className="font-questrial min-h-[80px]"
                  />
                )}
              />
            </div>
          </div>

          {/* Note about Slide Editor */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Palette className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-calsans text-sm font-medium text-purple-900 mb-1">
                  Thiết kế trong Slide Editor
                </h4>
                <p className="text-sm text-purple-700 font-questrial mb-2">
                  Sau khi tạo template, bạn sẽ được chuyển đến slide editor để:
                </p>
                <ul className="text-sm text-purple-700 font-questrial space-y-1">
                  <li className="flex items-center gap-2">
                    <Type className="w-3 h-3" />
                    Thêm và chỉnh sửa nội dung văn bản
                  </li>
                  <li className="flex items-center gap-2">
                    <Palette className="w-3 h-3" />
                    Thiết kế layout và thêm hình ảnh
                  </li>
                  <li className="flex items-center gap-2">
                    <Plus className="w-3 h-3" />
                    Tạo nhiều slide và sắp xếp thứ tự
                  </li>
                </ul>
                <p className="text-sm text-purple-700 font-questrial mt-2">
                  Tất cả hình ảnh và nội dung sẽ được tự động trích xuất và lưu
                  vào template.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isSubmitting ? "Đang tạo..." : "Tạo Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
