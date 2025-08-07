"use client";

import { useState, useEffect } from "react";
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

  const handleSelectLessons = () => {
    if (selectedLessons.length > 0 && onFileSelect) {
      const lessonsData = {
        type: "LESSONS",
        grade: selectedGrade,
        subject: selectedSubject,
        book: selectedBook,
        lessons: selectedLessons,
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

  // Xử lý khi click button "Chọn"
  const handleSelectFile = () => {
    if (selectedFileId && fileData?.data?.data && onFileSelect) {
      const selectedFileInfo = getSelectedFileData();
      const fileDataToSend = {
        ...selectedFileInfo,
        content: fileData.data.data,
      };
      onFileSelect(fileDataToSend);

      // Hiển thị thông báo thành công
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Ẩn thông báo sau 3 giây
    }
  };

  const { user } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(13);

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
      size: pageSize,
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

  const { data: questions } = useQuestionBanksWithParamsService(
    [selectedGrade, selectedSubject, selectedBook, selectedLessons], // dependencies for query key
    { retry: 1, staleTime: 0 }, // options
    {
      lessonId: selectedLessons,
    }
  );

  console.log(questions, "tran");

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-lg font-calsans">{title}</h2>
        <h3 className="text-base font-questrial text-neutral-500">
          {subtitle}
        </h3>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left column - Folders */}
        <div className="w-full col-span-2">
          <div className="grid grid-cols-4 gap-4">
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
          <div className="grid grid-cols-2 gap-4 py-3">
            {getSelectedFolderData()?.type === "EXAM" &&
              toolResults?.data?.content?.map((toolResult: any) => (
                <div
                  key={toolResult.id}
                  onClick={() => handleFileSelect(toolResult.id)}
                  className={`flex items-start justify-between border rounded-md px-4 py-4 relative cursor-pointer hover:shadow-md transition-all ${
                    selectedFileId === toolResult.id
                      ? "bg-blue-50 border-blue-300 shadow-md"
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

              {/* Lesson Selection */}
              {selectedBook && lessons.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bài học ({selectedLessons.length} đã chọn)
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-2 bg-white">
                    {lessons.map((lesson: any) => (
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
        <div className="w-full border rounded-md p-2 col-span-3 h-[700px] overflow-y-auto">
          <div className="flex justify-between items-center">
            {getSelectedFolderData()?.type === "SYSTEM" && (
              <div className="p-4">
                <h3 className="text-base font-calsans  text-gray-700 ">
                  Ngân hàng câu hỏi
                </h3>
                <div className="space-y-5">
                  {questions?.data?.map((question: any, idx: number) => (
                    <div key={question.id}>
                      <QuestionRenderer
                        question={question}
                        questionNumber={idx + 1}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="h-full">
            {selectedFileId && getSelectedFolderData()?.type === "EXAM" && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold mb-4 text-gray-700">
                    Xem trước nội dung
                  </h3>
                  {selectedFileId &&
                    getSelectedFolderData()?.type === "EXAM" && (
                      <div className="flex items-center gap-2">
                        {showSuccessMessage && (
                          <div className="text-green-600 text-sm font-medium">
                            ✓ Đã chọn thành công!
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
                            ? "Đã chọn"
                            : "Chọn"}
                        </Button>
                      </div>
                    )}
                </div>
                <TemplatePreview data={fileData?.data?.data} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentSourceSelector;
