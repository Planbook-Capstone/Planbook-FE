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
import { ScoringConfig } from "@/types/scoring";

export interface ExamTemplateMetadata {
  name: string;
  subject: string;
  grade: number;
  durationMinutes: number;
  totalScore: number;
  description?: string;
  scoringConfig?: ScoringConfig;
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
    description: initialData?.description || "",
  });

  const handleInputChange = (field: keyof ExamTemplateMetadata, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const metadata: ExamTemplateMetadata = {
      ...formData,
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

        {/* Note about scoring */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            📝 Hệ thống chấm điểm
          </h3>
          <p className="text-sm text-blue-700">
            Điểm số sẽ được tính tự động dựa trên số câu hỏi. Mỗi câu hỏi = 0.25
            điểm.
            <br />
            Ví dụ: 40 câu hỏi = 10 điểm tối đa.
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
