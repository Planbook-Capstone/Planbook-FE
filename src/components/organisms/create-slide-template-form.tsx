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
import { Loader2, Image, Type, Plus } from "lucide-react";
import { Upload, Image as AntImage } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// Helper function to convert file to base64
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Validation schema
const slideTemplateSchema = z.object({
  name: z.string().min(1, "Tên template là bắt buộc"),
  description: z.string().optional(),
});

type SlideTemplateFormData = z.infer<typeof slideTemplateSchema>;

interface CreateSlideTemplateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (tempData: {
    name: string;
    description?: string;
    imageBlocks?: Record<string, string>;
  }) => void;
}

export default function CreateSlideTemplateForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateSlideTemplateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

      // Convert uploaded files to base64 and create imageBlocks
      const imageBlocks: Record<string, string> = {};

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.originFileObj) {
          try {
            const base64 = await getBase64(file.originFileObj as FileType);
            // Auto-generate key: image_1, image_2, etc.
            const key = `image_${i + 1}`;
            imageBlocks[key] = base64;
          } catch (error) {
            console.error(
              `Error converting file ${file.name} to base64:`,
              error
            );
          }
        } else if (file.url) {
          // For existing images (if any)
          const key = `image_${i + 1}`;
          imageBlocks[key] = file.url;
        }
      }

      // Prepare temp data (không POST API ngay, chỉ pass data tạm)
      const tempData = {
        name: data.name,
        description: data.description,
        imageBlocks:
          Object.keys(imageBlocks).length > 0 ? imageBlocks : undefined,
      };

      toast.success("Chuyển đến slide editor để thiết kế...");
      reset();
      setFileList([]);
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

  // Upload handlers
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: FileType) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      toast.error("Chỉ có thể upload file ảnh!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      toast.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }

    return false; // Prevent auto upload, we'll handle it manually
  };

  const handleClose = () => {
    reset();
    setFileList([]);
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

          {/* Note about Text Blocks */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Type className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-calsans text-sm font-medium text-blue-900 mb-1">
                  Khối văn bản sẽ được thêm sau
                </h4>
                <p className="text-sm text-blue-700 font-questrial">
                  Sau khi tạo template, bạn sẽ được chuyển đến slide editor để
                  thiết kế và thêm nội dung văn bản.
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="font-calsans text-lg text-gray-900 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Upload hình ảnh
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-questrial">
                Upload các hình ảnh cho template. Ảnh sẽ được tự động chuyển
                thành base64 và tạo key (image_1, image_2, ...).
              </p>

              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                multiple
                accept="image/*"
                className="upload-list-inline"
              >
                {fileList.length >= 8 ? null : (
                  <button
                    style={{ border: 0, background: "none" }}
                    type="button"
                  >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </button>
                )}
              </Upload>

              <p className="text-xs text-gray-500 font-questrial">
                Tối đa 8 ảnh, mỗi ảnh không quá 5MB. Hỗ trợ: JPG, PNG, GIF, WebP
              </p>
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

      {/* Image Preview Modal */}
      {previewImage && (
        <AntImage
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Dialog>
  );
}
