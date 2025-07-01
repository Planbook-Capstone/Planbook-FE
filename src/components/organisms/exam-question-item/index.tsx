"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { Question, QuestionItemProps } from "./types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function QuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: QuestionItemProps) {
  // Normalize options to array format
  const normalizeOptions = (options: string[] | { A: string; B: string; C: string; D: string }): string[] => {
    if (Array.isArray(options)) {
      return options;
    }
    return [options.A, options.B, options.C, options.D];
  };

  const normalizedOptions = normalizeOptions(question.options);

  const [selectedAnswer, setSelectedAnswer] = useState<number>(
    question.correctAnswer
  );

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...normalizedOptions];
    newOptions[optionIndex] = value;
    onUpdate({ ...question, options: newOptions });
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    onUpdate({ ...question, correctAnswer: optionIndex });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question.question);
      toast.success("Coppy thành công");
      // Có thể hiển thị thông báo thành công ở đây nếu muốn
    } catch (err) {
      // Xử lý lỗi nếu cần
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex space-y-2 space-x-1 w-full pb-5">
      <div className="w-full">
        {/* Question Header with Actions */}
        <div className="flex items-center justify-center gap-1 w-full">
          <div className="font-calsans text-base font-medium text-nowrap">
            Câu {index + 1}:
          </div>
          {/* Question Text */}
          <div className="w-full">
            <textarea
              className="w-full font-calsans border resize-none text-sm bg-transparent p-2 rounded-md"
              value={question?.question}
              onChange={(e: any) =>
                onUpdate({ ...question, question: e.target.value })
              }
              placeholder="Nhập câu hỏi..."
              rows={1}
            />
          </div>
        </div>

        {/* Answer Options */}
        <div className="space-y-1 font-questrial">
          {normalizedOptions.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-2">
              {/* Option Letter */}
              <div
                className={`w-9.5 h-9 rounded-md flex items-center justify-center cursor-pointer border-[0.5px] font-questrial ${
                  selectedAnswer === optionIndex
                    ? "bg-gray-800 border-gray-800 text-white"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
                onClick={() => handleAnswerSelect(optionIndex)}
              >
                <span className="text-sm font-medium">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
              </div>

              <div className="w-full space-y-1">
                {/* Option Text */}
                <Input
                  type="text"
                  value={option}
                  onChange={(e: any) =>
                    handleOptionChange(optionIndex, e.target.value)
                  }
                  placeholder={`Đáp án ${String.fromCharCode(
                    65 + optionIndex
                  )}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="px-2 py-4.5 text-gray-500 hover:text-gray-700"
          onClick={handleCopy}
        >
          {CoppyIcon}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {EditIcon}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="p-2 text-gray-500 hover:text-red-500"
          onClick={() => onDelete(String(question.id))}
        >
          <Plus className="h-4 w-4 rotate-45" />
        </Button>
      </div>
    </div>
  );
}

// export { Question, QuestionItemProps } from "./types";
