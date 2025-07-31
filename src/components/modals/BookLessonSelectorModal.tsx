"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import BookSelector from "@/components/molecules/book-selector";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";

interface BookLessonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookId: string, lessonId: string) => void;
  title?: string;
}

export const BookLessonSelectorModal: React.FC<
  BookLessonSelectorModalProps
> = ({ isOpen, onClose, onConfirm, title = "Chọn sách và bài học" }) => {
  // State cho chọn sách
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("");

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject,
  });

  // Get chapters by selected book
  const { data: chaptersResponse } = useChaptersByBookService(selectedBook, {
    enabled: !!selectedBook,
  });
  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons by all chapter IDs
  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // Flatten all lessons from all chapters
  const allLessons = lessonQueries
    .filter((query) => query.data?.data?.content)
    .flatMap((query) => query.data.data.content)
    .filter((lesson: any) => lesson && lesson.id && lesson.name);

  const handleConfirm = () => {
    if (selectedBook && selectedLesson) {
      onConfirm(selectedBook, selectedLesson);
      handleClose();
    }
  };

  const handleClose = () => {
    // Reset selections when closing
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedLesson("");
    onClose();
  };

  const isValid = selectedBook && selectedLesson;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-calsans">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Book Selector */}
          <BookSelector
            title="Vui lòng chọn sách"
            gradeOptions={grades?.data?.content || []}
            subjectOptions={subjects?.data?.content || []}
            bookOptions={books?.data?.content || []}
            selectedGrade={selectedGrade}
            selectedSubject={selectedSubject}
            selectedBook={selectedBook}
            onGradeChange={setSelectedGrade}
            onSubjectChange={setSelectedSubject}
            onBookChange={setSelectedBook}
          />

          {/* Lesson Selector */}
          {selectedBook && (
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-calsans">Bài học</h3>
                <p className="text-base font-questrial text-neutral-500">
                  Chọn bài học cụ thể
                </p>
              </div>

              <div className="max-w-md">
                <Select
                  value={selectedLesson}
                  onValueChange={setSelectedLesson}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLessons.map((lesson: any) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {allLessons.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Không có bài học nào cho sách này
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6  border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );
};
