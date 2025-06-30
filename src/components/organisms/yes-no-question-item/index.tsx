"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { YesNoQuestion, YesNoQuestionItemProps, YesNoOption } from "./types";

export default function YesNoQuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: YesNoQuestionItemProps) {
  const handleQuestionTextChange = (text: string) => {
    onUpdate({ ...question, text });
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    const newOptions = question.options.map((option) =>
      option.id === optionId ? { ...option, text } : option
    );
    onUpdate({ ...question, options: newOptions });
  };

  const handleAnswerChange = (optionId: string, isCorrect: boolean) => {
    const newOptions = question.options.map((option) =>
      option.id === optionId ? { ...option, isCorrect } : option
    );
    onUpdate({ ...question, options: newOptions });
  };

  const addNewOption = () => {
    const newOption: YesNoOption = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    const newOptions = [...question.options, newOption];
    onUpdate({ ...question, options: newOptions });
  };

  const removeOption = (optionId: string) => {
    if (question.options.length > 1) {
      const newOptions = question.options.filter(
        (option) => option.id !== optionId
      );
      onUpdate({ ...question, options: newOptions });
    }
  };

  return (
    <div className="flex space-y-4 w-full gap-1">
      <div className="w-full">
        {/* Question Header with Actions */}
        <div className="flex items-center justify-between w-full gap-1">
          <div className="font-calsans text-base font-medium text-nowrap">
            Câu {index + 1}:
          </div>

          <div className="w-full">
            <textarea
              className="w-full font-calsans border resize-none text-sm bg-transparent p-2 rounded-md"
              value={question.text}
              onChange={(e) => handleQuestionTextChange(e.target.value)}
              placeholder="Nhập câu hỏi đúng/sai..."
              rows={1}
            />
          </div>
        </div>

        {/* Sub-questions with True/False options */}
        <div className="space-y-3 ml-16 font-questrial">
          {question.options.map((option, optionIndex) => (
            <div
              key={option.id}
              className="space-y-2 border p-1.5 rounded-md bg-neutral-50"
            >
              {/* Sub-question text */}
              <div className="flex items-start gap-3">
                <div className="font-medium text-sm text-gray-700 mt-2">
                  {String.fromCharCode(97 + optionIndex)})
                </div>
                <textarea
                  className="flex-1 border-none outline-none text-sm text-black bg-transparent py-2 resize-none"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionTextChange(option.id, e.target.value)
                  }
                  placeholder={`Phát biểu ${String.fromCharCode(
                    97 + optionIndex
                  )}`}
                  rows={1}
                />
                {question.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => removeOption(option.id)}
                  >
                    <Plus className="h-3 w-3 rotate-45" />
                  </Button>
                )}
              </div>

              {/* True/False options */}
              <div className="flex gap-4 ml-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border font-questrial text-xs ${
                      option.isCorrect === true
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                    onClick={() => handleAnswerChange(option.id, true)}
                  >
                    Đ
                  </div>
                  <span className="text-sm text-gray-600">Đúng</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border font-questrial text-xs ${
                      option.isCorrect === false
                        ? "bg-neutral-900 border-neutral-900 text-white"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                    onClick={() => handleAnswerChange(option.id, false)}
                  >
                    S
                  </div>
                  <span className="text-sm text-gray-600">Sai</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add new sub-question button */}
          <Button
            variant="ghost"
            size="sm"
            className="ml-6 text-gray-500 hover:text-gray-700 border-dashed border"
            onClick={addNewOption}
          >
            <Plus className="h-3 w-3 mr-1" />
            Thêm phát biểu
          </Button>
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
          onClick={() => onDelete(question.id)}
        >
          <Plus className="h-4 w-4 rotate-45" />
        </Button>
      </div>
    </div>
  );
}

export type {
  YesNoQuestion,
  YesNoQuestionItemProps,
  YesNoOption,
} from "./types";
