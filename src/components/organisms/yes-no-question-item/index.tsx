"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Image as ImageIcon, X } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { YesNoQuestion, YesNoQuestionItemProps, YesNoOption } from "./types";
import { useDroppable } from "@dnd-kit/core";

export default function YesNoQuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: YesNoQuestionItemProps) {
  const [showImageDropZone, setShowImageDropZone] = useState<boolean>(false);
  const mainTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Drop zone for illustration image
  const { isOver, setNodeRef } = useDroppable({
    id: `yes-no-question-${question.id}-image-drop`,
    data: {
      type: "question",
      id: question.id,
      questionType: "yes-no",
    },
  });

  // Normalize question data for both API and legacy formats
  const getQuestionText = () => question.question || question.text || "";

  // Convert API statements to options format for display
  const getOptionsFromStatements = () => {
    if (question.statements) {
      return [
        {
          id: "a",
          text: question.statements.a.text,
          isCorrect: question.statements.a.answer,
        },
        {
          id: "b",
          text: question.statements.b.text,
          isCorrect: question.statements.b.answer,
        },
        {
          id: "c",
          text: question.statements.c.text,
          isCorrect: question.statements.c.answer,
        },
        {
          id: "d",
          text: question.statements.d.text,
          isCorrect: question.statements.d.answer,
        },
      ];
    }
    return question.options || [];
  };

  const displayOptions = getOptionsFromStatements();

  // Get statement letter labels
  const getStatementLabel = (index: number) => {
    const labels = ["a)", "b)", "c)", "d)"];
    return labels[index] || `${index + 1})`;
  };

  const handleQuestionTextChange = (text: string) => {
    if (question.question !== undefined) {
      onUpdate({ ...question, question: text });
    } else {
      onUpdate({ ...question, text });
    }
  };

  const handleOptionTextChange = (optionId: string, text: string) => {
    if (question.statements) {
      // Update statements format
      const newStatements = { ...question.statements };
      if (optionId in newStatements) {
        newStatements[optionId as keyof typeof newStatements] = {
          ...newStatements[optionId as keyof typeof newStatements],
          text,
        };
      }
      onUpdate({ ...question, statements: newStatements });
    } else {
      // Update options format
      const newOptions =
        question.options?.map((option) =>
          option.id === optionId ? { ...option, text } : option
        ) || [];
      onUpdate({ ...question, options: newOptions });
    }
  };

  const handleAnswerChange = (optionId: string, isCorrect: boolean) => {
    if (question.statements) {
      // Update statements format
      const newStatements = { ...question.statements };
      if (optionId in newStatements) {
        newStatements[optionId as keyof typeof newStatements] = {
          ...newStatements[optionId as keyof typeof newStatements],
          answer: isCorrect,
        };
      }
      onUpdate({ ...question, statements: newStatements });
    } else {
      // Update options format
      const newOptions =
        question?.options?.map((option) =>
          option.id === optionId ? { ...option, isCorrect } : option
        ) || [];
      onUpdate({ ...question, options: newOptions });
    }
  };

  const addNewOption = () => {
    // Only allow adding options for legacy format, not API statements format
    if (!question.statements && question.options) {
      const newOption: YesNoOption = {
        id: Date.now().toString(),
        text: "",
        isCorrect: false,
      };
      const newOptions = [...question.options, newOption];
      onUpdate({ ...question, options: newOptions });
    }
  };

  const removeOption = (optionId: string) => {
    // Only allow removing options for legacy format, not API statements format
    if (
      !question.statements &&
      question.options &&
      question.options.length > 1
    ) {
      const newOptions = question.options.filter(
        (option) => option.id !== optionId
      );
      onUpdate({ ...question, options: newOptions });
    }
  };

  const handleRemoveImage = () => {
    onUpdate({ ...question, illustrationImage: undefined });
  };

  const handleEditClick = () => {
    setShowImageDropZone(!showImageDropZone);
  };

  const resizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleQuestionTextChangeWithResize = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target;
    resizeTextarea(textarea);
    handleQuestionTextChange(textarea.value);
  };

  const handleOptionTextChangeWithResize = (
    optionId: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target;
    resizeTextarea(textarea);
    handleOptionTextChange(optionId, textarea.value);
  };

  // Auto-resize when data loads from API
  useEffect(() => {
    if (mainTextareaRef.current && getQuestionText()) {
      resizeTextarea(mainTextareaRef.current);
    }
  }, [getQuestionText()]);

  return (
    <div className="flex space-y-4 w-full gap-1">
      <div className="w-full">
        {/* Question Header with Actions */}
        <div className="flex items-start w-full gap-1">
          <div className="font-calsans text-base font-medium text-nowrap mt-2">
            Câu {index + 1}:
          </div>

          <div className="w-full">
            <textarea
              ref={mainTextareaRef}
              className="w-full font-calsans border-none resize-none text-base bg-transparent p-2 rounded-md overflow-hidden"
              value={getQuestionText()}
              onChange={handleQuestionTextChangeWithResize}
              placeholder="Nhập câu hỏi đúng/sai..."
              rows={1}
              style={{ minHeight: "40px" }}
            />
          </div>
        </div>

        {/* Sub-questions with True/False options */}
        <div className="space-y-3 ml-16 font-questrial">
          {displayOptions?.map((option, optionIndex) => (
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
                  className="flex-1 border-none outline-none text-sm text-black bg-transparent py-2 resize-none overflow-hidden"
                  value={option.text}
                  onChange={(e) =>
                    handleOptionTextChangeWithResize(option.id, e)
                  }
                  placeholder={`Phát biểu ${String.fromCharCode(
                    97 + optionIndex
                  )}`}
                  rows={1}
                  style={{ minHeight: "32px" }}
                />
                {displayOptions.length > 1 && !question.statements && (
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

        {/* Illustration Image Section */}
        <div className="py-2">
          {question.illustrationImage ? (
            <div className="space-y-2">
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Hình minh họa
                </label>
              </div>
              <div className="relative inline-block">
                <img
                  src={question.illustrationImage}
                  alt="Hình minh họa"
                  className="max-w-xs max-h-48 rounded-lg border"
                  onError={() => {
                    console.error(
                      "Failed to load image:",
                      question.illustrationImage
                    );
                  }}
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {/* Drop zone for replacing image */}
              <div
                ref={setNodeRef}
                className={`
                  border-2 border-dashed rounded-lg p-2 text-center cursor-pointer transition-colors
                  ${
                    isOver
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
              >
                <p className="text-xs text-gray-500">
                  Kéo hình ảnh khác để thay thế
                </p>
              </div>
            </div>
          ) : (
            showImageDropZone && (
              <div>
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Hình minh họa
                  </label>
                </div>
                <div
                  ref={setNodeRef}
                  className={`
                    border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                    ${
                      isOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }
                  `}
                >
                  <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Kéo hình ảnh vào đây để thêm hình minh họa
                  </p>
                </div>
              </div>
            )
          )}
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
        <Button
          variant="outline"
          size="icon"
          className={`p-2 text-gray-500 hover:text-gray-700 ${
            showImageDropZone ? "bg-blue-200 hover:bg-blue-300" : ""
          }`}
          onClick={handleEditClick}
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

export type {
  YesNoQuestion,
  YesNoQuestionItemProps,
  YesNoOption,
} from "./types";
