

"use client";

import CurriculumList from "@/components/organisms/curriculum";
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
import { GradeResponse, SubjectResponse, BookResponse } from "@/types";
import { useState } from "react";

interface SelectLessonProps {
  onLessonSelect: (lessonId: string) => void;
  title?: string;
}

function SelectLesson({ onLessonSelect, title = "Chọn bài học" }: SelectLessonProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");

  // API calls
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade, // Only call when grade is selected
  });
  const { data: books } = useBooksBySubjectService(selectedSubject, {
    enabled: !!selectedSubject, // Only call when subject is selected
  });

  // Handle grade selection
  const handleGradeChange = (value: string) => {
    console.log("Selected grade:", value);
    setSelectedGrade(value);
    // Reset dependent selections
    setSelectedSubject("");
    setSelectedBook("");
  };

  // Handle subject selection
  const handleSubjectChange = (value: string) => {
    console.log("Selected subject:", value);
    setSelectedSubject(value);
    // Reset dependent selections
    setSelectedBook("");
  };

  // Handle book selection
  const handleBookChange = (value: string) => {
    console.log("Selected book:", value);
    setSelectedBook(value);
  };

  // Handle lesson selection
  const handleLessonSelectInternal = (lessonId: string) => {
    console.log("Selected lesson:", lessonId);
    onLessonSelect(lessonId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-calsans">{title}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="flex-col w-full">
          <p className="text-sm font-bold">Khối học</p>
          <Select value={selectedGrade} onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent>
              {grades?.data?.content?.map((grade: GradeResponse) => (
                <SelectItem key={grade.id} value={grade.id.toString()}>
                  {grade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-col w-full">
          <p className="text-sm font-bold">Môn học</p>
          <Select
            value={selectedSubject}
            onValueChange={handleSubjectChange}
            disabled={!selectedGrade}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={selectedGrade ? "Chọn môn học" : "Chọn lớp trước"}
              />
            </SelectTrigger>
            <SelectContent>
              {subjects?.data?.content?.map((subject: SubjectResponse) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-col w-full col-span-2 lg:col-span-1">
          <p className="text-sm font-bold">Sách</p>
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
              {books?.data?.content?.map((book: BookResponse) => (
                <SelectItem key={book.id} value={book.id.toString()}>
                  {book.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CurriculumList với callback để handle lesson selection */}
      <CurriculumList
        bookId={selectedBook}
        onLessonSelect={handleLessonSelectInternal}
      />
    </div>
  );
}

export default SelectLesson;
