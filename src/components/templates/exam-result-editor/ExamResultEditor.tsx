"use client";

import React, { useState, useEffect } from "react";
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
import { X, Trash2 } from "lucide-react";
import { ExamProvider } from "@/contexts/ExamContext";
import { UploadCloudIcon } from "@/constants/icon";
import { Label } from "@/components/ui/label";
import { AdvancedTextEditor } from "@/components/ui/advanced-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { useUpdateToolResultService } from "@/services/toolResultService";
import { toast } from "sonner";
import ConfirmSaveResult from "@/components/modals/ConfirmSaveResult";

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

  const getTagColor = (difficulty: string) => {
    switch (difficulty) {
      case "APPLICATION":
        return "border-emerald-500 bg-emerald-500 text-white";
      case "COMPREHENSION":
        return "border-amber-100 bg-amber-100 text-yellow-700";
      case "KNOWLEDGE":
        return "border-blue-100 bg-blue-100 text-blue-700";
      case "ANALYSIS":
        return "border-purple-100 bg-purple-100 text-purple-700";
      default:
        return "border-blue-100 bg-blue-100 text-blue-700";
    }
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    if (onDifficultyChange) {
      onDifficultyChange(questionId, newDifficulty);
    }
  };

  // Use currentDifficulty if available, otherwise fall back to question's original difficulty
  const displayDifficulty =
    currentDifficulty || question?.difficultyLevel || "KNOWLEDGE";

  return (
    <div className="flex items-center gap-2">
      <Select value={displayDifficulty} onValueChange={handleDifficultyChange}>
        <SelectTrigger
          className={`w-28 rounded-full px-3 py-1.5 text-xs font-medium border-2 ${getTagColor(
            displayDifficulty
          )}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-transparent border-none">
          <SelectItem
            value="APPLICATION"
            className="rounded-full mx-1 my-0.5 bg-emerald-500 text-white"
          >
            Vận dụng
          </SelectItem>
          <SelectItem
            value="COMPREHENSION"
            className="rounded-full mx-1 my-0.5 bg-amber-100 text-yellow-700"
          >
            Thông hiểu
          </SelectItem>
          <SelectItem
            value="KNOWLEDGE"
            className="rounded-full mx-1 my-0.5 bg-blue-100 text-blue-700"
          >
            Nhận biết
          </SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Label>Thêm hình ảnh</Label>
        <Switch
          checked={isImageUploadOpen}
          onCheckedChange={() => onToggleImageUpload(questionId)}
          className="scale-75 border border-neutral-700"
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
  const [questionContents, setQuestionContents] = useState<
    Record<string, string>
  >({});
  const [answerContents, setAnswerContents] = useState<Record<string, string>>(
    {}
  );
  // State for tracking correct answers for multiple choice questions
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>(
    {}
  );
  // State for tracking correct answers for true/false questions
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<
    Record<string, Record<string, boolean>>
  >({});
  // State for tracking current active part (default: part 1)
  const [activePart, setActivePart] = useState<number>(1);
  // State for confirmation modal
  const [showConfirmSaveResult, setShowConfirmSaveResult] = useState<boolean>(false);

  // Tool result services for saving
  const { mutate: updateToolResult, isPending: isSavingResult } =
    useUpdateToolResultService();

  // Initialize correct answers from API data
  useEffect(() => {
    if (examResult?.data?.parts) {
      const newCorrectAnswers: Record<string, string> = {};
      const newTrueFalseAnswers: Record<string, Record<string, boolean>> = {};
      const newImageUploadStates: Record<string, boolean> = {};
      const newQuestionImages: Record<string, string> = {};

      examResult.data.parts.forEach((part: any, partIndex: number) => {
        part.questions?.forEach((question: any, questionIndex: number) => {
          const questionKey = `part${partIndex + 1}-${
            question?.questionNumber || questionIndex
          }`;

          // Initialize image states if question has image
          if (question?.image) {
            newImageUploadStates[questionKey] = true;
            newQuestionImages[questionKey] = question.image;
          }

          if (partIndex === 0 && question?.answer) {
            // Part 1 - Multiple choice
            newCorrectAnswers[questionKey] = question.answer;
          } else if (partIndex === 1 && question?.statements) {
            // Part 2 - True/False
            const statements: Record<string, boolean> = {};
            Object.entries(question.statements).forEach(
              ([key, value]: [string, any]) => {
                statements[key] = value?.answer || false;
              }
            );
            newTrueFalseAnswers[questionKey] = statements;
          }
        });
      });

      setCorrectAnswers(newCorrectAnswers);
      setTrueFalseAnswers(newTrueFalseAnswers);
      setImageUploadStates(newImageUploadStates);
      setQuestionImages(newQuestionImages);
    }
  }, [examResult]);

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

  const handleDeleteQuestion = (partIndex: number, questionIndex: number) => {
    if (examResult?.data?.parts[partIndex]?.questions) {
      // Remove the question from the array
      examResult.data.parts[partIndex].questions.splice(questionIndex, 1);

      // Update question numbers for remaining questions
      examResult.data.parts[partIndex].questions.forEach(
        (q: any, idx: number) => {
          q.questionNumber = idx + 1;
        }
      );

      console.log(
        `🗑️ Deleted question ${questionIndex + 1} from part ${partIndex + 1}`
      );

      // Force re-render by updating a state
      setQuestionContents((prev) => ({ ...prev }));
    }
  };

  const updateQuestionImage = (questionId: string, imageUrl: string | null) => {
    // Parse questionId to get part and question number
    const [part, questionNumber] = questionId.split("-");
    const partIndex = part === "part1" ? 0 : part === "part2" ? 1 : 2;

    // Update the examResult object (you might want to use a state management solution)
    if (examResult?.data?.parts[partIndex]?.questions) {
      const questionIndex = examResult.data.parts[
        partIndex
      ].questions.findIndex(
        (q: any) =>
          q.questionNumber === parseInt(questionNumber) ||
          examResult.data.parts[partIndex].questions.indexOf(q) ===
            parseInt(questionNumber)
      );

      if (questionIndex !== -1) {
        if (imageUrl) {
          examResult.data.parts[partIndex].questions[questionIndex].image =
            imageUrl;
          console.log(
            `🖼️ Updated question ${questionId} with image:`,
            imageUrl
          );
        } else {
          delete examResult.data.parts[partIndex].questions[questionIndex]
            .image;
          console.log(`🗑️ Removed image from question ${questionId}`);
        }
      }
    }
  };

  const handleSaveExam = () => {
    setShowConfirmSaveResult(true);
  };

  const handleConfirmSave = (formData: { name: string; description?: string }) => {
    if (!examResult?.id) {
      toast.error("Không tìm thấy ID để lưu kết quả");
      return;
    }

    // Create a deep copy of examResult to avoid mutating the original
    const updatedExamResult = JSON.parse(JSON.stringify(examResult));

    // Update all question contents, answer contents, difficulties, and correct answers
    if (updatedExamResult?.data?.parts) {
      updatedExamResult.data.parts.forEach((part: any, partIndex: number) => {
        part.questions?.forEach((question: any, questionIndex: number) => {
          const questionKey = `part${partIndex + 1}-${question?.questionNumber || questionIndex}`;

          // Update question content
          const questionContentKey = `${questionKey}-question`;
          if (questionContents[questionContentKey]) {
            question.question = questionContents[questionContentKey];
          }

          // Update difficulty level
          if (questionDifficulties[questionKey]) {
            question.difficultyLevel = questionDifficulties[questionKey];
          }

          // Update based on part type
          if (partIndex === 0) {
            // Part 1 - Multiple choice
            // Update correct answer
            if (correctAnswers[questionKey]) {
              question.answer = correctAnswers[questionKey];
            }

            // Update option contents
            if (question.options) {
              Object.keys(question.options).forEach((optionKey) => {
                const optionContentKey = `${questionKey}-option-${optionKey}`;
                if (answerContents[optionContentKey]) {
                  question.options[optionKey] = answerContents[optionContentKey];
                }
              });
            }
          } else if (partIndex === 1) {
            // Part 2 - True/False
            // Update statement contents and answers
            if (question.statements) {
              Object.keys(question.statements).forEach((statementKey) => {
                const statementContentKey = `${questionKey}-statement-${statementKey}`;
                if (answerContents[statementContentKey]) {
                  question.statements[statementKey].text = answerContents[statementContentKey];
                }

                // Update true/false answers
                if (trueFalseAnswers[questionKey] && trueFalseAnswers[questionKey][statementKey] !== undefined) {
                  question.statements[statementKey].answer = trueFalseAnswers[questionKey][statementKey];
                }
              });
            }
          } else if (partIndex === 2) {
            // Part 3 - Essay
            // Update answer content
            const answerContentKey = `${questionKey}-answer`;
            if (answerContents[answerContentKey]) {
              question.answer = answerContents[answerContentKey];
            }
          }
        });
      });
    }

    const saveData = {
      name: formData.name,
      description: formData.description || "",
      data: updatedExamResult.data,
      status: "ARCHIVED",
    };

    updateToolResult(
      {
        id: examResult.id,
        data: saveData,
      },
      {
        onSuccess: () => {
          toast.success("Lưu kết quả thành công!");
          setShowConfirmSaveResult(false);
        },
        onError: (error: any) => {
          console.error("Error saving result:", error);
          toast.error(
            error?.response?.data?.message || "Có lỗi xảy ra khi lưu kết quả"
          );
        },
      }
    );
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
      <div>
        <div className="min-h-14 p-2 border-b-2 flex justify-between items-center">
          <p className="font-calsans text-lg">{examResult?.name}</p>
          <Button onClick={handleSaveExam} disabled={isSavingResult}>
            {isSavingResult ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
        <div className="flex">
          <ToolExamPanel />
          <div className="flex-1 space-y-10 p-5 col-span-4 ">
            {/* Navigation buttons for parts */}
            <div className="flex gap-2 mb-6 border-b pb-4">
              {examResult?.data?.parts?.map((part: any, index: number) => (
                <Button
                  key={index}
                  onClick={() => setActivePart(index + 1)}
                  variant={activePart === index + 1 ? "default" : "outline"}
                  className="rounded-full"
                  size={"sm"}
                >
                  {part?.part || `Phần ${index + 1}`}
                </Button>
              ))}
            </div>
            {/* Part 1 - Multiple Choice */}
            {activePart === 1 && examResult?.data?.parts[0] && (
              <>
                {examResult?.data?.parts[0]?.title && (
                  <h2 className="text-xl font-calsans text-blue-700">
                    <span>{examResult?.data?.parts[0]?.part}: </span>
                    {examResult?.data?.parts[0]?.title}
                  </h2>
                )}
                {examResult?.data?.parts[0]?.questions?.map(
                  (question: any, idx: number) => (
                    <div key={idx}>
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="flex justify-start items-center gap-2">
                            <span className="font-bold">
                              Câu {question?.questionNumber}:
                            </span>
                            <BadgeWithImageUpload
                              question={question}
                              questionId={`part1-${
                                question?.questionNumber || idx
                              }`}
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
                          <button
                            onClick={() => handleDeleteQuestion(0, idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3">
                          <AdvancedTextEditor
                            content={
                              questionContents[
                                `part1-${
                                  question?.questionNumber || idx
                                }-question`
                              ] ||
                              question?.question ||
                              ""
                            }
                            onChange={(content) =>
                              setQuestionContents((prev) => ({
                                ...prev,
                                [`part1-${
                                  question?.questionNumber || idx
                                }-question`]: content,
                              }))
                            }
                            placeholder="Nhập nội dung câu hỏi..."
                            className="mb-4"
                          />
                          {question.image && (
                            <div className="mb-3 flex justify-center">
                              <img
                                src={question.image}
                                alt="Hình minh họa"
                                className="max-w-xs max-h-48 rounded border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="pl-6">
                          {/* Display each option on a separate row with checkbox and input */}
                          <div>
                            {question?.options &&
                              Object.entries(question.options).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex items-center gap-3 p-2"
                                  >
                                    {/* Checkbox for correct answer */}
                                    <Checkbox
                                      id={`correct-${
                                        question?.questionNumber || idx
                                      }-${key}`}
                                      checked={
                                        correctAnswers[
                                          `part1-${
                                            question?.questionNumber || idx
                                          }`
                                        ] === key || question?.answer === key
                                      }
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          // Chỉ cho phép chọn 1 đáp án duy nhất
                                          setCorrectAnswers((prev) => ({
                                            ...prev,
                                            [`part1-${
                                              question?.questionNumber || idx
                                            }`]: key,
                                          }));
                                        } else {
                                          // Bỏ chọn đáp án hiện tại
                                          setCorrectAnswers((prev) => {
                                            const newAnswers = { ...prev };
                                            delete newAnswers[
                                              `part1-${
                                                question?.questionNumber || idx
                                              }`
                                            ];
                                            return newAnswers;
                                          });
                                        }
                                      }}
                                    />

                                    {/* Option label */}
                                    <span className="font-medium text-lg max-w-5">
                                      {key}.
                                    </span>

                                    {/* Answer content input */}
                                    <div className="flex-1">
                                      <AdvancedTextEditor
                                        content={
                                          answerContents[
                                            `part1-${
                                              question?.questionNumber || idx
                                            }-option-${key}`
                                          ] ||
                                          String(value) ||
                                          ""
                                        }
                                        onChange={(content) =>
                                          setAnswerContents((prev) => ({
                                            ...prev,
                                            [`part1-${
                                              question?.questionNumber || idx
                                            }-option-${key}`]: content,
                                          }))
                                        }
                                        placeholder={`Nhập nội dung đáp án ${key}...`}
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        </div>
                        {imageUploadStates[
                          `part1-${question?.questionNumber || idx}`
                        ] && (
                          <ImageUploadZone
                            questionId={`part1-${
                              question?.questionNumber || idx
                            }`}
                            questionImages={questionImages}
                            onRemoveImage={handleRemoveImage}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* Part 2 - True/False */}
            {activePart === 2 && examResult?.data?.parts[1] && (
              <>
                {examResult?.data?.parts[1]?.title && (
                  <h2 className="text-xl font-calsans text-blue-700">
                    <span>{examResult?.data?.parts[1]?.part}: </span>
                    {examResult?.data?.parts[1]?.title}
                  </h2>
                )}
                {examResult?.data?.parts[1]?.questions?.map(
                  (question: any, idx: number) => (
                    <div key={idx}>
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="flex justify-start items-center gap-2">
                            <span className="font-bold">
                              Câu {question?.questionNumber}:
                            </span>
                            <BadgeWithImageUpload
                              question={question}
                              questionId={`part2-${
                                question?.questionNumber || idx
                              }`}
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
                          <button
                            onClick={() => handleDeleteQuestion(1, idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3">
                          <AdvancedTextEditor
                            content={
                              questionContents[
                                `part2-${
                                  question?.questionNumber || idx
                                }-question`
                              ] ||
                              question?.question ||
                              ""
                            }
                            onChange={(content) =>
                              setQuestionContents((prev) => ({
                                ...prev,
                                [`part2-${
                                  question?.questionNumber || idx
                                }-question`]: content,
                              }))
                            }
                            placeholder="Nhập nội dung câu hỏi..."
                            className="mb-4"
                          />
                          {question.image && (
                            <div className="mb-3 flex justify-center">
                              <img
                                src={question.image}
                                alt="Hình minh họa"
                                className="max-w-xs max-h-48 rounded border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="pl-6">
                          {question?.statements &&
                            Object.entries(question.statements).map(
                              ([key, value]: [string, any]) => (
                                <div
                                  key={key}
                                  className="mb-4 p-4 border rounded-lg"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-lg">
                                      {key}.
                                    </span>
                                    <AdvancedTextEditor
                                      content={
                                        answerContents[
                                          `part2-${
                                            question?.questionNumber || idx
                                          }-statement-${key}`
                                        ] ||
                                        value?.text ||
                                        ""
                                      }
                                      onChange={(content) =>
                                        setAnswerContents((prev) => ({
                                          ...prev,
                                          [`part2-${
                                            question?.questionNumber || idx
                                          }-statement-${key}`]: content,
                                        }))
                                      }
                                      placeholder={`Nhập nội dung câu ${key}...`}
                                      className="flex-1"
                                    />
                                  </div>

                                  {/* True/False answer selection */}
                                  <div className="flex gap-4 ml-6">
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`true-${
                                          question?.questionNumber || idx
                                        }-${key}`}
                                        checked={
                                          trueFalseAnswers[
                                            `part2-${
                                              question?.questionNumber || idx
                                            }`
                                          ]?.[key] === true ||
                                          value?.answer === true
                                        }
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            // Chọn "Đúng" - chỉ cho phép chọn 1 trong 2 (Đúng/Sai)
                                            setTrueFalseAnswers((prev) => ({
                                              ...prev,
                                              [`part2-${
                                                question?.questionNumber || idx
                                              }`]: {
                                                ...prev[
                                                  `part2-${
                                                    question?.questionNumber ||
                                                    idx
                                                  }`
                                                ],
                                                [key]: true,
                                              },
                                            }));
                                          } else {
                                            // Bỏ chọn "Đúng"
                                            setTrueFalseAnswers((prev) => {
                                              const newAnswers = { ...prev };
                                              const questionKey = `part2-${
                                                question?.questionNumber || idx
                                              }`;
                                              if (newAnswers[questionKey]) {
                                                const newQuestionAnswers = {
                                                  ...newAnswers[questionKey],
                                                };
                                                delete newQuestionAnswers[key];
                                                newAnswers[questionKey] =
                                                  newQuestionAnswers;
                                              }
                                              return newAnswers;
                                            });
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`true-${
                                          question?.questionNumber || idx
                                        }-${key}`}
                                        className="text-sm font-medium cursor-pointer text-green-600"
                                      >
                                        Đúng
                                      </Label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        id={`false-${
                                          question?.questionNumber || idx
                                        }-${key}`}
                                        checked={
                                          trueFalseAnswers[
                                            `part2-${
                                              question?.questionNumber || idx
                                            }`
                                          ]?.[key] === false ||
                                          value?.answer === false
                                        }
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            // Chọn "Sai" - chỉ cho phép chọn 1 trong 2 (Đúng/Sai)
                                            setTrueFalseAnswers((prev) => ({
                                              ...prev,
                                              [`part2-${
                                                question?.questionNumber || idx
                                              }`]: {
                                                ...prev[
                                                  `part2-${
                                                    question?.questionNumber ||
                                                    idx
                                                  }`
                                                ],
                                                [key]: false,
                                              },
                                            }));
                                          } else {
                                            // Bỏ chọn "Sai"
                                            setTrueFalseAnswers((prev) => {
                                              const newAnswers = { ...prev };
                                              const questionKey = `part2-${
                                                question?.questionNumber || idx
                                              }`;
                                              if (newAnswers[questionKey]) {
                                                const newQuestionAnswers = {
                                                  ...newAnswers[questionKey],
                                                };
                                                delete newQuestionAnswers[key];
                                                newAnswers[questionKey] =
                                                  newQuestionAnswers;
                                              }
                                              return newAnswers;
                                            });
                                          }
                                        }}
                                      />
                                      <Label
                                        htmlFor={`false-${
                                          question?.questionNumber || idx
                                        }-${key}`}
                                        className="text-sm font-medium cursor-pointer text-red-600"
                                      >
                                        Sai
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                        </div>
                        {imageUploadStates[
                          `part2-${question?.questionNumber || idx}`
                        ] && (
                          <ImageUploadZone
                            questionId={`part2-${
                              question?.questionNumber || idx
                            }`}
                            questionImages={questionImages}
                            onRemoveImage={handleRemoveImage}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </>
            )}

            {/* Part 3 - Essay Questions */}
            {activePart === 3 && examResult?.data?.parts[2] && (
              <>
                {examResult?.data?.parts[2]?.title && (
                  <h2 className="text-xl font-calsans text-blue-700">
                    <span>{examResult?.data?.parts[2]?.part}: </span>
                    {examResult?.data?.parts[2]?.title}
                  </h2>
                )}
                {examResult?.data?.parts[2]?.questions?.map(
                  (question: any, idx: number) => (
                    <div key={idx}>
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="flex justify-start items-center gap-2">
                            <span className="font-bold">
                              Câu {question?.questionNumber}:
                            </span>
                            <BadgeWithImageUpload
                              question={question}
                              questionId={`part3-${
                                question?.questionNumber || idx
                              }`}
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
                          <button
                            onClick={() => handleDeleteQuestion(2, idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa câu hỏi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-3">
                          <AdvancedTextEditor
                            content={
                              questionContents[
                                `part3-${
                                  question?.questionNumber || idx
                                }-question`
                              ] ||
                              question?.question ||
                              ""
                            }
                            onChange={(content) =>
                              setQuestionContents((prev) => ({
                                ...prev,
                                [`part3-${
                                  question?.questionNumber || idx
                                }-question`]: content,
                              }))
                            }
                            placeholder="Nhập nội dung câu hỏi..."
                            className="mb-4"
                          />
                          {question.image && (
                            <div className="mb-3 flex justify-center">
                              <img
                                src={question.image}
                                alt="Hình minh họa"
                                className="max-w-xs max-h-48 rounded border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="pl-6">
                          <div className="flex justify-start items-center w-full">
                            <p className="text-nowrap font-bold text-violet-500 pr-2">
                              Đáp án:{" "}
                            </p>
                            <AdvancedTextEditor
                              content={
                                answerContents[
                                  `part3-${
                                    question?.questionNumber || idx
                                  }-answer`
                                ] ||
                                question?.answer ||
                                ""
                              }
                              onChange={(content) =>
                                setAnswerContents((prev) => ({
                                  ...prev,
                                  [`part3-${
                                    question?.questionNumber || idx
                                  }-answer`]: content,
                                }))
                              }
                              placeholder="Nhập đáp án..."
                              className="inline-block w-full"
                            />
                          </div>
                        </div>
                        {imageUploadStates[
                          `part3-${question?.questionNumber || idx}`
                        ] && (
                          <ImageUploadZone
                            questionId={`part3-${
                              question?.questionNumber || idx
                            }`}
                            questionImages={questionImages}
                            onRemoveImage={handleRemoveImage}
                          />
                        )}
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </div>

        {/* Confirmation Save Modal */}
        <ConfirmSaveResult
          isOpen={showConfirmSaveResult}
          onClose={() => setShowConfirmSaveResult(false)}
          onConfirm={handleConfirmSave}
          resultId={examResult?.id}
          data={examResult}
          isLoading={isSavingResult}
          initialName={examResult?.name || ""}
          initialDescription={examResult?.description || ""}
        />
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
