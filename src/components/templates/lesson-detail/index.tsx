"use client";

import React from "react";
import {
  BreadcrumbTrail,
  type BreadcrumbItem,
} from "@/components/ui/BreadcrumbTrail";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, BookOpen, Clock, User, Calendar } from "lucide-react";
import Image from "next/image";

interface LessonDetailProps {
  lesson: any;
  selectedGrade?: any;
  selectedSubject?: any;
  selectedBook?: any;
  onBack: () => void;
  onBackToGrades: () => void;
  onBackToSubjects: () => void;
  onBackToBooks: () => void;
  onBackToLessons: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({
  lesson,
  selectedGrade,
  selectedSubject,
  selectedBook,
  onBack,
  onBackToGrades,
  onBackToSubjects,
  onBackToBooks,
  onBackToLessons,
}) => {
  // Generate breadcrumbs for lesson detail view
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Khối lớp",
        onClick: onBackToGrades,
      },
    ];

    if (selectedGrade) {
      breadcrumbs.push({
        label: `Khối ${selectedGrade.name}`,
        onClick: onBackToGrades,
      });
    }

    if (selectedSubject) {
      breadcrumbs.push({
        label: `Môn ${selectedSubject.name}`,
        onClick: onBackToSubjects,
      });
    }

    if (selectedBook) {
      breadcrumbs.push({
        label: selectedBook.name,
        onClick: onBackToBooks,
      });
    }

    // Add lessons breadcrumb
    breadcrumbs.push({
      label: "Danh sách bài học",
      onClick: onBackToLessons,
    });

    // Add current lesson breadcrumb
    breadcrumbs.push({
      label: lesson.name,
      active: true,
    });

    return breadcrumbs;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <BreadcrumbTrail items={getBreadcrumbs()} />
      </div>

      {/* Lesson Header */}
      <div>
        <div className="flex items-start gap-4">
          <div className="flex flex-col justify-end items-start">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lesson.name}
            </h1>
            <p>{lesson.createdAt}</p>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Nội dung bài
        </h2>
        <div className="flex justify-start items-end gap-2">
          <div>
            <img src={"/images/files/PDF.svg"} alt="Document icon" />
          </div>
          <p className="text-blue-500">link sách</p>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
