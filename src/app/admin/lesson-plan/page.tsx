"use client";

import { FormBuilderCanvas } from "@/components/organisms/form-builder";
import { FormPreview } from "@/components/organisms/form-preview";
import { Button } from "@/components/ui/Button";
import { EyeClosed, EyeIcon, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function FormBuilderPage() {
  const [formDefinition, setFormDefinition] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log("formDefinition:", JSON.stringify(formDefinition, null, 2));
  }, [formDefinition]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setFormDefinition([
                ...formDefinition,
                { group_name: "", fields: [] },
              ]);
            }}
          >
            + Thêm nhóm mới
          </Button>

          <Button
            onClick={() => {
              const json = JSON.stringify(formDefinition, null, 2);
              console.log("Exported JSON:", json);
              alert("Cấu hình đã log ra console.");
            }}
          >
            Lưu cấu hình
          </Button>
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? (
            <div className="flex gap-2 items-center">
              <EyeOff /> Ẩn xem trước
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <EyeIcon /> Xem trước
            </div>
          )}
        </Button>
      </div>

      {showPreview ? (
        <FormPreview config={formDefinition} />
      ) : (
        <FormBuilderCanvas
          groups={formDefinition}
          onChange={setFormDefinition}
        />
      )}
    </div>
  );
}
