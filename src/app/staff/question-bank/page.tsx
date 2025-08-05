"use client";

import React, { useState, useMemo } from "react";
import { message } from "antd";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Plus, XIcon } from "lucide-react";
import { DynamicQuestionForm } from "@/components/forms/dynamic-question/DynamicQuestionForm";
import {
  useQuestionBanksService,
  useCreateQuestionBankService,
  useUpdateQuestionBankService,
  useDeleteQuestionBankService,
  QuestionBankItem,
  QuestionContent,
} from "@/services/questionBankServices";
import { useCreateMaterialService } from "@/services/materialServices";
import { useLessonsByIdsService } from "@/services/lessonServices";
import { Badge } from "@/components/ui/badge";
import { getDifficultyText, getVariant } from "@/constants";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
// Types for form data - matching API format
interface QuestionFormData {
  lessonIds?: number[];
  questionType: "PART_I" | "PART_II" | "PART_III";
  difficultyLevel: "KNOWLEDGE" | "COMPREHENSION" | "APPLICATION" | "ANALYSIS";
  questionContent: QuestionContent;
  explanation?: string;
  referenceSource?: string;
}

function QuestionBankManagementPage() {
  const [selectedType, setSelectedType] = useState<
    "PART_I" | "PART_II" | "PART_III"
  >("PART_I");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<QuestionBankItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] =
    useState<QuestionBankItem | null>(null);

  // API hooks
  const { data: questionsData } = useQuestionBanksService();

  // Use mock data if real data is not available
  const finalQuestionsData = questionsData;
  const createMutation = useCreateQuestionBankService();
  const updateMutation = useUpdateQuestionBankService();
  const deleteMutation = useDeleteQuestionBankService();
  const createMaterialMutation = useCreateMaterialService();

  // Filter questions by type
  const questionsByType = useMemo(() => {
    if (!finalQuestionsData?.data)
      return { PART_I: [], PART_II: [], PART_III: [] };

    return finalQuestionsData.data.reduce(
      (acc: Record<string, QuestionBankItem[]>, question: QuestionBankItem) => {
        const type = question.questionType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(question);
        return acc;
      },
      { PART_I: [], PART_II: [], PART_III: [] } as Record<
        string,
        QuestionBankItem[]
      >
    );
  }, [finalQuestionsData]);

  // Get all unique lesson IDs from questions
  const allLessonIds = useMemo(() => {
    if (!finalQuestionsData?.data) return [];

    const lessonIds = new Set<number>();
    finalQuestionsData.data.forEach((question: QuestionBankItem) => {
      if (question.lessonIds) {
        question.lessonIds.forEach((id) => lessonIds.add(id));
      } else if (question.lessonId) {
        lessonIds.add(question.lessonId);
      }
    });

    return Array.from(lessonIds);
  }, [finalQuestionsData]);

  // Fetch lessons data for all lesson IDs
  const lessonQueries = useLessonsByIdsService(allLessonIds);

  // Get all lessons data
  const lessons = lessonQueries
    .filter((query: any) => query.data)
    .map((query: any) => query.data?.data)
    .filter(Boolean);

  // Helper function to get lesson names by IDs
  const getLessonNames = (question: QuestionBankItem) => {
    const questionLessonIds =
      question.lessonIds || (question.lessonId ? [question.lessonId] : []);

    if (questionLessonIds.length === 0) return "-";

    const lessonNames = questionLessonIds
      .map((id) => {
        const lesson = lessons.find((l: any) => l.id === id);
        return lesson?.name || `Lesson ${id}`;
      })
      .filter(Boolean);

    return lessonNames.length > 0 ? lessonNames.join(", ") : "-";
  };

  // Transform QuestionBankItem to DynamicQuestionForm format
  const transformQuestionForEdit = (question: QuestionBankItem) => {
    const baseData = {
      question: question.questionContent.question,
      questionType: question.questionType,
      lessonIds:
        question.lessonIds ||
        (question.lessonId ? [question.lessonId] : undefined),
      difficultyLevel: question.difficultyLevel,
      explanation: question.explanation || "",
      referenceSource: question.referenceSource,
      hasImage: !!question.questionContent.image,
      // Add image URL for preview if exists
      imageUrl: question.questionContent.image,
    };

    // Add type-specific fields
    if (
      question.questionType === "PART_I" &&
      question.questionContent.options
    ) {
      const options = question.questionContent.options;
      const answer = question.questionContent.answer;
      const correctAnswers = ["A", "B", "C", "D"].map(
        (letter) => letter === answer
      );

      return {
        ...baseData,
        optionA: options.A || "",
        optionB: options.B || "",
        optionC: options.C || "",
        optionD: options.D || "",
        correctAnswers,
      };
    } else if (
      question.questionType === "PART_II" &&
      question.questionContent.statements
    ) {
      const statements = question.questionContent.statements;
      return {
        ...baseData,
        statementA: statements.A?.text || "",
        answerA: statements.A?.answer || false,
        statementB: statements.B?.text || "",
        answerB: statements.B?.answer || false,
        statementC: statements.C?.text || "",
        answerC: statements.C?.answer || false,
        statementD: statements.D?.text || "",
        answerD: statements.D?.answer || false,
      };
    } else if (question.questionType === "PART_III") {
      return {
        ...baseData,
        essayAnswer: question.questionContent.answer || "",
      };
    }

    return baseData;
  };

  // Handle form submission
  const handleSubmit = async (
    values: QuestionFormData & { imageFile?: File }
  ) => {
    console.log(values, "values");
    try {
      // If there's an image file, upload it first
      if (values.imageFile) {
        const formData = new FormData();
        formData.append("file", values.imageFile);
        formData.append(
          "metadataJson",
          JSON.stringify({
            type: "question-image",
            name: values.imageFile.name,
            description: "Question illustration image",
            url: "null", // Will be set by backend after file upload
          })
        );

        const uploadResult = await createMaterialMutation.mutateAsync(formData);
        // Update the values with the uploaded image URL
        // Adjust the path based on actual response structure
        values.questionContent.image = uploadResult?.data?.data?.url;

        // Remove the file object from values before sending to question API
        delete values.imageFile;
      }

      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: editingQuestion.id.toString(),
          data: values,
        });
        message.success("Cập nhật câu hỏi thành công!");
      } else {
        await createMutation.mutateAsync(values);
        message.success("Thêm câu hỏi thành công!");
      }

      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (error) {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra!");
    }
  };

  // Handle delete - show confirmation dialog
  const handleDelete = (question: QuestionBankItem) => {
    setQuestionToDelete(question);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;

    try {
      await deleteMutation.mutateAsync(questionToDelete.id.toString());
      toast.success("Xóa câu hỏi thành công!");
      setIsDeleteDialogOpen(false);
      setQuestionToDelete(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa!");
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
  };

  // Open modal for adding new question
  const handleAddNew = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (question: QuestionBankItem) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  return (
    <div className="px-5">
      <div className="pb-2 flex justify-end">
        <div className="flex gap-2">
          <Button
            size={"sm"}
            className="rounded-full"
            variant={selectedType === "PART_I" ? "default" : "outline"}
            onClick={() => setSelectedType("PART_I")}
          >
            Dạng 1
          </Button>
          <Button
            variant={selectedType === "PART_II" ? "default" : "outline"}
            size={"sm"}
            className="rounded-full"
            onClick={() => setSelectedType("PART_II")}
          >
            Dạng 2
          </Button>
          <Button
            variant={selectedType === "PART_III" ? "default" : "outline"}
            size={"sm"}
            className="rounded-full"
            onClick={() => setSelectedType("PART_III")}
          >
            Dạng 3
          </Button>
          <Dialog
            open={isModalOpen && !editingQuestion}
            onOpenChange={(open) => {
              setIsModalOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-[linear-gradient(227deg,_#20DCDF_5.38%,_#25BEE5_16.58%,_#2C99EE_26.8%,_#368BEB_39.32%,_#3860D2_50.53%,_#3A39BB_60.74%,_#3714A2_73.92%)]"
                onClick={handleAddNew}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm câu hỏi mới
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-5xl !max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm câu hỏi mới</DialogTitle>
              </DialogHeader>
              <DynamicQuestionForm
                loading={createMutation.isPending}
                onSubmit={handleSubmit}
                isEditing={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-4">
        {questionsByType[selectedType].map((question: any, idx: number) => (
          <div key={question.id}>
            <div className="text-base">
              <div className="gap-2">
                <div className="flex gap-2 items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <p className="font-bold">Câu {idx + 1}:</p>
                    <p className="text-blue-500 font-semibold">
                      [{question.referenceSource || "-"}]
                    </p>
                    <p className="text-orange-500">
                      [{getLessonNames(question) || "-"}]
                    </p>
                    <Badge
                      variant={getVariant(question.difficultyLevel)}
                      className="text-xs"
                    >
                      {getDifficultyText(question.difficultyLevel)}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={"menuitem"}
                      onClick={() => handleEdit(question)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      onClick={() => handleDelete(question)}
                      size={"icon"}
                      variant={"outline"}
                    >
                      <XIcon />
                    </Button>
                  </div>
                </div>
                <p className="font-[600] text-lg">
                  {question.questionContent.question}
                </p>
                {question.questionContent.image && (
                  <div className="w-52 h-52">
                    <img
                      src={question.questionContent.image}
                      alt="Question"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="pl-12 grid grid-cols-1 space-y-2 mt-2 text-lg">
                {question.questionContent.options &&
                  Object.entries(question.questionContent.options)?.map(
                    ([key, value]) => (
                      <p key={key}>
                        {key}. {String(value)}
                      </p>
                    )
                  )}
                {question?.questionContent?.answer && (
                  <p className="text-green-700">
                    Đáp án: {question.questionContent.answer}
                  </p>
                )}
                {question?.questionContent?.statements &&
                  Object.entries(question.questionContent.statements).map(
                    ([key, value]) => {
                      const statement = value as {
                        text: string;
                        answer: boolean;
                      };
                      return (
                        <p key={key}>
                          {key}. {statement.text}{" "}
                          <span className="text-green-700 font-bold">
                            {statement.answer ? "Đúng" : "Sai"}
                          </span>
                        </p>
                      );
                    }
                  )}
              </div>
              <p className="text-purple-700 text-lg">
                <span className="font-bold">Giải thích: </span>
                {question?.explanation || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isModalOpen && !!editingQuestion}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }
        }}
      >
        <DialogContent className="!max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
          </DialogHeader>
          <DynamicQuestionForm
            loading={updateMutation.isPending}
            onSubmit={handleSubmit}
            initialData={
              editingQuestion
                ? transformQuestionForEdit(editingQuestion)
                : undefined
            }
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa câu hỏi"
        itemName={
          questionToDelete?.questionContent.question.substring(0, 50) + "..."
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default QuestionBankManagementPage;
