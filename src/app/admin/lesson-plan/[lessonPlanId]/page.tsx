"use client";

import { FormBuilderContainer } from "@/components/organisms/create-lesson-plan-template";
import { Button } from "@/components/ui/Button";
import { useCreateFormService } from "@/services/lessonPlanServices";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function FormBuilderPage() {
  const [formDefinition, setFormDefinition] = useState<any[]>([]);
  const [formMeta, setFormMeta] = useState({ name: "", description: "" });
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("formDefinition:", JSON.stringify(formDefinition, null, 2));
  }, [formDefinition]);

  const handleExit = () => {
    router.back();
  };

  const handleSaveDraft = () => {
    console.log("Lưu dưới dạng nháp");
  };

  const { mutate } = useCreateFormService();

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
