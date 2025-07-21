"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export interface ExamTemplateMetadata {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  gradingConfig: Record<string, number>;
  description?: string;
}

interface ExamTemplateMetadataFormProps {
  onSubmit: (metadata: ExamTemplateMetadata) => void;
  onCancel: () => void;
  initialData?: Partial<ExamTemplateMetadata>;
}

export default function ExamTemplateMetadataForm({
  onSubmit,
  onCancel,
  initialData,
}: ExamTemplateMetadataFormProps) {
  const [formData, setFormData] = useState<ExamTemplateMetadata>({
    name: initialData?.name || "",
    subject: initialData?.subject || "",
    grade: initialData?.grade || 10,
    durationMinutes: initialData?.durationMinutes || 90,
    totalScore: initialData?.totalScore || 10,
    gradingConfig: initialData?.gradingConfig || {},
    description: initialData?.description || "",
  });

  const [gradingParts, setGradingParts] = useState<
    Array<{ part: string; weight: number }>
  >(() => {
    if (
      initialData?.gradingConfig &&
      Object.keys(initialData.gradingConfig).length > 0
    ) {
      return Object.entries(initialData.gradingConfig).map(
        ([part, weight]) => ({
          part,
          weight,
        })
      );
    }
    // Default grading config
    return [
      { part: "PHẦN I", weight: 0.25 },
      { part: "PHẦN II", weight: 1.0 },
      { part: "PHẦN III", weight: 0.25 },
    ];
  });

  const handleInputChange = (field: keyof ExamTemplateMetadata, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddGradingPart = () => {
    setGradingParts((prev) => [
      ...prev,
      { part: `PHẦN ${prev.length + 1}`, weight: 1.0 },
    ]);
  };

  const handleRemoveGradingPart = (index: number) => {
    if (gradingParts.length > 1) {
      setGradingParts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleGradingPartChange = (
    index: number,
    field: "part" | "weight",
    value: string | number
  ) => {
    setGradingParts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert grading parts to gradingConfig object
    const gradingConfig = gradingParts.reduce((acc, { part, weight }) => {
      if (part.trim()) {
        acc[part.trim()] = weight;
      }
      return acc;
    }, {} as Record<string, number>);

    const metadata: ExamTemplateMetadata = {
      ...formData,
      gradingConfig,
    };

    onSubmit(metadata);
  };

  const subjects = [
    "Toán học",
    "Vật lý",
    "Hóa học",
    "Sinh học",
    "Ngữ văn",
    "Lịch sử",
    "Địa lý",
    "Tiếng Anh",
    "Giáo dục công dân",
    "Tin học",
  ];

  const grades = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-calsans mb-2">
          Thông Tin Template Đề Thi
        </h2>
        <p className="text-gray-600">
          Nhập thông tin cơ bản cho template đề thi. Template này có thể được sử
          dụng để tạo nhiều đề thi khác nhau.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-calsans">Thông tin cơ bản</h3>

          <FormField label="Tên template" required>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ví dụ: Template Kiểm tra Hóa học - Cấu trúc nguyên tử"
              required
            />
          </FormField>

          <FormField label="Môn học" required>
            <Select
              value={formData.subject}
              onValueChange={(value) => handleInputChange("subject", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Khối lớp" required>
              <Select
                value={formData.grade.toString()}
                onValueChange={(value) =>
                  handleInputChange("grade", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khối" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Lớp {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Thời gian (phút)" required>
              <Input
                type="number"
                value={formData.durationMinutes}
                onChange={(e) =>
                  handleInputChange("durationMinutes", parseInt(e.target.value))
                }
                min="1"
                required
              />
            </FormField>
          </div>

          <FormField label="Tổng điểm" required>
            <Input
              type="number"
              step="0.1"
              value={formData.totalScore}
              onChange={(e) =>
                handleInputChange("totalScore", parseFloat(e.target.value))
              }
              min="0.1"
              required
            />
          </FormField>

          <FormField label="Mô tả">
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Mô tả ngắn về template này..."
              rows={3}
            />
          </FormField>
        </div>

        {/* Grading Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-calsans">Cấu hình điểm số</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddGradingPart}
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm phần
            </Button>
          </div>

          <div className="space-y-3">
            {gradingParts.map((part, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    value={part.part}
                    onChange={(e) =>
                      handleGradingPartChange(index, "part", e.target.value)
                    }
                    placeholder="Tên phần (ví dụ: PHẦN I)"
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={part.weight}
                    onChange={(e) =>
                      handleGradingPartChange(
                        index,
                        "weight",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="Trọng số"
                  />
                </div>
                {gradingParts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveGradingPart(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            Trọng số xác định tỷ lệ điểm của từng phần trong tổng điểm cuối
            cùng.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">Tiếp tục tạo template</Button>
        </div>
      </form>
    </div>
  );
}
