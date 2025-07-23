"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Image as ImageIcon, X } from "lucide-react";
import { CoppyIcon, EditIcon } from "@/constants/icon";
import { ShortQuestion, ShortQuestionItemProps } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDroppable } from "@dnd-kit/core";

export default function ShortQuestionItem({
  question,
  index,
  onUpdate,
  onDelete,
}: ShortQuestionItemProps) {
  const [showImageDropZone, setShowImageDropZone] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Drop zone for illustration image
  const { isOver, setNodeRef } = useDroppable({
    id: `short-question-${question.id}-image-drop`,
    data: {
      type: "question",
      id: question.id,
      questionType: "short-answer",
    },
  });

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

  // Auto-resize when data loads from API
  useEffect(() => {
    if (textareaRef.current && getQuestionText()) {
      resizeTextarea(textareaRef.current);
    }
  }, [getQuestionText()]);

  return (
    <div className="flex space-y-4 gap-1 w-full pb-2">
      <div className="w-full">
        {/* Question Header */}
        <div className="flex items-start w-full gap-1">
          <div className="font-calsans text-base font-medium text-nowrap mt-2">
            Câu {index + 1}:
          </div>
          {/* Question Text */}
          <div className="w-full">
            <textarea
              ref={textareaRef}
              className="w-full font-calsans  border-none resize-none text-base bg-transparent p-2 rounded-md overflow-hidden"
              value={getQuestionText()}
              onChange={handleQuestionTextChangeWithResize}
              placeholder="Nhập câu hỏi tự luận..."
              rows={1}
              style={{ minHeight: "40px" }}
            />
          </div>
        </div>

        {/* Answer Input */}
        <div className="ml-6 flex gap-1 items-center font-questrial">
          <p className="text-sm font-bold text-nowrap">Đáp án:</p>

          <Input
            className="border-none text-blue-700"
            type="text"
            value={question.answer}
            onChange={(e: any) => handleAnswerChange(e.target.value)}
            placeholder="Nhập đáp án mẫu cho câu hỏi tự luận..."
          />
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

export type { ShortQuestion, ShortQuestionItemProps } from "./types";
