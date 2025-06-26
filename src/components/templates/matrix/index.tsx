"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { FormField } from "@/components/ui/FormField";

type LevelType = "Vận dụng" | "Thông hiểu" | "Nhận biết";

type Level = {
  type: LevelType;
  questionCount: number;
  questionTypes: string[];
};

type Content = {
  lesson: string; // lessonId
  requirement: string;
  levels: Level[];
};

const SUBJECT_OPTIONS = [
  { value: "hoa", label: "Hóa học" },
  { value: "toan", label: "Toán học" },
  { value: "ly", label: "Vật lý" },
];

const GRADE_OPTIONS = [
  { value: 10, label: "Lớp 10" },
  { value: 11, label: "Lớp 11" },
  { value: 12, label: "Lớp 12" },
];

const BOOK_OPTIONS = [
  { value: "sach1", label: "Sách giáo khoa chuẩn" },
  { value: "sach2", label: "Sách nâng cao" },
];

// Data ảo cho danh sách bài học theo sách
const LESSON_OPTIONS_BY_BOOK: Record<string, { id: string; name: string }[]> = {
  sach1: [
    { id: "bai1", name: "Chương 1 - Đại cương hóa học" },
    { id: "bai2", name: "Chương 2 - Bảng tuần hoàn" },
    { id: "bai3", name: "Chương 3 - Liên kết hóa học" },
  ],
  sach2: [
    { id: "bai4", name: "Chương 1 - Hóa học nâng cao" },
    { id: "bai5", name: "Chương 2 - Phản ứng hữu cơ" },
  ],
};

const LEVEL_TYPES: LevelType[] = ["Vận dụng", "Thông hiểu", "Nhận biết"];
const QUESTION_TYPE_OPTIONS = [
  { value: "TN", label: "Trắc nghiệm" },
  { value: "TL", label: "Tự luận" },
  { value: "DS", label: "Đúng/Sai" },
  { value: "DT", label: "Điền từ" },
];

export default function ExamMatrixTable() {
  // State cho các select đầu trang
  const [subject, setSubject] = useState("hoa");
  const [grade, setGrade] = useState(12);
  const [book, setBook] = useState("sach1");
  const [totalQuestions, setTotalQuestions] = useState(20);

  // Dữ liệu bảng
  const [contents, setContents] = useState<Content[]>([
    {
      lesson: "",
      requirement: "",
      levels: LEVEL_TYPES.map((type) => ({
        type,
        questionCount: 0,
        questionTypes: [QUESTION_TYPE_OPTIONS[0].value],
      })),
    },
  ]);

  // Khi đổi sách thì reset lại danh sách bài học đã chọn
  React.useEffect(() => {
    setContents([
      {
        lesson: "",
        requirement: "",
        levels: LEVEL_TYPES.map((type) => ({
          type,
          questionCount: 0,
          questionTypes: [QUESTION_TYPE_OPTIONS[0].value],
        })),
      },
    ]);
  }, [book]);

  const LESSON_OPTIONS = LESSON_OPTIONS_BY_BOOK[book] || [];

  const handleContentChange = (
    idx: number,
    field: keyof Content,
    value: any
  ) => {
    const updated = contents.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    setContents(updated);
  };

  const handleLevelChange = (
    contentIdx: number,
    levelIdx: number,
    field: keyof Level,
    value: any
  ) => {
    setContents((prev) =>
      prev.map((c, i) => {
        if (i !== contentIdx) return c;
        const newLevels = c.levels.map((lv, j) =>
          j === levelIdx ? { ...lv, [field]: value } : lv
        );
        return { ...c, levels: newLevels };
      })
    );
  };

  const addContent = () => {
    setContents([
      ...contents,
      {
        lesson: "",
        requirement: "",
        levels: LEVEL_TYPES.map((type) => ({
          type,
          questionCount: 0,
          questionTypes: [QUESTION_TYPE_OPTIONS[0].value],
        })),
      },
    ]);
  };

  const removeContent = (idx: number) => {
    setContents(contents.filter((_, i) => i !== idx));
  };

  // Dummy AI suggest handler
  const handleAISuggest = (idx: number) => {
    handleContentChange(
      idx,
      "requirement",
      "AI gợi ý: Đạt chuẩn kiến thức, kỹ năng."
    );
  };

  // Mapping sang format backend
  function mapToBackend() {
    return {
      mon_hoc: SUBJECT_OPTIONS.find((s) => s.value === subject)?.label || "",
      lop: grade,
      tong_so_cau: totalQuestions,
      chi_tiet_de: contents
        .filter((c) => c.lesson)
        .map((content) => ({
          lesson_id: content.lesson,
          cau_hinh_de: {
            yeu_cau_can_dat: content.requirement,
            muc_do: content.levels.map((level) => ({
              loai: level.type,
              so_cau: level.questionCount,
              loai_cau: level.questionTypes,
            })),
          },
        })),
    };
  }

  return (
    <div className="max-w-full mx-auto p-12">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <FormField label="Môn học" htmlFor="subject-select">
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger id="subject-select" className="w-full min-h-[40px]">
              <SelectValue placeholder="Chọn môn học" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Lớp" htmlFor="grade-select">
          <Select
            value={String(grade)}
            onValueChange={(val) => setGrade(Number(val))}
          >
            <SelectTrigger id="grade-select" className="w-full min-h-[40px]">
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent>
              {GRADE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Sách" htmlFor="book-select">
          <Select value={book} onValueChange={setBook}>
            <SelectTrigger id="book-select" className="w-full min-h-[40px]">
              <SelectValue placeholder="Chọn sách" />
            </SelectTrigger>
            <SelectContent>
              {BOOK_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Tổng số câu" htmlFor="total-questions">
          <Input
            id="total-questions"
            type="number"
            min={1}
            value={totalQuestions}
            onChange={(e: any) => setTotalQuestions(Number(e.target.value))}
            placeholder="Tổng số câu"
            className="w-full min-h-[40px]"
          />
        </FormField>
      </div>
      <h2 className="text-lg font-calsans mb-4">Ma trận đề thi</h2>
      <table className="w-full text-center rounded-md">
        <thead className="font-calsans text-base">
          <tr>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Bài học</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Yêu cầu cần đạt</span>
            </th>
            <th className="border px-2 py-4" colSpan={6}>
              <span className="font-normal">Mức độ tư duy</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Thao tác</span>
            </th>
          </tr>
          <tr>
            {LEVEL_TYPES.map((type) => (
              <React.Fragment key={type}>
                <th className="border px-2 py-3">
                  <span className="font-normal">{type}</span>
                </th>
                <th className="border px-2 py-3">
                  <span className="font-normal">Loại câu</span>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="font-questrial text-base">
          {contents.map((content, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">
                <Select
                  value={content.lesson}
                  onValueChange={(val: any) =>
                    handleContentChange(idx, "lesson", val)
                  }
                >
                  <SelectTrigger className="w-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none">
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_OPTIONS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="border px-2 py-1 min-w-[200px]">
                <div className="flex gap-2 items-start relative">
                  <Textarea
                    value={content.requirement}
                    onChange={(e: any) =>
                      handleContentChange(idx, "requirement", e.target.value)
                    }
                    placeholder="Nhập yêu cầu cần đạt"
                    rows={2}
                    className="w-full h-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none resize-none"
                  />
                  <Button
                    size="icon"
                    className="absolute top-0 right-0 bg-transparent hover:bg-transparent hover:shadow-none shadow-none"
                    onClick={() => handleAISuggest(idx)}
                    title="AI gợi ý"
                  >
                    <Sparkles className="text-yellow-400" />
                  </Button>
                </div>
              </td>
              {LEVEL_TYPES.map((type, levelIdx) => (
                <React.Fragment key={type}>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      min={0}
                      value={content.levels[levelIdx]?.questionCount || 0}
                      onChange={(e: any) =>
                        handleLevelChange(
                          idx,
                          levelIdx,
                          "questionCount",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Số câu"
                      className="w-full h-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none"
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <Select
                      value={content.levels[levelIdx]?.questionTypes[0] || ""}
                      onValueChange={(val: any) =>
                        handleLevelChange(idx, levelIdx, "questionTypes", [val])
                      }
                    >
                      <SelectTrigger className="w-full h-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none">
                        <SelectValue placeholder="Loại câu" />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                </React.Fragment>
              ))}
              <td className="border px-2 py-1">
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  onClick={() => removeContent(idx)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        variant="dash"
        size="sm"
        type="button"
        className="mt-4"
        onClick={addContent}
      >
        Thêm dòng
      </Button>
      <hr className="my-6" />
      <h3 className="font-bold mb-2">Exam Matrix JSON</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(mapToBackend(), null, 2)}
      </pre>
    </div>
  );
}
