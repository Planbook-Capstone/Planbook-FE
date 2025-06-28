"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import BookSelector from "@/components/molecules/book-selector";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { FormField } from "@/components/ui/FormField";

// Dữ liệu ảo cho bài học, bạn có thể thay bằng API nếu cần
const LESSON_OPTIONS = [
  { id: "bai1", name: "Hình học Oxyz" },
  { id: "bai2", name: "Hàm số" },
  { id: "bai3", name: "Tích phân" },
];

type DistributionLevel = {
  biet: number;
  hieu: number;
  vd: number;
};

type MatrixRow = {
  lessonID: string;
  distribution: {
    part1: DistributionLevel;
    part2: DistributionLevel;
    part3: DistributionLevel;
  };
  total: number;
};

export default function MatrixTemplate2() {
  // State cho chọn trường, lớp, môn
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [school, setSchool] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState(45);

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  // Nếu muốn chọn sách thì mở dòng dưới, còn không thì bỏ qua
  // const { data: books } = useBooksBySubjectService(selectedSubject, { enabled: !!selectedSubject });

  // State cho bảng matrix
  const [matrix, setMatrix] = useState<MatrixRow[]>([
    {
      lessonID: "",
      distribution: {
        part1: { biet: 0, hieu: 0, vd: 0 },
        part2: { biet: 0, hieu: 0, vd: 0 },
        part3: { biet: 0, hieu: 0, vd: 0 },
      },
      total: 0,
    },
  ]);

  // Xử lý thay đổi matrix
  const handleMatrixChange = (
    idx: number,
    field: keyof MatrixRow,
    value: any
  ) => {
    setMatrix((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleDistributionChange = (
    rowIdx: number,
    part: "part1" | "part2" | "part3",
    level: keyof DistributionLevel,
    value: number
  ) => {
    setMatrix((prev) =>
      prev.map((row, i) =>
        i === rowIdx
          ? {
              ...row,
              distribution: {
                ...row.distribution,
                [part]: {
                  ...row.distribution[part],
                  [level]: value,
                },
              },
            }
          : row
      )
    );
  };

  const addMatrixRow = () => {
    setMatrix([
      ...matrix,
      {
        lessonID: "",
        distribution: {
          part1: { biet: 0, hieu: 0, vd: 0 },
          part2: { biet: 0, hieu: 0, vd: 0 },
          part3: { biet: 0, hieu: 0, vd: 0 },
        },
        total: 0,
      },
    ]);
  };

  const removeMatrixRow = (idx: number) => {
    setMatrix(matrix.filter((_, i) => i !== idx));
  };

  // Map ra JSON đúng format
  function mapToBackend() {
    return {
      school,
      grade: selectedGrade,
      subject: selectedSubject,
      examTitle,
      duration: Number(duration),
      matrix: matrix.map((row) => ({
        lessonID: row.lessonID,
        total: row.total,
        distribution: [
          { part: 1, levels: row.distribution.part1 },
          { part: 2, levels: row.distribution.part2 },
          { part: 3, levels: row.distribution.part3 },
        ],
      })),
    };
  }

  return (
    <div className="max-w-full mx-auto px-12">
      <div className="mb-4">
        <BookSelector
          title="Vui lòng chọn sách"
          gradeOptions={grades?.data?.content || []}
          subjectOptions={subjects?.data?.content || []}
          bookOptions={[]} // Không cần chọn sách ở đây
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          selectedBook={""}
          onGradeChange={setSelectedGrade}
          onSubjectChange={setSelectedSubject}
          onBookChange={() => {}}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 font-questrial">
        <FormField label="Tên trường" htmlFor="school-input">
          <Input
            id="school-input"
            value={school}
            onChange={(e: any) => setSchool(e.target.value)}
            placeholder="Trường ABC"
          />
        </FormField>
        <FormField label="Tên đề kiểm tra" htmlFor="exam-title-input">
          <Input
            id="exam-title-input"
            value={examTitle}
            onChange={(e: any) => setExamTitle(e.target.value)}
            placeholder="Kiểm tra giữa kỳ 1"
          />
        </FormField>
        <FormField label="Thời gian (phút)" htmlFor="duration-input">
          <Input
            id="duration-input"
            type="number"
            value={duration}
            min={1}
            onChange={(e: any) => setDuration(Number(e.target.value))}
          />
        </FormField>
      </div>
      <div className="mb-4 mt-6">
        <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông hiểu,
          vận dụng
        </h3>
      </div>
      <table className="w-full text-center rounded-md border mb-4">
        <thead className="font-calsans text-base">
          <tr>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Bài học</span>
            </th>
            <th className="border px-2 py-4 align-middle" colSpan={3}>
              <span className="font-normal">Phần 1</span>
            </th>
            <th className="border px-2 py-4 align-middle" colSpan={3}>
              <span className="font-normal">Phần 2</span>
            </th>
            <th className="border px-2 py-4 align-middle" colSpan={3}>
              <span className="font-normal">Phần 3</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Tổng số câu</span>
            </th>
            <th className="border px-2 py-4 align-middle" rowSpan={2}>
              <span className="font-normal">Thao tác</span>
            </th>
          </tr>
          <tr>
            {[1, 2, 3].map(() => (
              <React.Fragment key={Math.random()}>
                <th className="border px-2 py-2">
                  <span className="font-normal">NB</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">TH</span>
                </th>
                <th className="border px-2 py-2">
                  <span className="font-normal">VD</span>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIdx) => (
            <tr key={rowIdx} className="font-questrial">
              <td className="border px-2 py-1 min-w-[180px]">
                <Select
                  value={row.lessonID}
                  onValueChange={(val) =>
                    handleMatrixChange(rowIdx, "lessonID", val)
                  }
                >
                  <SelectTrigger className="w-full min-h-[40px] bg-transparent focus:ring-0 focus:outline-none">
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_OPTIONS.map((item) => (
                      <SelectItem key={item.id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              {(["part1", "part2", "part3"] as const).map((part) =>
                (["biet", "hieu", "vd"] as const).map((level) => (
                  <td className="border px-2 py-1" key={part + level}>
                    <Input
                      type="number"
                      min={0}
                      value={row.distribution[part][level]}
                      onChange={(e: any) =>
                        handleDistributionChange(
                          rowIdx,
                          part,
                          level,
                          Number(e.target.value)
                        )
                      }
                      placeholder={level.toUpperCase()}
                    />
                  </td>
                ))
              )}
              <td className="border px-2 py-1">
                <Input
                  type="number"
                  min={0}
                  value={row.total}
                  onChange={(e: any) =>
                    handleMatrixChange(rowIdx, "total", Number(e.target.value))
                  }
                  placeholder="Tổng số câu"
                />
              </td>
              {/* Thao tác */}
              <td className="border px-2 py-1">
                <Button
                  size="sm"
                  type="button"
                  className="px-0 py-5 bg-transparent shadow-none hover:bg-transparent hover:shadow-none"
                  onClick={() => removeMatrixRow(rowIdx)}
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
        onClick={addMatrixRow}
      >
        Thêm dòng mới +
      </Button>
      <hr className="my-6" />
      <h3 className="font-bold mb-2">Matrix JSON</h3>
      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
        {JSON.stringify(mapToBackend(), null, 2)}
      </pre>
    </div>
  );
}
