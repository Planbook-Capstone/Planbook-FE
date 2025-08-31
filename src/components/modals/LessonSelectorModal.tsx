"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBookActiveBySubjectService, useBooksBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { LessonResponse } from "@/types";

interface LessonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedLessonIds: number[]) => void;
  title?: string;
  selectedLessonIds?: number[];
}

export const LessonSelectorModal: React.FC<LessonSelectorModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Chọn bài học",
  selectedLessonIds = [],
}) => {
  // State cho chọn sách
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tempSelectedLessonIds, setTempSelectedLessonIds] = useState<number[]>(selectedLessonIds);

  // Lấy data động từ API
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade,
  });
  const { data: books } = useBookActiveBySubjectService(
    selectedSubject,
    "ACTIVE",
    {
      enabled: !!selectedSubject, // Only call when subject is selected
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
    .filter((lesson: LessonResponse) => lesson && lesson.id && lesson.name);

  // Filter lessons based on search term
  const filteredLessons = allLessons.filter((lesson: LessonResponse) =>
    lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = () => {
    onConfirm(tempSelectedLessonIds);
    handleClose();
  };

  const handleClose = () => {
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedBook("");
    setSearchTerm("");
    setTempSelectedLessonIds(selectedLessonIds);
    onClose();
  };

  const handleLessonToggle = (lessonId: number) => {
    setTempSelectedLessonIds(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleSelectAll = () => {
    if (tempSelectedLessonIds.length === filteredLessons.length) {
      setTempSelectedLessonIds([]);
    } else {
      setTempSelectedLessonIds(filteredLessons.map(lesson => Number(lesson.id)));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Book Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Khối lớp</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khối lớp" />
                </SelectTrigger>
                <SelectContent>
                  {grades?.data?.content?.map((grade: any) => (
                    <SelectItem key={grade.id} value={grade.id.toString()}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select 
                value={selectedSubject} 
                onValueChange={setSelectedSubject}
                disabled={!selectedGrade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.data?.content?.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sách giáo khoa</Label>
              <Select 
                value={selectedBook} 
                onValueChange={setSelectedBook}
                disabled={!selectedSubject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn sách" />
                </SelectTrigger>
                <SelectContent>
                  {books?.data?.content?.map((book: any) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search and Lesson List */}
          {selectedBook && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm bài học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Select All */}
              {filteredLessons.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={tempSelectedLessonIds.length === filteredLessons.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label>Chọn tất cả ({filteredLessons.length} bài học)</Label>
                </div>
              )}

              {/* Lesson List */}
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
                {filteredLessons.length > 0 ? (
                  filteredLessons.map((lesson: LessonResponse) => (
                    <div key={lesson.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        checked={tempSelectedLessonIds.includes(Number(lesson.id))}
                        onCheckedChange={() => handleLessonToggle(Number(lesson.id))}
                      />
                      <Label className="flex-1 cursor-pointer">
                        {lesson.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    {selectedBook ? "Không có bài học nào" : "Vui lòng chọn sách giáo khoa"}
                  </p>
                )}
              </div>

              {/* Selected Count */}
              {tempSelectedLessonIds.length > 0 && (
                <p className="text-sm text-blue-600">
                  Đã chọn: {tempSelectedLessonIds.length} bài học
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={tempSelectedLessonIds.length === 0}
          >
            Xác nhận ({tempSelectedLessonIds.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
