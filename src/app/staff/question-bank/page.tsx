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
import { Edit, Plus, XIcon, Copy, Filter } from "lucide-react";
import Link from "next/link";
import { DynamicQuestionForm } from "@/components/forms/dynamic-question/DynamicQuestionForm";
import {
  useQuestionBanksWithParamsService,
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
import { Checkbox } from "@/components/ui/checkbox";
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
  const [selectedExamType, setSelectedExamType] = useState<string>("");
  const [selectedDifficultLevel, setSelectedDifficultLevel] = useState<
    string[]
  >(["all"]);
  const [selectedLessonsList, setSelectedLessonsList] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const mapDifficultLevelToAPI = (levels: string[]) => {
    if (levels.includes("all")) return undefined;

    const mapping: { [key: string]: string } = {
      nhan_biet: "KNOWLEDGE",
      thong_hieu: "COMPREHENSION",
      van_dung: "APPLICATION",
    };

    return levels
      .map((level) => mapping[level])
      .filter(Boolean)
      .join(",");
  };

  // API hooks with filter parameters
  const { data: questionsData } = useQuestionBanksWithParamsService(
    [
      selectedGrade,
      selectedSubject,
      selectedBook,
      selectedLessonsList,
      selectedExamType,
      selectedDifficultLevel,
    ], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      lessonIds:
        selectedLessonsList.length > 0
          ? selectedLessonsList.join(",")
          : undefined,
      questionTypes: selectedExamType,
      difficultyLevels: mapDifficultLevelToAPI(selectedDifficultLevel),
    }
  );

  // Use filtered data
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

  // Group questions by type - API already handles filtering
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

  // Handler functions for new filter UI
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedLessonsList([]);
  };

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedBook("");
    setSelectedLessonsList([]);
  };

  const handleBookChange = (value: string) => {
    setSelectedBook(value);
    setSelectedLessonsList([]);
  };

  const handleDifficultLevelToggle = (level: string) => {
    if (level === "all") {
      if (selectedDifficultLevel.includes("all")) {
        setSelectedDifficultLevel([]);
      } else {
        setSelectedDifficultLevel(["all"]);
      }
    } else {
      const newLevels = selectedDifficultLevel.filter((l) => l !== "all");
      if (newLevels.includes(level)) {
        setSelectedDifficultLevel(newLevels.filter((l) => l !== level));
      } else {
        setSelectedDifficultLevel([...newLevels, level]);
      }
    }
  };

  const handleLessonToggle = (lessonId: string) => {
    if (selectedLessonsList.includes(lessonId)) {
      setSelectedLessonsList(
        selectedLessonsList.filter((id) => id !== lessonId)
      );
    } else {
      setSelectedLessonsList([...selectedLessonsList, lessonId]);
    }
  };

  const handleSelectLessons = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  return (
    <div className="px-5">
      <div className="pb-2 flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="w-4 h-4" />
            {showFilter ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
        </div>
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
      {showFilter && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6 grid grid-cols-6 gap-5">
        {/* Grade Selection */}
        <div className="space-y-2 ">
          <label className="text-sm font-medium text-gray-700">Khối học</label>
          <Select value={selectedGrade} onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn khối học" />
            </SelectTrigger>
            <SelectContent>
              {grades?.data?.content?.map((grade: any) => (
                <SelectItem
                  key={grade.id.toString()}
                  value={grade.id.toString()}
                >
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Môn học</label>
          <Select
            value={selectedSubject}
            onValueChange={handleSubjectChange}
            disabled={!selectedGrade}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  selectedGrade ? "Chọn môn học" : "Chọn khối học trước"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {subjects?.data?.content?.map((subject: any) => (
                <SelectItem
                  key={subject.id.toString()}
                  value={subject.id.toString()}
                >
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Book Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sách</label>
          <Select
            value={selectedBook}
            onValueChange={handleBookChange}
            disabled={!selectedSubject}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  selectedSubject ? "Chọn sách" : "Chọn môn học trước"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {books?.data?.content?.map((book: any) => (
                <SelectItem key={book.id.toString()} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficult Level Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Mức độ khó (
            {selectedDifficultLevel.includes("all")
              ? "Tất cả"
              : selectedDifficultLevel.length + " đã chọn"}
            )
          </label>
          <div className="space-y-2 border rounded p-3 bg-white">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="level-all"
                checked={selectedDifficultLevel.includes("all")}
                onCheckedChange={() => handleDifficultLevelToggle("all")}
              />
              <label
                htmlFor="level-all"
                className="text-sm cursor-pointer flex-1 font-medium"
              >
                Tất cả
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="level-nhan-biet"
                checked={selectedDifficultLevel.includes("nhan_biet")}
                onCheckedChange={() => handleDifficultLevelToggle("nhan_biet")}
              />
              <label
                htmlFor="level-nhan-biet"
                className="text-sm cursor-pointer flex-1"
              >
                Nhận biết
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="level-thong-hieu"
                checked={selectedDifficultLevel.includes("thong_hieu")}
                onCheckedChange={() => handleDifficultLevelToggle("thong_hieu")}
              />
              <label
                htmlFor="level-thong-hieu"
                className="text-sm cursor-pointer flex-1"
              >
                Thông hiểu
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="level-van-dung"
                checked={selectedDifficultLevel.includes("van_dung")}
                onCheckedChange={() => handleDifficultLevelToggle("van_dung")}
              />
              <label
                htmlFor="level-van-dung"
                className="text-sm cursor-pointer flex-1"
              >
                Vận dụng
              </label>
            </div>
          </div>
        </div>

        {/* Lesson Selection */}
        {selectedBook && filterLessons.length > 0 && (
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Bài học ({selectedLessonsList.length} đã chọn)
            </label>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2 bg-white">
              {filterLessons?.map((lesson: any) => (
                <div key={lesson.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lesson-${lesson.id}`}
                    checked={selectedLessonsList.includes(lesson.id.toString())}
                    onCheckedChange={() =>
                      handleLessonToggle(lesson.id.toString())
                    }
                  />
                  <label
                    htmlFor={`lesson-${lesson.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {lesson.name}
                  </label>
                </div>
              ))}
            </div>

            {selectedLessonsList.length > 0 && (
              <div className="flex justify-between items-center pt-2">
                {showSuccessMessage && (
                  <div className="text-green-600 text-sm font-medium">
                    ✓ Đã chọn {selectedLessonsList.length} bài học!
                  </div>
                )}
                <Button onClick={handleSelectLessons} className="ml-auto">
                  Chọn {selectedLessonsList.length} bài học
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      )}

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
                <div
                  className="text-lg"
                  dangerouslySetInnerHTML={{
                    __html: question.questionContent.question || "",
                  }}
                />
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
                      <div key={key} className="flex items-start">
                        <span className="font-medium mr-2">{key}.</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: String(value) || "",
                          }}
                        />
                      </div>
                    )
                  )}
                {question?.questionContent?.answer && (
                  <p className="text-green-700 font-[600]">
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
                        <div key={key} className="flex items-start">
                          <span className="font-medium mr-2">{key}.</span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: statement.text || "",
                            }}
                          />
                          <span className="text-green-700 font-bold ml-2">
                            {statement.answer ? "Đúng" : "Sai"}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
              {question?.explanation && (
                <div className="text-lg">
                  <span className="font-bold text-purple-700">Giải thích: </span>
                  <br/>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: question?.explanation || "-",
                    }}
                  />
                </div>
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
    </div>
  );
}

export default QuestionBankManagementPage;
