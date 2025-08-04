"use client";

import React, { useState } from "react";
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
import { useLessonsByChapterService } from "@/services/lessonServices";
import { 
  GradeResponse, 
  SubjectResponse, 
  BookResponse, 
  ChapterResponse, 
  LessonResponse 
} from "@/types";

interface LessonSelectorProps {
  value?: string;
  onValueChange: (lessonId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Chọn bài học",
  disabled = false,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");

  // API calls
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
  const { data: lessonsResponse } = useLessonsByChapterService(selectedChapter, {
    enabled: !!selectedChapter,
  });

  const chapters = chaptersResponse?.data?.content || [];
  const lessons = lessonsResponse?.data?.content || [];

  // Reset dependent selections when parent changes
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedSubject("");
    setSelectedBook("");
    setSelectedChapter("");
    onValueChange("");
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setSelectedBook("");
    setSelectedChapter("");
    onValueChange("");
  };

  const handleBookChange = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter("");
    onValueChange("");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapter(chapterId);
    onValueChange("");
  };

  const handleLessonChange = (lessonId: string) => {
    onValueChange(lessonId);
  };



  return (
    <div className="space-y-4">
      {/* Grade Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Khối học <span className="text-red-500">*</span>
        </label>
        <Select value={selectedGrade} onValueChange={handleGradeChange} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn khối học" />
          </SelectTrigger>
          <SelectContent>
            {grades?.data?.content?.map((grade: GradeResponse) => (
              <SelectItem key={grade.id.toString()} value={grade.id.toString()}>
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Môn học <span className="text-red-500">*</span>
        </label>
        <Select 
          value={selectedSubject} 
          onValueChange={handleSubjectChange} 
          disabled={disabled || !selectedGrade}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedGrade ? "Chọn môn học" : "Chọn khối học trước"} />
          </SelectTrigger>
          <SelectContent>
            {subjects?.data?.content?.map((subject: SubjectResponse) => (
              <SelectItem key={subject.id.toString()} value={subject.id.toString()}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Book Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Sách <span className="text-red-500">*</span>
        </label>
        <Select 
          value={selectedBook} 
          onValueChange={handleBookChange} 
          disabled={disabled || !selectedSubject}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedSubject ? "Chọn sách" : "Chọn môn học trước"} />
          </SelectTrigger>
          <SelectContent>
            {books?.data?.content?.map((book: BookResponse) => (
              <SelectItem key={book.id.toString()} value={book.id.toString()}>
                {book.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chapter Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Chương <span className="text-red-500">*</span>
        </label>
        <Select 
          value={selectedChapter} 
          onValueChange={handleChapterChange} 
          disabled={disabled || !selectedBook}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedBook ? "Chọn chương" : "Chọn sách trước"} />
          </SelectTrigger>
          <SelectContent>
            {chapters.map((chapter: ChapterResponse) => (
              <SelectItem key={chapter.id.toString()} value={chapter.id.toString()}>
                {chapter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lesson Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Bài học <span className="text-red-500">*</span>
        </label>
        <Select 
          value={value || ""} 
          onValueChange={handleLessonChange} 
          disabled={disabled || !selectedChapter}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedChapter ? placeholder : "Chọn chương trước"} />
          </SelectTrigger>
          <SelectContent>
            {lessons.map((lesson: LessonResponse) => (
              <SelectItem key={lesson.id.toString()} value={lesson.id.toString()}>
                {lesson.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LessonSelector;
