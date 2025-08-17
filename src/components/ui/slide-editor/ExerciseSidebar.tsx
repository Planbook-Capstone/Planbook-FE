"use client";

import React, { useState } from "react";
import { BookOpen, FileText, Plus } from "lucide-react";
import { ExerciseQuestionBankModal } from "./ExerciseQuestionBankModal";

interface ExerciseSidebarProps {
  onAddExerciseSlides: (questions: any[]) => void;
}

export default function ExerciseSidebar({
  onAddExerciseSlides,
}: ExerciseSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectQuestions = (questions: any[]) => {
    onAddExerciseSlides(questions);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-64 bg-white border-r border-gray-200 p-4 h-full overflow-y-auto">
        <div className="space-y-4">
          <div className="">
            <h3 className="text-lg font-calsans text-gray-800 mb-2">Bài tập</h3>
            <p className="text-sm text-gray-600 mb-4">
              Thêm câu hỏi từ ngân hàng đề thi vào slide
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleOpenModal}
              className="w-full flex items-center gap-3 p-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-sky-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookOpen size={20} className="text-sky-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-sky-800">Ngân hàng câu hỏi</h4>
                <p className="text-sm text-sky-600">
                  Chọn câu hỏi từ ngân hàng đề thi
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <ExerciseQuestionBankModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectQuestions={handleSelectQuestions}
      />
    </>
  );
}
