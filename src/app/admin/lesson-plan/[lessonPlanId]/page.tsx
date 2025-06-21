"use client";

import { FormBuilderContainer } from "@/components/organisms/create-lesson-plan-template";
import { Button } from "@/components/ui/Button";
import {
  useCreateFormService,
  useFormByIdService,
} from "@/services/lessonPlanServices";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { toast } from "sonner";

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ lessonPlanId: string }>;
}) {
  // ALL HOOKS MUST BE AT THE TOP - NEVER CONDITIONAL
  const { lessonPlanId } = use(params);
  const router = useRouter();
  const {
    data: lessonPlanData,
    isLoading,
    error,
  } = useFormByIdService(lessonPlanId);
  const { mutate } = useCreateFormService(); 

  const [formDefinition, setFormDefinition] = useState<any[]>([]);
  const [formMeta, setFormMeta] = useState({ name: "", description: "" });
  const [showPreview, setShowPreview] = useState(false);

  // Set form data when API data is loaded
  useEffect(() => {
    if (lessonPlanData?.data) {
      console.log("Lesson Plan Data from API:", lessonPlanData.data);

      // Set form definition if exists
      if (lessonPlanData.data.formData) {
        setFormDefinition(lessonPlanData?.data?.formData);
      }

      // Set form meta data
      setFormMeta({
        name: lessonPlanData.data.name || "",
        description: lessonPlanData.data.description || "",
      });
    }
  }, [lessonPlanId,lessonPlanData]);

  useEffect(() => {
    console.log("formDefinition:", JSON.stringify(formDefinition, null, 2));
  }, [formDefinition]);

 

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            Lỗi khi tải dữ liệu: {error.message}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handleExit = () => {
    router.back();
  };

  const handleSaveDraft = () => {
    console.log("Lưu dưới dạng nháp");
  };

  const handleSave = () => {
    try {
      const payload = {
        name: formMeta.name.trim(),
        description: formMeta.description?.trim() || "",
        formData: formDefinition,
        status: "DRAFT",
      };

      mutate(payload, {
        onSuccess: () => {
          toast.success("Tạo biểu mẫu thành công");
          router.back();
        },
        onError: (error: any) => {
          console.error(error);
          toast.error("Tạo biểu mẫu thất bại");
        },
      });
    } catch (err) {
      toast.error("Lỗi không xác định khi tạo biểu mẫu");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <FormBuilderContainer
          formMeta={formMeta}
          setFormMeta={setFormMeta}
          formDefinition={formDefinition}
          setFormDefinition={setFormDefinition}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-3 z-50">
        <Button variant="ghost" onClick={handleExit}>
          Thoát
        </Button>
        <Button variant="outline" onClick={handleSaveDraft}>
          Ghi tạm
        </Button>
        <Button onClick={handleSave}>Hoàn tất</Button>
      </div>
    </div>
  );
}
