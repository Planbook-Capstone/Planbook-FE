"use client";

import CurriculumList from "@/components/organisms/curriculum";

import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBookActiveBySubjectService } from "@/services/bookServices";
import { useState, useEffect } from "react";
import BookSelector from "@/components/molecules/book-selector";
import { useHeader } from "@/contexts/HeaderContext";

interface SelectLessonProps {
  onLessonSelect: (lessonId: string) => void;
  title?: string;
}

function SelectLesson({
  onLessonSelect,
  title = "Chọn bài học",
}: SelectLessonProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");

  // Header context to clear previous state
  const { setBreadcrumbs, setActions, setHideDefaultHeader } = useHeader();

  // Clear header state when component mounts (when returning to lesson selection)
  useEffect(() => {
    setBreadcrumbs([]);
    setActions([]);
    setHideDefaultHeader(false);
  }, [setBreadcrumbs, setActions, setHideDefaultHeader]);

  // API calls
  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(selectedGrade, {
    enabled: !!selectedGrade, // Only call when grade is selected
  });
  const { data: books } = useBookActiveBySubjectService(
    selectedSubject,
    "ACTIVE",
    {
      enabled: !!selectedSubject, // Only call when subject is selected
    }
  );

  // Handle grade selection
  const handleGradeChange = (value: string) => {
    setSelectedGrade(value);
    // Reset dependent selections
    setSelectedSubject("");
    setSelectedBook("");
  };

  // Handle subject selection
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    // Reset dependent selections
    setSelectedBook("");
  };

  // Handle book selection
  const handleBookChange = (value: string) => {
    setSelectedBook(value);
  };

  // Handle lesson selection
  const handleLessonSelectInternal = (lessonId: string) => {
    onLessonSelect(lessonId);
  };

  return (
    <div className="space-y-6">
      <BookSelector
        title={title}
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

      {/* CurriculumList với callback để handle lesson selection */}
      <CurriculumList
        bookId={selectedBook}
        onLessonSelect={handleLessonSelectInternal}
      />
    </div>
  );
}

export default SelectLesson;
