"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface BasicExamInfo {
  subject: string;
  grade: number;
  duration_minutes: number;
  school: string;
  exam_code: string;
  atomic_masses: string | null;
}

interface ValidationErrors {
  duration_minutes?: string;
  exam_code?: string;
}

interface BasicExamInfoProps {
  examInfo: BasicExamInfo;
  onUpdate: (info: BasicExamInfo) => void;
}

export default function BasicExamInfoComponent({
  examInfo,
  onUpdate,
}: BasicExamInfoProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (
    field: keyof BasicExamInfo,
    value: string | number
  ): string | undefined => {
    switch (field) {
      case "duration_minutes":
        const duration = typeof value === "string" ? parseInt(value) : value;
        if (isNaN(duration) || duration < 15) {
          return "Thời gian làm bài phải ít nhất 15 phút";
        }
        break;
      case "exam_code":
        const code = value.toString();
        if (!/^\d{4}$/.test(code)) {
          return "Mã đề phải là 4 chữ số";
        }
        break;
    }
    return undefined;
  };

  const handleInputChange = (
    field: keyof BasicExamInfo,
    value: string | number | null
  ) => {
    // Validate the field
    const error = validateField(field, value as string | number);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    // Update the value
    onUpdate({
      ...examInfo,
      [field]: value,
    });
  };

  return (
    <div className="border rounded-md bg-white mb-1">
      {/* Header */}
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
        <h2 className="font-calsans text-lg">Thông tin cơ bản đề thi</h2>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Môn học</Label>
              <Input
                id="subject"
                value={examInfo.subject}
                onChange={(e: any) =>
                  handleInputChange("subject", e.target.value)
                }
                placeholder="Ví dụ: Hóa học, Toán, Văn..."
              />
            </div>

            {/* Grade */}
            <div className="space-y-2">
              <Label htmlFor="grade">Khối lớp</Label>
              <Input
                id="grade"
                type="number"
                min="6"
                max="12"
                value={examInfo.grade}
                onChange={(e) =>
                  handleInputChange("grade", parseInt(e.target.value) || 6)
                }
                placeholder="Ví dụ: 10, 11, 12..."
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian làm bài (phút)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="300"
                value={examInfo.duration_minutes}
                onChange={(e: any) =>
                  handleInputChange(
                    "duration_minutes",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="Ví dụ: 45"
                className={errors.duration_minutes ? "border-red-500" : ""}
              />
              {errors.duration_minutes && (
                <p className="text-sm text-red-500">
                  {errors.duration_minutes}
                </p>
              )}
            </div>

            {/* Exam Code */}
            <div className="space-y-2">
              <Label htmlFor="exam_code">Mã đề thi</Label>
              <Input
                id="exam_code"
                type="text"
                maxLength={4}
                pattern="[0-9]{4}"
                value={examInfo.exam_code}
                onChange={(e: any) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  handleInputChange("exam_code", value);
                }}
                placeholder="1234"
                className={errors.exam_code ? "border-red-500" : ""}
              />
              {errors.exam_code && (
                <p className="text-sm text-red-500">{errors.exam_code}</p>
              )}
            </div>
          </div>

          {/* School - Full width */}
          <div className="space-y-2">
            <Label htmlFor="school">Trường học</Label>
            <Input
              id="school"
              value={examInfo.school}
              onChange={(e: any) => handleInputChange("school", e.target.value)}
              placeholder="Tên trường học (tùy chọn)"
            />
          </div>

          {/* Atomic Masses - Full width */}
          <div className="space-y-2">
            <Label htmlFor="atomic_masses">
              Dữ liệu hỗ trợ đề thi (nếu có)
            </Label>
            <Textarea
              id="atomic_masses"
              value={examInfo.atomic_masses || ""}
              onChange={(e: any) =>
                handleInputChange("atomic_masses", e.target.value || null)
              }
              placeholder="Ví dụ: H = 1; C = 12; N = 14; O = 16; Na = 23; Mg = 24; Al = 27; S = 32; Cl = 35.5; K = 39; Ca = 40; Fe = 56; Cu = 64; Zn = 65; Br = 80; Ag = 108; I = 127; Ba = 137; Pb = 207"
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Chỉ cần điền khi tạo đề thi môn Hóa học. Để trống nếu không cần
              thiết.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
