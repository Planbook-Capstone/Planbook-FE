"use client";

import { FormBuilderContainer } from "@/components/organisms/create-lesson-plan-template";
import { Button } from "@/components/ui/Button";
import {
  useCreateFormService,
  useFormsService,
} from "@/services/lessonPlanServices";
import { Form } from "antd";
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

  const handleSave = async () => {
    try {
      const payload = {
        name: formMeta.name.trim(),
        description: formMeta.description?.trim() || "",
        definition: formDefinition,
      };

      await mutate(payload, {
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

  const { mutate } = useCreateFormService();
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    mutate(values, {
      onSuccess: () => {
        toast.success("Đăng nhập thành công");
      },
      onError: () => {
        toast.error(
          "Đăng nhập thất bại.Vui lòng kiểm tra kĩ thông tin đăng nhập"
        );
      },
    });
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
