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
import { Sparkles, TrashIcon } from "lucide-react";
import { FormField } from "@/components/ui/FormField";

import { useExamGenerationService } from "@/services/examGenerateServices";

import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import BookSelector from "@/components/molecules/book-selector";


type LevelType = "Vận dụng" | "Thông hiểu" | "Nhận biết";

type Level = {
  type: LevelType;
  questionCount: number;
  questionTypes: string[];
};

type Content = {
  lesson: string;
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
    { id: "1", name: "Chương 1 - Đại cương hóa học" },
    { id: "2", name: "Chương 2 - Bảng tuần hoàn" },
    { id: "3", name: "Chương 3 - Liên kết hóa học" },
  ],
  sach2: [
    { id: "4", name: "Chương 1 - Hóa học nâng cao" },
    { id: "5", name: "Chương 2 - Phản ứng hữu cơ" },
  ],
};
export default function ExamMatrixTable() {
  // State cho chọn sách
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");


  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject,
  });

  // State cho bảng ma trận
  const LEVEL_TYPES: LevelType[] = ["Vận dụng", "Thông hiểu", "Nhận biết"];
  const QUESTION_TYPE_OPTIONS = [
    { value: "TN", label: "Trắc nghiệm" },
    { value: "TL", label: "Tự luận" },
    { value: "DS", label: "Đúng/Sai" },
    { value: "DT", label: "Điền từ" },
  ];

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
  }, [selectedBook]);

  const LESSON_OPTIONS: any[] = []; // TODO: Lấy từ API nếu có

  // function mapToBackend() {
  //   const result = {
  //     mon_hoc:
  //       subjects?.data?.content?.find((s: any) => s.id === selectedSubject)
  //         ?.name || "",
  //     lop:
  //       grades?.data?.content?.find((g: any) => g.id === selectedGrade)?.name ||
  //       "",
  //     tong_so_cau:
  //       books?.data?.content?.find((b: any) => b.id === selectedBook)
  //         ?.totalQuestions || "",
  //     cau_hinh_de: contents.map((content) => ({
  //       lesson_id: content.lesson,
  //       yeu_cau_can_dat: content.requirement,
  //       muc_do: content.levels.map((level) => ({
  //         loai: level.type,
  //         so_cau: level.questionCount,
  //         loai_cau: level.questionTypes,
  //       })),
  //     })),
  //   };
  //   console.log("mapToBackend called", result);
  //   return result;
  // }

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

  const handleAISuggest = (idx: number) => {
    handleContentChange(
      idx,
      "requirement",
      "AI gợi ý: Đạt chuẩn kiến thức, kỹ năng."
    );
  };


  function mapToBackend() {
    // return {
    //   ten_truong: "Trường THPT Nguyễn Huệ", // hoặc cho user nhập nếu muốn
    //   mon_hoc: SUBJECT_OPTIONS.find((s) => s.value === subject)?.label || "",
    //   lop: grade,
    //   tong_so_cau: totalQuestions,
    //   cau_hinh_de: contents
    //     .filter((c) => c.lesson)
    //     .map((content) => ({
    //       lesson_id: content.lesson,
    //       yeu_cau_can_dat: content.requirement,
    //       muc_do: content.levels.map((level) => ({
    //         loai: level.type,
    //         so_cau: level.questionCount,
    //         loai_cau: level.questionTypes,
    //       })),
    //     })),
    // };
    return {
      exam_id: "hoa12_de_60cau",
      ten_truong: "Trường THPT Nguyễn Huệ",
      mon_hoc: "Hóa học",
      lop: 12,
      tong_so_cau: 60,
      cau_hinh_de: [
        {
          lesson_id: "234",
          yeu_cau_can_dat:
            "Hiểu và phân biệt proton, neutron, electron theo khối lượng, điện tích và vị trí.",
          muc_do: [
            { loai: "Nhận biết", so_cau: 10, loai_cau: ["TN"] },
            { loai: "Thông hiểu", so_cau: 5, loai_cau: ["TN"] },
            { loai: "Vận dụng", so_cau: 5, loai_cau: ["TN"] },
          ],
        },
        {
          lesson_id: "235",
          yeu_cau_can_dat:
            "Viết và xác định cấu hình electron các nguyên tố từ Z = 1 đến Z = 30.",
          muc_do: [
            { loai: "Nhận biết", so_cau: 5, loai_cau: ["TN"] },
            { loai: "Thông hiểu", so_cau: 10, loai_cau: ["TN"] },
            { loai: "Vận dụng", so_cau: 5, loai_cau: ["TN"] },
          ],
        },
        {
          lesson_id: "236",
          yeu_cau_can_dat: "Tính nguyên tử khối trung bình từ dữ liệu đồng vị.",
          muc_do: [
            { loai: "Nhận biết", so_cau: 5, loai_cau: ["TN"] },
            { loai: "Thông hiểu", so_cau: 10, loai_cau: ["TN"] },
            { loai: "Vận dụng", so_cau: 5, loai_cau: ["TN"] },
          ],
        },
      ],
    };
  }

  const {
    mutate: generateExam,
    isPending,
    data,
    error,
  } = useExamGenerationService();


  return (
    <div className="max-w-full mx-auto px-12">
      <BookSelector
        title="Vui lòng chọn sách"
        gradeOptions={grades?.data?.content || []}
        subjectOptions={subjects?.data?.content || []}
        bookOptions={books?.data?.content || []}
        selectedGrade={selectedGrade}
        selectedSubject={selectedSubject}
        selectedBook={selectedBook}
        onGradeChange={setSelectedGrade}
        onSubjectChange={setSelectedSubject}
        onBookChange={setSelectedBook}
      />
      <div className="mb-4 mt-6">
        <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông hiểu,
          vận dụng
        </h3>
      </div>

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
                    <Sparkles className="text-neutral-400" />
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
                  size="sm"
                  type="button"
                  className="px-0 py-5 bg-transparent shadow-none hover:bg-transparent hover:shadow-none"
                  onClick={() => removeContent(idx)}
                >
                  <TrashIcon className="text-neutral-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        variant="dash"
        type="button"
        className="mt-4 rounded-md w-full"
        onClick={addContent}
      >
        Thêm dòng mới +
      </Button>
      <Button onClick={() => generateExam(mapToBackend())} disabled={isPending}>
        Gửi dữ liệu sinh đề
      </Button>
      {error && <div className="text-red-500">Có lỗi: {error.message}</div>}
      {data && <div className="text-green-600">Tạo đề thành công!</div>}
      <hr className="my-6" />
      <h3 className="font-bold mb-2">Exam Matrix JSON</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(mapToBackend(), null, 2)}
      </pre>
    </div>
  );
}
