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

const DATA_TYPES = ["text", "boolean", "array", "select"];

export function FieldItem({ field, onChange, onDelete }: any) {
  return (
    <div className="border p-2 rounded-md space-y-2 bg-white">
      <div className="flex gap-2 items-center">
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
        <Input
          placeholder="Tên trường dữ liệu"
          value={field.field_name}
          required
          onChange={(e: any) =>
            onChange({ ...field, field_name: e.target.value })
          }
        />
        {field.data_type === "array" && (
          <Input
            placeholder="Tiêu đề tùy chỉnh"
            value={field.label || ""}
            onChange={(e: any) => onChange({ ...field, label: e.target.value })}
          />
        )}
        <Input
          placeholder="Key"
          value={field.field_name}
          hidden
          onChange={(e: any) =>
            onChange({ ...field, field_name: e.target.value })
          }
        />

        <Button
          className="bg-white text-neutral-400 hover:text-white border h-10 w-10"
          onClick={onDelete}
        >
          <X />
        </Button>
      </div>

      {field.data_type !== "array" && (
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Tiêu đề tùy chỉnh"
            value={field.label || ""}
            onChange={(e: any) => onChange({ ...field, label: e.target.value })}
          />
          <Input
            placeholder="Giá trị mặc định"
            value={field.default_value || ""}
            onChange={(e: any) =>
              onChange({ ...field, default_value: e.target.value })
            }
          />

          <Input
            placeholder="Placeholder"
            value={field.placeholder || ""}
            onChange={(e: any) =>
              onChange({ ...field, placeholder: e.target.value })
            }
          />
        </div>
      )}

      {field.data_type === "array" && (
        <div className="pl-4 space-y-2">
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
        <div className="space-y-2">
          <div className="font-medium">Tùy chọn Select (nhiều lựa chọn)</div>
          {(field.options || []).map((opt: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Tiêu đề"
                value={opt.title}
                onChange={(e: any) => {
                  const updated = [...field.options];
                  updated[i].title = e.target.value;
                  onChange({ ...field, options: updated });
                }}
              />
              <Input
                placeholder="Prompt"
                value={opt.prompt}
                onChange={(e: any) => {
                  const updated = [...field.options];
                  updated[i].prompt = e.target.value;
                  onChange({ ...field, options: updated });
                }}
              />
            </div>
          ))}
          <Button
            size="sm"
            onClick={() =>
              onChange({
                ...field,
                options: [...(field.options || []), { title: "", prompt: "" }],
              })
            }
          >
            + Thêm lựa chọn
          </Button>
          <div className="mt-2">
            <label className="block text-sm font-medium">
              Giá trị mặc định (dạng mảng)
            </label>
            <Input
              value={(field.default_value || []).join(", ")}
              onChange={(e: any) =>
                onChange({
                  ...field,
                  default_value: e.target.value
                    .split(",")
                    .map((s: string) => s.trim()),
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
