"use client";

import { useState } from "react";
import FolderCard from "@/components/molecules/folder-card";
import { useGradesService } from "@/services/gradeServices";
import { useSubjectsByGradeService } from "@/services/subjectServices";
import { useBooksBySubjectService } from "@/services/bookServices";
import { useChaptersByBookService } from "@/services/chapterServices";
import { useLessonsByChaptersService } from "@/services/lessonServices";
import { Home } from "lucide-react";
import Image from "next/image";
import { BreadcrumbTrail, type BreadcrumbItem } from "@/components/ui/BreadcrumbTrail";
import LessonDetail from "@/components/templates/lesson-detail";

function TextbookManagementPage() {
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [currentView, setCurrentView] = useState<
    "grades" | "subjects" | "books" | "lessons" | "lesson-detail"
  >("grades");

  const { data: grades } = useGradesService();
  const { data: subjects } = useSubjectsByGradeService(
    selectedGrade?.id || "",
    {
      enabled: !!selectedGrade,
    }
  );
  const { data: books } = useBooksBySubjectService(selectedSubject?.id || "", {
    enabled: !!selectedSubject,
  });

  // Get chapters by selected book
  const { data: chaptersResponse } = useChaptersByBookService(selectedBook?.id || "", {
    enabled: !!selectedBook,
  });
  const chapters = chaptersResponse?.data?.content || [];

  // Get lessons by all chapter IDs
  const lessonQueries = useLessonsByChaptersService(
    chapters.map((ch: any) => ch.id)
  );

  // Flatten all lessons from all chapters
  const allLessons = lessonQueries
    .filter(query => query.data?.data?.content)
    .flatMap(query => query.data.data.content);

  // Generate breadcrumbs based on current view and selections
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    // Don't show breadcrumbs for lesson detail view as it has its own
    if (currentView === "lesson-detail") {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Khối lớp",
        onClick: handleBackToGrades,
        // beforeIcon: <Home className="w-4 h-4" />,
      },
    ];

    if (selectedGrade) {
      breadcrumbs.push({
        label: `Khối ${selectedGrade.name}`,
        onClick: currentView === "subjects" ? undefined : handleBackToGrades,
        active: currentView === "subjects",
      });
    }

    if (selectedSubject) {
      breadcrumbs.push({
        label: `Môn ${selectedSubject.name}`,
        onClick: currentView === "books" ? undefined : handleBackToSubjects,
        active: currentView === "books",
      });
    }

    if (selectedBook) {
      breadcrumbs.push({
        label: selectedBook.name,
        onClick: currentView === "lessons" ? undefined : handleBackToBooks,
        active: currentView === "lessons",
      });
    }

    return breadcrumbs;
  };

  const handleGradeSelect = (grade: any) => {
    setSelectedGrade(grade);
    setCurrentView("subjects");
  };

  const handleSubjectSelect = (subject: any) => {
    setSelectedSubject(subject);
    setCurrentView("books");
  };

  const handleBookSelect = (book: any) => {
    setSelectedBook(book);
    setCurrentView("lessons");
  };

  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
    setCurrentView("lesson-detail");
  };

  const handleBackToGrades = () => {
    setSelectedGrade(null);
    setSelectedSubject(null);
    setSelectedBook(null);
    setSelectedLesson(null);
    setCurrentView("grades");
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedBook(null);
    setSelectedLesson(null);
    setCurrentView("subjects");
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setSelectedLesson(null);
    setCurrentView("books");
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
    setCurrentView("lessons");
  };

  const renderGrades = () => (
    <div className="space-y-2 flex gap-6 flex-wrap">
      {grades?.data?.content && Array.isArray(grades.data.content) ? (
        grades.data.content.map((grade: any, index: number) => (
          <div key={grade.id} onClick={() => handleGradeSelect(grade)}>
            <FolderCard
              key={index}
              id={grade.id.toString()}
              colorId={"6"}
              title={`Khối ${grade.name}`}
            />
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>Đang tải dữ liệu khối...</p>
        </div>
      )}
    </div>
  );

  const renderSubjects = () => (
    <div className="space-y-6">
      <div className="space-y-2 flex gap-6 flex-wrap">
        {subjects?.data?.content && Array.isArray(subjects.data.content) ? (
          subjects.data.content.map((subject: any, index: number) => (
            <div key={subject.id} onClick={() => handleSubjectSelect(subject)}>
              <FolderCard
                key={index}
                id={subject.id.toString()}
                colorId={"5"}
                title={`Môn ${subject.name}`}
              />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Đang tải dữ liệu môn học...</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBooks = () => (
    <div className="space-y-6">
      <div className="space-y-2 flex gap-6 flex-wrap">
        {books?.data?.content && Array.isArray(books.data.content) ? (
          books.data.content.map((book: any) => (
            <div
              key={book.id}
              onClick={() => handleBookSelect(book)}
              className="group flex flex-col items-center p-4 transition-shadow cursor-pointer "
            >
              <div className="pb-4">
                <Image
                  src="/images/files/BOOK_V2.svg"
                  alt="Book icon"
                  width={64}
                  height={64}
                  className="w-16 h-16 transition-transform duration-200 group-hover:scale-[1.2]"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 max-w-[120px]">
                {book.name}
              </h3>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>Đang tải dữ liệu sách giáo khoa...</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLessons = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-10 gap-4">
        {allLessons && allLessons.length > 0 ? (
          allLessons.map((lesson: any) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className="flex flex-col items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <img src={"/images/files/DOC.svg"} alt="Document icon" />
              <span className="truncate w-full text-center text-sm">
                {lesson.name}
              </span>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center text-gray-500 py-8">
            <p>Đang tải dữ liệu bài học...</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-5">
      {/* Breadcrumb Navigation - Only show for non-lesson-detail views */}
      {currentView !== "lesson-detail" && (
        <div className="mb-6">
          <BreadcrumbTrail items={getBreadcrumbs()} />
        </div>
      )}

      {currentView === "grades" && renderGrades()}
      {currentView === "subjects" && renderSubjects()}
      {currentView === "books" && renderBooks()}
      {currentView === "lessons" && renderLessons()}
      {currentView === "lesson-detail" && selectedLesson && (
        <LessonDetail
          lesson={selectedLesson}
          selectedGrade={selectedGrade}
          selectedSubject={selectedSubject}
          selectedBook={selectedBook}
          onBack={handleBackToLessons}
          onBackToGrades={handleBackToGrades}
          onBackToSubjects={handleBackToSubjects}
          onBackToBooks={handleBackToBooks}
          onBackToLessons={handleBackToLessons}
        />
      )}
    </div>
  );
}

export default TextbookManagementPage;
