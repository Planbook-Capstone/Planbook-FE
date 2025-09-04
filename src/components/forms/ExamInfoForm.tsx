"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ExamInfo {
  school: string;
  grade: string;
  subject: string;
  examTitle: string;
  duration: number;
  numberOfExams: number;
}

interface ExamInfoFormProps {
  examInfo: ExamInfo;
  onExamInfoChange: (field: keyof ExamInfo, value: string | number) => void;
}

function ExamInfoForm({ examInfo, onExamInfoChange }: ExamInfoFormProps) {
  return (
    <div className="space-y-4">
      {/* School */}
      <div className="space-y-2">
        <Label htmlFor="school">Trường học</Label>
        <Input
          id="school"
          type="text"
          value={examInfo.school}
          onChange={(e: any) => onExamInfoChange("school", e.target.value)}
          placeholder="Tên trường học"
        />
      </div>

      {/* Exam Title */}
      <div className="space-y-2">
        <Label htmlFor="examTitle">Tiêu đề đề thi</Label>
        <Input
          id="examTitle"
          type="text"
          value={examInfo.examTitle}
          onChange={(e: any) => onExamInfoChange("examTitle", e.target.value)}
          placeholder="Ví dụ: Kiểm tra 15 phút, Kiểm tra giữa kỳ..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* Grade */}
        <div className="space-y-2">
          <Label htmlFor="grade">Khối lớp</Label>
          <Input
            id="grade"
            type="text"
            value={examInfo.grade}
            onChange={(e: any) => onExamInfoChange("grade", e.target.value)}
            placeholder="12"
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Môn học</Label>
          <Input
            id="subject"
            type="text"
            value={examInfo.subject}
            onChange={(e: any) => onExamInfoChange("subject", e.target.value)}
            placeholder="Hoa_hoc"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration">Thời gian (phút)</Label>
          <Input
            id="duration"
            type="number"
            value={examInfo.duration}
            onChange={(e: any) => {
              const value = parseInt(e.target.value) || 0;
              // Giới hạn giá trị tối thiểu là 1 phút
              const clampedValue = Math.max(value, 1);
              onExamInfoChange("duration", clampedValue);
            }}
            placeholder="90"
            min="1"
          />
        </div>

        {/* Number of Exams */}
        <div className="space-y-2">
          <Label htmlFor="numberOfExams">Số đề muốn tạo</Label>
          <Input
            id="numberOfExams"
            type="number"
            value={examInfo.numberOfExams}
            onChange={(e: any) => {
              const value = parseInt(e.target.value);
              // Giới hạn giá trị từ 1 đến 50
              const clampedValue = Math.min(Math.max(value, 1), 50);
              onExamInfoChange("numberOfExams", clampedValue);
            }}
            placeholder="1"
            min="1"
            max="50"
          />
        </div>
      </div>
    </div>
  );
}

export default ExamInfoForm;
