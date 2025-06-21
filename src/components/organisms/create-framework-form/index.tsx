"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { frameworkSchema, type FrameworkFormData } from "@/schemas";
import { useState } from "react";
import { useLessonPlanFrameworkService } from "@/services/frameworkServices";

interface CreateFrameworkFormProps {
  onClose?: () => void;
}

function CreateFrameworkForm({ onClose }: CreateFrameworkFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, isPending } = useLessonPlanFrameworkService();
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FrameworkFormData>({
    resolver: zodResolver(frameworkSchema),
    defaultValues: {
      framework_name: "",
      framework_file:
        typeof File !== "undefined" ? new File([], "") : (null as any),
    },
  });

  const watchedFile = watch("framework_file");

  const onSubmit = async (data: FrameworkFormData) => {
    console.log("Received values of form:", data);
    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("framework_name", data.framework_name.trim());
      formData.append("framework_file", data.framework_file);

      mutate(formData, {
        onSuccess: (res) => {
          console.log(res)
          toast.success(res?.data?.message || "Tạo framework thành công!");
          reset({
            framework_name: "",
            framework_file:
              typeof File !== "undefined" ? new File([], "") : (null as any),
          });
          onClose?.();
        },
        onError: (error: any) => {
          console.error("API Error:", error);
          toast.error(
            error.response?.data?.message || "Tạo framework thất bại"
          );
        },
      });
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data || "Tạo framework thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Framework Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Tên Framework <span className="text-red-500">*</span>
        </label>
        <Controller
          name="framework_name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="bg-neutral-100 font-calsans placeholder:text-neutral-300 text-black"
              placeholder="Nhập tên framework"
            />
          )}
        />
        {errors.framework_name && (
          <p className="text-red-500 text-sm">
            {errors.framework_name.message}
          </p>
        )}
      </div>

      {/* Framework File Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText size={16} />
          File Framework <span className="text-red-500">*</span>
        </label>
        <Controller
          name="framework_file"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-3">
              {/* File Upload Area */}
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file type
                      const allowedTypes = [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        // "text/plain",
                      ];
                      if (!allowedTypes.includes(file.type)) {
                        toast.error("Chỉ được upload file PDF, DOC, DOCX");
                        e.target.value = "";
                        return;
                      }
                      // Validate file size (50MB)
                      if (file.size > 50 * 1024 * 1024) {
                        toast.error("File phải nhỏ hơn 50MB!");
                        e.target.value = "";
                        return;
                      }
                      onChange(file);
                    }
                  }}
                  // className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                />
              </div>

              {/* Display selected file info */}
              {value && value.size > 0 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <FileText size={16} className="text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-green-700 font-medium">
                      {value.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {(value.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onChange(
                        typeof File !== "undefined" ? new File([], "") : null
                      )
                    }
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-800"
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}

              {/* Upload area hint */}
              <div className="text-xs text-gray-500">
                Chọn file PDF, DOC, DOCX hoặc TXT (tối đa 50MB)
              </div>
            </div>
          )}
        />
        {errors.framework_file && (
          <p className="text-red-500 text-sm">
            {errors.framework_file.message as string}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isPending}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Upload className="h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Upload className=" h-4 w-4" />
              Tạo Framework
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateFrameworkForm;
