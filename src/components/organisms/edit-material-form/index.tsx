"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/FormField";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editMaterialSchema,
  EditMaterialFormData,
  getFileCategory,
  formatFileSize,
  getFileIcon,
  FileData,
} from "@/schemas/material.schema";
import { useTagService } from "@/services/tagServices";
import { useMaterialByIdService, useUpdateMaterialService } from "@/services/materialServices";
import LessonSelector from "@/components/molecules/lesson-selector";
import { TagResponse } from "@/types";

interface EditMaterialFormProps {
  materialId: string;
  onClose?: () => void;
  onSubmit?: (data: EditMaterialFormData) => Promise<void> | void;
}

function EditMaterialForm({
  materialId,
  onClose,
  onSubmit: onSubmitProp,
}: EditMaterialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Services
  const { data: materialData, isLoading: isLoadingMaterial } = useMaterialByIdService(materialId);
  const { data: tags } = useTagService();
  const updateMaterialMutation = useUpdateMaterialService();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditMaterialFormData>({
    resolver: zodResolver(editMaterialSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      lessonId: undefined,
      file: undefined,
    },
  });

  // Load material data when available
  useEffect(() => {
    if (materialData?.data) {
      const material = materialData.data;
      setValue("name", material.name || "");
      setValue("description", material.description || "");
      setValue("lessonId", material.lessonId || undefined);
    }
  }, [materialData, setValue]);

  const watchedFile = watch("file");

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setValue("file", undefined);
  };

  // Get current file info (existing or new)
  const getCurrentFileInfo = () => {
    if (selectedFile) {
      return {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      };
    }
    
    if (materialData?.data?.file) {
      return materialData.data.file;
    }
    
    return null;
  };

  const currentFile = getCurrentFileInfo();

  // Handle form submission
  const onSubmit = async (data: EditMaterialFormData) => {
    try {
      setIsSubmitting(true);

      if (onSubmitProp) {
        await onSubmitProp(data);
      } else {
        // Default submission logic
        if (data.file) {
          // If there's a new file, use FormData
          const formData = new FormData();
          formData.append("file", data.file as File);
          formData.append(
            "metadataJson",
            JSON.stringify({
              name: data.name,
              description: data.description,
              lessonId: data.lessonId,
            })
          );

          await updateMaterialMutation.mutateAsync({
            id: materialId,
            data: formData,
          });
        } else {
          // If no new file, just update metadata with JSON
          const updateData: any = {
            name: data.name,
            description: data.description,
          };

          // Only include lessonId if it has a value
          if (data.lessonId) {
            updateData.lessonId = data.lessonId;
          }

          await updateMaterialMutation.mutateAsync({
            id: materialId,
            data: updateData,
          });
        }

        toast.success("Cập nhật học liệu thành công!");
        onClose?.();
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Có lỗi xảy ra khi cập nhật học liệu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMaterial) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  const material = materialData?.data;
  const materialTags = material?.tags || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Material Name */}
      <FormField label="Tên học liệu *" error={errors.name?.message}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Nhập tên học liệu"
              className={errors.name ? "border-red-500" : ""}
            />
          )}
        />
      </FormField>

      {/* Description */}
      <FormField label="Mô tả *" error={errors.description?.message}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="Nhập mô tả cho học liệu"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
          )}
        />
      </FormField>

      {/* Tags (Read-only) */}
      <FormField label="Loại học liệu">
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50">
          {materialTags.length > 0 ? (
            materialTags.map((tagId: string) => {
              const tag = tags?.data?.find((t: TagResponse) => t.id.toString() === tagId);
              return tag ? (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <span className="text-xs">{tag.icon}</span>
                  {tag.name}
                </Badge>
              ) : null;
            })
          ) : (
            <span className="text-gray-500 text-sm">Chưa có loại học liệu</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Loại học liệu không thể chỉnh sửa
        </p>
      </FormField>

      {/* Lesson Selector */}
      <FormField label="Bài học (tùy chọn)" error={errors.lessonId?.message}>
        <Controller
          name="lessonId"
          control={control}
          render={({ field }) => (
            <LessonSelector
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </FormField>

      {/* File Upload */}
      <FormField label="Tệp tin" error={errors.file?.message as string}>
        <div className="space-y-3">
          {/* Current file display */}
          {currentFile && (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
              <div className="flex-shrink-0">
                {getFileIcon(currentFile)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(currentFile.size)} • {getFileCategory(currentFile)}
                </p>
              </div>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* File upload button */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {currentFile ? "Thay đổi tệp tin" : "Chọn tệp tin"}
            </Button>
            
            {material?.url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => window.open(material.url, "_blank")}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Xem tệp hiện tại
              </Button>
            )}
          </div>

          <input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
          />
          
          <p className="text-xs text-gray-500">
            Hỗ trợ: Hình ảnh, Video, PDF, Word, PowerPoint, Text
          </p>
        </div>
      </FormField>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}

export default EditMaterialForm;
