"use client";

import React from "react";
import {
  BreadcrumbTrail,
  type BreadcrumbItem,
} from "@/components/ui/BreadcrumbTrail";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, BookOpen, Clock, User, Calendar } from "lucide-react";

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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lesson.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {lesson.description && (
                <div className="flex items-center gap-1">
                  <span>{lesson.description}</span>
                </div>
              )}
              {lesson.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration} phút</span>
                </div>
              )}
              {lesson.createdBy && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Tạo bởi: {lesson.createdBy}</span>
                </div>
              )}
              {lesson.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(lesson.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Nội dung bài học
        </h2>

        {lesson.content ? (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>Chưa có nội dung bài học</p>
          </div>
        )}
      </div>

      {/* Lesson Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Mục tiêu bài học
          </h2>
          <ul className="space-y-2">
            {lesson.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-gray-700">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lesson Materials */}
        {lesson.materials && lesson.materials.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tài liệu tham khảo
            </h3>
            <ul className="space-y-2">
              {lesson.materials.map((material: any, index: number) => (
                <li key={index} className="text-blue-600 hover:text-blue-800">
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {material.name || material.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetail;
