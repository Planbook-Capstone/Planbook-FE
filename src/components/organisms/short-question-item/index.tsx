"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { ShortQuestion, ShortQuestionItemProps } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ShortQuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: ShortQuestionItemProps) {
  // Normalize question text for both API and legacy formats
  const getQuestionText = () => question.question || question.text || "";

  const handleQuestionTextChange = (text: string) => {
    if (question.question !== undefined) {
      onUpdate({ ...question, question: text });
    } else {
      onUpdate({ ...question, text });
    }
  };

  const handleAnswerChange = (answer: string) => {
    onUpdate({ ...question, answer });
  };

  return (
    <div className="flex space-y-4 gap-1 w-full pb-2">
      <div className="w-full">
        {/* Question Header */}
        <div className="flex items-center justify-between w-full gap-1">
          <div className="font-calsans text-base font-medium text-nowrap">
            Câu {index + 1}:
          </div>
          {/* Question Text */}
          <div className="w-full">
            <textarea
              className="w-full font-calsans border resize-none text-sm bg-transparent p-2 rounded-md"
              value={getQuestionText()}
              onChange={(e) => handleQuestionTextChange(e.target.value)}
              placeholder="Nhập câu hỏi tự luận..."
              rows={1}
            />
          </div>
        </div>

        {/* Answer Input */}
        <div className="ml-6 flex gap-1 items-center font-questrial">
          <p className="text-sm font-bold text-nowrap">Đáp án:</p>

          <Input
            type="text"
            value={question.answer}
            onChange={(e: any) => handleAnswerChange(e.target.value)}
            placeholder="Nhập đáp án mẫu cho câu hỏi tự luận..."
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="px-2 py-4.5 text-gray-500 hover:text-gray-700"
          // onClick={handleCopy}
        >
          {CoppyIcon}
        </Button>
        {/* <Button
          variant="outline"
          size="icon"
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {EditIcon}
        </Button> */}
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

export type { ShortQuestion, ShortQuestionItemProps } from "./types";
