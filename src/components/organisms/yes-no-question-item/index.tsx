"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Image as ImageIcon, X } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { YesNoQuestion, YesNoQuestionItemProps, YesNoOption } from "./types";
import { AdvancedTextEditor } from "@/components/ui/advanced-text-editor";
import { useDroppable } from "@dnd-kit/core";
import {
  convertBrTagsToLineBreaks,
  convertLineBreaksToBrTags,
} from "@/utils/textUtils";

export default function YesNoQuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: YesNoQuestionItemProps) {
  const [showImageDropZone, setShowImageDropZone] = useState<boolean>(false);

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
  const getQuestionText = () => {
    const text = question.question || question.text || "";
    // Convert <br/> tags to line breaks for display
    return convertBrTagsToLineBreaks(text);
  };

  // Convert API statements to options format for display
  const getOptionsFromStatements = () => {
    if (question.statements) {
      return [
        {
          id: "a",
          text: convertBrTagsToLineBreaks(
            String(question.statements.a?.text || "")
          ),
          isCorrect: Boolean(question.statements.a?.answer || false),
        },
        {
          id: "b",
          text: convertBrTagsToLineBreaks(
            String(question.statements.b?.text || "")
          ),
          isCorrect: Boolean(question.statements.b?.answer || false),
        },
        {
          id: "c",
          text: convertBrTagsToLineBreaks(
            String(question.statements.c?.text || "")
          ),
          isCorrect: Boolean(question.statements.c?.answer || false),
        },
        {
          id: "d",
          text: convertBrTagsToLineBreaks(
            String(question.statements.d?.text || "")
          ),
          isCorrect: Boolean(question.statements.d?.answer || false),
        },
      ];
    }
    return (
      question.options?.map((option) => ({
        ...option,
        text: convertBrTagsToLineBreaks(String(option.text || "")),
      })) || []
    );
  };

  const displayOptions = getOptionsFromStatements();

  const handleOptionTextChange = (optionId: string, text: string) => {
    // Convert line breaks back to <br/> tags when saving
    const textWithBrTags = convertLineBreaksToBrTags(text);
    if (question.statements) {
      // Update statements format
      const newStatements = { ...question.statements };
      if (optionId in newStatements) {
        newStatements[optionId as keyof typeof newStatements] = {
          ...newStatements[optionId as keyof typeof newStatements],
          text: textWithBrTags,
        };
      }
      onUpdate({ ...question, statements: newStatements });
    } else {
      // Update options format
      const newOptions =
        question.options?.map((option) =>
          option.id === optionId ? { ...option, text: textWithBrTags } : option
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
  return (
    <div className="flex space-y-4 w-full gap-1">
      <div className="w-full">
        {/* Question Header with Actions */}
        <div className="flex items-start w-full gap-1">
          <div className="font-calsans text-base font-medium text-nowrap mt-2">
            Câu {index + 1}:
          </div>

          <div className="w-full">
            <AdvancedTextEditor
              content={getQuestionText()}
              onChange={(content) => {
                const textWithBrTags = convertLineBreaksToBrTags(content);
                if (question.question !== undefined) {
                  onUpdate({ ...question, question: textWithBrTags });
                } else {
                  onUpdate({ ...question, text: textWithBrTags });
                }
              }}
              placeholder="Nhập câu hỏi đúng/sai..."
              className="w-full font-calsans text-base bg-transparent p-2 border-b"
            />
          </div>
        </div>

        {/* Sub-questions with True/False options */}
        <div className="space-y-3 ml-16 font-questrial">
          {displayOptions?.map((option, optionIndex) => (
            <div key={option.id} className="space-y-2 p-1.5 rounded-md">
              {/* Sub-question text */}
              <div className="flex items-start gap-3">
                <div className="font-medium text-sm text-gray-700 mt-2">
                  {String.fromCharCode(97 + optionIndex)})
                </div>
                <AdvancedTextEditor
                  content={option.text}
                  onChange={(content) => {
                    const textWithBrTags = convertLineBreaksToBrTags(content);
                    handleOptionTextChange(option.id, textWithBrTags);
                  }}
                  placeholder={`Phát biểu ${String.fromCharCode(
                    97 + optionIndex
                  )}`}
                  className="flex-1 border-b border-dashed text-sm text-black bg-transparent py-2 "
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
