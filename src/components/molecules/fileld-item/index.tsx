"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { FormField } from "@/components/ui/FormField";

const DATA_TYPES = ["text", "boolean", "array", "select"];

export function FieldItem({ field, onChange, onDelete }: any) {
  return (
    <FormField label="Trường thông tin" htmlFor="field">
      <div className="border p-3 rounded-md space-y-3 bg-white">
        <div className="flex gap-3 items-end">
          <FormField className="w-auto" label="Loại" htmlFor={field.data_type}>
            <Select
              value={field.data_type}
              onValueChange={(val) => onChange({ ...field, data_type: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATA_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Tên trường dữ liệu" htmlFor={field.field_name}>
            <Input
              placeholder="Ví dụ: school_name, age,..."
              value={field.field_name}
              required
              onChange={(e: any) =>
                onChange({ ...field, field_name: e.target.value })
              }
            />
          </FormField>
          <FormField label="Tiêu đề tùy chỉnh" htmlFor={field.label}>
            <Input
              placeholder="Ví dụ: Tên trường, Tuổi,..."
              value={field.label}
              onChange={(e: any) =>
                onChange({ ...field, label: e.target.value })
              }
            />
          </FormField>
          <Button
            className="bg-white text-neutral-400 border h-10 w-10"
            onClick={onDelete}
          >
            <X />
          </Button>
        </div>

        {field.data_type !== "array" && (
          <div className="grid grid-cols-1 gap-2">
            <FormField
              label="Giá trị mặc định"
              htmlFor={field.default_value || ""}
            >
              <Input
                asTextarea={true}
                placeholder="Nhập giá trị mặc định"
                className="pt-2"
                value={field.default_value || ""}
                onChange={(e: any) =>
                  onChange({ ...field, default_value: e.target.value })
                }
              />
            </FormField>
            <FormField label="Placeholder" htmlFor={field.default_value || ""}>
              <Input
                placeholder="Placeholder"
                value={field.placeholder || ""}
                onChange={(e: any) =>
                  onChange({ ...field, placeholder: e.target.value })
                }
              />
            </FormField>
          </div>
        )}

        {field.data_type === "array" && (
          <div className="pl-4 space-y-3">
            {(field.fields || []).map((sub: any, i: number) => (
              <FieldItem
                key={i}
                field={sub}
                onChange={(newSub: any) => {
                  const newFields = [...(field.fields || [])];
                  newFields[i] = newSub;
                  onChange({ ...field, fields: newFields });
                }}
                onDelete={() => {
                  const newFields = [...(field.fields || [])];
                  newFields.splice(i, 1);
                  onChange({ ...field, fields: newFields });
                }}
              />
            ))}
            <Button
              size="sm"
              className="bg-transparent border border-dashed text-neutral-500 p-5 w-full justify-start hover:bg-transparent hover:shadow-md"
              onClick={() =>
                onChange({
                  ...field,
                  fields: [
                    ...(field.fields || []),
                    {
                      field_name: "",
                      data_type: "text",
                      is_required: false,
                      fields: [],
                    },
                  ],
                })
              }
            >
              + Thêm trường con
            </Button>
          </div>
        )}

        {field.data_type === "select" && (
          <FormField label="Danh sách từ khoá" htmlFor="keywords">
            <div className="space-y-4 border rounded-md p-4">
              {(field.options || []).map((opt: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 pb-4 border-b-[0.5px]"
                >
                  <div className="flex items-end gap-3 ">
                    <FormField
                      label="Từ khoá"
                      htmlFor={`keyword-${i}`}
                      className="flex-1"
                    >
                      <Input
                        placeholder="Nhập từ khoá"
                        className="bg-white"
                        value={opt.title}
                        onChange={(e: any) => {
                          const updated = [...(field.options || [])];
                          updated[i].title = e.target.value;
                          onChange({ ...field, options: updated });
                        }}
                      />
                    </FormField>
                    <Button
                      className="bg-white text-neutral-400 border h-10 w-10"
                      onClick={() => {
                        const updated = [...(field.options || [])];
                        updated.splice(i, 1);
                        onChange({ ...field, options: updated });
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                  <Input
                    asTextarea
                    placeholder="Nhập câu lệnh"
                    className="bg-white pt-2"
                    value={opt.prompt}
                    onChange={(e: any) => {
                      const updated = [...(field.options || [])];
                      updated[i].prompt = e.target.value;
                      onChange({ ...field, options: updated });
                    }}
                  />
                </div>
              ))}

              <Button
                className="bg-transparent w-full h-10 border border-dashed justify-start text-neutral-500"
                onClick={() =>
                  onChange({
                    ...field,
                    options: [
                      ...(field.options || []),
                      { title: "", prompt: "" },
                    ],
                  })
                }
              >
                + Thêm lựa chọn
              </Button>
            </div>
          </FormField>
        )}
      </div>
    </FormField>
  );
}
