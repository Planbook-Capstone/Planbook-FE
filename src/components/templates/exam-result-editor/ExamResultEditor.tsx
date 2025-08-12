"use client";

import React, { useState } from "react";
import ToolExamPanel from "@/components/organisms/tool-exam-panel";
import { Switch } from "@/components/ui/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import { X } from "lucide-react";
import { ExamProvider } from "@/contexts/ExamContext";
import { UploadCloudIcon } from "@/constants/icon";
import { Label } from "@/components/ui/label";

interface Props {
  examResult: any;
}

interface BadgeWithImageUploadProps {
  question: any;
  questionId: string;
  imageUploadStates: Record<string, boolean>;
  onToggleImageUpload: (questionId: string) => void;
  onDifficultyChange?: (questionId: string, newDifficulty: string) => void;
  currentDifficulty?: string;
}

function BadgeWithImageUpload({
  question,
  questionId,
  imageUploadStates,
  onToggleImageUpload,
  onDifficultyChange,
  currentDifficulty,
}: BadgeWithImageUploadProps) {
  const isImageUploadOpen = imageUploadStates[questionId] || false;

  const difficultyOptions = [
    {
      value: "KNOWLEDGE",
      label: "Nhận biết",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "COMPREHENSION",
      label: "Thông hiểu",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "APPLICATION",
      label: "Vận dụng",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const handleDifficultyChange = (newDifficulty: string) => {
    if (onDifficultyChange) {
      onDifficultyChange(questionId, newDifficulty);
    }
  };

  // Use currentDifficulty if available, otherwise fall back to question's original difficulty
  const displayDifficulty =
    currentDifficulty || question?.difficultyLevel || "KNOWLEDGE";

  // Get the color for the selected difficulty
  const selectedOption = difficultyOptions.find(
    (option) => option.value === displayDifficulty
  );
  const selectedColor = selectedOption?.color || "bg-gray-100 text-gray-800";

  return (
    <div className="flex items-center gap-2">
      <Select value={displayDifficulty} onValueChange={handleDifficultyChange}>
        <SelectTrigger className="w-32 h-7 text-xs border-0 p-1">
          <SelectValue placeholder="Chọn mức độ">
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${selectedColor}`}
            >
              {selectedOption?.label || "Chọn mức độ"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {difficultyOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${option.color}`}
              >
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Label>Thêm hình ảnh</Label>
        <Switch
          checked={isImageUploadOpen}
          onCheckedChange={() => onToggleImageUpload(questionId)}
          className="scale-75 "
        />
      </div>
    </div>
  );
}

function ImageUploadZone({
  questionId,
  questionImages,
  onRemoveImage,
}: {
  questionId: string;
  questionImages: Record<string, string>;
  onRemoveImage: (questionId: string) => void;
}) {
  const questionImage = questionImages[questionId];

  const { isOver, setNodeRef } = useDroppable({
    id: `badge-${questionId}-image-drop`,
    data: {
      type: "question",
      id: questionId,
      questionType: "badge-image",
    },
  });

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border font-questrial">
      {!questionImage ? (
        <div
          ref={setNodeRef}
          className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 text-center ${
            isOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <div className="w-10">{UploadCloudIcon}</div>
            <div>
              <p className="font-medium">kéo hình ảnh vào đây</p>
              <p className="text-sm text-gray-500">Từ panel bên trái</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="w-full h-32 border rounded overflow-hidden">
            <img
              src={questionImage}
              alt="Question image"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            onClick={() => onRemoveImage(questionId)}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ExamResultEditorTemplate({ examResult }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [imageUploadStates, setImageUploadStates] = useState<
    Record<string, boolean>
  >({});
  const [questionImages, setQuestionImages] = useState<Record<string, string>>(
    {}
  );
  const [questionDifficulties, setQuestionDifficulties] = useState<
    Record<string, string>
  >({});
  const part1 = examResult?.parts[0];

  const toggleImageUpload = (questionId: string) => {
    setImageUploadStates((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleDifficultyChange = (
    questionId: string,
    newDifficulty: string
  ) => {
    setQuestionDifficulties((prev) => ({
      ...prev,
      [questionId]: newDifficulty,
    }));
    console.log(
      `Question ${questionId} difficulty changed to: ${newDifficulty}`
    );
  };

  const handleRemoveImage = (questionId: string) => {
    setQuestionImages((prev) => {
      const newImages = { ...prev };
      delete newImages[questionId];
      return newImages;
    });

    // Remove image from examResult JSON
    updateQuestionImage(questionId, null);
  };

  const updateQuestionImage = (questionId: string, imageUrl: string | null) => {
    // Parse questionId to get part and question number
    const [part, questionNumber] = questionId.split("-");
    const partIndex = part === "part1" ? 0 : part === "part2" ? 1 : 2;

    // Update the examResult object (you might want to use a state management solution)
    if (examResult?.parts[partIndex]?.questions) {
      const questionIndex = examResult.parts[partIndex].questions.findIndex(
        (q: any) =>
          q.questionNumber === parseInt(questionNumber) ||
          examResult.parts[partIndex].questions.indexOf(q) ===
            parseInt(questionNumber)
      );

      if (questionIndex !== -1) {
        if (imageUrl) {
          examResult.parts[partIndex].questions[questionIndex].image = imageUrl;
          console.log(
            `🖼️ Updated question ${questionId} with image:`,
            imageUrl
          );
        } else {
          delete examResult.parts[partIndex].questions[questionIndex].image;
          console.log(`🗑️ Removed image from question ${questionId}`);
        }
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    console.log("🎯 Drag started:", event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.data.current) {
      const assetData = active.data.current;
      const dropData = over.data.current;

      console.log("🎯 Drag ended:", {
        activeId: active.id,
        overId: over.id,
        assetData,
        dropData,
      });

      // Check if dropping an image onto a question
      if (dropData?.type === "question" && assetData?.type === "image") {
        console.log("🖼️ Adding image to question:", dropData.id);

        // Handle badge image drop
        if (dropData.questionType === "badge-image") {
          setQuestionImages((prev) => ({
            ...prev,
            [dropData.id]: assetData.content,
          }));
          updateQuestionImage(dropData.id, assetData.content);
        } else {
          // Handle regular question drop zone
          updateQuestionImage(dropData.id, assetData.content);
        }
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex">
        <ToolExamPanel />
        <div className="flex-1 space-y-10 text-xl col-span-4 p-4">
          {examResult?.parts[0]?.title && (
            <h2 className="text-xl font-calsans text-blue-700">
              <span>{examResult?.parts[0]?.part}: </span>
              {examResult?.parts[0]?.title}
            </h2>
          )}
          {part1?.questions?.map((question: any, idx: number) => (
            <div key={idx}>
              <div>
                <div className="flex justify-start items-center gap-2">
                  <span className="font-bold">
                    Câu {question?.questionNumber}:
                  </span>
                  <BadgeWithImageUpload
                    question={question}
                    questionId={`part1-${question?.questionNumber || idx}`}
                    imageUploadStates={imageUploadStates}
                    onToggleImageUpload={toggleImageUpload}
                    onDifficultyChange={handleDifficultyChange}
                    currentDifficulty={
                      questionDifficulties[
                        `part1-${question?.questionNumber || idx}`
                      ]
                    }
                  />
                </div>
                <p>{question?.question}</p>
                <div className="text-violet-700 pl-6">
                  {question?.options &&
                    Object.entries(question.options).map(([key, value]) => (
                      <p key={key}>
                        {key}. {String(value)}
                      </p>
                    ))}
                </div>
                {imageUploadStates[
                  `part1-${question?.questionNumber || idx}`
                ] && (
                  <ImageUploadZone
                    questionId={`part1-${question?.questionNumber || idx}`}
                    questionImages={questionImages}
                    onRemoveImage={handleRemoveImage}
                  />
                )}
              </div>
            </div>
          ))}
          {examResult?.parts[1]?.title && (
            <h2 className="text-xl font-calsans text-blue-700">
              <span>{examResult?.parts[1]?.part}: </span>
              {examResult?.parts[1]?.title}
            </h2>
          )}
          {examResult?.parts[1]?.questions?.map(
            (question: any, idx: number) => (
              <div key={idx}>
                <div>
                  <div className="flex justify-start items-center gap-2">
                    <span className="font-bold">
                      Câu {question?.questionNumber}:
                    </span>
                    <BadgeWithImageUpload
                      question={question}
                      questionId={`part2-${question?.questionNumber || idx}`}
                      imageUploadStates={imageUploadStates}
                      onToggleImageUpload={toggleImageUpload}
                      onDifficultyChange={handleDifficultyChange}
                      currentDifficulty={
                        questionDifficulties[
                          `part2-${question?.questionNumber || idx}`
                        ]
                      }
                    />
                  </div>
                  <p>{question?.question}</p>
                  <div className="text-violet-700 pl-6">
                    {question?.statements &&
                      Object.entries(question.statements).map(
                        ([key, value]: [string, any]) => (
                          <p key={key}>
                            {key}. {value?.text}
                          </p>
                        )
                      )}
                  </div>
                  {imageUploadStates[
                    `part2-${question?.questionNumber || idx}`
                  ] && (
                    <ImageUploadZone
                      questionId={`part2-${question?.questionNumber || idx}`}
                      questionImages={questionImages}
                      onRemoveImage={handleRemoveImage}
                    />
                  )}
                </div>
              </div>
            )
          )}
          {examResult?.parts[2]?.questions?.map(
            (question: any, idx: number) => (
              <div key={idx}>
                <div>
                  <div className="flex justify-start items-center gap-2">
                    <span className="font-bold">
                      Câu {question?.questionNumber}:
                    </span>
                    <BadgeWithImageUpload
                      question={question}
                      questionId={`part3-${question?.questionNumber || idx}`}
                      imageUploadStates={imageUploadStates}
                      onToggleImageUpload={toggleImageUpload}
                      onDifficultyChange={handleDifficultyChange}
                      currentDifficulty={
                        questionDifficulties[
                          `part3-${question?.questionNumber || idx}`
                        ]
                      }
                    />
                  </div>
                  <p className="font-medium">{question?.question}</p>
                  <div className="text-violet-700 pl-6">
                    <p>{question?.answer}</p>
                  </div>
                  {imageUploadStates[
                    `part3-${question?.questionNumber || idx}`
                  ] && (
                    <ImageUploadZone
                      questionId={`part3-${question?.questionNumber || idx}`}
                      questionImages={questionImages}
                      onRemoveImage={handleRemoveImage}
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </DndContext>
  );
}

// Wrapper component with ExamProvider
export default function ExamResultEditor({ examResult }: Props) {
  return (
    <ExamProvider>
      <ExamResultEditorTemplate examResult={examResult} />
    </ExamProvider>
  );
}
