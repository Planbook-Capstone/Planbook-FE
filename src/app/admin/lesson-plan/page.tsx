"use client";
import { FormBuilderCanvas } from "@/components/organisms/form-builder";
import { FormPreview } from "@/components/organisms/form-preview";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function FormBuilderPage() {
  const [formDefinition, setFormDefinition] = useState<any[]>([]);
  const [formMeta, setFormMeta] = useState({ name: "", description: "" });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    console.log("formDefinition:", JSON.stringify(formDefinition, null, 2));
  }, [formDefinition]);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <FormField label="Tên biểu mẫu" htmlFor="form-name">
          <Input
            id="form-name"
            placeholder="Nhập tên biểu mẫu"
            value={formMeta.name}
            onChange={(e) => setFormMeta({ ...formMeta, name: e.target.value })}
          />
        </FormField>

        <FormField label="Mô tả biểu mẫu" htmlFor="form-description">
          <Input
            id="form-description"
            placeholder="Nhập mô tả"
            value={formMeta.description}
            onChange={(e) =>
              setFormMeta({ ...formMeta, description: e.target.value })
            }
          />
        </FormField>
      </div>

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
