"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { X, Share2 } from "lucide-react";
import { DowloadIcon } from "@/constants/icon";
import { useExamTemplateByIdService } from "@/services/examTemplateServices";
import { Badge } from "@/components/ui/badge";
import { getDifficultyText, getVariant } from "@/constants";

interface TemplatePreviewProps {
  data: any;
}

export default function TemplatePreview({ data }: TemplatePreviewProps) {
  const handleDownload = async () => {
    // TODO: Implement download functionality for template
  };

  const handleShare = () => {
    // TODO: Implement share functionality for template
  };

  // Extract questions from template content
  const parts = data?.parts || [];
  const multipleChoiceQuestions =
    parts.find((p: any) => p.part === "PHẦN I")?.questions || [];
  const yesNoQuestions =
    parts.find((p: any) => p.part === "PHẦN II")?.questions || [];
  const shortQuestions =
    parts.find((p: any) => p.part === "PHẦN III")?.questions || [];

  const totalQuestions =
    multipleChoiceQuestions.length +
    yesNoQuestions.length +
    shortQuestions.length;

  return (
    <div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="h-full flex flex-col bg-white font-questrial">
          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto p-0">
            {/* A4 Page Container */}
            <div
              className="max-w-[210mm] mx-auto bg-white shadow-lg border border-gray-200"
              style={{
                minHeight: "297mm",
                fontFamily: "Times New Roman, serif",
              }}
            >
              <div
                className="p-8 text-black"
                style={{ fontSize: "12pt", lineHeight: "1.5" }}
              >
                {/* Exam Header */}
                <div className="mb-8">
                  {/* Top row with ministry and exam info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-center" style={{ width: "30%" }}>
                      <p className="font-bold text-sm">
                        BỘ GIÁO DỤC VÀ ĐÀO TẠO
                      </p>
                      <p className="font-bold text-sm text-center mt-1">
                        ĐỀ THI CHÍNH THỨC
                      </p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-lg">KIỂM TRA CUỐI KỲ I</p>
                      <p className="font-bold text-base mt-1">
                        Môn: ........ - Lớp ........
                      </p>
                      <p className="text-sm mt-1">
                        Thời gian làm bài: ..... phút, không kể thời gian phát
                        đề
                      </p>
                    </div>
                  </div>

                  {/* Student info section */}
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
                        <p className="text-sm text-center">Mã đề: 001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Content */}
                <div className="space-y-6">
                  {/* Multiple Choice Questions */}
                  {multipleChoiceQuestions.length > 0 && (
                    <div>
                      <h3 className="font-bold text-base mb-4">
                        PHẦN I: TRẮC NGHIỆM ({multipleChoiceQuestions.length}{" "}
                        câu)
                      </h3>
                      <div className="space-y-4">
                        {multipleChoiceQuestions.map(
                          (question: any, index: number) => (
                            <div key={question.id || index} className="mb-4">
                              <p className="font-medium text-gray-900 mb-2">
                                <span className="font-bold">
                                  Câu {index + 1}:
                                  <span>
                                    {" "}
                                    <Badge
                                      variant={getVariant(
                                        question.difficultyLevel
                                      )}
                                      className="text-xs"
                                    >
                                      {getDifficultyText(
                                        question.difficultyLevel
                                      )}
                                    </Badge>
                                  </span>
                                </span>{" "}
                                {question.question}
                              </p>
                              {question.illustrationImage && (
                                <div className="mb-3">
                                  <img
                                    src={question.illustrationImage}
                                    alt="Hình minh họa"
                                    className="max-w-xs max-h-48 rounded border"
                                  />
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-2 ml-4">
                                {Object.entries(question.options || {}).map(
                                  ([key, value]) => (
                                    <div key={key} className="flex items-start">
                                      <span className="font-medium mr-2">
                                        {key.toUpperCase()}.
                                      </span>
                                      <span>{value as string}</span>
                                    </div>
                                  )
                                )}
                              </div>
                              <p className="text-green-500 font-bold">
                                Đáp án: {question.answer}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Yes/No Questions */}
                  {yesNoQuestions.length > 0 && (
                    <div>
                      <h3 className="font-bold text-base mb-4">
                        PHẦN II: ĐÚNG/SAI ({yesNoQuestions.length} câu)
                      </h3>
                      <div className="space-y-4">
                        {yesNoQuestions.map((question: any, index: number) => (
                          <div key={question.id || index} className="mb-4">
                            <p className="font-medium text-gray-900 mb-2">
                              <span className="font-bold">
                                Câu {multipleChoiceQuestions.length + index + 1}
                                :{" "}
                                <span>
                                  {" "}
                                  <Badge
                                    variant={getVariant(
                                      question.difficultyLevel
                                    )}
                                    className="text-xs"
                                  >
                                    {getDifficultyText(
                                      question.difficultyLevel
                                    )}
                                  </Badge>
                                </span>
                              </span>{" "}
                              {question.question}
                            </p>
                            {question.illustrationImage && (
                              <div className="mb-3">
                                <img
                                  src={question.illustrationImage}
                                  alt="Hình minh họa"
                                  className="max-w-xs max-h-48 rounded border"
                                />
                              </div>
                            )}
                            <div className="ml-4 space-y-1">
                              {question.statements &&
                                Object.entries(question.statements).map(
                                  ([key, statement]: [string, any]) => (
                                    <div key={key} className="flex items-start">
                                      <span className="font-medium mr-2">
                                        {key.toUpperCase()}.
                                      </span>
                                      <span>{statement.text}</span>
                                      {statement.answer ? (
                                        <span className="text-green-500 ml-2">
                                          Đúng
                                        </span>
                                      ) : (
                                        <span className="text-green-500 ml-2">
                                          Sai
                                        </span>
                                      )}
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short Answer Questions */}
                  {shortQuestions.length > 0 && (
                    <div>
                      <h3 className="font-bold text-base mb-4">
                        PHẦN III: TỰ LUẬN ({shortQuestions.length} câu)
                      </h3>
                      <div className="space-y-4">
                        {shortQuestions.map((question: any, index: number) => (
                          <div key={question.id || index} className="mb-4">
                            <p className="font-medium text-gray-900 mb-2">
                              <span className="font-bold">
                                Câu{" "}
                                {multipleChoiceQuestions.length +
                                  yesNoQuestions.length +
                                  index +
                                  1}
                                :        <span>
                                    {" "}
                                    <Badge
                                      variant={getVariant(
                                        question.difficultyLevel
                                      )}
                                      className="text-xs"
                                    >
                                      {getDifficultyText(
                                        question.difficultyLevel
                                      )}
                                    </Badge>
                                  </span>
                              </span>{" "}
                              {question.question}
                            </p>
                            {question.illustrationImage && (
                              <div className="mb-3">
                                <img
                                  src={question.illustrationImage}
                                  alt="Hình minh họa"
                                  className="max-w-xs max-h-48 rounded border"
                                />
                              </div>
                            )}
                            <p className="text-green-500 font-bold">
                              Đáp án: {question.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalQuestions === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Template chưa có câu hỏi nào
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
