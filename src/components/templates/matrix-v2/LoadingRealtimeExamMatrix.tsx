"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Edit, Save } from "lucide-react";
import Image from "next/image";
import {
  calculateRowTotal,
  calculateColumnTotals,
  type MatrixRow,
} from "./validation";
import TemplatePreview from "@/components/organisms/template-preview";
import { DowloadIcon } from "@/constants/icon";
import { getDifficultyText } from "@/constants";

// Helper functions for difficulty level display
const getDifficultyColor = (level: string) => {
  switch (level) {
    case "KNOWLEDGE":
      return "bg-sky-100 text-sky-800";
    case "COMPREHENSION":
      return "bg-yellow-100 text-yellow-800";
    case "APPLICATION":
      return "bg-green-100 text-green-800";
    case "ANALYSIS":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface LoadingRealtimeExamMatrixProps {
  data: any;
  finalData: any;
  resultId: string | null;
  matrix: MatrixRow[];
  allLessons: any[];
  previousQuestionCount: number;
  setPreviousQuestionCount: (count: number) => void;
  bookTypeCode?: string;
  onDownloadDocument: () => void;
  onSaveResult: () => void;
  onEditResult?: () => void;
  onSaveDraft?: (callback?: () => void) => void;
}

const LoadingRealtimeExamMatrix: React.FC<LoadingRealtimeExamMatrixProps> = ({
  data,
  finalData,
  resultId,
  matrix,
  allLessons,
  previousQuestionCount,
  setPreviousQuestionCount,
  bookTypeCode,
  onDownloadDocument,
  onSaveResult,
  onEditResult,
  onSaveDraft,
}) => {
  const router = useRouter();
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  // Handle edit result - save as draft first, then navigate to edit page
  const handleEditResult = () => {
    if (resultId) {
      // If we have onSaveDraft function, save as draft first
      if (onSaveDraft) {
        onSaveDraft(() => {
          // Navigate after successful save
          router.push(`/results/exam/${resultId}`);
        });
      } else {
        // Direct navigation if no save function provided
        router.push(`/results/exam/${resultId}`);
      }
    } else if (onEditResult) {
      onEditResult();
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (data?.status === "processing" && data?.tool_code === bookTypeCode) {
      const examData = data?.exam_data;
      const parts = examData?.parts || [];
      const multipleChoiceQuestions =
        parts.find((p: any) => p.part === "PHẦN I")?.questions || [];
      const yesNoQuestions =
        parts.find((p: any) => p.part === "PHẦN II")?.questions || [];
      const shortQuestions =
        parts.find((p: any) => p.part === "PHẦN III")?.questions || [];

      const allQuestions = [
        ...multipleChoiceQuestions,
        ...yesNoQuestions,
        ...shortQuestions,
      ];

      if (
        allQuestions.length > previousQuestionCount &&
        questionsContainerRef.current
      ) {
        setTimeout(() => {
          if (questionsContainerRef.current) {
            const container = questionsContainerRef.current;
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
        setPreviousQuestionCount(allQuestions.length);
      }
    }
  }, [data, previousQuestionCount, bookTypeCode, setPreviousQuestionCount]);

  // Extract exam data if available
  const examData = data?.exam_data;
  const parts = examData?.parts || [];
  const multipleChoiceQuestions =
    parts.find((p: any) => p.part === "PHẦN I")?.questions || [];
  const yesNoQuestions =
    parts.find((p: any) => p.part === "PHẦN II")?.questions || [];
  const shortQuestions =
    parts.find((p: any) => p.part === "PHẦN III")?.questions || [];

  const allQuestions = [
    ...multipleChoiceQuestions.map((q: any, i: number) => ({
      ...q,
      type: "multiple",
      questionNumber: i + 1,
    })),
    ...yesNoQuestions.map((q: any, i: number) => ({
      ...q,
      type: "yesno",
      questionNumber: multipleChoiceQuestions.length + i + 1,
    })),
    ...shortQuestions.map((q: any, i: number) => ({
      ...q,
      type: "short",
      questionNumber:
        multipleChoiceQuestions.length + yesNoQuestions.length + i + 1,
    })),
  ];

  return (
    <div className="max-w-full mx-auto px-12">
      <div className="grid grid-cols-2 gap-8 h-screen">
        {/* Ma trận bên trái */}
        <div className="flex flex-col min-w-0">
          <div className="sticky top-0 bg-white z-10">
            <div className="mb-4 pt-4">
              <h2 className="text-lg font-calsans">Ma trận đề thi</h2>
              <h3 className="text-base font-questrial text-neutral-500">
                Ma trận phân bổ đề thi dựa trên số lượng câu nhận biết, thông
                hiểu, vận dụng
              </h3>
            </div>
            <div className="bg-white overflow-x-auto overflow-y-hidden">
              <table className="text-center rounded-md border mb-4 min-w-[700px] w-max">
                <thead className="font-calsans text-base">
                  <tr>
                    <th className="border px-2 py-3 align-middle" rowSpan={2}>
                      <span className="font-normal">Bài học</span>
                    </th>
                    <th
                      className="border px-2 py-3 align-middle bg-amber-50"
                      colSpan={3}
                    >
                      <span className="font-normal">Phần 1</span>
                    </th>
                    <th
                      className="border px-2 py-3 align-middle bg-green-50"
                      colSpan={3}
                    >
                      <span className="font-normal">Phần 2</span>
                    </th>
                    <th
                      className="border px-2 py-3 align-middle bg-sky-50"
                      colSpan={3}
                    >
                      <span className="font-normal">Phần 3</span>
                    </th>
                    <th className="border px-2 py-3 align-middle" rowSpan={2}>
                      <span className="font-normal">Tổng số câu</span>
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
                      <td className="border px-2 py-1 min-w-[160px]">
                        <Input
                          value={
                            allLessons.find(
                              (lesson: any) => lesson.id === row.lessonID
                            )?.name || "Chọn bài học"
                          }
                          readOnly
                          className="w-full min-h-[38px] bg-gray-100 cursor-not-allowed"
                        />
                      </td>
                      {(["part1", "part2", "part3"] as const).map((part) =>
                        (["biet", "hieu", "vd"] as const).map((level) => (
                          <td className="border px-1 py-1" key={part + level}>
                            <Input
                              type="number"
                              min={0}
                              step="1"
                              value={row.distribution[part][level]}
                              readOnly
                              placeholder={level.toUpperCase()}
                              className="bg-gray-100 cursor-not-allowed text-sm w-16 h-10 text-center"
                            />
                          </td>
                        ))
                      )}
                      <td className="border px-1 py-1">
                        <Input
                          type="number"
                          value={calculateRowTotal(row)}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed text-center font-medium text-sm w-16 h-10"
                          placeholder="Tổng"
                        />
                      </td>
                    </tr>
                  ))}
                  {/* Hàng tổng */}
                  <tr className="font-bold">
                    <td className="border px-2 py-3 text-center bg-violet-50">
                      <span className="font-calsans">TỔNG</span>
                    </td>
                    <td className="border px-2 py-3 text-center" colSpan={3}>
                      <span className="font-medium font-questrial">
                        {calculateColumnTotals(matrix).part1Total}/40
                      </span>
                    </td>
                    <td className="border px-2 py-3 text-center" colSpan={3}>
                      <span className="font-medium font-questrial">
                        {calculateColumnTotals(matrix).part2Total}/8
                      </span>
                    </td>
                    <td className="border px-2 py-3 text-center" colSpan={3}>
                      <span className="font-medium font-questrial">
                        {calculateColumnTotals(matrix).part3Total}/6
                      </span>
                    </td>
                    <td className="border px-2 py-3 text-center">
                      <span className="font-bold font-questrial">
                        {calculateColumnTotals(matrix).grandTotal}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {resultId ? (
          <>
            {" "}
            <div className="w-full h-[95vh] overflow-y-auto border">
              <div className="sticky top-0  z-10 p-4 space-x-5 flex items-center">
                <Button onClick={onDownloadDocument}>
                  {DowloadIcon} Tải về máy
                </Button>

                <Button variant={"outline"} onClick={onSaveResult}>
                  <Save /> Lưu kết quả
                </Button>
                <Button variant={"custom"} onClick={handleEditResult}>
                  <Edit /> Chỉnh sửa
                </Button>
              </div>
              <TemplatePreview data={finalData?.exam_data} />
            </div>
          </>
        ) : (
          <>
            {" "}
            {/* Kết quả đề thi bên phải */}
            <div className="flex flex-col">
              <div className="sticky top-0 bg-white z-10 pb-4">
                <div className="mb-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center">
                        <Image
                          src="/loading/loading_AI.gif"
                          alt="AI Robot"
                          width={64}
                          height={64}
                          unoptimized
                        />
                      </div>
                      <h2 className="text-lg font-calsans">
                        Đề thi được tạo tự động
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-questrial text-green-600">
                        Đang tạo...
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-questrial text-neutral-500 mt-1">
                    {data?.message || "Đang tạo câu hỏi vận dụng..."}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-questrial text-gray-700">
                      Tiến độ
                    </span>
                    <span className="text-sm font-questrial text-gray-500">
                      {data?.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${data?.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Questions container */}
              <div
                ref={questionsContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50 rounded-lg border p-4 space-y-4"
              >
                {allQuestions.length > 0 ? (
                  allQuestions.map((question: any, index: number) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border p-4 shadow-sm"
                    >
                      {/* Question header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-sky-100 rounded flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-sky-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-sky-600">
                            Câu hỏi
                          </span>
                          {/* Difficulty Level Badge */}
                          {question.difficultyLevel && (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                question.difficultyLevel
                              )}`}
                            >
                              {getDifficultyText(question.difficultyLevel)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date().toLocaleTimeString("vi-VN")}
                        </span>
                      </div>

                      {/* Question content */}
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">
                          <span className="font-bold">
                            Câu {question.questionNumber}:
                          </span>{" "}
                          {question.question}
                        </p>

                        {/* Multiple choice options */}
                        {question.type === "multiple" && question.options && (
                          <div className="ml-4 space-y-1">
                            {Object.entries(question.options).map(
                              ([key, value]) => (
                                <p key={key} className="text-sm text-gray-700">
                                  <span className="font-medium">
                                    {key.toUpperCase()}.
                                  </span>{" "}
                                  {value as string}
                                </p>
                              )
                            )}
                            {question.answer && (
                              <div className="mt-2 p-2 bg-emerald-50 border-l-2 border-emerald-400">
                                <span className="text-sm font-medium text-emerald-700">
                                  Đáp án
                                </span>
                                <p className="text-sm text-emerald-600">
                                  {question.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* True/False statements */}
                        {question.type === "yesno" && question.statements && (
                          <div className="ml-4 space-y-1">
                            {Object.entries(question.statements).map(
                              ([key, statement]: [string, any]) => (
                                <p key={key} className="text-sm text-gray-700">
                                  <span className="font-medium">
                                    {key.toLowerCase()}.
                                  </span>{" "}
                                  {statement.text}
                                </p>
                              )
                            )}
                          </div>
                        )}

                        {/* Short answer */}
                        {question.type === "short" && (
                          <div className="ml-4">
                            <div className="mt-2 p-2 bg-green-50 rounded border-l-4 border-green-400">
                              <span className="text-sm font-medium text-green-700">
                                Đáp án
                              </span>
                              <p className="text-sm text-green-600">
                                {question.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Skeleton loading for questions
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg border p-4 shadow-sm animate-pulse"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="ml-4 space-y-1">
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingRealtimeExamMatrix;
