"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExamInstanceData } from "@/services/examInstanceServices";
import { Save, X } from "lucide-react";

// Form validation schema
const editInstanceSchema = z.object({
  templateName: z
    .string()
    .min(1, "Tên bài thi không được để trống")
    .max(200, "Tên bài thi không được vượt quá 200 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(500, "Mô tả không được vượt quá 500 ký tự"),
});

type EditInstanceFormData = z.infer<typeof editInstanceSchema>;

interface EditInstanceFormProps {
  instance: ExamInstanceData;
  onSubmit: (data: EditInstanceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditInstanceForm({
  instance,
  onSubmit,
  onCancel,
  isLoading = false,
}: EditInstanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditInstanceFormData>({
    resolver: zodResolver(editInstanceSchema),
    defaultValues: {
      templateName: instance.templateName,
      description: instance.description,
    },
  });

  const handleFormSubmit = (data: EditInstanceFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Chỉnh sửa thông tin bài thi
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Template Name */}
        <div className="space-y-2">
          <Label htmlFor="templateName" className="text-sm font-medium">
            Tên bài thi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="templateName"
            {...register("templateName")}
            placeholder="Nhập tên bài thi..."
            disabled={isLoading}
            className={errors.templateName ? "border-red-500" : ""}
          />
          {errors.templateName && (
            <p className="text-sm text-red-600">
              {errors.templateName.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Mô tả <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Nhập mô tả bài thi..."
            rows={4}
            disabled={isLoading}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Current Info Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Thông tin hiện tại:
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Mã:</strong> {instance.code}</p>
            <p><strong>Môn học:</strong> {instance.subject}</p>
            <p><strong>Lớp:</strong> {instance.grade}</p>
            <p><strong>Thời gian:</strong> {instance.durationMinutes} phút</p>
            <p><strong>Trạng thái:</strong> {instance.status}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !isDirty}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
