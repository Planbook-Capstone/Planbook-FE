"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { X, Trash2, Plus } from "lucide-react";
import { ExamProvider } from "@/contexts/ExamContext";
import { DowloadIcon, UploadCloudIcon } from "@/constants/icon";
import { Label } from "@/components/ui/label";
import { AdvancedTextEditor } from "@/components/ui/advanced-text-editor";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import { useUpdateToolResultService } from "@/services/toolResultService";
import { toast } from "sonner";
import ConfirmSaveResult from "@/components/modals/ConfirmSaveResult";
import { useRouter } from "next/navigation";
import TemplatePreview from "@/components/organisms/template-preview";

import { generateExamDocx, ExamData } from "@/utils/docxGeneratorExam";
import { useExamResultEditor } from "@/hooks/useExamResultEditor";
import { ExamResultEditorProvider } from "@/contexts/ExamResultEditorContext";

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
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localExamResult, setLocalExamResult] = useState(examResult);

  // Update local state when examResult prop changes (only on initial load)
  useEffect(() => {
    if (examResult && !localExamResult) {
      setLocalExamResult(examResult);
    }
  }, [examResult, localExamResult]);

  // Function to update answer states for newly added questions
  const updateAnswerStatesForNewQuestion = useCallback(
    (question: any, partIndex: number, questionNumber: number) => {
      const questionKey = `part${partIndex + 1}-${questionNumber}`;

      if (partIndex === 0 && question?.answer) {
        // Part 1 - Multiple choice
        setCorrectAnswers((prev) => ({
          ...prev,
          [questionKey]: question.answer,
        }));
        console.log("🔍 Updated correctAnswers for new PART_I question:", {
          questionKey,
          answer: question.answer,
        });
      } else if (partIndex === 1 && question?.statements) {
        // Part 2 - True/False
        const statements: Record<string, boolean> = {};
        Object.entries(question.statements).forEach(
          ([key, value]: [string, any]) => {
            if (typeof value === "object" && value !== null) {
              statements[key] = Boolean(value.answer);
            } else {
              statements[key] = Boolean(value);
            }
          }
        );
        setTrueFalseAnswers((prev) => ({
          ...prev,
          [questionKey]: statements,
        }));
        console.log("🔍 Updated trueFalseAnswers for new PART_II question:", {
          questionKey,
          statements,
        });
      }
    },
    []
  );

  // Use the new hook for exam result editor with local state
  const { addQuestionFromBankByType, deleteQuestion, addEmptyQuestion } =
    useExamResultEditor({
      examResult: localExamResult,
      onDataChange: (updatedData) => {
        // Update local state when data changes
        setLocalExamResult(updatedData);
        setQuestionContents((prev) => ({ ...prev }));
      },
      onQuestionAdded: updateAnswerStatesForNewQuestion,
    });
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
  const [showConfirmSaveResult, setShowConfirmSaveResult] =
    useState<boolean>(false);
  // State for preview modal
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Tool result services for saving
  const { mutate: updateToolResult, isPending: isSavingResult } =
    useUpdateToolResultService();

  // Initialize correct answers from API data
  useEffect(() => {
    if (localExamResult?.data?.parts) {
      const newCorrectAnswers: Record<string, string> = {};
      const newTrueFalseAnswers: Record<string, Record<string, boolean>> = {};
      const newImageUploadStates: Record<string, boolean> = {};
      const newQuestionImages: Record<string, string> = {};

      localExamResult.data.parts.forEach((part: any, partIndex: number) => {
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
            console.log("🔍 Initializing correctAnswers for PART_I:", {
              questionKey,
              questionAnswer: question.answer,
              questionOptions: question.options,
            });
          } else if (partIndex === 1 && question?.statements) {
            // Part 2 - True/False
            const statements: Record<string, boolean> = {};
            Object.entries(question.statements).forEach(
              ([key, value]: [string, any]) => {
                // Handle both formats: { text: string, answer: boolean } and boolean directly
                if (typeof value === "object" && value !== null) {
                  statements[key] = Boolean(value.answer);
                } else {
                  statements[key] = Boolean(value);
                }
              }
            );
            newTrueFalseAnswers[questionKey] = statements;
          }
        });
      });

      // Merge with existing states instead of replacing completely
      setCorrectAnswers((prev) => ({ ...prev, ...newCorrectAnswers }));
      setTrueFalseAnswers((prev) => ({ ...prev, ...newTrueFalseAnswers }));
      setImageUploadStates((prev) => ({ ...prev, ...newImageUploadStates }));
      setQuestionImages((prev) => ({ ...prev, ...newQuestionImages }));

      console.log("🔍 Updated all states:", {
        newCorrectAnswers,
        newTrueFalseAnswers,
        totalQuestions: localExamResult.data.parts.reduce(
          (total: number, part: any) => total + (part.questions?.length || 0),
          0
        ),
      });
    }
  }, [localExamResult]);

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
    // Use the hook's delete function
    deleteQuestion(partIndex, questionIndex);
  };

  const handleAddQuestion = (partIndex: number) => {
    // Use the hook's add empty question function
    addEmptyQuestion(partIndex);
  };

  const updateQuestionImage = (questionId: string, imageUrl: string | null) => {
    // Parse questionId to get part and question number
    const [part, questionNumber] = questionId.split("-");
    const partIndex = part === "part1" ? 0 : part === "part2" ? 1 : 2;

    // Update the localExamResult object
    if (localExamResult?.data?.parts[partIndex]?.questions) {
      const questionIndex = localExamResult.data.parts[
        partIndex
      ].questions.findIndex(
        (q: any) =>
          q.questionNumber === parseInt(questionNumber) ||
          localExamResult.data.parts[partIndex].questions.indexOf(q) ===
            parseInt(questionNumber)
      );

      if (questionIndex !== -1) {
        if (imageUrl) {
          localExamResult.data.parts[partIndex].questions[questionIndex].image =
            imageUrl;
          console.log(
            `🖼️ Updated question ${questionId} with image:`,
            imageUrl
          );
        } else {
          delete localExamResult.data.parts[partIndex].questions[questionIndex]
            .image;
          console.log(`🗑️ Removed image from question ${questionId}`);
        }
      }
    }
  };

  const handleSaveExam = () => {
    setShowConfirmSaveResult(true);
  };

  // Hàm chuyển đổi dữ liệu từ format examResult.data.parts sang ExamData
  const convertToExamData = (data: any): ExamData => {
    const questions: any[] = [];
    const yesNoQuestions: any[] = [];
    const shortQuestions: any[] = [];

    if (data.parts) {
      data.parts.forEach((part: any, partIndex: number) => {
        if (part.questions) {
          part.questions.forEach((q: any) => {
            // Lấy nội dung câu hỏi đã được edit (nếu có)
            const questionKey = `part${partIndex + 1}-${
              q?.questionNumber || 0
            }`;
            const questionContentKey = `${questionKey}-question`;
            const finalQuestionContent =
              questionContents[questionContentKey] || q.question || "";

            if (partIndex === 0) {
              // Part 1 - Multiple Choice (PHẦN I)
              const finalOptions: Record<string, string> = {};
              if (q.options) {
                Object.keys(q.options).forEach((optionKey) => {
                  const optionContentKey = `${questionKey}-option-${optionKey}`;
                  finalOptions[optionKey] =
                    answerContents[optionContentKey] ||
                    q.options[optionKey] ||
                    "";
                });
              }

              questions.push({
                question: finalQuestionContent,
                options: finalOptions,
                illustrationImage: q.image || questionImages[questionKey],
              });
            } else if (partIndex === 1) {
              // Part 2 - True/False (PHẦN II)
              const finalStatements: any = {};

              if (q.statements) {
                // Get all statement keys and normalize them to a, b, c, d format
                const statementKeys = Object.keys(q.statements);
                const targetKeys = ["a", "b", "c", "d"];

                // Map original keys to target keys (a, b, c, d)
                targetKeys.forEach((targetKey, index) => {
                  if (index < statementKeys.length) {
                    const originalKey = statementKeys[index];
                    const statementContentKey = `${questionKey}-statement-${originalKey}`;
                    finalStatements[targetKey] = {
                      text:
                        answerContents[statementContentKey] ||
                        q.statements[originalKey]?.text ||
                        "",
                    };
                  } else {
                    // Fill empty statements if not enough data
                    finalStatements[targetKey] = {
                      text: "",
                    };
                  }
                });
              } else {
                // Fallback: create empty statements
                ["a", "b", "c", "d"].forEach((key) => {
                  finalStatements[key] = { text: "" };
                });
              }

              yesNoQuestions.push({
                question: finalQuestionContent,
                statements: finalStatements,
                illustrationImage: q.image || questionImages[questionKey],
              });
            } else {
              // Part 3 - Short Answer (PHẦN III)
              shortQuestions.push({
                question: finalQuestionContent,
                illustrationImage: q.image || questionImages[questionKey],
              });
            }
          });
        }
      });
    }

    return {
      examTitle: data.examTitle || data.title || "ĐỀ KIỂM TRA",
      examSubject: data.examSubject || data.subject || "Môn học",
      examTime:
        data.examTime || data.duration || "45 phút, không kể thời gian phát đề",
      examDate: data.examDate || new Date().toLocaleDateString("vi-VN"),
      examCode: data.examCode || data.code || "001",
      atomic_masses: data.atomic_masses || data.atomicMasses || null,
      questions,
      yesNoQuestions,
      shortQuestions,
    };
  };

  // Hàm tạo dữ liệu preview với các thay đổi từ state
  const getPreviewData = () => {
    if (!localExamResult?.data) return null;

    // Tạo bản sao sâu của dữ liệu gốc
    const previewData = JSON.parse(JSON.stringify(localExamResult.data));

    // Cập nhật nội dung câu hỏi và đáp án từ state
    if (previewData?.parts) {
      previewData.parts.forEach((part: any, partIndex: number) => {
        part.questions?.forEach((question: any, questionIndex: number) => {
          const questionKey = `part${partIndex + 1}-${
            question?.questionNumber || questionIndex
          }`;

          // Cập nhật nội dung câu hỏi
          const questionContentKey = `${questionKey}-question`;
          if (questionContents[questionContentKey]) {
            question.question = questionContents[questionContentKey];
          }

          // Cập nhật độ khó
          if (questionDifficulties[questionKey]) {
            question.difficultyLevel = questionDifficulties[questionKey];
          }

          // Cập nhật hình ảnh
          if (questionImages[questionKey]) {
            question.image = questionImages[questionKey];
          }

          // Cập nhật theo từng loại câu hỏi
          if (partIndex === 0) {
            // Part 1 - Multiple choice
            // Cập nhật đáp án đúng
            if (correctAnswers[questionKey]) {
              question.answer = correctAnswers[questionKey];
            }

            // Cập nhật nội dung các lựa chọn
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
            // Cập nhật nội dung và đáp án của các statement
            if (question.statements) {
              Object.keys(question.statements).forEach((statementKey) => {
                const statementContentKey = `${questionKey}-statement-${statementKey}`;
                if (answerContents[statementContentKey]) {
                  question.statements[statementKey].text = answerContents[statementContentKey];
                }

                // Cập nhật đáp án true/false
                if (
                  trueFalseAnswers[questionKey] &&
                  trueFalseAnswers[questionKey][statementKey] !== undefined
                ) {
                  question.statements[statementKey].answer =
                    trueFalseAnswers[questionKey][statementKey];
                }
              });
            }
          } else if (partIndex === 2) {
            // Part 3 - Essay
            // Cập nhật đáp án
            const answerContentKey = `${questionKey}-answer`;
            if (answerContents[answerContentKey]) {
              question.answer = answerContents[answerContentKey];
            }
          }
        });
      });
    }

    return previewData;
  };

  const handleDownload = async () => {
    try {
      if (localExamResult?.data) {
        // Sử dụng dữ liệu preview đã được cập nhật
        const previewData = getPreviewData();
        if (!previewData) {
          toast.error("Không có dữ liệu đề thi để tải xuống");
          return;
        }

        // Chuyển đổi dữ liệu từ format previewData sang format ExamData
        const convertedData = convertToExamData(previewData);

        // Debug: Log converted data to check format
        console.log("🔍 Converted data for DOCX:", {
          yesNoQuestions: convertedData.yesNoQuestions,
          totalYesNoQuestions: convertedData.yesNoQuestions.length,
        });

        // Gọi hàm generator docx để tạo và download file
        await generateExamDocx(convertedData);
        toast.success("Tải xuống file DOCX thành công!");
      } else {
        toast.error("Không có dữ liệu đề thi để tải xuống");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Có lỗi xảy ra khi tải xuống. Vui lòng thử lại.");
    }
  };

  const handleConfirmSave = (formData: {
    name: string;
    description?: string;
  }) => {
    if (!localExamResult?.id) {
      toast.error("Không tìm thấy ID để lưu kết quả");
      return;
    }

    // Create a deep copy of localExamResult to avoid mutating the original
    const updatedExamResult = JSON.parse(JSON.stringify(localExamResult));

    // Update all question contents, answer contents, difficulties, and correct answers
    if (updatedExamResult?.data?.parts) {
      updatedExamResult.data.parts.forEach((part: any, partIndex: number) => {
        part.questions?.forEach((question: any, questionIndex: number) => {
          const questionKey = `part${partIndex + 1}-${
            question?.questionNumber || questionIndex
          }`;

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
                  question.options[optionKey] =
                    answerContents[optionContentKey];
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
                  question.statements[statementKey].text =
                    answerContents[statementContentKey];
                }

                // Update true/false answers
                if (
                  trueFalseAnswers[questionKey] &&
                  trueFalseAnswers[questionKey][statementKey] !== undefined
                ) {
                  question.statements[statementKey].answer =
                    trueFalseAnswers[questionKey][statementKey];
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
      ...(localExamResult?.status === "DRAFT" ? { status: "ARCHIVED" } : {}),
    };

    updateToolResult(
      {
        id: localExamResult.id,
        data: saveData,
      },
      {
        onSuccess: () => {
          toast.success("Lưu kết quả thành công!");
          router.push("/my-library/EXAM");
          setShowConfirmSaveResult(false);
        },
        onError: (error: any) => {
          console.error("Error saving result:", error);
          toast.error(
            error?.response?.data || "Có lỗi xảy ra khi lưu kết quả"
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
          <div className="flex justify-center items-center gap-2">
            <p
              onClick={() => router.back()}
              className="border-r-2 pr-1 cursor-pointer"
            >
              Quay lại
            </p>
            <p className="font-calsans text-lg">{localExamResult?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowPreviewModal(true)} variant="outline">
              Xem trước
            </Button>
            <Button onClick={handleSaveExam} disabled={isSavingResult}>
              {isSavingResult ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>
        <div className="flex">
          <ExamResultEditorProvider
            onAddQuestionFromBank={addQuestionFromBankByType}
          >
            <ToolExamPanel />
          </ExamResultEditorProvider>
          <div className="flex-1 space-y-10 p-5 col-span-4 border-l min-h-screen ">
            {/* Navigation buttons for parts */}
            <div className="flex gap-2 mb-6 border-b pb-4">
              {localExamResult?.data?.parts?.map((part: any, index: number) => (
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
            {activePart === 1 && localExamResult?.data?.parts[0] && (
              <>
                <div className="flex justify-between items-center mb-4">
                  {localExamResult?.data?.parts[0]?.title && (
                    <h2 className="text-xl font-calsans text-blue-700">
                      <span>{localExamResult?.data?.parts[0]?.part}: </span>
                      {localExamResult?.data?.parts[0]?.title}
                    </h2>
                  )}
                  <Button
                    onClick={() => handleAddQuestion(0)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </Button>
                </div>
                {localExamResult?.data?.parts[0]?.questions?.map(
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
                            className="mb-4 border-b"
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
                                        ] === key ||
                                        (correctAnswers[
                                          `part1-${
                                            question?.questionNumber || idx
                                          }`
                                        ] === undefined &&
                                          question?.answer === key)
                                      }
                                      onCheckedChange={(checked) => {
                                        const questionKey = `part1-${
                                          question?.questionNumber || idx
                                        }`;

                                        if (checked) {
                                          // Chỉ cho phép chọn 1 đáp án duy nhất - thay thế đáp án cũ
                                          setCorrectAnswers((prev) => ({
                                            ...prev,
                                            [questionKey]: key,
                                          }));
                                        } else {
                                          // Không cho phép bỏ chọn tất cả - phải có ít nhất 1 đáp án được chọn
                                          // Nếu muốn cho phép bỏ chọn hoàn toàn, uncomment dòng dưới:
                                          // setCorrectAnswers((prev) => {
                                          //   const newAnswers = { ...prev };
                                          //   delete newAnswers[questionKey];
                                          //   return newAnswers;
                                          // });
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
                                        className="w-full border-b"
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
            {activePart === 2 && localExamResult?.data?.parts[1] && (
              <>
                <div className="flex justify-between items-center mb-4">
                  {localExamResult?.data?.parts[1]?.title && (
                    <h2 className="text-xl font-calsans text-blue-700">
                      <span>{localExamResult?.data?.parts[1]?.part}: </span>
                      {localExamResult?.data?.parts[1]?.title}
                    </h2>
                  )}
                  <Button
                    onClick={() => handleAddQuestion(1)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </Button>
                </div>
                {localExamResult?.data?.parts[1]?.questions?.map(
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
                            className="mb-4 border-b"
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
                                      className="flex-1 border-b"
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
                                          (trueFalseAnswers[
                                            `part2-${
                                              question?.questionNumber || idx
                                            }`
                                          ]?.[key] === undefined &&
                                            value?.answer === true)
                                        }
                                        onCheckedChange={(checked) => {
                                          const questionKey = `part2-${
                                            question?.questionNumber || idx
                                          }`;

                                          if (checked) {
                                            // Chọn "Đúng" - tự động set thành true
                                            setTrueFalseAnswers((prev) => ({
                                              ...prev,
                                              [questionKey]: {
                                                ...prev[questionKey],
                                                [key]: true,
                                              },
                                            }));
                                          }
                                          // Không cho phép bỏ chọn - phải chọn Đúng hoặc Sai
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
                                          (trueFalseAnswers[
                                            `part2-${
                                              question?.questionNumber || idx
                                            }`
                                          ]?.[key] === undefined &&
                                            value?.answer === false)
                                        }
                                        onCheckedChange={(checked) => {
                                          const questionKey = `part2-${
                                            question?.questionNumber || idx
                                          }`;

                                          if (checked) {
                                            // Chọn "Sai" - tự động set thành false
                                            setTrueFalseAnswers((prev) => ({
                                              ...prev,
                                              [questionKey]: {
                                                ...prev[questionKey],
                                                [key]: false,
                                              },
                                            }));
                                          }
                                          // Không cho phép bỏ chọn - phải chọn Đúng hoặc Sai
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
            {activePart === 3 && localExamResult?.data?.parts[2] && (
              <>
                <div className="flex justify-between items-center mb-4">
                  {localExamResult?.data?.parts[2]?.title && (
                    <h2 className="text-xl font-calsans text-blue-700">
                      <span>{localExamResult?.data?.parts[2]?.part}: </span>
                      {localExamResult?.data?.parts[2]?.title}
                    </h2>
                  )}
                  <Button
                    onClick={() => handleAddQuestion(2)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm câu hỏi
                  </Button>
                </div>
                {localExamResult?.data?.parts[2]?.questions?.map(
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
                            className="mb-4 border-b"
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
                              className="inline-block w-full border-b"
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

        {/* Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-calsans text-gray-800">
                  Xem trước đề thi
                </h2>
                <div className="flex items-center gap-3">
                  <Button onClick={handleDownload}>
                    {DowloadIcon}
                    <span>Tải về</span>
                  </Button>
                  <Button
                    onClick={() => setShowPreviewModal(false)}
                    variant="outline"
                  >
                    <X className="w-4 h-4" />
                    <span>Đóng</span>
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                <div
                  className="max-w-[210mm] mx-auto bg-white shadow-lg"
                  style={{ minHeight: "297mm" }}
                >
                  <TemplatePreview data={getPreviewData()} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Save Modal */}
        <ConfirmSaveResult
          isOpen={showConfirmSaveResult}
          onClose={() => setShowConfirmSaveResult(false)}
          onConfirm={handleConfirmSave}
          resultId={localExamResult?.id}
          data={localExamResult}
          isLoading={isSavingResult}
          initialName={localExamResult?.name || ""}
          initialDescription={localExamResult?.description || ""}
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
