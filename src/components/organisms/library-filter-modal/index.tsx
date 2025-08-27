"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ShoppingCart,
  X,
  RotateCcw,
  Package,
  BookOpenCheck,
} from "lucide-react";
import BookSelector from "@/components/molecules/book-selector";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBookActiveBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

export interface FilterData {
  gradeId?: string;
  subjectId?: string;
  bookId?: string;
  lessonIds: string[];
}

export default function LibraryFilterModal({
  isOpen,
  onClose,
  onApplyFilter,
  initialFilters,
}: FilterModalProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [showSelectedLessons, setShowSelectedLessons] = useState(false);

  // API calls
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBookActiveBySubjectService(
    selectedSubject,
    "ACTIVE",
    {
      enabled: !!selectedSubject,
    }
  );
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

  // Initialize with existing filters
  useEffect(() => {
    if (initialFilters) {
      setSelectedGrade(initialFilters.gradeId || "");
      setSelectedSubject(initialFilters.subjectId || "");
      setSelectedBook(initialFilters.bookId || "");
      setSelectedLessons(initialFilters.lessonIds || []);
    }
  }, [initialFilters]);

  // Handle grade selection
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedLessons([]);
  };

  // Handle subject selection
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedBook("");
    setSelectedLessons([]);
  };

  // Handle book selection
  const handleBookChange = (value: string) => {
    setSelectedBook(value);
    setSelectedLessons([]);
  };

  // Handle lesson selection
  const handleLessonToggle = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  // Handle remove lesson from selected list
  const handleRemoveLesson = (lessonId: string) => {
    setSelectedLessons((prev) => prev.filter((id) => id !== lessonId));
  };

  // Handle reset
  const handleReset = () => {
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedLessons([]);
  };

  // Handle apply filter
  const handleApplyFilter = () => {
    const filterData: FilterData = {
      gradeId: selectedGrade,
      subjectId: selectedSubject,
      bookId: selectedBook,
      lessonIds: selectedLessons,
    };
    onApplyFilter(filterData);
    onClose();
  };

  // Get selected lesson names for display
  const getSelectedLessonNames = () => {
    if (!allLessons || allLessons.length === 0) return [];
    return allLessons
      .filter((lesson: any) => selectedLessons.includes(lesson.id.toString()))
      .map((lesson: any) => ({ id: lesson.id.toString(), name: lesson.name }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto transition-all duration-300"
        style={{
          width: showSelectedLessons ? "min(95vw, 1280px)" : "min(95vw, 896px)",
          maxWidth: showSelectedLessons ? "1280px" : "896px",
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Bộ lọc tài liệu</span>
            <div className="flex items-center gap-2">
              {selectedLessons.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSelectedLessons(!showSelectedLessons)}
                  className="flex items-center gap-2 -translate-x-10"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  Đã chọn ({selectedLessons.length})
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`flex ${
            showSelectedLessons ? "flex-col lg:flex-row" : "flex-col"
          } gap-6`}
        >
          {/* Main Filter Section */}
          <div
            className={`${
              showSelectedLessons ? "lg:min-w-[500px] lg:flex-1" : "flex-1"
            } space-y-6`}
          >
            <BookSelector
              title="Chọn khối, môn, sách"
              gradeOptions={grades?.data?.content || []}
              subjectOptions={subjects?.data?.content || []}
              bookOptions={books?.data?.content || []}
              selectedGrade={selectedGrade}
              selectedSubject={selectedSubject}
              selectedBook={selectedBook}
              onGradeChange={handleGradeChange}
              onSubjectChange={handleSubjectChange}
              onBookChange={handleBookChange}
            />

            {/* Lessons List */}
            {selectedBook && allLessons && allLessons.length > 0 && (
              <div>
                <h3 className="text-lg font-calsans mb-3">Chọn bài học</h3>
                <div className="h-48 lg:h-64 border rounded-md p-4 overflow-y-auto">
                  <div className="space-y-2">
                    {allLessons.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={lesson.id.toString()}
                          checked={selectedLessons.includes(
                            lesson.id.toString()
                          )}
                          onCheckedChange={() =>
                            handleLessonToggle(lesson.id.toString())
                          }
                        />
                        <label
                          htmlFor={lesson.id.toString()}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {lesson.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Lessons Sidebar */}
          {showSelectedLessons && selectedLessons.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0 lg:border-l lg:pl-6 border-t lg:border-t-0 pt-6 lg:pt-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-calsans">Bài đã chọn</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSelectedLessons(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {getSelectedLessonNames().map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm flex-1 mr-2 break-words">
                      {lesson.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLesson(lesson.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Đặt lại
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleApplyFilter}>
              Xác nhận lọc{" "}
              {selectedLessons.length > 0 && `(${selectedLessons.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
