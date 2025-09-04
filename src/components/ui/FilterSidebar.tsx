"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { QuestionBankFilterParams } from "@/services/questionBankServices";

interface FilterSidebarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterParams: QuestionBankFilterParams;
  onQuestionTypeChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onLessonChange: (value: string) => void;
  onClearFilters: () => void;
  lessonsData?: any;
  lessonId?: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchValue,
  onSearchChange,
  filterParams,
  onQuestionTypeChange,
  onDifficultyChange,
  onLessonChange,
  onClearFilters,
  lessonsData,
  lessonId,
}) => {
  const questionTypeOptions = [
    { value: "PART_I", label: "Phần 1" },
    { value: "PART_II", label: "Phần 2" },
    { value: "PART_III", label: "Phần 3" },
  ];

  const difficultyLevelOptions = [
    { value: "KNOWLEDGE", label: "Biết" },
    { value: "COMPREHENSION", label: "Hiểu" },
    { value: "APPLICATION", label: "Vận dụng" },
    
  ];

  const hasActiveFilters = 
    filterParams.questionTypes?.length ||
    filterParams.difficultyLevels?.length ||
    searchValue.trim() ||
    (filterParams.lessonId && filterParams.lessonId !== lessonId);

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-600 font-medium">
                {(filterParams.questionTypes?.length || 0) +
                  (filterParams.difficultyLevels?.length || 0) +
                  (filterParams.lessonId && filterParams.lessonId !== lessonId ? 1 : 0)}{" "}
                bộ lọc đang hoạt động
              </span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Nhập từ khóa..."
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onSearchChange(e.target.value)
                }
                className="pl-10 pr-4 h-10 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Phần thi */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Phần thi
          </label>
          <div className="space-y-2">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 appearance-none"
              value={filterParams.questionTypes?.[0] || "all"}
              onChange={(e) => onQuestionTypeChange(e.target.value)}
            >
              <option value="all">Tất cả phần</option>
              {questionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Độ khó */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Độ khó
          </label>
          <div className="space-y-2">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 appearance-none"
              value={filterParams.difficultyLevels?.[0] || "all"}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <option value="all">Tất cả mức độ</option>
              {difficultyLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bài học */}
        {/* <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Bài học
          </label>
          <div className="space-y-2">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-200 appearance-none"
              value={filterParams.lessonId || "all"}
              onChange={(e) => onLessonChange(e.target.value)}
            >
              <option value="all">Tất cả bài</option>
              {lessonsData?.data?.content?.map((lesson: any) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
                </option>
              ))}
            </select>
          </div>
        </div> */}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
