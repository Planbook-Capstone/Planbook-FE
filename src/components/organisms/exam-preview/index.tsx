"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "@/components/organisms/exam-question-item/types";
import { YesNoQuestion } from "@/components/organisms/yes-no-question-item/types";
import { ShortQuestion } from "@/components/organisms/short-question-item/types";

interface ExamPreviewProps {
  questions: Question[];
  yesNoQuestions: YesNoQuestion[];
  shortQuestions: ShortQuestion[];
  examTitle?: string;
  examSubject?: string;
  examTime?: string;
  examCode?: string;
}

export default function ExamPreview({
  questions,
  yesNoQuestions,
  shortQuestions,
  examTitle = "ĐỀ KIỂM TRA LỚP 12",
  examSubject = "3",
  examTime = "45 phút, không kể thời gian phát đề",
  examCode = "1234",
}: ExamPreviewProps) {
  const totalQuestions =
    questions.length + yesNoQuestions.length + shortQuestions.length;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10; // Adjust as needed
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);

  // Calculate current questions to display
  const getCurrentPageQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;

    const allQuestions = [
      ...questions.map((q, i) => ({ ...q, type: "multiple", index: i + 1 })),
      ...yesNoQuestions.map((q, i) => ({
        ...q,
        type: "yesno",
        index: questions.length + i + 1,
      })),
      ...shortQuestions.map((q, i) => ({
        ...q,
        type: "short",
        index: questions.length + yesNoQuestions.length + i + 1,
      })),
    ];

    return allQuestions.slice(startIndex, endIndex);
  };

  return (
    <div className="h-full flex flex-col bg-white font-questrial">
      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-0">
        {/* A4 Page Container */}
        <div
          className="max-w-[210mm] mx-auto bg-white shadow-lg border border-gray-200"
          style={{ minHeight: "297mm", fontFamily: "Times New Roman, serif" }}
        >
          <div
            className="p-8 text-black"
            style={{ fontSize: "12pt", lineHeight: "1.5" }}
          >
            {/* Exam Header - Matching the image format */}
            <div className="mb-8">
              {/* Top row with ministry and exam info */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-center" style={{ width: "30%" }}>
                  <p className="font-bold text-sm ">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
                  <p className="font-bold text-sm text-center mt-1 ">
                    ĐỀ THI CHÍNH THỨC
                  </p>
                  <p className="text-xs mt-1 text-center">
                    (Đề thi có 04 trang)
                  </p>
                </div>
                <div className="text-center" style={{ width: "70%" }}>
                  <p className="font-bold text-sm">
                    {examTitle || "ĐỀ KIỂM TRA LỚP 12"}
                  </p>
                  <p className="font-bold text-sm mt-2">Môn: {examSubject}</p>
                  <p className="text-xs mt-2">Thời gian làm bài: {examTime}</p>
                </div>
              </div>

              {/* Student info section - 80% left, 20% right */}
              <div className="flex justify-between items-end mt-8">
                <div className="text-sm" style={{ width: "80%" }}>
                  <div className="flex flex-col items-start gap-4 font-bold">
                    <span>
                      Họ, tên thí sinh: ...................................
                    </span>
                    <span>
                      Số báo danh: ........................................
                    </span>
                  </div>
                </div>

                <div
                  className="flex justify-center items-center"
                  style={{ width: "20%" }}
                >
                  <div className="border-2 border-black px-6 py-2 flex items-center justify-center">
                    <p className="text-sm text-center">
                      Mã đề: {examCode || "1234"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Content */}
            <div className="space-y-6">
              {/* Section Headers */}
              {questions.length > 0 && (
                <div className="my-1">
                  <h2 className="text-lg font-bold text-left">
                    PHẦN I: TRẮC NGHIỆM
                  </h2>
                </div>
              )}

              {getCurrentPageQuestions().map(
                (question: any, questionIndex: number) => {
                  // Check if we need to show section headers
                  const currentQuestions = getCurrentPageQuestions();
                  const isFirstYesNo =
                    question.type === "yesno" &&
                    (questionIndex === 0 ||
                      currentQuestions[questionIndex - 1]?.type !== "yesno");
                  const isFirstShort =
                    question.type === "short" &&
                    (questionIndex === 0 ||
                      currentQuestions[questionIndex - 1]?.type !== "short");

                  return (
                    <div key={`${question.type}-${question.index}`}>
                      {/* Section Headers */}
                      {isFirstYesNo && yesNoQuestions.length > 0 && (
                        <div className="my-1">
                          <h2 className="text-lg font-bold text-left">
                            PHẦN II: ĐÚNG/SAI
                          </h2>
                        </div>
                      )}
                      {isFirstShort && shortQuestions.length > 0 && (
                        <div className="my-1">
                          <h2 className="text-lg font-bold text-left">
                            PHẦN III: TỰ LUẬN
                          </h2>
                        </div>
                      )}

                      <div className="mb-6">
                        {question.type === "multiple" && (
                          <div>
                            <p className="font-medium text-gray-900 mb-2">
                              Câu {question.index}: {question.question}
                            </p>
                            {question.illustrationImage && (
                              <div className="mb-3">
                                <img
                                  src={question.illustrationImage}
                                  alt="Hình minh họa"
                                  className="max-w-xs max-h-48 rounded border"
                                  onLoad={() => {
                                    console.log(
                                      "✅ Image loaded successfully:",
                                      question.illustrationImage
                                    );
                                  }}
                                  onError={(e) => {
                                    console.error(
                                      "❌ Image load error:",
                                      question.illustrationImage,
                                      e
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <div className="grid grid-cols-1 gap-1 ml-4">
                              {Array.isArray(question.options)
                                ? question.options.map(
                                    (option: string, optIndex: number) => (
                                      <p
                                        key={optIndex}
                                        className="text-gray-700"
                                      >
                                        {String.fromCharCode(65 + optIndex)}.{" "}
                                        {option}
                                      </p>
                                    )
                                  )
                                : Object.entries(question.options).map(
                                    ([key, value]) => (
                                      <p key={key} className="text-gray-700">
                                        {key}. {String(value)}
                                      </p>
                                    )
                                  )}
                            </div>
                          </div>
                        )}

                        {question.type === "yesno" && (
                          <div>
                            <p className="font-medium text-gray-900 mb-2">
                              Câu {question.index}: {question.question}
                            </p>
                            {question.illustrationImage && (
                              <div className="mb-3">
                                <img
                                  src={question.illustrationImage}
                                  alt="Hình minh họa"
                                  className="max-w-xs max-h-48 rounded border"
                                  onLoad={() => {
                                    console.log(
                                      "✅ Image loaded successfully:",
                                      question.illustrationImage
                                    );
                                  }}
                                  onError={(e) => {
                                    console.error(
                                      "❌ Image load error:",
                                      question.illustrationImage,
                                      e
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <div className="grid grid-cols-1 gap-1 ml-4">
                              <p className="text-gray-700">
                                a) {question.statements.a.text}
                              </p>
                              <p className="text-gray-700">
                                b) {question.statements.b.text}
                              </p>
                              <p className="text-gray-700">
                                c) {question.statements.c.text}
                              </p>
                              <p className="text-gray-700">
                                d) {question.statements.d.text}
                              </p>
                            </div>
                          </div>
                        )}

                        {question.type === "short" && (
                          <div>
                            <p className="font-medium text-gray-900 mb-3">
                              Câu {question.index}: {question.question}
                            </p>
                            {question.illustrationImage && (
                              <div className="mb-3">
                                <img
                                  src={question.illustrationImage}
                                  alt="Hình minh họa"
                                  className="max-w-xs max-h-48 rounded border"
                                  onLoad={() => {
                                    console.log(
                                      "✅ Image loaded successfully:",
                                      question.illustrationImage
                                    );
                                  }}
                                  onError={(e) => {
                                    console.error(
                                      "❌ Image load error:",
                                      question.illustrationImage,
                                      e
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            {/* <div className="space-y-2">
                        <div className="border-b border-dotted border-gray-400 h-6"></div>
                        <div className="border-b border-dotted border-gray-400 h-6"></div>
                        <div className="border-b border-dotted border-gray-400 h-6"></div>
                      </div> */}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}

              {/* Empty State */}
              {totalQuestions === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Chưa có câu hỏi nào</p>
                  <p className="text-gray-400 text-sm">
                    Thêm câu hỏi để xem trước đề thi
                  </p>
                </div>
              )}
            </div>

            {/* Page Footer with Page Number */}
            <div className="mt-auto pt-8 flex justify-end">
              <div className="text-right text-sm text-gray-500">
                Trang {currentPage}/{totalPages}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </Button>

            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2"
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
