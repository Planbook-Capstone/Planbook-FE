"use client";

import { useState, useEffect, useRef } from "react";
import FolderCard from "@/components/molecules/folder-card";
import { useAuth } from "@/hooks/useAuth";
import {
  useToolResultByIdService,
  useToolResultsWithParamsService,
} from "@/services/toolResultService";
import FileIcon from "@/components/ui/FileIcon";
import TemplatePreview from "@/components/organisms/template-preview";
import { Button } from "@/components/ui/Button";
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
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuestionBanksWithParamsService } from "@/services/questionBankServices";
import QuestionRenderer from "@/components/molecules/question-render/QuestionRenderer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Folder {
  name: string;
  colorId: string;
  folderId: number;
  type: string;
}

interface DocumentSourceSelectorProps {
  folders: Folder[];
  selectedFolder: number;
  onFolderSelect: (folderId: number) => void;
  onFileSelect?: (fileData: any) => void;
  selectedFiles?: any[]; // Danh sách file đã chọn
  onSystemQuestionSelect?: (questions: any[]) => void; // Callback để chọn câu hỏi từ system
  selectedSystemQuestions?: any[]; // Danh sách câu hỏi system đã chọn
  title?: string;
  subtitle?: string;
  className?: string;
}

function DocumentSourceSelector({
  folders,
  selectedFolder,
  onFolderSelect,
  onFileSelect,
  selectedFiles = [],
  onSystemQuestionSelect,
  selectedSystemQuestions = [],
  title = "Chọn nguồn tài liệu",
  subtitle = "Chọn một thư mục chứa câu hỏi để tạo đề thi",
  className = "",
}: DocumentSourceSelectorProps) {
  // State để lưu file được chọn
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // State để hiển thị thông báo
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // State cho SYSTEM filter
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [selectedExamType, setSelectedExamType] = useState<string>("1"); // Mặc định dạng 1
  const [selectedDifficultLevel, setSelectedDifficultLevel] = useState<
    string[]
  >(["all"]); // Mặc định all

  // State không cần thiết nữa vì chúng ta lưu trực tiếp

  // Ref cho scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getSelectedFolderData = () => {
    return folders?.find((f) => f.folderId === selectedFolder);
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
    console.log("Selected file ID:", fileId);
  };

  const getSelectedFileData = () => {
    if (!selectedFileId || !toolResults?.data?.content) return null;
    return toolResults.data.content.find(
      (file: any) => file.id === selectedFileId
    );
  };

  // Kiểm tra xem file đã được chọn chưa
  const isFileAlreadySelected = (fileId: string) => {
    return selectedFiles.some((file: any) => file.id === fileId);
  };

  // Handlers cho SYSTEM filter
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedLessons([]);
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedBook("");
    setSelectedLessons([]);
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedLessons([]);
  };

  const handleLessonToggle = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleDifficultLevelToggle = (level: string) => {
    setSelectedDifficultLevel((prev) => {
      if (level === "all") {
        // Nếu chọn "Tất cả", bỏ chọn tất cả các mức độ khác
        return ["all"];
      }

      // Nếu đang chọn "Tất cả" và chọn mức độ cụ thể, bỏ chọn "Tất cả"
      let newLevels = prev.includes("all") ? [] : [...prev];

      if (newLevels.includes(level)) {
        // Bỏ chọn mức độ này
        newLevels = newLevels.filter((l) => l !== level);
        // Nếu không còn mức độ nào được chọn, chọn lại "Tất cả"
        return newLevels.length === 0 ? ["all"] : newLevels;
      } else {
        // Thêm mức độ này vào danh sách
        return [...newLevels, level];
      }
    });
  };

  const handleSelectLessons = () => {
    if (selectedLessons.length > 0 && onFileSelect) {
      const lessonsData = {
        type: "LESSONS",
        grade: selectedGrade,
        subject: selectedSubject,
        book: selectedBook,
        lessons: selectedLessons,
        examType: selectedExamType,
        difficultLevel: selectedDifficultLevel,
        lessonDetails: lessons.filter((lesson: any) =>
          selectedLessons.includes(lesson.id.toString())
        ),
      };
      onFileSelect(lessonsData);

      // Hiển thị thông báo thành công
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  // Xử lý chọn/bỏ chọn câu hỏi - tự động lưu/xóa
  const handleQuestionToggle = (questionId: string) => {
    if (!questions?.data || !onSystemQuestionSelect) return;

    const question = questions.data.find((q: any) => q.id.toString() === questionId);
    if (!question) return;

    const existingIds = new Set(selectedSystemQuestions.map((q: any) => q.id.toString()));

    if (existingIds.has(questionId)) {
      // Nếu câu hỏi đã được chọn trước đó, xóa khỏi danh sách
      const updatedQuestions = selectedSystemQuestions.filter((q: any) => q.id.toString() !== questionId);
      onSystemQuestionSelect(updatedQuestions);

      // Hiển thị thông báo xóa
      setMessageType('remove');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } else {
      // Nếu câu hỏi chưa được chọn, thêm vào danh sách
      const updatedQuestions = [...selectedSystemQuestions, question];
      onSystemQuestionSelect(updatedQuestions);

      // Hiển thị thông báo thêm
      setMessageType('add');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  };

  // Xử lý chọn tất cả câu hỏi - tự động lưu
  const handleSelectAllQuestions = () => {
    if (!questions?.data || !onSystemQuestionSelect) return;

    // Lọc ra những câu hỏi chưa có trong danh sách đã chọn trước đó
    const existingIds = new Set(selectedSystemQuestions.map((q: any) => q.id.toString()));
    const newQuestions = questions.data.filter((q: any) => !existingIds.has(q.id.toString()));

    if (newQuestions.length > 0) {
      // Nối đuôi với danh sách câu hỏi đã có
      const updatedQuestions = [...selectedSystemQuestions, ...newQuestions];
      onSystemQuestionSelect(updatedQuestions);

      // Hiển thị thông báo thành công
      setMessageType('add');
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  };

  // Xử lý bỏ chọn tất cả câu hỏi hiện tại trên trang
  const handleDeselectAllQuestions = () => {
    if (!questions?.data || !onSystemQuestionSelect) return;

    const currentPageQuestionIds = new Set(questions.data.map((q: any) => q.id.toString()));
    const updatedQuestions = selectedSystemQuestions.filter((q: any) =>
      !currentPageQuestionIds.has(q.id.toString())
    );

    onSystemQuestionSelect(updatedQuestions);

    // Hiển thị thông báo
    setMessageType('remove');
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  // State để lưu loại thông báo
  const [messageType, setMessageType] = useState<'add' | 'remove'>('add');

  // Xử lý khi click button "Chọn" hoặc "Hủy chọn"
  const handleSelectFile = () => {
    if (selectedFileId && onFileSelect) {
      const isAlreadySelected = isFileAlreadySelected(selectedFileId);

      if (isAlreadySelected) {
        // Nếu file đã được chọn, xóa khỏi danh sách
        onFileSelect({ action: 'remove', fileId: selectedFileId });
        setMessageType('remove');
      } else {
        // Nếu file chưa được chọn, thêm vào danh sách
        if (fileData?.data?.data) {
          const selectedFileInfo = getSelectedFileData();
          const fileDataToSend = {
            ...selectedFileInfo,
            content: fileData.data.data,
            action: 'add'
          };
          onFileSelect(fileDataToSend);
          setMessageType('add');
        }
      }

      // Hiển thị thông báo thành công
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const { user } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(13);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedFileId(null); // Reset selected file when changing page
  };

  const {
    data: toolResults,
    refetch,
    isLoading,
  } = useToolResultsWithParamsService(
    [currentPage, pageSize], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      userId: user?.id,
      page: currentPage + 1,
      size: 10,
      sort: "createdAt,desc",
      type: "EXAM",
      status: "ARCHIVED",
    }
  );

  const { data: fileData } = useToolResultByIdService(selectedFileId || "");

  // API calls cho SYSTEM filter
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject,
  });
  const { data: chaptersResponse } = useChaptersByBookService(selectedBook, {
    enabled: !!selectedBook,
  });

  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons by all chapter IDs
  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // Flatten all lessons from all chapters
  const lessons = lessonQueries
    .filter((query) => query.data?.data?.content)
    .flatMap((query) => query.data.data.content)
    .filter((lesson: any) => lesson && lesson.id && lesson.name);

  // Auto-select first file when data is loaded
  useEffect(() => {
    if (
      !selectedFileId &&
      toolResults?.data?.content &&
      toolResults.data.content.length > 0 &&
      getSelectedFolderData()?.type === "EXAM"
    ) {
      setSelectedFileId(toolResults.data.content[0].id);
    }
  }, [toolResults?.data?.content, selectedFileId, selectedFolder]);

  // Map UI values to API values
  const mapExamTypeToAPI = (examType: string) => {
    const mapping: { [key: string]: string } = {
      '1': 'PART_I',
      '2': 'PART_II',
      '3': 'PART_III'
    };
    return mapping[examType];
  };

  const mapDifficultLevelToAPI = (levels: string[]) => {
    if (levels.includes('all')) return undefined;

    const mapping: { [key: string]: string } = {
      'nhan_biet': 'KNOWLEDGE',
      'thong_hieu': 'COMPREHENSION',
      'van_dung': 'APPLICATION'
    };

    return levels.map(level => mapping[level]).filter(Boolean).join(',');
  };

  const { data: questions } = useQuestionBanksWithParamsService(
    [
      selectedGrade,
      selectedSubject,
      selectedBook,
      selectedLessons,
      selectedExamType,
      selectedDifficultLevel,
    ], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      lessonIds:
        selectedLessons.length > 0 ? selectedLessons.join(",") : undefined,
      questionTypes: mapExamTypeToAPI(selectedExamType),
      difficultyLevels: mapDifficultLevelToAPI(selectedDifficultLevel),
    }
  );

  // Scroll về top khi questions data thay đổi
  useEffect(() => {
    if (scrollContainerRef.current && questions?.data) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [questions?.data, selectedGrade, selectedSubject, selectedBook, selectedLessons, selectedExamType, selectedDifficultLevel]);

  return (
    <div className={`space-y-6 ${className} `}>
      <div className="mb-8">
        <h2 className="text-lg font-calsans">{title}</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          {subtitle}
        </h3>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 ">
        {/* Left column - Folders */}
        <div className="w-full col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {folders?.map((f) => (
              <div key={f.folderId} onClick={() => onFolderSelect(f.folderId)}>
                <FolderCard
                  id={f.folderId.toString()}
                  colorId={f.colorId}
                  title={f.name}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
            {getSelectedFolderData()?.type === "EXAM" &&
              toolResults?.data?.content?.map((toolResult: any) => (
                <div
                  key={toolResult.id}
                  onClick={() => handleFileSelect(toolResult.id)}
                  className={`flex items-start justify-between border rounded-md px-4 py-4 relative cursor-pointer hover:shadow-md transition-all ${
                    selectedFileId === toolResult.id
                      ? "bg-blue-100 border-blue-300 shadow-md"
                      : isFileAlreadySelected(toolResult.id)
                      ? "bg-green-100 border-green-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <FileIcon type={"DOCX"} size={"lg"} />
                    <div className="text-sm flex flex-col gap-2">
                      <p className="font-calsans text-base line-clamp-1">
                        {toolResult.name}
                      </p>
                      <p className=" line-clamp-1 text-sm font-questrial">
                        {toolResult.description}
                      </p>
                      <p className="text-xs font-questrial">
                        {toolResult.updatedAt}
                      </p>
                    </div>
                  </div>
                  {selectedFileId === toolResult.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Pagination for EXAM files */}
          {getSelectedFolderData()?.type === "EXAM" &&
           toolResults?.data?.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous Button */}
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 0) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 0 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* Page Numbers */}
                  {(() => {
                    const totalPages = toolResults.data.totalPages;
                    const pages = [];

                    // Show first page
                    if (totalPages > 0) {
                      pages.push(
                        <PaginationItem key={0}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === 0}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage !== 0) {
                                handlePageChange(0);
                              }
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Show ellipsis if needed
                    if (currentPage > 2) {
                      pages.push(
                        <PaginationItem key="ellipsis-start">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // Show pages around current page
                    const start = Math.max(1, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      if (i !== 0 && i !== totalPages - 1) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              href="#"
                              isActive={currentPage === i}
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage !== i) {
                                  handlePageChange(i);
                                }
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    }

                    // Show ellipsis if needed
                    if (currentPage < totalPages - 3) {
                      pages.push(
                        <PaginationItem key="ellipsis-end">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    // Show last page (if different from first)
                    if (totalPages > 1) {
                      pages.push(
                        <PaginationItem key={totalPages - 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === totalPages - 1}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage !== totalPages - 1) {
                                handlePageChange(totalPages - 1);
                              }
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    return pages;
                  })()}

                  {/* Next Button */}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < toolResults.data.totalPages - 1) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage >= toolResults.data.totalPages - 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {getSelectedFolderData()?.type === "SYSTEM" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-700">
                Chọn bài học từ ngân hàng câu hỏi
              </h4>

              {/* Grade Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Khối học
                </label>
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
                <label className="text-sm font-medium text-gray-700">
                  Môn học
                </label>
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
                <label className="text-sm font-medium text-gray-700">
                  Sách
                </label>
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
                      <SelectItem
                        key={book.id.toString()}
                        value={book.id.toString()}
                      >
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Dạng đề
                </label>
                <Select
                  value={selectedExamType}
                  onValueChange={setSelectedExamType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn dạng đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dạng 1</SelectItem>
                    <SelectItem value="2">Dạng 2</SelectItem>
                    <SelectItem value="3">Dạng 3</SelectItem>
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
                      onCheckedChange={() =>
                        handleDifficultLevelToggle("nhan_biet")
                      }
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
                      onCheckedChange={() =>
                        handleDifficultLevelToggle("thong_hieu")
                      }
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
                      onCheckedChange={() =>
                        handleDifficultLevelToggle("van_dung")
                      }
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
              {selectedBook && lessons.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bài học ({selectedLessons.length} đã chọn)
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2 bg-white">
                    {lessons?.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`lesson-${lesson.id}`}
                          checked={selectedLessons.includes(
                            lesson.id.toString()
                          )}
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

                  {selectedLessons.length > 0 && (
                    <div className="flex justify-between items-center pt-2">
                      {showSuccessMessage && (
                        <div className="text-green-600 text-sm font-medium">
                          ✓ Đã chọn {selectedLessons.length} bài học!
                        </div>
                      )}
                      <Button onClick={handleSelectLessons} className="ml-auto">
                        Chọn {selectedLessons.length} bài học
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column - Preview */}
        <div
          ref={scrollContainerRef}
          className="w-full border rounded-md p-2 col-span-3 h-[850px] overflow-y-auto"
        >
          <div className="flex justify-between items-center">
            {getSelectedFolderData()?.type === "SYSTEM" && (
              <div className="p-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-calsans text-gray-700">
                    Ngân hàng câu hỏi ({selectedSystemQuestions.length} đã chọn)
                  </h3>
                  <div className="flex gap-2">
                    {questions?.data?.length > 0 && (
                      <>
                        {/* Kiểm tra xem có câu hỏi nào trên trang hiện tại đã được chọn không */}
                        {questions.data.some((q: any) =>
                          selectedSystemQuestions.some((sq: any) => sq.id.toString() === q.id.toString())
                        ) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeselectAllQuestions}
                          >
                            Bỏ chọn trang này
                          </Button>
                        )}
                        {/* Kiểm tra xem có câu hỏi nào trên trang hiện tại chưa được chọn không */}
                        {questions.data.some((q: any) =>
                          !selectedSystemQuestions.some((sq: any) => sq.id.toString() === q.id.toString())
                        ) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAllQuestions}
                          >
                            Chọn trang này
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {showSuccessMessage && (
                  <div className={`mb-4 p-2 border rounded text-sm ${
                    messageType === 'remove'
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'bg-green-100 border-green-300 text-green-700'
                  }`}>
                    {messageType === 'remove'
                      ? '✓ Đã bỏ chọn câu hỏi!'
                      : '✓ Đã chọn câu hỏi!'
                    } Tổng: {selectedSystemQuestions.length} câu hỏi
                  </div>
                )}
                <div className="space-y-5">
                  {questions?.data?.map((question: any, idx: number) => {
                    const isSelected = selectedSystemQuestions.some((q: any) => q.id.toString() === question.id.toString());

                    return (
                      <div key={question.id} className="relative">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`question-${question.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleQuestionToggle(question.id.toString())}
                            className="mt-2"
                          />
                          <div className="flex-1">
                            <div>
                              <QuestionRenderer
                                question={question}
                                questionNumber={idx + 1}
                              />
                              {isSelected && (
                                <div className="mt-2 text-xs text-green-600 font-medium">
                                  ✓ Đã được chọn
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="h-full">
            {selectedFileId && getSelectedFolderData()?.type === "EXAM" && (
              <div>
                <div className="sticky top-0 flex justify-between items-center">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Xem trước nội dung
                  </h3>
                  {selectedFileId &&
                    getSelectedFolderData()?.type === "EXAM" && (
                      <div className="flex items-center gap-2">
                        {showSuccessMessage && (
                          <div className={`text-sm font-medium ${
                            messageType === 'remove'
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}>
                            {messageType === 'remove'
                              ? '✓ Đã hủy chọn thành công!'
                              : '✓ Đã chọn thành công!'
                            }
                          </div>
                        )}
                        <Button
                          onClick={handleSelectFile}
                          disabled={!selectedFileId || !fileData?.data?.data}
                          variant={
                            isFileAlreadySelected(selectedFileId || "")
                              ? "outline"
                              : "default"
                          }
                        >
                          {isFileAlreadySelected(selectedFileId || "")
                            ? "Hủy chọn"
                            : "Chọn"}
                        </Button>
                      </div>
                    )}
                </div>
                <TemplatePreview data={fileData?.data?.data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentSourceSelector;
