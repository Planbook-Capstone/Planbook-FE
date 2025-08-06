"use client";

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

import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  materialSchema,
  MaterialFormData,
  getFileCategory,
  formatFileSize,
  getFileIcon,
  FileData,
} from "@/schemas/material.schema";
import { useTagService } from "@/services/tagServices";
import { TagResponse } from "@/types";
import LessonSelector from "@/components/molecules/lesson-selector";

interface CreateMaterialFormProps {
  onClose?: () => void;
  onSubmit?: (data: MaterialFormData) => Promise<void> | void;
}

function CreateMaterialForm({
  onClose,
  onSubmit: onSubmitProp,
}: CreateMaterialFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: tags } = useTagService();

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    mode: "onSubmit", // Validate on submit and onChange after first submit
    reValidateMode: "onChange", // Re-validate on change after first submit
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      lessonId: "",
      file: undefined,
    },
  });

  // Simple onSubmit function that calls the prop function
  const onSubmit = async (data: MaterialFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmitProp?.(data);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    toast.error("Vui lòng kiểm tra lại thông tin đã nhập!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tên học liệu <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="bg-neutral-100 font-calsans placeholder:text-neutral-300 text-black"
              placeholder="Nhập tên material"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Material Description Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              className="bg-neutral-100 font-calsans placeholder:text-neutral-300 text-black min-h-[100px]"
              placeholder="Nhập mô tả cho material"
            />
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Material Tags Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Loại học liệu <span className="text-red-500">*</span>
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { onChange, value } }) => {
            // Get available tags (not already selected)
            const availableTags = tags?.data?.filter(
              (tag: TagResponse) => !value.includes(tag.id.toString())
            );

            return (
              <div className="space-y-3">
                {/* Select dropdown for adding tags */}
                <Select
                  onValueChange={(selectedTagId) => {
                    if (selectedTagId && !value.includes(selectedTagId)) {
                      onChange([...value, selectedTagId]);
                    }
                  }}
                  value="" // Always reset to empty after selection
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại học liệu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags?.length > 0 ? (
                      availableTags.map((tag: TagResponse) => (
                        <SelectItem key={tag.id} value={tag.id.toString()}>
                          <div className="flex items-center gap-2">
                            {/* <span>{tag.icon}</span> */}
                            <span>{tag.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-more" disabled>
                        Đã chọn tất cả loại học liệu
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {/* Selected tags display with remove buttons */}
                {value.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {value.map((tagId: string) => {
                      const tag = tags?.data?.find(
                        (t: TagResponse) => t.id.toString() === tagId
                      );
                      if (!tag) return null;
                      return (
                        <span
                          key={tagId}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          <span>{tag.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              onChange(
                                value.filter((id: string) => id !== tagId)
                              );
                            }}
                            className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }}
        />
        {errors.tags && (
          <p className="text-red-500 text-sm">{errors.tags.message}</p>
        )}
      </div>

      {/* Lesson Selection Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Bài học <span className="text-red-500">*</span>
        </label>
        <Controller
          name="lessonId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <LessonSelector
              value={value}
              onValueChange={onChange}
              placeholder="Chọn bài học"
            />
          )}
        />
        {errors.lessonId && (
          <p className="text-red-500 text-sm">{errors.lessonId.message}</p>
        )}
      </div>

      {/* Material File Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText size={16} />
          File đính kèm <span className="text-red-500">*</span>
        </label>
        <Controller
          name="file"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-3">
              {/* File Upload Area */}
              <div className="relative">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/avi,video/mov,video/wmv,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a,audio/mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.mp3,.wav,.ogg,.m4a"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Selected file:", {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                      });
                      onChange(file);
                    }
                  }}
                />
              </div>

              {/* Display selected file info */}
              {value &&
                typeof value === "object" &&
                "size" in value &&
                value.size > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-lg">
                      {getFileIcon(value as FileData)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-700 font-medium">
                        {value.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {formatFileSize(value.size)} •{" "}
                        {getFileCategory(value as FileData)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onChange(undefined)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}

              {/* Upload area hint */}
              <div className="text-xs text-gray-500">
                Chọn file ảnh, video, âm thanh hoặc tài liệu (tối đa 100MB)
              </div>
            </div>
          )}
        />
        {errors.file && (
          <p className="text-red-500 text-sm">
            {errors.file.message as string}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? (
            <>
              <Upload className="h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Tạo Material
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateMaterialForm;
