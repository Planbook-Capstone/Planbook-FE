"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExamQuestion } from "@/services/studentExamServices";

interface StudentQuestionProps {
  question: ExamQuestion;
  partType: "PHẦN I" | "PHẦN II" | "PHẦN III";
  answer?: string | boolean | Record<string, boolean>;
  onAnswerChange: (
    questionId: string,
    answer: string | boolean | Record<string, boolean>
  ) => void;
  className?: string;
}

export function StudentQuestion({
  question,
  partType,
  answer,
  onAnswerChange,
  className,
}: StudentQuestionProps) {
  // Multiple Choice Question (PHẦN I)
  if (partType === "PHẦN I" && question.options) {
    const selectedOption = answer as string;

    return (
      <Card className={cn("mb-6", className)}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              <span className="text-blue-600 font-bold">
                Câu {question.questionNumber}:
              </span>{" "}
              {question.question}
            </h3>

            <div className="space-y-3">
              {Object.entries(question.options).map(([key, value]) => (
                <label
                  key={key}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedOption === key
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={key}
                    checked={selectedOption === key}
                    onChange={(e) =>
                      onAnswerChange(question.id, e.target.value)
                    }
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="flex-1">
                    <span className="font-medium text-blue-600">{key}.</span>{" "}
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // True/False Question (PHẦN II) - New format with statements
  if (partType === "PHẦN II" && question.statements) {
    const answers = (answer as Record<string, boolean>) || {};

    return (
      <Card className={cn("mb-6", className)}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              <span className="text-blue-600 font-bold">
                Câu {question.questionNumber}:
              </span>{" "}
              {question.question}
            </h3>

            <div className="space-y-4">
              {Object.entries(question.statements).map(([key, statement]) => (
                <div key={key} className="border rounded-lg p-4">
                  <p className="text-gray-800 mb-3">
                    <span className="font-medium text-blue-600">
                      {key.toUpperCase()})
                    </span>{" "}
                    {statement.text}
                  </p>

                  <div className="flex gap-4">
                    <label
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                        answers[key] === true
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name={`statement-${key}-${question.id}`}
                        checked={answers[key] === true}
                        onChange={() => {
                          const newAnswers = { ...answers, [key]: true };
                          onAnswerChange(question.id, newAnswers);
                        }}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="font-medium">Đúng</span>
                    </label>

                    <label
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                        answers[key] === false
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <input
                        type="radio"
                        name={`statement-${key}-${question.id}`}
                        checked={answers[key] === false}
                        onChange={() => {
                          const newAnswers = { ...answers, [key]: false };
                          onAnswerChange(question.id, newAnswers);
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="font-medium">Sai</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Short Answer Question (PHẦN III)
  if (partType === "PHẦN III") {
    const textAnswer = (answer as string) || "";

    return (
      <Card className={cn("mb-6", className)}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">
              <span className="text-blue-600 font-bold">
                Câu {question.questionNumber}:
              </span>{" "}
              {question.question}
            </h3>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Đáp án:
              </label>
              <Input
                type="text"
                placeholder="Nhập đáp án của bạn..."
                value={textAnswer}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-gray-500">
                Lưu ý: Chỉ ghi số (không ghi đơn vị, không ghi chữ). Sử dụng dấu
                phẩy (,), tối đa 4 ký tự.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
