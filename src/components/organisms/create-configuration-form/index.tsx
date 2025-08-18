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
  configurationSchema,
  ConfigurationFormData,
  getConfigurationFileIcon,
  formatFileSize,
  getFileExtension,
  isValidConfigurationFile,
  CONFIGURATION_VALIDATION_MESSAGES,
} from "@/schemas/configuration.schema";

interface CreateConfigurationFormProps {
  onClose?: () => void;
  onSubmit?: (data: ConfigurationFormData) => void;
}

function CreateConfigurationForm({
  onClose,
  onSubmit: onSubmitProp,
}: CreateConfigurationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ConfigurationFormData>({
    resolver: zodResolver(configurationSchema),
    mode: "onSubmit", // Validate on submit and onChange after first submit
    reValidateMode: "onChange", // Re-validate on change after first submit
    defaultValues: {
      name: "",
      file: undefined,
    },
  });

  const onSubmit = async (data: ConfigurationFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Configuration form data:", data);
      console.log("Form errors:", errors);

      const formData = new FormData();
      formData.append("file", data.file as File);
      formData.append("name", data.name);

      console.log(
        "FormData entries:",
        Array.from(formData.entries()).map(([key, value]) => ({
          key,
          value: value instanceof File ? `File: ${value.name}` : value,
        }))
      );

      // Call API here when available
      // await createConfigurationMutation.mutateAsync(formData);

      toast.success("Configuration đã được tạo thành công!");
      onSubmitProp?.(data);
      onClose?.();
    } catch (error) {
      console.error("Error creating configuration:", error);
      toast.error("Có lỗi xảy ra khi tạo configuration!");
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
          Tên hướng dẫn <span className="text-red-500">*</span>
        </label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              className="bg-neutral-100 font-calsans placeholder:text-neutral-300 text-black"
              placeholder="Nhập tên huong dẫn"
            />
          )}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
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
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.pdf,.doc,.docx"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      console.log("Selected configuration file:", {
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
                      {getConfigurationFileIcon(value as File)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-700 font-medium">
                        {value.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {formatFileSize(value.size)} •{" "}
                        {/* {getFileCategory(value as FileData)} */}
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
                Chọn file PDF, DOC, DOCX (tối đa 50MB)
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
              Tạo hướng dẫn
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default CreateConfigurationForm;
