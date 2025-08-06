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
import { Edit, Plus, XIcon, Copy } from "lucide-react";
import Link from "next/link";
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

import { Badge } from "@/components/ui/badge";
import { getDifficultyText, getVariant } from "@/constants";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/organisms/delete-confirm-dialog";
import Image from "next/image";
import ChemicalFormula from "@/components/ChemicalFormula";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import {
  useLessonsByChaptersService,
  useLessonsByIdsService,
} from "@/services/lessonServices";
import { Search, X, BookOpen } from "lucide-react";
import { LessonSelectorModal } from "@/components/modals/LessonSelectorModal";
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

  // Filter states
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedLessonIds, setSelectedLessonIds] = useState<number[]>([]);
  const [referenceFilter, setReferenceFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // API hooks
  const { data: questionsData } = useQuestionBanksService();

  // Use mock data if real data is not available
  const finalQuestionsData = questionsData;
  const createMutation = useCreateQuestionBankService();
  const updateMutation = useUpdateQuestionBankService();
  const deleteMutation = useDeleteQuestionBankService();
  const createMaterialMutation = useCreateMaterialService();

  // Filter API hooks
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade && selectedGrade !== "all",
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject && selectedSubject !== "all",
  });
  const { data: chaptersResponse } = useChaptersByBookService(selectedBook, {
    enabled: !!selectedBook && selectedBook !== "all",
  });
  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons by all chapter IDs for filter
  const filterLessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // Flatten all lessons from all chapters for filter
  const filterLessons = filterLessonQueries
    .filter((query) => query.data?.data?.content)
    .flatMap((query) => query.data.data.content)
    .filter((lesson: any) => lesson && lesson.id && lesson.name);

  // Get selected lessons data for display
  const selectedLessonsQueries = useLessonsByIdsService(selectedLessonIds);
  const selectedLessons = selectedLessonsQueries
    .filter((query) => query.data?.data)
    .map((query) => query.data.data)
    .filter((lesson) => lesson && lesson.name);

  // Filter questions by type and filters
  const questionsByType = useMemo(() => {
    if (!finalQuestionsData?.data)
      return { PART_I: [], PART_II: [], PART_III: [] };

    let filteredQuestions = finalQuestionsData.data;

    // Apply filters
    if (selectedLessonIds.length > 0) {
      filteredQuestions = filteredQuestions.filter(
        (question: QuestionBankItem) =>
          selectedLessonIds.some(
            (lessonId) =>
              question.lessonIds?.includes(lessonId) ||
              question.lessonId === lessonId
          )
      );
    }

    if (referenceFilter) {
      filteredQuestions = filteredQuestions.filter(
        (question: QuestionBankItem) =>
          question.referenceSource
            ?.toLowerCase()
            .includes(referenceFilter.toLowerCase())
      );
    }

    if (difficultyFilter && difficultyFilter !== "all") {
      filteredQuestions = filteredQuestions.filter(
        (question: QuestionBankItem) =>
          question.difficultyLevel === difficultyFilter
      );
    }

    return filteredQuestions.reduce(
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
  }, [
    finalQuestionsData,
    selectedLessonIds,
    referenceFilter,
    difficultyFilter,
  ]);

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
          <Link href="/staff/question-bank/create">
            <Button variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Tạo nhiều câu hỏi
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 flex">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Grade Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Khối lớp</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khối lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {grades?.data?.content?.map((grade: any) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Môn học</Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={!selectedGrade}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {subjects?.data?.content?.map((subject: any) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Book Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sách giáo khoa</Label>
            <Select
              value={selectedBook}
              onValueChange={setSelectedBook}
              disabled={!selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn sách" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {books?.data?.content?.map((book: any) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lesson Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bài học</Label>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLessonModalOpen(true)}
                className="w-full justify-start text-left"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {selectedLessons.length > 0
                  ? `${selectedLessons.length} bài học đã chọn`
                  : "Chọn bài học"}
              </Button>

              {/* Display selected lessons */}
              {selectedLessons.length > 0 && (
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {selectedLessons.map((lesson, lessonIndex) => (
                    <span
                      key={lessonIndex}
                      className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                    >
                      {lesson.name}
                      <button
                        type="button"
                        onClick={() => {
                          const newLessonIds = selectedLessonIds.filter(
                            (id) => id !== Number(lesson.id)
                          );
                          setSelectedLessonIds(newLessonIds);
                        }}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reference Source Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nguồn tham khảo</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo nguồn..."
                value={referenceFilter}
                onChange={(e: any) => setReferenceFilter(e.target.value)}
                className="pl-10"
              />
              {referenceFilter && (
                <button
                  onClick={() => setReferenceFilter("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Độ khó</Label>
            <Select
              value={difficultyFilter}
              onValueChange={setDifficultyFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="KNOWLEDGE">Nhận biết</SelectItem>
                <SelectItem value="COMPREHENSION">Thông hiểu</SelectItem>
                <SelectItem value="APPLICATION">Vận dụng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedGrade("");
              setSelectedSubject("");
              setSelectedBook("");
              setSelectedLessonIds([]);
              setReferenceFilter("");
              setDifficultyFilter("");
            }}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      {/* Questions List */}
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
                <p className="text-lg">
                  <ChemicalFormula
                    formula={question.questionContent.question}
                  />
                </p>
                {question.questionContent.image && (
                  <div className="max-w-full max-h-[250px] overflow-auto">
                    <Image
                      src={question.questionContent.image}
                      alt="Question"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-auto w-auto max-w-full max-h-[250px] rounded-md object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="pl-12 grid grid-cols-1 space-y-2 mt-2 text-lg">
                {question.questionContent.options &&
                  Object.entries(question.questionContent.options)?.map(
                    ([key, value]) => (
                      <p key={key}>
                        {key}. <ChemicalFormula formula={String(value)} />
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
              {question?.explanation && (
                <p className="text-purple-700 text-lg">
                  <span className="font-bold">Giải thích: </span>
                  <ChemicalFormula formula={question?.explanation || "-"} />
                </p>
              )}
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

      {/* Lesson Selector Modal */}
      <LessonSelectorModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onConfirm={(selectedLessonIds) => {
          setSelectedLessonIds(selectedLessonIds);
        }}
        selectedLessonIds={selectedLessonIds}
        title="Chọn bài học để lọc"
      />
    </div>
  );
}

export default QuestionBankManagementPage;
